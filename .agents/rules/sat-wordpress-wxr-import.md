---
trigger: always_on
---

# Regla Oficial de Importación WordPress (WXR 1.2), WPBakery y The7 Classic (SAT)

Esta regla es de cumplimiento obligatorio antes de crear, editar o regenerar archivos XML de importación nativa de WordPress (`docs/plantillas-wpbakery/*.xml`, `public/downloads/*.xml`), plantillas de shortcodes WPBakery (`docs/plantillas-wpbakery/`), hojas CSS (`docs/diseno-normativa/sat-design-system-wpbakery.css`) o el generador web (`src/pages/WPBakeryBuilderPage.tsx`).

## 1. Arquitectura de Shortcodes Nativos (100% Cero `[vc_raw_html]`)
- **Prohibición absoluta de `[vc_raw_html]`:** Ninguna página o plantilla puede usar bloques de HTML crudo.
- **Línea 1 Obligatoria (Breadcrumb Automático):** Toda página interna inicia exactamente con:
  `[vc_row][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]`
  *(Sin `gap="5px"` en la fila del breadcrumb).*
- **Estructura de Sección y Fila de Tarjetas:**
  `[vc_section][vc_row gap="0px" el_class="sat-seccion-<segmento>"]...[/vc_row][/vc_section]`
  donde la primera columna incluye `offset="vc_col-xl-inherit vc_col-lg-inherit vc_col-md-4 vc_col-sm-inherit"` (o `vc_col-md-6` en grillas de `1/2`).
- **Tarjetas Clickeables (`[bsf-info-box]`):** Usar `icon_type="none"` (o `icon_size="32"` sin ícono asignado), `read_more="box"` y `link="url:..."`.
  - **Enlaces internos al prototipo:** Codificados con URL completa hacia `https://prototipo.sat.gob.gt`:
    `link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2Fcontribuyentes%2F..."`
  - **Enlaces externos oficiales:** Con apertura en nueva pestaña:
    `link="url:https://portal.sat.gob.gt/...||target:%20_blank|"`

## 2. Metadatos Obligatorios en cada `<item>` del XML (WXR 1.2)
Todo `<item>` de tipo `<wp:post_type><![CDATA[page]]></wp:post_type>` debe incluir estos **5 bloques `<wp:postmeta>`** para que WordPress, Elementor, The7 y WPBakery rendericen la página centrada y sin barras laterales:
1. **`_wp_page_template` = `elementor_header_footer`** (*Elementor Full Width*, conserva el Header y Footer institucional).
2. **`_dt_sidebar_position` = `disabled`** (desactiva la barra lateral de The7).
3. **`_dt_header_title` = `disabled`** (evita duplicar el título de cabecera de The7).
4. **`_wpb_vc_js_status` = `true`** (indica a WordPress que el editor activo de la página es WPBakery Page Builder).
5. **`_wpb_post_custom_css`** = Bloque CSS oficial completo de la sección (incluyendo obligatoriamente la regla `0. Contenedor centrado`).

## 3. Contenedor Centrado `1200px` en `_wpb_post_custom_css` (Anti-Desborde Full Width)
Dado que la plantilla `elementor_header_footer` (*Elementor Full Width*) elimina el contenedor `.wf-wrap` del tema The7, **todo bloque `_wpb_post_custom_css` debe iniciar obligatoriamente con la Regla 0 de centrado**:
```css
/* 0. Contenedor centrado idéntico al diseño original (independiente de Elementor Full Width) */
.wpb-content-wrapper,
.entry-content {
    max-width: 1200px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    padding-left: 24px !important;
    padding-right: 24px !important;
    box-sizing: border-box !important;
}
```
Seguido de las reglas `1` a `10` aprobadas para `.sat-seccion-contribuyentes` (`#14649B`), `.sat-seccion-comercio-exterior` (`#0284C7`), `.sat-seccion-profesionales` (`#4D8014`) o `.sat-seccion-entes-exentos` (`#C25E00`).

## 4. Reglas de Jerarquía Padre-Hijo (`post_parent`) y Anti-Bloqueo «Already Exists»
1. **Resolución automática de `post_parent` en importaciones por lotes:**
   - El importador nativo de WordPress mapea `<wp:post_parent>` buscando el `<wp:post_id>` del nodo padre dentro del mismo archivo XML (incluso si el padre ya existe en WordPress y el importador muestra *"already exists"*).
   - Por ello, todo paquete XML de subniveles (ej. Nivel 3, Nivel 4 y Nivel 5) **debe incluir los `<item>` de sus nodos ancestros** con los mismos `<wp:post_id>` canónicos (`1015` para *Contribuyente General*, `1016, 1021, 1025, 1029, 1033, 1034, 1041, 1047` para sus 8 hijos de Nivel 3), permitiendo que WordPress descubra el ID real del padre en la base de datos y conecte automáticamente todos los hijos sin intervención manual.
2. **Prevención del bloqueo `"Page already exists"` en pruebas unitarias:**
   - WordPress determina si una página ya existe comparando **Título exacto (`<title>`) + Fecha de publicación (`<wp:post_date>`)**.
   - En archivos de prueba o reimportación, actualizar siempre `<wp:post_date>` (hora local Guatemala) y `<wp:post_date_gmt>` (UTC), junto con un `<guid isPermaLink="false">` con sufijo de versión (`&amp;v=YYYYMMDDHHMMSS`).
   - Recordar que si una página ya existe en WordPress (incluso en la **Papelera**), el importador WXR **nunca sobrescribe su contenido**; para actualizar una página ya importada vía XML, primero debe eliminarse permanentemente de la Papelera en WordPress.

> **Skill de referencia técnica:** Consultar `.agents/skills/sat-wordpress-wxr-importer/SKILL.md`.
