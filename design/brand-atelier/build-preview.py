#!/usr/bin/env python3
"""Create a portable, self-contained review file using only allowlisted repo assets."""
from pathlib import Path
import base64, hashlib, json
root = Path(__file__).resolve().parents[2]
folder = root / 'design/brand-atelier'
assets = {
    '/brand/logo.png': ('public/brand/logo-full.png','image/png'),
    '/fonts/inter.woff2': ('src/fonts/InterVariable.woff2','font/woff2'),
    '/images/home.jpg': ('public/images/marketing/family-home.jpg','image/jpeg'),
    '/images/partner.jpg': ('public/images/marketing/partner-doorstep.jpg','image/jpeg')
}
html = (folder/'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="/atelier.css">','<style>\n'+(folder/'atelier.css').read_text()+'\n</style>')
html = html.replace('  <script src="/atelier.js" defer></script>','')
html = html.replace('</body>','<script>\n'+(folder/'atelier.js').read_text()+'\n</script>\n</body>')
manifest = {}
for route, (source,mime) in assets.items():
    data = (root/source).read_bytes()
    html = html.replace(route,'data:'+mime+';base64,'+base64.b64encode(data).decode())
    manifest[source] = {'sha256': hashlib.sha256(data).hexdigest(), 'bytes':len(data)}
(folder/'preview.html').write_text(html)
evidence = root/'docs/brand/evidence/atelier'
evidence.mkdir(parents=True,exist_ok=True)
(evidence/'assets.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'preview':str(folder/'preview.html'),'bytes':len(html.encode()),'assets':len(manifest)}))
