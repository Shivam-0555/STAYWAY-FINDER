from PIL import Image, ImageDraw, ImageFont
import os

out_dir = os.path.join('public', 'images', 'logos')
os.makedirs(out_dir, exist_ok=True)

# Shapes
center = 256
pin_top = 64
pin_bottom = 400
outer_radius = 92

# SVG templates
svg_template = '''<svg width="{w}" height="{h}" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M256 64C207.4 64 168 103.4 168 152C168 216 256 376 256 376C256 376 344 216 344 152C344 103.4 304.6 64 256 64Z" fill="{fill_color}"/>
  <circle cx="256" cy="152" r="42" fill="#FFFFFF"/>
  <circle cx="256" cy="152" r="20" fill="{fill_color}"/>
  <circle cx="256" cy="392" r="30" stroke="{fill_color}" stroke-width="24" fill="none"/>
  <circle cx="256" cy="392" r="64" stroke="{fill_color}" stroke-width="20" fill="none"/>
  <circle cx="256" cy="392" r="98" stroke="{fill_color}" stroke-width="16" fill="none"/>
</svg>'''

svg_text_template = '''<svg width="1024" height="256" viewBox="0 0 1024 256" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M128 16C79.4 16 40 55.4 40 104C40 168 128 328 128 328C128 328 216 168 216 104C216 55.4 176.6 16 128 16Z" fill="{fill_color}"/>
  <circle cx="128" cy="104" r="42" fill="#FFFFFF"/>
  <circle cx="128" cy="104" r="20" fill="{fill_color}"/>
  <circle cx="128" cy="344" r="30" stroke="{fill_color}" stroke-width="24" fill="none"/>
  <circle cx="128" cy="344" r="64" stroke="{fill_color}" stroke-width="20" fill="none"/>
  <circle cx="128" cy="344" r="98" stroke="{fill_color}" stroke-width="16" fill="none"/>
  <text x="260" y="120" fill="{fill_color}" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="700">StayWay Finder</text>
</svg>'''

svg_tagline_template = '''<svg width="1200" height="320" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M128 16C79.4 16 40 55.4 40 104C40 168 128 328 128 328C128 328 216 168 216 104C216 55.4 176.6 16 128 16Z" fill="{fill_color}"/>
  <circle cx="128" cy="104" r="42" fill="#FFFFFF"/>
  <circle cx="128" cy="104" r="20" fill="{fill_color}"/>
  <circle cx="128" cy="344" r="30" stroke="{fill_color}" stroke-width="24" fill="none"/>
  <circle cx="128" cy="344" r="64" stroke="{fill_color}" stroke-width="20" fill="none"/>
  <circle cx="128" cy="344" r="98" stroke="{fill_color}" stroke-width="16" fill="none"/>
  <text x="260" y="120" fill="{fill_color}" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="700">StayWay Finder</text>
  <text x="260" y="200" fill="#374151" font-family="Arial, Helvetica, sans-serif" font-size="36">Find Safe Routes, Hostels & Essential Services</text>
</svg>'''

# Write SVGs
for color_name, color in [('black', '#000000'), ('blue', '#4F46E5')]:
    with open(os.path.join(out_dir, f'stayway-finder-icon-{color_name}.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_template.format(w=512, h=512, fill_color=color))
    with open(os.path.join(out_dir, f'stayway-finder-text-{color_name}.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_text_template.format(fill_color=color))
    with open(os.path.join(out_dir, f'stayway-finder-tagline-{color_name}.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_tagline_template.format(fill_color=color))

# Generate PNGs using PIL
for color_name, color in [('black', (0,0,0,255)), ('blue', (79,70,229,255))]:
    size = 512
    img = Image.new('RGBA', (size, size), (255,255,255,0))
    draw = ImageDraw.Draw(img)
    
    # pin shape
    pin = [
        (256, 64),
        (168, 152),
        (190, 270),
        (256, 400),
        (322, 270),
        (344, 152),
    ]
    draw.polygon(pin, fill=color)
    draw.ellipse((214, 110, 298, 194), fill=(255,255,255,255))
    draw.ellipse((236, 132, 276, 172), fill=color)
    
    # ripples
    ripple_specs = [(30, 24), (64, 20), (98, 16)]
    for r, width in ripple_specs:
        draw.ellipse((256-r, 392-r, 256+r, 392+r), outline=color, width=width)

    png_path = os.path.join(out_dir, f'stayway-finder-icon-{color_name}.png')
    img.save(png_path)
    img.resize((32,32), Image.LANCZOS).save(os.path.join(out_dir, f'stayway-finder-favicon-{color_name}.png'))
    img.save(os.path.join(out_dir, f'stayway-finder-appicon-{color_name}.png'))

print('Logo assets generated in', out_dir)
