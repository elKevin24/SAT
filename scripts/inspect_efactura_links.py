import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/efactura/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        pattern = re.compile(r'href=["\'](https?://[^"\']+)["\']')
        links = pattern.findall(html)
        unique_links = sorted(list(set(links)))
        for l in unique_links:
            if 'portal.sat.gob.gt' in l:
                print(l)
except Exception as e:
    print('Error:', e)
