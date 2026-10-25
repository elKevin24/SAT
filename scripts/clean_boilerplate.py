"""
clean_boilerplate.py
====================
Iteración 3 — Limpieza de boilerplate institucional del Portal SAT.

Entrada:  salida/scraped_content.csv
Salida:   salida/scraped_content_clean.csv  (+ columnas texto_limpio, longitud_limpia)

Reglas:
  - Prohibido 'trámite'/'trámites' → usar 'gestión'/'gestiones'
  - Niveles jerárquicos: N1–N5 únicamente
"""

# ---------------------------------------------------------------------------
# 0. AUTO-INSTALACIÓN DE DEPENDENCIAS
# ---------------------------------------------------------------------------
import subprocess
import sys


def _install(pkg: str) -> None:
    subprocess.run(
        [sys.executable, "-m", "pip", "install", "--quiet", pkg],
        check=False,
    )


for _pkg in ["pandas", "numpy"]:
    _install(_pkg)

# ---------------------------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------------------------
import logging
import re
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------
INPUT_CSV  = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida\scraped_content.csv")
OUTPUT_DIR = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
OUTPUT_CSV = OUTPUT_DIR / "scraped_content_clean.csv"

NGRAMA_N           = 5        # tamaño de n-grama para detección de boilerplate
UMBRAL_BOILERPLATE = 0.30     # n-gramas presentes en >30% de páginas con texto
TOP_BOILERPLATE    = 30       # cuántas frases imprimir en diagnóstico
MIN_LONGITUD_LINEA = 20       # líneas más cortas se eliminan
MAX_PALABRAS       = 800      # truncado máximo del texto limpio

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# PATRONES HARDCODEADOS DE BOILERPLATE (minúsculas para matching CI)
# ---------------------------------------------------------------------------
PATRONES_HARDCODED: list[str] = [
    "superintendencia de administración tributaria",
    "portal sat",
    "agencia virtual",
    "ingresa a agencia virtual",
    "requisitos tramites agencias",
    "pasos documentos requisitos",
    "sat.gob.gt",
    "gobierno de guatemala",
    "menú principal",
    "ir al contenido",
    "regresar al inicio",
    "inicio sesión",
    "cerrar sesión",
    "términos y condiciones",
    "política de privacidad",
    "derechos reservados",
    "todos los derechos",
    "cookie",
    "javascript",
    "habilitar javascript",
    "cargando",
]


# ---------------------------------------------------------------------------
# PASO 1 — LECTURA DEL CSV
# ---------------------------------------------------------------------------

def cargar_csv() -> pd.DataFrame:
    log.info("Leyendo: %s", INPUT_CSV)
    df = pd.read_csv(INPUT_CSV, encoding="utf-8")
    log.info("Filas cargadas: %d", len(df))

    columnas_requeridas = ["titulo", "url", "texto_extraido", "longitud_texto", "status_http"]
    for col in columnas_requeridas:
        if col not in df.columns:
            raise ValueError(f"Columna requerida ausente en scraped_content.csv: '{col}'")
        df[col] = df[col].fillna("").astype(str).str.strip()

    df["longitud_texto"] = (
        pd.to_numeric(df["longitud_texto"], errors="coerce").fillna(0).astype(int)
    )
    return df.reset_index(drop=True)


# ---------------------------------------------------------------------------
# PASO 2 — DIAGNÓSTICO DE N-GRAMAS DE BOILERPLATE
# ---------------------------------------------------------------------------

def extraer_ngramas(texto: str, n: int) -> set[str]:
    """Retorna el conjunto de n-gramas únicos (de palabras) presentes en el texto."""
    palabras = re.sub(r"\s+", " ", texto.lower()).split()
    if len(palabras) < n:
        return set()
    return {" ".join(palabras[i : i + n]) for i in range(len(palabras) - n + 1)}


def detectar_ngramas_boilerplate(df: pd.DataFrame) -> list[str]:
    """
    Extrae n-gramas de 5 palabras de cada página y calcula en cuántos
    documentos distintos aparece cada uno. Retorna los que superan el umbral
    del 30% de páginas con texto.
    """
    df_con_texto = df[df["longitud_texto"] > 0]
    n_paginas = len(df_con_texto)

    if n_paginas == 0:
        log.warning("No hay páginas con texto para calcular n-gramas.")
        return []

    log.info("Calculando n-gramas de %d palabras sobre %d páginas con texto …", NGRAMA_N, n_paginas)

    conteo_documentos: Counter = Counter()
    for texto in df_con_texto["texto_extraido"]:
        ngramas_doc = extraer_ngramas(str(texto), NGRAMA_N)
        conteo_documentos.update(ngramas_doc)

    umbral_abs = UMBRAL_BOILERPLATE * n_paginas
    boilerplate_detectado = [
        ngrama for ngrama, cnt in conteo_documentos.items()
        if cnt >= umbral_abs
    ]

    # Ordenar por frecuencia descendente para el diagnóstico
    boilerplate_ordenado = sorted(
        boilerplate_detectado,
        key=lambda g: conteo_documentos[g],
        reverse=True,
    )

    log.info(
        "N-gramas detectados como boilerplate (>%.0f%% de páginas): %d",
        UMBRAL_BOILERPLATE * 100,
        len(boilerplate_ordenado),
    )

    # Imprimir TOP 30 en consola
    print("\n" + "=" * 60)
    print(f"TOP {TOP_BOILERPLATE} FRASES BOILERPLATE MÁS FRECUENTES")
    print("=" * 60)
    for i, ngrama in enumerate(boilerplate_ordenado[:TOP_BOILERPLATE], start=1):
        frec_rel = conteo_documentos[ngrama] / n_paginas * 100
        print(f"  {i:2d}. [{frec_rel:5.1f}%] {ngrama}")
    print("=" * 60 + "\n")

    return boilerplate_ordenado


