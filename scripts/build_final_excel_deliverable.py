import json
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# ==============================================================================
# 1. CARGA Y CLASIFICACIÓN DE JERARQUÍA ASIMÉTRICA EN allTramites.json
# ==============================================================================
ALL_TRAMITES_PATH = 'src/data/allTramites.json'
with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

def classify_asymmetric_hierarchy(item):
    pillar = str(item.get('pillar', item.get('nivel1_segmento', 'contribuyentes'))).lower()
    macro = str(item.get('nivel1_segmento', item.get('macroGrupo', 'Contribuyentes'))).lower()
    
    # 1. Segmento (Nivel 1)
    if 'comercio' in pillar or 'comercio' in macro:
        segmento = "Operadores de Comercio Exterior"
    elif 'profesional' in pillar or 'profesional' in macro:
        segmento = "Profesionales"
    elif 'exento' in pillar or 'exento' in macro or 'organismo' in pillar:
        segmento = "Entes Exentos"
    else:
        segmento = "Contribuyentes"

    cat = str(item.get('categoria', '')).strip()
    subcat = str(item.get('subcategoria', '')).strip()
    tema = str(item.get('tema', item.get('nivel4_tema', ''))).strip()
    subtema = str(item.get('subtema', '')).strip()
    actor_orig = str(item.get('actorEspecifico', item.get('actorNombre', ''))).strip()
    fam_orig = str(item.get('subfamiliaAduanera', item.get('familiaAduanera', ''))).strip()
    tramite = str(item.get('tramite', '')).strip()
    
    regimen_area = ""
    grupo_actor = ""
    actor_especifico = ""
    materia_tema = ""
    subtema_gestion = ""

    # --------------------------------------------------------------------------
    # A. OPERADORES DE COMERCIO EXTERIOR (4 niveles de actor cuando aplica)
    # --------------------------------------------------------------------------
    if segmento == "Operadores de Comercio Exterior":
        # 1. AFPA (Auxiliares de la Función Pública Aduanera)
        if any(k in f"{cat} {fam_orig} {actor_orig} {tema}".lower() for k in [
            'almacen', 'depósito', 'deposito', 'agd', 'dat', 'agente', 'apoderado', 
            'courier', 'entrega rápida', 'entrega rapida', 'transportista', 'consolidador', 'oea', 'afpa'
        ]):
            regimen_area = "Auxiliares de la Función Pública Aduanera (AFPA)"
            
            # Sub-desglose profundo de Depósitos Aduaneros (4 niveles)
            if any(k in f"{cat} {actor_orig} {tema}".lower() for k in ['fiscal', 'almacenadora', 'agd', 'dat', 'depósito temporal', 'deposito temporal', 'depósito aduanero', 'deposito aduanero']):
                grupo_actor = "Depósitos Aduaneros"
                if any(k in f"{cat} {actor_orig} {tema}".lower() for k in ['almacenadora', 'agd', 'bonos de prenda', 'generales de dep']):
                    actor_especifico = "Almacenadoras Generales de Depósito (AGD)"
                elif any(k in f"{cat} {actor_orig} {tema}".lower() for k in ['dat', 'temporal', 'recinto temporal']):
                    actor_especifico = "Depósitos Aduaneros Temporales (DAT)"
                else:
                    actor_especifico = "Almacenes Fiscales"
            elif 'agente' in f"{cat} {actor_orig}".lower():
                grupo_actor = "Agentes Aduaneros"
                actor_especifico = "—"
            elif 'apoderado' in f"{cat} {actor_orig}".lower():
                grupo_actor = "Apoderados Especiales Aduaneros"
                actor_especifico = "—"
            elif any(k in f"{cat} {actor_orig}".lower() for k in ['courier', 'entrega rápida', 'entrega rapida']):
                grupo_actor = "Empresas de Entrega Rápida o Courier"
                actor_especifico = "—"
            elif any(k in f"{cat} {actor_orig}".lower() for k in ['transport', 'atc']):
                grupo_actor = "Transportistas Aduaneros"
                actor_especifico = "—"
            elif 'consolidador' in f"{cat} {actor_orig}".lower():
                grupo_actor = "Consolidadores y Desconsolidadores de Carga"
                actor_especifico = "—"
            elif 'oea' in f"{cat} {actor_orig}".lower():
                grupo_actor = "Operador Económico Autorizado (OEA)"
                actor_especifico = "—"
            else:
                grupo_actor = "Auxiliares de Aduana Generales"
                actor_especifico = "—"

        # 2. Regímenes Territoriales y Zonas Especiales
        elif any(k in f"{cat} {fam_orig} {actor_orig} {tema}".lower() for k in ['zdeep', 'zolic', 'maquila', '29-89']):
            regimen_area = "Regímenes Territoriales y Zonas Especiales"
            if 'zdeep' in f"{cat} {actor_orig} {tema}".lower():
                grupo_actor = "Zonas de Desarrollo Económico Especial Público (ZDEEP)"
                if 'administra' in f"{cat} {actor_orig}".lower():
                    actor_especifico = "Entidades Administradoras ZDEEP"
                else:
                    actor_especifico = "Empresas Usuarias Calificadas ZDEEP"
            elif 'maquila' in f"{cat} {actor_orig} {tema}".lower() or '29-89' in f"{cat} {actor_orig} {tema}".lower():
                grupo_actor = "Maquilas y Perfeccionamiento Activo (Decreto 29-89)"
                actor_especifico = "—"
            else:
                grupo_actor = "Zona Libre de Industria y Comercio (ZOLIC)"
                actor_especifico = "—"

        # 3. Importadores y Exportadores (Titulares de Mercancías)
        elif any(k in f"{cat} {actor_orig} {tema}".lower() for k in ['importad', 'exportad', 'vehículo', 'vehiculo', 'fianza de import']):
            regimen_area = "Importadores y Exportadores"
            if 'export' in f"{cat} {actor_orig} {tema}".lower():
                grupo_actor = "Exportadores"
                if 'habitual' in actor_orig.lower(): actor_especifico = "Exportadores Habituales"
                elif 'devolución' in actor_orig.lower() or 'iva' in actor_orig.lower(): actor_especifico = "Exportadores con Devolución de IVA"
                else: actor_especifico = "—"
            else:
                grupo_actor = "Importadores"
                if 'habitual' in actor_orig.lower(): actor_especifico = "Importadores Habituales"
                elif 'menor' in actor_orig.lower() or 'ocasional' in actor_orig.lower(): actor_especifico = "Importadores Ocasionales o Menores"
                elif 'vehículo' in f"{tema} {subcat}".lower(): actor_especifico = "Importadores de Vehículos"
                else: actor_especifico = "—"

        # 4. Normativa y Operaciones Aduaneras Generales
        else:
            regimen_area = "Normativa y Operaciones Aduaneras Generales"
            grupo_actor = "Todos los Operadores"
            actor_especifico = "—"

        # Tema y Subtema
        materia_tema = tema if tema and tema not in ['—', 'Importación', 'Exportación', 'Almacenes Fiscales', 'Depósitos Aduaneros Temporales (DAT)'] else cat
        if materia_tema in ['Almacenes Fiscales', 'Almacenadoras Generales', 'Auxiliares de Aduana']:
            materia_tema = "Régimen de Depósito Aduanero" if grupo_actor == "Depósitos Aduaneros" else "Acreditación y Operación Aduanera"
        subtema_gestion = subcat if subcat and subcat != materia_tema else (subtema if subtema else "Gestión Operativa")

    # --------------------------------------------------------------------------
    # B. CONTRIBUYENTES (2 niveles de actor: Segmento -> Régimen/Audiencia)
    # --------------------------------------------------------------------------
    elif segmento == "Contribuyentes":
        actor_especifico = "—"
        if any(k in cat.lower() for k in ['nit sin', 'sin obligaciones']):
            regimen_area = "NIT sin Obligaciones"
            grupo_actor = "Ciudadanos sin Actividad Mercantil"
        elif any(k in cat.lower() for k in ['pequeño', 'pequeno']):
            regimen_area = "Pequeños Contribuyentes"
            if 'primario' in actor_orig.lower(): grupo_actor = "Sector Agropecuario / Primario"
            elif 'pecuario' in actor_orig.lower(): grupo_actor = "Sector Pecuario"
            else: grupo_actor = "—"
        elif any(k in cat.lower() for k in ['especial']):
            regimen_area = "Contribuyentes Especiales"
            if 'grande' in actor_orig.lower(): grupo_actor = "Grandes Contribuyentes"
            elif 'mediano' in actor_orig.lower(): grupo_actor = "Medianos Contribuyentes"
            else: grupo_actor = "—"
        else:
            regimen_area = "Contribuyente General"
            if 'asalariado' in actor_orig.lower(): grupo_actor = "Asalariados en Relación de Dependencia"
            elif 'empresa' in actor_orig.lower() or 'sociedad' in actor_orig.lower(): grupo_actor = "Empresas y Sociedades Mercantiles"
            elif 'individual' in actor_orig.lower(): grupo_actor = "Personas Individuales con Negocio"
            else: grupo_actor = "—"

        materia_tema = tema if tema and tema not in ['—', cat] else subcat
        subtema_gestion = subtema if subtema and subtema != materia_tema else "Gestión Tributaria"

    # --------------------------------------------------------------------------
    # C. PROFESIONALES (2 niveles de actor: Segmento -> Rol Profesional)
    # --------------------------------------------------------------------------
    elif segmento == "Profesionales":
        actor_especifico = "—"
        regimen_area = "Servicios Profesionales y Terceras Personas"
        if any(k in f"{cat} {actor_orig} {tramite}".lower() for k in ['abogado', 'notario', 'tev', 'traspaso']):
            grupo_actor = "Abogados y Notarios"
        elif any(k in f"{cat} {actor_orig}".lower() for k in ['contador', 'perito']):
            grupo_actor = "Peritos Contadores"
        elif any(k in f"{cat} {actor_orig}".lower() for k in ['auditor']):
            grupo_actor = "Auditores"
        elif any(k in f"{cat} {actor_orig}".lower() for k in ['gestor', 'auxiliar']):
            grupo_actor = "Gestores Tributarios y Auxiliares"
        else:
            grupo_actor = "Profesionales Habilitados"

        materia_tema = tema if tema and tema not in ['—', cat] else subcat
        subtema_gestion = subtema if subtema and subtema != materia_tema else "Gestión Profesional"

    # --------------------------------------------------------------------------
    # D. ENTES EXENTOS (2 niveles de actor: Segmento -> Tipo de Ente)
    # --------------------------------------------------------------------------
    else:
        actor_especifico = "—"
        if any(k in f"{cat} {actor_orig}".lower() for k in ['estado', 'ministerio', 'judicial', 'público', 'publico', 'senabed', 'pdh', 'municipal']):
            regimen_area = "Sector Público y Entidades del Estado"
            if 'municipal' in f"{cat} {actor_orig}".lower(): grupo_actor = "Municipalidades"
            else: grupo_actor = "Dependencias del Estado y Organismos"
        else:
            regimen_area = "Organizaciones No Lucrativas (Exentas)"
            if 'iglesia' in actor_orig.lower() or 'religios' in actor_orig.lower(): grupo_actor = "Iglesias y Comunidades Religiosas"
            elif 'educativ' in actor_orig.lower() or 'universidad' in actor_orig.lower(): grupo_actor = "Centros Educativos y Universidades"
            elif 'diplom' in actor_orig.lower(): grupo_actor = "Misiones Diplomáticas y Organismos Internacionales"
            else: grupo_actor = "Asociaciones, Fundaciones y ONGs"

        materia_tema = tema if tema and tema not in ['—', cat] else subcat
        subtema_gestion = subtema if subtema and subtema != materia_tema else "Gestión de Exenciones"

    # Limpieza final
    if materia_tema == '' or materia_tema == '—': materia_tema = "Gestiones Institucionales"
    if subtema_gestion == '' or subtema_gestion == '—': subtema_gestion = "Trámite General"

    # --------------------------------------------------------------------------
    # MIGA DE PAN (BREADCRUMB DINÁMICA) - Solo incluye niveles activos
    # --------------------------------------------------------------------------
    miga_parts = [segmento]
    if regimen_area and regimen_area != segmento:
        miga_parts.append(regimen_area)
    if grupo_actor and grupo_actor != '—' and grupo_actor != regimen_area:
        miga_parts.append(grupo_actor)
    if actor_especifico and actor_especifico != '—' and actor_especifico != grupo_actor:
        miga_parts.append(actor_especifico)
    if materia_tema and materia_tema != '—' and materia_tema not in miga_parts:
        miga_parts.append(materia_tema)
    if subtema_gestion and subtema_gestion != '—' and subtema_gestion not in ['Trámite General', 'Gestión Tributaria', 'Gestión Operativa'] and subtema_gestion not in miga_parts:
        miga_parts.append(subtema_gestion)
    miga_parts.append(tramite)

    miga_breadcrumb = " > ".join(miga_parts)

    return {
        'segmento': segmento,
        'regimen_area': regimen_area,
        'grupo_actor': grupo_actor,
        'actor_especifico': actor_especifico,
        'materia_tema': materia_tema,
        'subtema_gestion': subtema_gestion,
        'miga_breadcrumb': miga_breadcrumb
    }

