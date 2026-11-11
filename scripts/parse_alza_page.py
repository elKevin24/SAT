import re

with open('scripts/alza_produccion.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("="*80)
print("ANALISIS ESTRUCTURAL DE 'ALZA E IMPORTACIÓN DE VEHÍCULOS' (PRODUCCIÓN SAT)")
print("="*80)

# 1. Metadatos
title = re.search(r'<title>(.*?)</title>', html, re.I)
print("Título <title>:", title.group(1) if title else "N/A")

meta_desc = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', html, re.I)
print("Meta Description:", meta_desc.group(1) if meta_desc else "N/A")

canonical = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', html, re.I)
print("URL Canónica:", canonical.group(1) if canonical else "N/A")

# 2. Encabezados H1-H6
print("\nEncabezados en la página:")
for h in re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', html, re.I | re.S):
    clean_h = re.sub(r'<[^>]+>', '', h[1]).strip()
    if clean_h:
        print(f"  [{h[0].upper()}]: {clean_h}")

# 3. Pestañas / Acordeones
headers_accordions = re.findall(r'class="vc_tta-title-text">(.*?)</span>', html, re.S)
print("\nPestañas / Acordeones encontrados:")
for idx, acc in enumerate(headers_accordions):
    print(f"  {idx+1}. {acc.strip()}")

# 4. Enlaces de descarga
print("\n" + "="*80)
print("ANALISIS DE DESCARGAS / ARCHIVOS DISPONIBLES EN LA PÁGINA:")
print("="*80)

# Buscar bloques wpdm-link o enlaces a descarga
descargas = re.findall(r'href=[\'"](https://portal\.sat\.gob\.gt/portal/descarga/[^\'"]+)[\'"][^>]*>(.*?)</a>', html, re.I | re.S)
print(f"Total enlaces de descarga encontrados: {len(descargas)}")

# Separar por categoría según URL
importacion_archivos = []
alza_archivos = []

for href, label in descargas:
    lbl_clean = re.sub(r'<[^>]+>', '', label).strip()
    if 'importacion-de-vehiculos' in href:
        if lbl_clean and lbl_clean.lower() != 'descargar':
            importacion_archivos.append((lbl_clean, href))
    elif 'alza-de-importacion' in href:
        if lbl_clean and lbl_clean.lower() != 'descargar':
            alza_archivos.append((lbl_clean, href))

print(f"\n1. Archivos en pestaña 'Importación de Vehículos': {len(importacion_archivos)}")
print("   Primeros 10 archivos:")
for name, href in importacion_archivos[:10]:
    print(f"   - {name} | URL: {href}")

print(f"\n2. Archivos en pestaña 'Alza de Importación de Vehículos': {len(alza_archivos)}")
print("   Primeros 10 archivos:")
for name, href in alza_archivos[:10]:
    print(f"   - {name} | URL: {href}")

# Rango temporal de los archivos
if importacion_archivos:
    print(f"\nArchivo más reciente de importación: {importacion_archivos[0][0]}")
    print(f"Archivo más antiguo de importación:  {importacion_archivos[-1][0]}")

if alza_archivos:
    print(f"\nArchivo más reciente de alzas: {alza_archivos[0][0]}")
    print(f"Archivo más antiguo de alzas:  {alza_archivos[-1][0]}")

