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
# HOJA 1: RESUMEN Y ARQUITECTURA (DASHBOARD CON FÓRMULAS DINÁMICAS VIVAS)
# ==============================================================================
ws_resumen = wb.create_sheet(title="Resumen Arquitectura")
ws_resumen.views.sheetView[0].showGridLines = True

# Banner Institucional Superior
ws_resumen.merge_cells('B2:H3')
banner = ws_resumen['B2']
banner.value = "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA — SAT GUATEMALA"
banner.font = font_title
banner.fill = PatternFill(start_color=BLUE_HEADER, end_color=BLUE_HEADER, fill_type='solid')
banner.alignment = Alignment(horizontal='center', vertical='center')

ws_resumen.merge_cells('B4:H4')
sub_banner = ws_resumen['B4']
sub_banner.value = "ARQUITECTURA DE INFORMACIÓN DEL PORTAL WEB — DEFINICIÓN DE SEGMENTOS, LEAD TEXT Y BASE JURÍDICA"
sub_banner.font = font_subtitle
sub_banner.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
sub_banner.alignment = Alignment(horizontal='center', vertical='center')

# Bloques KPI con fórmulas dinámicas vivas
kpis = [
    ("TOTAL CONTENIDOS", f"=COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})", "Universo Oficial SAT", "B6", "B7", NAVY_HEADER),
    ("CONTRIBUYENTES", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Contribuyentes")', "Régimen Interno", "C6", "C7", BLUE_HEADER),
    ("COMERCIO EXTERIOR", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Operadores de Comercio Exterior")', "Aduanas, AFPA y Zonas", "D6", "E7", CYAN_ACCENT),
    ("PROFESIONALES", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Profesionales")', "Notarios, CPA, TEV", "F6", "F7", GREEN_ACCENT),
    ("ENTES EXENTOS", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!C2:C{LAST_ROW}, "Entes Exentos")', "ONGs, Iglesias, Estado", "G6", "H7", PURPLE_ACCENT),
]

for label, formula, sub, top_left, bot_right, color in kpis:
    ws_resumen.merge_cells(f"{top_left}:{bot_right}")
    cell = ws_resumen[top_left]
    cell.value = formula
    cell.font = Font(name='Segoe UI', size=13, bold=True, color='FFFFFF')
    cell.fill = PatternFill(start_color=color, end_color=color, fill_type='solid')
    cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

# Tabla 1: Segmentos con Qué es, Lead text y Base jurídica
ws_resumen['B9'] = "1. SEGMENTOS PRINCIPALES DEL PORTAL (NIVEL 1) — DEFINICIONES INSTITUCIONALES"
ws_resumen['B9'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

macro_headers = [
    "No.",
    "Segmento (Nivel 1)",
    "Qué es: (Definición Operativa)",
    "Lead text: (Texto Orientador de Interfaz)",
    "Base jurídica: (Fundamento Legal Oficial: CAUCA, RECAUCA, Leyes)",
    "Total Contenidos",
    "% del Portal"
]

for col_idx, h in enumerate(macro_headers, start=2):
    c = ws_resumen.cell(row=10, column=col_idx, value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    c.border = header_border
ws_resumen.row_dimensions[10].height = 28

macro_rows = [
    (
        1,
        "Operadores de Comercio Exterior",
        "Son todas las personas individuales o jurídicas que intervienen en el ingreso, permanencia, traslado y salida de mercancías del territorio aduanero nacional. Comprende tanto a los dueños de las mercancías (importadores y exportadores) como a los prestadores de servicios logísticos autorizados (auxiliares de la función pública, transportistas, depósitos) y empresas que operan bajo regímenes territoriales especiales.",
        "Servicios e información aduanera para la importación, exportación y logística.",
        "Código Tributario (Dto. 6-91), CAUCA IV (Resolución 223-2008 COMIECO) y RECAUCA (Resolución 224-2008 COMIECO).",
        f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!D2:D{LAST_ROW}, "Operadores de Comercio Exterior")'
    ),
    (
        2,
        "Contribuyentes",
        "Son las personas individuales, jurídicas, patrimonios o entes afectos al cumplimiento de obligaciones tributarias internas en el territorio guatemalteco. Abarca a ciudadanos sin actividad económica activa, asalariados en relación de dependencia, pequeños contribuyentes, contribuyentes del régimen general del IVA e ISR, propietarios de vehículos y grandes/medianos contribuyentes especiales calificados.",
        "Información y servicios tributarios para personas y empresas.",
        "Constitución Política (Art. 135d), Código Tributario (Dto. 6-91), Ley del IVA (Dto. 27-92), Ley de Actualización Tributaria (Dto. 10-2012), Ley del ISCV (Dto. 70-94) y Ley de Simplificación Tributaria (Dto. 7-2019 / Dto. 31-2024).",
        f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!D2:D{LAST_ROW}, "Contribuyentes")'
    ),
    (
        3,
        "Profesionales",
        "Son las personas individuales colegiadas activas o técnicos acreditados ante la SAT que ejercen liberalmente su profesión o actúan como auxiliares técnicos en materia tributaria, mercantil y notarial. Comprende a abogados y notarios (traspasos vehiculares electrónicos y fe pública), peritos contadores, contadores públicos y auditores (CPA) y gestores tributarios acreditados.",
        "Herramientas y servicios especializados para profesionales tributarios y auxiliares.",
        "Código de Notariado (Dto. 314), Ley de Colegiación Profesional Obligatoria (Dto. 72-2001), Decreto 2450 (Normas de la Profesión Contable), Ley de Timbres Fiscales (Dto. 37-92) y Código Tributario (Art. 57 \"A\" y 112).",
        f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!D2:D{LAST_ROW}, "Profesionales")'
    ),
    (
        4,
        "Entes Exentos",
        "Son las personas jurídicas, entidades del sector público, organismos diplomáticos y organizaciones de la sociedad civil que, por mandato constitucional o ley específica ordinaria, gozan de exención total o parcial de tributos y aranceles en el territorio nacional. Incluye centros educativos, universidades, comunidades religiosas, ONGs, fundaciones sin fines de lucro, municipalidades y ministerios de Estado.",
        "Información y gestiones tributarias para entidades públicas y organizaciones no lucrativas.",
        "Constitución Política (Arts. 37, 73, 88 y 257), Ley de ONGs (Dto. 02-2003), Ley del IVA (Dto. 27-92, Art. 8), Ley de Actualización Tributaria (Dto. 10-2012, Art. 11), Código Municipal (Dto. 12-2002) y Ley Orgánica del Presupuesto (Dto. 101-97).",
        f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!D2:D{LAST_ROW}, "Entes Exentos")'
    ),
]

for r_idx, (mno, mnom, mqe, mlt, mbj, mformula) in enumerate(macro_rows, start=11):
    ws_resumen.cell(row=r_idx, column=2, value=mno).alignment = Alignment(horizontal='center', vertical='center')
    ws_resumen.cell(row=r_idx, column=3, value=mnom).font = font_bold
    ws_resumen.cell(row=r_idx, column=3).alignment = Alignment(horizontal='left', vertical='center')
    
    c_qe = ws_resumen.cell(row=r_idx, column=4, value=mqe)
    c_qe.font = font_body
    c_qe.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_lt = ws_resumen.cell(row=r_idx, column=5, value=mlt)
    c_lt.font = Font(name='Segoe UI', size=9, italic=True, bold=True, color='0369A1')
    c_lt.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_bj = ws_resumen.cell(row=r_idx, column=6, value=mbj)
    c_bj.font = Font(name='Segoe UI', size=9, bold=True, color='334155')
    c_bj.alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)

    c_tot = ws_resumen.cell(row=r_idx, column=7, value=mformula)
    c_tot.alignment = Alignment(horizontal='right', vertical='center')
    c_tot.font = font_bold
    
    c_pct = ws_resumen.cell(row=r_idx, column=8, value=f"=G{r_idx}/COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})")
    c_pct.alignment = Alignment(horizontal='right', vertical='center')
    c_pct.font = font_bold
    c_pct.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 4, 5, 6, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_resumen.row_dimensions[r_idx].height = 56

