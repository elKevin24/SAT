#!/usr/bin/env python3
"""
scripts/generate_maquila_batch.py
=================================
Compilador de lotes de maquila para Comercio Exterior (Portal SAT).

Lee un archivo JSON estructurado con una o más páginas clasificadas en los
6 arquetipos maestros (TIPO-1..TIPO-6), compila shortcodes 100% nativos de
WPBakery + The7 (`0% [vc_raw_html]`), codifica URLs en `link="url:..."`,
valida reglas SAT/ATO/TinyMCE-safe/placeholders y genera:
  - `<slug>_wpbakery.txt`
  - `<slug>_custom.css`

Uso:
  python scripts/generate_maquila_batch.py --dry-run
  python scripts/generate_maquila_batch.py --input lote.json --output-dir docs/maquila-paginas/lotes/ola-1
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import urllib.parse
from pathlib import Path
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = Path(__file__).resolve().parent.parent
TEMPLATES_DIR = BASE_DIR / "docs" / "maquila-paginas" / "00-plantillas-maestras"
BASE_CSS_PATH = TEMPLATES_DIR / "sat-maquila-base.css"
SYNTHETIC_SAMPLE_PATH = TEMPLATES_DIR / "ejemplo_sintetico_6_tipos.json"

VALID_ARCHETYPES = {"TIPO-1", "TIPO-2", "TIPO-3", "TIPO-4", "TIPO-5", "TIPO-6"}


def require_key(data: Any, key: str, slug: str, context: str = "") -> Any:
    """Obtiene una clave obligatoria o lanza ValueError contextualizado por slug."""
    ctx = f" en {context}" if context else ""
    if not isinstance(data, dict):
        raise ValueError(f"[{slug}] Se esperaba objeto dict{ctx}, recibido {type(data).__name__}.")
    val = data.get(key)
    if val is None or (isinstance(val, str) and not val.strip()):
        raise ValueError(f"[{slug}] Falta campo obligatorio '{key}'{ctx}.")
    return val


def esc_attr(text: str) -> str:
    """Escapa texto para atributos de shortcode WPBakery sin romper comillas."""
    cleaned = re.sub(r"\s+", " ", str(text or "")).strip()
    return cleaned.replace('"', "'").replace("[", "(").replace("]", ")")


def esc_html_text(text: str) -> str:
    """Escapa texto dentro de celdas HTML de tabla semántica."""
    return html.escape(str(text or "").strip(), quote=True)


def encode_wpb_link(url: str, external: bool | None = None, slug: str = "", context: str = "") -> str:
    """Codifica una URL en formato WPBakery `url:...` (con target _blank si aplica)."""
    raw = str(url or "").strip()
    if not raw:
        prefix = f"[{slug}] " if slug else ""
        ctx = f" en {context}" if context else ""
        raise ValueError(f"{prefix}URL vacía encontrada al compilar enlace WPBakery{ctx}.")
    encoded = urllib.parse.quote(raw, safe="")
    if external is None:
        external = raw.startswith("http") and "prototipo.sat.gob.gt" not in raw
    if external:
        return f"url:{encoded}||target:%20_blank|"
    return f"url:{encoded}"


def breadcrumb_and_open() -> str:
    return (
        '[vc_row][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"]'
        '[vc_separator][/vc_column][/vc_row][vc_row el_class="sat-mq"][vc_column]'
    )


def header_block(page: dict[str, Any], slug: str) -> str:
    titulo_h1 = require_key(page, "titulo_h1", slug)
    bajada_lead = require_key(page, "bajada_lead", slug)
    return (
        f'[vc_custom_heading text="{esc_attr(titulo_h1)}" font_container="tag:h1|text_align:center" '
        'use_theme_fonts="yes" el_class="sat-mq-h1"]'
        f'[vc_column_text el_class="sat-mq-lead"]{str(bajada_lead).strip()}[/vc_column_text]'
    )


def eyebrow_section(eyebrow: str, h2: str = "", intro: str = "", first_section: bool = True) -> str:
    sec_cls = "sat-mq-eyebrow sat-mq-section" if first_section else "sat-mq-eyebrow"
    out = (
        f'[vc_custom_heading text="{esc_attr(eyebrow)}" font_container="tag:p|text_align:left" '
        f'use_theme_fonts="yes" el_class="{sec_cls}"]'
    )
    if h2:
        out += f'[vc_custom_heading text="{esc_attr(h2)}" use_theme_fonts="yes" el_class="sat-mq-h2"]'
    if intro:
        out += f'[vc_column_text el_class="sat-mq-text"]{intro.strip()}[/vc_column_text]'
    return out


def info_boxes_grid_block(items: list[dict[str, Any]], slug: str, context: str) -> str:
    """Construye grilla de 2 o 3 columnas con tarjetas [bsf-info-box icon_type='none']."""
    if not items:
        return ""
    grid_cls = "sat-mq-boxes-3" if len(items) >= 3 else "sat-mq-boxes-2"
    col_w = "1/3" if len(items) >= 3 else "1/2"
    boxes = []
    for idx, item in enumerate(items, 1):
        item_ctx = f"{context}[{idx}]"
        title = require_key(item, "titulo", slug, item_ctx)
        desc = require_key(item, "descripcion", slug, item_ctx)
        boxes.append(
            f'[vc_column_inner width="{col_w}"]'
            f'[bsf-info-box icon_type="none" title="{esc_attr(title)}"]{str(desc).strip()}[/bsf-info-box]'
            '[/vc_column_inner]'
        )
    return f'[vc_row_inner el_class="{grid_cls}"]{"".join(boxes)}[/vc_row_inner]'


def panel_block(h2_panel: str, intro_panel: str, pasos: list[str]) -> str:
    if not pasos:
        return ""
    lines = []
    for idx, step in enumerate(pasos):
        cls = "sat-mq-step-line sat-mq-step-last" if idx == len(pasos) - 1 else "sat-mq-step-line"
        lines.append(f'[vc_column_text el_class="{cls}"]{str(step).strip()}[/vc_column_text]')
    intro_part = f'[vc_column_text el_class="sat-mq-text"]{intro_panel.strip()}[/vc_column_text]' if intro_panel else ""
    return (
        '[vc_row_inner el_class="sat-mq-panel"][vc_column_inner width="1/1"]'
        f'[vc_custom_heading text="{esc_attr(h2_panel)}" use_theme_fonts="yes" el_class="sat-mq-h2"]'
        f"{intro_part}{''.join(lines)}"
        "[/vc_column_inner][/vc_row_inner]"
    )


def actions_block(
    cta_principal: dict[str, Any] | None,
    links_secundarios: list[dict[str, Any]] | None = None,
    slug: str = "",
) -> str:
    btns = []
    if cta_principal is not None:
        txt = require_key(cta_principal, "texto", slug, "cta_principal")
        url = require_key(cta_principal, "url", slug, "cta_principal")
        link_val = encode_wpb_link(url, cta_principal.get("externo"), slug=slug, context="cta_principal")
        btns.append(
            f'[vc_btn title="{esc_attr(txt)}" style="flat" color="primary" '
            f'link="{link_val}" el_class="sat-mq-btn sat-mq-btn-primary"]'
        )
    for idx, lnk in enumerate(links_secundarios or [], 1):
        txt = require_key(lnk, "texto", slug, f"enlaces_secundarios[{idx}]")
        url = require_key(lnk, "url", slug, f"enlaces_secundarios[{idx}]")
        link_val = encode_wpb_link(url, lnk.get("externo"), slug=slug, context=f"enlaces_secundarios[{idx}]")
        btns.append(
            f'[vc_btn title="{esc_attr(txt)}" style="outline" color="primary" '
            f'link="{link_val}" el_class="sat-mq-btn sat-mq-btn-link"]'
        )
    if not btns:
        return ""
    return f'[vc_row_inner el_class="sat-mq-actions"][vc_column_inner width="1/1"]{"".join(btns)}[/vc_column_inner][/vc_row_inner]'


def legal_rows_block(
    items: list[dict[str, Any]],
    slug: str,
    context: str,
    require_url: bool = False,
) -> str:
    """Construye filas internas .sat-mq-legal-row reutilizables para normativa o desglose."""
    rows: list[str] = []
    for idx, n in enumerate(items):
        item_ctx = f"{context}[{idx + 1}]"
        desc = require_key(n, "descripcion", slug, item_ctx)
        row_cls = "sat-mq-legal-row sat-mq-legal-row-last" if idx == len(items) - 1 else "sat-mq-legal-row"
        url = require_key(n, "url", slug, item_ctx) if require_url else n.get("url")
        if url:
            link_val = encode_wpb_link(url, n.get("externo", True), slug=slug, context=item_ctx)
            btn_html = (
                f'[vc_btn title="{esc_attr(n.get("boton_texto", "Descargar documento (PDF)"))}" '
                f'style="outline" color="primary" align="right" link="{link_val}" el_class="sat-mq-btn sat-mq-btn-link"]'
            )
            rows.append(
                f'[vc_row_inner equal_height="yes" content_placement="middle" el_class="{row_cls}"]'
                f'[vc_column_inner width="2/3"][vc_column_text el_class="sat-mq-legal-text"]{str(desc).strip()}[/vc_column_text][/vc_column_inner]'
                f'[vc_column_inner width="1/3"]{btn_html}[/vc_column_inner][/vc_row_inner]'
            )
        else:
            rows.append(
                f'[vc_row_inner el_class="{row_cls}"]'
                f'[vc_column_inner width="1/1"][vc_column_text el_class="sat-mq-legal-text"]{str(desc).strip()}[/vc_column_text][/vc_column_inner]'
                '[/vc_row_inner]'
            )
    return "".join(rows)


def legal_accordion_block(
    titulo_acordeon: str,
    tab_id: str,
    normas: list[dict[str, Any]],
    slug: str,
    context: str = "normativa",
    el_class: str = "sat-mq-acc sat-mq-legal",
) -> str:
    if not normas:
        return ""
    rows_html = legal_rows_block(normas, slug=slug, context=context, require_url=False)
    return (
        '[vc_tta_accordion style="flat" color="white" c_position="right" collapsible_all="true" '
        f'active_section="0" el_class="{el_class}"]'
        f'[vc_tta_section title="{esc_attr(titulo_acordeon)}" tab_id="{esc_attr(tab_id)}"]'
        f'{rows_html}[/vc_tta_section][/vc_tta_accordion]'
    )


def multi_section_legal_accordion_block(
    grupos: list[dict[str, Any]],
    slug: str,
    context: str,
    tab_prefix: str = "grp",
    el_class: str = "sat-mq-acc sat-mq-legal",
) -> str:
    """Construye acordeón multi-sección colapsado con filas de descripción + botón."""
    if not grupos:
        return ""
    sec_blocks = []
    for idx, grp in enumerate(grupos, 1):
        grp_ctx = f"{context}[{idx}]"
        grp_title = require_key(grp, "titulo", slug, grp_ctx)
        tab_id = grp.get("tab_id") or f"{slug}-{tab_prefix}-{idx}"
        items = require_key(grp, "items", slug, grp_ctx)
        rows_html = legal_rows_block(items, slug=slug, context=f"{grp_ctx}.items", require_url=True)
        sec_blocks.append(f'[vc_tta_section title="{esc_attr(grp_title)}" tab_id="{esc_attr(tab_id)}"]{rows_html}[/vc_tta_section]')
    return (
        '[vc_tta_accordion style="flat" color="white" c_position="right" collapsible_all="true" '
        f'active_section="0" el_class="{el_class}"]{"".join(sec_blocks)}[/vc_tta_accordion]'
    )


def doc_cards_block(docs: list[dict[str, Any]], slug: str, context: str = "documentos") -> str:
    """Construye tarjetas horizontales de descarga/recurso (.sat-mq-doc-card)."""
    out: list[str] = []
    for idx, doc in enumerate(docs, 1):
        d_ctx = f"{context}[{idx}]"
        d_title = require_key(doc, "titulo", slug, d_ctx)
        d_desc = require_key(doc, "descripcion", slug, d_ctx)
        d_url = require_key(doc, "url", slug, d_ctx)
        link_val = encode_wpb_link(d_url, doc.get("externo", True), slug=slug, context=d_ctx)
        out.append(
            '[vc_row_inner equal_height="yes" content_placement="middle" el_class="sat-mq-doc-card"]'
            f'[vc_column_inner width="2/3"][vc_custom_heading text="{esc_attr(d_title)}" font_container="tag:h3|text_align:left" use_theme_fonts="yes" el_class="sat-mq-h3"]'
            f'[vc_column_text el_class="sat-mq-text"]{str(d_desc).strip()}[/vc_column_text][/vc_column_inner]'
            f'[vc_column_inner width="1/3"][vc_btn title="{esc_attr(doc.get("boton_texto", "Descargar (PDF)"))}" style="outline" color="primary" align="right" link="{link_val}" el_class="sat-mq-btn sat-mq-btn-link"][/vc_column_inner]'
            '[/vc_row_inner]'
        )
    return "".join(out)


def _render_table_piece(piece: Any, default_strong: bool = False) -> str:
    if isinstance(piece, dict):
        if piece.get("url"):
            txt = esc_html_text(piece.get("texto", "Abrir"))
            raw_url = str(piece["url"]).strip()
            href = html.escape(raw_url, quote=True)
            if raw_url.startswith(("mailto:", "tel:")):
                return f'<a href="{href}">{txt}</a>'
            return f'<a href="{href}" target="_blank" rel="noopener noreferrer">{txt}</a>'
        val = esc_html_text(piece.get("texto", ""))
        if piece.get("strong") or default_strong:
            val = f"<strong>{val}</strong>"
        return val
    val = esc_html_text(str(piece))
    return f"<strong>{val}</strong>" if default_strong else val


def semantic_table_block(caption: str, headers: list[str], rows: list[list[Any]]) -> str:
    th_html = "".join(f'<th scope="col">{esc_html_text(h)}</th>' for h in headers)
    tr_list = []
    for row in rows:
        tds = []
        for c_idx, cell in enumerate(row):
            if isinstance(cell, dict):
                cls = ' class="sat-mq-td-nowrap"' if cell.get("nowrap") or cell.get("url") else ""
                if cell.get("partes"):
                    rendered_parts = [
                        _render_table_piece(p) for p in cell["partes"]
                    ]
                    tds.append(f'<td{cls}>{"<br/>".join(rendered_parts)}</td>')
                else:
                    tds.append(f"<td{cls}>{_render_table_piece(cell)}</td>")
            else:
                tds.append(f"<td>{_render_table_piece(cell, default_strong=(c_idx == 0))}</td>")
        tr_list.append(f"<tr>{''.join(tds)}</tr>")
    cap_html = f"<caption>{esc_html_text(caption)}</caption>" if caption else ""
    return (
        '[vc_column_text el_class="sat-mq-table-box"]'
        f"<table>{cap_html}<thead><tr>{th_html}</tr></thead><tbody>{''.join(tr_list)}</tbody></table>"
        "[/vc_column_text]"
    )


def page_slug(page: dict[str, Any]) -> str:
    return str(page.get("slug") or "<sin-slug>").strip()


def compile_tipo_1(page: dict[str, Any]) -> str:
    slug = page_slug(page)
    parts = [breadcrumb_and_open(), header_block(page, slug)]

    # Requisitos (Antes de empezar)
    reqs = page.get("requisitos", [])
    if reqs:
        parts.append(eyebrow_section(page.get("eyebrow_requisitos", "Antes de empezar"), page.get("h2_requisitos", "¿Qué necesitas antes de empezar?"), page.get("intro_requisitos", "")))
        parts.append(info_boxes_grid_block(reqs, slug, "requisitos"))

    if page.get("nota_requisito"):
        parts.append(f'[vc_message icon_fontawesome="fas fa-info-circle" message_box_color="warning" el_class="sat-mq-note"]{str(page["nota_requisito"]).strip()}[/vc_message]')

    for idx, doc in enumerate(page.get("documentos_previos", []), 1):
        txt = require_key(doc, "texto", slug, f"documentos_previos[{idx}]")
        url = require_key(doc, "url", slug, f"documentos_previos[{idx}]")
        link_val = encode_wpb_link(url, doc.get("externo", True), slug=slug, context=f"documentos_previos[{idx}]")
        parts.append(
            f'[vc_btn title="{esc_attr(txt)}" style="outline" color="primary" '
            f'link="{link_val}" el_class="sat-mq-btn sat-mq-btn-link"]'
        )

    # Paso a paso
    pasos = page.get("pasos", [])
    if pasos:
        parts.append(eyebrow_section(page.get("eyebrow_pasos", "Paso a paso")))
        parts.append(panel_block(page.get("h2_pasos", "Cómo realizar esta gestión"), page.get("intro_pasos", ""), pasos))

    parts.append(actions_block(page.get("cta_principal"), page.get("enlaces_secundarios"), slug=slug))

    # Qué sigue después
    siguientes = page.get("que_sigue", [])
    if siguientes:
        parts.append(eyebrow_section(page.get("eyebrow_continuidad", "Qué sigue después"), page.get("h2_continuidad", "¿Qué sucede al completar el proceso?"), page.get("intro_continuidad", "")))
        parts.append(info_boxes_grid_block(siguientes, slug, "que_sigue"))

    # Manuales opcionales
    manuales = page.get("manuales", [])
    if manuales:
        parts.append(eyebrow_section("Biblioteca de manuales", page.get("h2_manuales", "Manuales y guías oficiales"), page.get("intro_manuales", "")))
        sec_blocks = []
        for idx, grp in enumerate(manuales, 1):
            grp_title = require_key(grp, "titulo", slug, f"manuales[{idx}]")
            items = grp.get("items", [])
            btns = "".join(
                f'[vc_btn title="{esc_attr(require_key(m, "texto", slug, f"manuales[{idx}].items[{m_idx}]"))}" '
                f'style="outline" color="primary" '
                f'link="{encode_wpb_link(require_key(m, "url", slug, f"manuales[{idx}].items[{m_idx}]"), m.get("externo", True), slug=slug)}" '
                'el_class="sat-mq-btn sat-mq-btn-link sat-mq-link-block"]'
                for m_idx, m in enumerate(items, 1)
            )
            tab_id = grp.get("tab_id") or f"{slug}-man-{idx}"
            sec_blocks.append(f'[vc_tta_section title="{esc_attr(grp_title)}" tab_id="{esc_attr(tab_id)}"]{btns}[/vc_tta_section]')
        parts.append(
            '[vc_tta_accordion style="flat" color="white" c_position="right" collapsible_all="true" '
            f'active_section="0" el_class="sat-mq-acc"]{"".join(sec_blocks)}[/vc_tta_accordion]'
        )

    # Respaldo normativo opcional (solo si la URL original incluye base legal)
    normativa = page.get("normativa", [])
    if normativa:
        parts.append(eyebrow_section("Respaldo normativo", page.get("h2_legal", "Base legal aplicable"), page.get("intro_legal", "")))
        parts.append(
            legal_accordion_block(
                page.get("legal_acordeon_titulo", "Normativa y resoluciones aplicables"),
                f"{slug}-legal",
                normativa,
                slug=slug,
                context="normativa",
            )
        )

    parts.append("[/vc_column][/vc_row]")
    return "".join(parts)


def compile_tipo_2(page: dict[str, Any]) -> str:
    slug = page_slug(page)
    parts = [breadcrumb_and_open(), header_block(page, slug)]

    datos = page.get("datos_previos", [])
    if datos:
        parts.append(eyebrow_section(page.get("eyebrow_previos", "Antes de ingresar"), page.get("h2_previos", "Qué debes tener a la mano"), page.get("intro_previos", "")))
        parts.append(info_boxes_grid_block(datos, slug, "datos_previos"))

    parts.append(actions_block(page.get("cta_principal"), page.get("enlaces_secundarios"), slug=slug))

    docs = page.get("documentos", [])
    if docs:
        parts.append(eyebrow_section(page.get("eyebrow_documentos", "Recursos incluidos"), page.get("h2_documentos", "Materiales disponibles"), page.get("intro_documentos", "")))
        parts.append(doc_cards_block(docs, slug=slug, context="documentos"))

    if page.get("nota_soporte"):
        parts.append(f'[vc_message icon_fontawesome="fas fa-info-circle" message_box_color="warning" el_class="sat-mq-note"]{str(page["nota_soporte"]).strip()}[/vc_message]')

    parts.append("[/vc_column][/vc_row]")
    return "".join(parts)


def compile_tipo_3(page: dict[str, Any]) -> str:
    slug = page_slug(page)
    parts = [breadcrumb_and_open(), header_block(page, slug)]

    datos = page.get("datos_previos", [])
    if datos:
        parts.append(eyebrow_section(page.get("eyebrow_previos", "Antes de iniciar"), page.get("h2_previos", "Qué debes tener en cuenta"), page.get("intro_previos", "")))
        parts.append(info_boxes_grid_block(datos, slug, "datos_previos"))

    if page.get("nota_soporte"):
        parts.append(f'[vc_message icon_fontawesome="fas fa-info-circle" message_box_color="warning" el_class="sat-mq-note"]{str(page["nota_soporte"]).strip()}[/vc_message]')

    tarjetas = page.get("tarjetas", [])
    if tarjetas:
        parts.append(eyebrow_section(page.get("eyebrow_modulos", "Módulos de gestión"), page.get("h2_modulos", "Qué puedes gestionar en esta sección"), page.get("intro_modulos", "")))
        even_cls = " sat-mq-cards-even" if page.get("tarjetas_pares") else ""
        card_items = []
        for idx, c in enumerate(tarjetas):
            c_ctx = f"tarjetas[{idx + 1}]"
            c_title = require_key(c, "titulo", slug, c_ctx)
            c_desc = require_key(c, "descripcion", slug, c_ctx)
            c_url = require_key(c, "url", slug, c_ctx)
            w = "1/1" if idx == 0 and not page.get("tarjetas_pares") else "1/2"
            link_val = encode_wpb_link(c_url, c.get("externo"), slug=slug, context=c_ctx)
            card_items.append(
                f'[vc_column_inner width="{w}"][bsf-info-box icon_type="none" title="{esc_attr(c_title)}" '
                f'read_more="box" link="{link_val}"]{str(c_desc).strip()}[/bsf-info-box][/vc_column_inner]'
            )
        parts.append(f'[vc_row_inner el_class="sat-mq-cards{even_cls}"]{"".join(card_items)}[/vc_row_inner]')

    pasos = page.get("pasos", [])
    if pasos:
        parts.append(eyebrow_section(page.get("eyebrow_pasos", "Paso a paso")))
        parts.append(panel_block(page.get("h2_pasos", "Cómo funciona el proceso"), page.get("intro_pasos", ""), pasos))

    docs = page.get("documentos", [])
    if docs:
        parts.append(eyebrow_section(page.get("eyebrow_documentos", "Descargas oficiales"), page.get("h2_documentos", "Documentos de consulta directa"), page.get("intro_documentos", "")))
        parts.append(doc_cards_block(docs, slug=slug, context="documentos"))

    grupos_docs = page.get("grupos_documentos", [])
    if grupos_docs:
        parts.append(
            eyebrow_section(
                page.get("eyebrow_grupos_documentos", "Biblioteca de documentos"),
                page.get("h2_grupos_documentos", "Documentos clasificados por categoría"),
                page.get("intro_grupos_documentos", ""),
            )
        )
        parts.append(multi_section_legal_accordion_block(grupos_docs, slug=slug, context="grupos_documentos", tab_prefix="docgrp"))

    acordeon_items = page.get("acordeon_desglose", [])
    if acordeon_items:
        parts.append(
            legal_accordion_block(
                page.get("acordeon_desglose_titulo", "Documentos y guías incluidas"),
                f"{slug}-desglose",
                acordeon_items,
                slug=slug,
                context="acordeon_desglose",
            )
        )

    tabla = page.get("tabla")
    if tabla:
        columnas = require_key(tabla, "columnas", slug, "tabla")
        filas = require_key(tabla, "filas", slug, "tabla")
        if not isinstance(columnas, list) or not isinstance(filas, list):
            raise ValueError(f"[{slug}] 'tabla.columnas' y 'tabla.filas' deben ser listas.")
        parts.append(
            eyebrow_section(
                page.get("eyebrow_tabla", "Resumen normativo"),
                page.get("h2_tabla", "Detalle de alcance y exclusiones"),
                page.get("intro_tabla", ""),
            )
        )
        parts.append(semantic_table_block(tabla.get("caption", ""), columnas, filas))

    if page.get("cta_principal") or page.get("enlaces_secundarios") or page.get("enlace_retorno_hub"):
        secs = list(page.get("enlaces_secundarios") or [])
        if page.get("enlace_retorno_hub"):
            secs.append(page["enlace_retorno_hub"])
        parts.append(actions_block(page.get("cta_principal"), secs, slug=slug))

    parts.append("[/vc_column][/vc_row]")
    return "".join(parts)


def compile_tipo_4(page: dict[str, Any]) -> str:
    slug = page_slug(page)
    parts = [breadcrumb_and_open(), header_block(page, slug)]

    datos = page.get("datos_previos", [])
    if datos:
        parts.append(eyebrow_section(page.get("eyebrow_previos", "Antes de consultar"), page.get("h2_previos", "Qué incluye esta herramienta"), page.get("intro_previos", "")))
        parts.append(info_boxes_grid_block(datos, slug, "datos_previos"))

    parts.append(actions_block(page.get("cta_principal"), page.get("enlaces_secundarios"), slug=slug))

    if page.get("nota_soporte"):
        parts.append(f'[vc_message icon_fontawesome="fas fa-info-circle" message_box_color="warning" el_class="sat-mq-note"]{str(page["nota_soporte"]).strip()}[/vc_message]')

    pasos = page.get("pasos", [])
    if pasos:
        parts.append(eyebrow_section(page.get("eyebrow_panel", "Cómo funciona")))
        parts.append(panel_block(page.get("h2_panel", "Especificaciones y flujo técnico"), page.get("intro_panel", ""), pasos))

    tabla = page.get("tabla")
    if tabla is None and not page.get("cta_principal"):
        tabla = require_key(page, "tabla", slug)
    if tabla:
        columnas = require_key(tabla, "columnas", slug, "tabla")
        filas = require_key(tabla, "filas", slug, "tabla")
        if not isinstance(columnas, list) or not isinstance(filas, list):
            raise ValueError(f"[{slug}] 'tabla.columnas' y 'tabla.filas' deben ser listas.")
        parts.append(eyebrow_section(page.get("eyebrow_tabla", "Directorio oficial"), page.get("h2_tabla", "Listado oficial vigente"), page.get("intro_tabla", "")))
        parts.append(semantic_table_block(tabla.get("caption", ""), columnas, filas))

    docs = page.get("documentos", [])
    if docs:
        parts.append(eyebrow_section(page.get("eyebrow_documentos", "Recursos y documentos"), page.get("h2_documentos", "Materiales de consulta directa"), page.get("intro_documentos", "")))
        parts.append(doc_cards_block(docs, slug=slug, context="documentos"))

    grupos_docs = page.get("grupos_documentos", [])
    if grupos_docs:
        parts.append(
            eyebrow_section(
                page.get("eyebrow_grupos_documentos", "Biblioteca de documentos"),
                page.get("h2_grupos_documentos", "Normativa, estadísticas y anexos"),
                page.get("intro_grupos_documentos", ""),
            )
        )
        parts.append(multi_section_legal_accordion_block(grupos_docs, slug=slug, context="grupos_documentos", tab_prefix="docgrp"))

    extra = page.get("ancla_extra")
    if extra:
        ancla_id = extra.get("id", "mas-informacion")
        extra_h2 = require_key(extra, "h2", slug, "ancla_extra")
        btn_html = ""
        if extra.get("url"):
            btn_html = (
                f'[vc_btn title="{esc_attr(extra.get("boton_texto", "Consultar guía (PDF)"))}" style="outline" '
                f'color="primary" link="{encode_wpb_link(extra["url"], extra.get("externo", True), slug=slug, context="ancla_extra")}" el_class="sat-mq-btn sat-mq-btn-link"]'
            )
        parts.append(
            f'[vc_row_inner el_id="{esc_attr(ancla_id)}" el_class="sat-mq-anchor-row"][vc_column_inner width="1/1"]'
            f'{eyebrow_section(extra.get("eyebrow", "Información adicional"), extra_h2, extra.get("texto", ""))}'
            f'{btn_html}[/vc_column_inner][/vc_row_inner]'
        )

    parts.append("[/vc_column][/vc_row]")
    return "".join(parts)


def compile_tipo_5(page: dict[str, Any]) -> str:
    slug = page_slug(page)
    parts = [breadcrumb_and_open(), header_block(page, slug)]

    datos = page.get("datos_previos", [])
    if datos:
        parts.append(eyebrow_section(page.get("eyebrow_previos", "Antes de consultar"), page.get("h2_previos", "Alcance general"), page.get("intro_previos", "")))
        parts.append(info_boxes_grid_block(datos, slug, "datos_previos"))

    if page.get("nota_soporte"):
        parts.append(f'[vc_message icon_fontawesome="fas fa-info-circle" message_box_color="warning" el_class="sat-mq-note"]{str(page["nota_soporte"]).strip()}[/vc_message]')

    puntos = page.get("puntos_alcance", [])
    if puntos:
        parts.append(eyebrow_section(page.get("eyebrow_alcance", "Alcance ciudadano")))
        parts.append(panel_block(page.get("h2_alcance", "Qué regula esta normativa"), page.get("intro_alcance", ""), puntos))

    tabla = page.get("tabla")
    if tabla:
        columnas = require_key(tabla, "columnas", slug, "tabla")
        filas = require_key(tabla, "filas", slug, "tabla")
        if not isinstance(columnas, list) or not isinstance(filas, list):
            raise ValueError(f"[{slug}] 'tabla.columnas' y 'tabla.filas' deben ser listas.")
        parts.append(eyebrow_section(page.get("eyebrow_tabla", "Instrumentos legales vigentes"), page.get("h2_tabla", "Resumen de normativa aplicable"), page.get("intro_tabla", "")))
        parts.append(semantic_table_block(tabla.get("caption", ""), columnas, filas))

    docs = page.get("documentos", [])
    if docs:
        parts.append(eyebrow_section(page.get("eyebrow_documentos", "Descargas oficiales"), page.get("h2_documentos", "Documentos normativos y guías"), page.get("intro_documentos", "")))
        parts.append(doc_cards_block(docs, slug=slug, context="documentos"))

    grupos = page.get("grupos_normas", [])
    if grupos:
        parts.append(
            eyebrow_section(
                page.get("eyebrow_acordeon", "Consulta por instrumento"),
                page.get("h2_acordeon", "Leyes, acuerdos y resoluciones"),
                page.get("intro_acordeon", ""),
            )
        )
        parts.append(multi_section_legal_accordion_block(grupos, slug=slug, context="grupos_normas", tab_prefix="norma"))

    if page.get("cta_principal") or page.get("enlaces_secundarios") or page.get("enlace_retorno_hub"):
        secs = list(page.get("enlaces_secundarios") or [])
        if page.get("enlace_retorno_hub"):
            secs.append(page["enlace_retorno_hub"])
        parts.append(actions_block(page.get("cta_principal"), secs, slug=slug))

    parts.append("[/vc_column][/vc_row]")
    return "".join(parts)


def compile_tipo_6(page: dict[str, Any]) -> str:
    slug = page_slug(page)
    parts = [breadcrumb_and_open(), header_block(page, slug)]

    for b_idx, bloque in enumerate(page.get("temas", []), 1):
        b_title = require_key(bloque, "titulo", slug, f"temas[{b_idx}]")
        parts.append(f'[vc_custom_heading text="{esc_attr(b_title)}" use_theme_fonts="yes" el_class="sat-mq-h2 sat-mq-section"]')
        sections = []
        for q_idx, qa in enumerate(bloque.get("preguntas", []), 1):
            q_ctx = f"temas[{b_idx}].preguntas[{q_idx}]"
            pregunta = require_key(qa, "pregunta", slug, q_ctx)
            respuesta = require_key(qa, "respuesta", slug, q_ctx)
            tab_id = qa.get("tab_id") or f"{slug}-faq-{b_idx}-{q_idx}"
            sections.append(
                f'[vc_tta_section title="{esc_attr(pregunta)}" tab_id="{esc_attr(tab_id)}"]'
                f'[vc_column_text el_class="sat-mq-faq-ans"]{str(respuesta).strip()}[/vc_column_text][/vc_tta_section]'
            )
        parts.append(
            '[vc_tta_accordion style="flat" color="white" c_position="right" collapsible_all="true" '
            f'active_section="0" el_class="sat-mq-acc"]{"".join(sections)}[/vc_tta_accordion]'
        )

    parts.append("[/vc_column][/vc_row]")
    return "".join(parts)


COMPILERS = {
    "TIPO-1": compile_tipo_1,
    "TIPO-2": compile_tipo_2,
    "TIPO-3": compile_tipo_3,
    "TIPO-4": compile_tipo_4,
    "TIPO-5": compile_tipo_5,
    "TIPO-6": compile_tipo_6,
}


def validate_compiled_page(slug: str, txt: str, css: str) -> list[str]:
    errs: list[str] = []
    if "[vc_raw_html]" in txt or "<iframe" in txt.lower() or "<script" in txt.lower():
        errs.append(f"[{slug}] Contiene [vc_raw_html], <iframe> o <script> prohibido.")
    bc_block = re.match(
        r"\[vc_row\b([^\]]*)\](?:(?!\[/vc_row\]).)*?\[dt_breadcrumbs\b([^\]]*)\](?:(?!\[/vc_row\]).)*?\[/vc_row\]",
        txt.lstrip(),
        flags=re.DOTALL | re.IGNORECASE,
    )
    if not bc_block:
        errs.append(f"[{slug}] Falta bloque inicial obligatorio [vc_row]...[dt_breadcrumbs...] en fila 1.")
    else:
        row1_attrs, bc_attrs = bc_block.group(1), bc_block.group(2)
        if re.search(r'\bgap\s*=\s*(?:"5px"|\'5px\')', row1_attrs, flags=re.IGNORECASE):
            errs.append(f"[{slug}] La fila 1 del breadcrumb no debe incluir gap=\"5px\".")
        if not re.search(r'\bfont_style\s*=\s*(?:"italic:normal:none"|\'italic:normal:none\')', bc_attrs):
            errs.append(f"[{slug}] Falta font_style=\"italic:normal:none\" en [dt_breadcrumbs].")
        if not re.search(r'\balignment\s*=\s*(?:"left"|\'left\')', bc_attrs, flags=re.IGNORECASE):
            errs.append(f"[{slug}] Falta alignment=\"left\" en [dt_breadcrumbs].")
    for idx, m in enumerate(re.finditer(r"\[bsf-info-box\b([^\]]*)\]", txt, flags=re.IGNORECASE), start=1):
        if not re.search(r'\bicon_type\s*=\s*(?:"none"|\'none\')', m.group(1), flags=re.IGNORECASE):
            errs.append(f"[{slug}] [bsf-info-box] #{idx} sin icon_type=\"none\".")
    if re.search(r"\{\{[A-Z0-9_]+\}\}", txt):
        errs.append(f"[{slug}] Contiene placeholders sin resolver.")
    if "[email protected]" in txt.lower():
        errs.append(f"[{slug}] Contiene correo ofuscado [email protected].")
    visible = re.sub(r'link="url:[^"]+"', " ", txt)
    visible = re.sub(r'(?:href|src)\s*=\s*(?:"[^"]*"|\'[^\']*\')', " ", visible, flags=re.IGNORECASE)
    if re.search(r"\btr[áa]mites?\b", visible, flags=re.IGNORECASE):
        errs.append(f"[{slug}] Contiene palabra prohibida en texto visible.")
    gram_m = re.search(
        r"\b(?:el|al|del|un|los|estos|esos|aquellos)\s+gesti[oó]n(?:es)?\b"
        r"|\bgestiones\s+"
        r"(?!menos\b|nos\b|los\b|todos\b|otros\b|dos\b|estos\b|esos\b|aquellos\b|cuyos\b|"
        r"unos\b|ambos\b|varios\b|muchos\b|pocos\b|datos\b|casos\b|pagos\b|plazos\b|"
        r"avisos\b|pasos\b|efectos\b|derechos\b|documentos\b|requisitos\b|registros\b|"
        r"formularios\b|recursos\b|medios\b|procesos\b|archivos\b|servicios\b|impuestos\b|"
        r"contribuyentes\b|estados\b|ingresos\b|egresos\b|contratos\b|a[nñ]os\b|"
        r"elementos\b|procedimientos\b|instrumentos\b|reglamentos\b|lineamientos\b|"
        r"asuntos\b|puntos\b|montos\b|eventos\b|usuarios\b|funcionarios\b|horarios\b|"
        r"objetivos\b|motivos\b|incentivos\b|dispositivos\b|activos\b|aspectos\b|"
        r"productos\b|resultados\b)"
        r"[a-záéíóúñ]+(?:ad|id|ar|er|or|ori|ic|iv|ec|nt|ari|pi|ev|vi|uit)os\b"
        r"|\bgesti[oó]n\s+"
        r"(?!no\b|como\b|bajo\b|junto\b|cuando\b|pero\b|sino\b|luego\b|todo\b|otro\b|"
        r"mucho\b|poco\b|solo\b|medio\b|punto\b|paso\b|caso\b|pago\b|plazo\b|aviso\b|"
        r"dato\b|archivo\b|documento\b|registro\b|formulario\b|proceso\b|servicio\b|"
        r"impuesto\b|estado\b|contrato\b|a[nñ]o\b|aspecto\b|producto\b|resultado\b|"
        r"objetivo\b|motivo\b|incentivo\b|dispositivo\b|activo\b|usuario\b|"
        r"funcionario\b|horario\b|elemento\b|procedimiento\b|instrumento\b|"
        r"reglamento\b|lineamiento\b|asunto\b|monto\b|evento\b)"
        r"[a-záéíóúñ]+(?:ad|id|er|ori|ic|iv|ari|pi|ev|vi|uit)o\b",
        visible,
        flags=re.IGNORECASE,
    )
    if gram_m:
        errs.append(f"[{slug}] Posible discordancia gramatical con 'gestión/gestiones': '{gram_m.group(0)}'.")
    if re.search(r"\b(?:haz\s+)?click?\s+aqu[ií]\b", visible, flags=re.IGNORECASE):
        errs.append(f"[{slug}] Contiene texto de enlace no descriptivo ('clic/haz clic aquí').")
    raw_anchor_m = re.search(r"<a\b[^>]*>\s*(?:https?://|www\.)[^<]*</a>", txt, flags=re.IGNORECASE)
    if raw_anchor_m:
        errs.append(f"[{slug}] Contiene URL literal como texto visible de <a>: '{raw_anchor_m.group(0)[:80]}'.")
    vis_no_links = re.sub(r"<a\b[^>]*>.*?</a>", " ", visible, flags=re.DOTALL | re.IGNORECASE)
    plain_url_m = re.search(
        r"(?:https?://[^\s<>\"'\]]+|(?<!@)\b(?:www\.[a-z0-9.-]+\.[a-z]{2,}|portal\.sat\.gob\.gt)[^\s<>\"'\]]*)",
        vis_no_links,
        flags=re.IGNORECASE,
    )
    if plain_url_m:
        errs.append(f"[{slug}] Contiene URL suelta en texto plano sin <a>: '{plain_url_m.group(0)[:80]}'.")
    plain_email_m = re.search(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b", vis_no_links)
    if plain_email_m:
        errs.append(f"[{slug}] Contiene correo electrónico en texto plano sin mailto: '{plain_email_m.group(0)}'.")
    if re.search(r"Tema\s+\d+\s+de\s+\d+", visible, flags=re.IGNORECASE):
        errs.append(f"[{slug}] Contiene contador 'Tema X de Y'.")
    for m in re.finditer(r"\[vc_tta_accordion\b([^\]]*)\]", txt):
        if 'active_section="0"' not in m.group(1):
            errs.append(f"[{slug}] Acordeón sin active_section=\"0\".")
    for m in re.finditer(r'link="url:([^|"]+)', txt):
        if "://" in m.group(1):
            errs.append(f"[{slug}] URL sin codificar en link=\"url:{m.group(1)}\".")
    if "<table" in txt:
        for m in re.finditer(r"\[vc_column_text([^\]]*)\](.*?)\[/vc_column_text\]", txt, flags=re.DOTALL):
            if "<table" in m.group(2) and "sat-mq-table-box" not in m.group(1):
                errs.append(f"[{slug}] <table> fuera de contenedor sat-mq-table-box.")
    if ".sat-mq" not in css or "--acento:#0284c7" not in css.replace(" ", "").lower():
        errs.append(f"[{slug}] CSS carece de .sat-mq o token --acento:#0284c7.")
    return errs


def main() -> None:
    parser = argparse.ArgumentParser(description="Compilador de lotes de maquila WPBakery SAT.")
    parser.add_argument("--input", type=Path, help="Ruta al JSON estructurado de páginas.")
    parser.add_argument("--output-dir", type=Path, help="Directorio destino para <slug>_wpbakery.txt y <slug>_custom.css.")
    parser.add_argument("--dry-run", action="store_true", help="Compila y valida ejemplo sintético de los 6 arquetipos sin escribir archivos reales.")
    args = parser.parse_args()

    if not BASE_CSS_PATH.exists():
        raise FileNotFoundError(f"No existe CSS base: {BASE_CSS_PATH}")
    base_css = BASE_CSS_PATH.read_text(encoding="utf-8")

    input_path = args.input or SYNTHETIC_SAMPLE_PATH
    if not input_path.exists():
        raise FileNotFoundError(f"No se encontró el archivo de entrada: {input_path}")

    data = json.loads(input_path.read_text(encoding="utf-8"))
    pages = data.get("paginas", data if isinstance(data, list) else [])
    if not pages:
        raise ValueError("El JSON de entrada no contiene páginas para compilar.")

    all_errors: list[str] = []
    compiled_outputs: list[tuple[str, str, str, str]] = []

    for page in pages:
        slug = str(page.get("slug") or "").strip()
        arq = str(page.get("arquetipo") or "").strip().upper()
        if not re.match(r"^[a-z0-9-]+$", slug):
            all_errors.append(f"[{slug or '<sin-slug>'}] Slug inválido o faltante (solo a-z, 0-9 y guion).")
            continue
        if arq not in COMPILERS:
            all_errors.append(f"[{slug}] Arquetipo no soportado: {arq}.")
            continue

        txt_out = COMPILERS[arq](page)
        css_header = f"/* SAT · Comercio Exterior · {page['titulo_h1']} ({arq}) */\n"
        css_out = css_header + base_css

        errs = validate_compiled_page(slug, txt_out, css_out)
        all_errors.extend(errs)
        compiled_outputs.append((slug, arq, txt_out, css_out))

    if all_errors:
        print("FALLÓ LA COMPILACIÓN DE MAQUILA:")
        for e in all_errors:
            print("  -", e)
        sys.exit(1)

    if args.dry_run:
        arqs = [arq for _, arq, _, _ in compiled_outputs]
        print(
            f"[DRY-RUN OK] {len(compiled_outputs)} páginas sintéticas compiladas y validadas "
            f"({', '.join(arqs)}). Cero archivos escritos en disco."
        )
        return

    out_dir = args.output_dir or (BASE_DIR / "docs" / "maquila-paginas" / "lotes" / "manual")
    out_dir.mkdir(parents=True, exist_ok=True)
    for slug, arq, txt_out, css_out in compiled_outputs:
        (out_dir / f"{slug}_wpbakery.txt").write_text(txt_out, encoding="utf-8")
        (out_dir / f"{slug}_custom.css").write_text(css_out, encoding="utf-8")

    try:
        out_label = out_dir.resolve().relative_to(BASE_DIR.resolve()).as_posix()
    except ValueError:
        out_label = out_dir.resolve().as_posix()
    print(f"[OK] {len(compiled_outputs)} páginas compiladas en {out_label}.")


if __name__ == "__main__":
    main()
