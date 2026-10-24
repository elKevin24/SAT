"""
generar_wpbakery_shortcodes.py  v3
===================================
Genera shortcodes WPBakery por cada nodo de la arquitectura de información SAT.

Fuente canónica:
  - Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx
      · Nivel 3 → describe cada N3 (Lead text + hijos N4)
      · Nivel 4 → describe cada N4 (Lead text + gestiones N5)
  - Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx
      · Matriz Maestra (714) → gestiones hoja con URL real

Reglas aplicadas (AGENTS.md):
  - Zero pass-through clicks: páginas con 1 solo ítem NO se generan.
  - Miller (7±2): se avisa si una página supera 10 ítems.
  - Guion largo (—): nodos sin N4 real van a lista directa de gestiones.
  - el_class varía según N1.

Salida: scripts/output/wpbakery/
  N2_<slug>.txt   → info-boxes = hijos N3
  N3_<slug>.txt   → info-boxes = hijos N4 (o gestiones si lista directa)
  N4_<slug>.txt   → info-boxes = gestiones con URL real
  _INDICE.md      → mapa completo de archivos generados
"""

import sys
import re
from collections import defaultdict, OrderedDict
from pathlib import Path

import openpyxl

sys.stdout.reconfigure(encoding="utf-8")

# ── Rutas ─────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).parent.parent
ENTREGABLES = BASE_DIR / "docs" / "fuentes-datos" / "02_archivos_producto_entregables"
MAPA_XLS   = ENTREGABLES / "Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx"
MATRIZ_XLS = ENTREGABLES / "Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx"
OUTPUT_DIR = BASE_DIR / "scripts" / "output" / "wpbakery"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def page_dir(*parts) -> Path:
    """Crea y devuelve subcarpeta jerárquica. parts = (n1, n2, n3, ...)"""
    d = OUTPUT_DIR
    for p in parts:
        d = d / slug(p)
        d.mkdir(parents=True, exist_ok=True)
    return d

# Mapeo N1 → clase CSS
CSS_CLASS = {
    "Contribuyentes":               "sat-seccion-contribuyentes",
    "Operadores de Comercio Exterior": "sat-seccion-comercio-exterior",
    "Profesionales":                "sat-seccion-profesionales",
    "Entes Exentos":                "sat-seccion-entes-exentos",
}

WARN_MILLER = 10   # avisar si >= 10 ítems (tolerancia excepcional)
SKIP_SINGLE = True # no generar páginas con 1 solo ítem (pasarela)


# ── Helpers ───────────────────────────────────────────────────────────────────
def slug(text: str) -> str:
    if not text:
        return "sin-nombre"
    t = str(text).lower().strip()
    for src, dst in [("á","a"),("à","a"),("ä","a"),("é","e"),("è","e"),("ë","e"),
                     ("í","i"),("ì","i"),("ï","i"),("ó","o"),("ò","o"),("ö","o"),
                     ("ú","u"),("ù","u"),("ü","u"),("ñ","n"),("ç","c")]:
        t = t.replace(src, dst)
    t = re.sub(r"[^a-z0-9]+", "-", t)
    return t.strip("-")[:70]


def esc(text) -> str:
    return str(text or "").replace('"', "&quot;").strip()


def es_vacio(v) -> bool:
    return v is None or str(v).strip() in ("", "—", "–", "-", "None")


def es_lista_directa(v) -> bool:
    return es_vacio(v) or "lista directa" in str(v).lower()


def css_class(n1: str) -> str:
    return CSS_CLASS.get(n1, "sat-seccion-contribuyentes")


def info_box(title: str, desc: str, url: str = "") -> str:
    link_val = f"url:{url}" if url and url.startswith("http") else ""
    return (
        f'[bsf-info-box icon_type="none" title="{esc(title)}" '
        f'read_more="box" link="{link_val}"]'
        f'{esc(desc)}'
        f'[/bsf-info-box]'
    )


def columna(content: str) -> str:
    return f'[vc_column width="1/2"]{content}[/vc_column]'


def wrap_page(items: list[dict], n1: str) -> str:
    breadcrumb = (
        '[vc_row gap="5px"][vc_column]'
        '[dt_breadcrumbs font_style="italic:normal:none" alignment="left"]'
        '[vc_separator][/vc_column][/vc_row]'
    )
    cols = "".join(columna(info_box(it["title"], it["desc"], it.get("url", ""))) for it in items)
    section = (
        f'[vc_section]'
        f'[vc_row gap="0px" el_class="{css_class(n1)}"]'
        f'{cols}'
        f'[/vc_row][/vc_section]'
    )
    return f"{breadcrumb}\n{section}"


