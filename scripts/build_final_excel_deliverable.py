import json
import os
import re
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# ==============================================================================
# 1. CARGA DEL DATASET MAESTRO (739 REGISTROS)
# ==============================================================================
ALL_TRAMITES_PATH = 'src/data/allTramites.json'
with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

TOTAL_ROWS = len(master_data) # 739
LAST_ROW = TOTAL_ROWS + 1     # 740

# Cargar las brechas de comercio exterior desde el dataset y el documento
BRECHAS_MD_PATH = 'docs/arquitectura-informacion/brechas-comercio-exterior.md'
brechas_oficiales = []
if os.path.exists(BRECHAS_MD_PATH):
    with open(BRECHAS_MD_PATH, 'r', encoding='utf-8') as f:
        md_text = f.read()
    pattern = r'\|\s*\*\*(\d+)\*\*\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|'
    raw_matches = re.findall(pattern, md_text)
    for num, actor, subtema, tramite, justif in raw_matches:
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

print(f"Cargados {TOTAL_ROWS} trámites maestros y {len(brechas_oficiales)} brechas oficiales.")

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

font_title = Font(name='Segoe UI', size=16, bold=True, color='FFFFFF')
font_subtitle = Font(name='Segoe UI', size=10, italic=True, color='FFFFFF')
font_header = Font(name='Segoe UI', size=10, bold=True, color='FFFFFF')
font_body = Font(name='Segoe UI', size=9)
font_bold = Font(name='Segoe UI', size=9, bold=True)
font_small = Font(name='Segoe UI', size=8, color='475569')
font_link = Font(name='Segoe UI', size=9, color='0284C7', underline='single')

thin_border = Border(
    left=Side(style='thin', color=BORDER_COLOR),
    right=Side(style='thin', color=BORDER_COLOR),
    top=Side(style='thin', color=BORDER_COLOR),
    bottom=Side(style='thin', color=BORDER_COLOR)
)

header_border = Border(
    left=Side(style='thin', color='FFFFFF'),
    right=Side(style='thin', color='FFFFFF'),
    top=Side(style='medium', color='FFFFFF'),
    bottom=Side(style='medium', color='FFFFFF')
)

SHEET_MASTER_NAME = f"Matriz Maestra ({TOTAL_ROWS})"

# ==============================================================================
# HOJA 1: RESUMEN Y ARQUITECTURA (DASHBOARD CON 27 FÓRMULAS DINÁMICAS VIVAS)
# ==============================================================================
ws_resumen = wb.create_sheet(title="Resumen Arquitectura")
ws_resumen.views.sheetView[0].showGridLines = True

# Banner Institucional Superior
ws_resumen.merge_cells('B2:K3')
banner = ws_resumen['B2']
banner.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner.font = font_title
banner.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner.alignment = Alignment(horizontal='center', vertical='center')

ws_resumen.merge_cells('B4:K4')
sub_banner = ws_resumen['B4']
sub_banner.value = "ARQUITECTURA DE INFORMACIÓN DEL PORTAL WEB — DASHBOARD EJECUTIVO DE CONTROL Y COBERTURA"
sub_banner.font = font_subtitle
sub_banner.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_banner.alignment = Alignment(horizontal='center', vertical='center')

