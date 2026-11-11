import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}
url = "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/consulta-del-estado-o-actuaciones-de-expedientes-de-las-unidades-del-departamento-de-gestion-aduanera/"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')
for s in soup(['script', 'style', 'nav', 'footer']):
    s.decompose()

print(soup.get_text(separator="\n", strip=True))
