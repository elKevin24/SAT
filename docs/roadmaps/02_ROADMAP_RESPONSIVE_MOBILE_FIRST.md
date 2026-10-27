# Roadmap 02: Responsive Design & Mobile First — Portal SAT

Este documento establece la hoja de ruta técnica y de diseño para la estrategia **Mobile First** y **Responsive Design** en el Portal SAT Guatemala, garantizando que la **Arquitectura de Información (IA)** permanezca intacta mientras la **Presentación y Navegación** se adaptan al viewport.

---

## 📌 Principio Rector

$$\text{IA (Qué y cómo se organiza)} \neq \text{Navegación (Cómo se recorre)} \neq \text{Responsive (Cómo se presenta)}$$

- **Invariable**: La jerarquía taxonómica (`Nivel 1` a `Nivel 5`), la nomenclatura oficial, las reglas de negocio y las **714 gestiones del árbol (683 contenidos únicos)** no sufren cambios según el tamaño de pantalla.
- **Variable**: La disposición espacial (columnas, menú contextual acoplado, touch targets y condensación elíptica de migas de pan).

---

## 📋 Lista de Control de Tareas (Checklist)

### Fase 1: Tokens de Diseño y Layout Base
- [x] **1.1 Definición de Breakpoints Oficiales**:
  - `Mobile`: `< 768px` (Contenedor 100%, margen lateral 16px).
  - `Tablet`: `768px – 1023px` (Margen lateral 24px, 2 columnas).
  - `Desktop`: `1024px – 1439px` (Max-width 1280px, margen lateral 32px, 3-4 columnas).
  - `Wide Desktop`: `≥ 1440px` (`max-w-7xl` centrado).
- [x] **1.2 Contenedores Estándar Consistentes**:
  - *Acción*: Uso homologado de `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` en todas las secciones y páginas del portal.
- [x] **1.3 Escala Tipográfica Fluida**:
  - *Acción*: Tokens fluidos con `clamp()` definidos en `src/design-system/tokens.css` (`--sat-text-h1`, `--sat-text-h2`, `--sat-text-h3`, `--sat-text-body`).
- [x] **1.4 Unidades de Viewport Dinámicas**:
  - *Acción*: `min-height: 100dvh` en `src/index.css` y contenedores adaptativos sin desbordamiento horizontal (`overflow-x: hidden`).

---

### Fase 2: Sistema de Navegación Adaptativa
- [x] **2.1 Desacoplamiento conceptual IA vs. Navegación**:
  - *Acción*: Formalización en `DESIGN_RULES.md`: la profundidad taxonómica no condiciona la visibilidad simultánea de niveles.
- [x] **2.2 Breadcrumbs Adaptativos con Elipsis Móvil (`Breadcrumbs.tsx`)**:
  - *Acción*: En móvil, ancla fija `Inicio` + selector elíptico desplegable `[...]` + los niveles activos más profundos. En desktop, ruta completa navegable. Conforme a WCAG 2.2 AA.
- [x] **2.3 Menú Contextual Acoplado por Nivel (`App.tsx` / `SidebarNav.tsx`)**:
  - *Acción*: Panel lateral contextual que despliega únicamente las opciones hermanas del nivel activo, acoplado a la barra principal del `Header`.
- [x] **2.4 Integración en Catálogo y Páginas Dedicadas**:
  - *Acción*: Conexión de `Breadcrumbs` y navegación contextual en `SegmentTramitesCatalog.tsx` y `GestionContentPage.tsx`.

---

### Fase 3: Componentes Core y Superficies Táctiles
- [x] **3.1 Touch Targets Mínimos (WCAG 2.5.8)**:
  - *Acción*: Dimensiones mínimas de contacto en botones de navegación, migas de pan y controles interactivos.
- [x] **3.2 Grid Responsivo de Tarjetas de Gestiones**:
  - *Acción*: 1 columna en móvil, 2 en tablet, 3-4 columnas en desktop; lectura vertical prioritaria sin scroll horizontal.
- [x] **3.3 Sustitución de Modales de Contenido por Páginas Dedicadas (Regla 13)**:
  - *Acción*: Todas las fichas de gestión (`GestionContentPage`), procesos (`ProcessJourneyPage`) y flujos (`SolicitarNitPage`, `ActualizarRtuPage`, `FelPage`) se abren en su propia página completa indexable, eliminando el problema de doble scroll y modales truncados en móvil.

---

### Fase 4: Filtros Facetados y Formularios Móviles
- [x] **4.1 Pasos y Requisitos Apilados en Móvil**:
  - *Acción*: Listas de requisitos con checkboxes interactivos y pasos secuenciales apilados verticalmente en `GestionContentPage.tsx`.
- [x] **4.2 Contenedores con Scroll Horizontal Contenido**:
  - *Acción*: Pestañas y barras de filtro con `overflow-x-auto no-scrollbar` para desplazamiento táctil fluido en pantallas estrechas.
- [x] **4.3 Filtros por Etapa del Ciclo de Vida ATO en Catálogo**:
  - *Acción*: Barra de filtrado rápido por etapa ATO (*1. Empezar*, *2. Operar*, *3. Consultar*, *4. Modificar o Cerrar*, *5. Normativa*) activa en `SegmentTramitesCatalog.tsx` y sincronizada con los parámetros de la URL (`?etapa=`).
- [x] **4.4 Formularios Optimizados para Teclados Virtuales**:
  - *Acción*: Atributos semánticos `inputMode="search"`, `inputMode="numeric"` y `enterKeyHint="search"` aplicados en buscadores (`Header.tsx`, `SegmentTramitesCatalog.tsx`) y verificadores (`DirectConsultasModal.tsx`).

---

### Fase 5: QA, Certificación de Viewports y Pruebas Extremas
- [x] **5.1 Certificación Automatizada en Viewport Móvil Compacto (320px)**:
  - *Acción*: Test automatizado en `tests/a11y.spec.ts` que verifica cero desbordamiento horizontal (`scrollWidth <= innerWidth`) a `320x568` en Home, Catálogo y páginas dedicadas.
- [x] **5.2 Resistencia a Textos Largos**:
  - *Acción*: Títulos y descripciones con `line-clamp` y ajuste fluido sin rotura de contenedores.
