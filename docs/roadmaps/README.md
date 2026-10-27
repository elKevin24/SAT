# Tablero Maestro de Roadmaps — Portal SAT

Este directorio centraliza las hojas de ruta (**Roadmaps**) y planes de ejecución técnica del **Portal SAT Guatemala**.

---

## 📊 Estado Consolidado del Proyecto

| Roadmap | Área de Trabajo | Estado General | Progreso Estimado | Archivo de Detalle |
| :--- | :--- | :---: | :---: | :--- |
| **01** | **Auditoría UX / UI & Accesibilidad WCAG 2.2** | Completado | 100% | [`01_ROADMAP_AUDITORIA_UX_A11Y.md`](./01_ROADMAP_AUDITORIA_UX_A11Y.md) |
| **02** | **Responsive Design & Mobile First** | Completado | 95% | [`02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md`](./02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md) |
| **03** | **Backlog de Evolución del Portal** | En ejecución | 95% | [`03_ROADMAP_BACKLOG_PORTAL.md`](./03_ROADMAP_BACKLOG_PORTAL.md) |
| **IA** | **Arquitectura de Información y Sincronía BD** | En ejecución | 90% | [`docs/arquitectura-informacion/ROADMAP_ARQUITECTURA_INFORMACION.md`](../arquitectura-informacion/ROADMAP_ARQUITECTURA_INFORMACION.md) |
| **Doc** | **Sugerencias de Continuidad y UX** | Publicado | 100% | [`docs/arquitectura-informacion/SUGERENCIAS_DE_CONTINUIDAD_Y_UX.md`](../arquitectura-informacion/SUGERENCIAS_DE_CONTINUIDAD_Y_UX.md) |

---

## ✅ Resumen de Tareas Pendientes y Completadas

### 1. Auditoría UX / UI y Accesibilidad (WCAG 2.2 AA)
- [x] **Fase 0**: Pre-auditoría P0/P1 aplicada (Cards con focus ring, Header orden móvil, Footer sin emojis, contraste en diálogos).
- [x] **0b.1**: Advertencia visual y accesible en verificadores con datos simulados (`DirectConsultasModal`).
- [x] **0b.2**: Encabezado `h1` descriptivo accesible en la portada (`App.tsx`).
- [x] **0b.3**: Etiquetas `<label>` explícitas en inputs de consultas y chat RITA.
- [x] **0b.4**: Atributos `aria-pressed` / `aria-selected` en tabs y botones de filtro.
- [x] **0b.5**: Configurar `eslint-plugin-jsx-a11y` en CI para evitar regresiones de accesibilidad.
- [x] **0b.6**: Gate axe-core en CI (`tests/a11y.spec.ts`) para certificar cumplimiento automático.
- [x] **1.1**: Migrar tarjetas de accesos rápidos y procesos a componentes semánticos operables por teclado.
- [x] **1.2**: Migración de contenidos de gestiones y procesos a páginas completas dedicadas (`GestionContentPage`, `ProcessJourneyPage`, `PortalFlowPage`) conforme a la Regla 13, y diálogos de utilidades (`DirectConsultasModal`, `UserWayAccessibilityModal`, `VirtualAssistantModal`) al componente accesible con trampa de foco, `Esc` y scroll lock.
- [x] **1.3**: Región `aria-live` y `role="log"` en chat RITA montado para anunciar nuevos mensajes a lectores de pantalla.
- [x] **1.4**: Jerarquía de encabezados (`heading-order`) corregida en `ui/Card`, banner y footer; gate en 0 violaciones.
- [x] **2.1**: Barrido de tokens (`slate-*`, `rounded-[16px]` a tokens oficiales `sat-*`).
- [x] **2.2**: Corrección del patrón combobox ARIA en el buscador global del `Header.tsx` con cuadrícula de 4 columnas desktop.
- [x] **2.3**: Indicadores de carga (`aria-busy`) y mensajes de error accesibles (`aria-invalid` + `aria-describedby`) con acción de ejemplo/reintento en consultas directas.
- [x] **3.1**: Ajuste de microtextos (subir textos pequeños a escala legible).
- [x] **3.2**: Contador de truncado explícito ("Mostrando X de Y rutas guiadas") y botón de expansión en `GuidedProcessesSection`.
- [x] **3.3**: Keyframes formales `animate-fadeIn` con respeto a `prefers-reduced-motion: reduce`, limpieza de clases Bootstrap inactivas y enlace de salto al contenido principal (`#main-content`) en `Header.tsx`.
- [x] **4.1**: Certificación automatizada con axe-core y test de reflow a 320px en `tests/a11y.spec.ts`.