# ---------------------------------------------------------------------------
# PASO 3 — FUNCIÓN DE LIMPIEZA POR FILA
# ---------------------------------------------------------------------------

def limpiar_texto(texto: str, patrones: list[str]) -> str:
    """
    Limpia el texto de una fila eliminando patrones de boilerplate y ruido.

    Pasos:
      1. Eliminar cada patrón (case-insensitive) con re.sub.
      2. Eliminar líneas de menos de MIN_LONGITUD_LINEA caracteres.
      3. Normalizar espacios múltiples y saltos de línea.
      4. Truncar a MAX_PALABRAS palabras.
    """
    if not texto or not texto.strip():
        return ""

    resultado = texto

    # Eliminar cada patrón (case-insensitive)
    for patron in patrones:
        # Escapar caracteres especiales de regex en el patrón literal
        patron_escapado = re.escape(patron)
        resultado = re.sub(patron_escapado, " ", resultado, flags=re.IGNORECASE)

    # Eliminar líneas cortas (menos de MIN_LONGITUD_LINEA caracteres)
    lineas = resultado.split("\n")
    lineas_filtradas = [
        linea for linea in lineas
        if len(linea.strip()) >= MIN_LONGITUD_LINEA
    ]
    resultado = "\n".join(lineas_filtradas)

    # Normalizar espacios múltiples y saltos de línea
    resultado = re.sub(r"[ \t]+", " ", resultado)
    resultado = re.sub(r"\n{2,}", "\n", resultado)
    resultado = resultado.strip()

    # Truncar a MAX_PALABRAS palabras
    palabras = resultado.split()
    if len(palabras) > MAX_PALABRAS:
        resultado = " ".join(palabras[:MAX_PALABRAS])

    return resultado


# ---------------------------------------------------------------------------
# PASO 4 — APLICACIÓN Y GUARDADO
# ---------------------------------------------------------------------------

def aplicar_limpieza(df: pd.DataFrame, patrones: list[str]) -> pd.DataFrame:
    """Aplica limpiar_texto a la columna texto_extraido y agrega columnas nuevas."""
    log.info("Aplicando limpieza a %d filas …", len(df))
    df["texto_limpio"] = df["texto_extraido"].apply(
        lambda t: limpiar_texto(str(t), patrones)
    )
    df["longitud_limpia"] = df["texto_limpio"].str.len()
    return df


def guardar_csv(df: pd.DataFrame) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
    log.info("CSV limpio guardado: %s (%d filas)", OUTPUT_CSV, len(df))


def imprimir_estadisticas(df: pd.DataFrame) -> None:
    total = len(df)
    con_texto_limpio = int((df["longitud_limpia"] > 0).sum())
    long_antes = df[df["longitud_texto"] > 0]["longitud_texto"]
    long_despues = df[df["longitud_limpia"] > 0]["longitud_limpia"]

    promedio_antes  = long_antes.mean()  if len(long_antes)  > 0 else 0
    promedio_despues = long_despues.mean() if len(long_despues) > 0 else 0

    # Porcentaje de texto eliminado promedio (sobre páginas con texto original)
    df_con_antes = df[df["longitud_texto"] > 0].copy()
    if len(df_con_antes) > 0:
        df_con_antes["pct_eliminado"] = (
            (df_con_antes["longitud_texto"] - df_con_antes["longitud_limpia"])
            / df_con_antes["longitud_texto"]
        ).clip(lower=0) * 100
        pct_eliminado_promedio = df_con_antes["pct_eliminado"].mean()
    else:
        pct_eliminado_promedio = 0.0

    print("\n" + "=" * 60)
    print("ESTADÍSTICAS DE LIMPIEZA")
    print("=" * 60)
    print(f"  Total filas:                        {total}")
    print(f"  Filas con texto_limpio no vacío:    {con_texto_limpio}")
    print(f"  Longitud promedio ANTES (chars):    {promedio_antes:,.0f}")
    print(f"  Longitud promedio DESPUÉS (chars):  {promedio_despues:,.0f}")
    print(f"  % texto eliminado promedio:         {pct_eliminado_promedio:.1f}%")
    print("=" * 60 + "\n")


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 3 — Limpieza de boilerplate — Portal SAT")
    log.info("=" * 60)

    # 1. Cargar CSV de scraping
    df = cargar_csv()

    # 2. Detectar n-gramas de boilerplate estadísticamente
    ngramas_detectados = detectar_ngramas_boilerplate(df)

    # 3. Combinar patrones hardcodeados + detectados estadísticamente
    patrones_combinados = PATRONES_HARDCODED + [
        ng for ng in ngramas_detectados
        if ng not in PATRONES_HARDCODED
    ]
    log.info(
        "Patrones de limpieza totales: %d (hardcoded: %d + detectados: %d)",
        len(patrones_combinados),
        len(PATRONES_HARDCODED),
        len(ngramas_detectados),
    )

    # 4. Aplicar limpieza
    df = aplicar_limpieza(df, patrones_combinados)

    # 5. Guardar CSV limpio
    guardar_csv(df)

    # 6. Imprimir estadísticas
    imprimir_estadisticas(df)

    log.info("=" * 60)
    log.info("Salida: %s", OUTPUT_CSV)
    log.info("=" * 60)


if __name__ == "__main__":
    main()
