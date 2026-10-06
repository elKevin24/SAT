# Reglas Oficiales de Diseño y UI/UX - SAT Guatemala

Este documento establece los principios de diseño, estilo y restricciones de interfaz de usuario obligatorias para el proyecto del **Portal Web SAT Guatemala**.

---

## 1. Regla de Tarjetas (Cards) sin Íconos y sin Números
- **Cero íconos decorativos en tarjetas**: Las tarjetas de segmentos, trámites, accesos rápidos, rutas de procesos y temas populares **NO deben contener íconos gráficos**.
- **Cero números o conteos administrativos en las tarjetas**: 
  - Eliminar etiquetas numéricas como `4 Grupos`, `350 Trámites`, `7 pasos`, etc.
  - La tarjeta debe presentar exclusivamente **Título**, **Descripción con UX Writing** y el **enlace de acción** (`→`).

---

## 2. Aplicación de UX Writing en Tarjetas y Textos
- **Lenguaje ciudadano y directo**: Redacción clara, concisa, comprensible para cualquier persona sin tecnicismos innecesarios.
- **Enfoque en el beneficio y la acción del usuario**: Explicar claramente qué puede hacer o resolver el contribuyente en esa sección.
- **Títulos en infinitivo o afirmativos**: Evitar códigos o nombres burocráticos internos.

---

## 3. Uso Mínimo y Restringido de Iconografía
- La iconografía debe usarse **lo menos posible** en todo el portal.
- Se reserva únicamente para controles funcionales indispensables (lupa de búsqueda, flechas de navegación `<` `>`, botón de cerrar `×`, o menú móvil).
- Evitar saturar botones, listas y encabezados con íconos decorativos.

---

## 4. Estilo Estándar de las Tarjetas (SAT Design System Original)
Las tarjetas deben respetar el estilo original interactivo consolidado en el repositorio:
- **Estructura base**: Fondo blanco `bg-white`, borde sutil `border border-[#DCDCDC]`, esquinas redondeadas `rounded-[16px]` o `rounded-[14px]`.
- **Efecto Hover Interactivo (Fondo Sólido + Tipografía Blanca)**:
  - Al pasar el cursor sobre la tarjeta (`hover`), el fondo cambia al color primario del segmento (`hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]`, `hover:bg-[#C25E00]`).
  - Sombra de elevación institucional `hover:shadow-[0_14px_30px_rgba(...)]` y ligero desplazamiento `hover:-translate-y-1`.
  - Los textos interiores cambian automáticamente a blanco (`group-hover:text-white`, `group-hover:text-white/90`).
  - El indicador de acción inferior se ilumina en blanco con desplazamiento sutil (`group-hover:translate-x-1` `→`).

---

## 5. Minimalismo, Modo Claro y Heurísticas Nielsen
- **Modo claro predeterminado**: Fondos blancos y neutros limpios (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`), evitando gradientes o fondos pesados.
- **Layout compacto**: Aprovechamiento eficiente del espacio vertical sin sobrecarga cognitiva.
- **Heurísticas de Jakob Nielsen**:
  - H1: Visibilidad del estado del sistema con migas de pan (*breadcrumbs*) limpias.
  - H2: Relación con el mundo real (lenguaje ciudadano mediante UX Writing).
  - H6: Reconocimiento antes que recuerdo.
  - H7: Flexibilidad y atajos rápidos.

---

*Fecha de actualización: Octubre 2026*
