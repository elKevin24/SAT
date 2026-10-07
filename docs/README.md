# Documentación Oficial — Portal Web SAT Guatemala

Este directorio centraliza toda la documentación técnica, arquitectónica, normativa y de seguimiento del **Portal Web SAT Guatemala**, organizada temáticamente en cuatro carpetas especializadas.

---

## 📁 Estructura General de Carpetas

```text
docs/
├── roadmaps/                 # Hojas de ruta, auditorías y tareas pendientes con checkboxes
├── arquitectura-informacion/ # Taxonomía, catálogo de 783 trámites y brechas aduaneras
├── diseno-normativa/         # Design System SAT, reglas UI/UX y manuales de marca
└── fuentes-datos/            # Matrices maestras Excel de extracción y consolidación
```

---

## 📊 Matriz de Carpetas y Estado

| Carpeta | Descripción | Estado | Índice |
| :--- | :--- | :---: | :--- |
| [`roadmaps/`](./roadmaps/README.md) | **Hojas de Ruta**: Auditoría UX/UI, Accesibilidad WCAG 2.2, Mobile First y Backlog. | Activo | [`roadmaps/README.md`](./roadmaps/README.md) |
| [`arquitectura-informacion/`](./arquitectura-informacion/README.md) | **Arquitectura de Información**: Estructura de 783 trámites (L1 a L6+), taxonomía ATO y recorridos. | Activo | [`arquitectura-informacion/README.md`](./arquitectura-informacion/README.md) |
| [`diseno-normativa/`](./diseno-normativa/README.md) | **Diseño y Normativa**: Reglas UI/UX, Design System SAT, especificación responsive y manuales gráficos. | Activo | [`diseno-normativa/README.md`](./diseno-normativa/README.md) |
| [`fuentes-datos/`](./fuentes-datos/README.md) | **Fuentes de Datos**: Libros Excel originales y la matriz maestra definitiva de 783 filas. | Activo | [`fuentes-datos/README.md`](./fuentes-datos/README.md) |

---

## ✅ Lista de Control Maestra (Checklist Global de Entregables)

### 1. Hojas de Ruta y Ejecución Técnica (`docs/roadmaps/`)
- [x] **Tablero Maestro**: Centralización de planes en carpeta única con métricas.
- [x] **Accesibilidad Base (Fase 0/0b)**: Contraste, labels, foco visible, datos demo delimitados.
- [ ] **Accesibilidad P0/P1**: Migración a botones semánticos operables por teclado (`div onClick` eliminados).
- [ ] **Modales**: Migración integral de los 5 modales a componente accesible con trampa de foco y `Esc`.
- [ ] **Tokens DS**: Barrido de clases residuales `slate-*` a tokens institucionales `sat-*`.
- [ ] **Mobile First Layout**: Wrappers globales `Container` y escala tipográfica fluida `clamp()`.
- [ ] **Tablas y Filtros Móviles**: Transformación de tablas densas a tarjetas apiladas y Drawer de filtros.
- [ ] **Auditoría Automatizada**: Verificación con axe-core y lector de pantalla (NVDA).

### 2. Arquitectura de Información (`docs/arquitectura-informacion/`)
- [x] **Marco Maestro de IA-UX (8 capas)**: Modelo mental, tareas, procesos, contenido, findability, relaciones y gobernanza ([Detalle](./arquitectura-informacion/ARQUITECTURA_INFORMACION_CENTRADA_EN_USUARIO.md)).
- [x] **Universo 783 trámites**: Consolidación sin pérdida en formato jerárquico padre/hijo.
- [x] **Separación de capas**: Desacoplamiento formal de Arquitectura vs. Navegación vs. Responsive.
- [x] **Soporte Nivel 6+**: Extensibilidad para procedimientos específicos y variantes de detalle.
- [x] **Dimensiones ATO**: Clasificación bidimensional (5 etapas del ciclo + 4 tipos de interacción).
- [ ] **Mesa Técnica de Aduanas**: Sesión con Intendencia para validar las 26 brechas operativas.

### 3. Sistema de Diseño y Normativa (`docs/diseno-normativa/`)
- [x] **Manual de Identidad SAT**: Integración y respeto a la paleta oficial y normas gráficas.
- [x] **Jerarquía de Referencias**: Design System SAT (visual) $\to$ GOV.UK (público) $\to$ WCAG 2.2 AA (técnico). Fluent 2 descartado.
- [x] **Navegación Adaptativa Dual**: Breadcrumbs con elipsis interactiva en móvil y Sidebar sticky en desktop.
- [x] **Touch Targets**: Tamaño táctil mínimo $\ge 44 \times 44$px en navegación principal.
- [ ] **Modales Full-screen Móvil**: Adaptación automática a pantalla completa en viewports $< 768$px.

### 4. Integridad de Datos (`docs/fuentes-datos/`)
- [x] **Matriz Definitiva**: `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` con 783 filas sincronizadas.
- [x] **Extracción JSON**: Generación de datasets optimizados para el catálogo web (`allTramites.json`).
- [ ] **Verificación de Enlaces Oficiales**: Auditoría de URLs externas directas para los 783 trámites.
