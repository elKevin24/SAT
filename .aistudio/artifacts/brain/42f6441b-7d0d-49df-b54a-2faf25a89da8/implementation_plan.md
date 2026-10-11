# Plan Maestro de Evolución Frontend y Sincronización de Roadmaps — Portal SAT

Plan de ejecución técnica e integración para consolidar el frontend del Portal SAT Guatemala, armonizando los 716 trámites canónicos con la gobernanza de orden ATO (`orden_n1..orden_n5`), certificación de accesibilidad WCAG 2.2 AA, diseño Mobile First adaptativo y preservación del diseño aprobado para el carrusel de accesos directos.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisiones confirmadas y ajustadas por el usuario:**
> 1. **Preservación del Carrusel de Accesos Directos (Diseño Aprobado)**: Se mantiene formalmente el carrusel de accesos rápidos (`QuickAccessCarousel`) conforme a la especificación aprobada de la Lámina 11 institucional (7 visibles + 2 en carrusel). Se optimiza su enlace a los códigos canónicos `SAT-GES-####` y su operabilidad táctil y por teclado.
> 2. **Alcance de Ejecución Integral**: Sincronización e implementación de los pendientes de los 3 roadmaps oficiales (Roadmap 01 UX/A11y, Roadmap 02 Responsive/Mobile First, y Roadmap 03 Backlog de Catálogo y Portal).
> 3. **Gobernanza de Orden Canónico**: Ordenamiento determinista en catálogo e interfaz regido estrictamente por las columnas numéricas `orden_n1..orden_n5` y el ciclo de vida ciudadano ATO (1. Empezar $\to$ 2. Operar $\to$ 3. Consultar $\to$ 4. Modificar/Cerrar $\to$ 5. Normativa), prohibiendo números quemados en títulos visibles.

---

### 1. Overview & Core Concept

- **Qué Resuelve**: Integra de forma armónica los accesos directos de alta frecuencia con la navegación profunda multinivel, garantizando consistencia taxonómica, accesibilidad universal y predictibilidad en la localización de gestiones tributarias y aduaneras.
- **Audiencia Objetivo**: Contribuyentes individuales, Pequeños Contribuyentes, Empresas Generales y Especiales, Operadores de Comercio Exterior, Profesionales colegiados y Entes Exentos.
- **Valor Central**: Experiencia de usuario fluida que combina el acceso inmediato a gestiones cotidianas (NIT, Solvencia, FEL, Vehículos) con la búsqueda y exploración metódica de los 716 trámites oficiales con identificadores canónicos `SAT-GES-####`.

---

### 2. User Experience & Visual Design

#### Flujos de Navegación Clave
1. **Página de Inicio (`Home`) con Accesos Duales**:
   - Encabezado institucional con buscador combobox transversal accesible.
   - 4 tarjetas maestras de macrogrupo (`UserSegmentCards`) para exploración profunda.
   - Banner rotativo informativo (`RotaryBanner`) conforme a lineamientos oficiales.
   - **Carrusel de Accesos Rápidos (`QuickAccessCarousel`)**: Mantenido con 7 accesos primarios visibles + navegación lateral accesible con botones `Anterior` / `Siguiente` que cumplen tamaño táctil $\ge 44\text{px}$ y foco visible.
   - Pestañas de temas consultados (`PopularTopicsTabs`) con acceso directo a consultas en primera posición.
   - Procesos guiados y sección de transparencia.
2. **Exploración de Catálogo con Doble Navegación**:
   - Migas de pan (`Breadcrumbs`) con elipsis interactiva en dispositivos móviles.
   - Navegación lateral (`SidebarNav`) colapsable en desktop y Drawer off-canvas táctil en pantallas $< 1024\text{px}$.
   - Rejilla de trámites ordenada estrictamente por `orden_n1..orden_n5` y ciclo ATO.
3. **Ficha de Trámite en Lenguaje Ciudadano (Modal Accesible)**:
   - Estructuración de requisitos en 3 fases cronológicas legibles (*"Paso 1: Reúne requisitos"*, *"Paso 2: Inicia trámite"*, *"Paso 3: Obtén constancia"*).
   - Llamado a la acción (CTA) destacado hacia el canal oficial correspondiente.
   - Marco legal colapsable accesible (`aria-expanded`) para evitar sobrecarga visual.

#### Identidad Visual, Tipografía y Tokens Institucionales
- **Paleta de Color Institucional**:
  - Azul Institucional SAT: `#14649B` (Contribuyentes).
  - Celeste Aduanero: `#0284C7` (Comercio Exterior).
  - Verde Notarial y Profesional: `#4D8014` (Profesionales).
  - Ocre / Ámbar Exento: `#C25E00` (Entes Exentos).
  - Fondos neutros: `#FFFFFF` y `#F8FAFC` con bordes sutiles `#E2E8F0`.
- **Disciplina Anti-Slop & Zero-Pill**:
  - Metadatos informativos presentados como texto limpio sin píldoras decorativas, usando separadores tipográficos (`·`).
  - Botones y tabs interactivos con estados de foco contrastados (`focus-visible:ring-2`).

