import subprocess
import json
import re

# 1. Cargar allTramites.json actual
with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    curr_all = json.load(f)

non_ce = [t for t in curr_all if t.get('pillarName') != 'Operadores de Comercio Exterior']
print(f"Non-CE tramites en dataset actual: {len(non_ce)}")

# 2. Cargar los 246 items de Comercio Exterior de f7055f4
raw_246 = subprocess.check_output(['git', 'show', 'f7055f4:src/data/allTramites.json'], text=True, encoding='utf-8')
data_246 = json.loads(raw_246)
ce_246 = [t for t in data_246 if t.get('pillarName') == 'Operadores de Comercio Exterior']
print(f"CE tramites en f7055f4: {len(ce_246)}")

# 3. Base legal function (de scripts/assign_base_legal.py)
def get_base_legal(item):
    cat = item.get('categoria', '')
    subcat = item.get('subcategoria', '')
    tema = item.get('tema', '')
    tramite = item.get('tramite', '')
    text = f"{cat} {subcat} {tema} {tramite}".lower()

    if 'almacenes generales de depósito' in text or 'bonos de prenda' in text or 'títulos de crédito' in text or 'decreto 1236' in text:
        return "Decreto 1236 (Ley de Almacenes Generales de Depósito) y RECAUCA IV Art. 119."
    if 'zdeep' in text or 'zonas de desarrollo' in text or 'polígono' in text or 'garita' in text:
        return "Decreto 22-73 (Ley Orgánica de ZOLIC / ZDEEP), CAUCA IV y RECAUCA IV."
    if 'decreto 29-89' in text or 'maquila' in text:
        return "Decreto 29-89 (Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila)."
    if 'crédito fiscal' in text or ('devolución' in text and 'iva' in text):
        return "Decreto 27-92 (Ley del IVA, Arts. 23 al 25 bis) y Acuerdo de Directorio SAT 07-2007."
    if 'oea' in text or 'operador económico autorizado' in text:
        return "Marco Normativo SAFE de la Organización Mundial de Aduanas (OMA) y Acuerdos de Directorio SAT."
    if 'courier' in text or 'entrega rápida' in text:
        return "CAUCA IV y RECAUCA IV (Arts. 574 al 596, Régimen de Envíos de Entrega Rápida o Courier)."
    if 'transportistas' in text or 'marchamo' in text or 'atc' in text or 'cuscar' in text:
        return "CAUCA IV (Arts. 18 al 28), RECAUCA IV (Tránsito Aduanero Internacional Terrestre) y Ley de Aduanas."
    if 'agentes aduaneros' in text:
        return "CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas."
    if 'apoderados especiales' in text:
        return "CAUCA IV y RECAUCA IV (Arts. 86 al 90, Apoderados Especiales Aduaneros)."
    if 'almacenes fiscales' in text or 'depósitos fiscales' in text or 'permanencia' in text:
        return "CAUCA IV y RECAUCA IV (Arts. 119 al 129, Régimen de Depósito Aduanero o Fiscal)."
    if 'depósitos aduaneros temporales' in text or 'dat' in text:
        return "CAUCA IV y RECAUCA IV (Depósitos Aduaneros Temporales en puertos y aeropuertos)."
    if 'duca' in text or 'declaración de mercancías' in text or 'declaración anticipada' in text:
        return "Resolución COMIECO 409-2018 (Régimen DUCA), CAUCA IV y RECAUCA IV."
    if 'arancel' in text or 'sac' in text or 'clasificación' in text:
        return "Convenio sobre el Régimen Arancelario y Aduanero Centroamericano (SAC) y Ley de Aduanas."
    if 'solvencia fiscal' in text:
        return "Código Tributario, Decreto 6-91 del Congreso de la República (Art. 57 'A')."
    if 'rtu' in text:
        return "Código Tributario, Decreto 6-91 (Art. 120) y Acuerdo de Directorio SAT 08-2020."
    if 'vehículos' in text or 'iprima' in text:
        return "Decreto 10-2012 (Ley de Actualización Tributaria, Libro II - IPRIMA) y Decreto 70-94."
    if 'recursos' in text or 'sanciones' in text:
        return "CAUCA IV, RECAUCA IV (Procedimiento Sancionatorio e Impugnaciones) y Ley Nacional de Aduanas."
    return "Código Aduanero Uniforme Centroamericano (CAUCA IV) y su Reglamento (RECAUCA IV)."

