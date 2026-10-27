# Guía Operativa de Implementación: Portal SAT en WordPress + The7 Classic + WPBakery (100% Cero `[vc_raw_html]`)

Esta guía describe el procedimiento paso a paso, **100% manual (o asistido mediante importador XML nativo WXR), sin línea de comandos (CLI) y estrictamente SIN usar `[vc_raw_html]` (Raw HTML)**, para construir, maquetar y publicar las **160 páginas** de la Arquitectura de Información (**Nivel 1 a Nivel 5**) y los **6 procesos conectados de 3 pasos** del **Portal SAT Guatemala** en **WordPress** utilizando el tema **The7 (estilo Classic)** y **WPBakery Page Builder**.

---

## 1. Prerrequisitos y Configuración Inicial de WordPress

### 1.1 Componentes y Bloques Nativos Permitidos (Sin Raw HTML)
Asegúrate de que los siguientes componentes estén activos en WordPress:
1. **The7 Theme** (Dream-Theme) con preset **Classic** (`[dt_breadcrumbs]`, `[dt_fancy_title]`).
2. **WPBakery Page Builder** (`[vc_section]`, `[vc_row]`, `[vc_column]`, `[vc_custom_heading]`, `[vc_column_text]`, `[vc_tta_tabs]`, `[vc_tta_section]`, `[vc_message]`, `[vc_empty_space]`, `[vc_separator]`).
3. **Ultimate Addons for WPBakery Page Builder** (`[bsf-info-box icon_type="none" read_more="box"]`, utilizado como tarjeta clickeable nativa de WPBakery sin íconos ni botones redundantes).

> **Restricción Institucional Estricta:** Ninguna de las **160 plantillas** en `docs/plantillas-wpbakery/` utiliza `[vc_raw_html]`. Todo el portal se construye exclusivamente con shortcodes nativos de WPBakery + The7 y una sola hoja de estilos CSS en las opciones del tema.

### 1.2 Estructura de Enlaces Permanentes (*Permalinks*)
Para que las URLs jerárquicas y limpias (como `/solicitar-nit/` o `/contribuyentes/contribuyente-general/`) y los breadcrumbs automáticos `[dt_breadcrumbs]` funcionen sin colisiones:
1. Ve a **Ajustes > Enlaces permanentes**.
2. Selecciona la opción **Nombre de la entrada** (`/%postname%/`).
3. Guarda los cambios.

---

## 2. Paso 1: Integración del CSS Oficial del Design System SAT

Los shortcodes nativos de WPBakery (`[bsf-info-box]`, `[vc_tta_tabs]`, `[dt_breadcrumbs]`, `.sat-modalidad-card`) reciben automáticamente el diseño normativo del SAT (`bg-white`, `border: 1px solid #DCDCDC`, `border-radius: 14px`, cero íconos y **hover sólido institucional** con texto blanco) pegando la hoja de estilos maestra [`docs/diseno-normativa/sat-design-system-wpbakery.css`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/diseno-normativa/sat-design-system-wpbakery.css).

1. En tu panel de WordPress, dirígete a:  
   **The7 > Theme Options > Advanced > Custom CSS**  
   *(Alternativa nativa: Apariencia > Personalizar > CSS adicional)*.
2. Copia íntegramente el contenido de [`docs/diseno-normativa/sat-design-system-wpbakery.css`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/diseno-normativa/sat-design-system-wpbakery.css) (o cópialo con 1 clic desde la pestaña **Paso 1: CSS Maestro** en `http://localhost:3000/#/wpbakery`) y pégalo en el editor.
3. Haz clic en **Save Options** (o Publicar).

---

## 3. Paso 2: Estrategia de Creación de las 160 Páginas (Manual por Olas o Importador XML WXR)

Todas las páginas del catálogo comienzan en la línea 1 con `[dt_breadcrumbs font_style="italic:normal:none" alignment="left"]` y tienen los enlaces `link="url:..."` pre-configurados en cada tarjeta `[bsf-info-box]`.

Tienes **dos opciones** para crear las páginas en WordPress:

