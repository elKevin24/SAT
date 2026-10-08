import json
import os
import shutil

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
BACKUP_PATH = 'src/data/allTramites.json.bak'

# 1. Respaldo de seguridad
shutil.copyfile(ALL_TRAMITES_PATH, BACKUP_PATH)
print(f"Respaldo creado en {BACKUP_PATH}")

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total trámites antes de consolidación: {len(data)}")

# IDs a eliminar por ser duplicados exactos
DUPLICATE_IDS_TO_REMOVE = {
    'profesionales-timbres-razon-electronica', # Duplicado de profesionales-21
    'contribuyentes-44'                       # Duplicado de profesionales-timbres-devolucion-papel-sellado
}

# Filtrar duplicados eliminados
filtered_data = []
for t in data:
    if t.get('id') in DUPLICATE_IDS_TO_REMOVE:
        print(f"Eliminando registro duplicado: {t.get('id')} - {t.get('tramite')}")
        continue
    filtered_data.append(t)

# Enriquecer y normalizar profesionales
for t in filtered_data:
    if t.get('pillar') == 'profesionales':
        tid = t.get('id')
        
        # Consolidación de Pair 1 en profesionales-21
        if tid == 'profesionales-21':
            t['url'] = 'https://portal.sat.gob.gt/portal/razon-electronica-timbres-fiscales/'
            t['subcategoria'] = 'Timbres Fiscales y Papel Sellado de Protocolo'
            t['rutasProceso'] = [
                {
                    'procesoNo': 6,
                    'procesoNombre': 'Declarar y pagar mis impuestos',
                    'pasoNo': 4,
                    'pasoAccion': 'Paga'
                }
            ]
            
        # Consolidación de Pair 2 en profesionales-timbres-devolucion-papel-sellado
        elif tid == 'profesionales-timbres-devolucion-papel-sellado':
            t['subcategoria'] = 'Timbres Fiscales y Papel Sellado de Protocolo'
            t['descripcion'] = 'Procedimiento para solicitar la reposición o devolución monetaria de especies fiscales deterioradas o no utilizadas conforme a ley.'
            t['baseLegal'] = 'Decreto 37-92 (Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos).'
            t['seccionActual'] = 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-del-impuesto-de-timbres-fiscales-y-de-papel-sellado-especial-para-protocolos/'
            
        # Reubicación de subcategorías genéricas residuales
        elif tid == 'profesionales-capacitacion-timbres-notarios':
            t['subcategoria'] = 'Timbres Fiscales y Papel Sellado de Protocolo'
            t['tema'] = 'Capacitación Especializada Notarial'
            
        elif tid == 'profesionales-objeciones-asuntos-juridicos':
            t['subcategoria'] = 'Consultas Jurídico Tributarias'
            t['tema'] = 'Criterios y Doctrina Tributaria'

        # Estandarización de jerarquías y migas de pan limpias (4 niveles canónicos)
        cat = t['categoria']
        subcat = t['subcategoria']
        tramite = t['tramite']
        
        t['migaBreadcrumb'] = f"Profesionales > {cat} > {subcat} > {tramite}"
        t['nivel1_segmento'] = 'Profesionales'
        t['nivel2_area'] = cat
        t['nivel3_subarea'] = subcat
        t['nivel4_tema'] = t.get('tema') or subcat
        t['nivel5_tramite'] = tramite
        t['segmento'] = 'Profesionales'
        t['regimenArea'] = 'Servicios Profesionales y Terceras Personas'
        t['grupoActor'] = cat
        t['controlAuditoria'] = 'APROBADO'

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(filtered_data, f, ensure_ascii=False, indent=2)

print(f"Total trámites guardados: {len(filtered_data)}")

# Verificar conteos por categoría en profesionales
prof_final = [t for t in filtered_data if t.get('pillar') == 'profesionales']
print(f"Total Profesionales consolidado: {len(prof_final)}")
cat_counts = {}
for t in prof_final:
    c = t['categoria']
    s = t['subcategoria']
    cat_counts.setdefault(c, {})
    cat_counts[c][s] = cat_counts[c].get(s, 0) + 1

for c, subs in sorted(cat_counts.items()):
    total_c = sum(subs.values())
    print(f"  {c} ({total_c} trámites):")
    for s, count in sorted(subs.items()):
        print(f"    - {s}: {count}")
