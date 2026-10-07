import json
from collections import Counter, defaultdict

INPUT_FILE = 'src/data/allTramites.json'

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

print(f"Cargados {len(master_data)} trámites iniciales de {INPUT_FILE}")

# Separar el pilar Contribuyentes (a depurar) de los demás pilares (que deben preservarse)
contrib_items = [t for t in master_data if t.get('pillar') == 'contribuyentes']
otros_pilares = [t for t in master_data if t.get('pillar') != 'contribuyentes']

print(f"Contribuyentes inicial: {len(contrib_items)}")
print(f"Otros pilares preservados intactos: {len(otros_pilares)}")

# IDs específicos DENTRO DE CONTRIBUYENTES a purgar (clones y páginas institucionales)
PURGAR_DENTRO_DE_CONTRIBUYENTES = {
    # 1. Clones de requisitos-de-vehiculos raspados con otros prefijos (ya en contribuyentes-329..336)
    'comercio_exterior-178', 'comercio_exterior-179', 'comercio_exterior-180',
    'comercio_exterior-181', 'comercio_exterior-182', 'comercio_exterior-183',
    'comercio_exterior-184', 'comercio_exterior-185', 'comercio_exterior-186',
    'profesionales-49', 'profesionales-50', 'profesionales-51',
    'profesionales-52', 'profesionales-53', 'profesionales-55',
    'entes_exentos-25', 'entes_exentos-136', 'entes_exentos-137',
    
    # 2. Clones de requisitos-de-personas-empresas (ya cubiertos en contribuyentes-269..275)
    'comercio_exterior-162', 'comercio_exterior-163', 'comercio_exterior-164',
    'profesionales-37', 'profesionales-39', 'profesionales-40', 'profesionales-43',
    'entes_exentos-44',
    
    # 3. Páginas institucionales vacías / menús generales
    'comercio_exterior-146', 'profesionales-26', # Menú institucional
    'profesionales-6',                          # Memoria de labores
    'contribuyentes-232',                        # Menú Institucional en RTU
    
    # 4. Clones directos por URL en servicios comunes
    'comercio_exterior-145', 'profesionales-25', # Tasas e intereses (ya en contribuyentes-112)
    'comercio_exterior-176', 'profesionales-47', # Acceso a información pública (ya en contribuyentes-283)
    'comercio_exterior-122', 'profesionales-11', 'entes_exentos-5', # Consulta pagos convenio (ya en contribuyentes-199)
    'comercio_exterior-123', 'profesionales-13', # Por qué no tengo solvencia (ya en contribuyentes-206)
    'profesionales-36',                          # Agendar cita (ya en contribuyentes-10)
    'contribuyentes-262',                        # Agendar cita duplicado de contribuyentes-10
    'profesionales-31',                          # Solicitud de NIT (ya en contribuyentes-19)
    'comercio_exterior-118', 'profesionales-8', 'entes_exentos-117', # Leyes / legislación (ya en contribuyentes-187)
    'comercio_exterior-131',                     # FEL info (ya en contribuyentes-218)
    'entes_exentos-104',                         # Planilla IVA duplicado (ya en contribuyentes-219)
    'profesionales-12',                          # Formas de pago (ya en contribuyentes-200)
    'profesionales-48',                          # Tablas vehículos (ya en contribuyentes-305)
    'comercio_exterior-166',                     # Autoliquidación (ya en contribuyentes-277)
    'comercio_exterior-120', 'comercio_exterior-121', 'comercio_exterior-119', # FAQs cumplimiento (ya en contribuyentes-189)
    'entes_exentos-119', 'entes_exentos-120', 'entes_exentos-118',             # FAQs cumplimiento (ya en contribuyentes-189)
    'profesionales-65',                          # FAQs especiales (ya en contribuyentes-110)
    'entes_exentos-19',                          # Morosos duplicado (nos quedamos con profesionales-35 normalizado)
    'profesionales-10',                          # FAQs genérico vacío
    'profesionales-14',                          # Estadísticas tributarias institucionales
    'contribuyentes-134',                        # Consulta estado gestión duplicado de contribuyentes-8
    'contribuyentes-143',                        # Descargas duplicado de contribuyentes-142
    'contribuyentes-285',                        # Cambiar motor/color duplicado de contribuyentes-312
}

