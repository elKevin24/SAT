import urllib.request
import ssl
from bs4 import BeautifulSoup
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

urls_to_inspect = [
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/recepcion-de-seguro-de-caucion-importacion-y-admision-temporal/",
    "https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/culminacion-de-admision-temporal-de-equipo-de-carga/",
    "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-de-impuestos-de-admision-temporal-de-equipo-de-carga-atc/",
    "https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/autorizacion-de-cartas-de-ingreso-a-zona-primaria/",
    "https://portal.sat.gob.gt/portal/registro-atc-terrestre/",
    "https://portal.sat.gob.gt/portal/registro-ampliacion-atc/",
    "https://portal.sat.gob.gt/portal/marchamo-electronico/",
    "https://portal.sat.gob.gt/portal/mensaje-carga-aduanera-cuscar/",
    "https://portal.sat.gob.gt/portal/documentos-manifiesto/",
    "https://portal.sat.gob.gt/portal/sistema-de-cobro-por-permanencia/",
    "https://portal.sat.gob.gt/portal/transito-pendiente/",
    "https://portal.sat.gob.gt/portal/sanciones-aplicables-a-la-importacion-exportacion-o-transito/"
]

results = {}

for url in urls_to_inspect:
    slug = url.strip('/').split('/')[-1]
    print(f"Fetching: {slug}...")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            for s in soup(['script', 'style', 'nav', 'footer']):
                s.decompose()
            title = soup.title.string.strip() if soup.title else slug
            headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3', 'h4'])]
            paragraphs = [p.get_text(strip=True) for p in soup.find_all(['p', 'li']) if len(p.get_text(strip=True)) > 15]
            results[slug] = {
                'url': url,
                'title': title,
                'headings': headings,
                'content_sample': paragraphs[:25]
            }
    except Exception as e:
        results[slug] = {'url': url, 'error': str(e)}

with open('scripts/extracted_afpa_services.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved extracted content to scripts/extracted_afpa_services.json")
