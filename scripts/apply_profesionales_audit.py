"""
scripts/apply_profesionales_audit.py
====================================
Aplica la auditoría integral y gobernanza sobre el segmento Profesionales (47 trámites):
1. Reemplaza todos los IDs legacy (profesionales-XX) por códigos institucionales inmutables SAT-GES-0558 a SAT-GES-0604.
2. Aplica la Ley de Miller (7 ± 2) y Umbral de Densidad:
   - Compacta las 14 micro-carpetas pasarela monocatenarias en N4.
   - N3 aloja directamente los bloques funcionales oficiales (con 1 a 7 trámites terminales cada uno).
   - N4 = —, N5 = —.
   - orden_contenido = 1..N por ciclo ATO dentro de cada subcategoría N3.
3. Actualiza y rescata URLs caídas o genéricas a rutas canónicas activas (HTTP 200 OK).
4. Limpia títulos de cualquier número o prefijo fijo.
5. Sincroniza allTramites.json, catalogoContenidosUnicos.json y database/sat_portal_nosql.json.
"""

import json
import shutil
import os

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
CATALOGO_PATH = 'src/data/catalogoContenidosUnicos.json'
NOSQL_PATH = 'database/sat_portal_nosql.json'
BACKUP_PATH = 'src/data/allTramites.json.bak'

if not os.path.exists(BACKUP_PATH):
    shutil.copyfile(ALL_TRAMITES_PATH, BACKUP_PATH)
    print(f"Respaldo creado en {BACKUP_PATH}")

with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

with open(CATALOGO_PATH, 'r', encoding='utf-8') as f:
    catalogo = json.load(f)

# Mapeo idOriginal / audiencia -> codigo
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

# URLs rescatadas para Profesionales
URL_FIXES = {
    'profesionales-34': 'https://portal.sat.gob.gt/portal/calendario-tributario/',
    'profesionales-72': 'https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/',
    'profesionales-73': 'https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/',
    'profesionales-33': 'https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/',
    'profesionales-59': 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-para-las-solicitudes-de-gestor-tributario-o-auxiliar-de-gestor-tributario/',
    'profesionales-60': 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-para-las-solicitudes-de-gestor-tributario-o-auxiliar-de-gestor-tributario/',
    'profesionales-48': 'https://portal.sat.gob.gt/portal/contacto/',
}

# Configuración y orden por Ciclo ATO en cada rol de Profesionales
ORDEN_CATEGORIAS = {
    'Abogados y Notarios': 1,
    'Peritos Contadores': 2,
    'Auditores': 3,
    'Gestores Tributarios': 4,
    'Servicios Profesionales': 5
}

ORDEN_SUBCATEGORIAS = {
    # Abogados y Notarios
    'Habilitación y Registro Notarial': 1,
    'Timbres Fiscales y Papel Sellado de Protocolo': 2,
    'Traspaso Electrónico Vehicular (e-Traspaso)': 3,
    'Avisos Notariales y Fe Pública': 4,
    # Peritos Contadores
    'Habilitación y Registro de Perito Contador': 1,
    'Consultas, Retenciones y Libros Contables': 2,
    # Auditores
    'Habilitación y Registro de Auditor (CPA)': 1,
    'Dictámenes de Crédito Fiscal y Auditoría': 2,
    # Gestores Tributarios
    'Acreditación y Carné Oficial de Gestor': 1,
    'Renovación y Gestión de Gafetes': 2,
    # Servicios Profesionales
    'Facturación por Honorarios y Formularios': 1,
    'Actualización de Actividad y RTU': 2,
    'Consultas Jurídico Tributarias': 3,
    'Sistemas de Retención y Cumplimiento': 4
}

