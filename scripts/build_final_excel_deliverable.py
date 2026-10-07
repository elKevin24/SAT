import json
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Cargar datos directamente del JSON maestro del proyecto
with open('src/data/allTramites.json', 'r', encoding='utf-8') as f:
    master_data = json.load(f)

wb = openpyxl.Workbook()
wb.remove(wb.active)

# Paleta Institucional SAT
NAVY_HEADER = '14649B'      # Azul SAT Primario
BLUE_HEADER = '19324B'      # Azul Oscuro Título
CYAN_ACCENT = '0284C7'      # Celeste Operaciones
GREEN_ACCENT = '059669'     # Verde Consultas
ORANGE_ACCENT = 'C25E00'    # Naranja Modificaciones / Brechas
PURPLE_ACCENT = '7C3AED'    # Morado Normativa
ZEBRA_FILL = 'F8FAFC'       # Gris azulado muy claro
BORDER_COLOR = 'CBD5E1'     # Borde sutil

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
font_title = Font(name='Segoe UI', size=15, bold=True, color=BLUE_HEADER)
font_subtitle = Font(name='Segoe UI', size=11, color='475569')
font_bold = Font(name='Segoe UI', size=10, bold=True, color=BLUE_HEADER)
font_body = Font(name='Segoe UI', size=10, color='1E293B')
font_small = Font(name='Segoe UI', size=9, color='64748B')
font_link = Font(name='Segoe UI', size=9, color='0284C7', underline='single')

# ==============================================================================
# HOJA 1: RESUMEN ARQUITECTURA
# ==============================================================================
ws_resumen = wb.create_sheet(title="Resumen Arquitectura")
ws_resumen.views.sheetView[0].showGridLines = True

ws_resumen['B2'] = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA - SAT GUATEMALA"
ws_resumen['B2'].font = Font(name='Segoe UI', size=12, bold=True, color='64748B')

ws_resumen['B3'] = "ESTRUCTURA DE NAVEGACIÓN Y CONTENIDO DEL PORTAL WEB (MODELO ATO)"
ws_resumen['B3'].font = font_title

ws_resumen['B4'] = f"Arquitectura Homogénea de 5 Niveles y Ciclo de Vida ({len(master_data)} Contenidos)"
ws_resumen['B4'].font = font_subtitle

# KPI Cards
kpis = [
    ("TOTAL CONTENIDOS", f"{len(master_data)}", "Universo Completo SAT", "B6", "C7", NAVY_HEADER),
    ("NIVEL 1: SEGMENTOS", "4", "Grandes Áreas", "D6", "E7", BLUE_HEADER),
    ("NIVEL 2: ÁREAS / RÉGIMEN", "10", "Regímenes Oficiales", "F6", "G7", CYAN_ACCENT),
    ("CICLO DE VIDA ATO", "5", "Etapas sin Números", "H6", "I7", GREEN_ACCENT),
    ("TIPOLOGÍAS DE CONTENIDO", "7", "Formatos y Plantillas", "J6", "K7", PURPLE_ACCENT),
]

for label, val, sub, top_left, bot_right, color in kpis:
    ws_resumen.merge_cells(f"{top_left}:{bot_right}")
    cell = ws_resumen[top_left]
    cell.value = f"{label}\n{val}\n{sub}"
    cell.font = Font(name='Segoe UI', size=11, bold=True, color='FFFFFF')
    cell.fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

# Tabla 1: Segmentos
ws_resumen['B9'] = "1. SEGMENTOS PRINCIPALES (NIVEL 1)"
ws_resumen['B9'].font = font_bold

