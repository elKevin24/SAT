import urllib.request
import re

url = 'https://portal.sat.gob.gt/portal/efactura/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        # Limpiar tags para ver exactamente cada bloque
        pattern = re.compile(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.DOTALL)
        links = pattern.findall(html)
        print('=== ENLACES DEL CONTENIDO ===')
        for href, text in links:
            t = re.sub(r'<[^>]+>', '', text).strip()
            if t and not any(k in href for k in ['css', 'js', 'jpg', 'png', 'theme', 'wp-content', 'feed']):
                print(f'{t} -> {href}')
except Exception as e:
    print('Error:', e)
