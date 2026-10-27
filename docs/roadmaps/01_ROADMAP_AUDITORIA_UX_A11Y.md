# Roadmap 01: Auditoría UX / UI y Accesibilidad WCAG 2.2

Plan de acción derivado de la revisión técnica del portal (Vite + React 19 + TypeScript + Tailwind v4). Cada punto está mapeado a **guías oficiales de buenas prácticas** (W3C/WAI, GOV.UK Design System, WebAIM, NHS, Home Office, W3C Design Tokens).

---

## 📌 Principios Rectores

- El **design system del proyecto (`tokens.css`, `src/components/ui/*`)** es la única fuente de verdad visual.
- Toda interfaz es operable **por teclado**, con **semántica/ARIA correcta** y **texto comprensible** (medida por WCAG 2.2 AA — incluye 2.5.8 tamaño de objetivo y 2.4.11 foco no oculto).
- Escritura de contenidos bajo directrices de claridad y precisión en lenguaje ciudadano, utilizando estrictamente el término **"gestión" / "gestiones"** (Regla 12) y páginas completas dedicadas para contenido (Regla 13).

---

## 📋 Lista de Control de Tareas (Checklist)

### Fase 0: P0/P1 Pre-auditoría
- [x] **0.1** Componente `ui/Card` con variantes (badges, footer, selected ring accesible).
- [x] **0.2** Ajuste en `UserSegmentCards` y catálogo para foco visible.
- [x] **0.3** Soporte de `prefers-reduced-motion` en `RotaryBanner`.
- [x] **0.4** Corrección del orden en móvil y etiquetas `aria-label` en `Header`.
- [x] **0.5** Migración de fichas de gestión a página completa dedicada (`GestionContentPage.tsx`).
- [x] **0.6** Sustitución de emojis decorativos por texto accesible y tokens en `InstitutionalFooter`.

---

### Fase 0b: Quick Wins de Bajo Costo y Alto Impacto
- [x] **0b.1 Datos simulados etiquetados (ALTO 1)**:
  - *Ubicación*: `src/components/DirectConsultasModal.tsx`.
  - *Acción*: Aviso visible y accesible (`role="note"`) indicando que son datos de demostración con enlace oficial al Portal SAT.
- [x] **0b.2 Home con `h1` descriptivo (ALTO 3)**:
  - *Ubicación*: `src/App.tsx`.
  - *Acción*: Agregado `<h1 className="sr-only">Portal de Gestiones y Servicios de la SAT en línea</h1>` al inicio del `main`.
- [x] **0b.3 Campos sin etiqueta `<label>` (ALTO 2)**:
  - *Ubicación*: `DirectConsultasModal.tsx` y `VirtualAssistantModal.tsx` (RITA).
  - *Acción*: `<label>` visible o accesible con atributos `htmlFor`/`id` en todos los inputs de formulario.
- [x] **0b.4 Tabs/filtros con estado ARIA (ALTO 5)**:
  - *Ubicación*: `PopularTopicsTabs.tsx`, `GuidedProcessesSection.tsx`, `DirectConsultasModal.tsx`, `SegmentTramitesCatalog.tsx`.
  - *Acción*: Botones de filtro y pestañas con atributo `aria-pressed={isActive}`.
- [x] **0b.5 Herramienta de Lint de Accesibilidad en CI**:
  - *Acción*: `eslint` 9 flat config (`eslint.config.js`) + `@babel/eslint-parser` + `eslint-plugin-jsx-a11y`. `npm run lint` = `tsc --noEmit && eslint src --max-warnings=0`.
- [x] **0b.6 Gate axe-core en CI (verificación)**:
  - *Acción*: `@playwright/test` + `@axe-core/playwright` (`playwright.config.ts`, `tests/a11y.spec.ts`, script `npm run test:a11y`). Escanea Home, Catálogo, páginas de gestiones/procesos y diálogos de utilidades con tags `wcag2a/aa`, `wcag21a/aa`, `wcag22aa`, `best-practice`. `ALLOWED_RULES` vacío (0 violaciones toleradas).

---

### Fase 1: P0 — Teclado, Páginas Dedicadas y Diálogos de Utilidades
- [x] **1.1 Tarjetas operables por teclado (CRÍTICO 1)**:
  - *Ubicación*: `PopularTopicsTabs.tsx` y `GuidedProcessesSection.tsx`.
  - *Acción*: Migradas a `ui/Card` semántico con soporte nativo de teclado (`Enter` y `Espacio`), `role="button"`, `tabIndex={0}` y anillo de foco visible (`focus-visible:ring-sat-azul`).
