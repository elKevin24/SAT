import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/emisor-de-dte/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        pattern = re.compile(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.DOTALL)
        links = pattern.findall(html)
        print('=== ENLACES DETECTADOS EN EMISOR DE DTE ===')
        for href, text in links:
            t = re.sub(r'<[^>]+>', '', text).strip()
            if t and any(k in href for k in ['descarga', 'portal.sat.gob.gt', 'agenciavirtual', 'pdf']):
                if not any(k in href for k in ['wp-content', 'feed', 'themes', 'plugins']):
                    print(f'{t} ===> {href}')
except Exception as e:
    print('Error:', e)
