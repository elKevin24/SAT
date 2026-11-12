import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0'}

url = "https://portal.sat.gob.gt/portal/operador-economico-autorizado/"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')
for s in soup(['script', 'style', 'nav', 'footer']):
    s.decompose()

print(f"Title: {soup.title.string if soup.title else ''}")
print("=== HEADINGS ===")
for h in soup.find_all(['h1', 'h2', 'h3', 'h4']):
    print(f"  {h.name}: {h.get_text(strip=True)}")

print("\n=== PARAGRAPHS & LINKS ===")
for p in soup.find_all(['p', 'li', 'a'])[:30]:
    t = p.get_text(strip=True)
    if len(t) > 15:
        print(f"  * {t}")