# Fila totalizador Segmentos
ws_resumen.cell(row=15, column=2, value="").border = thin_border
ws_resumen.cell(row=15, column=3, value="TOTAL PORTAL WEB SAT").font = font_bold
ws_resumen.cell(row=15, column=4, value="Universo total de fichas y servicios").font = font_small
ws_resumen.cell(row=15, column=5, value="").border = thin_border
ws_resumen.cell(row=15, column=6, value="").border = thin_border
c_tt = ws_resumen.cell(row=15, column=7, value="=SUM(G11:G14)")
c_tt.font = font_bold
c_tt.alignment = Alignment(horizontal='right', vertical='center')
c_tp = ws_resumen.cell(row=15, column=8, value="=SUM(H11:H14)")
c_tp.font = font_bold
c_tp.alignment = Alignment(horizontal='right', vertical='center')
c_tp.number_format = '0.0%'
for c_idx in range(2, 9):
    ws_resumen.cell(row=15, column=c_idx).border = thin_border
    ws_resumen.cell(row=15, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_resumen.row_dimensions[15].height = 24

# Tabla 2: Ciclo de Vida ATO
ws_resumen['B17'] = "2. CICLO DE VIDA ATO (AUSTRALIA) - SIN NÚMEROS VISIBLES"
ws_resumen['B17'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

ato_headers = ["Etapa ATO", "Descripción Funcional", "Total Contenidos", "%"]
for col_idx, h in enumerate(ato_headers, start=2):
    c = ws_resumen.cell(row=18, column=col_idx if col_idx < 4 else (col_idx + 3), value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border
ws_resumen.merge_cells('C18:F18')
ws_resumen.row_dimensions[18].height = 26

ato_stages = [
    ("Empezar y registrarse", "Primer NIT, RTU Digital, padrones de importación/exportación y habilitación inicial", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!O2:O{LAST_ROW}, "Empezar y registrarse")'),
    ("Operación y declaraciones", "Facturación FEL, Declaraguate, DUCAs, retenciones, transferencias y pagos", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!O2:O{LAST_ROW}, "Operación y declaraciones")'),
    ("Consultas y herramientas", "Verificadores en tiempo real, solvencia, selectivo aduanero, rampa y SAC", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!O2:O{LAST_ROW}, "Consultas y herramientas")'),
    ("Modificaciones y cierre", "Actualización de RTU, traspaso vehicular, prórrogas, cese de actividades y subastas", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!O2:O{LAST_ROW}, "Modificaciones y cierre")'),
    ("Normativa y asistencia", "Marco legal aduanero y tributario, devoluciones, criterios institucionales y cursos", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!O2:O{LAST_ROW}, "Normativa y asistencia")')
]

for r_idx, (enom, edesc, eformula) in enumerate(ato_stages, start=19):
    ws_resumen.cell(row=r_idx, column=2, value=enom).font = font_bold
    ws_resumen.cell(row=r_idx, column=2).alignment = Alignment(horizontal='left', vertical='center')
    
    ws_resumen.merge_cells(f"C{r_idx}:F{r_idx}")
    c_ed = ws_resumen.cell(row=r_idx, column=3, value=edesc)
    c_ed.font = font_small
    c_ed.alignment = Alignment(horizontal='left', vertical='center')

    c_at = ws_resumen.cell(row=r_idx, column=7, value=eformula)
    c_at.alignment = Alignment(horizontal='right', vertical='center')
    c_at.font = font_bold
    
    c_ap = ws_resumen.cell(row=r_idx, column=8, value=f"=G{r_idx}/COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})")
    c_ap.alignment = Alignment(horizontal='right', vertical='center')
    c_ap.font = font_bold
    c_ap.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_resumen.row_dimensions[r_idx].height = 22

# Total ATO
ws_resumen.cell(row=24, column=2, value="TOTAL POR CICLO ATO").font = font_bold
ws_resumen.merge_cells('C24:F24')
ws_resumen.cell(row=24, column=3, value="100% de contenidos clasificados según ciclo de vida").font = font_small
c_att = ws_resumen.cell(row=24, column=7, value="=SUM(G19:G23)")
c_att.font = font_bold
c_att.alignment = Alignment(horizontal='right', vertical='center')
c_atp = ws_resumen.cell(row=24, column=8, value="=SUM(H19:H23)")
c_atp.font = font_bold
c_atp.alignment = Alignment(horizontal='right', vertical='center')
c_atp.number_format = '0.0%'
for c_idx in range(2, 9):
    ws_resumen.cell(row=24, column=c_idx).border = thin_border
    ws_resumen.cell(row=24, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_resumen.row_dimensions[24].height = 24

# Tabla 3: Tipos de Interacción
ws_resumen['B26'] = "3. TIPOS DE INTERACCIÓN (CÓMO RESUELVE EL CIUDADANO)"
ws_resumen['B26'].font = Font(name='Segoe UI', size=11, bold=True, color='1E293B')

int_headers = ["Tipo de Interacción", "Modalidad Operativa", "Total Contenidos", "%"]
for col_idx, h in enumerate(int_headers, start=2):
    c = ws_resumen.cell(row=27, column=col_idx if col_idx < 4 else (col_idx + 3), value=h)
    c.font = font_header
    c.fill = PatternFill(start_color=CYAN_ACCENT, end_color=CYAN_ACCENT, fill_type='solid')
    c.alignment = Alignment(horizontal='center', vertical='center')
    c.border = header_border
ws_resumen.merge_cells('C27:F27')
ws_resumen.row_dimensions[27].height = 26

interactions = [
    ("Guía Informativa / Texto", "Páginas explicativas, requisitos de trámites presenciales o mixtos", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!P2:P{LAST_ROW}, "Guía Informativa / Texto")'),
    ("Trámite / Aplicativo en Línea", "Servicios digitales transaccionales (Agencia Virtual, Declaraguate, TEV, FEL)", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!P2:P{LAST_ROW}, "Trámite / Aplicativo en Línea")'),
    ("Consulta en Base de Datos", "Herramientas de verificación sin autenticación previa (RTU público, solvencias)", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!P2:P{LAST_ROW}, "Consulta en Base de Datos")'),
    ("Descarga de Documento / Software", "Descarga de formularios en PDF/Excel, software, manuales o legislación", f'=COUNTIF(\'{SHEET_MASTER_NAME}\'!P2:P{LAST_ROW}, "Descarga de Documento / Software")'),
]

for r_idx, (inom, idesc, iformula) in enumerate(interactions, start=28):
    ws_resumen.cell(row=r_idx, column=2, value=inom).font = font_bold
    ws_resumen.cell(row=r_idx, column=2).alignment = Alignment(horizontal='left', vertical='center')
    
    ws_resumen.merge_cells(f"C{r_idx}:F{r_idx}")
    c_id = ws_resumen.cell(row=r_idx, column=3, value=idesc)
    c_id.font = font_small
    c_id.alignment = Alignment(horizontal='left', vertical='center')

    c_it = ws_resumen.cell(row=r_idx, column=7, value=iformula)
    c_it.alignment = Alignment(horizontal='right', vertical='center')
    c_it.font = font_bold
    
    c_ip = ws_resumen.cell(row=r_idx, column=8, value=f"=G{r_idx}/COUNTA('{SHEET_MASTER_NAME}'!A2:A{LAST_ROW})")
    c_ip.alignment = Alignment(horizontal='right', vertical='center')
    c_ip.font = font_bold
    c_ip.number_format = '0.0%'
    
    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(2, 9):
        cell = ws_resumen.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 3, 7, 8]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_resumen.row_dimensions[r_idx].height = 22

# Total Interacciones
ws_resumen.cell(row=32, column=2, value="TOTAL INTERACCIONES").font = font_bold
ws_resumen.merge_cells('C32:F32')
ws_resumen.cell(row=32, column=3, value="100% de contenidos catalogados").font = font_small
c_itt = ws_resumen.cell(row=32, column=7, value="=SUM(G28:G31)")
c_itt.font = font_bold
c_itt.alignment = Alignment(horizontal='right', vertical='center')
c_itp = ws_resumen.cell(row=32, column=8, value="=SUM(H28:H31)")
c_itp.font = font_bold
c_itp.alignment = Alignment(horizontal='right', vertical='center')
c_itp.number_format = '0.0%'
for c_idx in range(2, 9):
    ws_resumen.cell(row=32, column=c_idx).border = thin_border
    ws_resumen.cell(row=32, column=c_idx).fill = PatternFill(start_color='E2E8F0', end_color='E2E8F0', fill_type='solid')
ws_resumen.row_dimensions[32].height = 24

# Ajustar anchos en Resumen
resumen_col_widths = {
    1: 4, 2: 6, 3: 32, 4: 55, 5: 50, 6: 55, 7: 18, 8: 14
}
for col_idx, width in resumen_col_widths.items():
    ws_resumen.column_dimensions[get_column_letter(col_idx)].width = width

# ==============================================================================
# ==============================================================================
# HOJAS 2 Y 3: ESTRUCTURA UNIFICADA Y HOMÓLOGA BASADA EN LA MIGA DE PAN
# ==============================================================================
headers_unified = [
    "No.",
    "ID Trámite",
    "Orden N1",
    "Nivel 1",
    "Orden N2",
    "Nivel 2",
    "Orden N3",
    "Nivel 3",
    "Orden N4",
    "Nivel 4",
    "Orden N5",
    "Nivel 5",
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

unified_widths = [8, 18, 10, 24, 10, 28, 10, 28, 10, 28, 10, 28, 38, 55, 24, 24, 24, 20, 16, 24, 48, 50, 28, 16, 42]

def populate_unified_sheet(ws, dataset):
    ws.views.sheetView[0].showGridLines = True
    for col_idx, h in enumerate(headers_unified, start=1):
        c = ws.cell(row=1, column=col_idx, value=h)
        c.font = font_header
        c.fill = PatternFill(start_color=NAVY_HEADER, end_color=NAVY_HEADER, fill_type='solid')
        c.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        c.border = header_border
    ws.row_dimensions[1].height = 30

    for r_idx, item in enumerate(dataset, start=2):
        rutas_str = "N/A"
        if item.get('rutasProceso'):
            rutas_str = "; ".join([f"Proc #{p['procesoNo']} ({p['pasoAccion']})" for p in item['rutasProceso']])

        miga_raw = item.get('migaBreadcrumb', '')
        miga_parts = [p.strip() for p in miga_raw.split('>') if p.strip()] if miga_raw else []

        nav_levels = miga_parts[:-1] if len(miga_parts) > 1 else miga_parts

        n1 = item.get('nivel1_segmento') or item.get('segmento') or (nav_levels[0] if len(nav_levels) > 0 else '—')
        n2 = item.get('nivel2_area') or item.get('nivel2_categoria') or item.get('nivel2_rama') or item.get('nivel2_rol') or item.get('regimenArea') or item.get('categoria') or (nav_levels[1] if len(nav_levels) > 1 else '—')
        n3 = item.get('nivel3_subarea') or item.get('nivel3_subcategoria') or item.get('nivel3_actor') or item.get('grupoActor') or item.get('subcategoria') or (nav_levels[2] if len(nav_levels) > 2 else '—')
        n4 = item.get('nivel4_tema') or item.get('materiaTema') or item.get('tema') or (nav_levels[3] if len(nav_levels) > 3 else '—')
        n5 = item.get('nivel5_tramite') or item.get('subtemaGestion') or item.get('subtema') or (nav_levels[4] if len(nav_levels) > 4 else '—')
        if not n4 or str(n4).strip() == '': n4 = '—'
        if not n5 or str(n5).strip() == '': n5 = '—'

        ord_n1 = item.get('orden_n1', 1)
        ord_n2 = item.get('orden_n2', 1)
        ord_n3 = item.get('orden_n3', 1)
        ord_n4 = item.get('orden_n4', 1)
        ord_n5 = item.get('orden_n5', 1)

        # Col 1: No.
        ws.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
        # Col 2: ID Trámite
        ws.cell(row=r_idx, column=2, value=item.get('id', '')).alignment = Alignment(horizontal='center')
        # Col 3: Orden N1
        c_o1 = ws.cell(row=r_idx, column=3, value=ord_n1)
        c_o1.alignment = Alignment(horizontal='center')
        c_o1.font = font_bold
        # Col 4: Nivel 1
        ws.cell(row=r_idx, column=4, value=n1).font = font_bold
        # Col 5: Orden N2
        c_o2 = ws.cell(row=r_idx, column=5, value=ord_n2)
        c_o2.alignment = Alignment(horizontal='center')
        c_o2.font = font_bold
        # Col 6: Nivel 2
        ws.cell(row=r_idx, column=6, value=n2)
        # Col 7: Orden N3
        c_o3 = ws.cell(row=r_idx, column=7, value=ord_n3)
        c_o3.alignment = Alignment(horizontal='center')
        c_o3.font = font_bold
        # Col 8: Nivel 3
        ws.cell(row=r_idx, column=8, value=n3)
        # Col 9: Orden N4
        c_o4 = ws.cell(row=r_idx, column=9, value=ord_n4)
        c_o4.alignment = Alignment(horizontal='center')
        c_o4.font = font_bold
        # Col 10: Nivel 4
        ws.cell(row=r_idx, column=10, value=n4)
        # Col 11: Orden N5
        c_o5 = ws.cell(row=r_idx, column=11, value=ord_n5)
        c_o5.alignment = Alignment(horizontal='center')
        c_o5.font = font_bold
        # Col 12: Nivel 5
        ws.cell(row=r_idx, column=12, value=n5)
        # Col 13: Nombre del Trámite / Servicio (Lenguaje Claro)
        ws.cell(row=r_idx, column=13, value=item.get('tramite', '')).font = font_bold
        # Col 14: Ruta de Navegación (Miga de Pan)
        c_miga = ws.cell(row=r_idx, column=14, value=miga_raw)
        c_miga.font = font_small
        # Col 15: Etapa ATO
        c_etapa = ws.cell(row=r_idx, column=15, value=item.get('etapaAtoLabel', ''))
        c_etapa.font = font_bold
        if 'Empezar' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=NAVY_HEADER)
        elif 'Operaci' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=CYAN_ACCENT)
        elif 'Consulta' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=GREEN_ACCENT)
        elif 'Modifica' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=ORANGE_ACCENT)
        elif 'Normat' in str(c_etapa.value): c_etapa.font = Font(name='Segoe UI', size=10, bold=True, color=PURPLE_ACCENT)
        # Col 16: Tipo de Interacción
        ws.cell(row=r_idx, column=16, value=item.get('tipoInteraccionLabel', ''))
        # Col 17: Tipología de Contenido
        ws.cell(row=r_idx, column=17, value=item.get('tipologiaContenidoLabel', 'Guía Informativa / Texto'))
        # Col 18: Plataforma
        ws.cell(row=r_idx, column=18, value=item.get('plataformaSistemaLabel', item.get('plataformaSistema', 'Portal Web SAT')))
        # Col 19: Canal
        ws.cell(row=r_idx, column=19, value=item.get('canalAtencion', 'Digital / Web')).alignment = Alignment(horizontal='center')
        # Col 20: Control de Auditoría
        c_audit = ws.cell(row=r_idx, column=20, value=item.get('controlAuditoria', 'APROBADO'))
        c_audit.alignment = Alignment(horizontal='center', vertical='center')
        if item.get('esBrecha'):
            c_audit.font = Font(name='Segoe UI', size=9, bold=True, color='C25E00')
            c_audit.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')
        else:
            c_audit.font = font_bold
        # Col 21: Descripción Operativa
        ws.cell(row=r_idx, column=21, value=item.get('descripcion', ''))
        # Col 22: Base Legal
        c_base = ws.cell(row=r_idx, column=22, value=item.get('baseLegal', 'CAUCA IV y RECAUCA IV' if item.get('segmento') == 'Operadores de Comercio Exterior' else 'Código Tributario y Leyes Específicas'))
        c_base.font = font_bold
        # Col 23: Ruta de Proceso
        ws.cell(row=r_idx, column=23, value=rutas_str).font = font_small
        # Col 24: Estado Normativo
        c_brecha = ws.cell(row=r_idx, column=24, value="Brecha Propuesta" if item.get('esBrecha') else "Vigente")
        c_brecha.alignment = Alignment(horizontal='center', vertical='center')
        if item.get('esBrecha'):
            c_brecha.font = Font(name='Segoe UI', size=9, bold=True, color='C25E00')
            c_brecha.fill = PatternFill(start_color='FFEDD5', end_color='FFEDD5', fill_type='solid')
        # Col 25: URL Oficial
        raw_url = str(item.get('url', '')).strip()
        c_url = ws.cell(row=r_idx, column=25, value=raw_url)
        if raw_url.startswith('http'):
            c_url.font = font_link
            c_url.hyperlink = raw_url

        fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
        for c_idx in range(1, 26):
            cell = ws.cell(row=r_idx, column=c_idx)
            if c_idx not in [3, 4, 5, 7, 9, 11, 13, 14, 15, 20, 22, 23, 24, 25]: cell.font = font_body
            if not ((c_idx in [20, 24]) and item.get('esBrecha')):
                cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
            cell.border = thin_border
        ws.row_dimensions[r_idx].height = 22

    for idx, w in enumerate(unified_widths, start=1):
        ws.column_dimensions[get_column_letter(idx)].width = w

    ws.freeze_panes = 'E2'
    ws.auto_filter.ref = f"A1:Y{len(dataset)+1}"