# Reubicación a PROFESIONALES desde Contribuyentes
REUBICAR_A_PROFESIONALES = {
    'contribuyentes-225': {
        'new_id': 'profesionales-timbres-razon-electronica',
        'categoria': 'Abogados y Notarios',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Timbres Fiscales y Papel de Protocolo',
        'migaBreadcrumb': 'Profesionales > Abogados y Notarios > Operaciones y trámites > Pagar timbres fiscales en línea (razón electrónica)'
    },
    'contribuyentes-208': {
        'new_id': 'profesionales-timbres-devolucion-papel-sellado',
        'categoria': 'Abogados y Notarios',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Timbres Fiscales y Papel de Protocolo',
        'migaBreadcrumb': 'Profesionales > Abogados y Notarios > Operaciones y trámites > Devolución de timbres fiscales y papel sellado'
    },
    'contribuyentes-224': {
        'new_id': 'profesionales-capacitacion-timbres-notarios',
        'categoria': 'Abogados y Notarios',
        'subcategoria': 'Normativa y recursos',
        'tema': 'Capacitación Especializada Notarial',
        'migaBreadcrumb': 'Profesionales > Abogados y Notarios > Normativa y recursos > Curso: razón electrónica de timbres con tarifas especiales'
    },
    'profesionales-27': {
        'new_id': 'profesionales-objeciones-asuntos-juridicos',
        'categoria': 'Servicios Profesionales',
        'subcategoria': 'Consultas y seguimiento',
        'tema': 'Criterios y Doctrina Tributaria',
        'migaBreadcrumb': 'Profesionales > Servicios Profesionales > Consultas y seguimiento > Objeciones y recomendaciones a procedimientos de la Intendencia de Asuntos Jurídicos'
    }
}

# Reubicación a COMERCIO EXTERIOR desde Contribuyentes
REUBICAR_A_COMERCIO_EXTERIOR = {
    'contribuyentes-291': {
        'new_id': 'comercio_exterior-vehiculo-reimportado-nit',
        'categoria': 'Importadores y Exportadores (Compartido)',
        'subcategoria': 'Operaciones y trámites',
        'tema': 'Regímenes Aduaneros Definitivos',
        'migaBreadcrumb': 'Operadores de Comercio Exterior > 1. Titulares de Mercancías > Importadores y Exportadores (Compartido) > Operaciones y trámites > Corregir el NIT de un vehículo reimportado'
    },
    'comercio_exterior-147': {
        'new_id': 'comercio_exterior-objeciones-procedimientos-aduanas',
        'categoria': 'Importadores y Exportadores (Compartido)',
        'subcategoria': 'Normativa y recursos',
        'tema': 'Participación Ciudadana y Criterios Aduaneros',
        'migaBreadcrumb': 'Operadores de Comercio Exterior > 1. Titulares de Mercancías > Importadores y Exportadores (Compartido) > Normativa y recursos > Objeciones y recomendaciones a procedimientos de la Intendencia de Aduanas'
    }
}

