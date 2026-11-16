#!/usr/bin/env python3
"""
scripts/extract_sat_page_content.py
===================================
Extractor reutilizable de contenido real en vivo (HTML + WP File Download +
paneles de acordeon WPBakery + Google Sites) para la maquila de paginas SAT.

Garantiza:
- Cero invencion: extrae textos, encabezados, tablas, preguntas/respuestas,
  embeds y enlaces literales tal como existen en la fuente viva.
- Decodificacion automatica de correos ofuscados por Cloudflare
  (`<span class="__cf_email__" data-cfemail="...">` y `/cdn-cgi/l/email-protection`).
- Aislamiento estricto por fragmento `#ancla` en mega-paginas WPBakery.
- Paginacion completa via AJAX para bibliotecas WP File Download (WPFD).

Uso:
  python scripts/extract_sat_page_content.py --lote ola-1a
  python scripts/extract_sat_page_content.py --lote ola-1a --cache-dir <dir_html>
"""

from __future__ import annotations

import argparse
import html as html_lib
import io
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, unquote, urljoin, urlparse

import requests
from bs4 import BeautifulSoup, NavigableString, Tag

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover
    PdfReader = None  # type: ignore[assignment]

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
MATRIZ_PATH = BASE_DIR / "docs" / "maquila-paginas" / "01-inventario" / "matriz_maquila_ce.json"
DEFAULT_OUTPUT_1A = BASE_DIR / "docs" / "maquila-paginas" / "lotes" / "ola-1" / "fuentes_extraidas_1a.json"
DEFAULT_OUTPUT_1B = BASE_DIR / "docs" / "maquila-paginas" / "lotes" / "ola-1" / "fuentes_extraidas_1b.json"
DEFAULT_OUTPUT_2A = BASE_DIR / "docs" / "maquila-paginas" / "lotes" / "ola-2" / "fuentes_extraidas_2a.json"

DEFAULT_OUTPUT_BY_LOTE = {
    "ola-1a": DEFAULT_OUTPUT_1A,
    "ola-1b": DEFAULT_OUTPUT_1B,
    "ola-2a": DEFAULT_OUTPUT_2A,
}

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)

OLA_1A_SLUGS = [
    "pacto-de-integridad-del-serv-aduanero",
    "curso-10-consecuencias-de-la-defraudacion-y",
    "temas-aduaneros",
    "legislacion-aduanera",
    "procedimientos-aduanas--manual-operativo-aduana-sin",
    "procedimientos-aduanas--manuales-guias-normativas",
    "procedimientos-aduanas--carne-auxiliares-funcion",
    "procedimientos-aduanas--administrativos-aduanas",
    "procedimientos-aduanas--instructivos-manuales-guias",
]

OLA_1B_SLUGS = [
    "programa-miad",
    "programa-miad-componente-procesos",
    "declaracion-jurada-regional-de-viajero",
    "solvencia-fiscal",
    "consulta-movimiento-convenio",
]

OLA_2A_SLUGS = [
    "curso-aduanas",
    "curso-26-factura-y-declaracion-unica-centroamericana",
    "curso-declaracion-unica-centroamericana-duca",
    "acuerdo-de-directorio-numero-23-2024-que",
    "tabla-de-valores-imponibles-del-impuesto-al",
    "componente-activex-pki-dua",
    "puestos-de-control-interinstitucional-pci",
    "tablas-y-acuerdos-vehiculos",
    "documentos-manifiesto",
    "mensaje-carga-aduanera-cuscar",
    "marchamo-electronico",
    "temas-aduaneros--preguntas-frecuentes",
    "procedimientos-aduanas--obligaciones-decreto-29-89",
]

CACHE_MAP_1A = {
    "https://portal.sat.gob.gt/portal/wpfd_file/pacto-de-integridad-del-serv-aduanero/": "pacto.html",
    "https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat/aduanas/10-consecuencias-de-la-defraudaci%C3%B3n-y-contrabando-aduanero": "curso10.html",
    "https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-aduaneros/": "faq_aduaneros.html",
    "https://portal.sat.gob.gt/portal/biblioteca-en-linea-sat/legislacion-aduanera/": "legislacion.html",
    "https://portal.sat.gob.gt/portal/procedimientos-aduanas/": "procedimientos.html",
}

CACHE_MAP_1B = {
    "https://portal.sat.gob.gt/portal/programa-miad/": "programa-miad.html",
    "https://portal.sat.gob.gt/portal/programa-miad/componente-procesos/": "programa-miad-componente-procesos.html",
    "https://portal.sat.gob.gt/portal/declaracion-jurada-regional-de-viajero/": "declaracion-jurada-regional-de-viajero.html",
    "https://portal.sat.gob.gt/portal/solvencia-fiscal/": "solvencia-fiscal.html",
    "https://portal.sat.gob.gt/portal/consulta-movimiento-convenio/": "consulta-movimiento-convenio.html",
}

CACHE_MAP_ALL = {**CACHE_MAP_1A, **CACHE_MAP_1B}


def decode_cfemail(hex_str: str) -> str:
    cleaned = hex_str.strip()
    if "#" in cleaned:
        cleaned = cleaned.split("#")[-1]
    if not cleaned or len(cleaned) < 4:
        return ""
    key = int(cleaned[:2], 16)
    return "".join(chr(int(cleaned[i : i + 2], 16) ^ key) for i in range(2, len(cleaned), 2))


def clean_text(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "").replace("\xa0", " ")).strip()


def format_bytes(num_bytes: int | str) -> str:
    try:
        size = float(num_bytes)
    except (TypeError, ValueError):
        return str(num_bytes or "")
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            if unit == "B":
                return f"{int(size)} {unit}"
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} GB"


