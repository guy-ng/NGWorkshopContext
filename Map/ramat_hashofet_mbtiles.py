#!/usr/bin/env python3
"""Build MBTiles for Ramat Hashofet from KMZ with Google satellite tiles.

Features:
- Google satellite tiles as base layer
- Text labels (Hebrew) for text-named polygons on ALL zoom levels
- Numeric labels shown only at zoom 17-18 (max DJI Pilot 2 zoom-out is ~13)
- Tiles only within Main Area polygon bounding box
"""

import zipfile
import xml.etree.ElementTree as ET
import sqlite3
import math
import io
import time
import re
import requests
from PIL import Image, ImageDraw, ImageFont

try:
    from bidi.algorithm import get_display
    HAS_BIDI = True
except ImportError:
    HAS_BIDI = False

# --- Config ---
KMZ_FILE = "Ramat Hashofet.kmz"
OUTPUT_FILE = "ramat_hashofet.mbtiles"
MIN_ZOOM = 13
MAX_ZOOM = 18
# Numeric polygon names (house numbers) only shown at these zoom levels
NUMERIC_LABEL_MIN_ZOOM = 17  # show numbers at zoom 17 and 18 only
TILE_SIZE = 256
PADDING = 0.003  # degrees padding around Main Area bounds

# Google Maps satellite tiles
TILE_URL = "https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"

# Font for labels - Arial Unicode supports Hebrew glyphs
FONT_PATH = "/Library/Fonts/Arial Unicode.ttf"
FONT_SIZES = {
    13: 12, 14: 14, 15: 16, 16: 18, 17: 20, 18: 22,
}
# Smaller font for numeric labels
NUMERIC_FONT_SIZES = {17: 12, 18: 14}


def kml_color_to_rgb(kml_color):
    """Convert KML AABBGGRR to (R, G, B, A) tuple."""
    if not kml_color or len(kml_color) != 8:
        return (255, 0, 0, 200)
    a = int(kml_color[0:2], 16)
    b = int(kml_color[2:4], 16)
    g = int(kml_color[4:6], 16)
    r = int(kml_color[6:8], 16)
    return (r, g, b, a)


def lat_lon_to_tile(lat, lon, zoom):
    n = 2 ** zoom
    x = int((lon + 180.0) / 360.0 * n)
    lat_rad = math.radians(lat)
    y = int((1.0 - math.log(math.tan(lat_rad) + 1.0 / math.cos(lat_rad)) / math.pi) / 2.0 * n)
    return x, y


def tile_bounds(x, y, zoom):
    n = 2 ** zoom
    lon_min = x / n * 360.0 - 180.0
    lon_max = (x + 1) / n * 360.0 - 180.0
    lat_max = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    lat_min = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + 1) / n))))
    return lat_min, lon_min, lat_max, lon_max


def lat_lon_to_pixel(lat, lon, lat_min, lon_min, lat_max, lon_max):
    px = (lon - lon_min) / (lon_max - lon_min) * TILE_SIZE
    py = (lat_max - lat) / (lat_max - lat_min) * TILE_SIZE
    return px, py


def is_numeric_name(name):
    """Check if name is purely numeric (house numbers etc.)."""
    if not name:
        return True
    return bool(re.match(r'^[\d\s.\-/]+$', name.strip()))


def polygon_centroid(coords):
    """Calculate centroid of polygon coords [(lon, lat), ...]."""
    n = len(coords)
    if n == 0:
        return 0, 0
    cx = sum(lon for lon, lat in coords) / n
    cy = sum(lat for lon, lat in coords) / n
    return cx, cy


