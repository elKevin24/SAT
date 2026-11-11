import urllib.request
import re

def fetch_page(url):
    print("="*80)
    print("FETCHING:", url)
    print("="*80)
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        html = response.read().decode('utf-8', errors='ignore')
    
    # Extraer texto de entry-content
    body_match = re.search(r'class="entry-content[^"]*"[^>]*>(.*?)</div>\s*<!-- \.entry-content -->', html, re.S)
    if not body_match:
        body_match = re.search(r'<article[^>]*>(.*?)</article>', html, re.S)
    
    if body_match:
        content = body_match.group(1)
        clean = re.sub(r'<br\s*/?>', '\n', content)
        clean = re.sub(r'</p>', '\n\n', clean)
        clean = re.sub(r'<li[^>]*>', '\n* ', clean)
        clean = re.sub(r'<h[1-6][^>]*>', '\n\n### ', clean)
        clean = re.sub(r'</h[1-6]>', '\n', clean)
        clean = re.sub(r'<[^>]+>', '', clean)
        print(clean.strip())
    else:
        print("No se encontró el bloque principal, extrayendo texto general:")
        clean = re.sub(r'<[^>]+>', ' ', html)
        print(' '.join(clean.split())[:3000])

if __name__ == '__main__':
    url1 = 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-vehiculos-para-importadores-de-vehiculos-nuevos/'
    fetch_page(url1)
