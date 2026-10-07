# Roadmap 02: Responsive Design & Mobile First — Portal SAT

Este documento establece la hoja de ruta técnica y de diseño para la implementación de la estrategia **Mobile First** y **Responsive Design** en el Portal SAT Guatemala, garantizando que la **Arquitectura de Información (IA)** permanezca intacta mientras la **Presentación y Navegación** se adaptan al viewport.

---

## 📌 Principio Rector

$$\text{IA (Qué y cómo se organiza)} \neq \text{Navegación (Cómo se recorre)} \neq \text{Responsive (Cómo se presenta)}$$

- **Invariable**: La jerarquía taxonómica (L1 a L6+), la nomenclatura oficial, las reglas de negocio y los 783 trámites no sufren cambios según el tamaño de pantalla.
- **Variable**: La disposición espacial (columnas, drawer vs. sidebar, tablas apiladas, touch targets y condensación elíptica de migas de pan).

---

## 📋 Lista de Control de Tareas (Checklist)

### Fase 1: Tokens de Diseño y Layout Base
- [x] **1.1 Definición de Breakpoints Oficiales**:
  - `Mobile`: `< 768px` (Contenedor 100%, margen lateral 16px).
  - `Tablet`: `768px – 1023px` (Margen lateral 24px, 8 columnas).
  - `Desktop`: `1024px – 1439px` (Max-width 1280px, margen lateral 32px, 12 columnas).
  - `Wide Desktop`: `≥ 1440px` (Max-width 1440px centrado).
- [ ] **1.2 Wrappers de Layout Global**:
  - *Acción*: Crear componentes estándar reutilizables (`Container`, `Grid`, márgenes globales) para evitar que cada sección defina márgenes dispares.
- [ ] **1.3 Escala Tipográfica Fluida**:
  - *Acción*: Estandarizar títulos con funciones fluidas `clamp()` o tokens escalados para H1 (28px móvil $\to$ 40px desktop) sin riesgo de quiebre visual horizontal.
- [ ] **1.4 Tecnologías Modernas de CSS y Optimización del Espacio Disponible**:
  - *Acción*: Implementar unidades de viewport dinámicas (`100dvh` en modales/drawers), Container Queries (`@container`) en componentes reutilizables, grids fluidos con `repeat(auto-fit, minmax(min(100%, 280px), 1fr))` y propiedades lógicas (`padding-inline`, `margin-block`) para aprovechar el 100% del espacio de pantalla.

---

### Fase 2: Sistema de Navegación Adaptativa
- [x] **2.1 Desacoplamiento conceptual IA vs. Navegación**:
  - *Acción*: Formalización en documentación y reglas de diseño: la profundidad taxonómica no condiciona la visibilidad simultánea de niveles.
- [x] **2.2 Breadcrumbs Adaptativos con Elipsis Móvil (`Breadcrumbs.tsx`)**:
  - *Acción*: En móvil, ancla fija `Inicio` independiente + selector elíptico desplegable `[...]` + los 2 niveles activos más profundos. En desktop, ruta completa con scroll horizontal contenido. Conforme a WCAG 2.2 AA.
- [x] **2.3 Navegación Contextual Dual (`SidebarNav.tsx`)**:
  - *Desktop ($\ge 1024$px)*: Sidebar lateral sticky enfocado en el sub-árbol relevante de Nivel 4+.
  - *Móvil / Tablet ($< 1024$px)*: Botón disparador inline/flotante que despliega un Drawer modal off-canvas accesible con trampa de foco (`aria-modal="true"`).
- [x] **2.4 Integración en Catálogo Principal**:
  - *Acción*: Conexión de `Breadcrumbs` y `SidebarNav` dentro de `SegmentTramitesCatalog.tsx` para navegación fluida en niveles profundos.

---

### Fase 3: Componentes Core y Superficies Táctiles
- [x] **3.1 Touch Targets Mínimos (WCAG 2.5.8)**:
  - *Acción*: Dimensiones mínimas de contacto de $44 \times 44$px o $48 \times 48$px en botones de navegación, migas de pan y controles primarios.
- [x] **3.2 Grid Responsivo de Tarjetas de Trámites**:
  - *Acción*: 1 columna en móvil, 2 en tablet, 3-4 columnas en desktop; lectura vertical prioritaria sin scroll horizontal.
- [ ] **3.3 Modales Adaptativos a Pantalla Completa en Móvil**:
  - *Acción*: En dispositivos pequeños ($< 768$px), los modales de detalle (`TramiteDetailModal`, etc.) deben transicionar a vista de pantalla completa (*bottom sheet* o *full-screen overlay*) con botón de cierre fijo y scroll interno.

---

### Fase 4: Tablas de Requisitos y Formularios Complejos
- [ ] **4.1 Tablas de Requisitos con Transformación a Tarjetas**:
  - *Acción*: En resoluciones móviles ($< 768$px), convertir tablas densas en tarjetas apiladas de pares clave-valor para facilitar lectura vertical.
- [ ] **4.2 Contenedores con Scroll Horizontal Contenido**:
  - *Acción*: Para tablas que deban conservar formato tabular, encapsular en contenedor con sombras visuales de degradado que indiquen la existencia de contenido desplazable.
- [ ] **4.3 Drawer de Filtros Móviles**:
  - *Acción*: En móvil, condensar los filtros facetados de búsqueda dentro de un Drawer accesible con botón flotante "Aplicar filtros (X)".
- [ ] **4.4 Formularios Optimizados para Teclados Virtuales**:
  - *Acción*: Asignar atributos semánticos `inputmode="numeric"`, `inputmode="email"`, `enterkeyhint="search"` e inputs con ancho completo (100%).

---

### Fase 5: QA, Certificación de Viewports y Pruebas Extremas
- [ ] **5.1 Matriz de Pruebas Multidispositivo**:
  - *Móvil compacto*: 320px (iPhone SE).
  - *Móvil estándar*: 360px – 414px (Android / iOS).
  - *Tablet vertical*: 768px (iPad Mini).
  - *Desktop*: 1024px, 1366px, 1440px y 1920px.
- [ ] **5.2 Resistencia a Textos Largos**:
  - *Acción*: Validar que títulos de trámites con más de 120 caracteres no desborden ni rompan contenedores (`hyphens: auto`, `word-break: break-word`).
- [ ] **5.3 Prueba de Zoom al 200% (WCAG 1.4.4)**:
  - *Acción*: Verificar que el sitio continúe siendo 100% operativo sin solapamiento de textos con zoom al 200%.
- [ ] **5.4 Verificación de Core Web Vitals en Móvil**:
  - *Acción*: Asegurar LCP $< 2.5$s y CLS $< 0.1$ en emulación 4G / móvil.
