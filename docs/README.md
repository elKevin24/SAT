# Documentación Oficial — Portal Web SAT Guatemala

Este directorio centraliza la documentación técnica, arquitectónica, normativa y de seguimiento del **Portal Web SAT Guatemala**, organizada temáticamente en cuatro carpetas especializadas.

---

## 📁 Estructura General de Carpetas

```text
docs/
├── roadmaps/                 # Hojas de ruta, auditorías técnicas y backlog
├── arquitectura-informacion/ # Taxonomía, catálogo de 718 trámites, 6 ramas canónicas y mapa de navegación
├── diseno-normativa/         # Design System SAT, reglas UI/UX y manuales de marca
└── fuentes-datos/            # Insumos históricos (congelados) y libros Excel maestros vivos (sincronizados)
```

---

## 📊 Matriz de Carpetas y Estado

| Carpeta | Descripción | Gobernanza | Índice |
| :--- | :--- | :---: | :--- |
| [`roadmaps/`](./roadmaps/README.md) | **Hojas de Ruta**: Auditoría UX/UI, Accesibilidad WCAG 2.2, Mobile First y Backlog. | Activo | [`roadmaps/README.md`](./roadmaps/README.md) |
| [`arquitectura-informacion/`](./arquitectura-informacion/README.md) | **Arquitectura de Información**: Estructura de 718 trámites (L1 a L6+), 6 ramas de Aduanas y dimensiones ATO. | Activo | [`arquitectura-informacion/README.md`](./arquitectura-informacion/README.md) |
| [`diseno-normativa/`](./diseno-normativa/README.md) | **Diseño y Normativa**: Reglas UI/UX, Design System SAT, especificación responsive y manuales gráficos. | Activo | [`diseno-normativa/README.md`](./diseno-normativa/README.md) |
| [`fuentes-datos/`](./fuentes-datos/README.md) | **Fuentes de Datos**: Fuentes históricas (congeladas) vs. Entregables vivos (sincronizados con el JSON). | Activo | [`fuentes-datos/README.md`](./fuentes-datos/README.md) |

---

## 🏛️ Gobernanza Documental en Fuentes de Datos

El repositorio establece una frontera formal entre dos categorías de documentos:

1. **Fuentes Históricas / Clásicas (Inalterables por diseño):**
   - [`Detalle de Contenido para Grupos de Interes.xlsx`](./fuentes-datos/Detalle%20de%20Contenido%20para%20Grupos%20de%20Interes.xlsx): Relevamiento primario institucional.
   - [`Arbol_de_Navegacion_Portal_v5.xlsx`](./fuentes-datos/Arbol_de_Navegacion_Portal_v5.xlsx): Árbol de navegación original antes de la optimización canónica.
   - [`Ruta de procesos.xlsx`](./fuentes-datos/Ruta%20de%20procesos.xlsx): Matriz de procesos guiados base.
2. **Entregables Oficiales Vivos (Sincronizados con `src/data/allTramites.json`):**
   - [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](./fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx): Libro maestro de 718 trámites con fórmulas de resumen, migas de pan y desglose por pilar.
   - [`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](./fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx): Jerarquías y fichas en Lenguaje Ciudadano.
   - [`src/data/allTramites.json`](../src/data/allTramites.json): Base de datos única (Single Source of Truth) en producción.

---

## ✅ Lista de Control Maestra (Checklist Global de Entregables)

### 1. Hojas de Ruta y Ejecución Técnica (`docs/roadmaps/`)
- [x] **Tablero Maestro**: Centralización de planes en carpeta única con métricas.
- [x] **Accesibilidad Base (WCAG 2.2 AA)**: 0 violaciones detectadas por axe-core en toda la suite de tests Playwright.
- [x] **Modales Accesibles**: Contención de foco (focus trap), cierre con `Escape` y retorno de foco al elemento invocador.
- [x] **Navegación por Teclado**: Soporte para activación por `Enter` / `Espacio` en tarjetas interactivas.
- [ ] **Mobile First Layout**: Wrappers globales `Container` y escala tipográfica fluida `clamp()`.
- [ ] **Tablas y Filtros Móviles**: Transformación de tablas densas a tarjetas apiladas y Drawer de filtros.

### 2. Arquitectura de Información (`docs/arquitectura-informacion/`)
- [x] **Marco Maestro de IA-UX (8 capas)**: Modelo mental, tareas, procesos, contenido, findability, relaciones y gobernanza ([Detalle](./arquitectura-informacion/ARQUITECTURA_INFORMACION_CENTRADA_EN_USUARIO.md)).
- [x] **Universo 718 Trámites Saneados**: Consolidación sin pérdida (344 Contribuyentes, 246 Comercio Exterior, 79 Entes Exentos, 49 Profesionales).
- [x] **Consolidación Canónica de Comercio Exterior**: 6 ramas maestras optimizadas sin duplicidad de niveles (Importadores, Exportadores, OEA, AFPA, Regímenes Territoriales, Normativa General).
- [x] **Separación de Capas**: Desacoplamiento formal de Arquitectura vs. Navegación vs. Responsive.
- [x] **Dimensiones ATO**: Clasificación bidimensional (5 etapas del ciclo + 4 tipos de interacción).
- [ ] **Mesa Técnica de Aduanas**: Sesión con Intendencia para validar las 12 brechas operativas.

### 3. Sistema de Diseño y Normativa (`docs/diseno-normativa/`)
- [x] **Manual de Identidad SAT**: Integración y respeto a la paleta oficial y normas gráficas institucionales.
- [x] **Jerarquía de Referencias**: Design System SAT (visual) $\to$ GOV.UK (público) $\to$ WCAG 2.2 AA (técnico). Fluent 2 descartado.
- [x] **Navegación Adaptativa Dual**: Breadcrumbs con elipsis interactiva en móvil y Sidebar sticky en desktop.
- [x] **Touch Targets**: Tamaño táctil mínimo $\ge 44 \times 44$px en elementos de navegación.

### 4. Integridad de Datos (`docs/fuentes-datos/`)
- [x] **Matriz Definitiva**: `Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx` con 718 filas sincronizadas.
- [x] **Mapa de Navegación Excel**: `Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx` con fichas en Lenguaje Ciudadano.
- [x] **Extracción JSON**: Sincronización exacta con `src/data/allTramites.json`.
- [x] **Preservación Histórica**: Fuentes clásicas intactas para auditoría institucional.
