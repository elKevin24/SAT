# Tablero Maestro de Roadmaps — Portal SAT

Este directorio centraliza las hojas de ruta (**Roadmaps**) y planes de ejecución técnica del **Portal SAT Guatemala**. 

---

## 📊 Estado Consolidado del Proyecto

| Roadmap | Área de Trabajo | Estado General | Progreso Estimado | Archivo de Detalle |
| :--- | :--- | :---: | :---: | :--- |
| **01** | **Auditoría UX / UI & Accesibilidad WCAG 2.2** | En ejecución | 80% | [`01_ROADMAP_AUDITORIA_UX_A11Y.md`](./01_ROADMAP_AUDITORIA_UX_A11Y.md) |
| **02** | **Responsive Design & Mobile First** | En ejecución | 50% | [`02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md`](./02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md) |
| **03** | **Backlog de Evolución del Portal** | En ejecución | 60% | [`03_ROADMAP_BACKLOG_PORTAL.md`](./03_ROADMAP_BACKLOG_PORTAL.md) |
| **Doc** | **Sugerencias de Continuidad y UX** | Publicado | 100% | [`docs/arquitectura-informacion/SUGERENCIAS_DE_CONTINUIDAD_Y_UX.md`](../arquitectura-informacion/SUGERENCIAS_DE_CONTINUIDAD_Y_UX.md) |


---

## ✅ Resumen de Tareas Pendientes y Completadas

### 1. Auditoría UX / UI y Accesibilidad (WCAG 2.2 AA)
- [x] **Fase 0**: Pre-auditoría P0/P1 aplicada (Cards con focus ring, Header orden móvil, Footer sin emojis, contraste en modales).
- [x] **0b.1**: Advertencia visual y accesible en verificadores con datos simulados (`DirectConsultasModal`).
- [x] **0b.2**: Encabezado `h1` descriptivo accesible en la portada (`App.tsx`).
- [x] **0b.3**: Etiquetas `<label>` explícitas en inputs de consultas y chat RITA.
- [x] **0b.4**: Atributos `aria-pressed` / `aria-selected` en tabs y botones de filtro.
- [x] **0b.5**: Configurar `eslint-plugin-jsx-a11y` en CI para evitar regresiones de accesibilidad.
- [x] **0b.6**: Gate axe-core en CI (`tests/a11y.spec.ts`) para certificar cumplimiento automático.
- [x] **1.4**: Jerarquía de encabezados (`heading-order`) corregida en `ui/Card`, banner y footer; gate en 0 violaciones.
- [x] **1.2**: Migración completa de los 5 modales (`TramiteDetailModal`, `DirectConsultasModal`, `GuidedProcessModal`, `UserWayAccessibilityModal`, `VirtualAssistantModal`) al componente accesible con trampa de foco, `Esc` y scroll lock.
- [x] **1.3**: Región `aria-live` y `role="log"` en chat RITA montado para anunciar nuevos mensajes a lectores de pantalla.
- [x] **1.1**: Migrar tarjetas de accesos rápidos y procesos con `<div onClick>` a componentes semánticos operables por teclado.
- [ ] **2.1**: Barrido de tokens pendientes (`slate-*`, `rounded-[16px]` a tokens oficiales `sat-*`).
- [ ] **2.2**: Corrección del patrón combobox ARIA en el buscador global del `Header.tsx`.
- [ ] **2.3**: Indicadores de carga (`aria-busy`) y mensajes de error con reintento en consultas directas.
- [ ] **3.1**: Ajuste de microtextos (subir textos de 10-11px a mínimo 12-14px).
- [ ] **3.2**: Contador de paginación/truncado explícito ("Mostrando X de Y").
- [ ] **3.3**: Limpieza de clases Bootstrap inactivas y links de desarrollo en el encabezado.
- [ ] **4.1**: Certificación automatizada con axe-core y verificación con lector de pantalla (NVDA).

---

