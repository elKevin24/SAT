# Documentación Oficial — Portal Web SAT Guatemala

Este directorio centraliza la documentación técnica, arquitectónica, normativa, plantillas de implementación **WPBakery + The7 Classic (100% Cero `[vc_raw_html]`)** y fuentes de datos del **Portal Web SAT Guatemala**.

---

## 📁 Estructura General de Carpetas y Guías

```text
docs/
├── GUIA_IMPLEMENTACION_WORDPRESS_THE7.md # Manual paso a paso para WordPress + The7 Classic + WPBakery (0% [vc_raw_html])
├── PLAN_CREACION_PAGINAS_WORDPRESS.md    # Plan secuencial en 5 Olas (Ola 0 → Ola 4) para crear las 160 páginas con su Padre, Slug y Breadcrumb
├── plantillas-wpbakery/                  # 160 plantillas .txt + Planificador Offline .html + 2 paquetes .xml WXR
├── roadmaps/                             # Hojas de ruta, auditorías técnicas y checklists cerrados al 100%
├── arquitectura-informacion/             # Taxonomía numérica Nivel 1 a Nivel 5, catálogo de 714 gestiones y ciclo ATO
├── diseno-normativa/                     # Design System SAT (DESIGN_RULES.md) y hoja CSS oficial para The7
└── fuentes-datos/                        # Insumos históricos (congelados) y libros Excel maestros vivos de 25 columnas (sincronizados)
```

---

## 📊 Matriz de Carpetas y Estado

| Carpeta / Documento | Descripción | Gobernanza | Índice / Acceso |
| :--- | :--- | :---: | :--- |
| [`PLANIFICADOR_OFFLINE_WPBAKERY.html`](./plantillas-wpbakery/PLANIFICADOR_OFFLINE_WPBAKERY.html) | **App Offline de Doble Clic (Sin Servidor)**: Buscador, filtro por Olas 0–4, casillas de progreso, selector `[bsf-info-box]` vs `[vc_column_text]` y copiado en 1 clic de las 160 páginas. | Activo | [`PLANIFICADOR_OFFLINE_WPBAKERY.html`](./plantillas-wpbakery/PLANIFICADOR_OFFLINE_WPBAKERY.html) |
| [`PLAN_CREACION_PAGINAS_WORDPRESS.md`](./PLAN_CREACION_PAGINAS_WORDPRESS.md) | **Plan Maestro de Creación de 160 Páginas**: Orden exacto de Padres a Hijos (Olas 0 a 4) para que `[dt_breadcrumbs]` y `link="url:..."` conecten automáticamente. | Activo | [`PLAN_CREACION_PAGINAS_WORDPRESS.md`](./PLAN_CREACION_PAGINAS_WORDPRESS.md) |
| [`GUIA_IMPLEMENTACION_WORDPRESS_THE7.md`](./GUIA_IMPLEMENTACION_WORDPRESS_THE7.md) | **Guía Operativa WordPress + WPBakery (0% `[vc_raw_html]`)**: Configuración de enlaces permanentes, CSS oficial en The7, 6 procesos conectados en 3 pasos e importador XML WXR. | Activo | [`GUIA_IMPLEMENTACION_WORDPRESS_THE7.md`](./GUIA_IMPLEMENTACION_WORDPRESS_THE7.md) |
| [`plantillas-wpbakery/`](./plantillas-wpbakery/_INDICE.md) | **160 Plantillas `.txt` y 2 Paquetes `.xml` WXR**: Shortcodes nativos `[vc_row]`, `[dt_breadcrumbs]`, `[bsf-info-box]` y `[vc_tta_tabs]` libres de `[vc_raw_html]`. | Activo | [`plantillas-wpbakery/_INDICE.md`](./plantillas-wpbakery/_INDICE.md) |
| [`roadmaps/`](./roadmaps/README.md) | **Hojas de Ruta**: Auditoría UX/UI, Accesibilidad WCAG 2.2 AA y Mobile First. | Activo | [`roadmaps/README.md`](./roadmaps/README.md) |
| [`arquitectura-informacion/`](./arquitectura-informacion/README.md) | **Arquitectura de Información**: Estructura de 714 gestiones (`Nivel 1` a `Nivel 5`), mapas estructurados y ciclo ATO. | Activo | [`arquitectura-informacion/README.md`](./arquitectura-informacion/README.md) |
| [`diseno-normativa/`](./diseno-normativa/README.md) | **Diseño y Normativa**: Reglas UI/UX, Design System SAT, hoja `sat-design-system-wpbakery.css` y especificación responsive. | Activo | [`diseno-normativa/README.md`](./diseno-normativa/README.md) |
| [`fuentes-datos/`](./fuentes-datos/README.md) | **Fuentes de Datos**: Fuentes históricas (congeladas) vs. Entregables vivos de 25 columnas (sincronizados con el JSON). | Activo | [`fuentes-datos/README.md`](./fuentes-datos/README.md) |

---

## 🏛️ Gobernanza Documental en Fuentes de Datos

El repositorio establece una frontera formal entre dos categorías de documentos:

1. **Fuentes Históricas / Clásicas (Inalterables por diseño):**
   - [`Detalle de Contenido para Grupos de Interes.xlsx`](./fuentes-datos/01_archivos_inicio_historicos/Detalle%20de%20Contenido%20para%20Grupos%20de%20Interes.xlsx): Relevamiento primario institucional.
   - [`Arbol_de_Navegacion_Portal_v5.xlsx`](./fuentes-datos/01_archivos_inicio_historicos/Arbol_de_Navegacion_Portal_v5.xlsx): Árbol de navegación original antes de la optimización canónica.
   - [`Ruta de procesos.xlsx`](./fuentes-datos/01_archivos_inicio_historicos/Ruta%20de%20procesos.xlsx): Matriz de procesos guiados base.
2. **Entregables Oficiales Vivos (Sincronizados con `src/data/allTramites.json`):**
   - [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](./fuentes-datos/02_archivos_producto_entregables/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx): Libro maestro de 714 gestiones con matriz canónica de 25 columnas, migas de pan y desglose por Nivel 1.
   - [`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](./fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx): Jerarquías y fichas en Lenguaje Ciudadano.
   - [`src/data/allTramites.json`](../src/data/allTramites.json): Base de datos única (Single Source of Truth) en producción.
   - [`docs/plantillas-wpbakery/`](./plantillas-wpbakery/_INDICE.md): Paquete completo de 160 plantillas WPBakery, importadores `.xml` WXR y planificador offline `.html`.
