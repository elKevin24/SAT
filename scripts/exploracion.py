"""
Exploración del Catálogo de Contenidos Únicos del Portal SAT Guatemala.
Genera salida/exploracion.txt con todos los hallazgos de calidad de datos.
Analiza todas las hojas relevantes: Catálogo Único, Contenidos Transversales,
Mapeo a Nodos y Familias Temáticas.
"""

import sys
import re
from pathlib import Path

BASE_DIR   = Path(__file__).resolve().parent.parent
INPUT_FILE = BASE_DIR / "docs" / "fuentes-datos" / "02_archivos_producto_entregables" / "Catalogo_Contenidos_Unicos_Portal_SAT.xlsx"
OUTPUT_DIR = BASE_DIR / "salida"
OUTPUT_FILE = OUTPUT_DIR / "exploracion.txt"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

import pandas as pd

lines = []

def log(msg=""):
    print(msg)
    lines.append(str(msg))


def analyze_sheet(df: pd.DataFrame, sheet_name: str):
    log(f"\n{'='*70}")
    log(f"HOJA: {sheet_name}")
    log(f"  Filas: {len(df)}  |  Columnas: {len(df.columns)}")
    log(f"{'='*70}")

    # ── Columnas y tipos ───────────────────────────────────────────────────
    log("\n── COLUMNAS DISPONIBLES ─────────────────────────────────────────────")
    log(f"{'#':<4} {'Nombre':<50} {'Dtype':<12} {'Ejemplo (primer valor no nulo)'}")
    log(f"{'─'*4} {'─'*50} {'─'*12} {'─'*35}")
    for i, col in enumerate(df.columns):
        dtype = str(df[col].dtype)
        non_null = df[col].dropna()
        example = str(non_null.iloc[0])[:55] if len(non_null) > 0 else "— (todo nulo)"
        log(f"{i+1:<4} {str(col):<50} {dtype:<12} {example}")

    # ── Nulos ──────────────────────────────────────────────────────────────
    log("\n── NULOS POR COLUMNA ────────────────────────────────────────────────")
    log(f"{'Columna':<50} {'Nulos':>7} {'%':>8}")
    log(f"{'─'*50} {'─'*7} {'─'*8}")
    total = len(df)
    for col in df.columns:
        n = df[col].isnull().sum()
        pct = n / total * 100 if total else 0
        marker = " ◄ ALTA" if pct > 30 else ""
        log(f"{str(col):<50} {n:>7} {pct:>7.1f}%{marker}")

    # ── Detectar columnas URL y nombre ────────────────────────────────────
    url_cols  = [c for c in df.columns if any(k in str(c).lower() for k in ["url", "link", "enlace", "href"])]
    name_cols = [c for c in df.columns if any(k in str(c).lower() for k in ["nombre", "titulo", "title", "name", "gestión", "gestion", "contenido"])]

    # Fallback por contenido
    if not url_cols:
        for col in df.columns:
            s = df[col].dropna().astype(str).head(30)
            if s.str.startswith("http").sum() >= 3:
                url_cols.append(col)

    log(f"\n── COLUMNAS URL IDENTIFICADAS: {url_cols if url_cols else '— ninguna'}")
    log(f"── COLUMNAS NOMBRE/TÍTULO:     {name_cols if name_cols else '— ninguna'}")

    # ── Duplicados de URL ─────────────────────────────────────────────────
    log("\n── DUPLICADOS EXACTOS DE URL ────────────────────────────────────────")
    if url_cols:
        for ucol in url_cols:
            s = df[ucol].dropna().astype(str).str.strip()
            dup = s[s.duplicated(keep=False)]
            log(f"  Col '{ucol}': {len(s)} no nulas | {len(dup)} filas con URL duplicada ({len(dup)/total*100:.1f}%)")
            if len(dup) > 0:
                for url, cnt in dup.value_counts().head(15).items():
                    log(f"    [{cnt}x] {url[:90]}")
    else:
        log("  — Sin columnas URL.")

    # ── Duplicados de nombre ──────────────────────────────────────────────
    log("\n── DUPLICADOS EXACTOS DE NOMBRE / TÍTULO ────────────────────────────")
    if name_cols:
        for ncol in name_cols:
            s = df[ncol].dropna().astype(str).str.strip()
            dup = s[s.duplicated(keep=False)]
            log(f"  Col '{ncol}': {len(s)} no nulas | {len(dup)} filas con nombre duplicado ({len(dup)/total*100:.1f}%)")
            if len(dup) > 0:
                log(f"  Top 15:")
                for val, cnt in dup.value_counts().head(15).items():
                    log(f"    [{cnt}x] {val[:80]}")
    else:
        log("  — Sin columnas de nombre/título.")

    # ── URLs rotas de formato ─────────────────────────────────────────────
    log("\n── URLs CON FORMATO ROTO ────────────────────────────────────────────")
    if url_cols:
        for ucol in url_cols:
            s = df[ucol].dropna().astype(str).str.strip()
            bad_proto  = s[~s.str.match(r"^https?://", na=False)]
            has_spaces = s[s.str.contains(r"\s", regex=True, na=False)]
            backslash  = s[s.str.contains(r"\\", regex=True, na=False)]
            empty_like = s[s.isin(["", "nan", "None", "#N/A", "N/A"])]

            log(f"  Col '{ucol}' ({len(s)} URLs no nulas):")
            log(f"    Sin prefijo http(s) : {len(bad_proto)}")
            for v in bad_proto.head(10): log(f"      → {v[:90]}")
            log(f"    Con espacios intern.: {len(has_spaces)}")
            for v in has_spaces.head(10): log(f"      → {repr(v[:90])}")
            log(f"    Con backslash       : {len(backslash)}")
            for v in backslash.head(5):  log(f"      → {v[:90]}")
            log(f"    Valores vacíos/null : {len(empty_like)}")
    else:
        log("  — Sin columnas URL.")

    # ── Muestra de 5 filas ────────────────────────────────────────────────
    log("\n── MUESTRA: PRIMERAS 5 FILAS ────────────────────────────────────────")
    with pd.option_context("display.max_columns", None, "display.width", 200, "display.max_colwidth", 50):
        log(df.head(5).to_string())