# HOJA 2: MATRIZ MAESTRA (716)
ws_master = wb.create_sheet(title=SHEET_MASTER_NAME)
populate_unified_sheet(ws_master, master_data)

# HOJA 3: CONTRIBUYENTES (344)
contrib_data = [item for item in master_data if item.get('segmento') == 'Contribuyentes' or item.get('pillar') == 'contribuyentes']
ws_contrib = wb.create_sheet(title=f"Contribuyentes ({len(contrib_data)})")
populate_unified_sheet(ws_contrib, contrib_data)

# HOJA 4: COMERCIO EXTERIOR (246)
ce_data = [item for item in master_data if item.get('segmento') == 'Operadores de Comercio Exterior' or item.get('pillar') == 'comercio_exterior']
ws_ce = wb.create_sheet(title=f"Comercio Exterior ({len(ce_data)})")
populate_unified_sheet(ws_ce, ce_data)

# HOJA 5: PROFESIONALES (47)
prof_data = [item for item in master_data if item.get('segmento') == 'Profesionales' or item.get('pillar') == 'profesionales']
ws_prof = wb.create_sheet(title=f"Profesionales ({len(prof_data)})")
populate_unified_sheet(ws_prof, prof_data)

# HOJA 6: ENTES EXENTOS (79)
exentos_data = [item for item in master_data if item.get('segmento') == 'Entes Exentos' or item.get('pillar') == 'entes_exentos']
ws_exentos = wb.create_sheet(title=f"Entes Exentos ({len(exentos_data)})")
populate_unified_sheet(ws_exentos, exentos_data)

# ==============================================================================
# HOJA 5: BRECHAS NORMATIVAS (LAS 12 BRECHAS DE COMERCIO EXTERIOR)
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
try:
    wb.save(OUTPUT_EXCEL_PATH)
    print(f"Libro Excel maestro guardado exitosamente en: {OUTPUT_EXCEL_PATH}")
except PermissionError:
    fallback_path = 'docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado_v25col.xlsx'
    wb.save(fallback_path)
    print(f"[AVISO] El archivo '{OUTPUT_EXCEL_PATH}' está actualmente abierto en Excel.")
    print(f"Se ha guardado la versión actualizada con 25 columnas en: {fallback_path}")

print(f"Hojas: {', '.join(wb.sheetnames)}")
