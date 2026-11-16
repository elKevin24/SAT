# Hallazgos Técnicos en Fuentes Vivas SAT — Fase 3 · Ola 3 (`22` URLs)

Durante la extracción en vivo (`HTTP 200 OK`) y el análisis estructural de las **22 páginas de la Ola 3** (*Importadores y Operador Económico Autorizado*), se detectaron y subsanaron las siguientes incidencias técnicas en el HTML fuente del portal institucional (`https://portal.sat.gob.gt`):

---

## 1. URLs Malformadas o Truncadas en el HTML Fuente

1. **`requisitos-para-inscripccion-en-el-registro-de`** (`https://portal.sat.gob.gt/portal/requisitos-para-inscripccion-en-el-registro-de-importadores/`)
   - **Hallazgo 1 (Espacio en blanco dentro del `href`):** El segundo enlace hacia el Manual de Procedimientos en la sección de permisos temporales tiene un espacio en blanco en medio de la ruta:
     `https://portal.sat.gob.gt/portal/manual-de-procedimientos-de-la-intendencia-de aduanas/#1604420674940-61c1f01c-3d8c`
   - **Hallazgo 2 (Correo institucional en texto plano sin `mailto:`):** El correo `padrondeimportadores@sat.gob.gt` aparece en el párrafo de permisos temporales sin etiqueta `<a href="mailto:...">`.
   - **Acción estructural aplicada:** Se normalizó el enlace malformado hacia la URL canónica válida (`https://portal.sat.gob.gt/portal/manual-de-procedimientos-de-la-intendencia-de-aduanas/#1604420674940-61c1f01c-3d8c`) y se incorporó el enlace accionable `mailto:padrondeimportadores@sat.gob.gt`.

2. **`recepcion-de-seguro-de-caucion-importacion-y`** (`https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/recepcion-de-seguro-de-caucion-importacion-y-admision-temporal/`)
   - **Hallazgo (Dominio truncado en `mailto:`):** En la tabla de requisitos del acordeón (`Contribuyente`), el enlace de correo electrónico fue publicado como `<a href="mailto:solicitudesure@sat.gob.g">solicitudesure@sat.gob.g</a>` (omitiendo la letra `t` final del dominio `.gob.gt`).
   - **Acción estructural aplicada:** Se corrigió y normalizó tanto en el inventario extraído como en el esqueleto estructural a `mailto:solicitudesure@sat.gob.gt` (`solicitudesure@sat.gob.gt`).

3. **`rescate-de-mercancias-caidas-en-abandono-7ba554`** (`https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/rescate-de-mercancias-caidas-en-abandono/`)
   - **Hallazgo (Sufijo erróneo en nombre de archivo PDF):** El enlace al procedimiento `PR-IAD-DNO-ADU-GOA-O6` apunta literalmente a:
     `https://portal.sat.gob.gt/portal/descarga/4567/gestiones-o-autorizaciones-especiales/47622/pr-iad-dno-adu-goa-o6-procedimiento-para-el-rescate-subasta-y-venta-de-mercancias-caidas-en-abandono.pdfas%20(1).pdf`
   - **Acción estructural aplicada:** Se conserva la URL literal de descarga publicada en el gestor documental de la SAT para mantener paridad 1:1, etiquetando claramente el botón como documento `(PDF)`.

---

## 2. Documentos Ocultos en Visores Interactivos DearFlip (`window.df_option_*`)

En tres páginas de la Ola 3, la fuente viva utiliza botones `<a class="_df_button" href="#">` cuyo archivo PDF real está incrustado únicamente dentro de un bloque `<script class="df-shortcode-script">` (`window.df_option_*`). Dado que la maquila WPBakery prohíbe `<script>` y visores embebidos, se rescataron las URLs directas de los PDFs desde el objeto JSON del visor para convertirlos en tarjetas/botones de descarga directa:

1. **`estudio-de-tiempos-de-despacho` (Sub-lote 3A):**
   - `https://portal.sat.gob.gt/portal/descarga/12718/facilitacion-de-comercio/74294/broshure-resultados-plan-2020-2023.pdf` (*Brochure de Resultados del Plan de Acción Nacional 2020-2023*)
   - `https://portal.sat.gob.gt/portal/wp-content/uploads/2025/03/Preguntas-Frecuentes.pdf` (*Preguntas Frecuentes del Estudio de Tiempos de Despacho*)
   *(Los otros dos visores DearFlip apuntan a los mismos PDFs ya listados en la tabla del acordeón).*

2. **`documentacion-a-presentar-ante-la-aduana-de` (Sub-lote 3B):**
   - `https://portal.sat.gob.gt/portal/descarga/15931/aduana-central-de-aviacion/64826/trifoliar-aduana-de-vehiculos.pdf` (*Trifoliar informativo de Aduana de Vehículos*)

3. **`franquicias-electronicas` (Sub-lote 3B):**
   - `https://portal.sat.gob.gt/portal/descarga/15356/documentos-guia-u-orientacion/81600/dg-iad-dno-adu-goa-16-doc-general-orient-usuario-externo-sol-franquicias-electronicas-3.pdf` (*Documento técnico de orientación al usuario externo para solicitudes de Franquicia Electrónica DG-IAD-DNO-ADU-GOA-16*)
   - `https://portal.sat.gob.gt/portal/descarga/4565/gestion-de-despacho/67041/res-sat-1009-2020.pdf` (*Resolución de Superintendencia SAT-DSI-1009-2020*)

---

## 3. Reemplazo de `<iframe>` (Aplicativos y Videos con Carga Diferida)

Conforme a la regla de **0% `<iframe>`**, se extrajeron los atributos `src` y `data-lazy-src` de todos los marcos embebidos para transformarlos en botones de acción (`[vc_btn]`) hacia su URL canónica:
- **`consultas-aduanas--monitoreo-historico` (Sub-lote 3A):** `https://farm4.sat.gob.gt/dashboard-aduanas/selectivo.xhtml`
- **`declaracion-unica-centroamericana-duca` (Sub-lote 3A):** Video oficial `https://www.youtube.com/watch?v=eZ9LLMEhF4M`
- **`union-aduanera` (Sub-lote 3B):** Video tutorial FYDUCA `https://www.youtube.com/watch?v=fEMnrifYzAI`
- **`franquicias-electronicas` (Sub-lote 3B):** 4 videos formativos en YouTube (`VCZXnJjmgco`, `oaXHogezIkA`, `MO_D1g0yMic`, `MsHZh2KNfJM`).

---

## 4. Exclusión de Metadatos `.post-meta` y Previsualizaciones Redundantes WPFD

1. **Páginas publicadas como entradas (`post`) en WordPress:**
   - Las páginas bajo `/portal/requisitos-tramites-aduanas/...` y `/portal/requisitos-tramites-agencias/...` incluyen una barra `.post-meta` del tema The7 con enlaces al archivo por fecha de publicación (ej. `/portal/2018/06/05/`) y al listado del autor. Dichos enlaces de plantilla fueron excluidos antes de construir `links_planos` (registrándose en `links_post_meta_excluidos` para trazabilidad).
2. **Biblioteca WP File Download en `alza-e-importacion-vehiculos--alza-importacion-vehiculos` (Categoría `1683`):**
   - Se paginaron vía AJAX los **219 documentos PDF** completos de la categoría `1683`. Los 20 enlaces redundantes a `docs.google.com/viewer?...&preview=1` de la primera página estática se aislaron en `wpfd_previews_excluidos`, conservando las **219 URLs directas de descarga** en `links_planos`.
