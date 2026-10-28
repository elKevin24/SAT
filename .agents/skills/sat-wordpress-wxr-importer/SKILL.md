---
name: sat-wordpress-wxr-importer
description: >-
  Genera, audita y sincroniza paquetes XML de importación nativa de WordPress (formato WXR 1.2),
  plantillas de shortcodes WPBakery Page Builder + The7 Classic + Elementor Full Width (100% libres de
  [vc_raw_html]) y CSS por página (_wpb_post_custom_css) para el Portal SAT Guatemala. Úsalo cuando el
  usuario pida crear o actualizar archivos .xml para importar páginas en WordPress, ajustar jerarquías
  padre-hijo (post_parent) de Nivel 1 a Nivel 5, solucionar problemas de ancho completo (Elementor Full
  Width), corregir errores "Page already exists" o modificar src/pages/WPBakeryBuilderPage.tsx.
---

# SAT WordPress WXR Importer & WPBakery Builder Skill

Esta skill gobierna la generación y mantenimiento de los paquetes de importación **WordPress eXtended RSS (WXR 1.2 XML)** y las plantillas de **WPBakery Page Builder + The7 Classic** del Portal SAT Guatemala (`https://prototipo.sat.gob.gt`).

---

## 1. Cuándo Activar esta Skill

Activa y consulta esta skill siempre que debas:
1. Generar o actualizar archivos `.xml` de importación para **Herramientas › Importar › WordPress** (`docs/plantillas-wpbakery/*.xml` y `public/downloads/*.xml`).
2. Crear paquetes de prueba de **1 sola página**, paquetes por rama (**Nivel 3** o **Nivel 2 a Nivel 5**) o el catálogo completo.
3. Editar el generador interactivo en [`src/pages/WPBakeryBuilderPage.tsx`](../../../src/pages/WPBakeryBuilderPage.tsx) o los scripts [`scripts/generar_wpbakery_shortcodes.py`](../../../scripts/generar_wpbakery_shortcodes.py) y [`scripts/generar_wxr_wordpress.py`](../../../scripts/generar_wxr_wordpress.py).
4. Diagnosticar discrepancias visuales en WordPress (desborde al 100% del ancho con *Elementor Full Width*, migas de pan `[dt_breadcrumbs]` rotas, páginas huérfanas sin *Página Superior* o mensajes `"Page already exists"`).

---

## 2. Estándar Técnico Aprobado (WPBakery + The7 + Elementor Full Width)

### 2.1 Estructura Exacta del Shortcode por Página (`<content:encoded>`)
- **Cero `[vc_raw_html]`:** Prohibido usar bloques Raw HTML.
- **Fila 1 — Breadcrumb Automático de The7:**
  ```text
  [vc_row][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]
  ```
  *(Nota: No agregar `gap="5px"` al `[vc_row]` del breadcrumb).*
- **Fila 2 — Sección y Grilla de Tarjetas (`[bsf-info-box]`):**
  ```text
  [vc_section][vc_row gap="0px" el_class="sat-seccion-contribuyentes"][vc_column width="1/3" offset="vc_col-xl-inherit vc_col-lg-inherit vc_col-md-4 vc_col-sm-inherit"][bsf-info-box icon_type="none" title="Título" read_more="box" link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2F..."]Descripción en lenguaje ciudadano.[/bsf-info-box][/vc_column][vc_column width="1/3"][bsf-info-box icon_type="none" title="Título 2" read_more="box" link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2F..."]Descripción 2.[/bsf-info-box][/vc_column][/vc_row][/vc_section]
  ```
- **Codificación de Enlaces (`link="url:..."`):**
  - **Rutas internas de navegación jerárquica (Nivel 1 a Nivel 5 y Procesos Conectados):**
    Usar URL absoluta hacia `https://prototipo.sat.gob.gt` codificada con `urllib.parse.quote(full_url, safe='')` / `encodeURIComponent`:
    `link="url:https%3A%2F%2Fprototipo.sat.gob.gt%2Fcontribuyentes%2Fcontribuyente-general%2F..."`
  - **Enlaces externos hacia servicios transaccionales o páginas heredadas del portal SAT:**
    Usar `target:%20_blank|`:
    `link="url:https://portal.sat.gob.gt/portal/...||target:%20_blank|"`

