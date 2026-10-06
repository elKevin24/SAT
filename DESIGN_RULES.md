# Reglas Oficiales de Diseño y UI/UX - SAT Guatemala

Este documento establece los principios de diseño, estilo y restricciones de interfaz de usuario obligatorias para el proyecto del **Portal Web SAT Guatemala**.

---

## 1. Regla de Tarjetas (Cards) sin Íconos
- **Cero íconos decorativos en tarjetas**: Las tarjetas de segmentos, trámites, accesos rápidos, rutas de procesos y temas populares **NO deben contener íconos gráficos**.
- **Jerarquía visual tipográfica**: La identidad y diferenciación de cada tarjeta se logra mediante:
  - **Badges de texto compactos** (ej. `4 Grupos`, `Aduanas`, `7 pasos`, etc.).
  - **Tipografía clara y contrastada** (`#19324B` para títulos, `#14649B` para acentos, `#475569` para descripciones).
  - **Bordes y acentos de color institucionales**.

---

## 2. Uso Mínimo y Restringido de Iconografía
- La iconografía debe usarse **lo menos posible** en todo el portal.
- Se reserva únicamente para controles funcionales indispensables (ej. lupa de búsqueda, flechas de paginación `<` `>`, botón de cerrar `×`, o menú móvil).
- Evitar saturar botones, listas y encabezados con íconos decorativos o repetitivos.

---

## 3. Estilo Estándar de las Tarjetas (SAT Design System)
Las tarjetas deben respetar el estilo original consolidado:
- **Estructura y bordes**: `border border-[#DCDCDC]` con fondo blanco `bg-white` y esquinas redondeadas `rounded-[16px]`.
- **Sombra y hover**: Sombra sutil `shadow-xs`, elevación suave `hover:-translate-y-0.5` o `hover:-translate-y-1`, transición de borde a institucional (`hover:border-[#14649B]`).
- **Encabezado interno**: Badge de estado/categoría en la parte superior izquierda, título en negrita institucional.
- **Acción inferior**: Texto de acción directo (ej. `Explorar grupo`, `Ver requisitos`, `Más información`) con indicador de avance discreto (`→`).

---

## 4. Minimalismo, Modo Claro y Heurísticas Nielsen
- **Modo claro predeterminado**: Fondos blancos y neutros limpios (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`), evitando gradientes o fondos pesados que resten legibilidad.
- **Layout compacto**: Aprovechamiento eficiente del espacio vertical sin scroll excesivo innecesario.
- **Heurísticas de Jakob Nielsen**:
  - Visibilidad del estado del sistema con migas de pan (*breadcrumbs*) de texto.
  - Reconocimiento antes que recuerdo mediante listas claras.
  - Flexibilidad, atajos rápidos y lenguaje ciudadano libre de tecnicismos burocráticos.

---

*Fecha de actualización: Octubre 2026*
