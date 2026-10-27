# Roadmap 03: Backlog de Evolución y Gestiones del Portal SAT

Este documento registra el estado del backlog de evolución del **Portal Web SAT Guatemala**, siguiendo las reglas oficiales de diseño, arquitectura tributaria (`Nivel 1` a `Nivel 5`) y UX Writing en Lenguaje Ciudadano.

---

## 📋 Lista de Control de Tareas (Checklist)

### 1. Estructura de Portada (`Home`) Aprobada
- [x] **1.1 Jerarquía de entrada por Nivel 1**:
  - Navegación principal por los 4 pilares en tarjetas limpias (`UserSegmentCards`): *Contribuyentes*, *Operadores de Comercio Exterior*, *Profesionales* y *Entes Exentos*.
- [x] **1.2 Secciones complementarias normadas**:
  - Banner rotativo institucional (`RotaryBanner`), carrusel de accesos rápidos de la Lámina 11 (`QuickAccessCarousel`), pestañas de temas más consultados (`PopularTopicsTabs`) y rutas guiadas (`GuidedProcessesSection`) con contador explícito de paginación.

---

### 2. Página Completa de Ficha de Gestión (`GestionContentPage.tsx` — Regla 13)
- [x] **2.1 Página dedicada con URL canónica e indexable**:
  - Cada una de las **714 gestiones del árbol** se presenta en su propia página completa (`#/gestion/:slug`, `#/solicitar-nit`, `#/actualizar-rtu`), eliminando por completo el uso de modales o popovers flotantes para contenido.
- [x] **2.2 Estructura en Lenguaje Ciudadano y Pasos Cronológicos**:
  - Requisitos interactivos verificables, pasos secuenciales numerados, llamado a la acción (CTA) directo hacia el sistema oficial (`Agencia Virtual`, `Declaraguate`, `Portal SAT`) y base legal.
- [x] **2.3 Grafo de Relaciones y Navegación Transversal**:
  - Bloque conectado con `contentRelationships.ts` que muestra **prerrequisitos**, **siguientes pasos sugeridos** en el ciclo de vida ATO y gestiones hermanas de la misma **familia temática (`FAM-01`..`FAM-10`)**.

---

### 3. Navegación Adaptativa Breadcrumbs + Menú Contextual por Nivel
- [x] **3.1 Especificación conceptual y técnica**:
  - Documentada en `DESIGN_RULES.md` y `docs/arquitectura-informacion/ESTRUCTURA_FINAL_CONTENIDO.md`.
- [x] **3.2 Componente `Breadcrumbs.tsx`**:
  - Implementado con soporte W3C / WCAG 2.2 AA y compactación responsive móvil con micro-menú elíptico `[…]`.
- [x] **3.3 Menú Contextual Acoplado**:
  - Integrado en `App.tsx` y `SegmentTramitesCatalog.tsx` mostrando las opciones del nivel activo y filtros por etapa del ciclo ATO.

---

### 4. Consistencia en la Búsqueda Global del Header (`Header.tsx`)
- [x] **4.1 Rejilla de resultados unificada**:
  - El buscador del encabezado institucional presenta los resultados en una cuadrícula uniforme de 4 columnas en desktop (`lg:grid-cols-4`).
- [x] **4.2 Accesibilidad y UX Writing**:
  - Patrón ARIA Combobox completo, atributos `inputMode="search"`, enlace de salto `#main-content` y lenguaje ciudadano libre de la palabra prohibida *"trámite"*.

---

### 5. Integración Contextual de «Cultura Tributaria y Capacitación»
- [x] **5.1 Homologación de denominación oficial SAT**:
  - La oferta formativa, cursos virtuales, diplomados, talleres y guías se agrupa bajo **«Cultura tributaria y capacitación»** y la familia transversal `FAM-10` (*Cultura Tributaria, Capacitación y Biblioteca*).
- [x] **5.2 Vinculación contextual en el árbol**:
  - Los 100 recursos formativos y guías operativas están clasificados dentro de sus ramas temáticas correspondientes y conectados transversalmente mediante `familias_ids`.

---

### 6. Consulta y Validación de Brechas de Comercio Exterior
- [x] **6.1 Identificación y mapeo**:
  - Brechas operativas aduaneras documentadas en `docs/arquitectura-informacion/brechas-comercio-exterior.md`.
- [x] **6.2 Distintivo en la interfaz**:
  - Distintivo visual neutral `Propuesta normativa SAT` activo en las tarjetas y fichas correspondientes.
- [ ] **6.3 Validación formal con Mesa Técnica SAT (Externo)**:
  - Presentar la matriz de validación a la Intendencia de Aduanas para formalizar resoluciones y enlaces definitivos en producción.

---

### 7. Definición y Validación de Nivel 2 para los 4 Pilares
- [x] **7.1 Contrato Oficial en `src/data/categoryOrder.ts`**:
  - **Contribuyentes (Nivel 2)**: *Sin Obligaciones*, *Pequeños Contribuyentes*, *Contribuyente General*, *Contribuyentes Especiales*.
  - **Operadores de Comercio Exterior (Nivel 2)**: *Importadores*, *Exportadores*, *Operador Económico Autorizado (OEA)*, *Auxiliares de la Función Pública Aduanera (AFPA)*, *Regímenes Territoriales y Zonas Especiales*, *Normativa y Operaciones Aduaneras Generales*.
  - **Profesionales (Nivel 2)**: *Abogados y Notarios*, *Peritos Contadores*, *Auditores*, *Gestores Tributarios*, *Servicios Profesionales*.
  - **Entes Exentos (Nivel 2)**: *Entidades del Estado*, *Constitucionales*, *No Lucrativos*, *Municipalidades*, *Decreto*.

---

### 8. Generación de Base de Datos Dual del Portal (NoSQL y SQL Dump)
- [x] **8.1 Colecciones NoSQL Documentales (`database/nosql_mongodb/`)**:
  - 5 colecciones sincronizadas (`gestiones.json` con 683 entidades únicas, `arbol_navegacion.json` con 715 nodos, `cat_actores.json`, `cat_familias.json` con 10 familias y `cat_procesos.json`).
- [x] **8.2 Motor Relacional Normalizado (`database/sql/sat_portal_dump.sql` y `sat_portal.db`)**:
  - Base de datos SQLite compilada y dump SQL en 3NF con vistas optimizadas.