### 2.2 Los 5 Metadatos `<wp:postmeta>` Obligatorios en cada `<item>`
Para que la página importada se vea idéntica al diseño original sin intervención manual:

```xml
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
      <wp:meta_value><![CDATA[/* CSS OFICIAL COMPLETO CON REGLA 0 DE CENTRADO */]]></wp:meta_value>
    </wp:postmeta>
```

### 2.3 Por qué es Obligatoria la Regla 0 (`.wpb-content-wrapper`) en `_wpb_post_custom_css`
El sitio `prototipo.sat.gob.gt` utiliza la plantilla **`Elementor Full Width` (`elementor_header_footer`)** para conservar el Header y Footer institucionales construidos en Elementor. Sin embargo, esa plantilla elimina el contenedor `.wf-wrap` de The7, provocando que el contenido de WPBakery se estire de borde a borde del monitor si no tiene límite de ancho.

Por ello, **todo bloque `_wpb_post_custom_css` debe incluir como Regla 0**:
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
Seguido de las reglas `1` a `10` de la sección correspondiente:
- **Contribuyentes (`.sat-seccion-contribuyentes`):** Hover `#14649B`, sombra `rgba(20, 100, 155, 0.22)`.
- **Operadores de Comercio Exterior (`.sat-seccion-comercio-exterior`):** Hover `#0284C7`, sombra `rgba(2, 132, 199, 0.22)`.
- **Profesionales (`.sat-seccion-profesionales`):** Hover `#4D8014`, sombra `rgba(77, 128, 20, 0.22)`.
- **Entes Exentos (`.sat-seccion-entes-exentos`):** Hover `#C25E00`, sombra `rgba(194, 94, 0, 0.22)`.

---

## 3. Gobernanza de Jerarquía (`post_parent`) y Funcionamiento del Importador de WordPress

### 3.1 Cómo Conecta WordPress las Páginas Hijas (`<wp:post_parent>`)
1. Cuando se sube un archivo `.xml` en **Herramientas › Importar › WordPress**, el importador procesa los `<item>` en orden secuencial.
2. Si un `<item>` padre (ej. `Contribuyente General` con `<wp:post_id>1015</wp:post_id>`) **ya existe** en WordPress (porque fue creado o importado antes), WordPress muestra:
   `Página “Contribuyente General” already exists.`
   **Pero internamente registra en su mapa `$this->processed_posts[1015] = <ID_REAL_EN_BD>`.**
3. Cuando inmediatamente después procesa una página hija con `<wp:post_parent>1015</wp:post_parent>`, WordPress reemplaza `1015` por el `<ID_REAL_EN_BD>` y **conecta automáticamente la página hija con su Página Superior existente**.
4. **Regla de Oro para paquetes XML de subniveles:**
   - **Siempre incluir los `<item>` ancestros en el mismo XML** (por ejemplo, incluir Nivel 2 y Nivel 3 cuando se importan Nivel 4 y Nivel 5) manteniendo sus `<wp:post_id>` canónicos inmutables:
     - `1015`: `Contribuyente General` (Nivel 2)
     - `1016`: `Inscripción y actualización en el RTU` (Nivel 3)
     - `1021`: `Facturación electrónica y documentos tributarios` (Nivel 3)
     - `1025`: `Declaraciones, pagos y solvencias` (Nivel 3)
     - `1029`: `Devoluciones y créditos fiscales` (Nivel 3)
     - `1033`: `Regímenes tributarios` (Nivel 3)
     - `1034`: `Vehículos (como propietario)` (Nivel 3)
     - `1041`: `Servicios y gestiones al contribuyente` (Nivel 3)
     - `1047`: `Cultura tributaria y capacitación` (Nivel 3)

