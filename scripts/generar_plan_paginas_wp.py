import json
from collections import OrderedDict
from pathlib import Path
from generar_wpbakery_shortcodes import (
    TRAMITES_JSON,
    N1_SLUGS,
    slug,
    es_vacio,
    safe_order,
)

BASE_DIR = Path(__file__).parent.parent
PLAN_MD = BASE_DIR / "docs" / "PLAN_CREACION_PAGINAS_WORDPRESS.md"


def main():
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

    ola_0 = [
        {
            "no": 1,
            "titulo": "Inicio",
            "wp_slug": "inicio",
            "url": "/",
            "superior": "— (Sin superior / Portada estática)",
            "breadcrumb": "Inicio",
            "plantilla": "HOME_portada-portal-sat.txt",
        },
        {
            "no": 2,
            "titulo": "Solicitar Número de Identificación Tributaria (NIT)",
            "wp_slug": "solicitar-nit",
            "url": "/solicitar-nit/",
            "superior": "— (Sin superior)",
            "breadcrumb": "Inicio › Solicitar Número de Identificación Tributaria (NIT)",
            "plantilla": "procesos-conectados/G_solicitar-nit.txt",
        },
        {
            "no": 3,
            "titulo": "Actualizar o Ratificar Datos en el Registro Tributario Unificado (RTU Digital)",
            "wp_slug": "actualizar-rtu",
            "url": "/actualizar-rtu/",
            "superior": "— (Sin superior)",
            "breadcrumb": "Inicio › Actualizar o Ratificar Datos en el Registro Tributario Unificado (RTU Digital)",
            "plantilla": "procesos-conectados/G_actualizar-rtu.txt",
        },
    ]

    ola_1 = []
    ola_2 = []
    ola_3 = []
    ola_4 = []

    n1_groups = OrderedDict()
    for t in tramites_sorted:
        n1 = t.get("nivel1") or "Contribuyentes"
        n1_groups.setdefault(n1, []).append(t)

    for n1, n1_items in n1_groups.items():
        n1_slug = N1_SLUGS.get(n1, slug(n1))
        ola_1.append({
            "titulo": n1,
            "wp_slug": n1_slug,
            "url": f"/{n1_slug}/",
            "superior": "— (Sin superior)",
            "breadcrumb": f"Inicio › {n1}",
            "plantilla": f"{n1_slug}/N1_{n1_slug}.txt",
        })

        n2_groups = OrderedDict()
        for t in n1_items:
            n2 = t.get("nivel2") or "General"
            n2_groups.setdefault(n2, []).append(t)

        for n2, n2_items in n2_groups.items():
            n2_slug = slug(n2)
            n3_groups = OrderedDict()
            for t in n2_items:
                n3 = t.get("nivel3") or "—"
                if not es_vacio(n3):
                    n3_groups.setdefault(n3, []).append(t)

            ola_2.append({
                "n1": n1,
                "titulo": n2,
                "wp_slug": n2_slug,
                "url": f"/{n1_slug}/{n2_slug}/",
                "superior": n1,
                "breadcrumb": f"Inicio › {n1} › {n2}",
                "tipo": "Lista Directa de Gestiones" if not n3_groups else f"Hub hacia {len(n3_groups)} páginas de Nivel 3",
                "plantilla": f"{n1_slug}/N2_{n2_slug}.txt",
            })

            for n3, n3_items in n3_groups.items():
                n3_slug = slug(n3)
                n4_groups = OrderedDict()
                for t in n3_items:
                    n4 = t.get("nivel4") or "—"
                    if not es_vacio(n4):
                        n4_groups.setdefault(n4, []).append(t)

                ola_3.append({
                    "n1": n1,
                    "n2": n2,
                    "titulo": n3,
                    "wp_slug": n3_slug,
                    "url": f"/{n1_slug}/{n2_slug}/{n3_slug}/",
                    "superior": f"{n2} (bajo {n1})",
                    "breadcrumb": f"Inicio › {n1} › {n2} › {n3}",
                    "tipo": f"Lista Directa ({len(n3_items)} gestiones)" if not n4_groups else f"Hub hacia {len(n4_groups)} páginas de Nivel 4",
                    "plantilla": f"{n1_slug}/{n2_slug}/N3_{n3_slug}.txt",
                })

                for n4, n4_items in n4_groups.items():
                    n4_slug = slug(n4)
                    ola_4.append({
                        "n1": n1,
                        "n2": n2,
                        "n3": n3,
                        "titulo": n4,
                        "wp_slug": n4_slug,
                        "url": f"/{n1_slug}/{n2_slug}/{n3_slug}/{n4_slug}/",
                        "superior": f"{n3} (bajo {n2})",
                        "breadcrumb": f"Inicio › {n1} › {n2} › {n3} › {n4}",
                        "gestiones": len(n4_items),
                        "plantilla": f"{n1_slug}/{n2_slug}/{n3_slug}/N4_{n4_slug}.txt",
                    })

    total = len(ola_0) + len(ola_1) + len(ola_2) + len(ola_3) + len(ola_4)

    lines = [
        "# Plan Maestro de Creación de Páginas, Enlaces y Breadcrumbs en WordPress + WPBakery\n\n",
        "Este documento organiza en **5 Olas Secuenciales (de arriba hacia abajo: Padres → Hijos)** las **156 páginas** del Portal SAT Guatemala en WordPress con **The7 Classic + WPBakery (0% `[vc_raw_html]`)**.\n\n",
        "## ¿Por qué este orden garantiza que los Enlaces y el Breadcrumb funcionen al 100% desde el primer momento?\n\n",
        "1. **Cómo arma WordPress + The7 el Breadcrumb (`[dt_breadcrumbs]`):**\n",
        "   - El shortcode `[dt_breadcrumbs font_style=\"italic:normal:none\" alignment=\"left\"]` **ya viene incluido en la línea 1 de las 156 plantillas**.\n",
        "   - The7 construye la miga de pan automáticamente leyendo el campo **Atributos de página › Superior (*Parent Page*)** de WordPress:\n",
        "     - **Página de Nivel 1** (Superior: *Sin superior*) → Breadcrumb: `Inicio › Contribuyentes`\n",
        "     - **Página de Nivel 2** (Superior: *Contribuyentes*) → Breadcrumb: `Inicio › Contribuyentes › Contribuyente General`\n",
        "     - **Página de Nivel 3** (Superior: *Contribuyente General*) → Breadcrumb: `Inicio › Contribuyentes › Contribuyente General › Vehículos (como propietario)`\n",
        "     - **Página de Nivel 4** (Superior: *Vehículos (como propietario)*) → Breadcrumb: `Inicio › Contribuyentes › Contribuyente General › Vehículos (como propietario) › Traspasos de vehículos`\n",
        "2. **Cómo se conectan las URLs automáticamente sin editar enlaces a mano:**\n",
        "   - Con **Ajustes › Enlaces permanentes › Nombre de la entrada (`/%postname%/`)**, cuando asignas la **Página Superior** y pones el **Slug** indicado en las tablas de abajo, WordPress genera **exactamente la misma URL jerárquica** (`/nivel-1/nivel-2/nivel-3/nivel-4/`) que ya tienen configuradas todas las tarjetas `[bsf-info-box]` en las plantillas.\n\n",
        "---\n\n",
        "## Resumen de las 5 Olas de Creación (156 Páginas Totales)\n\n",
        f"| Ola de Trabajo | Nivel Jerárquico | Cantidad de Páginas | Atributo «Página Superior» en WordPress | Resultado en Breadcrumb (`[dt_breadcrumbs]`) |\n",
        "| :--- | :--- | :---: | :--- | :--- |\n",
        f"| **Ola 0** | Portada y Procesos Universales | **{len(ola_0)}** | `(Sin superior)` | `Inicio › [Título]` |\n",
        f"| **Ola 1** | **Nivel 1** | **{len(ola_1)}** | `(Sin superior)` | `Inicio › [Nivel 1]` |\n",
        f"| **Ola 2** | **Nivel 2** | **{len(ola_2)}** | Su página de **Nivel 1** | `Inicio › [Nivel 1] › [Nivel 2]` |\n",
        f"| **Ola 3** | **Nivel 3** | **{len(ola_3)}** | Su página de **Nivel 2** | `Inicio › [Nivel 1] › [Nivel 2] › [Nivel 3]` |\n",
        f"| **Ola 4** | **Nivel 4** | **{len(ola_4)}** | Su página de **Nivel 3** | `Inicio › [Nivel 1] › [Nivel 2] › [Nivel 3] › [Nivel 4]` |\n",
        f"| **TOTAL** | **Árbol Completo** | **{total}** | **100% Jerárquico** | **100% Automático** |\n\n",
        "---\n\n",
        "## OLA 0: Portada y Páginas Universales de Proceso Conectado (3 Páginas)\n\n",
        "| # | Título de la Página en WordPress | Slug (`post_name`) | Página Superior | URL Resultante | Breadcrumb Automático | Archivo Plantilla |\n",
        "| :---: | :--- | :--- | :--- | :--- | :--- | :--- |\n",
    ]

    for p in ola_0:
        lines.append(
            f"| {p['no']} | **{p['titulo']}** | `{p['wp_slug']}` | {p['superior']} | `{p['url']}` | `{p['breadcrumb']}` | `{p['plantilla']}` |\n"
        )

    lines.extend([
        "\n---\n\n",
        "## OLA 1: Creación de las 4 Páginas de Nivel 1 (Raíces del Árbol)\n\n",
        "> **Importante:** Crea primero estas 4 páginas con **Superior: (Sin superior)** para que aparezcan en el desplegable al crear las páginas de Nivel 2.\n\n",
        "| # | Título de la Página (Nivel 1) | Slug en WP | Página Superior | URL Resultante | Breadcrumb Automático | Archivo Plantilla |\n",
        "| :---: | :--- | :--- | :--- | :--- | :--- | :--- |\n",
    ])

    for idx, p in enumerate(ola_1, 1):
        lines.append(
            f"| 1.{idx} | **{p['titulo']}** | `{p['wp_slug']}` | {p['superior']} | `{p['url']}` | `{p['breadcrumb']}` | `{p['plantilla']}` |\n"
        )

    lines.extend([
        "\n---\n\n",
        f"## OLA 2: Creación de las {len(ola_2)} Páginas de Nivel 2 (Hijas de Nivel 1)\n\n",
        "> **Instrucción en WordPress:** En el panel derecho **Atributos de página › Superior**, selecciona la página de **Nivel 1** indicada en la columna *Página Superior*.\n\n",
        "| # | Página Superior (Nivel 1) | Título de la Página (Nivel 2) | Slug en WP | URL Jerárquica Generada | Breadcrumb Automático (`[dt_breadcrumbs]`) | Tipo de Contenido | Archivo Plantilla |\n",
        "| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n",
    ])

    for idx, p in enumerate(ola_2, 1):
        lines.append(
            f"| 2.{idx} | {p['superior']} | **{p['titulo']}** | `{p['wp_slug']}` | `{p['url']}` | `{p['breadcrumb']}` | {p['tipo']} | `{p['plantilla']}` |\n"
        )

    lines.extend([
        "\n---\n\n",
        f"## OLA 3: Creación de las {len(ola_3)} Páginas de Nivel 3 (Hijas de Nivel 2)\n\n",
        "> **Instrucción en WordPress:** En **Atributos de página › Superior**, selecciona la página de **Nivel 2** correspondiente.\n\n",
        "| # | Página Superior (Nivel 2) | Título de la Página (Nivel 3) | Slug en WP | URL Jerárquica Generada | Breadcrumb Automático (`[dt_breadcrumbs]`) | Comportamiento | Archivo Plantilla |\n",
        "| :---: | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n",
    ])

    for idx, p in enumerate(ola_3, 1):
        lines.append(
            f"| 3.{idx} | **{p['n2']}** *({p['n1']})* | **{p['titulo']}** | `{p['wp_slug']}` | `{p['url']}` | `{p['breadcrumb']}` | {p['tipo']} | `{p['plantilla']}` |\n"
        )

    lines.extend([
        "\n---\n\n",
        f"## OLA 4: Creación de las {len(ola_4)} Páginas de Nivel 4 (Hijas de Nivel 3)\n\n",
        "> **Instrucción en WordPress:** En **Atributos de página › Superior**, selecciona la página de **Nivel 3** correspondiente. Con esto el breadcrumb mostrará automáticamente los 4 niveles (`Inicio › Nivel 1 › Nivel 2 › Nivel 3 › Nivel 4`).\n\n",
        "| # | Página Superior (Nivel 3) | Título de la Página (Nivel 4) | Slug en WP | URL Jerárquica Generada | Breadcrumb Automático (`[dt_breadcrumbs]`) | Gestiones | Archivo Plantilla |\n",
        "| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- |\n",
    ])

    for idx, p in enumerate(ola_4, 1):
        lines.append(
            f"| 4.{idx} | **{p['n3']}** *({p['n2']})* | **{p['titulo']}** | `{p['wp_slug']}` | `{p['url']}` | `{p['breadcrumb']}` | {p['gestiones']} | `{p['plantilla']}` |\n"
        )

    PLAN_MD.write_text("".join(lines), encoding="utf-8")
    print(f"Plan maestro generado: {PLAN_MD} ({total} páginas: Ola0={len(ola_0)}, Ola1={len(ola_1)}, Ola2={len(ola_2)}, Ola3={len(ola_3)}, Ola4={len(ola_4)})")


if __name__ == "__main__":
    main()