# Normalizar y conservar en CONTRIBUYENTES
CONSERVAR_NORMALIZADOS_CONTRIBUYENTES = {
    'comercio_exterior-46': {
        'new_id': 'contribuyentes-distribuidor-contrasena-iscv',
        'categoria': 'Vehículos',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Propietarios y Distribuidores de Vehículos > Operaciones y trámites > Obtención de contraseña para pagar impuesto de circulación de placas de distribuidor'
    },
    'comercio_exterior-47': {
        'new_id': 'contribuyentes-distribuidor-reposicion-tarjeta',
        'categoria': 'Vehículos',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Propietarios y Distribuidores de Vehículos > Operaciones y trámites > Reposición de tarjeta de circulación de distribuidor'
    },
    'comercio_exterior-48': {
        'new_id': 'contribuyentes-distribuidor-reposicion-placas',
        'categoria': 'Vehículos',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Propietarios y Distribuidores de Vehículos > Operaciones y trámites > Reposición de placas de distribuidor'
    },
    'comercio_exterior-49': {
        'new_id': 'contribuyentes-distribuidor-reposicion-placas-8933',
        'categoria': 'Vehículos',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Propietarios y Distribuidores de Vehículos > Operaciones y trámites > Reposición de placas de distribuidor en línea SAT-8933'
    },
    'comercio_exterior-50': {
        'new_id': 'contribuyentes-distribuidor-asignacion-placas',
        'categoria': 'Vehículos',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Propietarios y Distribuidores de Vehículos > Operaciones y trámites > Asignación de placas de uso distribuidor'
    },
    'entes_exentos-20': {
        'new_id': 'contribuyentes-rtu-tercera-persona',
        'categoria': 'RTU Digital y Agencia Virtual',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > RTU Digital y Agencia Virtual > Operaciones y trámites > Autorización a tercera persona para gestiones del RTU'
    },
    'profesionales-35': {
        'new_id': 'contribuyentes-consulta-morosos',
        'categoria': 'Solvencia y Convenios',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Solvencia y Convenios > Consultas y seguimiento > Consulta de listado público de contribuyentes morosos'
    },
    'profesionales-5': {
        'new_id': 'contribuyentes-descarga-app-sat',
        'categoria': 'RTU Digital y Agencia Virtual',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > RTU Digital y Agencia Virtual > Herramientas y descargas > Descarga de aplicaciones móviles oficiales de la SAT'
    },
    'profesionales-7': {
        'new_id': 'contribuyentes-criterios-tributarios',
        'categoria': 'Servicios al Contribuyente',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Servicios al Contribuyente > Normativa y recursos > Criterios tributarios institucionales'
    },
    'profesionales-9': {
        'new_id': 'contribuyentes-orientacion-legal',
        'categoria': 'Servicios al Contribuyente',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Servicios al Contribuyente > Normativa y recursos > Orientación y doctrina legal tributaria'
    },
    'comercio_exterior-40': {
        'new_id': 'contribuyentes-veh-iprima-tabla-valores',
        'categoria': 'Vehículos',
        'migaBreadcrumb': 'Contribuyentes > Contribuyente General > Propietarios y Distribuidores de Vehículos > Normativa y recursos > Tabla de valores imponibles del IPRIMA para vehículos usados'
    }
}

# Reclasificaciones internas de CONTRIBUYENTES
RECLASIFICAR_INTERNO_CONTRIBUYENTES = {
    # Mover a Solvencia y Convenios desde Declaraciones y Pagos
    'contribuyentes-199': 'Solvencia y Convenios',
    'contribuyentes-201': 'Solvencia y Convenios',
    'contribuyentes-202': 'Solvencia y Convenios',
    'contribuyentes-203': 'Solvencia y Convenios',
    'contribuyentes-204': 'Solvencia y Convenios',
    'contribuyentes-205': 'Solvencia y Convenios',
    'contribuyentes-206': 'Solvencia y Convenios',
    'contribuyentes-270': 'Solvencia y Convenios',
    # Mover órgano y dependencias de Asalariados a Servicios al Contribuyente
    'contribuyentes-186': 'Servicios al Contribuyente',
}

# Procesar los 413 trámites de Contribuyentes
saneados_contrib = []
reubicados_a_prof = []
reubicados_a_comex = []

