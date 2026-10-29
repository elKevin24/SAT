"""
generar_wxr_wordpress.py
========================
Genera dos paquetes oficiales de importación de WordPress (formato WXR 1.2 XML)
para crear las 160 páginas jerárquicas del Portal SAT Guatemala en 1 clic desde
`Herramientas › Importar › WordPress` (como opción aceleradora junto al flujo manual):
  1. docs/plantillas-wpbakery/wordpress-import-olas-0-1-2.xml (31 páginas troncales: Ola 0, Ola 1 y Ola 2)
  2. docs/plantillas-wpbakery/wordpress-import-completo-160.xml (las 160 páginas completas de Ola 0 a Ola 4)

Cada <item> incluye:
  - <wp:post_id> y <wp:post_parent> exactos para que [dt_breadcrumbs] arme la miga de pan automáticamente.
  - <wp:post_name> (slug canónico) para que todas las URLs /nivel-1/nivel-2/nivel-3/nivel-4/ coincidan con los links.
  - <content:encoded> con el shortcode nativo de WPBakery (0% [vc_raw_html]).
"""

import html
import json
from collections import OrderedDict
from pathlib import Path
from generar_wpbakery_shortcodes import (
    TRAMITES_JSON,
    OUTPUT_DIR,
    N1_SLUGS,
    slug,
    es_vacio,
    safe_order,
)

BASE_DIR = Path(__file__).parent.parent


def build_wxr_xml(items: list[dict], title: str) -> str:
    header = f"""<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <title>{html.escape(title)}</title>
  <link>https://prototipo.sat.gob.gt</link>
  <description>Paquete de páginas jerárquicas WPBakery + The7 Classic (0% Raw HTML) — Portal SAT Guatemala</description>
  <pubDate>Thu, 29 Oct 2026 03:06:00 +0000</pubDate>
  <language>es-GT</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>https://prototipo.sat.gob.gt</wp:base_site_url>
  <wp:base_blog_url>https://prototipo.sat.gob.gt</wp:base_blog_url>
  <wp:author>
    <wp:author_id>1</wp:author_id>
    <wp:author_login><![CDATA[admin]]></wp:author_login>
    <wp:author_email><![CDATA[webmaster@sat.gob.gt]]></wp:author_email>
    <wp:author_display_name><![CDATA[SAT Guatemala]]></wp:author_display_name>
  </wp:author>
"""
    body_parts = []
    for it in items:
        content_safe = it["content"].replace("]]>", "]]]]><![CDATA[>")
        body_parts.append(f"""  <item>
    <title>{html.escape(it["title"])}</title>
    <link>https://prototipo.sat.gob.gt{html.escape(it["url"])}</link>
    <pubDate>Thu, 29 Oct 2026 03:06:00 +0000</pubDate>
    <dc:creator><![CDATA[admin]]></dc:creator>
    <guid isPermaLink="false">https://prototipo.sat.gob.gt/?page_id={it["post_id"]}&amp;v=20261028210600</guid>
    <description></description>
    <content:encoded><![CDATA[{content_safe}]]></content:encoded>
    <excerpt:encoded><![CDATA[]]></excerpt:encoded>
    <wp:post_id>{it["post_id"]}</wp:post_id>
    <wp:post_date><![CDATA[2026-10-28 21:06:00]]></wp:post_date>
    <wp:post_date_gmt><![CDATA[2026-10-29 03:06:00]]></wp:post_date_gmt>
    <wp:comment_status><![CDATA[closed]]></wp:comment_status>
    <wp:ping_status><![CDATA[closed]]></wp:ping_status>
    <wp:post_name><![CDATA[{it["slug"]}]]></wp:post_name>
    <wp:status><![CDATA[publish]]></wp:status>
    <wp:post_parent>{it["parent_id"]}</wp:post_parent>
    <wp:menu_order>{it["menu_order"]}</wp:menu_order>
    <wp:post_type><![CDATA[page]]></wp:post_type>
    <wp:post_password><![CDATA[]]></wp:post_password>
    <wp:is_sticky>0</wp:is_sticky>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>
      <wp:meta_value><![CDATA[elementor_header_footer]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_dt_sidebar_position]]></wp:meta_key>
      <wp:meta_value><![CDATA[disabled]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_dt_header_title]]></wp:meta_key>
      <wp:meta_value><![CDATA[disabled]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_wpb_vc_js_status]]></wp:meta_key>
      <wp:meta_value><![CDATA[true]]></wp:meta_value>
    </wp:postmeta>
    <wp:postmeta>
      <wp:meta_key><![CDATA[_wpb_post_custom_css]]></wp:meta_key>
      <wp:meta_value><![CDATA[{it.get("custom_css", "")}]]></wp:meta_value>
    </wp:postmeta>
  </item>
""")

    footer = "</channel>\n</rss>\n"
    return header + "".join(body_parts) + footer