def sval(row, *keys) -> str:
    """Busca las primeras columnas cuyo nombre empiece con cualquiera de las keys."""
    for key in keys:
        for k, v in row.items():
            if str(k).startswith(key):
                s = str(v).strip() if v is not None else ""
                if s:
                    return s
    return ""


def load_sheet(wb, sheet_name: str, header_row: int) -> list[dict]:
    """Carga una hoja devolviendo lista de dicts. header_row es 1-based."""
    ws = wb[sheet_name]
    all_rows = list(ws.iter_rows(values_only=True))
    hdrs = [
        str(c).strip() if c is not None else f"_col{i}"
        for i, c in enumerate(all_rows[header_row - 1])
    ]
    return [
        dict(zip(hdrs, row))
        for row in all_rows[header_row:]
        if any(v is not None for v in row)
    ]


# ══════════════════════════════════════════════════════════════════════════════
# 1. Cargar Matriz Maestra → gestiones hoja agrupadas por (n1,n2,n3,n4)
# ══════════════════════════════════════════════════════════════════════════════
print("Cargando Matriz Maestra...")
wb_m = openpyxl.load_workbook(MATRIZ_XLS, read_only=True, data_only=True)
matriz = load_sheet(wb_m, "Matriz Maestra (714)", header_row=1)
wb_m.close()

# gestiones_n4[(n1,n2,n3,n4)] = lista ordenada de {title, desc, url}
gestiones_n4: dict[tuple, list] = OrderedDict()
seen_ges: set = set()

for r in matriz:
    n1  = sval(r, "Nivel 1")
    n2  = sval(r, "Nivel 2")
    n3  = sval(r, "Nivel 3")
    n4  = sval(r, "Nivel 4")
    ges = sval(r, "Nombre de la Gestión")
    desc = sval(r, "¿Para qué sirve?")
    url  = sval(r, "URL Portal SAT")
    cod  = sval(r, "ID Gestión")

    k4 = (n1, n2, n3, n4)
    uid = (k4, cod or ges)

    if k4 not in gestiones_n4:
        gestiones_n4[k4] = []

    if uid not in seen_ges and ges:
        seen_ges.add(uid)
        gestiones_n4[k4].append({
            "title": ges,
            "desc":  desc,
            "url":   url if url.startswith("http") else "",
        })

print(f"  {len(gestiones_n4)} nodos N4, {len(seen_ges)} gestiones cargadas.")


# ══════════════════════════════════════════════════════════════════════════════
# 2. Cargar Mapa de Navegación
# ══════════════════════════════════════════════════════════════════════════════
print("Cargando Mapa de Navegacion...")
wb_mapa = openpyxl.load_workbook(MAPA_XLS, read_only=True, data_only=True)
n2_rows = load_sheet(wb_mapa, "Nivel 2", header_row=5)
n3_rows = load_sheet(wb_mapa, "Nivel 3", header_row=5)
n4_rows = load_sheet(wb_mapa, "Nivel 4", header_row=5)
wb_mapa.close()
print(f"  N2: {len(n2_rows)} filas, N3: {len(n3_rows)} filas, N4: {len(n4_rows)} filas.")


# ══════════════════════════════════════════════════════════════════════════════
# 3. Construir árbol jerárquico desde el Mapa
#    n2_tree[(n1,n2)] = [{ title:n3, desc, url }]   (hijos N3 de cada N2)
#    n3_tree[(n1,n2,n3)] = [{ title:n4, desc, url }] (hijos N4 de cada N3)
# ══════════════════════════════════════════════════════════════════════════════

# -- N3 por N2 (para páginas N2) --
n2_tree: dict[tuple, list] = OrderedDict()
for r in n3_rows:
    n1 = sval(r, "Nivel 1")
    n2 = sval(r, "Nivel 2")
    n3 = sval(r, "Nivel 3")
    if es_vacio(n2) or es_vacio(n1):
        continue
    k = (n1, n2)
    if k not in n2_tree:
        n2_tree[k] = []
    if es_vacio(n3):
        continue
    lead = sval(r, "Lead text:")
    que  = sval(r, "Qué es:")
    desc = lead or que or f"Gestiones de {n3}."
    if not any(x["title"] == n3 for x in n2_tree[k]):
        n2_tree[k].append({"title": n3, "desc": desc, "url": ""})

