import urllib.request
import ssl
from bs4 import BeautifulSoup

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request("https://portal.sat.gob.gt/portal/requisitos-de-aduanas/", headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

soup = BeautifulSoup(html, 'html.parser')

tab = soup.find(id="1608063945646-f9ebd644-65ff")
if tab:
    print("=== TAB 1608063945646-f9ebd644-65ff FOUND ===")
    print(tab.get_text(separator="\n", strip=True))
else:
    print("Tab ID not found directly, searching for Renovación text...")
    for div in soup.find_all(True):
        if 'Renovación de Operación' in div.get_text() and len(div.get_text()) < 3000:
            print("--- MATCH ---")
            print(div.get_text(separator="\n", strip=True)[:1000])
            break
