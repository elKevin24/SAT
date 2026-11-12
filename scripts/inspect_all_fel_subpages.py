import urllib.request
import re

urls = [
    ('certificador', 'https://portal.sat.gob.gt/portal/certificador-de-dte/'),
    ('tecnica', 'https://portal.sat.gob.gt/portal/documentacion-tecnica-del-regimen-fel/'),
    ('auditor', 'https://portal.sat.gob.gt/portal/auditor-de-seguridad-de-la-informacion/'),
    ('faq', 'https://portal.sat.gob.gt/portal/preguntas-frecuentes/cumplimiento-tributario/')
]

for tag, u in urls:
    print(f'==============================')
    print(f'TAG: {tag} | URL: {u}')
    print(f'==============================')
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            # Extract links
            pattern = re.compile(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.DOTALL)
            links = pattern.findall(html)
            for href, text in links:
                t = re.sub(r'<[^>]+>', '', text).strip()
                if t and not any(k in href for k in ['css', 'js', 'jpg', 'png', 'theme', 'wp-content', 'feed', 'wp-json', '#']):
                    if any(k in href for k in ['portal.sat.gob.gt', 'descarga', 'pdf', 'xsd', 'zip', 'ws', 'sat.gob.gt']):
                        print(f'[{tag}] {t} ===> {href}')
    except Exception as e:
        print('Error en', tag, e)
