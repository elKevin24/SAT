import urllib.request
import ssl
from bs4 import BeautifulSoup
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

def inspect_url(url, target_tab=None):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'html.parser')
        return soup, html

print("=== INSPECTING REQUISITOS DE ADUANAS ===")
soup, html = inspect_url("https://portal.sat.gob.gt/portal/requisitos-de-aduanas/")
# Look for sections related to Auxiliares or Renovación
for tab in soup.find_all(['div', 'section'], class_=re.compile(r'vc_tta-panel|wpb_tab|tab-pane')):
    heading = tab.find(['h2', 'h3', 'h4', 'span'])
    heading_text = heading.get_text(strip=True) if heading else ""
    if any(k in tab.get_text().lower() for k in ['renovación', 'auxiliar', 'agente aduanero', 'fianza', 'garantía']):
        print(f"\n--- Found TAB / SECTION: {heading_text} (ID: {tab.get('id')}) ---")
        for p in tab.find_all(['p', 'li', 'h4', 'h5'])[:25]:
            t = p.get_text(strip=True)
            if t:
                print(f"  * {t}")

print("\n=== INSPECTING GESTION ADUANERA EXPEDIENTES ===")
soup, html = inspect_url("https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/consulta-del-estado-o-actuaciones-de-expedientes-de-las-unidades-del-departamento-de-gestion-aduanera/")
for sec in soup.find_all(['div'], class_=re.compile(r'vc_tta-panel|wpb_wrapper')):
    h = sec.find(['h2', 'h3', 'h4'])
    if h and any(k in h.get_text().lower() for k in ['agente', 'persona', 'requisitos', 'unidades']):
        print(f"\n--- Heading: {h.get_text(strip=True)} ---")
        for item in sec.find_all(['li', 'p'])[:15]:
            it = item.get_text(strip=True)
            if it:
                print(f"    - {it}")
