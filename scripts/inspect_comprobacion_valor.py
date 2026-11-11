import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/comprobacion-valor-de-importacion/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, re.I | re.S)
print("Parrafos comprobacion de valor:", len(paragraphs))
for p in paragraphs[:20]:
    c = re.sub(r'<[^>]+>', ' ', p).strip()
    if c:
        print("P:", c)
