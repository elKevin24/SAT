# Diseño y Normativas Gráficas — Portal SAT

Este directorio reúne los manuales oficiales de marca, reglas de diseño de componentes, directrices de accesibilidad y la especificación de diseño responsivo del **Portal SAT Guatemala**.

---

## 📊 Estado del Sistema de Diseño

| Documento | Alcance | Estado | Checkbox |
| :--- | :--- | :---: | :---: |
| [`DESIGN_RULES.md`](./DESIGN_RULES.md) | Reglas de diseño UI/UX, tokens oficiales y accesibilidad WCAG | Vigente | [x] |
| [`PLAN_RESPONSIVE_MOBILE_FIRST.md`](./PLAN_RESPONSIVE_MOBILE_FIRST.md) | Especificación de los 15 pilares de adaptación responsive | Vigente | [x] |
| `MANUAL DE IMAGEN Y NORMAS GRÁFICAS SAT V5 APROBADO 2026.pdf` | Manual oficial de identidad institucional SAT | Aprobado | [x] |
| `Presentación Propuesta Gráfica Rediseño Portal Web 30.03.26 2.pdf` | Propuesta conceptual aprobada de rediseño | Aprobado | [x] |

---

## 📋 Lista de Control de Diseño e Implementación

### 1. Identidad Institucional y Tokens
- [x] Paleta oficial SAT: Azul Primario (`#14649B`), Azul Profundo (`#19324B`), Acento/Contraste (`#3C9BE0`), Neutros.
- [x] Tipografía institucional y jerarquía visual.
- [x] Isologotipo institucional con SVG vectorial escalable (`SatIsologotipo.tsx`).
- [ ] Barrido completo de clases fuera del Design System (`slate-*`, `rounded-[16px]` a tokens `sat-*`).
- [ ] Regla de linter para impedir reintroducción de tokens externos.

### 2. Principios de Interacción y Tríada Conceptual
- [x] Formalización de la tríada: **Arquitectura de Información (IA)** $\neq$ **Navegación** $\neq$ **Responsive Design**.
- [x] Jerarquía de referencias normativas externas: SAT Design System (autoridad visual) $\to$ GOV.UK (experiencia pública) $\to$ W3C WCAG 2.2 AA (estándar de accesibilidad). Fluent 2 descartado.
- [x] Touch targets mínimos de $44 \times 44$px / $48 \times 48$px en navegación básica.
- [ ] Touch targets extendidos en controles secundarios y filtros móviles.

### 3. Implementación Responsive
- [x] Breakpoints estandarizados (`Mobile < 768px`, `Tablet 768-1023px`, `Desktop ≥ 1024px`).
- [x] Componente `Breadcrumbs` con elipsis móvil interactiva.
- [x] Componente `SidebarNav` con drawer móvil off-canvas.
- [ ] Componente `Container` unificado para márgenes de pantalla.
- [ ] Transformación móvil de tablas a tarjetas apiladas.

---

## 📂 Archivos en esta Carpeta

- [`DESIGN_RULES.md`](./DESIGN_RULES.md) — Documento maestro de reglas técnicas y estéticas del Design System.
- [`PLAN_RESPONSIVE_MOBILE_FIRST.md`](./PLAN_RESPONSIVE_MOBILE_FIRST.md) — Plan técnico integral de 15 pilares de adaptación móvil.
- `MANUAL DE IMAGEN Y NORMAS GRÁFICAS SAT V5 APROBADO 2026.pdf` — Manual institucional de marca.
- `Presentación Propuesta Gráfica Rediseño Portal Web 30.03.26 2.pdf` — Presentación de propuesta visual.
