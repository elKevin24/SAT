"""
Script de aplicacion del Plan de Accion de Auditoria de IA:
1. Saneamiento de metadatos faltantes en Entes Exentos (tipologiaContenido, plataformaSistema, canalAtencion).
2. Compactacion anti-pasarela en Contribuyentes Especiales (de 5 niveles a N3 directo, N4/N5 en em-dash).
3. Compactacion de Municipalidades (de N3 pasarela a N2 directo, N3/N4/N5 en em-dash).
"""

import json

JSON_PATH = 'src/data/allTramites.json'

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Cargados {len(items)} trámites.")

# 1. Contribuyentes Especiales
ce_count = 0
for it in items:
    if it.get('categoria') == 'Contribuyentes Especiales':
        ce_count += 1
        subcat = it.get('subcategoria')
        tramite = it.get('tramite', '')
        it['nivel3_subarea'] = subcat
        it['nivel3_subcategoria'] = subcat
        it['nivel4_tema'] = '—'
        it['nivel5_tramite'] = '—'
        if subcat == 'Gerencias Especiales y Control Tributario':
            it['orden_n3'] = 1
        elif subcat == 'Declaraciones e Informes Especiales':
            it['orden_n3'] = 2
        elif 'Capacitaci' in subcat:
            it['orden_n3'] = 3
        else:
            it['orden_n3'] = 1
        it['orden_n4'] = '—'
        it['orden_n5'] = '—'
        it['migaBreadcrumb'] = f"Contribuyentes > Contribuyentes Especiales > {subcat} > {tramite}"

print(f"1. Contribuyentes Especiales compactados: {ce_count} trámites.")

# 2. Municipalidades
muni_count = 0
for it in items:
    if it.get('categoria') == 'Municipalidades':
        muni_count += 1
        tramite = it.get('tramite', '')
        it['subcategoria'] = '—'
        it['nivel3_subarea'] = '—'
        it['nivel3_subcategoria'] = '—'
        it['nivel4_tema'] = '—'
        it['nivel5_tramite'] = '—'
        it['orden_n3'] = '—'
        it['orden_n4'] = '—'
        it['orden_n5'] = '—'
        it['migaBreadcrumb'] = f"Entes Exentos > Municipalidades > {tramite}"

print(f"2. Municipalidades compactadas a N2 directo: {muni_count} trámites.")

# 3. Metadatos Entes Exentos
ee_count = 0
for it in items:
    if it.get('pillar') == 'entes_exentos':
        ee_count += 1
        ti = it.get('tipoInteraccion', '')
        u = it.get('url', '')
        
        if ti == 'servicio_transaccional':
            it['tipologiaContenido'] = 'tramite_interactivo'
            it['tipologiaContenidoLabel'] = 'Trámite Interactivo'
            it['canalAtencion'] = '100% Digital'
        elif ti == 'consulta_datos':
            it['tipologiaContenido'] = 'consulta_buscador'
            it['tipologiaContenidoLabel'] = 'Consulta / Buscador'
            it['canalAtencion'] = '100% Digital'
        elif ti == 'descarga_recurso':
            it['tipologiaContenido'] = 'recurso_descargable'
            it['tipologiaContenidoLabel'] = 'Recurso Descargable'
            it['canalAtencion'] = 'Digital / Web'
        else:
            it['tipologiaContenido'] = 'guia_requisitos'
            it['tipologiaContenidoLabel'] = 'Guía de Requisitos y Pasos'
            it['canalAtencion'] = 'Presencial / Mixto'
            
        if 'farm3.sat.gob.gt' in u or 'agencia-virtual' in u:
            it['plataformaSistema'] = 'agencia_virtual'
            it['plataformaSistemaLabel'] = 'Agencia Virtual'
        elif 'declaraguate' in u:
            it['plataformaSistema'] = 'declaraguate'
            it['plataformaSistemaLabel'] = 'Declaraguate'
        else:
            it['plataformaSistema'] = 'portal_web'
            it['plataformaSistemaLabel'] = 'Portal Web SAT'

print(f"3. Metadatos de Entes Exentos completados: {ee_count} trámites.")

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

print("Dataset src/data/allTramites.json actualizado con éxito.")
