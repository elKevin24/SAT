# Roadmap 01: Auditoría UX / UI y Accesibilidad WCAG 2.2

Plan de acción derivado de la revisión técnica del portal (Vite + React 19 + TypeScript + Tailwind v4). Cada problema está mapeado a **guías oficiales de buenas prácticas** (W3C/WAI, GOV.UK Design System, WebAIM, NHS, Home Office, W3C Design Tokens, Microsoft Writing Style).

---

## 📌 Principios Rectores

- El **design system del proyecto (`tokens.css`, `src/components/ui/*`)** es la única fuente de verdad visual. Las guías externas son de referencia práctica: no introducen tokens ni componentes nuevos salvo extensión justificada.
- Toda interfaz debe ser operable **por teclado**, con **semántica/ARIA correcta** y **texto comprensible** (medida por WCAG 2.2 AA — incluye 2.5.8 tamaño de objetivo y 2.4.11 foco no oculto).
- Escritura de contenidos bajo directrices de claridad y precisión en lenguaje ciudadano.

---

## 📋 Lista de Control de Tareas (Checklist)

### Fase 0: P0/P1 Pre-auditoría
- [x] **0.1** Componente `ui/Card` con variantes (badges, footer, selected ring accesible).
- [x] **0.2** Ajuste en `UserSegmentCards` y catálogo para foco visible.
- [x] **0.3** Soporte de `prefers-reduced-motion` en `RotaryBanner`.
- [x] **0.4** Corrección del orden en móvil y etiquetas `aria-label` en `Header`.
- [x] **0.5** Ajuste de contraste y checkboxes en `TramiteDetailModal`.
- [x] **0.6** Sustitución de emojis decorativos por texto accesible y tokens en `InstitutionalFooter`.

---

### Fase 0b: Quick Wins de Bajo Costo y Alto Impacto
- [x] **0b.1 Datos simulados etiquetados (ALTO 1)**:
  - *Ubicación*: `src/components/DirectConsultasModal.tsx`.
  - *Acción*: Aviso visible y accesible (`role="note"`, `aria-label`) indicando que son datos de demostración con enlace oficial al Portal SAT.
- [x] **0b.2 Home con `h1` descriptivo (ALTO 3)**:
  - *Ubicación*: `src/App.tsx`.
  - *Acción*: Agregado `<h1 className="sr-only">Portal de Trámites y Servicios de la SAT en línea</h1>` al inicio del `main`.
- [x] **0b.3 Campos sin etiqueta `<label>` (ALTO 2)**:
  - *Ubicación*: `DirectConsultasModal.tsx` y `VirtualAssistantModal.tsx` (RITA).
  - *Acción*: `<label>` visible o accesible con atributos `htmlFor`/`id` en todos los inputs de formulario.
- [x] **0b.4 Tabs/filtros con estado ARIA (ALTO 5)**:
  - *Ubicación*: `PopularTopicsTabs.tsx`, `GuidedProcessesSection.tsx`, `DirectConsultasModal.tsx`.
  - *Acción*: Botones de filtro y pestañas con atributo `aria-pressed={isActive}`.
- [x] **0b.5 Herramienta de Lint de Accesibilidad en CI**:
  - *Acción*: `eslint` 9 flat config (`eslint.config.js`) + `@babel/eslint-parser` (typescript-eslint incompatible con `typescript@7.0.2`) + `eslint-plugin-jsx-a11y`. `npm run lint` = `tsc --noEmit && eslint src --max-warnings=0`.
  - *Resuelto al integrarlo*: backdrops con `onClick` muerto (4 modales), anchor `href="#"`→`#/` en página de diagrama, fix TS pre-existente en `Breadcrumbs.tsx` (`useRef<HTMLLIElement>`). Quedan con `eslint-disable` + referencia a ROADMAP: `<div onClick>` de tema Fase 1 (ver 1.1).
- [x] **0b.6 Gate axe-core en CI (verificación)**:
  - *Acción*: `@playwright/test` + `@axe-core/playwright` (`playwright.config.ts`, `tests/a11y.spec.ts`, script `npm run test:a11y`). Escanea Home, Catálogo y los 4 modales con tags `wcag2a/aa`, `wcag21a/aa`, `wcag22aa`, `best-practice`.
  - *Arreglado al montar el gate* (contraste, WCAG 1.4.3 / tamaño de objetivo WCAG 2.5.8): puntitos del bobina (ahora zona táctil 24px con punto interior), contador "1 de 3" (`text-sat-azul`), tarjeta Contact Center del footer (sin `bg-white/5`, el token celeste cumple AA sobre navy), horario `text-slate-400`→`text-slate-300`, enlaces de Denuncias con `py-1` (objetivo ≥24px), chips de cabecera de modales (`bg-black/25 border border-white/20 text-white` — el translúcido blanco/20 no alcanzaba 4.5:1), chips de ubicación de pasos (`text-slate-500`→`text-slate-600`), botones de expandir/contraer de `SidebarNav` (`p-1`→`p-2 -m-1`, objetivo 24px).
  - *Deuda resuelta*: **`heading-order`** resuelta en Fase 1.4 (`ui/Card` con `headingLevel`, `RotaryBanner` con `h3`, `InstitutionalFooter` con `h2`/`h3`). `ALLOWED_RULES` vacío en `tests/a11y.spec.ts`.

---

### Fase 1: P0 — Teclado y Modales

> **Orden de ejecución sugerido (decisión queda registrada aquí, no es bloqueante):**
> 1. ~~**1.4** primero~~ *(Completado: deuda axe en 0)*.
> 2. **1.2** — migrar los modales a `<dialog>` nativo de a uno.
> 3. **1.1** — tarjetas clickeables a teclado.
> 4. **1.3** — conectar RITA (hoy nunca se monta) ya con `aria-live`.

