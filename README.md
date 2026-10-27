# Portal Web SAT Guatemala — Gestiones y Servicios en Línea (React + WordPress WPBakery)

Prototipo interactivo, arquitectura de información canónica (**714 proyecciones / 683 gestiones únicas `SAT-GES-####`** en **Nivel 1 a Nivel 5**) y paquete completo de maquetación **100% libre de `[vc_raw_html]`** para **WordPress + The7 Classic + WPBakery Page Builder**.

---

## 🛠️ Centro de Trabajo Rápido para WordPress + WPBakery (Sin `[vc_raw_html]`)

Si vas a maquetar o cargar las **160 páginas jerárquicas** en WordPress (con `[dt_breadcrumbs]` automático y todos los enlaces `link="url:..."` pre-conectados):

1. **Planificador Offline de 1 Clic (No requiere Node.js ni internet):**
   - Abre con doble clic en tu navegador: **[`docs/plantillas-wpbakery/PLANIFICADOR_OFFLINE_WPBAKERY.html`](./docs/plantillas-wpbakery/PLANIFICADOR_OFFLINE_WPBAKERY.html)**
   - Incluye las **160 páginas** organizadas de **Ola 0 a Ola 4**, buscador, casillas de progreso guardadas en el navegador, selector de modo de tarjeta (`[bsf-info-box]` o fallback nativo `[vc_column_text]`), prefijo de subcarpeta opcional y copiado en 1 clic de **Título**, **Página Superior**, **Slug**, **Shortcode WPBakery** y **CSS Global**.
2. **Plan Maestro Secuencial por Olas (Markdown):**
   - **[`docs/PLAN_CREACION_PAGINAS_WORDPRESS.md`](./docs/PLAN_CREACION_PAGINAS_WORDPRESS.md)**
3. **Guía Paso a Paso (The7 Classic + Permalinks + CSS + Menús):**
   - **[`docs/GUIA_IMPLEMENTACION_WORDPRESS_THE7.md`](./docs/GUIA_IMPLEMENTACION_WORDPRESS_THE7.md)**
4. **Hoja de Estilos Oficial para The7 (`Custom CSS`):**
   - **[`docs/diseno-normativa/sat-design-system-wpbakery.css`](./docs/diseno-normativa/sat-design-system-wpbakery.css)**
5. **Paquetes de Importación Nativa WordPress WXR (`.xml` opcionales para `Herramientas › Importar › WordPress`):**
   - **[`docs/plantillas-wpbakery/wordpress-import-olas-0-1-2.xml`](./docs/plantillas-wpbakery/wordpress-import-olas-0-1-2.xml)** *(31 páginas troncales: Portada + 6 procesos conectados + Nivel 1 + Nivel 2)*
   - **[`docs/plantillas-wpbakery/wordpress-import-completo-160.xml`](./docs/plantillas-wpbakery/wordpress-import-completo-160.xml)** *(Catálogo completo de 160 páginas con jerarquía `post_parent` y `slug`)*
6. **Carpeta de las 160 Plantillas Individuales (`.txt`):**
   - **[`docs/plantillas-wpbakery/_INDICE.md`](./docs/plantillas-wpbakery/_INDICE.md)**

---

## 📚 Documentación General del Proyecto

Toda la documentación, hojas de ruta y especificaciones se encuentran organizadas en **[`docs/`](./docs/README.md)**:

- 🏛️ **[Arquitectura de Información](./docs/arquitectura-informacion/README.md)**: Estructura jerárquica de **714 proyecciones / 683 gestiones únicas** (`Nivel 1` a `Nivel 5`), ciclo de vida ATO y polijerarquía sin duplicación.
- 🎨 **[Diseño y Normativas](./docs/diseno-normativa/README.md)**: Design System SAT (`DESIGN_RULES.md`), tarjetas compactas sin elementos parásitos, hover institucional por Nivel 1 y accesibilidad WCAG 2.2 AA.
- 📁 **[Fuentes de Datos Excel](./docs/fuentes-datos/README.md)**: Fuentes históricas inalterables (`01_archivos_inicio_historicos/`) y libros Excel maestros vivos de 25 columnas (`02_archivos_producto_entregables/`).
- 📊 **[Hojas de Ruta y Checklists](./docs/roadmaps/README.md)**: Estado completado al 100% de Arquitectura de Información, UX/UI, Accesibilidad WCAG 2.2 AA y Mobile-First.
- 🗄️ **[Bases de Datos SQL y NoSQL](./database/README.md)**: Modelo relacional (`database/sql/`) y documental MongoDB (`database/nosql_mongodb/`).

---

## 🚀 Comandos Rápidos (Prototipo Web y Generadores)

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (Prototipo en http://localhost:3000/ y Planificador en http://localhost:3000/#/wpbakery)
npm run dev

# Ejecutar validaciones de plantillas WPBakery, linter, tests unitarios y compilación
python scripts/test_wpbakery_templates.py
npm run lint
npm run test:unit
npm run build
```

---

*Portal SAT Guatemala — 2026*