### Opción A: Creación Manual Guiada por Olas (`Ola 0` $\to$ `Ola 4`)
Sigue el orden estricto de arriba hacia abajo documentado en [`docs/PLAN_CREACION_PAGINAS_WORDPRESS.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/PLAN_CREACION_PAGINAS_WORDPRESS.md) o utiliza el **Planificador Interactivo (`http://localhost:3000/#/wpbakery`)** con botones **Anterior / Siguiente**, casillas de progreso persistente y copiado en 1 clic de **Título**, **Página Superior (Parent Page)**, **Slug** y **Shortcode**:

| Ola | Alcance | Cantidad de Páginas | Propósito |
| :--- | :--- | :---: | :--- |
| **Ola 0** | Portada (`/`) + **6 Procesos Conectados de 3 Pasos** | **7 páginas** | Habilita la portada y las 6 rutas universales de alta demanda ciudadana. |
| **Ola 1** | Páginas Raíz de **Nivel 1** | **4 páginas** | Crea las 4 páginas madre (`/contribuyentes/`, `/operadores-de-comercio-exterior/`, `/profesionales/`, `/entes-exentos/`). |
| **Ola 2** | Páginas de **Nivel 2** (hijas de Nivel 1) | **20 páginas** | Habilita los 20 perfiles de Nivel 2 y 5 listas directas compactadas. |
| **Ola 3** | Páginas de **Nivel 3** (hijas de Nivel 2) | **53 páginas** | Habilita las categorías de Nivel 3 y sus listas terminales. |
| **Ola 4** | Páginas de **Nivel 4** (hijas de Nivel 3) | **76 páginas** | Completa las subcategorías profundas de alta densidad (`Contribuyente General`, `Importadores`, `AFPA`). |

### Opción B: Acelerador Opcional mediante Importador Nativo de WordPress (`.xml` WXR)
Si tu usuario de WordPress tiene acceso a **Herramientas > Importar > WordPress**:
1. Descarga desde `docs/plantillas-wpbakery/` (o desde la pestaña **Opción Importador XML (WXR)** en `#/wpbakery`):
   - [`wordpress-import-olas-0-1-2.xml`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/plantillas-wpbakery/wordpress-import-olas-0-1-2.xml): Importa de una sola vez las **31 páginas troncales** (Olas 0, 1 y 2).
   - [`wordpress-import-completo-160.xml`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/plantillas-wpbakery/wordpress-import-completo-160.xml): Importa el **catálogo completo de 160 páginas** con su jerarquía `post_parent`, `slug` exacto, orden de menú y shortcodes WPBakery.
2. En WordPress, ve a **Herramientas > Importar > WordPress (Ejecutar importador)**, sube el archivo `.xml` y asigna las páginas a tu usuario editor.

---

## 4. Paso 3: Los 6 Procesos Universales Conectados en 3 Pasos (`Ola 0` — Sin `[vc_raw_html]`)

Para evitar redirecciones dispersas o ventanas modales (prohibidas por Regla 13), y cumpliendo la restricción de **cero `[vc_raw_html]`**, las 6 gestiones de mayor demanda se maquetan con pestañas nativas `[vc_tta_tabs]`, avisos `[vc_message]`, bloques `[vc_column_text]` y tarjetas de lanzamiento directo `[bsf-info-box]`:

| # | Título de Página | Slug (`(Sin superior — Nivel Raíz)`) | Plantilla WPBakery | Gestiones Canónicas Integradas |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Solicitar NIT** | `solicitar-nit` | `procesos-conectados/G_solicitar-nit.txt` | `SAT-GES-0001`, `0011`, `0049`, `0050`, `0051` |
| 2 | **Actualizar RTU** | `actualizar-rtu` | `procesos-conectados/G_actualizar-rtu.txt` | `SAT-GES-0002`, `0040`, `0054`, `0068`..`0076`, `0115`, `0118` |
| 3 | **Factura Electrónica (FEL)** | `factura-electronica-fel` | `procesos-conectados/G_factura-electronica-fel.txt` | `SAT-GES-0319`, `0498`, `0581` (`1. Habilitarse como Emisor`, `2. Emitir / Certificar DTE`, `3. Consultar / Anular DTE`) |
| 4 | **Solvencia Fiscal** | `solvencia-fiscal` | `procesos-conectados/G_solvencia-fiscal.txt` | `SAT-GES-0005`, `0336`, `0337` (`1. Verificar Omisos`, `2. Solicitar y Pagar Boleta SAT-8421`, `3. Descargar y Validar QR`) |
| 5 | **Traspaso de Vehículos** | `traspaso-vehiculos` | `procesos-conectados/G_traspaso-vehiculos.txt` | `SAT-GES-0269`, `0318`, `0568` (`1. Solvencia ISCV y Multas`, `2. Firma Electrónica Notarial / Agencia Virtual`, `3. Distintivos Electrónicos`) |
| 6 | **Padrón de Importadores** | `padron-importadores` | `procesos-conectados/G_padron-importadores.txt` | `SAT-GES-0344` (`1. Requisitos RTU y Domicilio`, `2. Registro en Agencia Virtual`, `3. Enlace con DUCA y AFPA`) |

---

## 5. Paso 4: Configuración del Menú Principal y Sidebar Contextual en The7

Conforme a la **Regla 5 de Desacoplamiento entre Profundidad de IA y Navegación** (`docs/diseno-normativa/DESIGN_RULES.md`):
- **Menú Superior (Header de The7):** Ve a **Apariencia > Menús** y agrega únicamente los **4 nodos de Nivel 1** (`Contribuyentes`, `Operadores de Comercio Exterior`, `Profesionales`, `Entes Exentos`) más un enlace a `Inicio`. Nunca despliegues menús flotantes de 4 o 5 niveles en la cabecera.
- **Miga de Pan Automática (`[dt_breadcrumbs]`):** Todas las 159 páginas internas incluyen `[dt_breadcrumbs font_style="italic:normal:none" alignment="left"]` en la primera línea de su plantilla, renderizando automáticamente la ruta completa gracias a la jerarquía **Página Superior (*Parent Page*)** de WordPress.
- **Plantilla de Página:**
  - En `Inicio`, las 6 páginas de procesos conectados y los 4 hubs de **Nivel 1**, utiliza `Default Template` (ancho completo sin barra lateral).
  - Opcionalmente, en páginas de **Nivel 3 y Nivel 4**, puedes activar la barra lateral izquierda de The7 con el widget nativo **Páginas** o **Menú de Navegación** para listar las subcategorías hermanas del mismo hub local.

---

## 6. Regeneración y Auditoría Automática de Plantillas

Cada vez que se actualice `src/data/allTramites.json`, ejecuta la suite de generación y verificación:
```bash
python scripts/generar_wpbakery_shortcodes.py
python scripts/generar_plan_paginas_wp.py
python scripts/generar_wxr_wordpress.py
python scripts/test_wpbakery_templates.py
```
Esto regenera y audita las **160 plantillas `.txt` libres de `[vc_raw_html]`**, los **2 paquetes `.xml` WXR**, el plan maestro de olas y el índice `_INDICE.md`.