# ══════════════════════════════════════════════════════════════════════════════
log("=" * 70)
log("EXPLORACIÓN COMPLETA: Catalogo_Contenidos_Unicos_Portal_SAT.xlsx")
log("=" * 70)
log(f"Archivo : {INPUT_FILE}")
log(f"Tamaño  : {INPUT_FILE.stat().st_size / 1024:.1f} KB")

xl = pd.ExcelFile(INPUT_FILE, engine="openpyxl")
log(f"\nHojas disponibles ({len(xl.sheet_names)}):")
for s in xl.sheet_names:
    log(f"  • {s}")

# Hojas a analizar en detalle (excluimos Resumen Ejecutivo = portada)
SKIP_SHEETS = {"Resumen Ejecutivo"}

for sheet_name in xl.sheet_names:
    if sheet_name in SKIP_SHEETS:
        log(f"\n[Saltando hoja '{sheet_name}' — es portada/resumen narrativo]")
        continue
    df = xl.parse(sheet_name)
    analyze_sheet(df, sheet_name)

# ── Análisis cruzado: Catálogo Único (683) vs Mapeo a Nodos (715) ────────────
log(f"\n{'='*70}")
log("ANÁLISIS CRUZADO: Catálogo Único (683) vs Mapeo a Nodos (715)")
log(f"{'='*70}")

df_cat  = xl.parse("Catálogo Único (683)")
df_map  = xl.parse("Mapeo a Nodos (715)")
df_trans = xl.parse("Contenidos Transversales (17)")
df_fam  = xl.parse("Familias Temáticas (10)")

# Códigos en catálogo
cat_codes = df_cat["Código Canónico Oficial (SAT-GES-####)"].dropna().astype(str).str.strip()
map_codes = df_map["Código Oficial (SAT-GES-####)"].dropna().astype(str).str.strip()

log(f"\n  Códigos únicos en Catálogo Único  : {cat_codes.nunique()}")
log(f"  Códigos únicos en Mapeo a Nodos   : {map_codes.nunique()}")
log(f"  Códigos en Catálogo pero NO en Mapeo: {len(set(cat_codes) - set(map_codes))}")
log(f"  Códigos en Mapeo pero NO en Catálogo: {len(set(map_codes) - set(cat_codes))}")

