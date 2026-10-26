# Documentación Oficial — Portal Web SAT Guatemala

Este directorio centraliza la documentación técnica, arquitectónica, normativa, plantillas de implementación **WPBakery + The7 Classic** y fuentes de datos del **Portal Web SAT Guatemala**.

---

## 📁 Estructura General de Carpetas y Guías

```text
docs/
├── GUIA_IMPLEMENTACION_WORDPRESS_THE7.md # Manual paso a paso para WordPress + The7 Classic + WPBakery
├── plantillas-wpbakery/                  # Shortcodes WPBakery listos para copiar (Portada, Solicitar NIT en 3 pasos y Niveles 1 a 4)
├── roadmaps/                             # Hojas de ruta, auditorías técnicas y backlog
├── arquitectura-informacion/             # Taxonomía, catálogo de 714 gestiones, mapas de navegación y dimensiones ATO
├── diseno-normativa/                     # Design System SAT, reglas UI/UX y manuales de marca
└── fuentes-datos/                        # Insumos históricos (congelados) y libros Excel maestros vivos (sincronizados)
```

---

## 📊 Matriz de Carpetas y Estado

| Carpeta / Documento | Descripción | Gobernanza | Índice / Acceso |
| :--- | :--- | :---: | :--- |
| [`GUIA_IMPLEMENTACION_WORDPRESS_THE7.md`](./GUIA_IMPLEMENTACION_WORDPRESS_THE7.md) | **Guía Operativa WordPress + WPBakery**: Estilos CSS oficiales, maquetación de Portada, página conectada `/solicitar-nit/` con iframes oficiales y árbol jerárquico Nivel 1 a Nivel 4. | Activo | [`GUIA_IMPLEMENTACION_WORDPRESS_THE7.md`](./GUIA_IMPLEMENTACION_WORDPRESS_THE7.md) |
| [`plantillas-wpbakery/`](./plantillas-wpbakery/_INDICE.md) | **Plantillas y Shortcodes WPBakery**: Archivos `.txt` con código `[vc_row]`, `[bsf-info-box]`, `[vc_tta_tabs]` y `[vc_raw_html]` sincronizados con las 714 gestiones. | Activo | [`plantillas-wpbakery/_INDICE.md`](./plantillas-wpbakery/_INDICE.md) |
| [`roadmaps/`](./roadmaps/README.md) | **Hojas de Ruta**: Auditoría UX/UI, Accesibilidad WCAG 2.2, Mobile First y Backlog. | Activo | [`roadmaps/README.md`](./roadmaps/README.md) |
| [`arquitectura-informacion/`](./arquitectura-informacion/README.md) | **Arquitectura de Información**: Estructura de 714 gestiones (Nivel 1 a Nivel 5), mapas estructurados y dimensiones ATO. | Activo | [`arquitectura-informacion/README.md`](./arquitectura-informacion/README.md) |
| [`diseno-normativa/`](./diseno-normativa/README.md) | **Diseño y Normativa**: Reglas UI/UX, Design System SAT, especificación responsive y manuales gráficos. | Activo | [`diseno-normativa/README.md`](./diseno-normativa/README.md) |
| [`fuentes-datos/`](./fuentes-datos/README.md) | **Fuentes de Datos**: Fuentes históricas (congeladas) vs. Entregables vivos (sincronizados con el JSON). | Activo | [`fuentes-datos/README.md`](./fuentes-datos/README.md) |

---

## 🏛️ Gobernanza Documental en Fuentes de Datos

El repositorio establece una frontera formal entre dos categorías de documentos:

1. **Fuentes Históricas / Clásicas (Inalterables por diseño):**
   - [`Detalle de Contenido para Grupos de Interes.xlsx`](./fuentes-datos/01_archivos_inicio_historicos/Detalle%20de%20Contenido%20para%20Grupos%20de%20Interes.xlsx): Relevamiento primario institucional.
   - [`Arbol_de_Navegacion_Portal_v5.xlsx`](./fuentes-datos/01_archivos_inicio_historicos/Arbol_de_Navegacion_Portal_v5.xlsx): Árbol de navegación original antes de la optimización canónica.
   - [`Ruta de procesos.xlsx`](./fuentes-datos/01_archivos_inicio_historicos/Ruta%20de%20procesos.xlsx): Matriz de procesos guiados base.
2. **Entregables Oficiales Vivos (Sincronizados con `src/data/allTramites.json`):**
   - [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](./fuentes-datos/02_archivos_producto_entregables/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx): Libro maestro de 714 gestiones con fórmulas de resumen, migas de pan y desglose por Nivel 1.
   - [`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](./fuentes-datos/02_archivos_producto_entregables/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx): Jerarquías y fichas en Lenguaje Ciudadano.
   - [`src/data/allTramites.json`](../src/data/allTramites.json): Base de datos única (Single Source of Truth) en producción.
   - [`docs/plantillas-wpbakery/`](./plantillas-wpbakery/_INDICE.md): Paquete completo de shortcodes WPBakery para WordPress + The7 Classic.
