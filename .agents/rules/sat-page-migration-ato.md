
# Regla Oficial de Migración, Estructura ATO y Lenguaje Claro NN/g (SAT)

Esta regla es de cumplimiento obligatorio al auditar, migrar o refactorizar cualquier página del Portal SAT. Sintetiza el **Australian Government Style Manual (*Structuring content*) / ATO**, los estándares de usabilidad y escritura de **Nielsen Norman Group (NN/g)** y el **Design System SAT**.

---

## 1. Inventario Fiel de la Fuente (Cero Invención y Cero Herencia Ciega)
- **Extracción obligatoria previa:** Antes de diseñar o editar, inspeccionar la URL oficial vigente en `portal.sat.gob.gt` y verificar enlaces de descarga, fechas de corte y correos reales (decodificando cualquier `[email protected]` ofuscado).
- **Prohibido inventar contenido:** No agregar requisitos, pasos, tarjetas o secciones que no existan en la página original.
- **Prohibido heredar bloques ajenos:** Si una subpágina (ej. documentación técnica, directorios o preguntas frecuentes) no incluye apartado legal en el portal original, no heredar acordeones compartidos de base legal.
- **Respetar límites jerárquicos:** No absorber servicios hermanos de nivel superior (con acceso propio en la portada del portal) como si fueran subpáginas internas del tema actual.

---

## 2. Pilares de Escritura Clara y Escaneo (NN/g + Lenguaje Ciudadano SAT)
- **Pirámide Invertida y *Front-Loading*:** Colocar la conclusión y el propósito ciudadano al inicio. En títulos de gestión/acción, ubicar el verbo en infinitivo en las **primeras 3 palabras** (ej. *«Habilitarme como emisor de facturas (FEL)»*); en páginas *Hub*, usar el nombre claro del régimen o servicio.
- **Corte del 50% (Regla de brevedad NN/g):** Eliminar relleno burocrático, cortesía administrativa, citas de artículos y fechas de creación de la introducción. Dejar máximo **2 oraciones directas** (qué es / qué hace + para qué sirve).
- **Regla del 79% (Escaneo y *Visual Chunking*):** Cero párrafos densos o muros de texto. Dividir en bloques cortos, listas con negrita inicial y subtítulos claros (`<h2>`, `<h3>`).
- **Prohibición absoluta de «trámite»:** Usar siempre **«gestión» / «gestiones»** o el verbo directo de la acción.
- **Cero acrónimos huérfanos:** Expandir toda sigla en su **primera mención** por página (ej. `Documentos Tributarios Electrónicos (DTE)`, `Registro Tributario Unificado (RTU)`, `Número de Identificación Tributaria (NIT)`).
- ***Sentence Case* estricto:** Mayúscula solo al inicio de títulos y en nombres propios o siglas.
- **Enlaces y botones que predicen el resultado:** Nunca usar genéricos (*«Ver más»*, *«Clic aquí»*); indicar acción exacta y formato cuando aplique (`(PDF)`, `(XLSX)`, `(ZIP)`). Convertir URLs y buzones en enlaces reales (`<a>` / `mailto:`).

---

## 3. Estructura de Capas y Contenidos (ATO *Layered Content* & *Structuring Content*)
Organizar cada página respetando esta jerarquía visual y funcional:

1. **Capa 1 — Encabezado y Orientación (*Lead with the need*):**
   - `<h1>` claro en *Sentence Case* + resumen de máx. 2 oraciones.
   - **Prohibido** colocar badges `pill` decorativos (`rounded-full`) o índices `"En esta página"` sobre el encabezado.
   - En **Hubs**, si las acciones ya viven en las tarjetas inferiores, **no** duplicar botones internos en el `<header>`.
2. **Capa 2 — Contenido Operativo (*Before you start* → *Step-by-step*):**
   - **Requisitos, flujos o secuencias:** usar siempre listas ordenadas (`<ol>`) o viñetas estructuradas.
   - **Directorios, catálogos y comparativas:** usar `<table>` semántica (`<caption>`, `<th scope="col">`) en escritorio (`md:block`) y bloques apilados en móvil (`md:hidden`).
   - **Preguntas frecuentes extensas (+15 ítems):** aplicar divulgación progresiva (NN/g) con filtro de búsqueda instantáneo (`aria-live="polite"`) y acordeones colapsables (`<details>` / `<summary>`).
3. **Capa 3 — Certeza Jurídica Secundaria (al pie y solo si aplica):**
   - Mover Acuerdos, Decretos y Resoluciones al pie dentro de un acordeón colapsable (`<details>`), únicamente en las vistas donde el original los incluya.

---

## 4. Decisiones Estructurales por Elemento al Migrar
- **Menú lateral (`lg:w-64`) y tarjetas del Hub (Simetría 1:1):**
  - El menú `"En esta sección"` (barra activa izquierda en escritorio y acordeón `< 1024px`) enlaza únicamente a `Inicio` + las subpáginas reales con contenido propio.
  - Las tarjetas del Hub muestran solo Título + Descripción concisa (cero íconos, cero conteos, cero botones internos), ajustando columnas (`md:grid-cols-2` / `lg:grid-cols-3` / `md:col-span-2`) para evitar huecos visuales.
- **Archivos sueltos (1 PDF/XLSX o tabla de 1 fila):** No entran al menú lateral ni compiten como tarjeta principal del Hub; se ubican en un bloque secundario (*Documentos de consulta directa*) indicando formato y fecha de corte vigente.
- **Imágenes, diagramas y tiendas de apps (WCAG 2.2 AA):**
  - Reemplazar diagramas de flujo en imagen (`.jpg`/`.png`) por texto estructurado accesible en `<ol>` secuencial.
  - Convertir logotipos de tiendas en enlaces de texto explícitos (`Google Play (Android)`, `App Store (iOS)`, `AppGallery (Huawei)`) con área táctil `min-h-[44px]`.

---

## 5. Verificación Obligatoria al Cerrar
- Ejecutar `npm run build` (**exit code 0**).
- Ejecutar `npx playwright test` confirmando **0 violaciones Axe (WCAG 2.2 AA)**, reflow móvil `320px` y contratos de datos.