# 4. Homologar y enriquecer cada uno de los 246 ítems según reglas del usuario
enriched_ce = []
for item in ce_246:
    t = dict(item)
    cat_orig = t.get('categoria', '')
    
    # Normalización de categorías canónicas
    if cat_orig == 'OEA':
        cat = 'Operador Económico Autorizado (OEA)'
    elif cat_orig == 'Courier':
        cat = 'Empresas de Entrega Rápida o Courier'
    elif cat_orig == 'Transportistas':
        cat = 'Transportistas Aduaneros'
    elif cat_orig in ['Depósitos Aduaneros Temporales', 'Almacenadoras Generales', 'Almacenes Fiscales']:
        cat = 'Depósitos Aduaneros'
    elif cat_orig == 'ZDEEP Administradoras':
        cat = 'ZDEEP - Entidades Administradoras'
    elif cat_orig == 'ZDEEP Usuarios':
        cat = 'ZDEEP - Empresas Usuarias'
    else:
        cat = cat_orig

    t['categoria'] = cat

    # Nivel 2 y Miga de Pan conforme a instrucciones de la mesa:
    # 1. OEA en Nivel 2
    # 2. Importadores en Nivel 2 (sin bloque compartido)
    # 3. Exportadores en Nivel 2
    # 4. AFPA sin prefijo numérico
    # 5. Regímenes Territoriales y Zonas Especiales
    # 6. Normativa y Operaciones Aduaneras Generales

    miga_raw = t.get('migaBreadcrumb', '')
    miga_parts = [p.strip() for p in miga_raw.split('>') if p.strip()]

    # Reestructurar la miga para garantizar N2 oficial
    tramite_title = t.get('tramite', '').strip()
    
    if cat == 'Importadores':
        n2 = 'Importadores'
        # Quitar 'Importadores y Exportadores' y 'Importadores' duplicados si existen
        sub_parts = [p for p in miga_parts[1:-1] if p not in ['Importadores y Exportadores', 'Importadores']]
        if not sub_parts:
            sub_parts = [t.get('subcategoria') or t.get('tema') or 'Gestiones de Importación']
        new_parts = ['Operadores de Comercio Exterior', n2] + sub_parts + [tramite_title]
    elif cat == 'Exportadores':
        n2 = 'Exportadores'
        sub_parts = [p for p in miga_parts[1:-1] if p not in ['Importadores y Exportadores', 'Exportadores']]
        if not sub_parts:
            sub_parts = [t.get('subcategoria') or t.get('tema') or 'Gestiones de Exportación']
        new_parts = ['Operadores de Comercio Exterior', n2] + sub_parts + [tramite_title]
    elif cat == 'Operador Económico Autorizado (OEA)':
        n2 = 'Operador Económico Autorizado (OEA)'
        sub_parts = [p for p in miga_parts[1:-1] if p not in ['Auxiliares de la Función Pública Aduanera (AFPA)', 'Operador Económico Autorizado (OEA)']]
        if not sub_parts:
            sub_parts = ['Habilitación y Certificación']
        new_parts = ['Operadores de Comercio Exterior', n2] + sub_parts + [tramite_title]
    elif cat in ['Agentes Aduaneros', 'Apoderados Especiales Aduaneros', 'Empresas de Entrega Rápida o Courier', 'Transportistas Aduaneros', 'Depósitos Aduaneros']:
        n2 = 'Auxiliares de la Función Pública Aduanera (AFPA)'
        # Mantener actor como N3
        sub_parts = [p for p in miga_parts[1:-1] if p not in ['Auxiliares de la Función Pública Aduanera (AFPA)']]
        if not sub_parts or sub_parts[0] != cat:
            sub_parts = [cat] + [p for p in sub_parts if p != cat]
        new_parts = ['Operadores de Comercio Exterior', n2] + sub_parts + [tramite_title]
    elif cat in ['ZDEEP - Entidades Administradoras', 'ZDEEP - Empresas Usuarias', 'Maquilas y Perfeccionamiento Activo']:
        n2 = 'Regímenes Territoriales y Zonas Especiales'
        sub_parts = [p for p in miga_parts[1:-1] if p not in ['Regímenes Territoriales y Zonas Especiales']]
        if not sub_parts:
            sub_parts = [cat]
        new_parts = ['Operadores de Comercio Exterior', n2] + sub_parts + [tramite_title]
    elif cat == 'Normativa y Aranceles':
        n2 = 'Normativa y Operaciones Aduaneras Generales'
        sub_parts = [p for p in miga_parts[1:-1] if p not in ['Normativa y Operaciones Aduaneras Generales']]
        if not sub_parts:
            sub_parts = ['Normativa y Aranceles']
        new_parts = ['Operadores de Comercio Exterior', n2] + sub_parts + [tramite_title]
    else:
        n2 = miga_parts[1] if len(miga_parts) > 1 else cat
        new_parts = miga_parts

    # Limpiar duplicidades consecutivas en new_parts
    cleaned_parts = [new_parts[0]]
    for p in new_parts[1:]:
        if p != cleaned_parts[-1]:
            cleaned_parts.append(p)

    t['migaBreadcrumb'] = ' > '.join(cleaned_parts)
    t['nivel1_segmento'] = 'Operadores de Comercio Exterior'
    t['nivel2_area'] = n2
    t['regimenArea'] = n2
    t['segmento'] = 'Operadores de Comercio Exterior'

    # Asignar campos enriquecidos faltantes
    if not t.get('baseLegal'):
        t['baseLegal'] = get_base_legal(t)
    if not t.get('controlAuditoria'):
        t['controlAuditoria'] = 'BRECHA' if t.get('esBrecha') else 'APROBADO'
    if not t.get('tipologiaContenido'):
        t['tipologiaContenido'] = 'tramite_transaccional' if t.get('tipoInteraccion') == 'servicio_transaccional' else 'guia_informativa'
    if not t.get('tipologiaContenidoLabel'):
        t['tipologiaContenidoLabel'] = 'Trámite / Aplicativo en Línea' if t.get('tipoInteraccion') == 'servicio_transaccional' else 'Guía Informativa / Texto'
    if not t.get('plataformaSistema'):
        t['plataformaSistema'] = 'portal_web'
    if not t.get('plataformaSistemaLabel'):
        t['plataformaSistemaLabel'] = 'Portal Web SAT'
    if not t.get('canalAtencion'):
        t['canalAtencion'] = 'Digital / Web'

    enriched_ce.append(t)

print(f"Total CE procesados: {len(enriched_ce)}")

# 5. Generar allTramites definitivo (472 + 246 = 718 registros)
full_data = non_ce + enriched_ce
print(f"Total registros finales allTramites: {len(full_data)}")

with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
    json.dump(full_data, f, indent=2, ensure_ascii=False)

print("src/data/allTramites.json actualizado con éxito con los 246 trámites de Comercio Exterior.")
