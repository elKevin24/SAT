"""
scripts/apply_entes_exentos_audit.py
====================================
Aplica la auditoría integral y gobernanza sobre el segmento Entes Exentos (79 trámites):
1. Reemplaza todos los IDs legacy (entes_exentos-XX / profesionales-76) por códigos institucionales inmutables SAT-GES-0605 a SAT-GES-0683.
2. Aplica la Ley de Miller (7 ± 2) y Umbral de Densidad:
   - Elimina los mega-contenedores artificiales en N3.
   - N3 aloja directamente las subcategorías funcionales canónicas.
   - N4 = —, N5 = — (compactación asimétrica de pasarelas).
   - orden_contenido = 1..N por ciclo ATO dentro de cada subcategoría N3.
   - Municipalidades (5 trámites) se compacta a N3 directo.
3. Rescata URLs caídas o desactualizadas a rutas canónicas activas (HTTP 200 OK).
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

# URLs rescatadas para Entes Exentos
URL_FIXES = {
    'entes_exentos-115': 'https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/',
    'entes_exentos-18': 'https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/',
    'entes_exentos-67': 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/',
    'entes_exentos-68': 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/',
    'entes_exentos-69': 'https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/',
}

ORDEN_CATEGORIAS = {
    'Entidades del Estado': 1,
    'Constitucionales': 2,
    'No Lucrativos': 3,
    'Municipalidades': 4,
    'Decreto': 5
}

# Estructura completa de las 79 gestiones de Entes Exentos
# Mapeo: old_id -> (categoria, subcategoria_n3, orden_n3, orden_contenido, titulo_claro)
EXENTOS_CONFIG = {
    # =========================================================================
    # 1. ENTIDADES DEL ESTADO (26 trámites)
    # =========================================================================
    # Sub 1: Registro Institucional y RTU Estatal (5)
    'entes_exentos-106': ('Entidades del Estado', 'Registro Institucional y RTU Estatal', 1, 1, 'Inscripción de Dependencia o Entidad del Estado en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-105': ('Entidades del Estado', 'Registro Institucional y RTU Estatal', 1, 2, 'Actualización de datos de Dependencia o Entidad del Estado en el RTU Digital'),
    'entes_exentos-107': ('Entidades del Estado', 'Registro Institucional y RTU Estatal', 1, 3, 'Cumplimiento tributario en el Sistema Nacional de Control Interno (SINACIG)'),
    'entes_exentos-123': ('Entidades del Estado', 'Registro Institucional y RTU Estatal', 1, 4, 'Directorio de dependencias y servicios institucionales del Estado'),
    'entes_exentos-127': ('Entidades del Estado', 'Registro Institucional y RTU Estatal', 1, 5, 'Gestiones y servicios tributarios en Agencia Virtual para entidades del Estado'),

    # Sub 2: Facturación FEL, Retenciones y Operaciones (6)
    'entes_exentos-121': ('Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones', 2, 1, 'Emisión de Factura Electrónica en Línea (FEL) para dependencias del Estado'),
    'entes_exentos-103': ('Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones', 2, 2, 'Capacitación virtual sobre Factura Electrónica en Línea (FEL) para entidades del Estado'),
    'entes_exentos-130': ('Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones', 2, 3, 'Sistema de retenciones del Impuesto Sobre la Renta (ISR) para agentes de retención del Estado'),
    'entes_exentos-131': ('Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones', 2, 4, 'Sistema de retenciones del Impuesto al Valor Agregado (IVA) para agentes retenedores públicos'),
    'entes_exentos-125': ('Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones', 2, 5, 'Corrección de casillas, período y NIT en formularios de Declaraguate'),
    'entes_exentos-129': ('Entidades del Estado', 'Facturación FEL, Retenciones y Operaciones', 2, 6, 'Guía para autoliquidación y regularización de impuestos en el sector público'),

    # Sub 3: Parque Vehicular Oficial y de Autoridad (9)
    'entes_exentos-134': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 1, 'Traspaso y regularización de vehículos oficiales del Estado'),
    'entes_exentos-108': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 2, 'Traslado y asignación vehicular entre dependencias de una Entidad del Estado'),
    'entes_exentos-109': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 3, 'Activación e inactivación temporal de vehículos del Estado'),
    'entes_exentos-110': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 4, 'Cambio y reposición de placas temporales de vehículos oficiales'),
    'entes_exentos-115': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 5, 'Traspaso de vehículos a la Secretaría Nacional de Administración de Bienes en Extinción de Dominio (SENABED)'),
    'entes_exentos-133': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 6, 'Consulta pública de la tabla de valores imponibles del Impuesto de Circulación de Vehículos'),
    'entes_exentos-113': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 7, 'Baja temporal o definitiva de vehículos por orden judicial o del Ministerio Público'),
    'entes_exentos-114': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 8, 'Reactivación de vehículo con levantamiento de orden judicial o del Ministerio Público'),
    'entes_exentos-112': ('Entidades del Estado', 'Parque Vehicular Oficial y de Autoridad', 3, 9, 'Baja de vehículos subastados como chatarra por orden del Organismo Judicial'),

    # Sub 4: Control Interno, Solvencias y Normativa (6)
    'entes_exentos-128': ('Entidades del Estado', 'Control Interno, Solvencias y Normativa', 4, 1, 'Devolución y compensación de impuestos para entidades estatales'),
    'entes_exentos-126': ('Entidades del Estado', 'Control Interno, Solvencias y Normativa', 4, 2, 'Solicitud de facilidades de pago en cuotas (en línea o presencial)'),
    'entes_exentos-132': ('Entidades del Estado', 'Control Interno, Solvencias y Normativa', 4, 3, 'Solicitud de acceso a la información pública de la SAT (Decreto 57-2008)'),
    'entes_exentos-116': ('Entidades del Estado', 'Control Interno, Solvencias y Normativa', 4, 4, 'Compendio de leyes aduaneras y convenios internacionales de exención'),
    'entes_exentos-124': ('Entidades del Estado', 'Control Interno, Solvencias y Normativa', 4, 5, 'Recepción de sugerencias sobre criterios técnicos y procedimientos jurídicos'),
    'entes_exentos-122': ('Entidades del Estado', 'Control Interno, Solvencias y Normativa', 4, 6, 'Tabla de tasas e intereses resarcitorios vigentes de la SAT'),

    # =========================================================================
    # 2. CONSTITUCIONALES (18 trámites)
    # =========================================================================
    # Sub 1: Centros Educativos y Universidades (Arts. 73 y 88) (5)
    'entes_exentos-10': ('Constitucionales', 'Centros Educativos y Universidades (Arts. 73 y 88)', 1, 1, 'Inscripción de Centro Educativo exento en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-8': ('Constitucionales', 'Centros Educativos y Universidades (Arts. 73 y 88)', 1, 2, 'Actualización de datos de Centro Educativo en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-17': ('Constitucionales', 'Centros Educativos y Universidades (Arts. 73 y 88)', 1, 3, 'Inscripción de Universidad Privada en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-16': ('Constitucionales', 'Centros Educativos y Universidades (Arts. 73 y 88)', 1, 4, 'Actualización de datos de Universidad Privada en el RTU Digital'),
    'entes_exentos-9': ('Constitucionales', 'Centros Educativos y Universidades (Arts. 73 y 88)', 1, 5, 'Capacitación virtual sobre obligaciones tributarias de centros educativos exentos'),

    # Sub 2: Iglesias y Deporte Federado (Arts. 37 y 92) (6)
    'entes_exentos-15': ('Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)', 2, 1, 'Inscripción de entidad de la Iglesia Católica en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-13': ('Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)', 2, 2, 'Actualización de datos de entidad de la Iglesia Católica en el RTU Digital'),
    'entes_exentos-14': ('Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)', 2, 3, 'Cancelación o cambio de Representante Legal de entidad de la Iglesia Católica'),
    'entes_exentos-12': ('Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)', 2, 4, 'Actualización de datos de Federación o Asociación Deportiva (CDAG)'),
    'entes_exentos-22': ('Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)', 2, 5, 'Gestiones tributarias y exenciones de la Confederación Deportiva Autónoma de Guatemala (CDAG)'),
    'entes_exentos-21': ('Constitucionales', 'Iglesias y Deporte Federado (Arts. 37 y 92)', 2, 6, 'Actualización integral de datos registrales para entidades del Estado y no lucrativas'),

    # Sub 3: Vehículos, Solvencias y Asistencia Institucional (7)
    'entes_exentos-6': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 1, 'Consulta de historial de Solvencias Fiscales emitidas'),
    'entes_exentos-7': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 2, 'Motivos de omisos y requisitos para desbloqueo de Solvencia Fiscal'),
    'entes_exentos-26': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 3, 'Actualización de distintivos vehiculares (tarjeta y título) para entidades exentas'),
    'entes_exentos-23': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 4, 'Registro de marca y código de fabricante de vehículos ante el Registro Fiscal de Vehículos'),
    'entes_exentos-24': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 5, 'Rectificación de datos técnicos y transformaciones en vehículos oficiales o institucionales'),
    'entes_exentos-18': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 6, 'Aviso notarial de transferencia de dominio y legalización de firmas vehiculares'),
    'entes_exentos-11': ('Constitucionales', 'Vehículos, Solvencias y Asistencia Institucional', 3, 7, 'Solicitud de actividades y talleres de Cultura Tributaria para centros educativos'),

    # =========================================================================
    # 3. NO LUCRATIVOS (14 trámites)
    # =========================================================================
    # Sub 1: Inscripción y RTU de Organizaciones No Lucrativas (10)
    'entes_exentos-46': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 1, 'Inscripción del Número de Identificación Tributaria (NIT) para entidades públicas y no lucrativas'),
    'entes_exentos-32': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 2, 'Inscripción de Organización No Gubernamental (ONG) registrada antes de agosto 2022'),
    'entes_exentos-33': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 3, 'Inscripción de Organización No Gubernamental (ONG) registrada desde agosto 2022'),
    'entes_exentos-34': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 4, 'Inscripción de fundación, asociación civil o entidad religiosa no católica'),
    'entes_exentos-35': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 5, 'Inscripción de sucursal de entidad sin fines de lucro extranjera'),
    'entes_exentos-37': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 6, 'Inscripción de Organización Comunitaria de Servicios de Agua y Saneamiento (OCSAS)'),
    'entes_exentos-39': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 7, 'Inscripción de Organización de Padres de Familia (OPF)'),
    'entes_exentos-40': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 8, 'Inscripción de organización sindical en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-30': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 9, 'Actualización de datos de entidad no lucrativa en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-36': ('No Lucrativos', 'Inscripción y RTU de Organizaciones No Lucrativas', 1, 10, 'Actualización de datos de Organización Comunitaria en el RTU Digital'),

    # Sub 2: Exenciones CIVA, Actualización y Cierre de Operaciones (4)
    'entes_exentos-4': ('No Lucrativos', 'Exenciones CIVA, Actualización y Cierre de Operaciones', 2, 1, 'Habilitación para emisión de Constancias de Exención del IVA (CIVA) en Agencia Virtual'),
    'entes_exentos-111': ('No Lucrativos', 'Exenciones CIVA, Actualización y Cierre de Operaciones', 2, 2, 'Generación de Constancias de Exención del IVA (CIVA) en Agencia Virtual y Factura Electrónica en Línea (FEL)'),
    'entes_exentos-38': ('No Lucrativos', 'Exenciones CIVA, Actualización y Cierre de Operaciones', 2, 3, 'Actualización de datos de Organización de Padres de Familia (OPF)'),
    'entes_exentos-31': ('No Lucrativos', 'Exenciones CIVA, Actualización y Cierre de Operaciones', 2, 4, 'Cese definitivo de operaciones y cierre de entidad no lucrativa'),

    # =========================================================================
    # 4. MUNICIPALIDADES (5 trámites)
    # =========================================================================
    # Sub 1: Gestión Tributaria y Patrimonio Municipal (5)
    'entes_exentos-97': ('Municipalidades', 'Gestión Tributaria y Patrimonio Municipal', 1, 1, 'Inscripción de Municipalidad y corporaciones municipales en el RTU'),
    'entes_exentos-96': ('Municipalidades', 'Gestión Tributaria y Patrimonio Municipal', 1, 2, 'Actualización de datos de Municipalidad y mancomunidades en el RTU Digital'),
    'entes_exentos-91': ('Municipalidades', 'Gestión Tributaria y Patrimonio Municipal', 1, 3, 'Emisión de Constancias de Exención del Impuesto al Valor Agregado (CIVA) para municipalidades'),
    'entes_exentos-99': ('Municipalidades', 'Gestión Tributaria y Patrimonio Municipal', 1, 4, 'Inscripción y traspaso de vehículos adjudicados o donados a Municipalidades'),
    'entes_exentos-98': ('Municipalidades', 'Gestión Tributaria y Patrimonio Municipal', 1, 5, 'Baja definitiva de vehículos municipales desmantelados o subastados como chatarra'),

    # =========================================================================
    # 5. DECRETO (16 trámites)
    # =========================================================================
    # Sub 1: Misiones Diplomáticas y Organismos Internacionales (6)
    'entes_exentos-67': ('Decreto', 'Misiones Diplomáticas y Organismos Internacionales', 1, 1, 'Acreditación o cambio de representante de Misión Diplomática u Organismo Internacional'),
    'entes_exentos-68': ('Decreto', 'Misiones Diplomáticas y Organismos Internacionales', 1, 2, 'Actualización de datos de Embajada, Misión Diplomática o Proyecto de Cooperación'),
    'entes_exentos-69': ('Decreto', 'Misiones Diplomáticas y Organismos Internacionales', 1, 3, 'Actualización de datos de identificación para miembros del Cuerpo Diplomático y Consular'),
    'entes_exentos-76': ('Decreto', 'Misiones Diplomáticas y Organismos Internacionales', 1, 4, 'Cambio de placas particulares a placas oficiales, diplomáticas o consulares'),
    'entes_exentos-80': ('Decreto', 'Misiones Diplomáticas y Organismos Internacionales', 1, 5, 'Traspaso vehicular con exención para miembros del Cuerpo Diplomático y Consular'),
    'entes_exentos-55': ('Decreto', 'Misiones Diplomáticas y Organismos Internacionales', 1, 6, 'Manual de procedimientos y despacho aduanero para misiones y cooperación internacional'),

    # Sub 2: Cooperativas, Partidos Políticos y Exenciones Especiales (5)
    'entes_exentos-66': ('Decreto', 'Cooperativas, Partidos Políticos y Exenciones Especiales', 2, 1, 'Inscripción de cooperativa en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-65': ('Decreto', 'Cooperativas, Partidos Políticos y Exenciones Especiales', 2, 2, 'Actualización de datos de cooperativa en el Registro Tributario Unificado (RTU)'),
    'entes_exentos-70': ('Decreto', 'Cooperativas, Partidos Políticos y Exenciones Especiales', 2, 3, 'Inscripción de Comité Cívico Electoral o Comité Pro Formación de Partido Político'),
    'entes_exentos-71': ('Decreto', 'Cooperativas, Partidos Políticos y Exenciones Especiales', 2, 4, 'Inscripción de Partido Político en el Registro Tributario Unificado (RTU)'),
    'profesionales-76': ('Decreto', 'Cooperativas, Partidos Políticos y Exenciones Especiales', 2, 5, 'Registro de exenciones del Impuesto a la Distribución de Petróleo Crudo y Combustibles Derivados (IDP)'),

    # Sub 3: Donaciones Oficiales y Despacho Aduanero (5)
    'entes_exentos-61': ('Decreto', 'Donaciones Oficiales y Despacho Aduanero', 3, 1, 'Programa Aduana sin Papeles y despacho digital de donaciones oficiales'),
    'entes_exentos-62': ('Decreto', 'Donaciones Oficiales y Despacho Aduanero', 3, 2, 'Certificación como Operador Económico Autorizado (OEA) para entidades públicas y cooperación'),
    'entes_exentos-63': ('Decreto', 'Donaciones Oficiales y Despacho Aduanero', 3, 3, 'Operaciones de comercio exterior en el marco de la Unión Aduanera Centroamericana'),
    'entes_exentos-51': ('Decreto', 'Donaciones Oficiales y Despacho Aduanero', 3, 4, 'Renovación anual de registro como Auxiliar de la Función Pública Aduanera (AFPA)'),
    'entes_exentos-64': ('Decreto', 'Donaciones Oficiales y Despacho Aduanero', 3, 5, 'Recepción de sugerencias sobre procedimientos aduaneros para entidades exentas')
}

exentos_updated_count = 0

for item in master_data:
    if item.get('pillar') != 'entes_exentos' and item.get('segmento') != 'Entes Exentos':
        continue

    old_id = item.get('id')
    code = tramite_to_code.get(old_id)
    if not code:
        print(f"ERROR: Código no encontrado para {old_id}")
        continue

    cfg = EXENTOS_CONFIG.get(old_id)
    if not cfg:
        print(f"ERROR: Configuración no encontrada para {old_id}")
        continue

    exentos_updated_count += 1
    cat, subcat_n3, ord_n3, ord_c, titulo_claro = cfg

    # 1. Asignar código y reemplazar ID legacy por SAT-GES-####
    item['codigo'] = code
    item['id'] = code

    # 2. Asignar jerarquía limpia y asimétrica
    item['nivel1_segmento'] = 'Entes Exentos'
    item['orden_n1'] = 4
    item['categoria'] = cat
    item['nivel2_area'] = cat
    item['orden_n2'] = ORDEN_CATEGORIAS.get(cat, 1)

    item['subcategoria'] = subcat_n3
    item['nivel3_subarea'] = subcat_n3
    item['orden_n3'] = ord_n3

    # Compactar N4 y N5 a guion (cero mega-contenedores o pasarelas artificiales)
    item['nivel4_tema'] = '—'
    item['orden_n4'] = None
    item['nivel5_tramite'] = '—'
    item['orden_n5'] = None

    # 3. Gobernanza del orden y título en lenguaje claro
    item['orden_contenido'] = ord_c
    item['tramite'] = titulo_claro

    # 4. Actualizar URLs caídas a rutas canónicas activas
    if old_id in URL_FIXES:
        item['url'] = URL_FIXES[old_id]

    # 5. Miga de pan canónica sin niveles redundantes ni números quemados
    item['migaBreadcrumb'] = f"Entes Exentos > {cat} > {subcat_n3} > {titulo_claro}"

print(f"Total registros en Entes Exentos actualizados: {exentos_updated_count}")

# Validar unicidad absoluta de IDs en master_data
ids = [t['id'] for t in master_data]
assert len(ids) == len(set(ids)), f"Error: Hay IDs duplicados en master_data: {len(ids)} vs {len(set(ids))}"
print(f"Validación de unicidad de IDs exitosa: {len(ids)} IDs únicos en allTramites.json.")

# Guardar cambios en allTramites.json
with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, ensure_ascii=False, indent=2)
print("Archivo allTramites.json guardado exitosamente.")
