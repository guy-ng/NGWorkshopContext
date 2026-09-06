# nanobanana

CLI for Google's Nano Banana image models.

| alias | model | notes |
|-------|-------|-------|
| `pro` (default) | `gemini-3-pro-image-preview` | Nano Banana Pro — supports `--size 1K/2K/4K` |
| `flash` | `gemini-2.5-flash-image` | Nano Banana — faster, cheaper, aspect ratio only |

## Install

```bash
./tools/nano-banana/install.sh          # venv + symlink into ~/.local/bin
nanobanana --set-key YOUR_KEY           # get one at https://aistudio.google.com/apikey
```

The key is read from `GEMINI_API_KEY`, then `GOOGLE_API_KEY`, then
`~/.config/nanobanana/config` (mode 600).

## Usage

```bash
nanobanana "a lime green paper-cut robot on a dark background"
nanobanana "same robot, wearing a party hat" -r robot.png -o party.png
nanobanana "brand banner" -a 16:9 -s 4K -o assets/images/banner.png
nanobanana "logo mark, solid dark background" --transparent -o logo.png
nanobanana "four cover options" -n 4 --outdir covers/
cat prompt.txt | nanobanana -
```

With no `--output`, files are auto-named `<prompt-slug>-<timestamp>.png` in the
current directory (or `--outdir`). Generated paths go to stdout, progress to
stderr — so `open "$(nanobanana "a cat" -q)"` works.

| flag | meaning |
|------|---------|
| `-o, --output` | explicit output path (`-n` appends `-1`, `-2`, …) |
| `-d, --outdir` | directory for auto-named output |
| `-r, --ref` | reference image; repeat for several |
| `-m, --model` | `pro` or `flash` |
| `-a, --aspect` | `1:1 2:3 3:2 3:4 4:3 4:5 5:4 9:16 16:9 21:9` |
| `-s, --size` | `1K` `2K` `4K` (pro only) |
| `-n, --count` | number of images |
| `--transparent` | knock out the flat background afterwards (`--tolerance`, default 40) |
| `--open` | open the results when done |
| `-q, --quiet` | paths only |

## NG Workshop brand images

Prompt conventions (paper-cut style, lime `#8BC23C`, dark `#0a0a0f`) live in
[.claude/skills/gemini-image-generator/IMAGE-GENERATION-GUIDE.md](../../.claude/skills/gemini-image-generator/IMAGE-GENERATION-GUIDE.md).
`--transparent` replaces that guide's manual background-removal step:

```bash
nanobanana "Paper cut layered art style illustration, AI brain with circuit patterns in center, \
surrounded by business icons, layered paper depth shadows, lime green hex 8BC23C with white paper edges, \
solid dark background hex 0a0a0f, centered composition, large padding, nothing cropped" \
  -a 16:9 -s 4K --transparent -o WebSite2026/assets/images/banner.png
```
