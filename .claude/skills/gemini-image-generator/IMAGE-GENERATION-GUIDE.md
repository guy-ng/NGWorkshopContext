# Image Generation Guide for NG Workshop

## Brand Style
- **Style**: Paper cut layered art with depth shadows
- **Primary Color**: Lime green `#8BC23C`
- **Secondary Colors**: White paper edges, various green shades
- **Background**: Transparent (to match site background `#0a0a0f`)

## Prerequisites

1. Set up the virtual environment (first time only):
```bash
cd .claude/skills/gemini-image-generator/scripts
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
./venv/bin/pip install numpy
```

2. Set your Gemini API key:
```bash
export GEMINI_API_KEY="AIzaSyChI1rT6A_FV9wNWhYMTOxvcw4SnM2cgu0"
```

## Step 1: Generate the Image

### Banner Style Prompt Template
```
Paper cut layered art style illustration, [MAIN SUBJECT] in center,
surrounded by business icons: [ICON LIST],
all elements fully visible and contained within frame with large padding margins on all sides,
layered paper depth shadows, lime green hex 8BC23C colors with white paper edges,
solid dark background color hex 0a0a0f, centered composition,
nothing cropped or cut off at edges
```

### Example Prompts

**Banner (AI Brain with Business Icons)**:
```bash
./scripts/generate.py --prompt "Paper cut layered art style illustration, AI brain with circuit patterns and gears in center, surrounded by business icons: documents with charts, robot arms, conveyor belt, cloud, network nodes, all elements fully visible and contained within frame with large padding margins on all sides, layered paper depth shadows, lime green hex 8BC23C colors with white paper edges, solid dark background color hex 0a0a0f, centered composition, nothing cropped or cut off at edges" --output "assets/images/banner.png" --size 4K
```

**Service Image (Value Proposition)**:
```bash
./scripts/generate.py --prompt "Paper cut layered art style, AI robot assistant helping with data analysis, charts and graphs floating around, layered paper depth shadows, lime green hex 8BC23C colors with white paper edges, solid dark background hex 0a0a0f, centered with padding" --output "assets/images/service-1.png" --size 4K
```

**Service Image (Services Overview)**:
```bash
./scripts/generate.py --prompt "Paper cut layered art style, mobile phone cloud server and team collaboration icons, connected by flowing lines, layered paper depth shadows, lime green hex 8BC23C colors with white paper edges, solid dark background hex 0a0a0f, centered with padding" --output "assets/images/service-2.png" --size 4K
```

**Service Image (Trust/Quality)**:
```bash
./scripts/generate.py --prompt "Paper cut layered art style, trophy shield badge and checkmark symbols, quality and trust theme, layered paper depth shadows, lime green hex 8BC23C colors with white paper edges, solid dark background hex 0a0a0f, centered with padding" --output "assets/images/service-3.png" --size 4K
```

## Step 2: Make Background Transparent

After generating, run this Python script to remove the background:

```python
from PIL import Image
import numpy as np

img = Image.open('path/to/your/image.png')
img = img.convert('RGBA')
data = np.array(img)

# Get background color from edge samples
bg_samples = []
for y in range(0, data.shape[0], 10):
    bg_samples.append(data[y, 0, :3])
    bg_samples.append(data[y, -1, :3])
for x in range(0, data.shape[1], 10):
    bg_samples.append(data[0, x, :3])
    bg_samples.append(data[-1, x, :3])

bg_color = np.median(bg_samples, axis=0)

# Remove background with tolerance
tolerance = 40
diff = np.sqrt(np.sum((data[:,:,:3].astype(float) - bg_color) ** 2, axis=2))
bg_mask = diff < tolerance
data[bg_mask, 3] = 0

# Clear edges
data[:, :5, 3] = 0
data[:, -5:, 3] = 0
data[:5, :, 3] = 0
data[-5:, :, 3] = 0

result = Image.fromarray(data)
result.save('path/to/your/image.png', 'PNG')
```

### One-liner Command
```bash
cd .claude/skills/gemini-image-generator && ./scripts/venv/bin/python -c "
from PIL import Image
import numpy as np
img = Image.open('IMAGE_PATH')
img = img.convert('RGBA')
data = np.array(img)
bg_samples = []
for y in range(0, data.shape[0], 10):
    bg_samples.append(data[y, 0, :3])
    bg_samples.append(data[y, -1, :3])
for x in range(0, data.shape[1], 10):
    bg_samples.append(data[0, x, :3])
    bg_samples.append(data[-1, x, :3])
bg_color = np.median(bg_samples, axis=0)
tolerance = 40
diff = np.sqrt(np.sum((data[:,:,:3].astype(float) - bg_color) ** 2, axis=2))
data[diff < tolerance, 3] = 0
data[:, :5, 3] = 0
data[:, -5:, 3] = 0
data[:5, :, 3] = 0
data[-5:, :, 3] = 0
Image.fromarray(data).save('IMAGE_PATH', 'PNG')
print('Done')
"
```
Replace `IMAGE_PATH` with your actual image path.

## Alternative Styles Explored

During development, these styles were also generated (saved in `assets/images/banner-options/`):

| Style | Description |
|-------|-------------|
| Watercolor | Soft artistic brush strokes |
| Flat Design | Simple solid shapes, no gradients |
| Gradient Abstract | Smooth flowing gradients |
| Line Art | Elegant single-line drawings |
| Glassmorphism | Frosted glass effect |
| Paper Cut | **SELECTED** - Layered cutout with shadows |
| Geometric | Clean geometric shapes |
| Duotone | Two-color bold style |

## Prompt Tips

1. **Always include**: "lime green hex 8BC23C" for brand color consistency
2. **For transparency**: Generate with dark background, then remove it
3. **For spacing**: Include "large padding margins on all sides" and "centered composition"
4. **Avoid cut-off**: Include "all elements fully visible" and "nothing cropped"
5. **No text**: Include "no text" unless you want labels

## File Locations

- Generated images: `assets/images/`
- Banner options: `assets/images/banner-options/`
- Generator script: `.claude/skills/gemini-image-generator/scripts/generate.py`