def decode_cloudflare_emails_in_soup(node: Tag) -> list[str]:
    decoded_found: list[str] = []

    for a in list(node.find_all("a", href=True)):
        href = str(a.get("href") or "")
        span = a.select_one("[data-cfemail]")
        if "/cdn-cgi/l/email-protection" in href or span is not None:
            hex_val = ""
            if "#" in href and "/cdn-cgi/l/email-protection" in href:
                hex_val = href.split("#", 1)[1]
            elif span is not None:
                hex_val = str(span.get("data-cfemail") or "")
            email = decode_cfemail(hex_val)
            if email:
                decoded_found.append(email)
                a["href"] = f"mailto:{email}"
                a.clear()
                a.string = email
                for attr in list(a.attrs):
                    if attr != "href":
                        del a[attr]

    for el in list(node.select("[data-cfemail]")):
        email = decode_cfemail(str(el.get("data-cfemail") or ""))
        if email:
            decoded_found.append(email)
            el.replace_with(NavigableString(email))

    return decoded_found


def fetch_html(
    url: str,
    session: requests.Session,
    cache_dir: Path | None = None,
) -> tuple[str, int, str]:
    if cache_dir is not None and url in CACHE_MAP_ALL:
        cached = cache_dir / CACHE_MAP_ALL[url]
        if cached.exists():
            return cached.read_text(encoding="utf-8"), 200, f"cache:{cached.name}"

    resp = session.get(url, timeout=30, allow_redirects=True)
    resp.raise_for_status()
    resp.encoding = resp.apparent_encoding or resp.encoding or "utf-8"
    return resp.text, resp.status_code, resp.url


def normalize_href(href: str, base_url: str) -> str:
    raw = str(href or "").strip()
    if not raw:
        return ""
    if raw.startswith("tel://"):
        return "tel:" + raw[len("tel://") :]
    if "google.com/url?" in raw:
        qs = parse_qs(urlparse(raw).query)
        if qs.get("q"):
            raw = qs["q"][0].strip()
    if raw.startswith(("http://", "https://", "mailto:", "tel:", "#")):
        return raw
    return urljoin(base_url, raw)


def sanitize_fragment_html(container: Tag, base_url: str) -> tuple[str, list[dict[str, str]]]:
    """Limpia HTML de respuesta conservando etiquetas semanticas seguras y enlaces reales."""
    frag = BeautifulSoup(str(container), "lxml")
    decode_cloudflare_emails_in_soup(frag)
    root = frag.body or frag

    links_collected: list[dict[str, str]] = []
    allowed_tags = {"p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"}

    for bad in root.find_all(["script", "style", "noscript", "iframe"]):
        bad.decompose()

    # Escapar corchetes en texto visible para no confundir parser de shortcodes WPBakery
    for txt_node in list(root.find_all(string=True)):
        if "[" in txt_node or "]" in txt_node:
            txt_node.replace_with(
                NavigableString(str(txt_node).replace("[", "(").replace("]", ")"))
            )

    for tag in list(root.find_all(True)):
        if tag.name in ("html", "body"):
            continue
        if tag.name == "a":
            href = normalize_href(tag.get("href", ""), base_url)
            link_text = clean_text(tag.get_text(" ", strip=True))
            if not href or href.startswith("#"):
                tag.unwrap()
                continue
            tag.attrs = {"href": href}
            if href.startswith("http"):
                tag["target"] = "_blank"
                tag["rel"] = "noopener noreferrer"
            links_collected.append({"texto": link_text or href, "url": href})
        elif tag.name in allowed_tags:
            tag.attrs = {}
        else:
            tag.unwrap()

    inner = "".join(str(ch) for ch in root.contents)
    inner = re.sub(r"\s+", " ", inner).strip()
    # Normalizar saltos de etiqueta para que queden compactos en una linea
    inner = re.sub(r">\s+<", "><", inner)
    # Limpiar parrafos vacios
    inner = re.sub(r"<p>\s*(?:&nbsp;|\xa0)?\s*</p>", "", inner)
    return inner, links_collected


def extract_pacto_wpfd(html_text: str, base_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html_text, "lxml")
    entry = soup.find("div", class_="wpfd-single-file") or soup.find("div", class_="entry-content") or soup.body
    decode_cloudflare_emails_in_soup(entry)

    title_el = entry.select_one(".wpfd-file-content--title") or entry.find(["h1", "h2", "h3"])
    title = clean_text(title_el.get_text(" ", strip=True)) if title_el else ""
    meta_el = entry.select_one(".wpfd-file-content--meta")
    meta_text = clean_text(meta_el.get_text(" ", strip=True)) if meta_el else ""

    links: list[dict[str, str]] = []
    seen_urls: set[str] = set()
    download_url = ""
    preview_url = ""
    for a in entry.find_all("a", href=True):
        href = normalize_href(a["href"], base_url)
        txt = clean_text(a.get_text(" ", strip=True))
        if not href or href.startswith("#"):
            continue
        if "preview=1" in href and not preview_url:
            preview_url = href
        elif "/portal/descarga/" in href and not download_url:
            download_url = href
        if href not in seen_urls:
            seen_urls.add(href)
            links.append({"texto": txt or title or href, "url": href})

    return {
        "tipo_fuente": "wpfd_single_file",
        "titulo_fuente": title,
        "metadatos_texto": meta_text,
        "url_descarga": download_url,
        "url_vista_previa": preview_url,
        "links_planos": links,
    }


