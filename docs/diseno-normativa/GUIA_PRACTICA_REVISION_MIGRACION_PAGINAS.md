# Guía Paso a Paso: De Cero a Página Migrada (Modelo ATO + NN/g + SAT)

> **Cómo usar esta guía:** Sigue las **6 fases en orden** cada vez que tomes una página del portal actual (`portal.sat.gob.gt`) para transformarla al nuevo Portal SAT. Está construida con los criterios de **ATO (*Structuring content* y *Layered Content*)**, **Nielsen Norman Group (NN/g)** y el **Design System SAT**, exactamente como se aplicó en el ecosistema de **Factura Electrónica (FEL)**.

---

## Fase 0: Abrir la página original y hacer el inventario completo

Antes de diseñar o escribir una sola línea de código, abre la página actual en `portal.sat.gob.gt` y levanta el inventario exacto:

1. **Identifica si es una página aislada o un ecosistema:** revisa si tiene subpáginas hermanas o hijas en su menú lateral/superior (ej. en FEL: *Inicio*, *Emisor*, *Certificadores*, *Documentación Técnica*, *Auditor*, *Preguntas frecuentes*).
2. **Anota todos los elementos visibles:**
   - Título, párrafos iniciales ("historia", fechas de creación, artículos de ley).
   - Enlaces internos y externos, botones de descarga (PDF, XLSX, ZIP) y enlaces a tiendas de apps.
   - Tablas, listas de requisitos, manuales, resoluciones, imágenes/diagramas y preguntas frecuentes.
3. **Audita enlaces, fechas y correos reales:**
   - Comprueba que cada enlace responda (`HTTP 200 OK`) y busca si hay versiones más recientes (ej. listados al `31-10-2026`).
   - Si ves correos ofuscados (`[email protected]`), extrae o solicita el correo real (ej. `ayuda@sat.gob.gt`, `efactura@sat.gob.gt`).
4. **Aplica las 3 reglas de contención:**
   - **Cero invención:** no agregues requisitos, tarjetas ni pasos que no existan en la fuente oficial.
   - **Cero herencia ciega:** si una subpágina no tiene apartado legal en el original, no le arrastres la base legal de la página principal.
   - **Cero absorción de servicios hermanos:** si un enlace apunta a un servicio de nivel superior con acceso propio en portada (ej. *Verificador Integrado*), no lo metas como subpágina interna.

---

## Fase 1: Clasificar la arquitectura (Hub vs. Subpágina vs. Archivo suelto)

Con el inventario en mano, ubica cada elemento en su nivel correcto antes de pensar en diseño:

- **Página Hub (Inicio del tema):** presenta el servicio/régimen, enlaza a canales oficiales (ej. App FEL) y agrupa en tarjetas únicamente las **subpáginas con contenido propio**.
- **Subpágina interna:** entra al menú lateral vertical `"En esta sección"` en **simetría 1:1** con las tarjetas del Hub (barra activa a la izquierda en escritorio; acordeón colapsable en móvil `< 1024px`).
- **Archivo suelto (1 PDF, 1 Excel o tabla de 1 fila):**
  - ❌ Nunca va en el menú lateral (sería un clic pasarela vacío).
  - ❌ Nunca compite como tarjeta principal del Hub al mismo nivel que una sección completa.
  - ✅ Va en un bloque secundario al final (*Documentos de consulta directa*) indicando título, descripción corta y formato `(PDF)` / `(XLSX)`.

---

## Fase 2: Limpiar y redactar el texto (NN/g + Lenguaje Claro SAT)

Reescribe todo el contenido de la página aplicando estas reglas en orden:

1. **Título (`<h1>`):**
   - En páginas operativas/de gestión: inicia con **verbo en infinitivo en las primeras 3 palabras** (*Front-Loading*), ej. *«Habilitarme como emisor de facturas (FEL)»*.
   - En páginas Hub o catálogos: usa el **nombre claro del régimen o tema**, ej. *«Régimen de Factura Electrónica en Línea (FEL)»*.
   - Aplica **Sentence Case** (mayúscula solo al inicio, nombres propios y siglas).
   - **Sin badges `pill` decorativos** (`rounded-full`) ni índices *"En esta página"* arriba del título.
2. **Párrafo introductorio (Regla del 50% + Pirámide Invertida):**
   - Toma la "historia" burocrática del original (*"Creado mediante Acuerdo 13-2018 el 23 de mayo..."*) y **corta el 50%+ de relleno** (fechas de creación, citas legales, cortesía).
   - Deja máximo **2 oraciones directas** respondiendo qué hace el ciudadano y para qué le sirve.
