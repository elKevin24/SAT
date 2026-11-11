import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/documentacion-a-presentar-ante-la-aduana-de-vehiculos-trifoliar/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Buscar enlaces o imagenes de trifoliar
images = re.findall(r'<img[^>]+src=[\'"]([^\'"]+)[\'"]', html, re.I)
print("Imagenes:", images[:10])

# Buscar texto de párrafos
paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, re.I | re.S)
print("\nParrafos encontrados:", len(paragraphs))
for p in paragraphs[:15]:
    c = re.sub(r'<[^>]+>', '', p).strip()
    if c:
        print("P:", c)