only_cat = set(cat_codes) - set(map_codes)
only_map = set(map_codes) - set(cat_codes)
if only_cat:
    log(f"\n  Primeros 10 códigos solo en Catálogo:")
    for c in sorted(only_cat)[:10]: log(f"    {c}")
if only_map:
    log(f"\n  Primeros 10 códigos solo en Mapeo:")
    for c in sorted(only_map)[:10]: log(f"    {c}")

# Distribución de Etapa del Ciclo de Vida
log(f"\n── DISTRIBUCIÓN: Etapa del Ciclo de Vida (Catálogo Único) ─────────────")
if "Etapa del Ciclo de Vida" in df_cat.columns:
    dist = df_cat["Etapa del Ciclo de Vida"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<35} {cnt:>4}  ({cnt/len(df_cat)*100:.1f}%)")

# Distribución de Tipo de Interacción
log(f"\n── DISTRIBUCIÓN: Tipo de Interacción (Catálogo Único) ──────────────────")
if "Tipo de Interacción" in df_cat.columns:
    dist = df_cat["Tipo de Interacción"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<40} {cnt:>4}  ({cnt/len(df_cat)*100:.1f}%)")

# Distribución Familia Temática
log(f"\n── DISTRIBUCIÓN: Familia Temática (Catálogo Único) ─────────────────────")
if "Familia Temática" in df_cat.columns:
    dist = df_cat["Familia Temática"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<50} {cnt:>4}  ({cnt/len(df_cat)*100:.1f}%)")

# Distribución Perfil Destinatario
log(f"\n── DISTRIBUCIÓN: Perfil Destinatario (Catálogo Único) ──────────────────")
if "Perfil Destinatario" in df_cat.columns:
    dist = df_cat["Perfil Destinatario"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<50} {cnt:>4}  ({cnt/len(df_cat)*100:.1f}%)")

# Distribución Segmento en Mapeo
log(f"\n── DISTRIBUCIÓN: Segmento Nivel 1 (Mapeo a Nodos) ─────────────────────")
if "Segmento (Nivel 1)" in df_map.columns:
    dist = df_map["Segmento (Nivel 1)"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<50} {cnt:>4}  ({cnt/len(df_map)*100:.1f}%)")

# Distribución Categoría en Mapeo
log(f"\n── DISTRIBUCIÓN: Categoría Nivel 2 (Mapeo a Nodos) ────────────────────")
if "Categoría (Nivel 2)" in df_map.columns:
    dist = df_map["Categoría (Nivel 2)"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<55} {cnt:>4}  ({cnt/len(df_map)*100:.1f}%)")

# Distribución Subcategoría en Mapeo
log(f"\n── DISTRIBUCIÓN: Subcategoría Nivel 3 (Mapeo a Nodos) ─────────────────")
if "Subcategoría (Nivel 3)" in df_map.columns:
    dist = df_map["Subcategoría (Nivel 3)"].value_counts(dropna=False)
    for val, cnt in dist.items():
        log(f"  {str(val):<55} {cnt:>4}  ({cnt/len(df_map)*100:.1f}%)")

# URLs en catálogo
log(f"\n── ANÁLISIS DE URLs (Catálogo Único) ──────────────────────────────────")
if "URL Portal SAT" in df_cat.columns:
    urls = df_cat["URL Portal SAT"].dropna().astype(str).str.strip()
    log(f"  Total gestiones con URL : {len(urls)} / {len(df_cat)}")
    log(f"  Sin URL (nulas)         : {df_cat['URL Portal SAT'].isnull().sum()}")
    bad = urls[~urls.str.match(r"^https?://", na=False)]
    log(f"  URLs sin prefijo http   : {len(bad)}")
    for v in bad.head(10): log(f"    → {v[:90]}")
    dup = urls[urls.duplicated(keep=False)]
    log(f"  URLs duplicadas (filas) : {len(dup)}")
    if len(dup) > 0:
        log("  Top 15 URLs duplicadas:")
        for url, cnt in dup.value_counts().head(15).items():
            log(f"    [{cnt}x] {url[:90]}")

log(f"\n{'='*70}")
log("FIN DE LA EXPLORACIÓN COMPLETA")
log(f"{'='*70}")

# ── Guardar ──────────────────────────────────────────────────────────────────
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"\n✓ Reporte guardado en: {OUTPUT_FILE}")
