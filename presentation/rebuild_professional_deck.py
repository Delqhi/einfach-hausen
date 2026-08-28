from PIL import Image, ImageOps, ImageDraw
from pathlib import Path

ROOT = Path('presentation')
ASSETS = ROOT / 'professional-assets'
ASSETS.mkdir(exist_ok=True)

# Crop definitions: source, output, box=(left,top,right,bottom)
crops = [
    ('01-website-startseite.png','web_hero.png',(0,0,1440,1050)),
    ('01-website-startseite.png','web_value.png',(0,1000,1440,2300)),
    ('01-website-startseite.png','web_process_preview.png',(0,2300,1440,3950)),
    ('01-website-startseite.png','web_cta.png',(0,4050,1440,5600)),
    ('02-website-leistungen.png','web_services_top.png',(0,0,1440,1280)),
    ('02-website-leistungen.png','web_services_cards.png',(0,700,1440,2200)),
    ('03-website-so-funktionierts.png','web_how_top.png',(0,0,1440,1320)),
    ('03-website-so-funktionierts.png','web_how_steps.png',(0,940,1440,2500)),
    ('04-eigentuemer-app-start.png','owner_home_top.png',(0,0,390,844)),
    ('04-eigentuemer-app-start.png','owner_home_next.png',(0,760,390,1323)),
    ('05-eigentuemer-app-hausmeister.png','owner_hausmeister.png',(0,0,390,844)),
    ('06-eigentuemer-app-mein-haus.png','owner_house_top.png',(0,0,390,844)),
    ('06-eigentuemer-app-mein-haus.png','owner_house_docs.png',(0,760,390,1604)),
    ('07-eigentuemer-app-tarife.png','owner_tariffs_top.png',(0,0,390,844)),
    ('07-eigentuemer-app-tarife.png','owner_tariffs_details.png',(0,700,390,1544)),
    ('08-handwerker-app-start.png','pro_start.png',(0,0,390,844)),
    ('09-handwerker-app-auftraege.png','pro_jobs.png',(0,0,390,844)),
    ('10-handwerker-app-team.png','pro_team_top.png',(0,0,390,844)),
    ('10-handwerker-app-team.png','pro_team_details.png',(0,720,390,1564)),
    ('11-handwerker-app-profil.png','pro_profile_top.png',(0,0,390,844)),
    ('11-handwerker-app-profil.png','pro_profile_company.png',(0,900,390,1744)),
    ('11-handwerker-app-profil.png','pro_profile_checks.png',(0,2250,390,3094)),
]

def crop(src, out, box):
    im=Image.open(ROOT/src).convert('RGB')
    # clamp box
    l,t,r,b=box
    r=min(r, im.width); b=min(b, im.height)
    im.crop((l,t,r,b)).save(ASSETS/out, quality=95)

for args in crops:
    crop(*args)

# Create phone mockup assets with rounded corners and subtle border/shadow on transparent bg.
def make_phone(src_name, out_name, scale=2):
    im = Image.open(ASSETS/src_name).convert('RGBA')
    # Resize x2 for crisp borders? Keep original content; create canvas with padding.
    w,h = im.size
    pad = 22
    radius = 28
    canvas = Image.new('RGBA', (w+pad*2, h+pad*2), (0,0,0,0))
    # shadow
    shadow = Image.new('RGBA', (w+pad*2, h+pad*2), (0,0,0,0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((pad-2,pad+5,pad+w+2,pad+h+7), radius=radius, fill=(0,0,0,42))
    shadow = shadow.filter(ImageFilter.GaussianBlur(8)) if False else shadow
    canvas.alpha_composite(shadow)
    mask = Image.new('L',(w,h),0)
    md=ImageDraw.Draw(mask)
    md.rounded_rectangle((0,0,w,h), radius=radius, fill=255)
    rounded = im.copy(); rounded.putalpha(mask); canvas.alpha_composite(rounded, (pad,pad))
    d=ImageDraw.Draw(canvas)
    d.rounded_rectangle((pad,pad,pad+w,pad+h), radius=radius, outline=(215,224,218,255), width=2)
    # Add small speaker pill to make it read as device, without covering important content too much.
    d.rounded_rectangle((pad+w//2-28,pad+10,pad+w//2+28,pad+16), radius=4, fill=(220,226,222,180))
    canvas.save(ASSETS/out_name)

for name in ['owner_home_top','owner_hausmeister','owner_house_top','owner_tariffs_top','pro_start','pro_jobs','pro_team_top','pro_profile_top']:
    make_phone(f'{name}.png', f'{name}_phone.png')

# Thumbnail contact sheet for internal QA
thumbs = [p for p in ASSETS.glob('*.png') if not p.name.endswith('_phone.png')]
thumbs = sorted(thumbs)
cell_w, cell_h = 260, 210
cols=4
rows=(len(thumbs)+cols-1)//cols
sheet=Image.new('RGB',(cols*cell_w, rows*cell_h),(246,248,246))
d=ImageDraw.Draw(sheet)
for i,p in enumerate(thumbs):
    im=Image.open(p).convert('RGB')
    im.thumbnail((cell_w-20, cell_h-42))
    x=(i%cols)*cell_w+10; y=(i//cols)*cell_h+10
    sheet.paste(im,(x,y))
    d.text((x,y+cell_h-28),p.stem[:32],fill=(25,43,33))
sheet.save(ROOT/'professional-contact-sheet.jpg', quality=90)
print('created', len(list(ASSETS.glob('*.png'))), 'assets')
