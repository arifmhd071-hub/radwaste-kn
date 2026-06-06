#!/usr/bin/env python3
"""
Generate all PWA icons for RadWaste KN
Requires: pip install Pillow --break-system-packages
"""
import os
import math
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(OUTPUT_DIR, exist_ok=True)

SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

BG_COLOR      = (26, 58, 92)       # --accent #1a3a5c
INNER_COLOR   = (42, 95, 143)      # --accent2 #2a5f8f
TEXT_COLOR    = (255, 255, 255)
SYMBOL        = "☢"

def draw_icon(size: int) -> Image.Image:
    img  = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # ── Background rounded square ──
    radius = size * 0.22
    draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=BG_COLOR)

    # ── Inner circle accent ──
    pad  = size * 0.18
    draw.ellipse([pad, pad, size-pad, size-pad], fill=INNER_COLOR)

    # ── Radiation symbol (3 petals + center) ──
    cx, cy = size / 2, size / 2
    outer_r = size * 0.30
    inner_r = size * 0.08
    center_r = size * 0.065
    petal_span = 50  # degrees

    for i in range(3):
        angle = i * 120 - 90
        # Draw petal arc as a filled wedge
        a0 = angle - petal_span / 2
        a1 = angle + petal_span / 2
        draw.pieslice(
            [cx - outer_r, cy - outer_r, cx + outer_r, cy + outer_r],
            start=a0, end=a1, fill=TEXT_COLOR
        )
        # Punch inner hole via bg-colored pieslice
        draw.pieslice(
            [cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
            start=a0, end=a1, fill=INNER_COLOR
        )

    # Center circle
    draw.ellipse(
        [cx - center_r, cy - center_r, cx + center_r, cy + center_r],
        fill=TEXT_COLOR
    )

    return img


def make_screenshot_placeholder(w, h, label):
    img  = Image.new('RGB', (w, h), BG_COLOR)
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, w-1, h-1], outline=INNER_COLOR, width=4)
    # Simple text placeholder
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', max(20, h//30))
    except Exception:
        font = ImageFont.load_default()
    tw, th = draw.textsize(label, font=font) if hasattr(draw, 'textsize') else (len(label)*10, 20)
    draw.text(((w-tw)//2, (h-th)//2), label, fill=TEXT_COLOR, font=font)
    return img


# ── Generate icons ──
for sz in SIZES:
    icon = draw_icon(sz)
    path = os.path.join(OUTPUT_DIR, f'icon-{sz}.png')
    icon.save(path, 'PNG')
    print(f'  ✓  icon-{sz}.png')

# ── Screenshot placeholders ──
ss_wide   = make_screenshot_placeholder(1280, 720,  'RadWaste KN — Dashboard')
ss_narrow = make_screenshot_placeholder(390,  844,  'RadWaste KN — Mobile')
ss_wide.save(os.path.join(OUTPUT_DIR,   'screenshot-wide.png'),   'PNG')
ss_narrow.save(os.path.join(OUTPUT_DIR, 'screenshot-narrow.png'), 'PNG')
print('  ✓  screenshot-wide.png')
print('  ✓  screenshot-narrow.png')
print(f'\nSemua ikon tersimpan di: {os.path.abspath(OUTPUT_DIR)}')
