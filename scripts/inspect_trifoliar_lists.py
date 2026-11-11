import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/documentacion-a-presentar-ante-la-aduana-de-vehiculos-trifoliar/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, timeout=10) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

# Buscar listas <ul> o <ol>
lists = re.findall(r'<ul[^>]*>(.*?)</ul>', html, re.I | re.S)
print("Listas encontradas:", len(lists))
for l in lists:
    items = re.findall(r'<li[^>]*>(.*?)</li>', l, re.I | re.S)
    print("--- LISTA ---")
    for item in items:
        clean = re.sub(r'<[^>]+>', ' ', item).strip()
        if clean:
            print("*", clean)