def collect_all_pages() -> list[dict]:
    with open(TRAMITES_JSON, "r", encoding="utf-8") as f:
        tramites = json.load(f)

    tramites_sorted = sorted(
        tramites,
        key=lambda t: (
            safe_order(t.get("orden_n1")),
            safe_order(t.get("orden_n2")),
            safe_order(t.get("orden_n3")),
            safe_order(t.get("orden_n4")),
            safe_order(t.get("orden_contenido")),
            str(t.get("id") or ""),
        ),
    )

    pages: list[dict] = []
    next_id = 1000

    HOVER_COLORS = {
        "Contribuyentes": "#14649B",
        "Operadores de Comercio Exterior": "#0284C7",
        "Profesionales": "#4D8014",
        "Entes Exentos": "#C25E00",
    }
    SHADOW_COLORS = {
        "Contribuyentes": "rgba(20, 100, 155, 0.22)",
        "Operadores de Comercio Exterior": "rgba(2, 132, 199, 0.22)",
        "Profesionales": "rgba(77, 128, 20, 0.22)",
        "Entes Exentos": "rgba(194, 94, 0, 0.22)",
    }
    SECTION_CLASSES = {
        "Contribuyentes": "sat-seccion-contribuyentes",
        "Operadores de Comercio Exterior": "sat-seccion-comercio-exterior",
        "Profesionales": "sat-seccion-profesionales",
        "Entes Exentos": "sat-seccion-entes-exentos",
    }

    def build_custom_css(n1: str) -> str:
        sec = SECTION_CLASSES.get(n1, "sat-seccion-contribuyentes")
        col = HOVER_COLORS.get(n1, "#14649B")
        shd = SHADOW_COLORS.get(n1, "rgba(20, 100, 155, 0.22)")
        return (
            f".wpb-content-wrapper, .entry-content {{ max-width: 1200px !important; margin-left: auto !important; margin-right: auto !important; padding-left: 24px !important; padding-right: 24px !important; box-sizing: border-box !important; }} .{sec}.vc_row {{ display: flex !important; flex-wrap: wrap !important; align-items: stretch !important; margin-left: -8px !important; margin-right: -8px !important; }} "
            f".{sec} > .vc_column_container {{ display: flex !important; flex-direction: column !important; flex: 0 0 33.333333% !important; max-width: 33.333333% !important; width: 33.333333% !important; padding-left: 8px !important; padding-right: 8px !important; margin-bottom: 16px !important; box-sizing: border-box !important; }} "
            f"@media (max-width: 991px) {{ .{sec} > .vc_column_container {{ flex: 0 0 50% !important; max-width: 50% !important; width: 50% !important; }} }} "
            f"@media (max-width: 640px) {{ .{sec} > .vc_column_container {{ flex: 0 0 100% !important; max-width: 100% !important; width: 100% !important; }} }} "
            f".{sec} .vc_column-inner, .{sec} .wpb_wrapper {{ display: flex !important; flex-direction: column !important; flex: 1 1 auto !important; width: 100% !important; height: 100% !important; padding: 0 !important; margin: 0 !important; }} "
            f".{sec} .aio-icon-component, .{sec} .aio-icon-box-link {{ display: flex !important; flex: 1 1 auto !important; width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; }} "
            f".{sec} .aio-icon-box {{ display: flex !important; flex-direction: column !important; justify-content: flex-start !important; position: relative !important; width: 100% !important; height: 100% !important; min-height: 140px !important; background-color: #F4F6F9 !important; border: none !important; border-radius: 12px !important; padding: 22px 24px !important; margin: 0 !important; box-sizing: border-box !important; cursor: pointer !important; user-select: none !important; transition: transform 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease !important; }} "
            f".{sec} .aio-icon-box:hover {{ background-color: {col} !important; transform: translateY(-4px) !important; box-shadow: 0 12px 24px {shd} !important; }} "
            f".{sec} .aio-icon-header {{ margin: 0 !important; padding-right: 24px !important; text-align: left !important; }} "
            f".{sec} .aio-icon-box::after {{ content: \"\" !important; position: absolute !important; top: 24px !important; right: 22px !important; width: 18px !important; height: 18px !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E\") !important; transition: background-image 0.2s ease !important; }} "
            f".{sec} .aio-icon-box:hover::after {{ background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FFFFFF' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 18l6-6-6-6'/%3E%3C/svg%3E\") !important; }} "
            f".{sec} .aio-icon-title {{ margin: 0 !important; padding: 0 !important; text-align: left !important; font-family: \"Gotham\", \"Montserrat\", sans-serif, -apple-system !important; font-size: 16px !important; font-weight: 700 !important; line-height: 1.35 !important; color: #19324B !important; transition: color 0.25s ease !important; }} "
            f".{sec} .aio-icon-description {{ margin-top: 8px !important; padding: 0 !important; text-align: left !important; font-family: \"Gotham\", \"Montserrat\", sans-serif, -apple-system !important; font-size: 12.5px !important; line-height: 1.55 !important; color: #475569 !important; flex-grow: 1 !important; transition: color 0.25s ease !important; }} "
            f".{sec} .aio-icon-box:hover .aio-icon-title {{ color: #FFFFFF !important; }} "
            f".{sec} .aio-icon-box:hover .aio-icon-description {{ color: rgba(255, 255, 255, 0.92) !important; }}"
        )

    def add_page(wave: int, title: str, wp_slug: str, url: str, parent_id: int, menu_order: int, rel_file: str, n1: str = "Contribuyentes") -> int:
        nonlocal next_id
        pid = next_id
        next_id += 1
        content = (OUTPUT_DIR / rel_file).read_text(encoding="utf-8")
        pages.append({
            "wave": wave,
            "post_id": pid,
            "parent_id": parent_id,
            "title": title,
            "slug": wp_slug,
            "url": url,
            "menu_order": menu_order,
            "rel_file": rel_file,
            "content": content,
            "custom_css": build_custom_css(n1),
        })
        return pid

    # Ola 0: Portada y 6 Procesos Conectados
    ola_0_specs = [
        ("Inicio", "inicio", "/", "HOME_portada-portal-sat.txt"),
        ("Solicitar Número de Identificación Tributaria (NIT)", "solicitar-nit", "/solicitar-nit/", "procesos-conectados/G_solicitar-nit.txt"),
        ("Actualizar o Ratificar Datos en el Registro Tributario Unificado (RTU Digital)", "actualizar-rtu", "/actualizar-rtu/", "procesos-conectados/G_actualizar-rtu.txt"),
        ("Habilitación y Emisión de Factura Electrónica en Línea (FEL)", "factura-electronica-fel", "/factura-electronica-fel/", "procesos-conectados/G_factura-electronica-fel.txt"),
        ("Solicitud y Emisión de Solvencia Fiscal en Línea", "solvencia-fiscal", "/solvencia-fiscal/", "procesos-conectados/G_solvencia-fiscal.txt"),
        ("Traspaso Electrónico de Vehículos en Línea (e-Traspaso)", "traspaso-vehiculos", "/traspaso-vehiculos/", "procesos-conectados/G_traspaso-vehiculos.txt"),
        ("Inscripción y Activación en el Padrón de Importadores", "padron-importadores", "/padron-importadores/", "procesos-conectados/G_padron-importadores.txt"),
    ]
    for idx, (t_title, t_slug, t_url, t_file) in enumerate(ola_0_specs, 1):
        add_page(0, t_title, t_slug, t_url, 0, idx, t_file, "Contribuyentes")

    # Agrupar árbol Nivel 1 -> Nivel 2 -> Nivel 3 -> Nivel 4
    n1_groups = OrderedDict()
    for t in tramites_sorted:
        n1 = t.get("nivel1") or "Contribuyentes"
        n1_groups.setdefault(n1, []).append(t)

    for idx_n1, (n1, n1_items) in enumerate(n1_groups.items(), 1):
        n1_slug = N1_SLUGS.get(n1, slug(n1))
        n1_id = add_page(1, n1, n1_slug, f"/{n1_slug}/", 0, idx_n1, f"{n1_slug}/N1_{n1_slug}.txt", n1)

        n2_groups = OrderedDict()
        for t in n1_items:
            n2 = t.get("nivel2") or "General"
            n2_groups.setdefault(n2, []).append(t)

        for idx_n2, (n2, n2_items) in enumerate(n2_groups.items(), 1):
            n2_slug = slug(n2)
            n2_id = add_page(
                2,
                n2,
                n2_slug,
                f"/{n1_slug}/{n2_slug}/",
                n1_id,
                idx_n2,
                f"{n1_slug}/N2_{n2_slug}.txt",
                n1,
            )

            n3_groups = OrderedDict()
            for t in n2_items:
                n3 = t.get("nivel3") or "—"
                if not es_vacio(n3):
                    n3_groups.setdefault(n3, []).append(t)

            for idx_n3, (n3, n3_items) in enumerate(n3_groups.items(), 1):
                n3_slug = slug(n3)
                n3_id = add_page(
                    3,
                    n3,
                    n3_slug,
                    f"/{n1_slug}/{n2_slug}/{n3_slug}/",
                    n2_id,
                    idx_n3,
                    f"{n1_slug}/{n2_slug}/N3_{n3_slug}.txt",
                    n1,
                )

                n4_groups = OrderedDict()
                for t in n3_items:
                    n4 = t.get("nivel4") or "—"
                    if not es_vacio(n4):
                        n4_groups.setdefault(n4, []).append(t)

                for idx_n4, (n4, _n4_items) in enumerate(n4_groups.items(), 1):
                    n4_slug = slug(n4)
                    add_page(
                        4,
                        n4,
                        n4_slug,
                        f"/{n1_slug}/{n2_slug}/{n3_slug}/{n4_slug}/",
                        n3_id,
                        idx_n4,
                        f"{n1_slug}/{n2_slug}/{n3_slug}/N4_{n4_slug}.txt",
                        n1,
                    )

    return pages


