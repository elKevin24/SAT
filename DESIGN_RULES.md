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

## 3. Estilo Estándar de las Tarjetas (SAT Design System Original)
Las tarjetas deben respetar el estilo original interactivo consolidado en el repositorio:
- **Estructura base**: Fondo blanco `bg-white`, borde sutil `border border-[#DCDCDC]`, esquinas redondeadas `rounded-[16px]` o `rounded-[14px]`.
- **Efecto Hover Interactivo (Fondo Sólido + Tipografía Blanca)**:
  - Al posar el cursor sobre la tarjeta (`hover`), el fondo cambia al color primario del segmento (`hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]`, `hover:bg-[#C25E00]`).
  - Sombra de elevación institucional `hover:shadow-[0_14px_30px_rgba(...)]` y ligero desplazamiento `hover:-translate-y-1`.
  - Los textos interiores cambian automáticamente a blanco (`group-hover:text-white`, `group-hover:text-white/90`).
  - Los badges cambian a semi-translúcido claro (`group-hover:bg-white/20 group-hover:text-white`).
  - El indicador de acción inferior se ilumina en blanco con desplazamiento sutil (`group-hover:translate-x-1` `→`).

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