# -- N4 por N3 (para páginas N3) --
n3_tree: dict[tuple, list] = OrderedDict()
for r in n4_rows:
    n1 = sval(r, "Nivel 1")
    n2 = sval(r, "Nivel 2")
    n3 = sval(r, "Nivel 3")
    n4 = sval(r, "Nivel 4")
    if es_vacio(n1) or es_vacio(n2):
        continue
    k = (n1, n2, n3)
    if k not in n3_tree:
        n3_tree[k] = []
    if es_lista_directa(n4):
        continue  # se marcará como lista directa más abajo
    lead = sval(r, "Lead text:")
    que  = sval(r, "Qué es:")
    desc = lead or que or f"Accede a las gestiones de {n4}."
    if not any(x["title"] == n4 for x in n3_tree[k]):
        n3_tree[k].append({"title": n4, "desc": desc, "url": ""})


# ══════════════════════════════════════════════════════════════════════════════
# 4. Generar archivos
# ══════════════════════════════════════════════════════════════════════════════
pages_ok   = 0
pages_skip = 0
pages_warn = 0
index_lines = ["# Índice de Shortcodes WPBakery — Portal SAT\n",
               "| Archivo | Nivel | Ruta jerárquica | Ítems |\n",
               "|---------|-------|-----------------|-------|\n"]


def write_page(fname: Path, items: list[dict], n1: str, ruta: str) -> bool:
    global pages_ok, pages_skip, pages_warn
    n = len(items)
    if SKIP_SINGLE and n <= 1:
        print(f"  [SKIP] {fname.name}  ({n} items — pasarela omitida)")
        pages_skip += 1
        return False
    sc = wrap_page(items, n1)
    fname.write_text(sc, encoding="utf-8")
    warn = " ⚠ MILLER" if n > WARN_MILLER else ""
    print(f"  [OK]   {fname.name}  ({n} items){warn}")
    if n > WARN_MILLER:
        pages_warn += 1
    pages_ok += 1
    nivel = fname.name[:2]
    index_lines.append(f"| `{fname.name}` | {nivel} | {ruta} | {n} |\n")
    return True


# ─── Páginas N2 ───────────────────────────────────────────────────────────────
print("\n--- Generando páginas N2 ---")
for (n1, n2), children in n2_tree.items():
    d     = page_dir(n1)
    fname = d / f"N2_{slug(n2)}.txt"
    ruta  = f"{n1} > **{n2}**"
    write_page(fname, children, n1, ruta)


# ─── Páginas N3 ───────────────────────────────────────────────────────────────
print("\n--- Generando páginas N3 ---")
# Recorrer todos los N3 del Mapa (únicos)
n3_unicos: list[tuple] = []
seen_n3 = set()
for r in n4_rows:
    n1 = sval(r, "Nivel 1")
    n2 = sval(r, "Nivel 2")
    n3 = sval(r, "Nivel 3")
    k  = (n1, n2, n3)
    if k not in seen_n3 and not es_vacio(n1):
        seen_n3.add(k)
        n3_unicos.append(k)

for (n1, n2, n3) in n3_unicos:
    k3 = (n1, n2, n3)
    children = n3_tree.get(k3, [])
    d     = page_dir(n1, n2)
    fname = d / f"N3_{slug(n3)}.txt"
    ruta  = f"{n1} > {n2} > **{n3}**"

    if children:
        write_page(fname, children, n1, ruta)
    else:
        gestiones = []
        for k4, gs in gestiones_n4.items():
            if k4[0] == n1 and k4[1] == n2 and k4[2] == n3:
                gestiones.extend(gs)
        if gestiones:
            write_page(fname, gestiones, n1, ruta)


# ─── Páginas N4 ───────────────────────────────────────────────────────────────
print("\n--- Generando páginas N4 ---")
seen_n4 = set()
for r in n4_rows:
    n1 = sval(r, "Nivel 1")
    n2 = sval(r, "Nivel 2")
    n3 = sval(r, "Nivel 3")
    n4 = sval(r, "Nivel 4")
    if es_lista_directa(n4) or es_vacio(n1):
        continue
    k4 = (n1, n2, n3, n4)
    if k4 in seen_n4:
        continue
    seen_n4.add(k4)

    gestiones = gestiones_n4.get(k4, [])
    if not gestiones:
        continue

    d     = page_dir(n1, n2, n3)
    fname = d / f"N4_{slug(n4)}.txt"
    ruta  = f"{n1} > {n2} > {n3} > **{n4}**"
    write_page(fname, gestiones, n1, ruta)


# ─── Índice ───────────────────────────────────────────────────────────────────
indice_path = OUTPUT_DIR / "_INDICE.md"
indice_path.write_text("".join(index_lines), encoding="utf-8")

print(f"""
Resumen:
  Generados:  {pages_ok} archivos
  Omitidos:   {pages_skip} paginas (1 solo item = pasarela)
  Avisos Miller (>10 items): {pages_warn}
  Indice:  {indice_path}
  Carpeta: {OUTPUT_DIR}
""")