def parse_kmz(kmz_path):
    """Parse KMZ and return features with proper KML styles."""
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}

    with zipfile.ZipFile(kmz_path) as z:
        kml = z.read('doc.kml').decode('utf-8')

    root = ET.fromstring(kml)

    # Parse all Style elements
    styles = {}
    for style in root.iter('{http://www.opengis.net/kml/2.2}Style'):
        sid = style.get('id', '')
        line_el = style.find('.//kml:LineStyle/kml:color', ns)
        poly_el = style.find('.//kml:PolyStyle/kml:color', ns)
        line_width_el = style.find('.//kml:LineStyle/kml:width', ns)
        styles[sid] = {
            'line_color': kml_color_to_rgb(line_el.text) if line_el is not None else (0, 0, 0, 255),
            'fill_color': kml_color_to_rgb(poly_el.text) if poly_el is not None else None,
            'line_width': float(line_width_el.text) if line_width_el is not None else 1.0,
        }

    # Parse StyleMaps (normal style references)
    style_map = {}
    for sm in root.iter('{http://www.opengis.net/kml/2.2}StyleMap'):
        sm_id = sm.get('id', '')
        for pair in sm.findall('kml:Pair', ns):
            key = pair.find('kml:key', ns)
            url = pair.find('kml:styleUrl', ns)
            if key is not None and key.text == 'normal' and url is not None:
                ref = url.text.lstrip('#')
                if ref in styles:
                    style_map[sm_id] = styles[ref]

    features = []
    main_area_bounds = None

    for pm in root.iter('{http://www.opengis.net/kml/2.2}Placemark'):
        name_el = pm.find('kml:name', ns)
        name = name_el.text.strip() if name_el is not None and name_el.text else ''

        # Resolve style
        style_info = {'line_color': (0, 0, 0, 255), 'fill_color': None, 'line_width': 1.0}
        style_url = pm.find('kml:styleUrl', ns)
        if style_url is not None:
            ref = style_url.text.lstrip('#')
            if ref in style_map:
                style_info = style_map[ref]
            elif ref in styles:
                style_info = styles[ref]

        # Parse geometry
        poly = pm.find('.//kml:Polygon//kml:coordinates', ns)
        if poly is not None:
            coords = []
            for c in poly.text.strip().split():
                parts = c.split(',')
                coords.append((float(parts[0]), float(parts[1])))

            feat = {
                'type': 'Polygon',
                'coords': coords,
                'name': name,
                'style': style_info,
                'is_numeric': is_numeric_name(name),
            }

            if name == 'Main Area':
                lons = [lon for lon, lat in coords]
                lats = [lat for lon, lat in coords]
                main_area_bounds = (min(lons), min(lats), max(lons), max(lats))

            features.append(feat)
            continue

        point = pm.find('.//kml:Point/kml:coordinates', ns)
        if point is not None:
            parts = point.text.strip().split(',')
            features.append({
                'type': 'Point',
                'coords': [(float(parts[0]), float(parts[1]))],
                'name': name,
                'style': style_info,
                'is_numeric': is_numeric_name(name),
            })
            continue

        line = pm.find('.//kml:LineString/kml:coordinates', ns)
        if line is not None:
            coords = []
            for c in line.text.strip().split():
                parts = c.split(',')
                coords.append((float(parts[0]), float(parts[1])))
            features.append({
                'type': 'LineString',
                'coords': coords,
                'name': name,
                'style': style_info,
                'is_numeric': is_numeric_name(name),
            })

    return features, main_area_bounds


def download_tile(z, x, y, session):
    """Download a Google satellite tile."""
    s = (x + y) % 4  # distribute across mt0-mt3
    url = TILE_URL.format(s=s, z=z, x=x, y=y)
    for attempt in range(3):
        try:
            resp = session.get(url, timeout=15)
            if resp.status_code == 200:
                return Image.open(io.BytesIO(resp.content)).convert('RGBA')
        except Exception as e:
            if attempt < 2:
                time.sleep(0.3 * (attempt + 1))
    return Image.new('RGBA', (TILE_SIZE, TILE_SIZE), (200, 200, 200, 255))


def get_font(zoom, numeric=False):
    """Get appropriate font for zoom level."""
    if numeric:
        size = NUMERIC_FONT_SIZES.get(zoom, 12)
    else:
        size = FONT_SIZES.get(zoom, 14)
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except Exception:
        return ImageFont.load_default()