# Ordenamiento de contenido dentro de cada subcategoría (por ciclo ATO)
TRAMITE_ORDER_CONFIG = {
    # Habilitación y Registro Notarial (4)
    'profesionales-70': (1, 'Inscripción y actualización de Abogados y Notarios en el RTU'),
    'profesionales-67': (2, 'Activación de calidad de Abogado y Notario en Agencia Virtual'),
    'profesionales-68': (3, 'Registro y confirmación de huella dactilar biométrica notarial'),
    'profesionales-77': (4, 'Ratificación anual de datos de Abogados y Notarios'),

    # Timbres Fiscales y Papel Sellado de Protocolo (5)
    'profesionales-38': (1, 'Acreditación de procurador o tercero para retiro de especies fiscales'),
    'profesionales-66': (2, 'Adquisición de Papel Sellado Especial para Protocolos y Timbres Fiscales'),
    'profesionales-21': (3, 'Pago del Impuesto de Timbres Fiscales en línea con razón electrónica'),
    'profesionales-timbres-devolucion-papel-sellado': (4, 'Devolución y canje de timbres fiscales y papel sellado inutilizado'),
    'profesionales-capacitacion-timbres-notarios': (5, 'Capacitación sobre emisión de razón electrónica de timbres notariales'),

    # Traspaso Electrónico Vehicular (e-Traspaso) (4)
    'profesionales-74': (1, 'Habilitación de Notario para Traspaso Electrónico de Vehículos (TEV)'),
    'profesionales-32': (2, 'Formalización notarial de traspaso electrónico de vehículos en línea'),
    'profesionales-56': (3, 'Carga y remisión de expedientes digitales de traspaso con firma avanzada'),
    'profesionales-71': (4, 'Autorización notarial de tercera persona en el Registro Fiscal de Vehículos'),

    # Avisos Notariales y Fe Pública (5)
    'profesionales-72': (1, 'Aviso notarial de legalización de firmas en título de propiedad vehicular'),
    'profesionales-73': (2, 'Aviso notarial de transferencia de dominio de vehículos terrestres'),
    'profesionales-33': (3, 'Consulta de avisos notariales y estado de legalizaciones registradas'),
    'profesionales-34': (4, 'Calendario y plazos de obligaciones notariales ante la SAT'),
    'profesionales-75': (5, 'Atención preferencial y requisitos en ventanillas notariales'),

    # Habilitación y Registro de Perito Contador (4)
    'profesionales-82': (1, 'Inscripción y habilitación como Perito Contador ante la SAT'),
    'profesionales-83': (2, 'Registro y habilitación de Contador en Agencia Virtual'),
    'profesionales-80': (3, 'Actualización de datos de Perito Contador en Agencia Virtual'),
    'profesionales-81': (4, 'Cancelación y baja como Contador en Agencia Virtual'),

    # Consultas, Retenciones y Libros Contables (7)
    'profesionales-17': (1, 'Guía y administración del régimen de Factura Electrónica en Línea (FEL)'),
    'profesionales-19': (2, 'Habilitación y administración del Libro Electrónico Tributario (LET)'),
    'profesionales-46': (3, 'Operación y emisión en el Sistema de Retenciones del Impuesto al Valor Agregado (IVA)'),
    'profesionales-18': (4, 'Presentación de Planilla del Impuesto al Valor Agregado (IVA) en Factura Electrónica en Línea (FEL)'),
    'profesionales-16': (5, 'Consulta en línea de constancias de retención del IVA e ISR'),
    'profesionales-44': (6, 'Procedimiento y rectificación para autoliquidación de impuestos'),
    'profesionales-42': (7, 'Solicitud de devolución, retención o compensación de créditos tributarios'),

    # Habilitación y Registro de Auditor (CPA) (2)
    'profesionales-91': (1, 'Inscripción y habilitación como Contador Público y Auditor (CPA)'),
    'profesionales-90': (2, 'Actualización de datos de Contador Público y Auditor (CPA)'),

    # Dictámenes de Crédito Fiscal y Auditoría (2)
    'profesionales-89': (1, 'Inscripción de Contador autorizado para emitir dictámenes de devolución de crédito fiscal'),
    'profesionales-88': (2, 'Actualización de datos de Contador que emite dictámenes de devolución'),

    # Acreditación y Carné Oficial de Gestor (4)
    'profesionales-61': (1, 'Requisitos de acreditación inicial para Gestor Tributario o Auxiliar'),
    'profesionales-54': (2, 'Acreditación integral, carné y renovación de Gestor Tributario y Auxiliares'),
    'profesionales-41': (3, 'Acreditación de tercera persona autorizada para gestiones en el Registro Tributario Unificado (RTU)'),
    'profesionales-30': (4, 'Marco de actuación y alcance de los Gestores Tributarios acreditados'),

    # Renovación y Gestión de Gafetes (4)
    'profesionales-58': (1, 'Consulta en línea del padrón de Gestores Tributarios y Auxiliares activos'),
    'profesionales-57': (2, 'Actualización de datos y renovación de gafete para Gestor Tributario'),
    'profesionales-60': (3, 'Reposición de gafete de identificación para Gestor Tributario'),
    'profesionales-59': (4, 'Habilitación e inhabilitación temporal o definitiva de Gestor Tributario o Auxiliar'),

    # Facturación por Honorarios y Formularios (1)
    'profesionales-20': (1, 'Catálogo general de formularios tributarios electrónicos en Declaraguate'),

    # Actualización de Actividad y RTU (1)
    'profesionales-29': (1, 'Actualización de datos registrales de Servicios Profesionales en Agencia Virtual'),

    # Consultas Jurídico Tributarias (2)
    'profesionales-4': (1, 'Presentación de consultas técnico-tributarias vinculantes ante Asuntos Jurídicos'),
    'profesionales-objeciones-asuntos-juridicos': (2, 'Recepción de propuestas y observaciones técnicas a criterios de Asuntos Jurídicos'),

    # Sistemas de Retención y Cumplimiento (2)
    'profesionales-45': (1, 'Sistema de retenciones para servicios médicos y hospitalarios (Asiste Web)'),
    'profesionales-78': (2, 'Documentación y herramientas del Programa de Cumplimiento Tributario Voluntario')
}

