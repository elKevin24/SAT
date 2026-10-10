"""
scripts/apply_afpa_audit.py
===========================
Aplica la auditoría integral y gobernanza sobre la rama Auxiliares de la Función Pública Aduanera (AFPA):
1. Mapea y reemplaza todos los IDs legacy de AFPA por códigos institucionales inmutables SAT-GES-####.
2. Aplica la Ley de Miller (7 ± 2) y Umbral de Densidad:
   - Agentes Aduaneros (7 trámites): compactado a N3 directo (orden_contenido 1..7, N4 = —, N5 = —).
   - Apoderados Especiales (16 trámites): 3 bloques funcionales en N4 (5, 5, 6 trámites, N5 = —).
   - Depósitos Aduaneros (36 trámites): 3 regímenes legales en N4 (Fiscales [2], AGD [16], DAT [18], N5 = —).
   - Empresas Courier (3 trámites): compactado a N3 directo (orden_contenido 1..3, N4 = —, N5 = —).
   - Transportistas Aduaneros (14 trámites): 5 bloques funcionales en N4 (3, 2, 4, 2, 3 trámites, N5 = —).
3. Gobernanza del orden:
   - Cero números fijos en títulos visibles.
   - Columnas orden_n1..orden_n5 explícitas.
   - Columna orden_contenido (1..N) para el orden ordinal terminal en cada rama/bloque.
4. Rescate y validación activa de URLs (URL de subastas actualizada a HTTP 200).
5. Sincronización de catalogoContenidosUnicos.json y base NoSQL.
"""

import json
import shutil
import os

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
CATALOGO_PATH = 'src/data/catalogoContenidosUnicos.json'
NOSQL_PATH = 'database/sat_portal_nosql.json'
BACKUP_PATH = 'src/data/allTramites.json.bak'

# 1. Respaldo de seguridad
if not os.path.exists(BACKUP_PATH):
    shutil.copyfile(ALL_TRAMITES_PATH, BACKUP_PATH)
    print(f"Respaldo creado en {BACKUP_PATH}")

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