def extract_google_site_course(html_text: str, base_url: str) -> dict[str, Any]:
    """Extrae fichas, modulos, videos YouTube y enlaces reales de Google Sites SAT."""
    soup = BeautifulSoup(html_text, "lxml")
    for bad in soup(["script", "style", "header", "nav"]):
        bad.decompose()

    main = soup.find(attrs={"role": "main"}) or soup.body
    heading_el = main.find(["h1", "h2"]) if main else None
    titulo = clean_text(heading_el.get_text(" ", strip=True)) if heading_el else ""

    body_lines: list[str] = []
    search_root = soup.body or soup
    for el in search_root.find_all(["h2", "h3", "p", "li"]):
        if el.name == "p" and el.parent and el.parent.name == "li":
            continue
        txt = clean_text(el.get_text(" ", strip=True))
        if txt and txt not in body_lines:
            body_lines.append(txt)

    secciones: list[dict[str, Any]] = []
    for sec in search_root.select("section"):
        sec_txt = clean_text(sec.get_text(" | ", strip=True))
        sec_links: list[dict[str, str]] = []
        for a in sec.find_all("a", href=True):
            href = normalize_href(a["href"], base_url)
            if not href or href.startswith("#"):
                continue
            ltxt = clean_text(a.get_text(" ", strip=True))
            if not ltxt:
                slug_tail = unquote(urlparse(href).path.rstrip("/").split("/")[-1]).replace("-", " ").strip()
                ltxt = slug_tail or href
            sec_links.append({"texto": ltxt, "url": href})
        if sec_txt or sec_links:
            secciones.append({"texto": sec_txt, "links": sec_links})

    videos = _extract_youtube_videos(soup)
    # Compatibilidad con clave url_watch usada en extract_curso10
    for v in videos:
        v.setdefault("url_watch", v.get("url_watch", ""))

    enlaces_evaluacion: list[dict[str, str]] = []
    enlaces_contenido: list[dict[str, str]] = []
    seen_eval: set[str] = set()
    seen_content: set[str] = set()
    for a in search_root.find_all("a", href=True):
        href = normalize_href(a["href"], base_url)
        if not href or href.startswith("#"):
            continue
        txt = clean_text(a.get_text(" ", strip=True))
        if not txt:
            slug_tail = unquote(urlparse(href).path.rstrip("/").split("/")[-1]).replace("-", " ").strip()
            txt = slug_tail or href
        if any(dom in href for dom in ("cdn.c.sat.gob.gt", "forms.gle", "docs.google.com")):
            if href not in seen_eval:
                seen_eval.add(href)
                enlaces_evaluacion.append({"texto": txt, "url": href})
        elif "capacitacionessat.page" in href and href.rstrip("/") != base_url.rstrip("/"):
            if href not in seen_content:
                seen_content.add(href)
                enlaces_contenido.append({"texto": txt, "url": href})

    links_planos = (
        [{"texto": v["titulo"], "url": v["url_watch"]} for v in videos]
        + enlaces_evaluacion
        + enlaces_contenido
    )
    return {
        "tipo_fuente": "google_sites_curso",
        "titulo_fuente": titulo,
        "lineas_texto": body_lines,
        "secciones": secciones,
        "videos": videos,
        "enlaces_evaluacion": enlaces_evaluacion,
        "enlaces_contenido": enlaces_contenido,
        "links_planos": links_planos,
    }


def extract_curso10_google_site(html_text: str, base_url: str) -> dict[str, Any]:
    return extract_google_site_course(html_text, base_url)


def extract_temas_aduaneros_faqs(html_text: str, base_url: str) -> dict[str, Any]:
    soup = BeautifulSoup(html_text, "lxml")
    entry = soup.find("div", class_="entry-content") or soup.body
    decoded_emails = decode_cloudflare_emails_in_soup(entry)

    h1_el = entry.find("h1")
    titulo_h1 = clean_text(h1_el.get_text(" ", strip=True)) if h1_el else "Temas Aduaneros"

    temas: list[dict[str, Any]] = []
    current_topic: dict[str, Any] | None = None
    all_links: list[dict[str, str]] = []
    seen_links: set[tuple[str, str]] = set()
    total_panels = 0

    for el in entry.find_all(["h2", "div"]):
        if el.name == "h2":
            h2_txt = clean_text(el.get_text(" ", strip=True))
            if not h2_txt or h2_txt.lower() == "preguntas frecuentes":
                continue
            current_topic = {"titulo_h2": h2_txt, "preguntas": []}
            temas.append(current_topic)
        elif el.name == "div" and "vc_tta-panel" in (el.get("class") or []):
            total_panels += 1
            title_el = el.select_one(".vc_tta-panel-title")
            body_el = el.select_one(".vc_tta-panel-body")
            pregunta = clean_text(title_el.get_text(" ", strip=True)) if title_el else ""
            # Buscar dentro de .wpb_wrapper si existe para evitar envoltorios redundantes
            wrapper = body_el.select_one(".wpb_text_column .wpb_wrapper") if body_el else None
            content_node = wrapper or body_el
            respuesta_html, q_links = sanitize_fragment_html(content_node, base_url) if content_node else ("", [])
            if current_topic is None:
                current_topic = {"titulo_h2": "Preguntas Generales", "preguntas": []}
                temas.append(current_topic)
            current_topic["preguntas"].append({
                "panel_id": str(el.get("id") or ""),
                "pregunta": pregunta,
                "respuesta_html": respuesta_html,
                "links": q_links,
            })
            for lnk in q_links:
                key = (lnk["texto"], lnk["url"])
                if key not in seen_links:
                    seen_links.add(key)
                    all_links.append(lnk)

    return {
        "tipo_fuente": "wpbakery_faq",
        "titulo_fuente": titulo_h1,
        "correos_cf_decodificados": sorted(set(decoded_emails)),
        "total_temas": len(temas),
        "total_preguntas": total_panels,
        "temas": temas,
        "links_planos": all_links,
    }