### 3.2 Regla de Ramificación de Nivel 4 a Nivel 5 en los XML
Conforme a la **Ley de Miller ($7 \pm 2$)** y al umbral de densidad en `.agents/rules/sat-ia-governance.md`:
- Si un nodo de **Nivel 4** tiene **$\le 10$ gestiones** (o no tiene subdivisión en Nivel 5), la página de Nivel 4 muestra directamente las tarjetas de sus gestiones terminales.
- Si un nodo de **Nivel 4** tiene **$\ge 11$ gestiones** y **$\ge 2$ categorías de Nivel 5**, la página de Nivel 4 actúa como Hub hacia sus subpáginas de **Nivel 5** (`/nivel-1/nivel-2/nivel-3/nivel-4/nivel-5/`), y el XML genera automáticamente los `<item>` de Nivel 5 con `<wp:post_parent>` apuntando al `<wp:post_id>` de su Nivel 4.

### 3.3 Comportamiento ante `"Page already exists"` y Fechas (`<wp:post_date>`)
- WordPress verifica duplicados mediante `post_exists($title, '', $post_date)`.
- **Importante:** Si una página ya existe en WordPress, el importador **NO actualiza ni sobrescribe su contenido ni su plantilla**.
  - Si se desea **actualizar** el diseño o las tarjetas de una página que ya fue importada antes, primero debe enviarse a la **Papelera** en WordPress y **vaciar la Papelera** antes de reimportar (o bien pegar el shortcode/CSS directamente en el editor de esa página).
  - Si solo se están agregando **nuevos niveles hijos** (ej. agregar Nivel 4 y Nivel 5 debajo de un Nivel 3 que ya existe y está bien), **NO hace falta borrar nada**: WordPress saltará los niveles superiores existentes (`already exists`) y creará únicamente las páginas nuevas conectándolas debajo de los padres existentes.
- Siempre estampar la fecha y hora actual de generación en `<wp:post_date>` (hora local Guatemala) y `<wp:post_date_gmt>` (UTC).

### 3.4 Opciones de la Pantalla de Confirmación de WordPress Importer
Cuando el usuario pregunte qué marcar en la pantalla previa a `Submit` en WordPress:
1. **`Download and import file attachments`:** Desmarcado (`☐`), ya que las tarjetas usan CSS y SVG inline sin imágenes adjuntas.
2. **`Change all imported URLs that currently link to the previous site so that they now link to this site`:** Marcado (`☑`).

---

## 4. Catálogo de Entregables XML Sincronizados

Siempre mantener en sincronía biunívoca ambas ubicaciones (`docs/plantillas-wpbakery/` y `public/downloads/`):

| Archivo XML | Alcance | Páginas Incluidas |
| :--- | :--- | :---: |
| `wordpress-import-prueba-1-pagina.xml` | Prueba unitaria controlada de 1 sola página de *Contribuyente General* | **1 página** |
| `wordpress-import-contribuyente-general-n3.xml` | *Contribuyente General* (N2) + sus **8 subcategorías de Nivel 3** | **9 páginas** |
| `wordpress-import-contribuyente-general-completo.xml` | Árbol completo de *Contribuyente General* (**N2 + 8 N3 + 35 N4 + 33 N5**) | **77 páginas** |
| `wordpress-import-olas-0-1-2.xml` | Paquete troncal: Portada + 6 Procesos Conectados + 4 Nivel 1 + 20 Nivel 2 | **31 páginas** |
| `wordpress-import-completo-160.xml` | Catálogo general completo del Portal SAT | **160+ páginas** |

---

## 5. Bucle de Verificación (Verification Loop)

Después de modificar cualquier script generador, archivo `.xml` o [`src/pages/WPBakeryBuilderPage.tsx`](../../../src/pages/WPBakeryBuilderPage.tsx):
1. Verificar que todo `<item>` en los `.xml` contenga `<wp:meta_key><![CDATA[_wp_page_template]]></wp:meta_key>` con `elementor_header_footer`, `_wpb_vc_js_status` en `true` y la regla `.wpb-content-wrapper` con `max-width: 1200px !important;` dentro de `_wpb_post_custom_css`.
2. Verificar que existan `0` ocurrencias de `[vc_raw_html]` y `0` ocurrencias de la palabra prohibida *"trámite"* en títulos visibles.
3. Ejecutar `npm run build` para confirmar que TypeScript y el empaquetado de recursos `?raw` en Vite compilen sin errores.
