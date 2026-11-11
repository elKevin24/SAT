import urllib.request
import re

urls = {
    "SAT-GES-0382 (Trifoliar aduana vehiculos)": "https://portal.sat.gob.gt/portal/documentacion-a-presentar-ante-la-aduana-de-vehiculos-trifoliar/",
    "SAT-GES-0376 (Comprobacion valor)": "https://portal.sat.gob.gt/portal/comprobacion-valor-de-importacion/",
    "SAT-GES-0377 (Tablas y acuerdos)": "https://portal.sat.gob.gt/portal/tablas-y-acuerdos-vehiculos/"
}

for name, url in urls.items():
    print("="*80)
    print(name, "->", url)
    print("="*80)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            m = re.search(r'class="entry-content[^"]*"[^>]*>(.*?)</div>\s*<!-- \.entry-content -->', html, re.S)
            if not m:
                m = re.search(r'<article[^>]*>(.*?)</article>', html, re.S)
            if m:
                clean = re.sub(r'<[^>]+>', ' ', m.group(1))
                print(' '.join(clean.split())[:1500])
            else:
                print("No se encontro entry-content")
    except Exception as e:
        print("Error:", e)
