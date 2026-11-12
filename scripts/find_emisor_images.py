import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/emisor-de-dte/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        pattern = re.compile(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>')
        imgs = pattern.findall(html)
        for img in imgs:
            if not any(k in img for k in ['ico', 'logo', 'theme', 'pixel', 'avatar', 'cache']):
                print('IMAGEN:', img)
except Exception as e:
    print('Error:', e)
