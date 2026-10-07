import json
import os
import re
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# ==============================================================================
# 1. CARGA DEL DATASET MAESTRO (783 REGISTROS)
# ==============================================================================
ALL_TRAMITES_PATH = 'src/data/allTramites.json'
with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

# Cargar las 26 brechas de comercio exterior desde el documento oficial
BRECHAS_MD_PATH = 'docs/arquitectura-informacion/brechas-comercio-exterior.md'
brechas_oficiales = []
if os.path.exists(BRECHAS_MD_PATH):
    with open(BRECHAS_MD_PATH, 'r', encoding='utf-8') as f:
        md_text = f.read()
    pattern = r'\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|'
    raw_matches = re.findall(pattern, md_text)
    for num, actor, subtema, tramite, justif in raw_matches:
        # Extraer situación y pregunta
        sit = ""
        preg = ""
        if '*Situación:*' in justif and '*Pregunta SAT:*' in justif:
            parts = justif.split('*Pregunta SAT:*')
            sit = parts[0].replace('*Situación:*', '').replace('<br>', '').strip()
            preg = parts[1].strip()
        else:
            sit = justif.strip()
            preg = f"¿Existe acuerdo de directorio o resolución que formalice el requisito digital para '{tramite.strip()}' ante SAT?"
            
        brechas_oficiales.append({
            'no': int(num),
            'actor': actor.strip(),
            'subtema': subtema.strip(),
            'tramite': tramite.strip(),
            'situacion': sit,
            'pregunta': preg
        })

print(f"Cargados {len(master_data)} trámites maestros y {len(brechas_oficiales)} brechas oficiales.")

# ==============================================================================
# 2. CONSTRUCCIÓN DEL LIBRO EXCEL OFICIAL CON FORMATO INSTITUCIONAL SAT
# ==============================================================================
wb = openpyxl.Workbook()
wb.remove(wb.active)

# Paleta Institucional SAT
NAVY_HEADER = '14649B'      # Azul SAT Primario
BLUE_HEADER = '19324B'      # Azul Oscuro Título
CYAN_ACCENT = '0284C7'      # Celeste Operaciones
GREEN_ACCENT = '059669'     # Verde Consultas
ORANGE_ACCENT = 'C25E00'    # Naranja Brechas / Modificaciones
PURPLE_ACCENT = '7C3AED'    # Morado Normativa
ZEBRA_FILL = 'F8FAFC'       # Gris azulado tenue
BORDER_COLOR = 'CBD5E1'     # Borde neutro

thin_border = Border(
    left=Side(style='thin', color=BORDER_COLOR),
    right=Side(style='thin', color=BORDER_COLOR),
    top=Side(style='thin', color=BORDER_COLOR),
    bottom=Side(style='thin', color=BORDER_COLOR)
)

header_border = Border(
    left=Side(style='thin', color='FFFFFF'),
    right=Side(style='thin', color='FFFFFF'),
    top=Side(style='medium', color=NAVY_HEADER),
    bottom=Side(style='medium', color=NAVY_HEADER)
)

font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_title = Font(name='Segoe UI', size=14, bold=True, color=BLUE_HEADER)
font_subtitle = Font(name='Segoe UI', size=11, color='475569')
font_bold = Font(name='Segoe UI', size=10, bold=True, color=BLUE_HEADER)
font_body = Font(name='Segoe UI', size=10, color='1E293B')
font_small = Font(name='Segoe UI', size=9, color='64748B')
font_link = Font(name='Segoe UI', size=9, color='0284C7', underline='single')

# ==============================================================================
# HOJA 1: RESUMEN ARQUITECTURA (CON FÓRMULAS DINÁMICAS EXCEL)
# ==============================================================================
ws_resumen = wb.create_sheet(title="Resumen Arquitectura")
ws_resumen.views.sheetView[0].showGridLines = True

ws_resumen['B2'] = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA - SAT GUATEMALA"
ws_resumen['B2'].font = Font(name='Segoe UI', size=11, bold=True, color='64748B')