3. **Limpieza terminológica obligatoria:**
   - **Cero «trámite» / «trámites»:** reemplázalo siempre por **«gestión» / «gestiones»** o el verbo directo.
   - **Cero acrónimos huérfanos:** expande toda sigla en su primera mención por página, ej. `Documentos Tributarios Electrónicos (DTE)`, `Registro Tributario Unificado (RTU)`, `Número de Identificación Tributaria (NIT)`.
   - **Regla del 79% (escaneo NN/g):** elimina párrafos largos; usa bloques cortos y viñetas con **negrita inicial**.
   - **Enlaces y botones predictivos:** prohíbe *"clic aquí"* o *"ver más"*; usa acciones concretas con formato (`Descargar manual (PDF)`) y convierte URLs/correos en enlaces `<a>` / `mailto:` reales.

---

## Fase 3: Estructurar cada tipo de contenido (ATO *Structuring content*)

Ordena la página en **3 capas ATO** (*Lead with the need, not the law*) y elige el componente exacto para cada dato:

| Qué estás migrando | Cómo debes estructurarlo |
| :--- | :--- |
| **Encabezado del Hub** | Título + 2 oraciones + enlaces de canales si existen (ej. tiendas de App FEL). **Sin botones internos duplicados** si las acciones ya están en las tarjetas de abajo. |
| **Encabezado de Subpágina** | Título + 2 oraciones + máximo 2 botones estándar (`Button` `primary` / `outline`) si hay acción externa o descarga principal. |
| **Tarjetas del Hub** | Solo Título + Descripción (máx. 2 oraciones). **Cero íconos, cero conteos, cero botones internos.** Ajusta columnas (`md:col-span-2` + `2×2` si son 5; `lg:grid-cols-3` si son 6) para no dejar huecos. |
| **Diagramas o flujos en `.jpg`/`.png`** | **Reemplázalos por texto accesible:** lista ordenada `<ol>` paso a paso (WCAG 2.2 AA). |
| **Requisitos o procedimientos** | Lista ordenada `<ol>` numerada (ej. 1 a 5), nunca párrafos corridos. |
| **Directorios, documentos o resoluciones** | `<table>` semántica (`<caption>`, `<th scope="col">`) en escritorio (`md:block`) + bloques apilados en móvil (`md:hidden`). |
| **Preguntas frecuentes (+15 ítems)** | **Buscador instantáneo** (`aria-live="polite"`) + **acordeones colapsables (`<details>` / `<summary>`)** agrupados por tema, con enlaces reales dentro de las respuestas. |
| **Leyes, acuerdos y resoluciones** | **Al pie de la página** dentro de un acordeón `<details>` secundario, **solo** en las vistas que sí tienen base legal en el portal original. |

---

## Fase 4: Implementar en el código del proyecto

1. **Separa datos de interfaz:**
   - Datos estructurados (tablas, directorios, FAQs, manuales, resoluciones) en `src/data/` con tipado estricto en TypeScript.
   - Navegación lateral `"En esta sección"` en `src/components/` (reutilizando el patrón de `FelSubnav.tsx`).
   - Vistas dedicadas de página completa en `src/pages/` usando los componentes base (`Breadcrumbs`, `Button`).
2. **Accesibilidad base en cada control:**
   - Todo botón, enlace de acción, input y `<summary>` debe tener al menos **`min-h-[44px]`** de área táctil y anillo de foco visible (`focus-visible:ring-2`).
   - Mantén **cero modales/popovers** para mostrar contenido de gestiones.

---

## Fase 5: Verificación obligatoria antes de dar por cerrada la página

Antes de hacer commit, revisa punto por punto:
- [ ] **Fidelidad:** ¿Está el 100% de enlaces, documentos y datos vigentes del original sin contenido inventado ni bloques legales heredados por error?
- [ ] **Responsive:** ¿Se lee limpio en escritorio y en móvil `320px` sin desbordamiento horizontal?
- [ ] **Compilación:** ejecuta `npm run build` y confirma **exit code 0**.
- [ ] **Accesibilidad y contratos:** ejecuta `npx playwright test` y confirma **0 violaciones Axe (WCAG 2.2 AA)** y 100% de pruebas aprobadas.

---

## Documentos de respaldo (consulta técnica)

- [DESIGN_RULES.md](./DESIGN_RULES.md) — Reglas visuales, tarjetas, responsive y accesibilidad WCAG 2.2 AA.
- [METODOLOGIA_UX_WRITING_ATO_SAT.md](./METODOLOGIA_UX_WRITING_ATO_SAT.md) — Marco teórico ATO y pilares de *Content Design*.
- [GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md](./GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md) — Diccionario de traducción de jerga tributaria a lenguaje ciudadano.