for t in contrib_items:
    tid = t.get('id')
    
    # 1. ¿Está en la lista de purgas?
    if tid in PURGAR_DENTRO_DE_CONTRIBUYENTES:
        continue

    # 2. ¿Se reubica a Profesionales?
    if tid in REUBICAR_A_PROFESIONALES:
        meta = REUBICAR_A_PROFESIONALES[tid]
        t_mod = dict(t)
        t_mod['id'] = meta['new_id']
        t_mod['pillar'] = 'profesionales'
        t_mod['pillarName'] = 'Profesionales'
        t_mod['macroGrupo'] = 'Profesionales'
        t_mod['segmento'] = 'Profesionales'
        t_mod['nivel1_segmento'] = 'Profesionales'
        t_mod['grupoNo'] = 7
        t_mod['grupoNombre'] = 'Profesionales'
        t_mod['categoria'] = meta['categoria']
        t_mod['subcategoria'] = meta.get('subcategoria', t_mod.get('subcategoria',''))
        t_mod['tema'] = meta.get('tema', t_mod.get('tema',''))
        t_mod['migaBreadcrumb'] = meta['migaBreadcrumb']
        reubicados_a_prof.append(t_mod)
        continue

    # 3. ¿Se reubica a Comercio Exterior?
    if tid in REUBICAR_A_COMERCIO_EXTERIOR:
        meta = REUBICAR_A_COMERCIO_EXTERIOR[tid]
        t_mod = dict(t)
        t_mod['id'] = meta['new_id']
        t_mod['pillar'] = 'comercio_exterior'
        t_mod['pillarName'] = 'Operadores de Comercio Exterior'
        t_mod['macroGrupo'] = 'Operadores de Comercio Exterior'
        t_mod['segmento'] = 'Operadores de Comercio Exterior'
        t_mod['nivel1_segmento'] = 'Operadores de Comercio Exterior'
        t_mod['grupoNo'] = 5
        t_mod['grupoNombre'] = 'Operadores de Comercio Exterior'
        t_mod['categoria'] = meta['categoria']
        t_mod['subcategoria'] = meta.get('subcategoria', t_mod.get('subcategoria',''))
        t_mod['tema'] = meta.get('tema', t_mod.get('tema',''))
        t_mod['migaBreadcrumb'] = meta['migaBreadcrumb']
        reubicados_a_comex.append(t_mod)
        continue

    # 4. ¿Es un trámite a normalizar con nuevo ID dentro de Contribuyentes?
    if tid in CONSERVAR_NORMALIZADOS_CONTRIBUYENTES:
        meta = CONSERVAR_NORMALIZADOS_CONTRIBUYENTES[tid]
        t_mod = dict(t)
        t_mod['id'] = meta['new_id']
        t_mod['pillar'] = 'contribuyentes'
        t_mod['pillarName'] = 'Contribuyentes'
        t_mod['macroGrupo'] = 'Contribuyentes'
        t_mod['segmento'] = 'Contribuyentes'
        t_mod['nivel1_segmento'] = 'Contribuyentes'
        t_mod['categoria'] = meta['categoria']
        t_mod['migaBreadcrumb'] = meta['migaBreadcrumb']
        saneados_contrib.append(t_mod)
        continue

    # 5. ¿Es un trámite nativo con reclasificación interna de categoría?
    if tid in RECLASIFICAR_INTERNO_CONTRIBUYENTES:
        t_mod = dict(t)
        t_mod['categoria'] = RECLASIFICAR_INTERNO_CONTRIBUYENTES[tid]
        saneados_contrib.append(t_mod)
        continue

    # 6. Conservar trámite original en Contribuyentes
    saneados_contrib.append(t)

# Construir el nuevo dataset maestro completo
nuevo_master_data = otros_pilares + saneados_contrib + reubicados_a_prof + reubicados_a_comex

print(f"\n--- RESUMEN FINAL DE LA EJECUCIÓN ---")
print(f"Contribuyentes saneado: {len(saneados_contrib)} trámites (de 413 iniciales, purgados {413 - len(saneados_contrib) - len(reubicados_a_prof) - len(reubicados_a_comex)})")
print(f"Reubicados a Profesionales: {len(reubicados_a_prof)} trámites")
print(f"Reubicados a Comercio Exterior: {len(reubicados_a_comex)} trámites")
print(f"Total nuevo universo maestro: {len(nuevo_master_data)} trámites")

# Distribución por Pilar
p_counts = Counter(t.get('pillar') for t in nuevo_master_data)
print("\nDistribución por Pilar en nuevo dataset maestro:")
for p, c in p_counts.items():
    print(f"  {p}: {c}")

# Categorías en Contribuyentes
c_cats = Counter(t.get('categoria') for t in saneados_contrib)
print(f"\nCategorías en Contribuyentes ({len(saneados_contrib)} trámites):")
for cat, cnt in c_cats.most_common():
    print(f"  {cat}: {cnt}")

# Verificar si queda algún ID duplicado en todo el dataset nuevo
id_counts = Counter(t.get('id') for t in nuevo_master_data)
dupes = [k for k, v in id_counts.items() if v > 1]
print(f"\nIDs duplicados en todo el nuevo dataset: {len(dupes)}")
if dupes:
    print(f"ALERTA: Existen IDs duplicados: {dupes}")
else:
    print("VERIFICACIÓN EXITOSA: 100% de los IDs son únicos y canónicos.")

# Guardar en archivo definitivo src/data/allTramites.json
with open('src/data/allTramites.json', 'w', encoding='utf-8') as f:
    json.dump(nuevo_master_data, f, ensure_ascii=False, indent=2)

print("\nArchivo src/data/allTramites.json ACTUALIZADO con éxito.")