def extract_wpfd_ajax_files(
    cat_id: str,
    base_url: str,
    session: requests.Session,
    max_pages: int = 30,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """Obtiene metadatos y listado completo paginado de una categoría WP File Download."""
    parsed_base = urlparse(base_url)
    ajax_url = f"{parsed_base.scheme}://{parsed_base.netloc}/portal/wp-admin/admin-ajax.php"

    all_files: list[dict[str, Any]] = []
    seen_ids: set[Any] = set()
    category_meta: dict[str, Any] = {}

    rc = session.get(
        ajax_url,
        params={
            "juwpfisadmin": "false",
            "action": "wpfd",
            "task": "categories.display",
            "view": "categories",
            "id": cat_id,
        },
        timeout=25,
    )
    if rc.ok:
        cjson = rc.json()
        cat_info = cjson.get("category") or {}
        category_meta = {
            "term_id": cat_info.get("term_id"),
            "name": cat_info.get("name"),
            "reported_count": cat_info.get("count"),
        }

    for page_num in range(1, max_pages + 1):
        rf = session.get(
            ajax_url,
            params={
                "juwpfisadmin": "false",
                "action": "wpfd",
                "task": "files.display",
                "view": "files",
                "id": cat_id,
                "rootcat": cat_id,
                "page": str(page_num),
            },
            timeout=25,
        )
        rf.raise_for_status()
        payload = rf.json()
        files = payload.get("files") or []
        if not files:
            break
        added_this_page = 0
        for f in files:
            fid = f.get("ID")
            if fid in seen_ids:
                continue
            seen_ids.add(fid)
            added_this_page += 1
            title = html_lib.unescape(clean_text(f.get("post_title") or ""))
            ext = clean_text(f.get("ext") or "pdf").lower()
            size_bytes = f.get("size", 0)
            link_dl = str(f.get("linkdownload") or "").strip()
            created = clean_text(f.get("created") or f.get("created_time") or "")
            modified = clean_text(f.get("modified") or f.get("modified_time") or "")
            all_files.append({
                "id": fid,
                "titulo": title,
                "ext": ext,
                "size_bytes": size_bytes,
                "size_human": format_bytes(size_bytes),
                "fecha": created[:10],
                "fecha_actualizado": modified[:10],
                "url": link_dl,
            })
        if added_this_page == 0:
            break

    return category_meta, all_files


def extract_legislacion_wpfd(
    html_text: str,
    base_url: str,
    session: requests.Session,
) -> dict[str, Any]:
    soup = BeautifulSoup(html_text, "lxml")
    entry = soup.find("div", class_="entry-content") or soup.body
    cat_el = entry.select_one("[data-category], [data-sourcecat], [data-catid]")
    cat_id = "1895"
    if cat_el:
        cat_id = str(
            cat_el.get("data-category")
            or cat_el.get("data-sourcecat")
            or cat_el.get("data-catid")
            or "1895"
        )

    category_meta, all_files = extract_wpfd_ajax_files(cat_id, base_url, session)
    links_planos = [{"texto": item["titulo"], "url": item["url"]} for item in all_files if item["url"]]
    return {
        "tipo_fuente": "wpfd_paginated_library",
        "titulo_fuente": "Legislación Aduanera",
        "wpfd_category_id": cat_id,
        "wpfd_meta": category_meta,
        "total_documentos": len(all_files),
        "documentos": all_files,
        "links_planos": links_planos,
    }


def extract_procedimientos_panel(
    soup: BeautifulSoup,
    panel_id: str,
    base_url: str,
) -> dict[str, Any]:
    panel = soup.find(id=panel_id)
    if panel is None:
        raise ValueError(f"No se encontró el panel #{panel_id} en procedimientos-aduanas.")

    # Trabajar sobre copia aislada para no contaminar entre llamadas
    panel_copy = BeautifulSoup(str(panel), "lxml").find(id=panel_id)
    decoded_emails = decode_cloudflare_emails_in_soup(panel_copy)

    heading_el = panel_copy.select_one(".vc_tta-panel-title")
    titulo_acordeon = clean_text(heading_el.get_text(" ", strip=True)) if heading_el else panel_id
    body = panel_copy.select_one(".vc_tta-panel-body") or panel_copy

    bloques: list[dict[str, Any]] = []
    links_planos: list[dict[str, str]] = []
    seen_url_pairs: set[tuple[str, str]] = set()
    sub_titles: list[str] = []

    def register_link(txt: str, href: str) -> None:
        key = (txt, href)
        if key not in seen_url_pairs:
            seen_url_pairs.add(key)
            links_planos.append({"texto": txt, "url": href})

    for tbl in body.find_all("table"):
        sub_title = ""
        toggle_parent = tbl.find_parent(class_="vc_toggle")
        if toggle_parent is not None:
            t_el = toggle_parent.select_one(".vc_toggle_title")
            if t_el is not None:
                sub_title = clean_text(t_el.get_text(" ", strip=True))
        if not sub_title:
            for sib in tbl.previous_siblings:
                if isinstance(sib, Tag):
                    t = clean_text(sib.get_text(" ", strip=True))
                    if t:
                        sub_title = t
                        break
        sub_title = sub_title or titulo_acordeon
        if sub_title not in sub_titles:
            sub_titles.append(sub_title)

        filas_out: list[dict[str, Any]] = []
        for tr in tbl.find_all("tr"):
            row_text = clean_text(tr.get_text(" ", strip=True))
            row_links: list[dict[str, str]] = []
            for a in tr.find_all("a", href=True):
                href = normalize_href(a["href"], base_url)
                ltxt = clean_text(a.get_text(" ", strip=True)) or row_text
                if href and not href.startswith("#"):
                    row_links.append({"texto": ltxt, "url": href})
                    register_link(ltxt, href)
            if row_text or row_links:
                filas_out.append({"texto": row_text, "links": row_links})
        bloques.append({"subtitulo": sub_title, "filas": filas_out})

    # Respaldo para enlaces fuera de tablas dentro del mismo panel
    for a in body.find_all("a", href=True):
        if a.find_parent("table") is not None:
            continue
        href = normalize_href(a["href"], base_url)
        ltxt = clean_text(a.get_text(" ", strip=True)) or href
        if href and not href.startswith("#"):
            register_link(ltxt, href)

    return {
        "tipo_fuente": "wpbakery_accordion_panel",
        "panel_id": panel_id,
        "titulo_fuente": titulo_acordeon,
        "correos_cf_decodificados": sorted(set(decoded_emails)),
        "subtitulos_detectados": sub_titles,
        "total_bloques_tabla": len(bloques),
        "bloques": bloques,
        "total_links": len(links_planos),
        "links_planos": links_planos,
    }


def extract_pdf_direct_info(url: str, session: requests.Session) -> tuple[dict[str, Any], int, str]:
    """Descarga un PDF directo y extrae metadatos reales verificables sin inventar texto."""
    resp = session.get(url, timeout=40, allow_redirects=True)
    resp.raise_for_status()
    raw_bytes = resp.content
    num_pages = 0
    pdf_meta: dict[str, str] = {}
    sample_text = ""
    if PdfReader is not None and raw_bytes.startswith(b"%PDF"):
        reader = PdfReader(io.BytesIO(raw_bytes))
        num_pages = len(reader.pages)
        pdf_meta = {
            str(k).lstrip("/"): clean_text(str(v))
            for k, v in (reader.metadata or {}).items()
            if v is not None
        }
        chunks: list[str] = []
        for pg in reader.pages[:2]:
            t = clean_text(pg.extract_text() or "")
            if t:
                chunks.append(t)
        sample_text = " ".join(chunks)[:1200]

    file_name = unquote(Path(urlparse(resp.url).path).name)
    fuente = {
        "tipo_fuente": "pdf_directo",
        "titulo_fuente": file_name,
        "content_type": clean_text(resp.headers.get("Content-Type") or ""),
        "last_modified": clean_text(resp.headers.get("Last-Modified") or ""),
        "size_bytes": len(raw_bytes),
        "size_human": format_bytes(len(raw_bytes)),
        "num_pages": num_pages,
        "es_pdf_escaneado": not bool(sample_text),
        "pdf_metadata": pdf_meta,
        "texto_muestra": sample_text,
        "links_planos": [{"texto": file_name, "url": url}],
    }
    return fuente, resp.status_code, resp.url


def extract_temas_aduaneros_section_by_panel(
    html_text: str,
    panel_id: str,
    base_url: str,
) -> dict[str, Any]:
    """Aísla únicamente el bloque acordeón al que pertenece `panel_id` en Temas Aduaneros."""
    soup = BeautifulSoup(html_text, "lxml")
    entry = soup.find("div", class_="entry-content") or soup.find("div", id="content") or soup.body
    target_panel = entry.find(id=panel_id)
    if target_panel is None:
        raise ValueError(f"No se encontró el panel #{panel_id} en temas-aduaneros.")

    acc = target_panel.find_parent(class_="vc_tta-accordion")
    prev_h2 = acc.find_previous("h2") if acc else target_panel.find_previous("h2")
    section_title = clean_text(prev_h2.get_text(" ", strip=True)) if prev_h2 else panel_id

    acc_copy = BeautifulSoup(str(acc or target_panel), "lxml")
    decoded_emails = decode_cloudflare_emails_in_soup(acc_copy)

    preguntas: list[dict[str, Any]] = []
    all_links: list[dict[str, str]] = []
    seen_links: set[tuple[str, str]] = set()
    panels = acc_copy.select(".vc_tta-panel") or [acc_copy]

    for el in panels:
        title_el = el.select_one(".vc_tta-panel-title")
        body_el = el.select_one(".vc_tta-panel-body")
        pregunta = clean_text(title_el.get_text(" ", strip=True)) if title_el else ""
        wrapper = body_el.select_one(".wpb_text_column .wpb_wrapper") if body_el else None
        content_node = wrapper or body_el
        respuesta_html, q_links = sanitize_fragment_html(content_node, base_url) if content_node else ("", [])
        preguntas.append({
            "panel_id": str(el.get("id") or ""),
            "pregunta": pregunta,
            "respuesta_html": respuesta_html,
            "links": q_links,
        })
        for lnk in q_links:
            key = (lnk["texto"], lnk["url"])
            if key not in seen_links:
                seen_links.add(key)
                all_links.append(lnk)

    return {
        "tipo_fuente": "wpbakery_faq_section",
        "ancla_objetivo": panel_id,
        "titulo_fuente": section_title,
        "correos_cf_decodificados": sorted(set(decoded_emails)),
        "total_preguntas": len(preguntas),
        "preguntas": preguntas,
        "links_planos": all_links,
    }


def _extract_youtube_videos(node: Tag) -> list[dict[str, str]]:
    videos: list[dict[str, str]] = []
    seen_ids: set[str] = set()
    for ifr in node.find_all("iframe"):
        src = str(ifr.get("data-lazy-src") or ifr.get("src") or "").strip()
        if "youtube.com/embed/" not in src:
            continue
        vid_id = src.split("youtube.com/embed/", 1)[1].split("?", 1)[0].strip("/")
        if not vid_id or vid_id in seen_ids:
            continue
        seen_ids.add(vid_id)
        label = clean_text(ifr.get("title") or ifr.get("aria-label") or "Video oficial SAT")
        videos.append({
            "titulo": label,
            "youtube_id": vid_id,
            "url_watch": f"https://www.youtube.com/watch?v={vid_id}",
            "url_embed": src,
        })
    return videos


def extract_wpbakery_page_content(
    html_text: str,
    base_url: str,
    session: requests.Session | None = None,
) -> dict[str, Any]:
    soup = BeautifulSoup(html_text, "lxml")
    container = soup.find("div", id="content") or soup.find("main") or soup.find("div", class_="entry-content") or soup.body
    root = BeautifulSoup(str(container), "lxml")
    for bad in root.select("header, footer, nav, #wpadminbar, .wf-mobile-header, .bottom-bar, .assistive-info, script, style, noscript"):
        bad.decompose()

    decoded_emails = decode_cloudflare_emails_in_soup(root)

    headings = []
    for h in root.find_all(["h1", "h2", "h3", "h4"]):
        t = clean_text(h.get_text(" ", strip=True))
        if t:
            headings.append({"tag": h.name, "texto": t})

    h1_list = [h["texto"] for h in headings if h["tag"] == "h1"]
    titulo_fuente = " — ".join(h1_list) if h1_list else clean_text(soup.title.get_text(" ", strip=True) if soup.title else "")

    parrafos_intro: list[str] = []
    for p in root.find_all("p"):
        if p.find_parent(class_="vc_tta-panel") or p.find_parent("table") or p.find_parent(class_="aio-icon-box"):
            continue
        t = clean_text(p.get_text(" ", strip=True))
        if t and t not in parrafos_intro:
            parrafos_intro.append(t)

    listas_intro: list[str] = []
    for li in root.find_all("li"):
        if li.find_parent(class_="vc_tta-panel") or li.find_parent("table"):
            continue
        t = clean_text(li.get_text(" ", strip=True))
        if t and t not in listas_intro:
            listas_intro.append(t)

    tarjetas_fuente: list[dict[str, str]] = []
    seen_cards: set[str] = set()
    for box in root.select(".aio-icon-box"):
        a = box.find("a", href=True)
        if a is None:
            continue
        href = normalize_href(a["href"], base_url)
        h_box = box.select_one(".aio-icon-title")
        titulo_card = clean_text(h_box.get_text(" ", strip=True)) if h_box else clean_text(a.get_text(" ", strip=True))
        desc_el = box.select_one(".aio-icon-description")
        desc_card = clean_text(desc_el.get_text(" ", strip=True)) if desc_el else ""
        if href and not href.startswith("#") and href not in seen_cards:
            seen_cards.add(href)
            tarjetas_fuente.append({"titulo": titulo_card, "descripcion": desc_card, "url": href})

    links_planos: list[dict[str, str]] = []
    seen_urls_idx: dict[str, int] = {}

    def register_link(texto: str, url: str) -> None:
        if not url or url.startswith("#"):
            return
        fallback = Path(urlparse(url).path).name or url
        clean_lbl = clean_text(texto) or fallback
        if url not in seen_urls_idx:
            seen_urls_idx[url] = len(links_planos)
            links_planos.append({"texto": clean_lbl, "url": url})
        else:
            existing = links_planos[seen_urls_idx[url]]
            if existing["texto"] in (url, fallback) and clean_lbl not in (url, fallback):
                existing["texto"] = clean_lbl

    tablas_generales: list[dict[str, Any]] = []
    for tbl in root.find_all("table"):
        if tbl.find_parent(class_="vc_tta-panel") is not None:
            continue
        filas_gen: list[dict[str, Any]] = []
        for tr in tbl.find_all("tr"):
            cells = [clean_text(c.get_text(" ", strip=True)) for c in tr.find_all(["th", "td"])]
            row_links: list[dict[str, str]] = []
            for a in tr.find_all("a", href=True):
                href = normalize_href(a["href"], base_url)
                ltxt = clean_text(a.get_text(" ", strip=True)) or clean_text(" ".join(cells)) or href
                if href and not href.startswith("#"):
                    row_links.append({"texto": ltxt, "url": href})
                    register_link(ltxt, href)
            if any(cells) or row_links:
                filas_gen.append({"celdas": cells, "links": row_links})
        if filas_gen:
            tablas_generales.append({"filas": filas_gen})

    acordeones: list[dict[str, Any]] = []
    for panel in root.select(".vc_tta-panel"):
        pid = str(panel.get("id") or "")
        t_el = panel.select_one(".vc_tta-panel-title")
        p_title = clean_text(t_el.get_text(" ", strip=True)) if t_el else pid
        body = panel.select_one(".vc_tta-panel-body") or panel

        tablas_panel: list[dict[str, Any]] = []
        for tbl in body.find_all("table"):
            filas_tbl: list[dict[str, Any]] = []
            for tr in tbl.find_all("tr"):
                cells = [clean_text(c.get_text(" ", strip=True)) for c in tr.find_all(["th", "td"])]
                row_links = []
                for a in tr.find_all("a", href=True):
                    href = normalize_href(a["href"], base_url)
                    ltxt = clean_text(a.get_text(" ", strip=True)) or clean_text(" ".join(cells)) or href
                    if href and not href.startswith("#"):
                        row_links.append({"texto": ltxt, "url": href})
                        register_link(ltxt, href)
                if any(cells) or row_links:
                    filas_tbl.append({"celdas": cells, "links": row_links})
            if filas_tbl:
                tablas_panel.append({"filas": filas_tbl})

        panel_links: list[dict[str, str]] = []
        for a in body.find_all("a", href=True):
            href = normalize_href(a["href"], base_url)
            if not href or href.startswith("#"):
                continue
            ltxt = clean_text(a.get_text(" ", strip=True))
            img = a.find("img")
            img_src = ""
            if img is not None:
                img_src = str(img.get("data-lazy-src") or img.get("data-src") or img.get("src") or "").strip()
                if img_src.startswith("data:"):
                    img_src = ""
            item_link = {"texto": ltxt or Path(urlparse(href).path).name or href, "url": href}
            if img_src:
                item_link["img_src"] = img_src
            panel_links.append(item_link)
            register_link(item_link["texto"], href)

        panel_videos = _extract_youtube_videos(body)
        for v in panel_videos:
            register_link(v["titulo"], v["url_watch"])

        acordeones.append({
            "panel_id": pid,
            "titulo": p_title,
            "tablas": tablas_panel,
            "links": panel_links,
            "videos": panel_videos,
        })

    links_fuera_acordeon: list[dict[str, str]] = []
    for a in root.find_all("a", href=True):
        if a.find_parent(class_="vc_tta-panel"):
            continue
        href = normalize_href(a["href"], base_url)
        if not href or href.startswith("#"):
            continue
        ltxt = clean_text(a.get_text(" ", strip=True))
        img = a.find("img")
        if not ltxt and img is not None:
            ltxt = clean_text(img.get("alt") or "") or Path(urlparse(href).path).name or href
        ltxt = ltxt or href
        links_fuera_acordeon.append({"texto": ltxt, "url": href})
        register_link(ltxt, href)

    all_videos = _extract_youtube_videos(root)
    for v in all_videos:
        register_link(v["titulo"], v["url_watch"])

    iframes_aplicativos: list[dict[str, str]] = []
    seen_ifrs: set[str] = set()
    for ifr in root.find_all("iframe"):
        src = str(ifr.get("data-lazy-src") or ifr.get("src") or "").strip()
        if not src or src == "about:blank" or "youtube.com/embed/" in src or "googletagmanager.com" in src:
            continue
        if src in seen_ifrs:
            continue
        seen_ifrs.add(src)
        lbl = clean_text(ifr.get("title") or ifr.get("aria-label") or "Aplicativo externo SAT")
        iframes_aplicativos.append({"titulo": lbl, "url": src})
        register_link(lbl, src)

    wpfd_archivo_unico: dict[str, str] | None = None
    single_el = root.select_one(".wpfd-single-file")
    if single_el is not None:
        t_single = single_el.select_one(".wpfd-file-content--title, h1, h2, h3")
        m_single = single_el.select_one(".wpfd-file-content--meta")
        wpfd_archivo_unico = {
            "titulo": clean_text(t_single.get_text(" ", strip=True)) if t_single else "",
            "metadatos_texto": clean_text(m_single.get_text(" ", strip=True)) if m_single else "",
        }

    wpfd_bibliotecas: list[dict[str, Any]] = []
    if session is not None:
        seen_cats: set[str] = set()
        for cat_el in root.select("[data-category], [data-sourcecat]"):
            cat_id = str(cat_el.get("data-category") or cat_el.get("data-sourcecat") or "").strip()
            if not cat_id or cat_id in seen_cats:
                continue
            seen_cats.add(cat_id)
            cat_meta, files = extract_wpfd_ajax_files(cat_id, base_url, session)
            wpfd_bibliotecas.append({
                "wpfd_category_id": cat_id,
                "wpfd_meta": cat_meta,
                "total_documentos": len(files),
                "documentos": files,
            })
            for item in files:
                if item.get("url"):
                    register_link(item["titulo"], item["url"])

    out: dict[str, Any] = {
        "tipo_fuente": "wpbakery_page",
        "titulo_fuente": titulo_fuente,
        "headings": headings,
        "correos_cf_decodificados": sorted(set(decoded_emails)),
        "parrafos_intro": parrafos_intro,
        "listas_intro": listas_intro,
        "tarjetas_fuente": tarjetas_fuente,
        "tablas_generales": tablas_generales,
        "acordeones": acordeones,
        "videos": all_videos,
        "iframes_aplicativos": iframes_aplicativos,
        "links_fuera_acordeon": links_fuera_acordeon,
        "links_planos": links_planos,
    }
    if wpfd_archivo_unico is not None:
        out["wpfd_archivo_unico"] = wpfd_archivo_unico
    if wpfd_bibliotecas:
        out["wpfd_bibliotecas"] = wpfd_bibliotecas
    return out


def _build_page_record(
    meta: dict[str, Any],
    status_code: int,
    source_info: str,
    fuente: dict[str, Any],
) -> dict[str, Any]:
    return {
        "slug": meta["slug"],
        "url": meta["url"],
        "url_base": meta["url_base"],
        "ancla_fragmento": meta["ancla_fragmento"],
        "arquetipo_matriz": meta["arquetipo_maestro"],
        "criterio_arquetipo": meta["criterio_arquetipo"],
        "ids_sat_ges": meta["ids_sat_ges"],
        "niveles_2": meta["niveles_2"],
        "niveles_3": meta["niveles_3"],
        "titulos_excel": meta["titulos_excel"],
        "descripciones_excel": meta["descripciones_excel"],
        "bases_legales_excel": meta["bases_legales"],
        "observaciones_excel": meta["observaciones"],
        "notas_extra_col24": meta.get("notas_extra_col24", []),
        "http_status": status_code,
        "origen_extraccion": source_info,
        "fuente_viva": fuente,
    }


def extract_sub_lote_1a(
    output_path: Path,
    cache_dir: Path | None = None,
) -> dict[str, Any]:
    matriz = json.loads(MATRIZ_PATH.read_text(encoding="utf-8"))
    by_slug = {it["slug"]: it for it in matriz["urls_unicas"]}

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    html_cache: dict[str, tuple[str, int, str]] = {}
    base_urls_needed = sorted({by_slug[s]["url_base"] for s in OLA_1A_SLUGS})
    for b_url in base_urls_needed:
        html_cache[b_url] = fetch_html(b_url, session, cache_dir=cache_dir)

    proc_base_url = "https://portal.sat.gob.gt/portal/procedimientos-aduanas/"
    proc_soup = BeautifulSoup(html_cache[proc_base_url][0], "lxml")

    paginas_out: dict[str, Any] = {}
    for slug in OLA_1A_SLUGS:
        meta = by_slug[slug]
        u_base = meta["url_base"]
        raw_html, status_code, source_info = html_cache[u_base]

        if slug == "pacto-de-integridad-del-serv-aduanero":
            fuente = extract_pacto_wpfd(raw_html, u_base)
        elif slug == "curso-10-consecuencias-de-la-defraudacion-y":
            fuente = extract_curso10_google_site(raw_html, u_base)
        elif slug == "temas-aduaneros":
            fuente = extract_temas_aduaneros_faqs(raw_html, u_base)
        elif slug == "legislacion-aduanera":
            fuente = extract_legislacion_wpfd(raw_html, u_base, session)
        elif slug.startswith("procedimientos-aduanas--"):
            panel_id = meta["ancla_fragmento"]
            fuente = extract_procedimientos_panel(proc_soup, panel_id, proc_base_url)
        else:
            raise ValueError(f"Slug no soportado en Sub-lote 1A: {slug}")

        paginas_out[slug] = _build_page_record(meta, status_code, source_info, fuente)

    bundle = {
        "metadata": {
            "lote": "ola-1a",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_paginas": len(paginas_out),
            "urls_base_extraidas": len(base_urls_needed),
            "cache_dir_usado": str(cache_dir) if cache_dir else None,
        },
        "paginas": paginas_out,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding="utf-8")
    return bundle


def extract_sub_lote_1b(
    output_path: Path,
    cache_dir: Path | None = None,
) -> dict[str, Any]:
    matriz = json.loads(MATRIZ_PATH.read_text(encoding="utf-8"))
    by_slug = {it["slug"]: it for it in matriz["urls_unicas"]}

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    base_urls_needed = sorted({by_slug[s]["url_base"] for s in OLA_1B_SLUGS})
    paginas_out: dict[str, Any] = {}
    for slug in OLA_1B_SLUGS:
        meta = by_slug[slug]
        u_base = meta["url_base"]
        raw_html, status_code, source_info = fetch_html(u_base, session, cache_dir=cache_dir)
        fuente = extract_wpbakery_page_content(raw_html, u_base)
        paginas_out[slug] = _build_page_record(meta, status_code, source_info, fuente)

    bundle = {
        "metadata": {
            "lote": "ola-1b",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_paginas": len(paginas_out),
            "urls_base_extraidas": len(base_urls_needed),
            "cache_dir_usado": str(cache_dir) if cache_dir else None,
        },
        "paginas": paginas_out,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding="utf-8")
    return bundle


def extract_sub_lote_2a(
    output_path: Path,
    cache_dir: Path | None = None,
) -> dict[str, Any]:
    """Extrae las 13 URLs de Ola 2 Sub-lote 2A (Google Sites, PDFs, WPBakery, WPFD, anclas)."""
    matriz = json.loads(MATRIZ_PATH.read_text(encoding="utf-8"))
    by_slug = {it["slug"]: it for it in matriz["urls_unicas"]}

    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})

    html_cache: dict[str, tuple[str, int, str]] = {}
    paginas_out: dict[str, Any] = {}

    for slug in OLA_2A_SLUGS:
        meta = by_slug[slug]
        u_base = meta["url_base"]

        if u_base.lower().endswith(".pdf"):
            fuente, status_code, source_info = extract_pdf_direct_info(u_base, session)
        else:
            if u_base not in html_cache:
                html_cache[u_base] = fetch_html(u_base, session, cache_dir=cache_dir)
            raw_html, status_code, source_info = html_cache[u_base]

            if "sites.google.com" in u_base:
                fuente = extract_google_site_course(raw_html, u_base)
            elif slug == "temas-aduaneros--preguntas-frecuentes":
                fuente = extract_temas_aduaneros_section_by_panel(
                    raw_html, meta["ancla_fragmento"], u_base
                )
            elif slug == "procedimientos-aduanas--obligaciones-decreto-29-89":
                proc_soup = BeautifulSoup(raw_html, "lxml")
                fuente = extract_procedimientos_panel(proc_soup, meta["ancla_fragmento"], u_base)
                pdf_docs: list[dict[str, Any]] = []
                for lnk in fuente.get("links_planos", []):
                    pdf_u = lnk.get("url", "")
                    if "/descarga/" in pdf_u:
                        pdf_info, _, _ = extract_pdf_direct_info(pdf_u, session)
                        pdf_docs.append({
                            "titulo_enlace": lnk.get("texto", ""),
                            "url": pdf_u,
                            "size_human": pdf_info["size_human"],
                            "num_pages": pdf_info["num_pages"],
                            "texto_muestra": pdf_info["texto_muestra"],
                        })
                fuente["documentos_pdf"] = pdf_docs
            else:
                fuente = extract_wpbakery_page_content(raw_html, u_base, session=session)

        paginas_out[slug] = _build_page_record(meta, status_code, source_info, fuente)

    base_urls_count = len({by_slug[s]["url_base"] for s in OLA_2A_SLUGS})
    bundle = {
        "metadata": {
            "lote": "ola-2a",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "total_paginas": len(paginas_out),
            "urls_base_extraidas": base_urls_count,
            "cache_dir_usado": str(cache_dir) if cache_dir else None,
        },
        "paginas": paginas_out,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding="utf-8")
    return bundle