### 2. Responsive Design & Mobile First
- [x] **Pilar 1**: Separación formal entre Arquitectura de Información (IA), Navegación y Responsive Design.
- [x] **Pilar 2**: Definición técnica de breakpoints (`< 768px`, `768–1023px`, `1024–1439px`, `≥ 1440px`).
- [x] **Pilar 3**: Componente `Breadcrumbs.tsx` con elipsis interactiva en móvil (`Inicio` + `[...]` + niveles activos).
- [x] **Pilar 4**: Componente `SidebarNav.tsx` con navegación sticky en desktop ($\ge 1024$px) y Drawer off-canvas en móvil ($< 1024$px).
- [x] **Pilar 5**: Integración de navegación contextual profunda en `SegmentTramitesCatalog.tsx`.
- [ ] **Fase 1.2**: Wrappers globales de layout (`Container`, márgenes responsivos 16px/24px/32px).
- [ ] **Fase 1.3**: Escala tipográfica fluida (`clamp()`) para encabezados sin saltos abruptos.
- [ ] **Fase 3.2**: Modales con comportamiento adaptativo de pantalla completa (*full-screen sheet*) en dispositivos móviles.
- [ ] **Fase 4.1**: Tablas de requisitos con transformación automática a tarjetas apiladas en pantallas $< 768$px.
- [ ] **Fase 4.2**: Contenedores de datos con scroll horizontal contenido y sombras indicadoras de desbordamiento.
- [ ] **Fase 4.3**: Drawer móvil de filtros avanzados con botón de acción flotante "Aplicar filtros".
- [ ] **Fase 4.4**: Inputs y formularios con atributos `inputmode` optimizados para teclados virtuales móviles.
- [ ] **Fase 5.1**: Matriz de certificación en viewports reales (320px, 375px, 768px, 1024px, 1440px, 1920px).
- [ ] **Fase 5.2**: Prueba de esfuerzo con zoom del navegador al 200% y títulos de trámites de más de 120 caracteres.

---

### 3. Backlog de Evolución del Portal y Catálogo
- [x] **Navegación Nivel 6+**: Árbol taxonómico y soporte para más de 6 niveles documentado e implementado en catálogo.
- [x] **Badges Regulatorios**: Distintivo neutral `Propuesta normativa SAT` en trámites sin ficha oficial previa.
- [ ] **Optimización Portada**: Evaluar retiro o unificación de secciones redundantes en `App.tsx` (accesos rápidos vs. pestañas populares).
- [ ] **Ficha de Detalle**: Reestructuración de la ficha de trámites en pasos cronológicos numerados (*"Paso 1:..."*, *"Paso 2:..."*) en Lenguaje Ciudadano.
- [ ] **CTA Ficha de Detalle**: Botón de acción principal visible destacado hacia Agencia Virtual o Declaraguate con base legal secundaria colapsable.
- [ ] **Búsqueda Global**: Rejilla de resultados del buscador del `Header` homologada a 4 columnas desktop con estilo neutro institucional.
- [ ] **Cultura Tributaria**: Vincular cursos, diplomados y recursos formativos directamente dentro de su categoría operativa (cero silos desconectados).
- [ ] **Mesa Técnica de Aduanas**: Validación de las 26 brechas operativas identificadas en `docs/arquitectura-informacion/brechas-comercio-exterior.md`.

---

## 📂 Archivos en esta Carpeta

- [`01_ROADMAP_AUDITORIA_UX_A11Y.md`](./01_ROADMAP_AUDITORIA_UX_A11Y.md) — Plan detallado de accesibilidad, W3C/WAI, componentes semánticos y tokens.
- [`02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md`](./02_ROADMAP_RESPONSIVE_MOBILE_FIRST.md) — Plan detallado de adaptación responsive, viewports, touch targets y tablas.
- [`03_ROADMAP_BACKLOG_PORTAL.md`](./03_ROADMAP_BACKLOG_PORTAL.md) — Backlog de producto, arquitectura tributaria, portada y lenguaje ciudadano.
