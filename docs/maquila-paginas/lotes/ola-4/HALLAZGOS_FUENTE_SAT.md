# Hallazgos Técnicos en Fuentes Vivas SAT — Fase 3 · Ola 4 (`27` URLs)

Durante la extracción en vivo (`HTTP 200 OK` en las `27/27` páginas) y el diseño estructural de la **Ola 4** (*Exportadores, Auxiliares de la Función Pública Aduanera y Regímenes Especiales*), se identificaron y subsanaron los siguientes hallazgos técnicos en el HTML fuente de `https://portal.sat.gob.gt`:

---

## 1. Cambio de ID de Ancla en Fuente Viva (`facilitacion-de-comercio--declaracion-anticipada`)

- **URL en inventario:** `https://portal.sat.gob.gt/portal/facilitacion-de-comercio/#1559325573466-1284efd5-2d1b`
- **Hallazgo:** En el HTML vivo actual de `/portal/facilitacion-de-comercio/`, el administrador web de la SAT renombró el atributo `id` del panel de acordeón de `1559325573466-1284efd5-2d1b` a `DeclaraciónAnticipada` (`<div class="vc_tta-panel" id="DeclaraciónAnticipada">`).
- **Acción estructural aplicada:** Se aisló el panel `#DeclaraciónAnticipada` en `fuentes_extraidas_4b.json` (preservando la trazabilidad con `ancla_original_matriz: "1559325573466-1284efd5-2d1b"`), extrayendo de forma exacta los **13 documentos y resoluciones** exclusivos de Declaración Anticipada sin contaminar la página con los otros 8 acordeones de Facilitación del Comercio.

---

## 2. Rescate de Presentaciones Ocultas en Visores DearFlip (`subastas-y-donaciones-aduaneras`)

- **URL:** `https://portal.sat.gob.gt/portal/subastas-y-donaciones-aduaneras/`
- **Hallazgo:** Tres presentaciones de partidas de subastas y donaciones están publicadas como botones `<a class="_df_button" href="#">` cuyo enlace real al archivo PDF se encuentra únicamente dentro de bloques `<script class="df-shortcode-script">` (`window.df_option_*`):
  1. `https://portal.sat.gob.gt/portal/wp-content/uploads/2026/11/PRESENTACION-SUBASTA-NO.-GRC-08-2026.pdf` (*Presentación de Mercancías No. GRC-08-2026*)
  2. `https://portal.sat.gob.gt/portal/descarga/16549/grn/97320/4-presentacion-mercancias-en-donacion-spa-grn-05-2026` (*Presentación de mercancías en donación SPA GRN-05-2026*)
  3. `https://portal.sat.gob.gt/portal/descarga/16513/grs/97285/4-presentacion-donacion-grs-03-2026-2` (*Presentación de Donación GRS-03-2026*)
- **Acción estructural aplicada:** Se extrajeron las 3 URLs directas desde el JSON de DearFlip y se incorporaron como botones de descarga directa `(PDF)` dentro de las secciones regionales correspondientes (`26/26` enlaces totales).

---

## 3. Reemplazo de Diagrama en Imagen por Pasos Estructurados (`efactura`)

- **URL:** `https://portal.sat.gob.gt/portal/efactura/`
- **Hallazgo:** El flujo de emisión del Régimen de Factura Electrónica en Línea (FEL) se presenta únicamente mediante la imagen estática `https://portal.sat.gob.gt/portal/wp-content/uploads/2026/01/PROCESO-DE-EMISION-FEL.jpg`.
- **Acción estructural aplicada:** En cumplimiento de WCAG 2.2 AA y de la regla de reemplazo accesible de diagramas, se estructuró el paso a paso textual completo de emisión, transmisión, certificación y conservación de Documentos Tributarios Electrónicos (DTE), conservando además el enlace a la infografía original para paridad 1:1 (`15/15` enlaces).

---

## 4. Transición del Formulario `SAT-0471` al Nuevo Registro de Exportadores en Agencia Virtual (`Sub-lote 4A`)

- **Páginas involucradas:** Las fichas históricas de inscripción habitual, actualización y cambio entre Régimen Especial y Régimen Optativo de Devolución de Crédito Fiscal hacen referencia al formulario `SAT-0471` y contienen el enlace genérico `https://portal.sat.gob.gt/portal/` en el paso 1, mientras que `registro-de-exportadores-en-agencia-virtual` documenta la sustitución del `SAT-0471` (vigente desde el 4 de marzo de 2025) por el nuevo módulo en Agencia Virtual (`Servicios al Contribuyente > RTU > Otros Registros de SAT > Registro de Exportadores`) junto con sus 4 manuales PDF.
- **Acción estructural aplicada:** Se conservaron el 100% de las URLs extraídas en cada ficha (para garantizar paridad 1:1 auditable) y se estructuraron las fichas con notas de orientación clara sobre el flujo electrónico en Agencia Virtual.