# Aplicar enriquecimiento en master_data y actualizar allTramites.json
for item in master_data:
    h = classify_asymmetric_hierarchy(item)
    item['segmento'] = h['segmento']
    item['regimenArea'] = h['regimen_area']
    item['grupoActor'] = h['grupo_actor']
    item['actorEspecifico'] = h['actor_especifico']
    item['materiaTema'] = h['materia_tema']
    item['subtemaGestion'] = h['subtema_gestion']
    item['migaBreadcrumb'] = h['miga_breadcrumb']
    # Eliminar términos de jerga como subtemaCanonico si existiera
    if 'subtemaCanonico' in item: del item['subtemaCanonico']

with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, ensure_ascii=False, indent=2)

print(f"Dataset maestro JSON actualizado con éxito: {len(master_data)} registros.")

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

ws_resumen['B4'] = "Arquitectura de Navegación Flexible con Desglose Asimétrico de Actores y Migas de Pan (783 Contenidos)"
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
    # Título en celda superior izquierda
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

# Fila totalizador
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

# Tabla 2: Ciclo de Vida ATO (5 Etapas)
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
# HOJA 2: MATRIZ MAESTRA COMPLETA (783 FILAS CON MIGA DE PAN Y DESGLOSE ASIMÉTRICO)
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

    # URL con Hipervínculo interactivo
    c_url = ws_master.cell(row=r_idx, column=19, value=item.get('url', ''))
    if str(item.get('url', '')).startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = item.get('url')

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 20):
        cell = ws_master.cell(row=r_idx, column=c_idx)
        if c_idx not in [3, 7, 9, 10, 11, 17, 18, 19]: cell.font = font_body
        if not (c_idx == 18 and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_master.row_dimensions[r_idx].height = 22

master_widths = [8, 18, 24, 26, 26, 26, 28, 24, 38, 55, 24, 24, 24, 22, 14, 48, 30, 16, 36]
for idx, w in enumerate(master_widths, start=1):
    ws_master.column_dimensions[get_column_letter(idx)].width = w

ws_master.freeze_panes = 'E2'
ws_master.auto_filter.ref = f"A1:S{len(master_data)+1}"

# ==============================================================================
# HOJA 3: COMERCIO EXTERIOR (246 FILAS CON 4 NIVELES DE ACTORES Y MIGA DE PAN)
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

    c_url = ws_ce.cell(row=r_idx, column=16, value=item.get('url', ''))
    if str(item.get('url', '')).startswith('http'):
        c_url.font = font_link
        c_url.hyperlink = item.get('url')

    fill_color = ZEBRA_FILL if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 17):
        cell = ws_ce.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 5, 7, 8, 9, 14, 15, 16]: cell.font = font_body
        if not (c_idx == 15 and item.get('esBrecha')):
            cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_ce.row_dimensions[r_idx].height = 22

