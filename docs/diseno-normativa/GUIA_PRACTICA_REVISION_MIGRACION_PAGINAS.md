# Guía Práctica de Revisión y Migración de Páginas (Modelo ATO + NN/g + SAT)

> **Propósito:** Esta guía está diseñada para que cualquier persona del equipo pueda abrir una página actual de `portal.sat.gob.gt`, revisarla elemento por elemento y transformarla al estándar ciudadano del nuevo Portal SAT.

---

## Paso 1: Haz el inventario real de la página original (Antes de diseñar)

Abre la URL oficial en el portal actual y anota **todo** lo que contiene:
- [ ] Título y texto introductorio.
- [ ] Enlaces a subpáginas internas o a otros servicios del portal.
- [ ] Archivos descargables individuales (PDF, XLSX, ZIP) y su fecha de corte vigente.
- [ ] Tablas, listados de requisitos, directorios y preguntas frecuentes.
- [ ] Acuerdos, decretos o resoluciones citados en esa página.
- [ ] Imágenes, diagramas de flujo y botones de tiendas de aplicaciones.

### Reglas de oro del inventario
1. **No inventes contenido:** Si la página original no tiene requisitos o pasos propios, no los agregues por tu cuenta.
2. **No heredes bloques ajenos:** Si una subpágina (por ejemplo, *Documentación técnica* o *Preguntas frecuentes*) no tiene base legal en el original, no le pegues el bloque legal de la página principal.
3. **No absorbas servicios hermanos:** Si un enlace lleva a un servicio de nivel superior con acceso propio en la portada del portal (ejemplo: *Verificador Integrado*), no lo metas como subpágina interna de este tema.
4. **Verifica cada enlace:** Confirma que abra (`HTTP 200 OK`) y que los listados periódicos apunten al corte más reciente.

---

## Paso 2: Decide qué hacer con cada elemento que ves en la página

Usa esta tabla de decisiones rápidas mientras recorres la página de arriba hacia abajo:

| Lo que ves en la página original | Regla ATO / NN/g / SAT que aplicas | Qué debes decidir y hacer |
| :--- | :--- | :--- |
| **1. Título principal (`<h1>`)** | *Front-Loading* + *Sentence Case* + Cero acrónimos huérfanos | Si es página operativa, inicia con verbo en infinitivo en las primeras 3 palabras (*«Habilitarme como emisor...»*). Si es Hub, usa el nombre claro del servicio. Expande siglas en 1.ª mención. Quita badges `pill` decorativos. |
| **2. "Historia" o párrafo burocrático inicial** *(ej. "Creado mediante Acuerdo 13-2018 el 23 de mayo...")* | **Regla del 50%** (NN/g) + *Lead with the need* (ATO) | **Corta el relleno burocrático:** saca fechas de creación, números de acuerdo y cortesía institucional de la introducción. Deja máximo **2 oraciones directas**: qué hace y para qué le sirve al ciudadano. |
| **3. Acuerdos, leyes o resoluciones arriba** | **Capas ATO** (Capa 3: Certeza jurídica al pie) | **Bájalos al pie de página** dentro de un acordeón colapsable (`<details>`), solo en las vistas que sí los tienen en el original. |
| **4. Un archivo suelto o tabla de 1 fila** *(ej. "Presentación Generalidades" o "Renuentes FEL")* | **Cero clics pasarela** + Jerarquía visual | **No** lo pongas en el menú lateral ni como tarjeta principal del Hub. Colócalo abajo en un bloque secundario (*Documentos de consulta directa*) indicando el formato `(PDF)`, `(XLSX)` y la fecha de corte. |
| **5. Enlaces a subpáginas** *(ej. Emisor, Certificador, Técnica, Auditor, FAQ)* | **Menú lateral ATO** + Simetría **1:1** | En **subpáginas**, van en el menú lateral `"En esta sección"` (acordeón en móvil). En el **Hub**, van como tarjetas limpias (solo Título + Descripción máx. 2 oraciones; cero íconos, cero conteos, cero botones internos). |
| **6. Botones repetidos en el título del Hub** | **Pirámide invertida** + Cero redundancia | Si las acciones ya están en las tarjetas de abajo, **no** dupliques botones en el `<header>` del Hub. |
| **7. Diagramas o flujos en imagen (`.jpg`/`.png`)** | **WCAG 2.2 AA** + *Structuring content* (ATO) | **Reemplaza la imagen por texto estructurado:** escribe los pasos en una lista ordenada (`<ol>`) legible en móvil y por lectores de pantalla. |
| **8. Logos de tiendas de apps** | **Accesibilidad** + Enlaces explícitos | Conviértelos en enlaces de texto claros (`Google Play (Android)`, `App Store (iOS)`, `AppGallery (Huawei)`) con altura táctil mínima de `44px`. |
| **9. Requisitos o pasos en párrafos largos** | **Regla del 79%** (NN/g: *Visual Chunking*) | Divide todo párrafo denso en listas numeradas (`<ol>`) o viñetas cortas con **negrita inicial**. |
| **10. Directorios, catálogos o comparativas** | **Tablas semánticas** (ATO) + *Responsive* | Usa `<table>` con `<caption>` y `<th scope="col">` en escritorio, y bloques apilados en móvil. Limpia correos ofuscados (`[email protected]`) y deja solo datos reales. |
| **11. Preguntas Frecuentes extensas (+15)** | **Divulgación progresiva** (NN/g) | Agrega un **buscador/filtro rápido**, agrupa por tema y usa **acordeones colapsables (`<details>`)** con enlaces y correos `mailto:` reales dentro de las respuestas. |