- [x] **1.1 Tarjetas activables solo con ratón (CRÍTICO 1)**:
  - *Ubicación*: `PopularTopicsTabs.tsx` y `GuidedProcessesSection.tsx`.
  - *Acción*: Migradas a `ui/Card` semántico con soporte nativo de teclado (`Enter` y `Espacio`), `role="button"`, `tabIndex={0}` y anillo de foco visible (`focus-visible:ring-sat-azul`).
- [x] **1.2 Migración de los 5 Diálogos a Patrón Accesible (CRÍTICO 2)**:
  - *Ubicación*: `TramiteDetailModal`, `DirectConsultasModal`, `GuidedProcessModal`, `UserWayAccessibilityModal`, `VirtualAssistantModal`.
  - *Acción*: Migrados al componente unificado `src/components/ui/Modal.tsx` y hook `useDialogA11y` con contención de foco (`Tab`/`Shift+Tab`), cierre consistente con `Esc`, scroll lock de fondo y restauración de foco al elemento de activación.
- [x] **1.3 Notificaciones dinámicas en Asistente Virtual RITA**:
  - *Ubicación*: `VirtualAssistantModal.tsx` y `App.tsx`.
  - *Acción*: RITA montada en `App.tsx`; lista de mensajes dotada de `role="log"`, `aria-live="polite"`, `aria-atomic="false"` y atributos dialog accesibles con trampa de foco (`useDialogA11y`).
- [x] **1.4 Jerarquía de encabezados (`heading-order`)**:
  - *Ubicación*: `src/components/ui/Card.tsx`, `UserSegmentCards.tsx`, `RotaryBanner.tsx`, `SegmentTramitesCatalog.tsx`, `InstitutionalFooter.tsx`.
  - *Acción*: Prop `headingLevel` añadida a `ui/Card` (`h2` en categorías, `h3` en subtemas/trámites y segmentos). `RotaryBanner` ajustado a `h3` y columnas de footer a `h2`/`h3`. Retirado `heading-order` de `ALLOWED_RULES` en `tests/a11y.spec.ts`. Suite axe-core pasando con 0 violaciones.

---

### Fase 2: P1 — Tokens, Combobox y Estados
- [ ] **2.1 Barrido de Tokens Pendientes (ALTO 4)**:
  - *Ubicación*: Archivos con remanentes de `slate-*`, valores hex y clases arbitrarias `rounded-[14px]/[16px]/2xl`.
  - *Acción*: Migración a variables del sistema `sat-*` y `rounded-xl`. Agregar regla o script para evitar la reintroducción de tokens no estandarizados.
- [ ] **2.2 Combobox ARIA en Buscador Global (MEDIO 1)**:
  - *Ubicación*: Buscador del `Header.tsx`.
  - *Acción*: Implementar el patrón APG Combobox (`role="combobox"`, `aria-controls`, `aria-expanded`, navegación con flechas) o convertirlo en lista simple de enlaces si no hay autocompletado real en el input.
- [ ] **2.3 Estados de Carga y Manejo de Errores (MEDIO 2)**:
  - *Ubicación*: Módulos de consulta (`DirectConsultasModal`, `VirtualAssistantModal`).
  - *Acción*: Atributo `aria-busy="true"` durante la carga; mensajes de error claros vinculados al campo mediante `aria-describedby` con botón de reintento.

---

### Fase 3: P2 — Pulido Visual y Contenidos
- [ ] **3.1 Escala de Microtextos (MEDIO 3)**:
  - *Acción*: Elevar textos pequeños de 10–11px a un mínimo de 12–14px (objetivo 16px para texto regular). Evitar su reducción en resoluciones móviles.
- [ ] **3.2 Contador de Truncado Explícito (MEDIO 4)**:
  - *Ubicación*: `GuidedProcessesSection` y `QuickAccessCarousel`.
  - *Acción*: Añadir texto informativo "Mostrando X de Y" o enlace "Ver todos los procesos".
- [ ] **3.3 Animación de Aparición Segura (MEDIO 5)**:
  - *Acción*: Definir keyframes formales para `animate-fadeIn` respetando la directiva `@media (prefers-reduced-motion: reduce)`.
- [ ] **3.4 Limpieza de Clases de Bootstrap Inactivas (MEDIO 6)**:
  - *Acción*: Eliminar clases residuales (`btn`, `navbar`, `dropdown-menu`, `form-control`, `input-group`, `fw-bold`) que no tienen efecto en Tailwind v4.
- [ ] **3.5 Puntos Bajos y Elementos de Desarrollo**:
  - *Acción*: Ocultar enlaces de desarrollo expuestos en `Header.tsx` en entorno de producción; unificar IDs para el skip-link institucional (`id="main-content"`).

---

### Fase 4: Auditoría y Verificación de Cumplimiento
- [x] **4.1 Verificación de compilación limpia**: `npm run build` pasando sin errores de TypeScript.
- [x] **4.2 Auditoría automatizada**: Gate axe-core implementado en Fase 0b.6 (`npm run test:a11y`): Home, Catálogo y 4 modales, con deuda conocida permitida y bloqueo de violaciones nuevas.
- [ ] **4.3 Prueba de teclado completa**: Navegación de punta a punta con `Tab`, `Shift+Tab`, `Enter`, `Espacio` y `Esc`.
- [ ] **4.4 Prueba con lector de pantalla**: Verificación con NVDA en Windows.
- [ ] **4.5 Prueba de reflow**: Comprobación a 320px de ancho y zoom del 200% (WCAG 1.4.10 / 1.4.4).