ce_widths = [8, 28, 28, 28, 28, 24, 38, 55, 24, 24, 24, 22, 48, 30, 16, 36]
for idx, w in enumerate(ce_widths, start=1):
    ws_ce.column_dimensions[get_column_letter(idx)].width = w

ws_ce.freeze_panes = 'E2'
ws_ce.auto_filter.ref = f"A1:P{len(ce_data)+1}"

# ==============================================================================
# HOJA 4: BRECHAS NORMATIVAS (SINCRONIZACIÓN EXACTA: 12 REGISTROS)
# ==============================================================================
brechas_list = [item for item in master_data if item.get('esBrecha')]
ws_brechas = wb.create_sheet(title=f"Brechas Normativas ({len(brechas_list)})")
ws_brechas.views.sheetView[0].showGridLines = True

headers_brechas = [
    "No.",
    "Segmento",
    "Régimen / Área",
    "Actor / Rol Afectado",
    "Materia / Tema",
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

for r_idx, b in enumerate(brechas_list, start=2):
    ws_brechas.cell(row=r_idx, column=1, value=r_idx - 1).alignment = Alignment(horizontal='center')
    ws_brechas.cell(row=r_idx, column=2, value=b.get('segmento', '')).font = font_bold
    ws_brechas.cell(row=r_idx, column=3, value=b.get('regimenArea', ''))
    
    actor_str = b.get('actorEspecifico') if b.get('actorEspecifico') != '—' else b.get('grupoActor', '')
    ws_brechas.cell(row=r_idx, column=4, value=actor_str)
    ws_brechas.cell(row=r_idx, column=5, value=b.get('materiaTema', ''))
    ws_brechas.cell(row=r_idx, column=6, value=b.get('etapaAtoLabel', ''))
    ws_brechas.cell(row=r_idx, column=7, value=b.get('tramite', '')).font = font_bold
    ws_brechas.cell(row=r_idx, column=8, value=b.get('descripcion', ''))
    
    pregunta = f"¿Existe acuerdo de directorio o resolución que formalice el requisito digital para '{b.get('tramite', '')}' ante SAT?"
    ws_brechas.cell(row=r_idx, column=9, value=pregunta).font = Font(name='Segoe UI', size=9, italic=True, color='1E293B')

    fill_color = 'FFF7ED' if r_idx % 2 == 0 else 'FFFFFF'
    for c_idx in range(1, 10):
        cell = ws_brechas.cell(row=r_idx, column=c_idx)
        if c_idx not in [2, 7, 9]: cell.font = font_body
        cell.fill = PatternFill(start_color=fill_color, end_color=fill_color, fill_type='solid')
        cell.border = thin_border
    ws_brechas.row_dimensions[r_idx].height = 24

brecha_widths = [8, 26, 28, 28, 26, 24, 38, 45, 45]
for idx, w in enumerate(brecha_widths, start=1):
    ws_brechas.column_dimensions[get_column_letter(idx)].width = w

ws_brechas.freeze_panes = 'A2'
ws_brechas.auto_filter.ref = f"A1:I{len(brechas_list)+1}"

# Guardar en el archivo oficial
OUTPUT_EXCEL_PATH = 'docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx'

wb.save(OUTPUT_EXCEL_PATH)
print(f"Libro Excel maestro guardado exitosamente en: {OUTPUT_EXCEL_PATH}")