---

### 2. Responsive Design & Mobile First
- [x] **Pilar 1**: Separación formal entre Arquitectura de Información (IA), Navegación y Responsive Design.
- [x] **Pilar 2**: Definición técnica de breakpoints (`< 768px`, `768–1023px`, `1024–1439px`, `≥ 1440px`).
- [x] **Pilar 3**: Componente `Breadcrumbs.tsx` con elipsis interactiva en móvil (`Inicio` + `[...]` + niveles activos).
- [x] **Pilar 4**: Menú contextual acoplado y navegación local adaptativa en `App.tsx` y `SegmentTramitesCatalog.tsx`.
- [x] **Fase 1.3**: Escala tipográfica fluida (`clamp()`) para encabezados definida en `tokens.css` (`--sat-text-h1..h3`).
- [x] **Fase 3.1**: Touch hitboxes $\ge 44\text{px}$ en carrusel, controles y checkboxes de requisitos.
- [x] **Fase 3.3**: Sustitución de modales de detalle por páginas completas dedicadas (`GestionContentPage`, `ProcessJourneyPage`, `SolicitarNitPage`, `ActualizarRtuPage`) sin doble scroll en móvil.
- [x] **Fase 4.3**: Barra de filtros horizontales por etapa del ciclo de vida ATO conectada en `SegmentTramitesCatalog.tsx`.
- [x] **Fase 4.4**: Inputs y buscadores con atributos `inputMode` y `enterKeyHint` optimizados para teclados virtuales móviles.
- [x] **Fase 5.1**: Certificación automatizada de reflow sin desbordamiento horizontal en viewport móvil compacto (`320px`) en `tests/a11y.spec.ts`.

---

### 3. Backlog de Evolución del Portal y Catálogo
- [x] **Navegación Nivel 1–5**: Árbol taxonómico estrictamente numérico (`Nivel 1` a `Nivel 5`) con compactación asimétrica (`—`) implementado en catálogo y base de datos.
- [x] **Badges Regulatorios**: Distintivo neutral `Propuesta normativa SAT` en gestiones con brecha operativa identificada.
- [x] **Gobernanza Canónica y Orden ATO**: Catálogo de 714 gestiones ordenado determinísticamente por `orden_n1..orden_n5`, `orden_contenido` y ciclo de vida ATO, con código institucional inmutable `SAT-GES-####`.
- [x] **Carrusel Preservado**: Accesos rápidos preservados conforme al diseño aprobado de la Lámina 11 oficial con controles accesibles.
- [x] **Ficha de Detalle en Página Completa**: Reestructuración de las fichas de gestión en pasos cronológicos numerados en Lenguaje Ciudadano (`GestionContentPage.tsx`).
- [x] **CTA Ficha de Detalle**: Botón de acción principal visible destacado hacia Agencia Virtual o Declaraguate con base legal y grafo de relaciones (`prerrequisitos`, `siguientes pasos`, `familia temática`).
- [x] **Búsqueda Global**: Rejilla de resultados del buscador del `Header` homologada a 4 columnas desktop con estilo neutro institucional.
- [x] **Cultura Tributaria**: Recursos formativos e instructivos integrados en la taxonomía y bajo la familia temática transversal `FAM-10`.
- [ ] **Mesa Técnica de Aduanas**: Validación institucional externa con la Intendencia de Aduanas sobre las brechas operativas documentadas en `docs/arquitectura-informacion/brechas-comercio-exterior.md`.

---

## 📂 Archivos en esta Carpeta

- [`01_ROADMAP_AUDITORIA_UX_A11Y.md`](./01_ROADMAP_AUDITORIA_UX_A11Y.md) — Plan detallado de accesibilidad, W3C/WAI, componentes semánticos y tokens.
- [`02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md`](./02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md) — Plan detallado de adaptación responsive, viewports y superficies táctiles.
- [`03_ROADMAP_BACKLOG_PORTAL.md`](./03_ROADMAP_BACKLOG_PORTAL.md) — Backlog de producto, arquitectura tributaria, portada y lenguaje ciudadano.
