import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/app-fel/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        pattern = re.compile(r'href=["\'](https?://[^"\']+)["\']')
        links = pattern.findall(html)
        for l in set(links):
            if 'play.google.com' in l or 'apple.com' in l or 'android' in l or 'ios' in l or 'app' in l:
                print('Found link:', l)
except Exception as e:
    print('Error:', e)
