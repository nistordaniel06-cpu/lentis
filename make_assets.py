from PIL import Image, ImageEnhance, ImageFilter
from pathlib import Path
root=Path(__file__).parent
logo=Image.open('/mnt/data/lentis_blue_vision_eye_logo.png').convert('RGBA')
print('logo dimensions',logo.size)
# Isolate elements from original white-background approved design while preserving anti-aliasing.
for name,box in [('lentis-symbol.png',(385,158,1045,633)),('lentis-wordmark.png',(273,620,1138,889))]:
    im=logo.crop(box)
    pixels=im.load()
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,_=pixels[x,y]
            a=255-min(255,max(0,(min(r,g,b)-218)*255//37))
            if a<10:a=0
            pixels[x,y]=(r,g,b,a)
    # remove extra transparent margins
    bbox=im.getbbox()
    if bbox:im=im.crop(bbox)
    im.save(root/'assets'/name,optimize=True)
    print(name,im.size)
mock=Image.open('/mnt/data/lentis_eyewear_homepage_design.png').convert('RGB')
print('mock dimensions',mock.size)
# Crop a fashion portrait from the previously approved homepage design.
portrait=mock.crop((468,50,784,365))
portrait=ImageEnhance.Sharpness(portrait).enhance(1.08)
portrait.resize((948,945),Image.Resampling.LANCZOS).save(root/'assets/hero-portrait.webp','WEBP',quality=91,method=6)
tryon=mock.crop((421,1027,646,1143))
tryon.resize((900,464),Image.Resampling.LANCZOS).save(root/'assets/tryon.webp','WEBP',quality=89,method=6)
# Unique high-resolution vector product graphics, not copied photos/brand listings.
colors=[('frame-01','#12294a','#344f82','#d9e8f5'),('frame-02','#765444','#b99a73','#77524a'),('frame-03','#1b3152','#314b75','#496c8f'),('frame-04','#845d4a','#bf9579','#e5ecf6'),('frame-05','#4c5666','#8298af','#c1d2e1')]
for name,frame,metal,lens in colors:
    dark=name=='frame-03'
    template=f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{metal}"/><stop offset="1" stop-color="{frame}"/></linearGradient><linearGradient id="glass" x1="0" y1="0" x2="0.8" y2="1"><stop stop-color="{lens}" stop-opacity="{'.73' if dark else '.54'}"/><stop offset="1" stop-color="#fff" stop-opacity=".14"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="15" stdDeviation="10" flood-opacity=".11"/></filter></defs>
  <ellipse cx="320" cy="273" rx="257" ry="15" fill="#dce7ef" opacity=".48"/>
  <g filter="url(#s)" stroke-linecap="round" stroke-linejoin="round">
  <path d="M60 135 L16 117" stroke="url(#metal)" stroke-width="11"/><path d="M577 135 L624 118" stroke="url(#metal)" stroke-width="11"/>
  <path d="M88 117 C144 105 223 105 259 123 C275 132 272 202 253 231 C238 254 138 254 114 234 C90 213 78 142 88 117Z" fill="url(#glass)" stroke="url(#metal)" stroke-width="15"/>
  <path d="M381 123 C416 105 496 105 552 117 C562 141 550 213 526 234 C501 254 401 254 386 231 C366 202 363 132 381 123Z" fill="url(#glass)" stroke="url(#metal)" stroke-width="15"/>
  <path d="M269 143 C286 122 355 122 372 143" fill="none" stroke="url(#metal)" stroke-width="13"/>
  <path d="M119 133 Q166 120 205 129" fill="none" stroke="#fff" opacity=".53" stroke-width="6"/><path d="M398 130 Q440 119 492 129" fill="none" stroke="#fff" opacity=".53" stroke-width="6"/>
  </g></svg>'''
    (root/'assets'/f'{name}.svg').write_text(template)
contact='''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><radialGradient id="a"><stop stop-color="#dbf7ff" stop-opacity=".34"/><stop offset=".74" stop-color="#86cef5" stop-opacity=".22"/><stop offset=".93" stop-color="#3c8dd0" stop-opacity=".65"/><stop offset="1" stop-color="#9de5fe" stop-opacity=".14"/></radialGradient><filter id="b"><feDropShadow dy="18" stdDeviation="12" flood-color="#5ba8d9" flood-opacity=".15"/></filter></defs><ellipse cx="320" cy="281" rx="230" ry="12" fill="#d8ebf6"/><g filter="url(#b)"><ellipse cx="252" cy="171" rx="126" ry="80" transform="rotate(-24 252 171)" fill="url(#a)" stroke="#9bcff1" stroke-width="7"/><ellipse cx="403" cy="180" rx="126" ry="80" transform="rotate(22 403 180)" fill="url(#a)" stroke="#9bcff1" stroke-width="7"/><path d="M146 197 Q234 91 356 160" fill="none" stroke="#e5faff" stroke-width="13" opacity=".65"/><path d="M309 196 Q419 103 501 185" fill="none" stroke="#e5faff" stroke-width="13" opacity=".63"/></g></svg>'''
(root/'assets/contact.svg').write_text(contact)