---

## Paso 3: Revisa el Lenguaje Claro (Checklist NN/g + SAT)

Antes de dar por bueno el texto, verifica estos 5 puntos:
- [ ] **Cero «trámite» / «trámites»:** reemplázalo siempre por **«gestión» / «gestiones»** o el verbo directo (*solicitar*, *actualizar*, *consultar*).
- [ ] **Siglas expandidas en 1.ª mención:** ejemplo: `Documentos Tributarios Electrónicos (DTE)`, `Registro Tributario Unificado (RTU)`, `Número de Identificación Tributaria (NIT)`.
- [ ] **Lenguaje ciudadano (sin jerga interna):** escribe como le hablarías a una persona que no es contadora ni abogada.
- [ ] **Enlaces que predicen el destino:** evita *"clic aquí"* o *"ver más"*; usa textos concretos (*"Descargar manual de emisión (PDF)"*).
- [ ] **Oraciones cortas:** si una oración pasa de 20–25 palabras o tiene 3 comas encadenadas, divídela en dos o conviértela en viñetas.

---

## Paso 4: Ejemplo real aplicado (Caso FEL)

- **Antes (Portal SAT original `efactura`):**
  > *"Creado a través del Acuerdo de Directorio Número 13-2018, vigente desde el 23 de mayo del año 2018. El Régimen FEL es el modelo operativo... el cual comprende la emisión... a los que se les denomina DTE..."* + tabla con 3 acuerdos arriba + tabla de 1 fila para Generalidades + imagen `.jpg` del flujo + enlace suelto de Renuentes.
- **Después (Modelo ATO + NN/g + SAT):**
  - **Encabezado:** `Régimen de Factura Electrónica en Línea (FEL)` + 2 oraciones claras + enlaces a App FEL (`Google Play`, `App Store`, `AppGallery`).
  - **Tarjetas del Hub (5 secciones reales 1:1 con el menú lateral):** `Habilitarme como emisor`, `Elegir certificador`, `Integrar sistemas contables`, `Auditor de seguridad`, `Resolver dudas frecuentes`.
  - **Flujo accesible:** Lista `<ol>` de 4 pasos en lugar de la imagen `.jpg`.
  - **Bloque secundario abajo:** *Documentos de consulta directa* (`Presentación interactiva (PDF)` y `Lista de Renuentes FEL al 31-10-2026`).
  - **Al pie:** `<details>` colapsable con los 3 Acuerdos de Directorio (`13-2018`, `26-2019`, `15-2020`), **mostrado únicamente en el Hub** (no en subpáginas que no lo traen).

---

## Paso 5: Verificación técnica antes de cerrar

- [ ] Revisión visual en escritorio y móvil (`320px` sin scroll horizontal).
- [ ] `npm run build` sin errores (**exit code 0**).
- [ ] `npx playwright test` aprobado (**0 violaciones de accesibilidad WCAG 2.2 AA** y contratos de datos al 100%).

---

## Documentos de respaldo (consulta técnica)

- [DESIGN_RULES.md](./DESIGN_RULES.md) — Reglas visuales, tarjetas, responsive y accesibilidad WCAG 2.2 AA.
- [METODOLOGIA_UX_WRITING_ATO_SAT.md](./METODOLOGIA_UX_WRITING_ATO_SAT.md) — Marco teórico ATO y pilares de *Content Design*.
- [GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md](./GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md) — Diccionario de traducción de jerga tributaria a lenguaje ciudadano.