def fix_hebrew(text):
    """Reverse Hebrew text for PIL rendering (PIL renders LTR, Hebrew is RTL)."""
    if not text:
        return text
    # Check if text contains Hebrew characters
    if any('\u0590' <= ch <= '\u05FF' for ch in text):
        return text[::-1]
    return text


def draw_label(draw, px, py, text, font, margin=50):
    """Draw a text label centered at px, py with dark outline."""
    if not (-margin <= px <= TILE_SIZE + margin and -margin <= py <= TILE_SIZE + margin):
        return
    display_text = fix_hebrew(text)
    bbox = font.getbbox(display_text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = px - tw / 2
    ty = py - th / 2
    # Dark outline for readability
    for dx in [-1, 0, 1]:
        for dy in [-1, 0, 1]:
            if dx or dy:
                draw.text((tx + dx, ty + dy), display_text, fill=(0, 0, 0, 220), font=font)
    draw.text((tx, ty), display_text, fill=(255, 255, 255, 255), font=font)


def draw_features_on_tile(img, features, tile_x, tile_y, zoom):
    """Draw KMZ features on a tile image."""
    bounds = tile_bounds(tile_x, tile_y, zoom)
    lat_min, lon_min, lat_max, lon_max = bounds
    draw = ImageDraw.Draw(img)
    font = get_font(zoom)
    numeric_font = get_font(zoom, numeric=True)

    margin = 50

    for feat in features:
        style = feat['style']

        # Skip Main Area polygon from rendering
        if feat['name'] == 'Main Area':
            continue

        pixels = []
        for lon, lat in feat['coords']:
            px, py = lat_lon_to_pixel(lat, lon, lat_min, lon_min, lat_max, lon_max)
            pixels.append((px, py))

        if not any(-margin <= px <= TILE_SIZE + margin and -margin <= py <= TILE_SIZE + margin for px, py in pixels):
            continue

        if feat['type'] == 'Polygon' and len(pixels) >= 3:
            line_color = style['line_color']
            fill_color = style['fill_color']

            outline_rgba = (line_color[0], line_color[1], line_color[2], line_color[3])
            fill_rgba = None
            if fill_color and fill_color[3] > 0:
                fill_rgba = (fill_color[0], fill_color[1], fill_color[2], fill_color[3])

            # Draw filled polygon on a temp layer for alpha blending
            if fill_rgba:
                overlay = Image.new('RGBA', img.size, (0, 0, 0, 0))
                odraw = ImageDraw.Draw(overlay)
                odraw.polygon(pixels, fill=fill_rgba)
                img = Image.alpha_composite(img, overlay)
                draw = ImageDraw.Draw(img)

            # Draw outline
            lw = max(1, int(style['line_width']))
            draw.polygon(pixels, fill=None, outline=outline_rgba, width=lw)

            # Labels: text names on ALL zooms, numeric names only at zoom 17-18
            cx, cy = polygon_centroid(feat['coords'])
            px, py = lat_lon_to_pixel(cy, cx, lat_min, lon_min, lat_max, lon_max)

            if feat['is_numeric'] and feat['name']:
                if zoom >= NUMERIC_LABEL_MIN_ZOOM:
                    draw_label(draw, px, py, feat['name'], numeric_font, margin)
            elif feat['name']:
                draw_label(draw, px, py, feat['name'], font, margin)

        elif feat['type'] == 'Point':
            px, py = pixels[0]
            if -margin <= px <= TILE_SIZE + margin and -margin <= py <= TILE_SIZE + margin:
                r = 5
                color = style['line_color']
                draw.ellipse([px - r, py - r, px + r, py + r],
                             fill=(color[0], color[1], color[2], 220),
                             outline=(255, 255, 255, 255), width=2)

        elif feat['type'] == 'LineString' and len(pixels) >= 2:
            color = style['line_color']
            lw = max(2, int(style['line_width']))
            draw.line(pixels, fill=(color[0], color[1], color[2], 220), width=lw)

    return img


def create_mbtiles(output_path, features, bounds):
    """Create MBTiles file with Google satellite tiles + overlay."""
    min_lon, min_lat, max_lon, max_lat = bounds

    conn = sqlite3.connect(output_path)
    c = conn.cursor()

    c.execute("CREATE TABLE IF NOT EXISTS metadata (name TEXT, value TEXT)")
    c.execute("CREATE TABLE IF NOT EXISTS tiles (zoom_level INTEGER, tile_column INTEGER, tile_row INTEGER, tile_data BLOB)")
    c.execute("CREATE UNIQUE INDEX IF NOT EXISTS tile_index ON tiles (zoom_level, tile_column, tile_row)")

    center_lon = (min_lon + max_lon) / 2
    center_lat = (min_lat + max_lat) / 2
    metadata = {
        'name': 'רמת השופט',
        'format': 'png',
        'bounds': f'{min_lon},{min_lat},{max_lon},{max_lat}',
        'center': f'{center_lon},{center_lat},{MAX_ZOOM}',
        'minzoom': str(MIN_ZOOM),
        'maxzoom': str(MAX_ZOOM),
        'type': 'baselayer',
        'description': 'Ramat Hashofet map with satellite imagery',
    }
    for k, v in metadata.items():
        c.execute("INSERT INTO metadata (name, value) VALUES (?, ?)", (k, v))

    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.google.com/',
    })

    # Count total tiles
    total_tiles = 0
    for zoom in range(MIN_ZOOM, MAX_ZOOM + 1):
        x_min, y_min = lat_lon_to_tile(max_lat, min_lon, zoom)
        x_max, y_max = lat_lon_to_tile(min_lat, max_lon, zoom)
        total_tiles += (x_max - x_min + 1) * (y_max - y_min + 1)

    print(f"  Total tiles to download: {total_tiles} (zoom {MIN_ZOOM}-{MAX_ZOOM})")

    done = 0
    for zoom in range(MIN_ZOOM, MAX_ZOOM + 1):
        x_min, y_min = lat_lon_to_tile(max_lat, min_lon, zoom)
        x_max, y_max = lat_lon_to_tile(min_lat, max_lon, zoom)

        for x in range(x_min, x_max + 1):
            for y in range(y_min, y_max + 1):
                img = download_tile(zoom, x, y, session)
                img = draw_features_on_tile(img, features, x, y, zoom)

                buf = io.BytesIO()
                img.convert('RGB').save(buf, format='PNG', optimize=True)
                tile_data = buf.getvalue()

                tms_y = (2 ** zoom) - 1 - y
                c.execute("INSERT OR REPLACE INTO tiles VALUES (?, ?, ?, ?)",
                          (zoom, x, tms_y, tile_data))

                done += 1
                if done % 20 == 0 or done == total_tiles:
                    pct = done / total_tiles * 100
                    print(f"\r  Zoom {zoom}: {done}/{total_tiles} tiles ({pct:.0f}%)", end="", flush=True)

        conn.commit()

    print()
    conn.close()
    session.close()


def main():
    print("Parsing KMZ...")
    features, main_area_bounds = parse_kmz(KMZ_FILE)

    text_features = [f for f in features if not f['is_numeric'] and f['name'] and f['name'] != 'Main Area']
    numeric_features = [f for f in features if f['is_numeric']]
    print(f"  Found {len(features)} features ({len(text_features)} text-named, {len(numeric_features)} numeric)")

    if main_area_bounds is None:
        print("ERROR: 'Main Area' polygon not found in KMZ!")
        return

    # Use Main Area bounds with padding
    bounds = (
        main_area_bounds[0] - PADDING,
        main_area_bounds[1] - PADDING,
        main_area_bounds[2] + PADDING,
        main_area_bounds[3] + PADDING,
    )
    print(f"  Main Area bounds (padded): {bounds}")

    print("Creating MBTiles with Google satellite imagery...")
    create_mbtiles(OUTPUT_FILE, features, bounds)

    import os
    size_mb = os.path.getsize(OUTPUT_FILE) / (1024 * 1024)
    print(f"Done! Output: {OUTPUT_FILE} ({size_mb:.1f} MB)")


if __name__ == '__main__':
    main()