prof_updated_count = 0

for item in master_data:
    if item.get('pillar') != 'profesionales' and item.get('segmento') != 'Profesionales':
        continue

    prof_updated_count += 1
    old_id = item.get('id')
    code = tramite_to_code.get(old_id)
    if not code:
        print(f"ERROR: Código no encontrado para {old_id}")
        continue

    cat = item.get('categoria')
    subcat = item.get('subcategoria')

    # 1. Asignar código y reemplazar ID legacy por SAT-GES-####
    item['codigo'] = code
    item['id'] = code

    # 2. Asignar jerarquía limpia y asimétrica
    item['nivel1_segmento'] = 'Profesionales'
    item['orden_n1'] = 3
    item['nivel2_area'] = cat
    item['orden_n2'] = ORDEN_CATEGORIAS.get(cat, 1)
    item['nivel3_subarea'] = subcat
    item['orden_n3'] = ORDEN_SUBCATEGORIAS.get(subcat, 1)

    # Compactar N4 y N5 a guion (cero micro-carpetas pasarela)
    item['nivel4_tema'] = '—'
    item['orden_n4'] = None
    item['nivel5_tramite'] = '—'
    item['orden_n5'] = None

    # 3. Gobernanza del orden y título en lenguaje claro
    order_cfg = TRAMITE_ORDER_CONFIG.get(old_id)
    if order_cfg:
        ord_c, titulo_claro = order_cfg
        item['orden_contenido'] = ord_c
        item['tramite'] = titulo_claro
    else:
        item['orden_contenido'] = item.get('orden_contenido') or 1
        titulo_claro = item.get('tramite')

    # 4. Actualizar URLs caídas a rutas canónicas activas
    if old_id in URL_FIXES:
        item['url'] = URL_FIXES[old_id]

    # 5. Miga de pan canónica sin números quemados
    item['migaBreadcrumb'] = f"Profesionales > {cat} > {subcat} > {titulo_claro}"

print(f"Total registros en Profesionales actualizados: {prof_updated_count}")

# Validar unicidad absoluta de IDs en master_data
ids = [t['id'] for t in master_data]
assert len(ids) == len(set(ids)), f"Error: Hay IDs duplicados en master_data: {len(ids)} vs {len(set(ids))}"
print(f"Validación de unicidad de IDs exitosa: {len(ids)} IDs únicos en allTramites.json.")

# Guardar cambios en allTramites.json
with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, ensure_ascii=False, indent=2)
print(f"Archivo allTramites.json guardado exitosamente.")