---

### 3. Key Product Decisions & Trade-Offs

#### Decisión 1: Mantenimiento y Optimización del Carrusel de Accesos Rápidos
- **Enfoque Elegido**: Preservar el componente `QuickAccessCarousel` conectando cada acción con el resolvedor canónico de trámites (mapeando con `SAT-GES-####` o modales especializados de consulta) y asegurando soporte touch/swipe y botones de navegación accesibles.
- **Justificación**: Respeta el diseño institucional aprobado (Lámina 11) que facilita a los ciudadanos el acceso a trámites prioritarios en un solo clic.
- **Alternativas Consideradas**: La eliminación fue descartada por requerimiento expreso del usuario al contar con diseño aprobado.

#### Decisión 2: Motor de Ordenamiento Canónico Determinista
- **Enfoque Elegido**: Aplicar en catálogo el algoritmo de ordenamiento por índices numéricos `(orden_n1, orden_n2, orden_n3, orden_n4, orden_n5, orden_contenido)` y ciclo de vida ATO (Empezar $\to$ Operar $\to$ Consultar $\to$ Modificar $\to$ Normativa).
- **Justificación**: Garantiza total sincronía con las matrices Excel oficiales y previene numeraciones estáticas en los títulos.

#### Decisión 3: Rejilla Homologada de Búsqueda Global en Header
- **Enfoque Elegido**: Homologar los resultados del buscador en `Header.tsx` a una cuadrícula uniforme de 4 columnas en desktop (`lg:grid-cols-4`) con diseño neutro institucional y atributos ARIA de combobox/listbox.
- **Justificación**: Proporciona escaneo rápido de resultados multidisciplinarios sin saturar la vista.

---

### 4. Technical Architecture & Data Strategy

#### Diagrama de Arquitectura de Componentes y Flujo de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PORTAL SAT GUATEMALA                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               Header.tsx (Barra Institucional SAT)             │   │
│   │   - Logo Oficial   - Buscador Combobox (4 cols)   - A11y Modal │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│            ┌───────────────────────┴───────────────────────┐            │
│            ▼                                               ▼            │
│  ┌──────────────────────┐                     ┌──────────────────────┐  │
│  │    VISTA: PORTADA    │                     │    VISTA: CATÁLOGO   │  │
│  │       (Home)         │                     │  (SegmentTramites)   │  │
│  ├──────────────────────┤                     ├──────────────────────┤  │
│  │ 1. UserSegmentCards  │──(Seleccionar)─────▶│ 1. Breadcrumbs       │  │
│  │    (4 Macrogrupos)   │                     │    (Elipsis móvil)   │  │
│  │ 2. RotaryBanner      │                     │ 2. SidebarNav        │  │
│  │ 3. QuickAccessCarousel│                    │    (Sticky / Drawer) │  │
│  │    (Diseño aprobado) │                     │ 3. Grid de Trámites  │  │
│  │ 4. PopularTopicsTabs │                     │    (Orden ATO 1..5)  │  │
│  │ 5. GuidedProcesses   │                     └──────────┬───────────┘  │
│  │ 6. Transparencia/News│                                │              │
│  └──────────────────────┘                     (Click en trámite)        │
│                                                          │              │
│                                                          ▼              │
│                                               ┌──────────────────────┐  │
│                                               │ TramiteDetailModal   │  │
│                                               │ - 3 Pasos Ciudadanos │  │
│                                               │ - CTA Acción Directa │  │
│                                               │ - Base Legal Accord. │  │
│                                               └──────────────────────┘  │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               InstitutionalFooter.tsx (Normativa y Enlaces)    │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

#### Fases de Ejecución Técnica
- **Fase 1 (Roadmap 03 - Header y Carrusel de Accesos Rápidos)**:
  - Rejilla del buscador global en `Header.tsx` a 4 columnas desktop (`lg:grid-cols-4`).
  - Optimizar `QuickAccessCarousel.tsx` para resolución precisa de IDs `SAT-GES-####` y controles accesibles.
- **Fase 2 (Roadmap 01 & 03 - Catálogo y Ordenamiento Canónico)**:
  - Implementar ordenamiento canónico por `orden_n1..orden_n5` y ponderación ATO en `SegmentTramitesCatalog.tsx`.
  - Estructuración de 3 pasos en Lenguaje Ciudadano en `TramiteDetailModal.tsx` con acordeón accesible.
- **Fase 3 (Roadmap 02 - Responsive Mobile First)**:
  - Contenedores adaptativos, Drawer táctil y touch targets $\ge 44\text{px}$.
  - Transformación de tablas densas a tarjetas apiladas en viewports móviles.
- **Fase 4 (Verificación y Auditoría)**:
  - Compilación sin errores (`compile_applet`).
  - Tests automáticos de contrato de datos y accesibilidad (`data-contract.spec.ts` y `a11y.spec.ts`).