ws_resumen['B3'] = "ESTRUCTURA DE NAVEGACIÓN Y CONTENIDO DEL PORTAL WEB (MODELO ATO)"
ws_resumen['B3'].font = font_title

ws_resumen['B4'] = "Arquitectura de Navegación Flexible con Desglose Asimétrico de Actores, Migas de Pan y Enlaces Oficiales (783 Contenidos)"
ws_resumen['B4'].font = font_subtitle

# KPI Cards con fórmulas vivas
kpis = [
    ("TOTAL CONTENIDOS", "=COUNTA('Matriz Maestra (783)'!A2:A784)", "Universo Oficial SAT", "B6", "C7", NAVY_HEADER),
    ("CONTRIBUYENTES", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Contribuyentes")', "Régimen Interno", "D6", "E7", BLUE_HEADER),
    ("COMERCIO EXTERIOR", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Operadores de Comercio Exterior")', "Aduanas, AFPA y Zonas", "F6", "G7", CYAN_ACCENT),
    ("PROFESIONALES", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Profesionales")', "Notarios, Contadores, TEV", "H6", "I7", GREEN_ACCENT),
    ("ENTES EXENTOS", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Entes Exentos")', "ONGs, Iglesias y Estado", "J6", "K7", PURPLE_ACCENT),
]

for label, formula, sub, top_left, bot_right, color in kpis:
    ws_resumen.merge_cells(f"{top_left}:{bot_right}")
    cell = ws_resumen[top_left]
    cell.value = formula
    cell.font = Font(name='Segoe UI', size=14, bold=True, color='FFFFFF')
    cell.fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

# Tabla 1: Segmentos
ws_resumen['B9'] = "1. SEGMENTOS PRINCIPALES DEL PORTAL (NIVEL 1)"
ws_resumen['B9'].font = font_bold

macro_headers = ["No.", "Segmento", "Alcance para el Ciudadano / Operador", "Total Contenidos", "% del Portal"]
for col_idx, h in enumerate(macro_headers, start=2):
    c = ws_resumen.cell(row=10, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border

macro_rows = [
    (1, "Contribuyentes", "Personas y empresas del régimen interno (Vehículos, FEL, RTU y declaraciones)", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Contribuyentes")'),
    (2, "Operadores de Comercio Exterior", "Aduanas, importadores, exportadores, AFPA (Almacenes, DAT, AGD), Maquilas y ZDEEP", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Operadores de Comercio Exterior")'),
    (3, "Profesionales", "Contadores, auditores, notarios (traspasos electrónicos TEV) y peritos", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Profesionales")'),
    (4, "Entes Exentos", "Organizaciones no lucrativas, iglesias, colegios, misiones diplomáticas y Estado", '=COUNTIF(\'Matriz Maestra (783)\'!C2:C784, "Entes Exentos")'),
]

for r_idx, (mno, mnom, mdesc, mformula) in enumerate(macro_rows, start=11):
    ws_resumen.cell(row=r_idx, column=2, value=mno).alignment = Alignment(horizontal='center')
    ws_resumen.cell(row=r_idx, column=3, value=mnom).font = font_bold
    ws_resumen.cell(row=r_idx, column=4, value=mdesc).font = font_small
    c_tot = ws_resumen.cell(row=r_idx, column=5, value=mformula)
    c_tot.alignment = Alignment(horizontal='right')
    c_tot.font = font_bold
    
    c_pct = ws_resumen.cell(row=r_idx, column=6, value=f"=E{r_idx}/COUNTA('Matriz Maestra (783)'!A2:A784)")
    c_pct.alignment = Alignment(horizontal='right')
    c_pct.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 7):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 4, 5]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

# Fila totalizador Segmentos
ws_resumen.cell(row=15, column=2, value="").border = thin_border
ws_resumen.cell(row=15, column=3, value="TOTAL PORTAL WEB SAT").font = font_bold
ws_resumen.cell(row=15, column=4, value="Universo total de fichas de contenido y servicios").font = font_small
c_tt = ws_resumen.cell(row=15, column=5, value="=SUM(E11:E14)")
c_tt.font = font_bold
c_tt.alignment = Alignment(horizontal='right')
c_tp = ws_resumen.cell(row=15, column=6, value="=SUM(F11:F14)")
c_tp.font = font_bold
c_tp.alignment = Alignment(horizontal='right')
c_tp.number_format = '0.0%'
for c_idx in range(2, 7):
    ws_resumen.cell(row=15, column=c_idx).border = thin_border
    ws_resumen.cell(row=15, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')

# Tabla 2: Ciclo de Vida ATO
ws_resumen['H9'] = "2. CICLO DE VIDA ATO (AUSTRALIA) - SIN NÚMEROS VISIBLES"
ws_resumen['H9'].font = font_bold

ato_headers = ["Etapa ATO", "Descripción Funcional", "Total", "%"]
for col_idx, h in enumerate(ato_headers, start=8):
    c = ws_resumen.cell(row=10, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border

ato_stages = [
    ("Empezar y registrarse", "Primer NIT, RTU Digital, padrones de importación/exportación y habilitación", '=COUNTIF(\'Matriz Maestra (783)\'!K2:K784, "Empezar y registrarse")'),
    ("Operación y declaraciones", "Facturación FEL, Declaraguate, DUCAs, retenciones, transferencias y pagos", '=COUNTIF(\'Matriz Maestra (783)\'!K2:K784, "Operación y declaraciones")'),
    ("Consultas y herramientas", "Verificadores en tiempo real, solvencia, selectivo aduanero, rampa y SAC", '=COUNTIF(\'Matriz Maestra (783)\'!K2:K784, "Consultas y herramientas")'),
    ("Modificaciones y cierre", "Actualización de RTU, traspaso vehicular, prórrogas, cese y subastas", '=COUNTIF(\'Matriz Maestra (783)\'!K2:K784, "Modificaciones y cierre")'),
    ("Normativa y asistencia", "Marco legal aduanero y tributario, devoluciones, criterios y capacitaciones", '=COUNTIF(\'Matriz Maestra (783)\'!K2:K784, "Normativa y asistencia")')
]

for r_idx, (enom, edesc, eformula) in enumerate(ato_stages, start=11):
    ws_resumen.cell(row=r_idx, column=8, value=enom).font = font_bold
    ws_resumen.cell(row=r_idx, column=9, value=edesc).font = font_small
    c_at = ws_resumen.cell(row=r_idx, column=10, value=eformula)
    c_at.alignment = Alignment(horizontal='right')
    c_at.font = font_bold
    
    c_ap = ws_resumen.cell(row=r_idx, column=11, value=f"=J{r_idx}/COUNTA('Matriz Maestra (783)'!A2:A784)")
    c_ap.alignment = Alignment(horizontal='right')
    c_ap.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(8, 12):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [8, 9, 10]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

# Fila totalizador ATO
ws_resumen.cell(row=16, column=8, value="TOTAL CICLO DE VIDA").font = font_bold
ws_resumen.cell(row=16, column=9, value="100% de contenidos clasificados por momento de interacción").font = font_small
c_att = ws_resumen.cell(row=16, column=10, value="=SUM(J11:J15)")
c_att.font = font_bold
c_att.alignment = Alignment(horizontal='right')
c_atp = ws_resumen.cell(row=16, column=11, value="=SUM(K11:K15)")
c_atp.font = font_bold
c_atp.alignment = Alignment(horizontal='right')
c_atp.number_format = '0.0%'
for c_idx in range(8, 12):
    ws_resumen.cell(row=16, column=c_idx).border = thin_border
    ws_resumen.cell(row=16, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')

# Dimensiones de columnas Resumen
for col in range(2, 12):
    ws_resumen.column_dimensions[get_column_letter(col)].width = 22
ws_resumen.column_dimensions['C'].width = 30
ws_resumen.column_dimensions['D'].width = 38
ws_resumen.column_dimensions['I'].width = 46

# ==============================================================================
# HOJA 2: MATRIZ MAESTRA COMPLETA (783 FILAS CON 100% URLs CLICABLES)
# ==============================================================================
ws_master = wb.create_sheet(title=f"Matriz Maestra ({len(master_data)})")
ws_master.views.sheetView[0].showGridLines = True

headers_master = [
    "No.",
    "ID Trámite",
    "Nivel 1: Segmento",
    "Nivel 2: Régimen / Área",
    "Nivel 3: Grupo de Actor",
    "Nivel 4: Actor Específico / Recinto",
    "Materia / Tema",
    "Subtema / Tipo de Gestión",
    "Nombre del Trámite / Servicio (Lenguaje Claro)",
    "Ruta de Navegación (Miga de Pan)",
    "Etapa Ciclo de Vida ATO",
    "Tipo de Interacción",
    "Tipología de Contenido",
    "Plataforma / Sistema",
    "Canal",
    "¿Para qué sirve? (Descripción Operativa)",
    "Ruta de Procesos Asociada",
    "Estado Normativo",
    "URL Portal SAT"
]

for col_idx, h in enumerate(headers_master, start=1):
    c = ws_master.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_master.row_dimensions[1].height = 30

for r_idx, item in enumerate(master_data, start=2):
    rutas_str = "N/A"
    if item.get('rutasProceso'):
        rutas_str = "; ".join([f"Proc #{p['procesoNo']} ({p['pasoAccion']})" for p in item['rutasProceso']])

    ws_master.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_master.cell(row=r_idx, column=2, value=item.get('id', '')).alignment = Alignment(horizontal='center')
    ws_master.cell(row=r_idx, column=3, value=item.get('segmento', '')).font = font_bold
    ws_master.cell(row=r_idx, column=4, value=item.get('regimenArea', ''))
    ws_master.cell(row=r_idx, column=5, value=item.get('grupoActor', '—'))
    ws_master.cell(row=r_idx, column=6, value=item.get('actorEspecifico', '—'))
    ws_master.cell(row=r_idx, column=7, value=item.get('materiaTema', '')).font = font_bold
    ws_master.cell(row=r_idx, column=8, value=item.get('subtemaGestion', '—'))
    ws_master.cell(row=r_idx, column=9, value=item.get('tramite', '')).font = font_bold
    
    # Miga de Pan (Breadcrumb dinámico)
    c_miga = ws_master.cell(row=r_idx, column=10, value=item.get('migaBreadcrumb', ''))
    c_miga.font = font_small

    # Etapa ATO
    c_etapa = ws_master.cell(row=r_idx, column=11, value=item.get('etapaAtoLabel', ''))
    c_etapa.font = font_bold
    if 'Empezar' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=NAVY_HEADER)
    elif 'Operaci' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=CYAN_ACCENT)
    elif 'Consulta' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=GREEN_ACCENT)
    elif 'Modifica' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=ORANGE_ACCENT)
    elif 'Normat' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=PURPLE_ACCENT)

    ws_master.cell(row=r_idx, column=12, value=item.get('tipoInteraccionLabel', ''))
    ws_master.cell(row=r_idx, column=13, value=item.get('tipologiaContenidoLabel', 'Guía de Requisitos y Pasos'))
    ws_master.cell(row=r_idx, column=14, value=item.get('plataformaSistemaLabel', item.get('plataformaSistema', 'Portal Web SAT')))
    ws_master.cell(row=r_idx, column=15, value=item.get('canalAtencion', '100% Digital')).alignment = Alignment(horizontal='center')
    ws_master.cell(row=r_idx, column=16, value=item.get('descripcion', ''))
    ws_master.cell(row=r_idx, column=17, value=rutas_str).font = font_small
    
    # Estado Normativo
    c_brecha = ws_master.cell(row=r_idx, column=18, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
    if item.get('esBrecha'):
        c_brecha.font = Font(name='Segoe UI', size=10, bold=True, color='C25E00')
        c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')

    # URL con Hipervínculo interactivo (100% garantizado con http)
    raw_url = str(item.get('url', '')).strip()
    c_url = ws_master.cell(row=r_idx, column=19, value=raw_url)
    if raw_url.startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = raw_url

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 20):
        cell = ws_master.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 7, 9, 10, 11, 17, 18, 19]: cell.font = font_body
        if not (c_idx == 18 and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_master.row_dimensions[r_idx].height = 22

master_widths = [8, 18, 24, 26, 26, 26, 28, 24, 38, 55, 24, 24, 24, 22, 14, 48, 30, 16, 42]
for idx, w in enumerate(master_widths, start=1):
    ws_master.column_dimensions[get_column_letter(idx)].width = w

ws_master.freeze_panes = 'E2'
ws_master.auto_filter.ref = f"A1:S{len(master_data)+1}"

# ==============================================================================
# HOJA 3: COMERCIO EXTERIOR (246 FILAS CON 100% URLs CLICABLES)
# ==============================================================================
ce_data = [item for item in master_data if item.get('segmento') == 'Operadores de Comercio Exterior']
ws_ce = wb.create_sheet(title=f"Comercio Exterior ({len(ce_data)})")
ws_ce.views.sheetView[0].showGridLines = True

headers_ce = [
    "No.",
    "Régimen / Área Aduanera",
    "Grupo de Actor",
    "Actor Específico / Recinto",
    "Materia / Tema",
    "Subtema / Tipo de Gestión",
    "Nombre del Trámite / Servicio (Lenguaje Claro)",
    "Ruta de Navegación (Miga de Pan)",
    "Etapa Ciclo de Vida ATO",
    "Tipo de Interacción",
    "Tipología de Contenido",
    "Plataforma / Sistema",
    "¿Para qué sirve? (Descripción Operativa)",
    "Ruta de Proceso",
    "Estado Normativo",
    "URL Portal SAT"
]

for col_idx, h in enumerate(headers_ce, start=1):
    c = ws_ce.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_ce.row_dimensions[1].height = 30

for r_idx, item in enumerate(ce_data, start=2):
    rutas_str = "N/A"
    if item.get('rutasProceso'):
        rutas_str = "; ".join([f"Proc #{p['procesoNo']} ({p['pasoAccion']})" for p in item['rutasProceso']])

    ws_ce.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_ce.cell(row=r_idx, column=2, value=item.get('regimenArea', '')).font = font_bold
    ws_ce.cell(row=r_idx, column=3, value=item.get('grupoActor', '—'))
    ws_ce.cell(row=r_idx, column=4, value=item.get('actorEspecifico', '—'))
    ws_ce.cell(row=r_idx, column=5, value=item.get('materiaTema', '')).font = font_bold
    ws_ce.cell(row=r_idx, column=6, value=item.get('subtemaGestion', '—'))
    ws_ce.cell(row=r_idx, column=7, value=item.get('tramite', '')).font = font_bold
    
    # Miga de Pan
    c_miga = ws_ce.cell(row=r_idx, column=8, value=item.get('migaBreadcrumb', ''))
    c_miga.font = font_small

    c_etapa = ws_ce.cell(row=r_idx, column=9, value=item.get('etapaAtoLabel', ''))
    c_etapa.font = font_bold
    if 'Empezar' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=NAVY_HEADER)
    elif 'Operaci' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=CYAN_ACCENT)
    elif 'Consulta' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=GREEN_ACCENT)
    elif 'Modifica' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=ORANGE_ACCENT)
    elif 'Normat' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=PURPLE_ACCENT)

    ws_ce.cell(row=r_idx, column=10, value=item.get('tipoInteraccionLabel', ''))
    ws_ce.cell(row=r_idx, column=11, value=item.get('tipologiaContenidoLabel', 'Guía de Requisitos y Pasos'))
    ws_ce.cell(row=r_idx, column=12, value=item.get('plataformaSistemaLabel', item.get('plataformaSistema', 'Portal Web SAT')))
    ws_ce.cell(row=r_idx, column=13, value=item.get('descripcion', ''))
    ws_ce.cell(row=r_idx, column=14, value=rutas_str).font = font_small
    
    c_brecha = ws_ce.cell(row=r_idx, column=15, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
    if item.get('esBrecha'):
        c_brecha.font = Font(name='Segoe UI', size=10, bold=True, color='C25E00')
        c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')

    raw_url = str(item.get('url', '')).strip()
    c_url = ws_ce.cell(row=r_idx, column=16, value=raw_url)
    if raw_url.startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = raw_url

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 17):
        cell = ws_ce.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 5, 7, 8, 9, 14, 15, 16]: cell.font = font_body
        if not (c_idx == 15 and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_ce.row_dimensions[r_idx].height = 22

ce_widths = [8, 28, 28, 28, 28, 24, 38, 55, 24, 24, 24, 22, 48, 30, 16, 42]
for idx, w in enumerate(ce_widths, start=1):
    ws_ce.column_dimensions[get_column_letter(idx)].width = w

ws_ce.freeze_panes = 'E2'
ws_ce.auto_filter.ref = f"A1:P{len(ce_data)+1}"

# ==============================================================================
# HOJA 4: BRECHAS NORMATIVAS (LAS 26 BRECHAS COMPLETAS PARA MESA TÉCNICA)
# ==============================================================================
ws_brechas = wb.create_sheet(title=f"Brechas Normativas ({len(brechas_oficiales)})")
ws_brechas.views.sheetView[0].showGridLines = True

headers_brechas = [
    "No.",
    "Actor / Rol Aduanero Afectado",
    "Etapa / Subtema",
    "Trámite Propuesto (Brecha)",
    "Situación Operativa / Justificación Legal",
    "Pregunta Formal para Mesa Técnica de SAT"
]

for col_idx, h in enumerate(headers_brechas, start=1):
    c = ws_brechas.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=ORANGE_ACCENT, end_color=ORANGE_ACCENT, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_brechas.row_dimensions[1].height = 30

for r_idx, b in enumerate(brechas_oficiales, start=2):
    ws_brechas.cell(row=r_idx, column=1, value=b['no']).alignment = Alignment(horizontal='center')
    ws_brechas.cell(row=r_idx, column=2, value=b['actor']).font = font_bold
    ws_brechas.cell(row=r_idx, column=3, value=b['subtema'])
    ws_brechas.cell(row=r_idx, column=4, value=b['tramite']).font = font_bold
    ws_brechas.cell(row=r_idx, column=5, value=b['situacion'])
    
    c_preg = ws_brechas.cell(row=r_idx, column=6, value=b['pregunta'])
    c_preg.font = Font(name='Segoe UI', size=9, italic=True, color='1E293B')

    fill_color = 'FFF7ED' if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 7):
        cell = ws_brechas.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 4, 6]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_brechas.row_dimensions[r_idx].height = 26

brecha_widths = [8, 28, 26, 38, 50, 50]
for idx, w in enumerate(brecha_widths, start=1):
    ws_brechas.column_dimensions[get_column_letter(idx)].width = w

ws_brechas.freeze_panes = 'A2'
ws_brechas.auto_filter.ref = f"A1:F{len(brechas_oficiales)+1}"

# ==============================================================================
# GUARDAR LIBRO DEFINITIVO
# ==============================================================================
OUTPUT_EXCEL_PATH = 'docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx'
wb.save(OUTPUT_EXCEL_PATH)
print(f"Libro Excel maestro guardado exitosamente en: {OUTPUT_EXCEL_PATH}")
