#!/usr/bin/env python3
"""
scripts/build_maquila_inventario_ce.py
======================================
Fase 1 de la Maquila de Páginas — Comercio Exterior (Portal SAT).

1. Lee exclusivamente la hoja `Comercio Exterior (197)` de
   `docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado (6).xlsx` (solo lectura).
2. Deduplica las 197 filas en sus 120 destinos URL únicos (preservando `#ancla`)
   garantizando cuadre exacto (`sum(row_count) == 197`) y asignando un `<slug>`
   único y determinístico.
3. Consolida metadatos y resuelve las colisiones de tipología asignando exactamente
   1 Arquetipo maestro (`TIPO-1`..`TIPO-6`) por URL única.
4. Ejecuta verificación HTTP real sobre las URLs base únicas, capturando
   `http_status`, `final_url`, `content_type` y `page_title`, con caché en
   `docs/maquila-paginas/01-inventario/http_cache_ce.json`.
5. Asigna Ola automática (`PAUSA`, `OLA-1`, `OLA-2`, `OLA-3`, `OLA-4`).
6. Genera en `docs/maquila-paginas/01-inventario/`:
   - `matriz_maquila_ce.json`
   - `matriz_maquila_comercio_exterior.xlsx`
   - `RESUMEN_INVENTARIO.md`
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import ssl
import sys
import time
import unicodedata
import urllib.parse
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import openpyxl
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_XLSX = BASE_DIR / "docs" / "fuentes-datos" / "Estructura_Final_Contenido_Portal_SAT_Actualizado (6).xlsx"
SOURCE_SHEET = "Comercio Exterior (197)"
OUT_DIR = BASE_DIR / "docs" / "maquila-paginas" / "01-inventario"
LOTES_DIR = BASE_DIR / "docs" / "maquila-paginas" / "lotes"
CACHE_JSON = OUT_DIR / "http_cache_ce.json"
OUT_JSON = OUT_DIR / "matriz_maquila_ce.json"
OUT_XLSX = OUT_DIR / "matriz_maquila_comercio_exterior.xlsx"
OUT_MD = OUT_DIR / "RESUMEN_INVENTARIO.md"

ARCHETYPE_LABELS = {
    "TIPO-1": "Ficha de Gestión y Requisitos",
    "TIPO-2": "Puente a Aplicativo, Buscador o Descarga",
    "TIPO-3": "Hub / Desglose de Mega-Página",
    "TIPO-4": "Directorio, Tabla o Documentación Técnica",
    "TIPO-5": "Normativa y Criterio Legal",
    "TIPO-6": "Preguntas Frecuentes (FAQ)",
}

WAVE_ORDER = ["PAUSA", "OLA-1", "OLA-2", "OLA-3", "OLA-4"]
ARCHETYPE_ORDER = ["TIPO-1", "TIPO-2", "TIPO-3", "TIPO-4", "TIPO-5", "TIPO-6"]

STOPWORDS_SLUG = {
    "de", "del", "la", "las", "el", "los", "y", "e", "o", "u", "en", "con",
    "para", "por", "sobre", "al", "a", "un", "una", "informacion", "general",
    "requisitos", "pasos", "gestion", "gestiones", "procedimiento", "procedimientos",
}

HOME_CLEAN_URLS = {
    "https://portal.sat.gob.gt",
    "https://portal.sat.gob.gt/portal",
    "http://portal.sat.gob.gt",
    "http://portal.sat.gob.gt/portal",
}


def clean_cell(val: Any) -> str:
    if val is None:
        return ""
    return re.sub(r"\s+", " ", str(val).replace("\xa0", " ")).strip()


def strip_accents(text: str) -> str:
    nfkd = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in nfkd if not unicodedata.combining(ch))


def slugify_fragment(text: str, max_len: int = 44, remove_stopwords: bool = False) -> str:
    decoded = urllib.parse.unquote(text)
    ascii_text = strip_accents(decoded).lower()
    tokens = re.findall(r"[a-z0-9]+", ascii_text)
    if remove_stopwords:
        filtered = [t for t in tokens if t not in STOPWORDS_SLUG]
        if filtered:
            tokens = filtered
    slug = "-".join(tokens)
    if len(slug) > max_len:
        cut = slug[:max_len].rsplit("-", 1)[0]
        slug = cut if cut else slug[:max_len]
    return slug.strip("-") or "recurso"


def build_deterministic_slugs(urls_ordered: list[str], groups: dict[str, list[dict[str, Any]]]) -> dict[str, str]:
    """Asigna un slug único, legible y determinístico (<= 72 chars, ^[a-z0-9-]+$) por URL."""
    raw_candidates: dict[str, str] = {}
    for url in urls_ordered:
        parsed = urllib.parse.urlparse(url)
        path_parts = [p for p in parsed.path.split("/") if p]
        if path_parts and path_parts[0].lower() == "portal":
            path_parts = path_parts[1:]

        if "sites.google.com" in parsed.netloc.lower():
            tail = path_parts[-1] if path_parts else "capacitacion"
            base_slug = f"curso-{slugify_fragment(tail, max_len=48)}"
        elif path_parts:
            if path_parts[-1].lower().endswith((".pdf", ".zip", ".xlsx")):
                stem = Path(urllib.parse.unquote(path_parts[-1])).stem
                base_slug = slugify_fragment(stem, max_len=48)
            elif len(path_parts) >= 2 and path_parts[0].lower() == "programa-miad":
                base_slug = slugify_fragment("-".join(path_parts[-2:]), max_len=48)
            else:
                base_slug = slugify_fragment(path_parts[-1], max_len=48)
        else:
            base_slug = slugify_fragment(parsed.netloc, max_len=48)

        if "#" in url:
            first_title = groups[url][0]["titulo_excel"]
            topic_slug = slugify_fragment(first_title, max_len=28, remove_stopwords=True)
            candidate = f"{base_slug}--{topic_slug}"
        else:
            candidate = base_slug

        if len(candidate) > 72:
            candidate = candidate[:72].rstrip("-")
        raw_candidates[url] = candidate

    counts = Counter(raw_candidates.values())
    used: set[str] = set()
    final_slugs: dict[str, str] = {}
    for url in urls_ordered:
        cand = raw_candidates[url]
        if counts[cand] > 1 or cand in used:
            h6 = hashlib.sha1(url.encode("utf-8")).hexdigest()[:6]
            stem = cand[:65].rstrip("-")
            cand = f"{stem}-{h6}"
        while cand in used:
            h8 = hashlib.sha1((url + cand).encode("utf-8")).hexdigest()[:8]
            cand = f"{cand[:63].rstrip('-')}-{h8}"
        used.add(cand)
        final_slugs[url] = cand
    return final_slugs


def resolve_archetype(
    url: str,
    url_base: str,
    es_ancla: bool,
    tipologias: list[str],
    interacciones: list[str],
    observaciones: list[str],
) -> tuple[str, str]:
    """Asigna exactamente 1 Arquetipo maestro (TIPO-1..TIPO-6) y documenta el criterio."""
    ul = url.lower()
    base_clean = url_base.lower().rstrip("/")
    tipos_set = set(tipologias)
    inter_set = set(interacciones)
    obs_joined = " | ".join(observaciones)
    has_collision = len(tipologias) > 1

    # 1. FAQ (TIPO-6)
    if "/preguntas-frecuentes/" in ul:
        criterio = (
            "URL de preguntas frecuentes (/preguntas-frecuentes/); se prioriza TIPO-6 sobre tipologías mixtas."
            if has_collision
            else "URL de preguntas frecuentes (/preguntas-frecuentes/)."
        )
        return "TIPO-6", criterio

    # 2. Caso explícito OEA (OLA-3 TIPO-1 según lineamiento)
    if base_clean.endswith("/operador-economico-autorizado") and not es_ancla:
        return "TIPO-1", "Página principal Operador Económico Autorizado (OEA) asignada a Ficha de Gestión y Requisitos (TIPO-1)."

    # 3. Hubs y desgloses de mega-página marcados con caso FEL o evaluación de acordeones (TIPO-3)
    if "Aplica el caso de la pagina de fel" in observaciones:
        return "TIPO-3", "Observación explícita 'Aplica el caso de la pagina de fel'; requiere Hub / desglose modular (TIPO-3)."

    if es_ancla and "Evaluar la creación de nueva pagina solo con los acordeones necesarios" in obs_joined:
        return "TIPO-3", "Ancla de mega-página con observación de extracción de acordeones; variante desglose de mega-página (TIPO-3)."

    miad_component_hubs = (
        "/portal/programa-miad/componente-procesos",
        "/portal/programa-miad/componente-de-infraestructura",
        "/portal/programa-miad/componente-de-seguridad",
        "/portal/programa-miad/componente-de-tecnologia",
        "/portal/programa-miad/componente-de-recursos",
    )
    if not es_ancla and any(base_clean.endswith(h) for h in miad_component_hubs):
        return "TIPO-3", "Página componente del Programa MIAD con estructura de sub-hub modular (TIPO-3)."

    # 4. Puentes directos a descarga PDF/software o cursos externos (TIPO-2)
    if any(ext in ul for ext in (".pdf", ".zip", ".xlsx", "/descarga/", "/wpfd_file/")) or "sites.google.com" in ul or "componente-activex-pki-dua" in ul:
        return "TIPO-2", "Recurso descargable directo (.pdf/wpfd), instalador o capacitación externa; puente compacto de 1 pantalla (TIPO-2)."

    # 5. Normativa y criterio legal (TIPO-5)
    if any(k in ul for k in ("legislacion-aduanera/", "acuerdos-y-tratados-internacionales/", "valoracion-y-clasificacion-de-las-mercancias")):
        criterio = (
            "Colisión resuelta a favor de Normativa y Criterio Legal (TIPO-5) por ser compendio jurídico aduanero."
            if has_collision
            else "Compendio oficial de normativa, tratados o valoración aduanera (TIPO-5)."
        )
        return "TIPO-5", criterio

    if "Normativa y Criterio Legal" in tipos_set:
        criterio = (
            "Colisión resuelta a favor de Normativa y Criterio Legal (TIPO-5)."
            if has_collision
            else "Tipología declarada Normativa y Criterio Legal (TIPO-5)."
        )
        return "TIPO-5", criterio

    # 6. Directorios, tablas y documentación técnica EDI / especificaciones (TIPO-4)
    tipo4_keywords = (
        "ubicacion-y-horario-de-aduanas",
        "catalogo-de-permisos-no-arancelarios",
        "listado-de-contribuyentes-morosos",
        "tablas-y-acuerdos-vehiculos",
        "mensaje-carga-aduanera-cuscar",
        "marchamo-electronico",
        "documentos-manifiesto",
        "puestos-de-control-interinstitucional-pci",
    )
    if any(k in ul for k in tipo4_keywords):
        criterio = (
            "Colisión resuelta a TIPO-4 por tratarse de directorio tabular o especificación técnica."
            if has_collision
            else "Directorio oficial, tabla de valores o especificación técnica aduanera (TIPO-4)."
        )
        return "TIPO-4", criterio

    # 7. Puentes a buscadores, consultas en línea y aplicativos (TIPO-2)
    if "Consulta Pública / Buscador" in tipos_set:
        criterio = (
            "Colisión resuelta a TIPO-2 (Puente a Buscador/Consulta) frente a tipología descriptiva/transaccional."
            if has_collision
            else "Buscador o consulta pública en línea (TIPO-2)."
        )
        return "TIPO-2", criterio

    if ("Buscador / Consulta en Línea" in inter_set or "Consulta a Base de Datos" in inter_set) and not (
        "facilitacion-de-comercio/" in ul and not es_ancla
    ):
        criterio = (
            "Colisión resuelta a TIPO-2 por interacción dominante de consulta/buscador."
            if has_collision
            else "Interacción de consulta en línea o base de datos (TIPO-2)."
        )
        return "TIPO-2", criterio

    tipo2_slugs = (
        "polizas-de-importacion/",
        "asignacion-de-revisores/",
        "asignacion-rampa-pq/",
        "transito-pendiente/",
        "sistema-de-cobro-por-permanencia/",
    )
    if any(k in ul for k in tipo2_slugs):
        criterio = (
            "Colisión resuelta a TIPO-2 por ser puente directo a aplicativo o consulta operativa."
            if has_collision
            else "Puente directo a aplicativo o consulta operativa (TIPO-2)."
        )
        return "TIPO-2", criterio

    # 8. Ficha de Gestión y Requisitos (TIPO-1)
    if has_collision:
        return "TIPO-1", "Colisión de tipologías mixtas consolidada en Ficha de Gestión y Requisitos (TIPO-1)."
    return "TIPO-1", "Tipología operativa/informativa de origen mapeada a Ficha de Gestión y Requisitos (TIPO-1)."


def assign_wave(arquetipo: str, niveles_2: list[str], lc_false_count: int, observaciones: list[str]) -> str:
    if lc_false_count == 0 and len(observaciones) == 0:
        return "PAUSA"
    if len(observaciones) > 0:
        return "OLA-1"
    if arquetipo in ("TIPO-2", "TIPO-4", "TIPO-5", "TIPO-6"):
        return "OLA-2"
    if arquetipo == "TIPO-1":
        n2_set = set(niveles_2)
        if "Importadores" in n2_set or "Operador Económico Autorizado (OEA)" in n2_set:
            return "OLA-3"
        return "OLA-4"
    # Respaldo defensivo en caso apareciera TIPO-3 pendiente sin observaciones
    return "OLA-2"


def extract_html_title(raw_bytes: bytes, declared_encoding: str | None) -> str:
    encodings = [declared_encoding] if declared_encoding else []
    encodings.extend(["utf-8", "latin-1"])
    text = ""
    for enc in encodings:
        if not enc:
            continue
        try:
            text = raw_bytes.decode(enc, errors="replace")
            break
        except LookupError:
            continue
    if not text:
        text = raw_bytes.decode("utf-8", errors="replace")

    match = re.search(r"<title[^>]*>(.*?)</title>", text, flags=re.IGNORECASE | re.DOTALL)
    if not match:
        return ""
    title = html.unescape(match.group(1))
    return re.sub(r"\s+", " ", title).strip()


def fetch_http_info(url_base: str, timeout: int = 15) -> dict[str, Any]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SAT-Maquila-Audit/1.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-GT,es;q=0.9,en;q=0.8",
        "Connection": "close",
    }

    last_err: str | None = None
    for attempt in range(3):
        try:
            with requests.get(url_base, headers=headers, allow_redirects=True, stream=True, timeout=timeout) as resp:
                status = resp.status_code
                final_url = resp.url
                content_type = resp.headers.get("Content-Type", "")
                page_title = ""

                if "html" in content_type.lower() or "xhtml" in content_type.lower() or not content_type:
                    chunks = []
                    total = 0
                    for chunk in resp.iter_content(chunk_size=16384):
                        if not chunk:
                            continue
                        chunks.append(chunk)
                        total += len(chunk)
                        if total >= 131072:
                            break
                    page_title = extract_html_title(b"".join(chunks), resp.encoding)
                elif "pdf" in content_type.lower():
                    page_title = "[Documento PDF]"

                orig_norm = url_base.rstrip("/").split("#")[0]
                final_norm = final_url.rstrip("/").split("#")[0]
                redirect_home = orig_norm not in HOME_CLEAN_URLS and final_norm in HOME_CLEAN_URLS

                return {
                    "url_base": url_base,
                    "http_status": status,
                    "final_url": final_url,
                    "content_type": content_type,
                    "page_title": page_title,
                    "redirect_home": redirect_home,
                    "http_error": "REDIRECT_HOME" if redirect_home else None,
                    "checked_at": datetime.now(timezone.utc).isoformat(),
                }
        except requests.exceptions.Timeout:
            last_err = "TIMEOUT"
        except requests.exceptions.SSLError as exc:
            try:
                with requests.get(url_base, headers=headers, allow_redirects=True, stream=True, timeout=timeout, verify=False) as resp_insec:
                    content_type = resp_insec.headers.get("Content-Type", "")
                    page_title = ""
                    if "html" in content_type.lower():
                        raw = resp_insec.raw.read(131072, decode_content=True)
                        page_title = extract_html_title(raw, resp_insec.encoding)
                    return {
                        "url_base": url_base,
                        "http_status": resp_insec.status_code,
                        "final_url": resp_insec.url,
                        "content_type": content_type,
                        "page_title": page_title,
                        "redirect_home": False,
                        "http_error": f"SSL_WARN: {exc}",
                        "checked_at": datetime.now(timezone.utc).isoformat(),
                    }
            except Exception as inner_exc:
                last_err = f"SSL_ERROR: {inner_exc}"
        except requests.exceptions.ConnectionError as exc:
            last_err = f"CONN_ERROR: {exc}"
        except Exception as exc:
            last_err = f"ERROR: {exc}"

        if attempt < 2:
            time.sleep(0.8 * (attempt + 1))

    status_label = "TIMEOUT" if last_err == "TIMEOUT" else ("SSL_ERROR" if str(last_err).startswith("SSL") else "CONN_ERROR")
    return {
        "url_base": url_base,
        "http_status": status_label,
        "final_url": url_base,
        "content_type": "",
        "page_title": "",
        "redirect_home": False,
        "http_error": last_err,
        "checked_at": datetime.now(timezone.utc).isoformat(),
    }


def run_http_verification(base_urls: list[str], use_cache: bool = False, workers: int = 3, timeout: int = 15) -> dict[str, dict[str, Any]]:
    cache: dict[str, dict[str, Any]] = {}
    if CACHE_JSON.exists():
        try:
            cache = json.loads(CACHE_JSON.read_text(encoding="utf-8"))
        except Exception:
            cache = {}

    if use_cache and all(u in cache for u in base_urls):
        print(f"[HTTP] Usando caché existente para las {len(base_urls)} URLs base únicas.")
        return {u: cache[u] for u in base_urls}

    print(f"[HTTP] Verificando {len(base_urls)} URLs base únicas en vivo (workers={workers}, timeout={timeout}s)...")
    results: dict[str, dict[str, Any]] = {}
    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(fetch_http_info, u, timeout): u for u in base_urls}
        done_count = 0
        for fut in as_completed(futures):
            u = futures[fut]
            res = fut.result()
            results[u] = res
            done_count += 1
            if done_count % 25 == 0 or done_count == len(base_urls):
                print(f"  Progreso HTTP: {done_count}/{len(base_urls)}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    ordered_cache = {u: results[u] for u in base_urls}
    CACHE_JSON.write_text(json.dumps(ordered_cache, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[HTTP] Caché guardada en {CACHE_JSON.relative_to(BASE_DIR).as_posix()}")
    return ordered_cache


def scan_compiled_maquila_slugs(lotes_dir: Path = LOTES_DIR) -> dict[str, str]:
    """Escanea lotes compilados y retorna {slug: subcarpeta} para pares _wpbakery.txt + _custom.css válidos."""
    if not lotes_dir.exists():
        return {}

    compiled: dict[str, str] = {}
    suffix = "_wpbakery.txt"
    for txt_path in sorted(lotes_dir.rglob(f"*{suffix}")):
        slug = txt_path.name[:-len(suffix)]
        if not slug or not txt_path.is_file():
            continue
        css_path = txt_path.parent / f"{slug}_custom.css"
        if css_path.is_file() and txt_path.stat().st_size > 0 and css_path.stat().st_size > 0:
            rel_dir = txt_path.parent.relative_to(lotes_dir).as_posix()
            compiled[slug] = "lotes" if rel_dir == "." else rel_dir
    return compiled


def populate_table_sheet(
    ws,
    headers: list[str],
    rows: list[list[Any]],
    col_widths: list[int],
    freeze: str = "A2",
) -> None:
    """Escribe encabezados y filas tabulares aplicando estilo estándar SAT."""
    header_fill = PatternFill(start_color="19324B", end_color="19324B", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    body_font = Font(name="Calibri", size=10, color="1E293B")
    thin = Side(border_style="thin", color="CBD5E1")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    ws.append(headers)
    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True)
        cell.border = border
    ws.row_dimensions[1].height = 28

    for r_vals in rows:
        ws.append(r_vals)
        r_idx = ws.max_row
        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=r_idx, column=col_idx)
            cell.font = body_font
            cell.alignment = Alignment(horizontal="left", vertical="top", wrap_text=True)
            cell.border = border

    for idx, width in enumerate(col_widths, start=1):
        ws.column_dimensions[get_column_letter(idx)].width = width

    ws.freeze_panes = freeze
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}{ws.max_row}"


def write_excel_workbook(payload: dict[str, Any]) -> None:
    wb = openpyxl.Workbook()
    meta = payload["metadata"]
    urls = payload["urls_unicas"]
    colisiones = payload["colisiones_tipologia"]
    trazabilidad = payload["trazabilidad_filas"]

    # Hoja 1: Resumen Maquila
    ws_res = wb.active
    ws_res.title = "Resumen Maquila"
    title_fill = PatternFill(start_color="0284C7", end_color="0284C7", fill_type="solid")
    sub_fill = PatternFill(start_color="19324B", end_color="19324B", fill_type="solid")
    zebra_fill = PatternFill(start_color="F4F6F9", end_color="F4F6F9", fill_type="solid")
    thin = Side(border_style="thin", color="CBD5E1")
    border = Border(left=thin, right=thin, top=thin, bottom=thin)

    ws_res["A1"] = "Tablero Maestro de Maquila — Operadores de Comercio Exterior (Portal SAT)"
    ws_res["A1"].font = Font(name="Calibri", size=14, bold=True, color="FFFFFF")
    ws_res["A1"].fill = title_fill
    ws_res.merge_cells("A1:E1")
    ws_res.row_dimensions[1].height = 30

    ws_res["A2"] = f"Fuente: {meta['fuente']} | Hoja: {meta['hoja']} | Generado: {meta['generated_at']}"
    ws_res["A2"].font = Font(name="Calibri", size=10, italic=True, color="475569")
    ws_res.merge_cells("A2:E2")

    kpis = [
        ("Indicador de Control", "Valor", "Validación"),
        ("Total de filas origen (Comercio Exterior)", meta["total_filas_origen"], "Cuadre exacto esperado: 197"),
        ("Destinos URL únicos (incluyendo #anclas)", meta["total_urls_unicas"], "Suma de row_count == 197"),
        ("URLs base únicas verificadas por HTTP", meta["total_urls_base_unicas"], "Sin fragmento #ancla"),
        ("Destinos específicos con #ancla", meta["total_anclas"], "Candidatos a desglose / verificación"),
        ("URLs con colisión de tipología resuelta", meta["total_colisiones_tipologia"], "1 arquetipo maestro por URL"),
        ("URLs únicas accionables (Olas 1 a 4)", meta["total_urls_accionables"], "Excluye PAUSA (Lenguaje Claro activo)"),
        ("URLs únicas de la matriz con maquila completada", meta.get("total_urls_maquiladas", 0), "Pares _wpbakery.txt + _custom.css detectados"),
    ]
    start_row = 4
    for offset, row_vals in enumerate(kpis):
        r = start_row + offset
        for c_idx, val in enumerate(row_vals, start=1):
            cell = ws_res.cell(row=r, column=c_idx, value=val)
            cell.border = border
            if offset == 0:
                cell.fill = sub_fill
                cell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
            else:
                if offset % 2 == 0:
                    cell.fill = zebra_fill
                cell.font = Font(name="Calibri", size=10, bold=(c_idx == 2), color="19324B")

    # Tabla por Ola
    ola_start = start_row + len(kpis) + 2
    ola_headers = ["Ola de Producción", "URLs Únicas", "Filas Consolidadas", "Regla de Asignación"]
    ola_desc = {
        "PAUSA": "Todas las filas con Lenguaje Claro = True y sin observaciones",
        "OLA-1": "URLs con observaciones explícitas de migración, FEL o acordeones",
        "OLA-2": "Pendientes de arquetipos TIPO-2, TIPO-4, TIPO-5 y TIPO-6",
        "OLA-3": "Pendientes TIPO-1 de Importadores y Operador Económico Autorizado (OEA)",
        "OLA-4": "Resto de pendientes TIPO-1 (AFPA, Exportadores y Regímenes Especiales)",
    }
    for c_idx, h in enumerate(ola_headers, start=1):
        cell = ws_res.cell(row=ola_start, column=c_idx, value=h)
        cell.fill = sub_fill
        cell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        cell.border = border

    for idx, ola in enumerate(WAVE_ORDER, start=1):
        r = ola_start + idx
        subset = [u for u in urls if u["ola"] == ola]
        vals = [ola, len(subset), sum(u["row_count"] for u in subset), ola_desc[ola]]
        for c_idx, val in enumerate(vals, start=1):
            cell = ws_res.cell(row=r, column=c_idx, value=val)
            cell.border = border
            if idx % 2 == 0:
                cell.fill = zebra_fill
            cell.font = Font(name="Calibri", size=10, bold=(c_idx == 1), color="19324B")

    # Tabla por Arquetipo
    arq_start = ola_start + len(WAVE_ORDER) + 2
    arq_headers = ["Arquetipo Maestro", "Descripción del Arquetipo", "URLs Únicas", "Filas Consolidadas"]
    for c_idx, h in enumerate(arq_headers, start=1):
        cell = ws_res.cell(row=arq_start, column=c_idx, value=h)
        cell.fill = sub_fill
        cell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        cell.border = border

    for idx, arq in enumerate(ARCHETYPE_ORDER, start=1):
        r = arq_start + idx
        subset = [u for u in urls if u["arquetipo_maestro"] == arq]
        vals = [arq, ARCHETYPE_LABELS[arq], len(subset), sum(u["row_count"] for u in subset)]
        for c_idx, val in enumerate(vals, start=1):
            cell = ws_res.cell(row=r, column=c_idx, value=val)
            cell.border = border
            if idx % 2 == 0:
                cell.fill = zebra_fill
            cell.font = Font(name="Calibri", size=10, bold=(c_idx == 1), color="19324B")

    # Tabla por Estado HTTP
    http_start = arq_start + len(ARCHETYPE_ORDER) + 2
    http_headers = ["Estado HTTP", "URLs Únicas", "URLs Base Únicas"]
    for c_idx, h in enumerate(http_headers, start=1):
        cell = ws_res.cell(row=http_start, column=c_idx, value=h)
        cell.fill = sub_fill
        cell.font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        cell.border = border

    http_counter = Counter(str(u["http_status"]) for u in urls)
    base_seen: dict[str, set[str]] = defaultdict(set)
    for u in urls:
        base_seen[str(u["http_status"])].add(u["url_base"])
    for idx, (st, cnt) in enumerate(sorted(http_counter.items()), start=1):
        r = http_start + idx
        vals = [st, cnt, len(base_seen[st])]
        for c_idx, val in enumerate(vals, start=1):
            cell = ws_res.cell(row=r, column=c_idx, value=val)
            cell.border = border
            if idx % 2 == 0:
                cell.fill = zebra_fill
            cell.font = Font(name="Calibri", size=10, color="19324B")

    for col_idx, width in enumerate([44, 38, 18, 56, 20], start=1):
        ws_res.column_dimensions[get_column_letter(col_idx)].width = width

    # Hoja 2: Inventario Unico (120)
    ws_inv = wb.create_sheet("Inventario Unico (120)")
    inv_headers = [
        "Slug",
        "Arquetipo Maestro",
        "Ola",
        "Estado Maquila",
        "URL Destino",
        "URL Base",
        "Es Ancla",
        "Fragmento Ancla",
        "Filas Consolidadas",
        "IDs SAT-GES",
        "Ramas Nivel 2",
        "Subtemas Nivel 3",
        "Títulos Origen",
        "Tipologías Observadas",
        "Tipos Interacción",
        "Observaciones",
        "LC True",
        "LC False",
        "Colisión Tipología",
        "Criterio Arquetipo",
        "HTTP Status",
        "URL Final",
        "Content-Type",
        "Título HTML Vivo",
        "Error HTTP",
    ]
    inv_rows = [
        [
            item["slug"],
            item["arquetipo_maestro"],
            item["ola"],
            item["estado_maquila"],
            item["url"],
            item["url_base"],
            "Sí" if item["es_ancla"] else "No",
            item["ancla_fragmento"],
            item["row_count"],
            ", ".join(item["ids_sat_ges"]),
            " | ".join(item["niveles_2"]),
            " | ".join(item["niveles_3"]),
            " | ".join(item["titulos_excel"]),
            " | ".join(item["tipologias_observadas"]),
            " | ".join(item["tipos_interaccion"]),
            " | ".join(item["observaciones"]),
            item["lc_true_count"],
            item["lc_false_count"],
            "Sí" if item["colision_tipologia"] else "No",
            item["criterio_arquetipo"],
            str(item["http_status"]),
            item["final_url"],
            item["content_type"],
            item["page_title"],
            item["http_error"] or "",
        ]
        for item in urls
    ]
    populate_table_sheet(
        ws_inv,
        inv_headers,
        inv_rows,
        [34, 16, 10, 20, 52, 46, 10, 26, 12, 32, 34, 34, 50, 34, 30, 36, 10, 10, 14, 44, 12, 46, 24, 36, 24],
    )

    # Hoja 3: Colisiones Tipologia
    ws_col = wb.create_sheet("Colisiones Tipologia")
    col_headers = [
        "Slug",
        "URL Destino",
        "Filas Consolidadas",
        "IDs SAT-GES",
        "Tipologías Observadas",
        "Tipos Interacción",
        "Arquetipo Maestro",
        "Criterio de Resolución",
    ]
    col_rows = [
        [
            c_item["slug"],
            c_item["url"],
            c_item["row_count"],
            ", ".join(c_item["ids_sat_ges"]),
            " | ".join(c_item["tipologias_observadas"]),
            " | ".join(c_item["tipos_interaccion"]),
            c_item["arquetipo_maestro"],
            c_item["criterio_resolucion"],
        ]
        for c_item in colisiones
    ]
    populate_table_sheet(ws_col, col_headers, col_rows, [36, 54, 14, 32, 42, 34, 16, 52])

    # Hoja 4: Trazabilidad (197)
    ws_tr = wb.create_sheet("Trazabilidad (197)")
    tr_headers = [
        "Fila Excel",
        "No.",
        "ID Gestión",
        "Nivel 2",
        "Nivel 3",
        "Título Gestión Origen",
        "Tipología Origen",
        "Interacción Origen",
        "Lenguaje Claro",
        "Observación Origen",
        "URL Origen",
        "URL Base",
        "Slug Destino",
        "Arquetipo Maestro",
        "Ola",
        "HTTP Status",
    ]
    tr_rows = [
        [
            t_item["fila_excel"],
            t_item["no"],
            t_item["id_gestion"],
            t_item["nivel_2"],
            t_item["nivel_3"],
            t_item["titulo_excel"],
            t_item["tipologia_excel"],
            t_item["interaccion_excel"],
            "True" if t_item["lenguaje_claro"] else "False",
            t_item["observacion_excel"],
            t_item["url"],
            t_item["url_base"],
            t_item["slug_destino"],
            t_item["arquetipo_maestro"],
            t_item["ola"],
            str(t_item["http_status"]),
        ]
        for t_item in trazabilidad
    ]
    populate_table_sheet(ws_tr, tr_headers, tr_rows, [10, 8, 16, 30, 32, 48, 28, 28, 14, 34, 52, 46, 34, 16, 10, 12])

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    wb.save(OUT_XLSX)
    print(f"[XLSX] Libro maestro guardado en {OUT_XLSX.relative_to(BASE_DIR).as_posix()}")


def write_summary_markdown(payload: dict[str, Any]) -> None:
    meta = payload["metadata"]
    urls = payload["urls_unicas"]
    colisiones = payload["colisiones_tipologia"]

    lines: list[str] = [
        "# Resumen del Inventario Deduplicado — Comercio Exterior (Portal SAT)",
        "",
        f"- **Fuente oficial (solo lectura):** `{meta['fuente']}` (hoja `{meta['hoja']}`)",
        f"- **Fecha de generación:** `{meta['generated_at']}`",
        "",
        "## 1. Cuadre Matemático de Deduplicación",
        "",
        "| Métrica | Cantidad | Verificación |",
        "| :--- | :---: | :--- |",
        f"| Filas totales en hoja origen | **{meta['total_filas_origen']}** | 100% mapeadas en `Trazabilidad (197)` |",
        f"| Destinos URL únicos (incluyendo `#ancla`) | **{meta['total_urls_unicas']}** | Suma de `row_count` = **{sum(u['row_count'] for u in urls)}** |",
        f"| URLs base únicas (verificadas por HTTP) | **{meta['total_urls_base_unicas']}** | Sin fragmento `#` |",
        f"| Destinos con fragmento `#ancla` | **{meta['total_anclas']}** | Incluye bloques internos de mega-páginas |",
        f"| Colisiones de tipología resueltas | **{meta['total_colisiones_tipologia']}** | 1 arquetipo maestro único por URL |",
        f"| URLs accionables (`OLA-1` a `OLA-4`) | **{meta['total_urls_accionables']}** | Descuenta `PAUSA` ({meta['resumen_olas'].get('PAUSA', 0)}) |",
        f"| URLs únicas con maquila completada | **{meta.get('total_urls_maquiladas', 0)} / {meta['total_urls_unicas']}** | Pares `_wpbakery.txt` + `_custom.css` detectados |",
        "",
        "## 2. Distribución por Ola de Producción",
        "",
        "| Ola | URLs Únicas | Filas Consolidadas | Criterio |",
        "| :--- | :---: | :---: | :--- |",
    ]

    ola_criteria = {
        "PAUSA": "100% de filas asociadas con `Lenguaje Claro = True` y `Observaciones` vacía",
        "OLA-1": "URLs con observaciones explícitas en la fuente (casos FEL, `#ancla`, migración pendiente)",
        "OLA-2": "Pendientes de arquetipos `TIPO-2`, `TIPO-4`, `TIPO-5` y `TIPO-6`",
        "OLA-3": "Pendientes `TIPO-1` de `Importadores` y `Operador Económico Autorizado (OEA)`",
        "OLA-4": "Resto de pendientes `TIPO-1` (`AFPA`, `Exportadores`, `Regímenes Territoriales y Zonas Especiales`)",
    }
    for ola in WAVE_ORDER:
        sub = [u for u in urls if u["ola"] == ola]
        lines.append(f"| **{ola}** | {len(sub)} | {sum(u['row_count'] for u in sub)} | {ola_criteria[ola]} |")

    lines.extend([
        "",
        "## 3. Distribución por Arquetipo Maestro (`TIPO-1` a `TIPO-6`)",
        "",
        "| Arquetipo | Descripción | URLs Únicas | Filas Consolidadas |",
        "| :--- | :--- | :---: | :---: |",
    ])
    for arq in ARCHETYPE_ORDER:
        sub = [u for u in urls if u["arquetipo_maestro"] == arq]
        lines.append(f"| **{arq}** | {ARCHETYPE_LABELS[arq]} | {len(sub)} | {sum(u['row_count'] for u in sub)} |")

    lines.extend([
        "",
        "## 4. Hallazgos de Verificación HTTP en Vivo",
        "",
        "| Estado HTTP | URLs Únicas | URLs Base Únicas |",
        "| :--- | :---: | :---: |",
    ])
    http_counts = Counter(str(u["http_status"]) for u in urls)
    base_by_status: dict[str, set[str]] = defaultdict(set)
    for u in urls:
        base_by_status[str(u["http_status"])].add(u["url_base"])
    for st, cnt in sorted(http_counts.items()):
        lines.append(f"| `{st}` | {cnt} | {len(base_by_status[st])} |")

    non_200 = [u for u in urls if str(u["http_status"]) != "200" or u.get("http_error")]
    if non_200:
        lines.extend([
            "",
            "### URLs con estado distinto de `200` o advertencia de redirección",
            "",
            "| Slug | Ola | Estado HTTP | URL Base | Detalle |",
            "| :--- | :--- | :---: | :--- | :--- |",
        ])
        for u in non_200:
            lines.append(f"| `{u['slug']}` | {u['ola']} | `{u['http_status']}` | {u['url_base']} | {u.get('http_error') or 'Redirección / revisión requerida'} |")

    lines.extend([
        "",
        f"## 5. Colisiones de Tipología Consolidadas ({len(colisiones)})",
        "",
        "| Slug | Filas | Arquetipo Asignado | Tipologías Observadas |",
        "| :--- | :---: | :---: | :--- |",
    ])
    for c in colisiones:
        raw_tips = ", ".join(f"`{t}`" for t in c["tipologias_observadas"])
        lines.append(f"| `{c['slug']}` | {c['row_count']} | **{c['arquetipo_maestro']}** | {raw_tips} |")

    lines.extend([
        "",
        f"## 6. Destinos con Fragmento `#ancla` ({meta['total_anclas']})",
        "",
        "| Slug | Ola | Arquetipo | URL Destino |",
        "| :--- | :--- | :---: | :--- |",
    ])
    for u in urls:
        if u["es_ancla"]:
            lines.append(f"| `{u['slug']}` | {u['ola']} | {u['arquetipo_maestro']} | {u['url']} |")

    total_maquiladas = meta.get("total_urls_maquiladas", 0)
    resumen_estados = meta.get("resumen_estados_maquila", {})
    subpaginas_derivadas = meta.get("subpaginas_derivadas_maquiladas", [])

    lines.extend([
        "",
        "## 7. Avance de Maquila Sincronizado",
        "",
        f"- **URLs únicas de la matriz con maquila completada:** `{total_maquiladas}` / `{meta['total_urls_unicas']}`",
        f"- **Subpáginas derivadas detectadas en lotes compilados:** `{len(subpaginas_derivadas)}`",
        "",
        "| Estado Maquila | URLs Únicas |",
        "| :--- | :---: |",
    ])
    for estado, cnt in sorted(resumen_estados.items()):
        lines.append(f"| {estado} | {cnt} |")

    if subpaginas_derivadas:
        lines.extend([
            "",
            "### Subpáginas derivadas detectadas",
            "",
        ])
        for sub_slug in subpaginas_derivadas:
            lines.append(f"- `{sub_slug}`")

    OUT_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"[MD] Resumen generado en {OUT_MD.relative_to(BASE_DIR).as_posix()}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Construye inventario deduplicado y verificación HTTP de Comercio Exterior.")
    parser.add_argument("--use-cache", action="store_true", help="Reutiliza http_cache_ce.json si contiene todas las URLs base.")
    parser.add_argument("--workers", type=int, default=3, help="Concurrencia HTTP (por defecto 3).")
    parser.add_argument("--timeout", type=int, default=15, help="Timeout HTTP en segundos (por defecto 15).")
    args = parser.parse_args()

    if not SOURCE_XLSX.exists():
        raise FileNotFoundError(f"No se encontró el archivo fuente: {SOURCE_XLSX}")

    wb = openpyxl.load_workbook(SOURCE_XLSX, read_only=True, data_only=True)
    if SOURCE_SHEET not in wb.sheetnames:
        raise ValueError(f"La hoja '{SOURCE_SHEET}' no existe en {SOURCE_XLSX.name}")
    ws = wb[SOURCE_SHEET]
    raw_rows = list(ws.iter_rows(values_only=True))[1:]
    wb.close()

    if len(raw_rows) != 197:
        raise RuntimeError(f"Se esperaban 197 filas de datos en '{SOURCE_SHEET}', se leyeron {len(raw_rows)}")

    parsed_rows: list[dict[str, Any]] = []
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    urls_ordered: list[str] = []

    for excel_row_idx, row in enumerate(raw_rows, start=2):
        url = clean_cell(row[21])
        if not url:
            raise ValueError(f"Fila {excel_row_idx} sin URL Portal SAT")

        rec = {
            "fila_excel": excel_row_idx,
            "no": row[0],
            "id_gestion": clean_cell(row[1]),
            "nivel_2": clean_cell(row[5]),
            "nivel_3": clean_cell(row[6]),
            "titulo_excel": clean_cell(row[12]),
            "interaccion_excel": clean_cell(row[15]),
            "tipologia_excel": clean_cell(row[16]),
            "descripcion_excel": clean_cell(row[18]),
            "base_legal": clean_cell(row[19]),
            "url": url,
            "observacion_excel": clean_cell(row[22]),
            "lenguaje_claro": bool(row[23] is True),
            "nota_extra_col24": clean_cell(row[24]) if len(row) > 24 else "",
        }
        parsed_rows.append(rec)
        if url not in groups:
            urls_ordered.append(url)
        groups[url].append(rec)

    if len(urls_ordered) != 120:
        raise RuntimeError(f"Se esperaban 120 URLs únicas, se encontraron {len(urls_ordered)}")

    slugs_by_url = build_deterministic_slugs(urls_ordered, groups)
    base_urls_ordered: list[str] = []
    base_seen: set[str] = set()
    for u in urls_ordered:
        ub = u.split("#", 1)[0]
        if ub not in base_seen:
            base_seen.add(ub)
            base_urls_ordered.append(ub)

    http_results = run_http_verification(
        base_urls_ordered,
        use_cache=args.use_cache,
        workers=args.workers,
        timeout=args.timeout,
    )

    compiled_slugs = scan_compiled_maquila_slugs()

    urls_unicas: list[dict[str, Any]] = []
    colisiones_tipologia: list[dict[str, Any]] = []
    url_meta_lookup: dict[str, dict[str, Any]] = {}

    for url in urls_ordered:
        rs = groups[url]
        url_base = url.split("#", 1)[0]
        es_ancla = "#" in url
        ancla_fragmento = url.split("#", 1)[1] if es_ancla else ""

        ids_sat_ges = list(dict.fromkeys(r["id_gestion"] for r in rs if r["id_gestion"]))
        niveles_2 = sorted({r["nivel_2"] for r in rs if r["nivel_2"] and r["nivel_2"] != "—"})
        niveles_3 = sorted({r["nivel_3"] for r in rs if r["nivel_3"] and r["nivel_3"] != "—"})
        titulos_excel = list(dict.fromkeys(r["titulo_excel"] for r in rs if r["titulo_excel"]))
        descripciones_excel = list(dict.fromkeys(r["descripcion_excel"] for r in rs if r["descripcion_excel"]))
        bases_legales = list(dict.fromkeys(r["base_legal"] for r in rs if r["base_legal"] and r["base_legal"] != "N/A"))
        tipologias_observadas = sorted({r["tipologia_excel"] for r in rs if r["tipologia_excel"]})
        tipos_interaccion = sorted({r["interaccion_excel"] for r in rs if r["interaccion_excel"]})
        observaciones = list(dict.fromkeys(r["observacion_excel"] for r in rs if r["observacion_excel"]))
        notas_extra = list(dict.fromkeys(r["nota_extra_col24"] for r in rs if r["nota_extra_col24"]))

        lc_true_count = sum(1 for r in rs if r["lenguaje_claro"])
        lc_false_count = sum(1 for r in rs if not r["lenguaje_claro"])
        colision = len(tipologias_observadas) > 1

        arquetipo, criterio = resolve_archetype(
            url=url,
            url_base=url_base,
            es_ancla=es_ancla,
            tipologias=tipologias_observadas,
            interacciones=tipos_interaccion,
            observaciones=observaciones,
        )
        ola = assign_wave(arquetipo, niveles_2, lc_false_count, observaciones)
        http_info = http_results[url_base]
        slug = slugs_by_url[url]
        estado_maquila = (
            f"Maquilado ({compiled_slugs[slug]})"
            if slug in compiled_slugs
            else ("Pausa (LC=True)" if ola == "PAUSA" else "No iniciado")
        )

        item = {
            "slug": slug,
            "url": url,
            "url_base": url_base,
            "es_ancla": es_ancla,
            "ancla_fragmento": ancla_fragmento,
            "row_count": len(rs),
            "ids_sat_ges": ids_sat_ges,
            "niveles_2": niveles_2,
            "niveles_3": niveles_3,
            "titulos_excel": titulos_excel,
            "descripciones_excel": descripciones_excel,
            "bases_legales": bases_legales,
            "tipologias_observadas": tipologias_observadas,
            "tipos_interaccion": tipos_interaccion,
            "observaciones": observaciones,
            "notas_extra_col24": notas_extra,
            "lc_true_count": lc_true_count,
            "lc_false_count": lc_false_count,
            "colision_tipologia": colision,
            "arquetipo_maestro": arquetipo,
            "criterio_arquetipo": criterio,
            "ola": ola,
            "estado_maquila": estado_maquila,
            "http_status": http_info["http_status"],
            "final_url": http_info["final_url"],
            "content_type": http_info["content_type"],
            "page_title": http_info["page_title"],
            "http_error": http_info["http_error"],
        }
        urls_unicas.append(item)
        url_meta_lookup[url] = item

        if colision:
            colisiones_tipologia.append({
                "slug": slug,
                "url": url,
                "row_count": len(rs),
                "ids_sat_ges": ids_sat_ges,
                "tipologias_observadas": tipologias_observadas,
                "tipos_interaccion": tipos_interaccion,
                "arquetipo_maestro": arquetipo,
                "criterio_resolucion": criterio,
            })

    total_row_sum = sum(u["row_count"] for u in urls_unicas)
    if total_row_sum != 197:
        raise RuntimeError(f"Error de cuadre: sum(row_count)={total_row_sum} != 197")

    trazabilidad_filas = []
    for r in parsed_rows:
        u_meta = url_meta_lookup[r["url"]]
        trazabilidad_filas.append({
            "fila_excel": r["fila_excel"],
            "no": r["no"],
            "id_gestion": r["id_gestion"],
            "nivel_2": r["nivel_2"],
            "nivel_3": r["nivel_3"],
            "titulo_excel": r["titulo_excel"],
            "tipologia_excel": r["tipologia_excel"],
            "interaccion_excel": r["interaccion_excel"],
            "lenguaje_claro": r["lenguaje_claro"],
            "observacion_excel": r["observacion_excel"],
            "url": r["url"],
            "url_base": u_meta["url_base"],
            "slug_destino": u_meta["slug"],
            "arquetipo_maestro": u_meta["arquetipo_maestro"],
            "ola": u_meta["ola"],
            "http_status": u_meta["http_status"],
        })

    resumen_olas = dict(Counter(u["ola"] for u in urls_unicas))
    resumen_arquetipos = dict(Counter(u["arquetipo_maestro"] for u in urls_unicas))
    matriz_slugs = {u["slug"] for u in urls_unicas}
    maquiladas_en_matriz = sum(1 for u in urls_unicas if u["slug"] in compiled_slugs)
    subpaginas_derivadas = sorted(s for s in compiled_slugs if s not in matriz_slugs)
    resumen_estados_maquila = dict(Counter(u["estado_maquila"] for u in urls_unicas))

    payload = {
        "metadata": {
            "fuente": SOURCE_XLSX.relative_to(BASE_DIR).as_posix(),
            "hoja": SOURCE_SHEET,
            "total_filas_origen": len(parsed_rows),
            "total_urls_unicas": len(urls_unicas),
            "total_urls_base_unicas": len(base_urls_ordered),
            "total_anclas": sum(1 for u in urls_unicas if u["es_ancla"]),
            "total_colisiones_tipologia": len(colisiones_tipologia),
            "total_urls_accionables": sum(1 for u in urls_unicas if u["ola"] != "PAUSA"),
            "total_urls_maquiladas": maquiladas_en_matriz,
            "subpaginas_derivadas_maquiladas": subpaginas_derivadas,
            "resumen_estados_maquila": resumen_estados_maquila,
            "resumen_olas": {k: resumen_olas.get(k, 0) for k in WAVE_ORDER},
            "resumen_arquetipos": {k: resumen_arquetipos.get(k, 0) for k in ARCHETYPE_ORDER},
            "generated_at": datetime.now(timezone.utc).isoformat(),
        },
        "urls_unicas": urls_unicas,
        "colisiones_tipologia": colisiones_tipologia,
        "trazabilidad_filas": trazabilidad_filas,
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[JSON] Inventario guardado en {OUT_JSON.relative_to(BASE_DIR).as_posix()}")

    write_excel_workbook(payload)
    write_summary_markdown(payload)

    print(
        f"[OK] Inventario CE completo: {len(parsed_rows)} filas -> {len(urls_unicas)} URLs únicas "
        f"({len(base_urls_ordered)} base, {payload['metadata']['total_anclas']} #anclas, "
        f"{len(colisiones_tipologia)} colisiones). Olas: {payload['metadata']['resumen_olas']}"
    )


if __name__ == "__main__":
    main()