macro_headers = ["No.", "Segmento", "Alcance para el Ciudadano", "Total", "%"]
for col_idx, h in enumerate(macro_headers, start=2):
    c = ws_resumen.cell(row=10, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border

total_items = len(master_data)
mg_counts = {}
for t in master_data:
    m = t.get('nivel1_segmento', t.get('macroGrupo', 'Contribuyentes'))
    mg_counts[m] = mg_counts.get(m, 0) + 1

macro_rows = [
    (1, "Contribuyentes", "Personas y empresas del régimen interno (Vehículos, FEL, declaraciones)", mg_counts.get("Contribuyentes", 0)),
    (2, "Operadores de Comercio Exterior", "Aduanas, importadores, exportadores, AFPA, Maquilas y ZDEEP", mg_counts.get("Operadores de Comercio Exterior", 0)),
    (3, "Profesionales", "Contadores, auditores, notarios (traspasos TEV) y peritos", mg_counts.get("Profesionales", 0)),
    (4, "Entes Exentos", "Organizaciones no lucrativas, iglesias, misiones diplomáticas y Estado", mg_counts.get("Entes Exentos", 0)),
]

for r_idx, (mno, mnom, mdesc, mtot) in enumerate(macro_rows, start=11):
    pct = f"{(mtot/total_items)*100:.1f}%"
    ws_resumen.cell(row=r_idx, column=2, value=mno).alignment = Alignment(horizontal='center')
    ws_resumen.cell(row=r_idx, column=3, value=mnom).font = font_bold
    ws_resumen.cell(row=r_idx, column=4, value=mdesc).font = font_small
    ws_resumen.cell(row=r_idx, column=5, value=mtot).alignment = Alignment(horizontal='right')
    ws_resumen.cell(row=r_idx, column=6, value=pct).alignment = Alignment(horizontal='right')
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 7):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 4]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

# Tabla 2: Los 5 Niveles Simétricos
ws_resumen['B17'] = "2. ARQUITECTURA DE NAVEGACIÓN SIMÉTRICA (ESTÁNDAR ATO)"
ws_resumen['B17'].font = font_bold

niv_headers = ["Nivel", "Nombre en el Sitio", "Función en la Experiencia de Usuario", "Ubicación en Pantalla"]
for col_idx, h in enumerate(niv_headers, start=2):
    c = ws_resumen.cell(row=18, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border

niv_rows = [
    ("Nivel 1", "Segmento", "Identifica el gran sector del usuario", "Header Superior / Pestaña Principal"),
    ("Nivel 2", "Área Principal / Régimen", "El marco normativo o régimen tributario/aduanero", "Menú de Navegación Superior"),
    ("Nivel 3", "Sub-área / Contexto", "El perfil del usuario, materia o servicio específico", "Página Hub / Entrada Temática"),
    ("Nivel 4", "Tema de la Gestión", "La materia específica (sin perder el contexto)", "Menú Lateral Vertical (Sidebar)"),
    ("Nivel 5", "Trámite / Contenido", "La acción concreta en lenguaje claro con ciclo ATO", "Página Activa / Ficha del Servicio")
]

for r_idx, (nv, nnom, nfunc, npos) in enumerate(niv_rows, start=19):
    ws_resumen.cell(row=r_idx, column=2, value=nv).alignment = Alignment(horizontal='center')
    ws_resumen.cell(row=r_idx, column=3, value=nnom).font = font_bold
    ws_resumen.cell(row=r_idx, column=4, value=nfunc).font = font_body
    ws_resumen.cell(row=r_idx, column=5, value=npos).font = font_small
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 6):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [3]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

# Tabla 3: Ciclo de Vida ATO
ws_resumen['H9'] = "3. CICLO DE VIDA ATO (AUSTRALIA) - SIN NÚMEROS VISIBLES"
ws_resumen['H9'].font = font_bold

