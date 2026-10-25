"""
scrape_iter2.py
===============
Iteración 2 — Scraping asíncrono del cuerpo principal de las 683 gestiones
del Catálogo Único del Portal SAT.

Entrada:
    docs/fuentes-datos/02_archivos_producto_entregables/
    Catalogo_Contenidos_Unicos_Portal_SAT.xlsx
    Hoja: "Catálogo Único (683)"

Salida:
    salida/scraped_content.csv
    Columnas: titulo, url, texto_extraido, longitud_texto, status_http

Características:
  - Detección automática de columnas Título / URL
  - Scraping asíncrono con aiohttp + asyncio (semáforo 10 simultáneos)
  - Timeout de 15 s por URL; manejo graceful de errores
  - Extracción de texto con BeautifulSoup (elimina nav/footer/header/script/style/aside)
  - Preferencia por <main>; fallback a <body> limpio
  - Checkpoint progresivo cada 50 URLs (reanudación automática)
  - Estadísticas al finalizar
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


for _pkg in ["aiohttp", "beautifulsoup4", "lxml", "pandas", "openpyxl"]:
    _install(_pkg)

# ---------------------------------------------------------------------------
# IMPORTS
# ---------------------------------------------------------------------------
import asyncio
import logging
import os
import re
from pathlib import Path

import aiohttp
import pandas as pd
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# CONFIGURACIÓN
# ---------------------------------------------------------------------------
INPUT_FILE = Path(
    r"c:\Users\busqu\Documents\GitHub\SAT\docs\fuentes-datos"
    r"\02_archivos_producto_entregables\Catalogo_Contenidos_Unicos_Portal_SAT.xlsx"
)
SHEET_NAME = "Catálogo Único (683)"

OUTPUT_DIR = Path(r"c:\Users\busqu\Documents\GitHub\SAT\salida")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_CSV = OUTPUT_DIR / "scraped_content.csv"

MAX_CONCURRENT = 10          # semáforo: máximo 10 requests simultáneos
TIMEOUT_SECS   = 15          # timeout por URL (segundos)
CHECKPOINT_EVERY = 50        # guardar progreso cada N URLs procesadas

# Variantes de nombre de columna que se aceptan (sin distinguir mayúsculas)
_TITLE_VARIANTS = {"título", "titulo", "title", "nombre", "gestión", "gestion",
                   "nombre de la gestión", "nombre de la gestion"}
_URL_VARIANTS   = {"url", "url portal sat", "enlace", "link", "href"}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-GT,es;q=0.9,en;q=0.7",
}

# Tags de ruido del DOM que se eliminan antes de extraer texto
NOISE_TAGS = ["nav", "footer", "header", "script", "style", "aside"]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# PASO 1 — LECTURA DEL EXCEL
# ---------------------------------------------------------------------------

def detectar_columnas(df: pd.DataFrame) -> tuple[str, str]:
    """
    Detecta automáticamente los nombres de columna para Título y URL
    buscando variantes conocidas (case-insensitive, strip).
    Retorna (col_titulo, col_url).
    Lanza ValueError si no se puede detectar alguna.
    """
    col_titulo: str | None = None
    col_url: str | None = None

    for col in df.columns:
        col_norm = col.strip().lower()
        if col_titulo is None and col_norm in _TITLE_VARIANTS:
            col_titulo = col
        if col_url is None and col_norm in _URL_VARIANTS:
            col_url = col
        # Coincidencia parcial como fallback
        if col_titulo is None and any(v in col_norm for v in _TITLE_VARIANTS):
            col_titulo = col
        if col_url is None and any(v in col_norm for v in _URL_VARIANTS):
            col_url = col

    if col_titulo is None:
        raise ValueError(
            f"No se encontró columna de título. Columnas disponibles: {list(df.columns)}"
        )
    if col_url is None:
        raise ValueError(
            f"No se encontró columna de URL. Columnas disponibles: {list(df.columns)}"
        )
    return col_titulo, col_url


def cargar_gestiones() -> pd.DataFrame:
    """Carga la hoja del Excel y retorna un DataFrame con columnas 'titulo' y 'url'."""
    log.info("Leyendo Excel: %s | hoja: %s", INPUT_FILE, SHEET_NAME)
    df = pd.read_excel(INPUT_FILE, sheet_name=SHEET_NAME)
    log.info("Filas cargadas del Excel: %d", len(df))

    col_titulo, col_url = detectar_columnas(df)
    log.info("Columna de título detectada: '%s'", col_titulo)
    log.info("Columna de URL detectada:    '%s'", col_url)

    resultado = pd.DataFrame({
        "titulo": df[col_titulo].fillna("").astype(str).str.strip(),
        "url":    df[col_url].fillna("").astype(str).str.strip(),
    })
    resultado = resultado[resultado["url"] != ""].reset_index(drop=True)
    log.info("Gestiones con URL válida: %d", len(resultado))
    return resultado


# ---------------------------------------------------------------------------
# PASO 2 — EXTRACCIÓN DE TEXTO CON BEAUTIFULSOUP
# ---------------------------------------------------------------------------

def extraer_texto(html: str) -> str:
    """
    Recibe HTML crudo y retorna el texto operativo limpio:
      1. Elimina tags de ruido: nav, footer, header, script, style, aside.
      2. Prefiere contenido de <main>; si no existe, usa <body>.
      3. Normaliza espacios múltiples y saltos de línea.
    """
    soup = BeautifulSoup(html, "lxml")

    # Eliminar tags de ruido
    for tag in NOISE_TAGS:
        for element in soup.find_all(tag):
            element.decompose()

    # Preferir <main>, sino usar <body>
    contenedor = soup.find("main") or soup.find("body")
    if contenedor is None:
        return ""

    texto = contenedor.get_text(separator=" ")
    # Normalizar espacios múltiples y saltos de línea
    texto = re.sub(r"[ \t]+", " ", texto)
    texto = re.sub(r"\n{2,}", "\n", texto)
    texto = texto.strip()
    return texto


# ---------------------------------------------------------------------------
# PASO 3 — SCRAPING ASÍNCRONO
# ---------------------------------------------------------------------------

async def fetch_url(
    session: aiohttp.ClientSession,
    semaforo: asyncio.Semaphore,
    titulo: str,
    url: str,
) -> dict:
    """
    Descarga una URL de forma asíncrona y extrae su texto principal.
    Retorna un dict con las columnas del CSV de salida.
    """
    resultado = {
        "titulo":         titulo,
        "url":            url,
        "texto_extraido": "",
        "longitud_texto": 0,
        "status_http":    "ERROR",
    }

    if not url.startswith("http"):
        resultado["status_http"] = "URL_INVALIDA"
        return resultado

    try:
        async with semaforo:
            timeout = aiohttp.ClientTimeout(total=TIMEOUT_SECS)
            async with session.get(url, timeout=timeout, allow_redirects=True) as resp:
                resultado["status_http"] = str(resp.status)
                if resp.status == 200:
                    html = await resp.text(errors="replace")
                    texto = extraer_texto(html)
                    resultado["texto_extraido"] = texto
                    resultado["longitud_texto"] = len(texto)
    except asyncio.TimeoutError:
        resultado["status_http"] = "TIMEOUT"
    except aiohttp.ClientConnectorError:
        resultado["status_http"] = "CONNECTION_ERROR"
    except aiohttp.ClientError as exc:
        resultado["status_http"] = f"CLIENT_ERROR: {type(exc).__name__}"
    except Exception as exc:
        resultado["status_http"] = f"ERROR: {type(exc).__name__}"

    return resultado


async def scrape_todas(gestiones: pd.DataFrame, ya_procesadas: set[str]) -> list[dict]:
    """
    Ejecuta el scraping asíncrono de todas las gestiones pendientes.
    Aplica checkpoint progresivo cada CHECKPOINT_EVERY URLs.
    Retorna la lista completa de resultados nuevos.
    """
    pendientes = gestiones[~gestiones["url"].isin(ya_procesadas)].copy()
    log.info(
        "URLs pendientes de scrapear: %d (ya procesadas: %d)",
        len(pendientes),
        len(ya_procesadas),
    )

    semaforo = asyncio.Semaphore(MAX_CONCURRENT)
    resultados: list[dict] = []

    connector = aiohttp.TCPConnector(ssl=False, limit=MAX_CONCURRENT)
    async with aiohttp.ClientSession(headers=HEADERS, connector=connector) as session:
        tareas = [
            fetch_url(session, semaforo, row["titulo"], row["url"])
            for _, row in pendientes.iterrows()
        ]

        for i, coro in enumerate(asyncio.as_completed(tareas), start=1):
            resultado = await coro
            resultados.append(resultado)
            log.info(
                "[%d/%d] %s → status: %s | chars: %d",
                i,
                len(tareas),
                resultado["url"][:70],
                resultado["status_http"],
                resultado["longitud_texto"],
            )

            # Checkpoint progresivo
            if i % CHECKPOINT_EVERY == 0:
                guardar_checkpoint(resultados, ya_procesadas, parcial=True)
                log.info("Checkpoint guardado (%d procesadas en esta sesión)", i)

    return resultados


# ---------------------------------------------------------------------------
# PASO 4 — CHECKPOINT Y PERSISTENCIA
# ---------------------------------------------------------------------------

def cargar_checkpoint() -> tuple[pd.DataFrame, set[str]]:
    """
    Si el CSV de salida existe, lo carga y retorna:
      - DataFrame con los datos ya guardados
      - Conjunto de URLs ya procesadas
    Si no existe, retorna DataFrame vacío y conjunto vacío.
    """
    if OUTPUT_CSV.exists():
        try:
            df_existente = pd.read_csv(OUTPUT_CSV, encoding="utf-8")
            urls_procesadas = set(df_existente["url"].dropna().astype(str).tolist())
            log.info(
                "Checkpoint cargado: %d registros previos (%d URLs únicas)",
                len(df_existente),
                len(urls_procesadas),
            )
            return df_existente, urls_procesadas
        except Exception as exc:
            log.warning("No se pudo leer el checkpoint existente (%s). Iniciando desde cero.", exc)

    return pd.DataFrame(columns=["titulo", "url", "texto_extraido", "longitud_texto", "status_http"]), set()


def guardar_checkpoint(
    resultados_nuevos: list[dict],
    ya_procesadas: set[str],
    parcial: bool = False,
) -> None:
    """
    Combina los resultados previos (ya_procesadas) con los nuevos y guarda el CSV.
    En modo parcial se añaden los registros nuevos al CSV existente (append).
    """
    df_nuevo = pd.DataFrame(resultados_nuevos)
    if OUTPUT_CSV.exists() and parcial:
        df_previo = pd.read_csv(OUTPUT_CSV, encoding="utf-8")
        df_total = pd.concat([df_previo, df_nuevo], ignore_index=True)
        # Deduplicar: mantener la última entrada por URL
        df_total = df_total.drop_duplicates(subset="url", keep="last")
    else:
        df_total = df_nuevo

    df_total.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")


def guardar_resultado_final(df_previo: pd.DataFrame, resultados_nuevos: list[dict]) -> pd.DataFrame:
    """
    Une los resultados previos del checkpoint con los nuevos,
    deduplica por URL y guarda el CSV final.
    Retorna el DataFrame completo.
    """
    df_nuevo = pd.DataFrame(resultados_nuevos) if resultados_nuevos else pd.DataFrame(
        columns=["titulo", "url", "texto_extraido", "longitud_texto", "status_http"]
    )
    df_total = pd.concat([df_previo, df_nuevo], ignore_index=True)
    df_total = df_total.drop_duplicates(subset="url", keep="last").reset_index(drop=True)
    df_total.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
    log.info("CSV final guardado: %s (%d filas)", OUTPUT_CSV, len(df_total))
    return df_total


# ---------------------------------------------------------------------------
# PASO 5 — ESTADÍSTICAS FINALES
# ---------------------------------------------------------------------------

def imprimir_estadisticas(df: pd.DataFrame) -> None:
    """Imprime un resumen del resultado del scraping."""
    total = len(df)
    exitosas = int((df["status_http"] == "200").sum())
    con_texto = int((df["longitud_texto"] > 0).sum())
    sin_texto = total - con_texto

    log.info("=" * 60)
    log.info("ESTADÍSTICAS FINALES")
    log.info("=" * 60)
    log.info("Total URLs procesadas:                  %d", total)
    log.info("Respuestas HTTP 200 (exitosas):          %d", exitosas)
    log.info("Gestiones con texto extraído (> 0 chars): %d", con_texto)
    log.info("Gestiones con error o texto vacío:       %d", sin_texto)
    log.info("")

    # Distribución de status
    dist = df["status_http"].value_counts()
    log.info("Distribución de status HTTP:")
    for status, count in dist.items():
        log.info("  %-30s %d", status, count)

    # Estadísticas de longitud del texto
    if con_texto > 0:
        long_exitosas = df[df["longitud_texto"] > 0]["longitud_texto"]
        log.info("")
        log.info("Longitud de texto extraído (chars) — gestiones con texto:")
        log.info("  Mínimo:  %d", int(long_exitosas.min()))
        log.info("  Máximo:  %d", int(long_exitosas.max()))
        log.info("  Promedio: %.0f", long_exitosas.mean())
        log.info("  Mediana: %.0f", long_exitosas.median())

    log.info("=" * 60)
    log.info("Archivo CSV: %s", OUTPUT_CSV)


# ---------------------------------------------------------------------------
# PUNTO DE ENTRADA
# ---------------------------------------------------------------------------

async def main() -> None:
    log.info("=" * 60)
    log.info("Iteración 2 — Scraping de gestiones del Portal SAT")
    log.info("=" * 60)

    # 1. Cargar datos de entrada
    gestiones = cargar_gestiones()

    # 2. Cargar checkpoint si existe
    df_previo, ya_procesadas = cargar_checkpoint()

    # 3. Ejecutar scraping asíncrono
    resultados_nuevos = await scrape_todas(gestiones, ya_procesadas)

    # 4. Guardar resultado final
    df_total = guardar_resultado_final(df_previo, resultados_nuevos)

    # 5. Imprimir estadísticas
    imprimir_estadisticas(df_total)


if __name__ == "__main__":
    asyncio.run(main())