def main() -> int:
    parser = argparse.ArgumentParser(description="Extractor de fuentes vivas para maquila SAT CE.")
    parser.add_argument(
        "--lote",
        default="ola-1a",
        choices=["ola-1a", "ola-1b", "ola-2a"],
        help="Sub-lote a extraer.",
    )
    parser.add_argument("--output", default="", help="Ruta JSON de salida opcional.")
    parser.add_argument("--cache-dir", default="", help="Directorio opcional con HTMLs cacheados.")
    args = parser.parse_args()

    cache_path = Path(args.cache_dir) if args.cache_dir else None
    out_path = Path(args.output) if args.output else DEFAULT_OUTPUT_BY_LOTE[args.lote]
    if args.lote == "ola-1a":
        bundle = extract_sub_lote_1a(out_path, cache_dir=cache_path)
    elif args.lote == "ola-1b":
        bundle = extract_sub_lote_1b(out_path, cache_dir=cache_path)
    else:
        bundle = extract_sub_lote_2a(out_path, cache_dir=cache_path)

    print(f"EXTRACCION OK -> {out_path}")
    for slug, info in bundle["paginas"].items():
        fv = info["fuente_viva"]
        links_cnt = len(fv.get("links_planos", []))
        extra = ""
        if "total_preguntas" in fv:
            extra = (
                f" | temas={fv.get('total_temas', 1)} | faqs={fv['total_preguntas']}"
                f" | cf={fv.get('correos_cf_decodificados', [])}"
            )
        elif "total_documentos" in fv:
            extra = f" | wpfd_docs={fv['total_documentos']}"
        elif "num_pages" in fv:
            extra = f" | pdf_pages={fv['num_pages']} | size={fv['size_human']}"
        elif "total_bloques_tabla" in fv:
            extra = f" | bloques={fv['total_bloques_tabla']}"
        elif "acordeones" in fv:
            extra = (
                f" | acordeones={len(fv['acordeones'])} | tablas={len(fv.get('tablas_generales', []))}"
                f" | iframes={len(fv.get('iframes_aplicativos', []))}"
                f" | wpfd_libs={len(fv.get('wpfd_bibliotecas', []))}"
            )
        elif "videos" in fv:
            extra = f" | videos={len(fv['videos'])} | evals={len(fv.get('enlaces_evaluacion', []))}"
        print(f"  - {slug} [{info['arquetipo_matriz']}] links={links_cnt}{extra}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
