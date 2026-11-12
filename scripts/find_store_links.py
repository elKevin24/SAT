import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/app-fel/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        pattern = re.compile(r'https?://[^\s"\'<>]+')
        for link in pattern.findall(html):
            if any(k in link.lower() for k in ['play.google', 'apps.apple', 'appgallery', 'android', 'ios']):
                print(link)
except Exception as e:
    print('Error:', e)
