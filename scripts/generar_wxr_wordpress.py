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
  <link>https://portal.sat.gob.gt</link>
  <description>Paquete de páginas jerárquicas WPBakery + The7 Classic (0% Raw HTML) — Portal SAT Guatemala</description>
  <pubDate>Mon, 26 Oct 2026 19:00:00 +0000</pubDate>
  <language>es-GT</language>
  <wp:wxr_version>1.2</wp:wxr_version>
  <wp:base_site_url>https://portal.sat.gob.gt</wp:base_site_url>
  <wp:base_blog_url>https://portal.sat.gob.gt</wp:base_blog_url>
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
    <link>https://portal.sat.gob.gt{html.escape(it["url"])}</link>
    <pubDate>Mon, 26 Oct 2026 19:00:00 +0000</pubDate>
    <dc:creator><![CDATA[admin]]></dc:creator>
    <guid isPermaLink="false">https://portal.sat.gob.gt/?page_id={it["post_id"]}</guid>
    <description></description>
    <content:encoded><![CDATA[{content_safe}]]></content:encoded>
    <excerpt:encoded><![CDATA[]]></excerpt:encoded>
    <wp:post_id>{it["post_id"]}</wp:post_id>
    <wp:post_date><![CDATA[2026-10-26 19:00:00]]></wp:post_date>
    <wp:post_date_gmt><![CDATA[2026-10-26 19:00:00]]></wp:post_date_gmt>
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
      <wp:meta_value><![CDATA[default]]></wp:meta_value>
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

    def add_page(wave: int, title: str, wp_slug: str, url: str, parent_id: int, menu_order: int, rel_file: str) -> int:
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
        add_page(0, t_title, t_slug, t_url, 0, idx, t_file)

    # Agrupar árbol Nivel 1 -> Nivel 2 -> Nivel 3 -> Nivel 4
    n1_groups = OrderedDict()
    for t in tramites_sorted:
        n1 = t.get("nivel1") or "Contribuyentes"
        n1_groups.setdefault(n1, []).append(t)

    for idx_n1, (n1, n1_items) in enumerate(n1_groups.items(), 1):
        n1_slug = N1_SLUGS.get(n1, slug(n1))
        n1_id = add_page(1, n1, n1_slug, f"/{n1_slug}/", 0, idx_n1, f"{n1_slug}/N1_{n1_slug}.txt")

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
                    )

    return pages


def main():
    pages = collect_all_pages()
    olas_012 = [p for p in pages if p["wave"] in (0, 1, 2)]

    xml_012_path = OUTPUT_DIR / "wordpress-import-olas-0-1-2.xml"
    xml_all_path = OUTPUT_DIR / "wordpress-import-completo-160.xml"

    xml_012_path.write_text(
        build_wxr_xml(olas_012, "Portal SAT Guatemala — Olas 0, 1 y 2 (31 Páginas Base)"),
        encoding="utf-8",
    )
    xml_all_path.write_text(
        build_wxr_xml(pages, "Portal SAT Guatemala — Árbol Completo (160 Páginas)"),
        encoding="utf-8",
    )

    print(f"Archivos WXR XML generados con éxito: {len(olas_012)} páginas en {xml_012_path.name} y {len(pages)} páginas en {xml_all_path.name}")


if __name__ == "__main__":
    main()
