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
- [ ] **0b.5 Herramienta de Lint de Accesibilidad en CI**:
  - *Acción*: Configurar `eslint-plugin-jsx-a11y` con ESLint flat config para detección automática en `npm run lint`.

---

### Fase 1: P0 — Teclado y Modales
- [ ] **1.1 Tarjetas activables solo con ratón (CRÍTICO 1)**:
  - *Ubicación*: `PopularTopicsTabs.tsx` y `GuidedProcessesSection.tsx`.
  - *Problema*: Elementos `<div onClick>` inoperables mediante navegación por teclado.
  - *Acción*: Migrar a `ui/Card` semántico o `<button>` con soporte para teclas `Enter` y `Espacio`, y foco visible.
- [ ] **1.2 Migración de los 5 Diálogos a Patrón Accesible (CRÍTICO 2)**:
  - *Ubicación*: `TramiteDetailModal`, `DirectConsultasModal`, `GuidedProcessModal`, `UserWayAccessibilityModal`, `VirtualAssistantModal`.
  - *Problema*: Falta de contención de foco (focus trap), cierre consistente con `Esc` y restauración de foco al cerrar.
  - *Acción*: Migrar integralmente al componente `src/components/ui/Modal.tsx` o implementar `<dialog>` nativo con trampa de foco y bloqueo de scroll de fondo.
- [ ] **1.3 Notificaciones dinámicas en Asistente Virtual RITA**:
  - *Ubicación*: `VirtualAssistantModal.tsx`.
  - *Acción*: Agregar región `aria-live="polite"` o `role="log"` para notificar la llegada de nuevos mensajes a usuarios de lectores de pantalla.

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
- [ ] **4.2 Auditoría automatizada**: Ejecución de axe-core en páginas principales y modales.
- [ ] **4.3 Prueba de teclado completa**: Navegación de punta a punta con `Tab`, `Shift+Tab`, `Enter`, `Espacio` y `Esc`.
- [ ] **4.4 Prueba con lector de pantalla**: Verificación con NVDA en Windows.
- [ ] **4.5 Prueba de reflow**: Comprobación a 320px de ancho y zoom del 200% (WCAG 1.4.10 / 1.4.4).