def main():
    pages = collect_all_pages()
    olas_012 = [p for p in pages if p["wave"] in (0, 1, 2)]
    public_dir = BASE_DIR / "public" / "downloads"
    public_dir.mkdir(parents=True, exist_ok=True)

    def save_both(filename: str, xml_content: str):
        (OUTPUT_DIR / filename).write_text(xml_content, encoding="utf-8")
        (public_dir / filename).write_text(xml_content, encoding="utf-8")

    save_both(
        "wordpress-import-olas-0-1-2.xml",
        build_wxr_xml(olas_012, "Portal SAT Guatemala — Olas 0, 1 y 2 (31 Páginas Base)"),
    )
    save_both(
        "wordpress-import-completo-160.xml",
        build_wxr_xml(pages, "Portal SAT Guatemala — Árbol Completo (160 Páginas)"),
    )

    # Paquete completo de Operadores de Comercio Exterior (65 páginas: N1 + 6 N2 + 20 N3 + 38 N4)
    oce_all = [p for p in pages if p["url"].startswith("/operadores-de-comercio-exterior/")]
    save_both(
        "wordpress-import-comercio-exterior-completo.xml",
        build_wxr_xml(oce_all, "Portal SAT Guatemala — Operadores de Comercio Exterior Completo (65 Páginas)"),
    )

    # Paquete restante de Operadores de Comercio Exterior (50 páginas: sin Importadores SAT-GES-0341..0394)
    oce_restante = [
        p for p in oce_all
        if not p["url"].startswith("/operadores-de-comercio-exterior/importadores/")
    ]
    save_both(
        "wordpress-import-comercio-exterior-restante.xml",
        build_wxr_xml(oce_restante, "Portal SAT Guatemala — Operadores de Comercio Exterior (Restante: 50 Páginas sin Importadores)"),
    )

    print(
        f"Archivos WXR XML generados con éxito: "
        f"oce_restante={len(oce_restante)}, oce_completo={len(oce_all)}, "
        f"olas_012={len(olas_012)}, total={len(pages)}"
    )


if __name__ == "__main__":
    main()
