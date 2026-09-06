#!/usr/bin/env python3
"""nanobanana — command line image generation with Google's Nano Banana models.

Entry point is the `bin/nanobanana` launcher, which bootstraps the venv.
"""
import argparse
import io
import logging
import os
import re
import subprocess
import sys
import time
from pathlib import Path

CONFIG_PATH = Path.home() / ".config" / "nanobanana" / "config"

MODELS = {
    "flash": "gemini-2.5-flash-image",
    "pro": "gemini-3-pro-image-preview",
}
MODEL_ALIASES = {
    "nano-banana": "flash",
    "nanobanana": "flash",
    "2.5": "flash",
    "nano-banana-pro": "pro",
    "nanobananapro": "pro",
    "3": "pro",
}

ASPECTS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"]
SIZES = ["1K", "2K", "4K"]

# image_size is a Nano Banana Pro capability; flash only honours aspect_ratio.
SIZE_CAPABLE = {"pro"}


class Fail(Exception):
    pass


# ---------------------------------------------------------------- api key ----

def read_config():
    if not CONFIG_PATH.exists():
        return {}
    out = {}
    for line in CONFIG_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip("'\"")
    return out


def resolve_key():
    for var in ("GEMINI_API_KEY", "GOOGLE_API_KEY"):
        if os.environ.get(var):
            return os.environ[var]
    cfg = read_config()
    for var in ("GEMINI_API_KEY", "GOOGLE_API_KEY"):
        if cfg.get(var):
            return cfg[var]
    raise Fail(
        "No API key found.\n"
        "  Get one at https://aistudio.google.com/apikey then either:\n"
        "    nanobanana --set-key YOUR_KEY      (saved to ~/.config/nanobanana/config)\n"
        "    export GEMINI_API_KEY=YOUR_KEY"
    )


def set_key(key):
    CONFIG_PATH.parent.mkdir(parents=True, exist_ok=True)
    CONFIG_PATH.write_text(f"GEMINI_API_KEY={key}\n")
    CONFIG_PATH.chmod(0o600)
    print(f"Saved API key to {CONFIG_PATH}")


# ----------------------------------------------------------------- naming ----

def slugify(text, words=6):
    parts = re.findall(r"[a-z0-9]+", text.lower())[:words]
    return "-".join(parts) or "image"


def plan_outputs(args, prompt):
    """Return a list of output paths, one per requested image."""
    if args.output:
        base = Path(args.output)
        if args.count == 1:
            paths = [base]
        else:
            stem, suffix = base.stem, base.suffix or ".png"
            paths = [base.with_name(f"{stem}-{i}{suffix}") for i in range(1, args.count + 1)]
    else:
        outdir = Path(args.outdir) if args.outdir else Path.cwd()
        slug = slugify(prompt)
        stamp = time.strftime("%Y%m%d-%H%M%S")
        if args.count == 1:
            paths = [outdir / f"{slug}-{stamp}.png"]
        else:
            paths = [outdir / f"{slug}-{stamp}-{i}.png" for i in range(1, args.count + 1)]
    return [p if p.suffix else p.with_suffix(".png") for p in paths]


# ------------------------------------------------------------ generation ----

def build_config(types, args, model_key):
    kwargs = {"aspect_ratio": args.aspect} if args.aspect else {}
    if args.size:
        if model_key in SIZE_CAPABLE:
            kwargs["image_size"] = args.size
        else:
            warn(f"--size is ignored by the {model_key} model; using its default resolution")
    image_config = types.ImageConfig(**kwargs) if kwargs else None
    return types.GenerateContentConfig(
        response_modalities=["Text", "Image"],
        image_config=image_config,
    )


def extract_image(response):
    """Pull (image_bytes, model_text) out of a generate_content response."""
    text_parts, image_bytes = [], None
    candidates = getattr(response, "candidates", None) or []
    if not candidates:
        raise Fail(f"Model returned no candidates (feedback: {getattr(response, 'prompt_feedback', None)})")
    content = candidates[0].content
    for part in (getattr(content, "parts", None) or []):
        if getattr(part, "text", None):
            text_parts.append(part.text)
        inline = getattr(part, "inline_data", None)
        if inline is not None and inline.data and image_bytes is None:
            raw = inline.data
            if isinstance(raw, str):
                import base64
                raw = base64.b64decode(raw)
            image_bytes = raw
    return image_bytes, "\n".join(text_parts).strip()


def generate_one(client, types, model_id, contents, config):
    try:
        return client.models.generate_content(model=model_id, contents=contents, config=config)
    except Exception as exc:  # noqa: BLE001 - surface the API message verbatim
        msg = str(exc)
        # Older/limited model revisions reject image_config outright — retry bare
        # rather than failing the whole run.
        if config.image_config is not None and ("image_config" in msg or "aspect_ratio" in msg or "image_size" in msg):
            warn("model rejected the size/aspect options; retrying without them")
            bare = types.GenerateContentConfig(response_modalities=["Text", "Image"])
            return client.models.generate_content(model=model_id, contents=contents, config=bare)
        if "API_KEY_INVALID" in msg:
            raise Fail(
                "the API key was rejected — check it at https://aistudio.google.com/apikey "
                "then re-run: nanobanana --set-key YOUR_KEY"
            ) from exc
        if "RESOURCE_EXHAUSTED" in msg or "429" in msg[:4]:
            raise Fail("rate limited or out of quota for this key — wait and retry, or try -m flash") from exc
        raise Fail(f"generation failed: {msg}") from exc


# ------------------------------------------------------- post-processing ----

