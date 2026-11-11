import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}
url = "https://portal.sat.gob.gt/portal/auxiliares-de-la-funcion-publica/"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')
for a in soup.find_all('a'):
    href = a.get('href', '')
    text = a.get_text(strip=True)
    if any(k in href.lower() or k in text.lower() for k in ['agente', 'registro', 'requisito', 'caucion', 'activos', 'inscrip']):
        print(f"Text: '{text}' -> {href}")
