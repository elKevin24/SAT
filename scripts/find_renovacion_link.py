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
    for a in tab.find_all('a'):
        print(f"Link text: '{a.get_text(strip=True)}' -> href: '{a.get('href')}'")
