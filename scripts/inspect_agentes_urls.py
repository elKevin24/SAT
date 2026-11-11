import urllib.request
import urllib.error
import ssl
from bs4 import BeautifulSoup
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("SAT-GES-0418", "https://portal.sat.gob.gt/portal/auxiliares-de-la-funcion-publica/"),
    ("SAT-GES-0419", "https://portal.sat.gob.gt/portal/requisitos-de-aduanas/"),
    ("SAT-GES-0420", "https://portal.sat.gob.gt/portal/procedimientos-aduanas/"),
    ("SAT-GES-0421", "https://portal.sat.gob.gt/portal/componente-activex-pki-dua/"),
    ("SAT-GES-0422", "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/consulta-del-estado-o-actuaciones-de-expedientes-de-las-unidades-del-departamento-de-gestion-aduanera/"),
    ("SAT-GES-0423", "https://portal.sat.gob.gt/portal/programa-miad/sistemas-de-video-vigilancia-cctv/"),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

for code, url in urls:
    print(f"\n==================== {code} | {url} ====================")
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            soup = BeautifulSoup(html, 'html.parser')
            # Extract main text
            # remove scripts, styles
            for s in soup(['script', 'style', 'nav', 'footer']):
                s.decompose()
            text = soup.get_text(separator=' ', strip=True)
            # Find relevant headings and lists
            headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3', 'h4'])]
            print(f"Title: {soup.title.string if soup.title else 'No title'}")
            print(f"Headings: {headings[:10]}")
            # Print a snippet of text
            print(f"Text snippet: {text[:800]}...")
    except Exception as e:
        print(f"Error fetching {url}: {e}")