- [x] **1.2 Páginas dedicadas de contenido y diálogos accesibles (CRÍTICO 2)**:
  - *Acción*: Eliminados los modales de contenido (`TramiteDetailModal`, `GuidedProcessModal`, `PortalFlowModal`) en favor de páginas dedicadas con URL propia (`GestionContentPage`, `ProcessJourneyPage`, `PortalFlowPage`). Los diálogos de herramientas (`DirectConsultasModal`, `UserWayAccessibilityModal`, `VirtualAssistantModal`) operan con `src/components/ui/Modal.tsx` y hook `useDialogA11y`.
- [x] **1.3 Notificaciones dinámicas en Asistente Virtual RITA**:
  - *Ubicación*: `VirtualAssistantModal.tsx` y `App.tsx`.
  - *Acción*: RITA montada en `App.tsx`; lista de mensajes dotada de `role="log"`, `aria-live="polite"`, `aria-atomic="false"` y trampa de foco (`useDialogA11y`).
- [x] **1.4 Jerarquía de encabezados (`heading-order`)**:
  - *Ubicación*: `src/components/ui/Card.tsx`, `UserSegmentCards.tsx`, `RotaryBanner.tsx`, `SegmentTramitesCatalog.tsx`, `InstitutionalFooter.tsx`.
  - *Acción*: Prop `headingLevel` en `ui/Card`. Suite axe-core pasando con 0 violaciones.

---

### Fase 2: P1 — Tokens, Combobox y Estados
- [x] **2.1 Barrido de Tokens Pendientes (ALTO 4)**:
  - *Ubicación*: `SegmentTramitesCatalog.tsx`, `Header.tsx`, `QuickAccessCarousel.tsx`.
  - *Acción*: Migración de estilos a variables oficiales del sistema `sat-*`.
- [x] **2.2 Combobox ARIA en Buscador Global (MEDIO 1)**:
  - *Ubicación*: Buscador del `Header.tsx`.
  - *Acción*: Implementado el patrón ARIA Combobox (`role="combobox"`, `aria-controls`, `aria-expanded`, `aria-autocomplete="list"`, `aria-label`) y cuadrícula responsiva de 4 columnas desktop.
- [x] **2.3 Estados de Carga y Manejo de Errores (MEDIO 2)**:
  - *Ubicación*: `DirectConsultasModal.tsx` y `VirtualAssistantModal.tsx`.
  - *Acción*: Atributo `aria-busy` durante la consulta; mensajes de error con `role="alert"` vinculados al campo mediante `aria-invalid` y `aria-describedby` con acción rápida de autocompletado de ejemplo.

---

### Fase 3: P2 — Pulido Visual y Contenidos
- [x] **3.1 Escala de Microtextos (MEDIO 3)**:
  - *Acción*: Ajustados textos pequeños a tamaños legibles en tarjetas, diálogos y etiquetas informativas.
- [x] **3.2 Contador de Truncado Explícito (MEDIO 4)**:
  - *Ubicación*: `GuidedProcessesSection.tsx`.
  - *Acción*: Añadido texto informativo `"Mostrando X de Y rutas guiadas disponibles"` con `aria-live="polite"` y botón `"Ver las Y rutas guiadas"`.
- [x] **3.3 Animación de Aparición Segura (MEDIO 5)**:
  - *Acción*: Definidos keyframes formales para `@keyframes fadeIn` y `.animate-fadeIn` en `src/index.css` respetando `@media (prefers-reduced-motion: reduce)`.
- [x] **3.4 Limpieza de Clases de Bootstrap Inactivas (MEDIO 6)**:
  - *Acción*: Eliminadas clases residuales (`dropdown`, `dropdown-menu`, `show`, `dropdown-header`, `dropdown-item`) en `Header.tsx`.
- [x] **3.5 Enlace de Salto al Contenido Principal (Skip Link)**:
  - *Acción*: Enlace `<a href="#main-content">Saltar al contenido principal</a>` visible al recibir foco de teclado al inicio de `Header.tsx`, sincronizado con `id="main-content"` en `App.tsx`.

---

### Fase 4: Auditoría y Verificación de Cumplimiento
- [x] **4.1 Verificación de compilación limpia**: `npm run build` y `npm run lint` pasando con 0 errores y 0 advertencias.
- [x] **4.2 Auditoría automatizada**: Gate axe-core implementado en `tests/a11y.spec.ts` (`npm run test:a11y`).
- [x] **4.3 Prueba de teclado automatizada**: Navegación con `Tab`, `Shift+Tab`, `Enter` y `Escape` validada en `tests/a11y.spec.ts`.
- [x] **4.4 Prueba de reflow a 320px**: Comprobación automatizada a 320px de ancho sin desbordamiento horizontal en `tests/a11y.spec.ts` (WCAG 1.4.10).