def make_transparent(path, tolerance):
    """Knock out a flat background by sampling the image's border colour.

    Mirrors the workflow in IMAGE-GENERATION-GUIDE.md: generate on a solid
    background, then drop it for use on the site.
    """
    from PIL import Image
    import numpy as np

    data = np.array(Image.open(path).convert("RGBA"))
    samples = [data[::10, 0, :3], data[::10, -1, :3], data[0, ::10, :3], data[-1, ::10, :3]]
    bg = np.median(np.concatenate(samples), axis=0)
    diff = np.sqrt(np.sum((data[:, :, :3].astype(float) - bg) ** 2, axis=2))
    data[diff < tolerance, 3] = 0
    data[:, :5, 3] = 0
    data[:, -5:, 3] = 0
    data[:5, :, 3] = 0
    data[-5:, :, 3] = 0
    Image.fromarray(data).save(path, "PNG")


# -------------------------------------------------------------------- cli ----

def warn(msg):
    print(f"nanobanana: {msg}", file=sys.stderr)


def build_parser():
    p = argparse.ArgumentParser(
        prog="nanobanana",
        description="Generate images with Google's Nano Banana (Gemini image) models.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""examples:
  nanobanana "a lime green paper-cut robot on a dark background"
  nanobanana "same robot, wearing a party hat" -r robot.png -o party.png
  nanobanana "abstract brand banner" -a 16:9 -s 4K -o assets/banner.png
  nanobanana "logo mark, solid dark background" --transparent -o logo.png
  nanobanana "four cover options" -n 4 --outdir covers/
  cat prompt.txt | nanobanana -

models:
  pro    gemini-3-pro-image-preview  (Nano Banana Pro, default; supports --size)
  flash  gemini-2.5-flash-image      (Nano Banana, faster and cheaper)
""",
    )
    p.add_argument("prompt", nargs="?", help="what to generate; use '-' to read the prompt from stdin")
    p.add_argument("-o", "--output", help="output file path (default: auto-named PNG in the current directory)")
    p.add_argument("-d", "--outdir", help="directory for auto-named output (ignored when --output is given)")
    p.add_argument("-r", "--ref", action="append", default=[], metavar="IMAGE",
                   help="reference image for style/subject guidance; repeat for multiple")
    p.add_argument("-m", "--model", default="pro", help="pro or flash (default: pro)")
    p.add_argument("-a", "--aspect", choices=ASPECTS, help="aspect ratio, e.g. 16:9")
    p.add_argument("-s", "--size", choices=SIZES, type=str.upper, help="resolution, pro model only")
    p.add_argument("-n", "--count", type=int, default=1, metavar="N", help="number of images to generate (default: 1)")
    p.add_argument("--transparent", action="store_true", help="remove the flat background after generating")
    p.add_argument("--tolerance", type=int, default=40, help="colour tolerance for --transparent (default: 40)")
    p.add_argument("--open", action="store_true", help="open the generated image(s) when done")
    p.add_argument("-q", "--quiet", action="store_true", help="only print output paths")
    p.add_argument("--set-key", metavar="KEY", help="save a Gemini API key to ~/.config/nanobanana/config and exit")
    return p


def main():
    args = build_parser().parse_args()

    if args.set_key:
        set_key(args.set_key)
        return 0

    prompt = args.prompt
    if prompt == "-":
        prompt = sys.stdin.read().strip()
    if not prompt:
        build_parser().print_usage(sys.stderr)
        raise Fail("a prompt is required (pass it as an argument, or '-' to read stdin)")
    if args.count < 1:
        raise Fail("--count must be at least 1")

    model_key = MODEL_ALIASES.get(args.model.lower(), args.model.lower())
    if model_key not in MODELS:
        raise Fail(f"unknown model '{args.model}'; choose from: {', '.join(MODELS)}")
    model_id = MODELS[model_key]

    api_key = resolve_key()

    # The SDK logs an automatic-function-calling advisory on every image call.
    logging.getLogger("google_genai").setLevel(logging.ERROR)

    from google import genai
    from google.genai import types
    from PIL import Image

    contents = [prompt]
    for ref in args.ref:
        ref_path = Path(ref)
        if not ref_path.exists():
            raise Fail(f"reference image not found: {ref}")
        contents.append(Image.open(ref_path))

    outputs = plan_outputs(args, prompt)
    for path in outputs:
        path.parent.mkdir(parents=True, exist_ok=True)

    client = genai.Client(api_key=api_key)
    config = build_config(types, args, model_key)

    log = (lambda *a: None) if args.quiet else (lambda *a: print(*a, file=sys.stderr))
    log(f"model: {model_id}" + (f"  refs: {len(args.ref)}" if args.ref else ""))

    written = []
    for i, path in enumerate(outputs, 1):
        if len(outputs) > 1:
            log(f"[{i}/{len(outputs)}] generating…")
        response = generate_one(client, types, model_id, contents, config)
        image_bytes, text = extract_image(response)
        if text:
            log(f"  model: {text}")
        if image_bytes is None:
            raise Fail("the model returned no image (it may have refused the prompt)")
        Image.open(io.BytesIO(image_bytes)).save(path)
        if args.transparent:
            make_transparent(path, args.tolerance)
        written.append(path)
        print(path)

    if args.open and written:
        opener = "open" if sys.platform == "darwin" else "xdg-open"
        subprocess.run([opener, *[str(p) for p in written]], check=False)
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Fail as err:
        print(f"nanobanana: {err}", file=sys.stderr)
        sys.exit(1)
    except KeyboardInterrupt:
        sys.exit(130)