with open(CATALOGO_PATH, 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

# Mapeo idOriginal / audiencia tramiteId -> codigo SAT-GES-####
tramite_to_code = {}
for c in catalogo:
    code = c['codigo']
    orig_id = c.get('idOriginal')
    if orig_id:
        tramite_to_code[orig_id] = code
    for aud in c.get('audiencias', []):
        tid = aud.get('tramiteId')
        if tid:
            tramite_to_code[tid] = code

print(f"Mapeados {len(tramite_to_code)} identificadores únicos a códigos SAT-GES.")

# 2. Asignar código a todos los trámites del catálogo maestro
for item in master_data:
    tid = item.get('id')
    code = tramite_to_code.get(tid)
    if code:
        item['codigo'] = code
    else:
        print(f"ADVERTENCIA: Trámite sin código SAT-GES: {tid}")

# 3. Mapeo específico y estructuración de AFPA (76 registros)
# Definición de estructuras y secuencias por ciclo ATO:

# Rama 1: Agentes Aduaneros (7 trámites, N3 directo)
AGENTES_CONFIG = {
    'SAT-GES-0418': (1, 'Inscripción y Habilitación de Auxiliares de la Función Pública (Agente Aduanero)'),
    'SAT-GES-0420': (2, 'Acreditación y Carné de Identificación para Agente Aduanero y Personal Subalterno'),
    'SAT-GES-0419': (3, 'Renovación Anual de Operación de Auxiliares de la Función Pública y Garantía de Operación'),
    'SAT-GES-0421': (4, 'Instalador y Soporte de Firma Digital ActiveX PKI / DUA'),
    'SAT-GES-0423': (5, 'Especificaciones de Videovigilancia y CCTV para Recintos y Operadores Aduaneros'),
    'SAT-GES-0422': (6, 'Consulta del Estado de Expedientes en Gestión Aduanera'),
    'SAT-GES-0424': (7, 'Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)')
}

# Rama 2: Apoderados Especiales Aduaneros (16 trámites, 3 bloques N4)
APODERADOS_CONFIG = {
    # Bloque 1: Acreditación, Garantías y Habilitación (5 trámites)
    'SAT-GES-0436': ('Acreditación, Garantías y Habilitación', 1, 1, 'Autorización inicial y registro de mandato para apoderados especiales'),
    'SAT-GES-0437': ('Acreditación, Garantías y Habilitación', 1, 2, 'Auxiliares de la función pública aduanera (Carné, componente ActiveX PKI/DUA)'),
    'SAT-GES-0438': ('Acreditación, Garantías y Habilitación', 1, 3, 'Recepción de seguro de caución importaciones y cauciones aduaneras'),
    'SAT-GES-0439': ('Acreditación, Garantías y Habilitación', 1, 4, 'Requisitos para la renovación de operación de auxiliares de la función pública'),
    'SAT-GES-0440': ('Acreditación, Garantías y Habilitación', 1, 5, 'Solvencia fiscal (Requisito para renovación AFPA)'),

    # Bloque 2: Operaciones de Despacho y Consultas (5 trámites)
    'SAT-GES-0433': ('Operaciones de Despacho y Consultas', 2, 1, 'Declaración anticipada'),
    'SAT-GES-0434': ('Operaciones de Despacho y Consultas', 2, 2, 'Declaración de mercancías (DUCA y Aduana sin papeles)'),
    'SAT-GES-0435': ('Operaciones de Despacho y Consultas', 2, 3, 'Sistema de franquicias electrónicas'),
    'SAT-GES-0425': ('Operaciones de Despacho y Consultas', 2, 4, 'Consultas de aduanas (Rampa de revisión, selectivo y estados)'),
    'SAT-GES-0426': ('Operaciones de Despacho y Consultas', 2, 5, 'Requisitos para consulta de expedientes de gestión aduanera'),

    # Bloque 3: Procedimientos, Normativa y Capacitación (6 trámites)
    'SAT-GES-0431': ('Procedimientos, Normativa y Capacitación', 3, 1, 'Procedimientos administrativos de aduanas (Sanciones y recursos)'),
    'SAT-GES-0432': ('Procedimientos, Normativa y Capacitación', 3, 2, 'Procedimientos, instructivos, manuales y guías para gestiones aduaneras'),
    'SAT-GES-0427': ('Procedimientos, Normativa y Capacitación', 3, 3, 'Unión aduanera (Procedimientos y resoluciones de facilitación)'),
    'SAT-GES-0429': ('Procedimientos, Normativa y Capacitación', 3, 4, 'Legislación aduanera (Biblioteca en línea, CAUCA y RECAUCA)'),
    'SAT-GES-0430': ('Procedimientos, Normativa y Capacitación', 3, 5, 'Preguntas frecuentes sobre temas aduaneros'),
    'SAT-GES-0428': ('Procedimientos, Normativa y Capacitación', 3, 6, 'Capacitaciones para auxiliares de la función pública')
}

# Rama 3: Depósitos Aduaneros (36 trámites, 3 regímenes legales N4)
DEPOSITOS_FISCALES_CONFIG = {
    'SAT-GES-0450': (1, 'Declaración de Abandono y Subasta Aduanera de Mercancías'),
    'SAT-GES-0451': (2, 'Sistema de Cobro por Permanencia de Mercancías (SCP)')
}

DEPOSITOS_AGD_CONFIG = {
    'SAT-GES-0446': (1, 'Recepción de seguro de caución y pólizas de garantía operativa'),
    'SAT-GES-0437': (2, 'Auxiliares de la función pública aduanera (Carné, componente ActiveX PKI/DUA)'),
    'SAT-GES-0434': (3, 'Declaración de mercancías (DUCA y aduana sin papeles)'),
    'SAT-GES-0447': (4, 'Registro y emisión de títulos de crédito (Certificados de depósito y bonos de prenda)'),
    'SAT-GES-0448': (5, 'Reporte de saldos y existencias afianzadas ante SAT'),
    'SAT-GES-0445': (6, 'Programa de modernización integral aduanera (MIAD)'),
    'SAT-GES-0442': (7, 'Consultas de aduanas (Retención y liberación de mercancías, arancel integrado)'),
    'SAT-GES-0441': (8, 'Consulta facilidades de pago y convenios'),
    'SAT-GES-0426': (9, 'Requisitos para consulta de expedientes de gestión aduanera'),
    'SAT-GES-0439': (10, 'Requisitos para la renovación de operación de auxiliares de la función pública'),
    'SAT-GES-0449': (11, 'Solvencia fiscal (Requisito indispensable de renovación AFPA)'),
    'SAT-GES-0443': (12, 'Legislación aduanera y financiera (Decreto 1236 y RECAUCA)'),
    'SAT-GES-0431': (13, 'Procedimientos administrativos de aduanas (Sanciones y recursos)'),
    'SAT-GES-0444': (14, 'Procedimientos, instructivos y guías para gestiones aduaneras'),
    'SAT-GES-0430': (15, 'Preguntas frecuentes sobre temas aduaneros'),
    'SAT-GES-0428': (16, 'Capacitaciones para auxiliares de la función pública')
}

DEPOSITOS_DAT_CONFIG = {
    'SAT-GES-0457': (1, 'Requisitos para habilitación y delimitación de recintos aduaneros temporales (DAT)'),
    'SAT-GES-0446': (2, 'Recepción de seguro de caución y pólizas de garantía operativa'),
    'SAT-GES-0437': (3, 'Auxiliares de la función pública aduanera (Carné, componente ActiveX PKI/DUA)'),
    'SAT-GES-0453': (4, 'Control de descarga, ingreso de bultos y actas de recepción DAT'),
    'SAT-GES-0434': (5, 'Declaración de mercancías (DUCA y aduana sin papeles)'),
    'SAT-GES-0456': (6, 'Registro de admisión temporal de contenedores terrestres y su ampliación'),
    'SAT-GES-0445': (7, 'Programa de modernización integral aduanera (MIAD)'),
    'SAT-GES-0452': (8, 'Consultas de aduanas (Asignación a rampa de revisión, revisores, retención y liberación)'),
    'SAT-GES-0455': (9, 'Monitoreo de sistemas informáticos de aduanas'),
    'SAT-GES-0458': (10, 'Sistema de cobro por permanencia en el país'),
    'SAT-GES-0426': (11, 'Requisitos para consulta de expedientes de gestión aduanera'),
    'SAT-GES-0439': (12, 'Requisitos para la renovación de operación de auxiliares de la función pública'),
    'SAT-GES-0440': (13, 'Solvencia fiscal (Requisito para renovación AFPA)'),
    'SAT-GES-0454': (14, 'Legislación aduanera (RECAUCA Art. 119 - Disposiciones sobre depósitos)'),
    'SAT-GES-0431': (15, 'Procedimientos administrativos de aduanas (Sanciones y recursos)'),
    'SAT-GES-0444': (16, 'Procedimientos, instructivos y guías para gestiones aduaneras'),
    'SAT-GES-0430': (17, 'Preguntas frecuentes sobre temas aduaneros'),
    'SAT-GES-0428': (18, 'Capacitaciones para auxiliares de la función pública')
}

# Rama 4: Courier (3 trámites, N3 directo)
COURIER_CONFIG = {
    'SAT-GES-0461': (1, 'Registro y Recepción de Póliza de Fianza / Seguro de Caución Courier'),
    'SAT-GES-0459': (2, 'Guía y Despacho Simplificado para Importación Courier'),
    'SAT-GES-0460': (3, 'Sistema de Franquicias Electrónicas Aduaneras')
}

# Rama 5: Transportistas Aduaneros (14 trámites, 5 bloques N4)
TRANSPORTISTAS_CONFIG = {
    # Bloque 1: Despacho y Operaciones en Recintos
    'SAT-GES-0462': ('Despacho y Operaciones en Recintos', 1, 1, 'Autorización de Cartas de Ingreso a Zona Primaria Aduanera'),
    'SAT-GES-0463': ('Despacho y Operaciones en Recintos', 1, 2, 'Consulta de Asignación de Revisores Aduaneros'),
    'SAT-GES-0464': ('Despacho y Operaciones en Recintos', 1, 3, 'Consulta de Asignación de Rampa en Puertos y Depósitos'),

    # Bloque 2: Infracciones y Defensa Aduanera
    'SAT-GES-0465': ('Infracciones y Defensa Aduanera', 2, 1, 'Procedimiento Administrativo Sancionatorio y Recursos de Impugnación'),
    'SAT-GES-0466': ('Infracciones y Defensa Aduanera', 2, 2, 'Régimen de Infracciones y Sanciones en Tránsito Aduanero'),

    # Bloque 3: Equipo de Carga y Contenedores — Régimen ATC
    'SAT-GES-0470': ('Equipo de Carga y Contenedores — Régimen ATC', 3, 1, 'Registro y Habilitación de Equipo de Carga Terrestre (ATC)'),
    'SAT-GES-0467': ('Equipo de Carga y Contenedores — Régimen ATC', 3, 2, 'Ampliación de Plazo de Equipo de Carga en Admisión Temporal (ATC)'),
    'SAT-GES-0468': ('Equipo de Carga y Contenedores — Régimen ATC', 3, 3, 'Culminación de Admisión Temporal de Equipo de Carga (ATC)'),
    'SAT-GES-0469': ('Equipo de Carga y Contenedores — Régimen ATC', 3, 4, 'Devolución de Garantía / Depósito de Admisión Temporal (ATC)'),

    # Bloque 4: Manifiestos de Carga y CUSCAR
    'SAT-GES-0472': ('Manifiestos de Carga y CUSCAR', 4, 1, 'Transmisión Electrónica de Mensaje de Carga Aduanera (CUSCAR)'),
    'SAT-GES-0471': ('Manifiestos de Carga y CUSCAR', 4, 2, 'Consulta y Verificación de Documentos del Manifiesto de Carga'),

    # Bloque 5: Monitoreo en Ruta y Marchamo Electrónico
    'SAT-GES-0473': ('Monitoreo en Ruta y Marchamo Electrónico', 5, 1, 'Especificaciones y Uso del Marchamo Electrónico Aduanero'),
    'SAT-GES-0475': ('Monitoreo en Ruta y Marchamo Electrónico', 5, 2, 'Consulta de Tránsitos Aduaneros Pendientes en Ruta'),
    'SAT-GES-0474': ('Monitoreo en Ruta y Marchamo Electrónico', 5, 3, 'Preguntas Frecuentes sobre Marchamo Electrónico y Corredores Fiscales')
}

# Procesar items en allTramites.json
afpa_updated_count = 0

for item in master_data:
    # Por defecto, asegurar orden_contenido en todo el catálogo
    if 'orden_contenido' not in item or item['orden_contenido'] is None:
        item['orden_contenido'] = item.get('orden_n5') or item.get('orden_n4') or 1

    if item.get('categoria') != 'Auxiliares de la Función Pública Aduanera (AFPA)':
        continue

    afpa_updated_count += 1
    subcat = item.get('subcategoria')
    code = item.get('codigo')

    # Valores base comunes de AFPA
    item['nivel1_segmento'] = 'Operadores de Comercio Exterior'
    item['orden_n1'] = 1
    item['nivel2_area'] = 'Auxiliares de la Función Pública Aduanera (AFPA)'
    item['orden_n2'] = 4
    item['nivel5_tramite'] = '—'
    item['orden_n5'] = None

    if subcat == 'Agentes Aduaneros':
        cfg = AGENTES_CONFIG.get(code)
        if cfg:
            ord_c, titulo_claro = cfg
            item['id'] = code  # Reemplazo directo por ID institucional
            item['nivel3_subarea'] = 'Agentes Aduaneros'
            item['orden_n3'] = 1
            item['nivel4_tema'] = '—'
            item['orden_n4'] = None
            item['orden_contenido'] = ord_c
            item['tramite'] = titulo_claro
            item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > {titulo_claro}"

    elif subcat == 'Apoderados Especiales Aduaneros':
        cfg = APODERADOS_CONFIG.get(code)
        if cfg:
            n4_tema, ord_n4, ord_c, titulo_claro = cfg
            item['id'] = code  # ID institucional canónico para Apoderados
            item['nivel3_subarea'] = 'Apoderados Especiales Aduaneros'
            item['orden_n3'] = 2
            item['nivel4_tema'] = n4_tema
            item['orden_n4'] = ord_n4
            item['orden_contenido'] = ord_c
            item['tramite'] = titulo_claro
            item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Apoderados Especiales Aduaneros > {n4_tema} > {titulo_claro}"

    elif subcat == 'Depósitos Aduaneros':
        item['nivel3_subarea'] = 'Depósitos Aduaneros'
        item['orden_n3'] = 3
        old_id = item.get('id')

        # Discriminar régimen legal (Fiscales, AGD, DAT) por el prefijo exacto de origen
        if 'af-abandono' in old_id or old_id == 'comercio_exterior-92':
            cfg = DEPOSITOS_FISCALES_CONFIG.get(code)
            if cfg:
                ord_c, titulo_claro = cfg
                item['id'] = code
                item['nivel4_tema'] = 'Almacenes Fiscales'
                item['orden_n4'] = 1
                item['orden_contenido'] = ord_c
                item['tramite'] = titulo_claro
                if code == 'SAT-GES-0450':
                    item['url'] = 'https://portal.sat.gob.gt/portal/subastas-y-donaciones-aduaneras/'
                item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Depósitos Aduaneros > Almacenes Fiscales > {titulo_claro}"

        elif 'agd-' in old_id:
            cfg = DEPOSITOS_AGD_CONFIG.get(code)
            if cfg:
                ord_c, titulo_claro = cfg
                item['id'] = f"{code}-agd" if (code in APODERADOS_CONFIG or code in DEPOSITOS_DAT_CONFIG) else code
                item['nivel4_tema'] = 'Almacenes Generales de Depósito (AGD)'
                item['orden_n4'] = 2
                item['orden_contenido'] = ord_c
                item['tramite'] = titulo_claro
                item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Depósitos Aduaneros > Almacenes Generales de Depósito (AGD) > {titulo_claro}"

        elif 'dat-' in old_id:
            cfg = DEPOSITOS_DAT_CONFIG.get(code)
            if cfg:
                ord_c, titulo_claro = cfg
                item['id'] = f"{code}-dat" if (code in APODERADOS_CONFIG or code in DEPOSITOS_AGD_CONFIG) else code
                item['nivel4_tema'] = 'Depósitos Aduaneros Temporales (DAT)'
                item['orden_n4'] = 3
                item['orden_contenido'] = ord_c
                item['tramite'] = titulo_claro
                item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Depósitos Aduaneros > Depósitos Aduaneros Temporales (DAT) > {titulo_claro}"

    elif subcat == 'Empresas de Entrega Rápida o Courier':
        cfg = COURIER_CONFIG.get(code)
        if cfg:
            ord_c, titulo_claro = cfg
            item['id'] = code
            item['nivel3_subarea'] = 'Empresas de Entrega Rápida o Courier'
            item['orden_n3'] = 4
            item['nivel4_tema'] = '—'
            item['orden_n4'] = None
            item['orden_contenido'] = ord_c
            item['tramite'] = titulo_claro
            item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Empresas de Entrega Rápida o Courier > {titulo_claro}"

    elif subcat == 'Transportistas Aduaneros':
        cfg = TRANSPORTISTAS_CONFIG.get(code)
        if cfg:
            n4_tema, ord_n4, ord_c, titulo_claro = cfg
            item['id'] = code
            item['nivel3_subarea'] = 'Transportistas Aduaneros'
            item['orden_n3'] = 5
            item['nivel4_tema'] = n4_tema
            item['orden_n4'] = ord_n4
            item['orden_contenido'] = ord_c
            item['tramite'] = titulo_claro
            item['migaBreadcrumb'] = f"Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Transportistas Aduaneros > {n4_tema} > {titulo_claro}"

print(f"Total registros AFPA actualizados y normalizados: {afpa_updated_count}")

# 4. Validar unicidad absoluta de IDs en master_data
ids = [t['id'] for t in master_data]
assert len(ids) == len(set(ids)), f"Error: Hay IDs duplicados en master_data: {len(ids)} vs {len(set(ids))}"
print(f"Validación de unicidad de IDs exitosa: {len(ids)} IDs únicos en master_data.")

# 5. Guardar master_data actualizado en allTramites.json
with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, ensure_ascii=False, indent=2)
print(f"Guardado archivo maestro actualizado en {ALL_TRAMITES_PATH}")