ato_headers = ["Etapa ATO", "Descripción Funcional", "Total", "%"]
for col_idx, h in enumerate(ato_headers, start=8):
    c = ws_resumen.cell(row=10, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border

ato_counts = {}
for t in master_data:
    a = t.get('etapaAtoLabel', 'Sin Etapa')
    ato_counts[a] = ato_counts.get(a, 0) + 1

ato_stages = [
    ("Empezar y registrarse", "Primer NIT, RTU Digital, padrones de importación/exportación y habilitación", ato_counts.get("Empezar y registrarse", 76)),
    ("Operación y declaraciones", "Facturación FEL, Declaraguate, DUCAs, retenciones, transferencias y pagos", ato_counts.get("Operación y declaraciones", 296)),
    ("Consultas y herramientas", "Verificadores en tiempo real, solvencia, selectivo aduanero, rampa y SAC", ato_counts.get("Consultas y herramientas", 135)),
    ("Modificaciones y cierre", "Actualización de RTU, traspaso vehicular, prórrogas, cese y subastas", ato_counts.get("Modificaciones y cierre", 140)),
    ("Normativa y asistencia", "Marco legal aduanero y tributario, devoluciones, criterios y capacitaciones", ato_counts.get("Normativa y asistencia", 136))
]

for r_idx, (enom, edesc, etot) in enumerate(ato_stages, start=11):
    pct = f"{(etot/total_items)*100:.1f}%"
    ws_resumen.cell(row=r_idx, column=8, value=enom).font = font_bold
    ws_resumen.cell(row=r_idx, column=9, value=edesc).font = font_small
    ws_resumen.cell(row=r_idx, column=10, value=etot).alignment = Alignment(horizontal='right')
    ws_resumen.cell(row=r_idx, column=11, value=pct).alignment = Alignment(horizontal='right')
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(8, 12):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [8, 9]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

for col in range(2, 12):
    ws_resumen.column_dimensions[get_column_letter(col)].width = 24
ws_resumen.column_dimensions['C'].width = 32
ws_resumen.column_dimensions['D'].width = 38
ws_resumen.column_dimensions['I'].width = 46

# ==============================================================================
# HOJA 2: MATRIZ MAESTRA COMPLETA (783 FILAS CON 5 NIVELES ATO)
# ==============================================================================
ws_master = wb.create_sheet(title=f"Matriz Maestra ({len(master_data)})")
ws_master.views.sheetView[0].showGridLines = True

headers_master = [
    "No.",
    "ID Trámite",
    "Nivel 1: Segmento",
    "Nivel 2: Área / Régimen",
    "Nivel 3: Sub-área / Contexto",
    "Nivel 4: Tema (Menú Lateral)",
    "Nivel 5: Nombre del Trámite (Lenguaje Claro)",
    "Etapa Ciclo de Vida ATO",
    "Tipo de Interacción",
    "Tipología de Contenido",
    "Plataforma / Sistema",
    "Canal",
    "¿Para qué sirve? (Descripción Operativa)",
    "Ruta de Proceso Asociada",
    "Estado Normativo",
    "URL Portal SAT"
]

for col_idx, h in enumerate(headers_master, start=1):
    c = ws_master.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_master.row_dimensions[1].height = 28

for r_idx, item in enumerate(master_data, start=2):
    rutas_str = ""
    if item.get('rutasProceso'):
        rutas_str = "; ".join([f"Proc #{p['procesoNo']} ({p['pasoAccion']})" for p in item['rutasProceso']])

    ws_master.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_master.cell(row=r_idx, column=2, value=item.get('id', '')).alignment = Alignment(horizontal='center')
    ws_master.cell(row=r_idx, column=3, value=item.get('nivel1_segmento', item.get('macroGrupo', ''))).font = font_bold
    ws_master.cell(row=r_idx, column=4, value=item.get('nivel2_area', ''))
    ws_master.cell(row=r_idx, column=5, value=item.get('nivel3_subarea', ''))
    ws_master.cell(row=r_idx, column=6, value=item.get('nivel4_tema', '')).font = font_bold
    ws_master.cell(row=r_idx, column=7, value=item.get('tramite', '')).font = font_bold
    
    # Etapa ATO
    c_etapa = ws_master.cell(row=r_idx, column=8, value=item.get('etapaAtoLabel', ''))
    c_etapa.font = font_bold
    if 'Empezar' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=NAVY_HEADER)
    elif 'Operaci' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=CYAN_ACCENT)
    elif 'Consulta' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=GREEN_ACCENT)
    elif 'Modifica' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=ORANGE_ACCENT)
    elif 'Normat' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=PURPLE_ACCENT)

    ws_master.cell(row=r_idx, column=9, value=item.get('tipoInteraccionLabel', ''))
    ws_master.cell(row=r_idx, column=10, value=item.get('tipologiaContenidoLabel', 'Guía de Requisitos y Pasos'))
    ws_master.cell(row=r_idx, column=11, value=item.get('plataformaSistemaLabel', item.get('plataformaSistema', 'Portal Web SAT')))
    ws_master.cell(row=r_idx, column=12, value=item.get('canalAtencion', '100% Digital')).alignment = Alignment(horizontal='center')
    ws_master.cell(row=r_idx, column=13, value=item.get('descripcion', ''))
    ws_master.cell(row=r_idx, column=14, value=rutas_str).font = font_small
    
    c_brecha = ws_master.cell(row=r_idx, column=15, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
    if item.get('esBrecha'):
        c_brecha.font = Font(name='Segoe UI', size=10, bold=True, color='C25E00')
        c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')

    c_url = ws_master.cell(row=r_idx, column=16, value=item.get('url', ''))
    if str(item.get('url', '')).startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = item.get('url')

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 17):
        cell = ws_master.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 6, 7, 8, 15, 16]: cell.font = font_body
        if not (c_idx == 15 and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_master.row_dimensions[r_idx].height = 22

master_widths = [8, 18, 24, 26, 28, 28, 40, 24, 24, 24, 22, 14, 48, 32, 16, 36]
for idx, w in enumerate(master_widths, start=1):
    ws_master.column_dimensions[get_column_letter(idx)].width = w

ws_master.freeze_panes = 'E2'
ws_master.auto_filter.ref = f"A1:P{len(master_data)+1}"

# ==============================================================================
# HOJA 3: COMERCIO EXTERIOR (246 FILAS CON 5 NIVELES ATO)
# ==============================================================================
ce_data = [item for item in master_data if item.get('nivel1_segmento') == 'Operadores de Comercio Exterior' or item.get('pillar') == 'comercio_exterior']
ws_ce = wb.create_sheet(title=f"Comercio Exterior ({len(ce_data)})")
ws_ce.views.sheetView[0].showGridLines = True

headers_ce = [
    "No.",
    "Nivel 2: Área Aduanera",
    "Nivel 3: Sub-área / Actor",
    "Nivel 4: Tema (Menú Lateral)",
    "Nivel 5: Nombre del Trámite (Lenguaje Claro)",
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
ws_ce.row_dimensions[1].height = 28

for r_idx, item in enumerate(ce_data, start=2):
    rutas_str = ""
    if item.get('rutasProceso'):
        rutas_str = "; ".join([f"Proc #{p['procesoNo']} ({p['pasoAccion']})" for p in item['rutasProceso']])

    ws_ce.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_ce.cell(row=r_idx, column=2, value=item.get('nivel2_area', '')).font = font_bold
    ws_ce.cell(row=r_idx, column=3, value=item.get('nivel3_subarea', ''))
    ws_ce.cell(row=r_idx, column=4, value=item.get('nivel4_tema', '')).font = font_bold
    ws_ce.cell(row=r_idx, column=5, value=item.get('tramite', '')).font = font_bold
    
    c_etapa = ws_ce.cell(row=r_idx, column=6, value=item.get('etapaAtoLabel', ''))
    c_etapa.font = font_bold
    if 'Empezar' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=NAVY_HEADER)
    elif 'Operaci' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=CYAN_ACCENT)
    elif 'Consulta' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=GREEN_ACCENT)
    elif 'Modifica' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=ORANGE_ACCENT)
    elif 'Normat' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=PURPLE_ACCENT)

    ws_ce.cell(row=r_idx, column=7, value=item.get('tipoInteraccionLabel', ''))
    ws_ce.cell(row=r_idx, column=8, value=item.get('tipologiaContenidoLabel', 'Guía de Requisitos y Pasos'))
    ws_ce.cell(row=r_idx, column=9, value=item.get('plataformaSistemaLabel', item.get('plataformaSistema', 'Portal Web SAT')))
    ws_ce.cell(row=r_idx, column=10, value=item.get('descripcion', ''))
    ws_ce.cell(row=r_idx, column=11, value=rutas_str).font = font_small
    
    c_brecha = ws_ce.cell(row=r_idx, column=12, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
    if item.get('esBrecha'):
        c_brecha.font = Font(name='Segoe UI', size=10, bold=True, color='C25E00')
        c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')

    c_url = ws_ce.cell(row=r_idx, column=13, value=item.get('url', ''))
    if str(item.get('url', '')).startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = item.get('url')

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 14):
        cell = ws_ce.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 4, 5, 6, 12, 13]: cell.font = font_body
        if not (c_idx == 12 and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_ce.row_dimensions[r_idx].height = 22

ce_widths = [8, 28, 28, 28, 40, 24, 24, 24, 22, 48, 30, 16, 36]
for idx, w in enumerate(ce_widths, start=1):
    ws_ce.column_dimensions[get_column_letter(idx)].width = w

ws_ce.freeze_panes = 'E2'
ws_ce.auto_filter.ref = f"A1:M{len(ce_data)+1}"

# ==============================================================================
# HOJA 4: BRECHAS OPERATIVAS DETECTADAS (26 FILAS)
# ==============================================================================
ws_brechas = wb.create_sheet(title="Brechas Normativas (26)")
ws_brechas.views.sheetView[0].showGridLines = True

headers_brechas = [
    "No.",
    "Segmento / Área",
    "Actor / Rol Afectado",
    "Tema (Menú Lateral)",
    "Etapa ATO",
    "Trámite Propuesto (Brecha)",
    "Justificación Técnica / Base Legal",
    "Pregunta Formal para Mesa de Trabajo SAT"
]

for col_idx, h in enumerate(headers_brechas, start=1):
    c = ws_brechas.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=ORANGE_ACCENT, end_color=ORANGE_ACCENT, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_brechas.row_dimensions[1].height = 28

brechas_list = [item for item in master_data if item.get('esBrecha')]

for r_idx, b in enumerate(brechas_list, start=2):
    ws_brechas.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_brechas.cell(row=r_idx, column=2, value=b.get('nivel1_segmento', b.get('macroGrupo', ''))).font = font_bold
    ws_brechas.cell(row=r_idx, column=3, value=b.get('nivel3_subarea', b.get('actorEspecifico', '')))
    ws_brechas.cell(row=r_idx, column=4, value=b.get('nivel4_tema', ''))
    ws_brechas.cell(row=r_idx, column=5, value=b.get('etapaAtoLabel', ''))
    ws_brechas.cell(row=r_idx, column=6, value=b.get('tramite', '')).font = font_bold
    ws_brechas.cell(row=r_idx, column=7, value=b.get('descripcion', ''))
    
    pregunta = f"¿Existe acuerdo de directorio o resolución que formalice el requisito digital para '{b.get('tramite', '')}' ante SAT?"
    ws_brechas.cell(row=r_idx, column=8, value=pregunta).font = Font(name='Segoe UI', size=9, italic=True, color='1E293B')

    fill_color = 'FFF7ED' if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 9):
        cell = ws_brechas.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 6, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_brechas.row_dimensions[r_idx].height = 24

brecha_widths = [8, 26, 28, 26, 24, 38, 45, 45]
for idx, w in enumerate(brecha_widths, start=1):
    ws_brechas.column_dimensions[get_column_letter(idx)].width = w

ws_brechas.freeze_panes = 'A2'
ws_brechas.auto_filter.ref = f"A1:H{len(brechas_list)+1}"

OUTPUT_EXCEL_PATH = 'docs/Estructura_Final_Contenido_Portal_SAT.xlsx'
OUTPUT_FALLBACK_PATH = 'docs/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx'

try:
    wb.save(OUTPUT_EXCEL_PATH)
    print(f"Libro Excel guardado en: {OUTPUT_EXCEL_PATH}")
except PermissionError:
    wb.save(OUTPUT_FALLBACK_PATH)
    print(f"Libro Excel guardado en copia actualizada: {OUTPUT_FALLBACK_PATH}")