# Bloques KPI con fórmulas dinámicas vivas
kpis = [
    ("TOTAL CONTENIDOS", f"=COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})", "Universo Oficial SAT", "B6", "C7", NAVY_HEADER),
    ("CONTRIBUYENTES", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Contribuyentes")', "Régimen Interno", "D6", "E7", BLUE_HEADER),
    ("COMERCIO EXTERIOR", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Operadores de Comercio Exterior")', "Aduanas, AFPA y Zonas", "F6", "G7", CYAN_ACCENT),
    ("PROFESIONALES", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Profesionales")', "Notarios, Contadores, TEV", "H6", "I7", GREEN_ACCENT),
    ("ENTES EXENTOS", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Entes Exentos")', "ONGs, Iglesias y Estado", "J6", "K7", PURPLE_ACCENT),
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
    (1, "Contribuyentes", "Personas y empresas del régimen interno (Vehículos, FEL, RTU y declaraciones)", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Contribuyentes")'),
    (2, "Operadores de Comercio Exterior", "Aduanas, importadores, exportadores, AFPA (Almacenes, DAT, AGD), Maquilas y ZDEEP", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Operadores de Comercio Exterior")'),
    (3, "Profesionales", "Contadores, auditores, notarios (traspasos electrónicos TEV) y peritos", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Profesionales")'),
    (4, "Entes Exentos", "Organizaciones no lucrativas, iglesias, colegios, misiones diplomáticas y Estado", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Entes Exentos")'),
]

for r_idx, (mno, mnom, mdesc, mformula) in enumerate(macro_rows, start=11):
    ws_resumen.cell(row=r_idx, column=2, value=mno).alignment = Alignment(horizontal='center')
    ws_resumen.cell(row=r_idx, column=3, value=mnom).font = font_bold
    ws_resumen.cell(row=r_idx, column=4, value=mdesc).font = font_small
    c_tot = ws_resumen.cell(row=r_idx, column=5, value=mformula)
    c_tot.alignment = Alignment(horizontal='right')
    c_tot.font = font_bold
    
    c_pct = ws_resumen.cell(row=r_idx, column=6, value=f"=E{r_idx}/COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})")
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
    ("Empezar y registrarse", "Primer NIT, RTU Digital, padrones de importación/exportación y habilitación", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!K2:K{LAST_ROW}, "Empezar y registrarse")'),
    ("Operación y declaraciones", "Facturación FEL, Declaraguate, DUCAs, retenciones, transferencias y pagos", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!K2:K{LAST_ROW}, "Operación y declaraciones")'),
    ("Consultas y herramientas", "Verificadores en tiempo real, solvencia, selectivo aduanero, rampa y SAC", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!K2:K{LAST_ROW}, "Consultas y herramientas")'),
    ("Modificaciones y cierre", "Actualización de RTU, traspaso vehicular, prórrogas, cese y subastas", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!K2:K{LAST_ROW}, "Modificaciones y cierre")'),
    ("Normativa y asistencia", "Marco legal aduanero y tributario, devoluciones, criterios y capacitaciones", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!K2:K{LAST_ROW}, "Normativa y asistencia")')
]

for r_idx, (enom, edesc, eformula) in enumerate(ato_stages, start=11):
    ws_resumen.cell(row=r_idx, column=8, value=enom).font = font_bold
    ws_resumen.cell(row=r_idx, column=9, value=edesc).font = font_small
    c_at = ws_resumen.cell(row=r_idx, column=10, value=eformula)
    c_at.alignment = Alignment(horizontal='right')
    c_at.font = font_bold
    
    c_ap = ws_resumen.cell(row=r_idx, column=11, value=f"=J{r_idx}/COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})")
    c_ap.alignment = Alignment(horizontal='right')
    c_ap.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(8, 12):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [8, 9, 10]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

# Fila totalizador ATO
ws_resumen.cell(row=16, column=8, value="TOTAL POR CICLO ATO").font = font_bold
ws_resumen.cell(row=16, column=9, value="100% de contenidos clasificados").font = font_small
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

# Tabla 3: Tipos de Interacción
ws_resumen['B18'] = "3. TIPOS DE INTERACCIÓN (CÓMO RESUELVE EL CIUDADANO)"
ws_resumen['B18'].font = font_bold

int_headers = ["Tipo de Interacción", "Modalidad Operativa", "Total", "%"]
for col_idx, h in enumerate(int_headers, start=2):
    c = ws_resumen.cell(row=19, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=CYAN_ACCENT, end_color=CYAN_ACCENT, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border

interactions = [
    ("Guía Informativa / Texto", "Páginas explicativas, requisitos de trámites presenciales o mixtos", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!L2:L{LAST_ROW}, "Guía Informativa / Texto")'),
    ("Trámite / Aplicativo en Línea", "Servicios digitales transaccionales (Agencia Virtual, Declaraguate, TEV, FEL)", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!L2:L{LAST_ROW}, "Trámite / Aplicativo en Línea")'),
    ("Consulta en Base de Datos", "Herramientas de verificación sin autenticación previa (RTU público, solvencias)", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!L2:L{LAST_ROW}, "Consulta en Base de Datos")'),
    ("Descarga de Documento / Software", "Descarga de formularios en PDF/Excel, software, manuales o legislación", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!L2:L{LAST_ROW}, "Descarga de Documento / Software")'),
]

for r_idx, (inom, idesc, iformula) in enumerate(interactions, start=20):
    ws_resumen.cell(row=r_idx, column=2, value=inom).font = font_bold
    ws_resumen.cell(row=r_idx, column=3, value=idesc).font = font_small
    c_it = ws_resumen.cell(row=r_idx, column=4, value=iformula)
    c_it.alignment = Alignment(horizontal='right')
    c_it.font = font_bold
    
    c_ip = ws_resumen.cell(row=r_idx, column=5, value=f"=D{r_idx}/COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})")
    c_ip.alignment = Alignment(horizontal='right')
    c_ip.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 6):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 4]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border

# Fila totalizador Interacciones
ws_resumen.cell(row=24, column=2, value="TOTAL INTERACCIONES").font = font_bold
ws_resumen.cell(row=24, column=3, value="100% de contenidos catalogados").font = font_small
c_itt = ws_resumen.cell(row=24, column=4, value="=SUM(D20:D23)")
c_itt.font = font_bold
c_itt.alignment = Alignment(horizontal='right')
c_itp = ws_resumen.cell(row=24, column=5, value="=SUM(E20:E23)")
c_itp.font = font_bold
c_itp.alignment = Alignment(horizontal='right')
c_itp.number_format = '0.0%'
for c_idx in range(2, 6):
    ws_resumen.cell(row=24, column=c_idx).border = thin_border
    ws_resumen.cell(row=24, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')

# Ajustar anchos en Resumen
resumen_col_widths = {
    1: 4, 2: 6, 3: 32, 4: 48, 5: 18, 6: 14, 7: 4, 8: 26, 9: 46, 10: 16, 11: 14
}
for col_idx, width in resumen_col_widths.items():
    ws_resumen.column_dimensions[get_column_letter(col_idx)].width = width

# ==============================================================================
# HOJA 2: MATRIZ MAESTRA (739 FILAS CON CONTROL DE AUDITORÍA Y 100% URLs)
# ==============================================================================
ws_master = wb.create_sheet(title=SHEET_MASTER_NAME)
ws_master.views.sheetView[0].showGridLines = True

headers_master = [
    "No.",
    "ID Trámite",
    "Segmento (L1)",
    "Régimen / Área (L2)",
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
    "Control de Auditoría",
    "¿Para qué sirve? (Descripción Operativa)",
    "Base Legal / Fundamento Jurídico (En base a qué: CAUCA, RECAUCA, Leyes)",
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
    
    # Control de Auditoría
    c_audit = ws_master.cell(row=r_idx, column=16, value=item.get('controlAuditoria', 'APROBADO'))
    c_audit.alignment = Alignment(horizontal='center', vertical='center')
    if item.get('esBrecha'):
        c_audit.font = Font(name='Segoe UI', size=9, bold=True, color='C25E00')
        c_audit.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')
    else:
        c_audit.font = font_bold

    ws_master.cell(row=r_idx, column=17, value=item.get('descripcion', ''))
    
    # Base Legal (En base a qué)
    c_base = ws_master.cell(row=r_idx, column=18, value=item.get('baseLegal', 'Código Tributario y Leyes Específicas'))
    c_base.font = font_bold
    
    ws_master.cell(row=r_idx, column=19, value=rutas_str).font = font_small
    
    # Estado Normativo
    c_brecha = ws_master.cell(row=r_idx, column=20, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
    c_brecha.alignment = Alignment(horizontal='center', vertical='center')
    if item.get('esBrecha'):
        c_brecha.font = Font(name='Segoe UI', size=9, bold=True, color='C25E00')
        c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')

    # URL Oficial SAT
    raw_url = str(item.get('url', '')).strip()
    c_url = ws_master.cell(row=r_idx, column=21, value=raw_url)
    if raw_url.startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = raw_url

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 22):
        cell = ws_master.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 7, 9, 10, 11, 16, 18, 19, 20, 21]: cell.font = font_body
        if not ((c_idx in [16, 20]) and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_master.row_dimensions[r_idx].height = 22

master_widths = [8, 18, 24, 26, 26, 26, 28, 24, 38, 55, 24, 24, 24, 22, 14, 24, 48, 50, 30, 16, 42]
for idx, w in enumerate(master_widths, start=1):
    ws_master.column_dimensions[get_column_letter(idx)].width = w

ws_master.freeze_panes = 'E2'
ws_master.auto_filter.ref = f"A1:U{LAST_ROW}"

# ==============================================================================
# HOJA 3: COMERCIO EXTERIOR (202 FILAS NETAS SANEADAS)
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
    "Control de Auditoría",
    "¿Para qué sirve? (Descripción Operativa)",
    "Base Legal / Fundamento Jurídico (En base a qué: CAUCA, RECAUCA, Leyes)",
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
    
    # Control de Auditoría
    c_audit = ws_ce.cell(row=r_idx, column=13, value=item.get('controlAuditoria', 'APROBADO'))
    c_audit.alignment = Alignment(horizontal='center', vertical='center')
    if item.get('esBrecha'):
        c_audit.font = Font(name='Segoe UI', size=9, bold=True, color='C25E00')
        c_audit.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')
    else:
        c_audit.font = font_bold

    ws_ce.cell(row=r_idx, column=14, value=item.get('descripcion', ''))
    
    # Base Legal
    c_base = ws_ce.cell(row=r_idx, column=15, value=item.get('baseLegal', 'CAUCA IV y RECAUCA IV'))
    c_base.font = font_bold

    ws_ce.cell(row=r_idx, column=16, value=rutas_str).font = font_small
    
    c_brecha = ws_ce.cell(row=r_idx, column=17, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
    c_brecha.alignment = Alignment(horizontal='center', vertical='center')
    if item.get('esBrecha'):
        c_brecha.font = Font(name='Segoe UI', size=9, bold=True, color='C25E00')
        c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')

    raw_url = str(item.get('url', '')).strip()
    c_url = ws_ce.cell(row=r_idx, column=18, value=raw_url)
    if raw_url.startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = raw_url

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 19):
        cell = ws_ce.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 5, 7, 8, 9, 13, 15, 16, 17, 18]: cell.font = font_body
        if not ((c_idx in [13, 17]) and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_ce.row_dimensions[r_idx].height = 22

ce_widths = [8, 28, 28, 28, 28, 24, 38, 55, 24, 24, 24, 22, 24, 48, 50, 30, 16, 42]
for idx, w in enumerate(ce_widths, start=1):
    ws_ce.column_dimensions[get_column_letter(idx)].width = w

ws_ce.freeze_panes = 'E2'
ws_ce.auto_filter.ref = f"A1:R{len(ce_data)+1}"

# ==============================================================================
# HOJA 4: BRECHAS NORMATIVAS (LAS 24 BRECHAS DE COMERCIO EXTERIOR)
# ==============================================================================
ce_brechas = [item for item in ce_data if item.get('esBrecha')]

ws_brechas = wb.create_sheet(title=f"Brechas Normativas ({len(ce_brechas)})")
ws_brechas.views.sheetView[0].showGridLines = True

headers_brechas = [
    "No.",
    "Actor / Rol Aduanero Afectado",
    "Área Funcional / Subtema",
    "Trámite Propuesto (Brecha)",
    "Descripción / Situación Operativa",
    "Pregunta Formal para Mesa Técnica de Aduanas"
]

for col_idx, h in enumerate(headers_brechas, start=1):
    c = ws_brechas.cell(row=1, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=ORANGE_ACCENT, end_color=ORANGE_ACCENT, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_brechas.row_dimensions[1].height = 30

for r_idx, b in enumerate(ce_brechas, start=2):
    t_clean = b['tramite'].lower()
    
    # Buscar situación y pregunta oficial coincidente
    match_oficial = next((m for m in brechas_oficiales if m['tramite'].lower() in t_clean or t_clean in m['tramite'].lower()), None)
    
    sit_val = match_oficial['situacion'] if match_oficial else b['descripcion']
    preg_val = match_oficial['pregunta'] if match_oficial else f"¿Existe acuerdo de directorio o resolución que formalice el requisito digital para '{b['tramite']}' ante SAT?"

    ws_brechas.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_brechas.cell(row=r_idx, column=2, value=b['categoria']).font = font_bold
    ws_brechas.cell(row=r_idx, column=3, value=b['subcategoria'])
    ws_brechas.cell(row=r_idx, column=4, value=b['tramite']).font = font_bold
    ws_brechas.cell(row=r_idx, column=5, value=sit_val)
    
    c_preg = ws_brechas.cell(row=r_idx, column=6, value=preg_val)
    c_preg.font = Font(name='Segoe UI', size=9, italic=True, color='1E293B')

    fill_color = 'FFF7ED' if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 7):
        cell = ws_brechas.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 4, 6]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_brechas.row_dimensions[r_idx].height = 26

brecha_widths = [8, 30, 26, 40, 52, 52]
for idx, w in enumerate(brecha_widths, start=1):
    ws_brechas.column_dimensions[get_column_letter(idx)].width = w

ws_brechas.freeze_panes = 'A2'
ws_brechas.auto_filter.ref = f"A1:F{len(ce_brechas)+1}"

# ==============================================================================
# GUARDAR LIBRO DEFINITIVO
# ==============================================================================
OUTPUT_EXCEL_PATH = 'docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx'
wb.save(OUTPUT_EXCEL_PATH)
print(f"Libro Excel maestro guardado exitosamente en: {OUTPUT_EXCEL_PATH}")
print(f"Hojas: Resumen Arquitectura, {SHEET_MASTER_NAME}, Comercio Exterior ({len(ce_data)}), Brechas Normativas ({len(ce_brechas)})")
