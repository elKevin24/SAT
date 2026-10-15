# Plan de Acción — Migración del Portal SAT a WordPress

**Estado:** borrador para ejecución por fases
**Alcance:** portal completo (home + catálogo filtrable + ficha de trámite + procesos guiados + buscador)
**Decisión de diseño clave:** usar el **elemento de tarjeta nativo de WordPress** y **vestirlo con el Design System SAT** — *no* inyectar HTML propio por shortcode.

---

## 1. Principio rector de las tarjetas

> WordPress ya trae su propio elemento de tarjeta. Nuestro trabajo **no** es copiar/pegar el HTML de la tarjeta React, sino **aplicar nuestro diseño a ese elemento nativo**.

Consecuencia técnica: el diseño se entrega como **una capa de estilos + una plantilla que extiende el markup nativo**, no como HTML suelto.

| Enfoque descartado | Enfoque adoptado |
| :--- | :--- |
| `[sat_card]` que imprime `<a class="sat-card">…` completo | Elemento nativo de WP/WPBakery renderizando la tarjeta, con **CSS puente** que mapea sus clases a nuestros tokens |
| Copiar/pegar bloques de HTML por página | Fuente única de datos (CPT) + plantilla de tarjeta + estilos |
| Duplicar el contenido en cada página | El elemento consulta el contenido dinámicamente |

---

## 2. Inventario actual (línea base verificada)

### 2.1 Contenido y datos
| Dataset | Registros | Uso |
| :--- | ---: | :--- |
| `src/data/allTramites.json` | **715** | Trámites (todos con `codigo` `SAT-GES-####` y `url` http válida) |
| `src/data/allProcesos.json` | **49** | Procesos guiados con pasos |
| `src/data/catalogoContenidosUnicos.json` | **683** | Contenidos únicos desacoplados (17 transversales) |

Ejes de navegación: **4 segmentos**, **27 categorías**, **99 subcategorías**, **5 etapas ATO**, **4 tipos de interacción**, **10 familias temáticas** (`FAM-01`…`FAM-10`), 6 canales de atención, 6 plataformas/sistemas.

### 2.2 Activos WordPress ya existentes
- `docs/diseno-normativa/GUIA_MIGRACION_WORDPRESS_WPBAKERY.md` — 3 métodos de implementación.
- `docs/diseno-normativa/sat-wpbakery-shortcodes.php` — plugin con shortcode + `vc_map`.
- `docs/diseno-normativa/sat-design-system-wpbakery.css` — CSS del design system (`.sat-card`, `.sat-cards-grid`, tonos).
- `html-template/` — `index.html` + 4 páginas de pilar (markup estático).

### 2.3 Defecto detectado (corregir antes de migrar)
El CSS define **`.sat-card-head`** (`sat-design-system-wpbakery.css:154`, `sat-portal.css:266`) y las plantillas HTML lo usan, pero el **shortcode** (`sat-wpbakery-shortcodes.php:57`) y la **guía** (`:33`) emiten **`.sat-card-header`**. Resultado: la cabecera de la tarjeta pierde el `flex` (el chevron no se alinea a la derecha).

**Acción:** unificar a un único nombre (`.sat-card-head`) en CSS, shortcode y guía.

---

## 3. Arquitectura objetivo

```
WordPress
├── Tema hijo SAT  (presenta)
│   ├── Encola tokens.css (design system) + sat-bridge.css (puente)
│   ├── Plantilla de tarjeta (extiende el elemento nativo)
│   └── Plantillas: front-page, archive-sat_tramite, single-sat_tramite
│
├── Contenido (datos)
│   ├── CPT sat_tramite   (715)
│   ├── CPT sat_proceso   (49)
│   └── Taxonomías + campos ACF
│
├── Motor de tarjetas  (el elemento nativo)
│   ├── Ruta A: WPBakery "Post Grid" + override de su Grid Item + bridge CSS
│   └── Ruta B: bloque nativo "Query Loop" + patrón de tarjeta + bridge CSS
│
└── Plugins: ACF Pro · WPBakery · facetas (FacetWP/Search&Filter) · Relevanssi · UserWay · SEO
```

Fuente única de verdad:
- **Diseño:** `src/design-system/tokens.css` → genera `sat-design-system-wpbakery.css`.
- **Contenido:** el dataset canónico (`allTramites.json` / `sat_portal_nosql.json`) → migra a WordPress; WordPress pasa a ser el origen tras el corte.

---

## 4. Modelo de contenido (dataset → WordPress)

### 4.1 CPT `sat_tramite`
| Campo origen | Destino WP |
| :--- | :--- |
| `tramite` | `post_title` |
| `descripcion` | `post_content` / excerpt |
| `codigo` (`SAT-GES-####`) | meta `sat_codigo` (**único**, canónico) |
| `id` | meta `sat_id` + slug |
| `url` | meta `sat_url` |
| `pillar` / `pillarName` | taxonomía `sat_segmento` (4) |
| `categoria` | taxonomía `sat_categoria` (27) |
| `subcategoria` | taxonomía `sat_subcategoria` (99) |
| `etapaAto` / `etapaAtoLabel` | taxonomía `sat_etapa_ato` (5) |
| `tipoInteraccion` / `tipoInteraccionLabel` | taxonomía `sat_tipo_interaccion` (4) |
| `familias_ids` / `familiaTematica` | taxonomía `sat_familia` (10) |
| `canalAtencion`, `plataformaSistema` | taxonomías/meta |
| `orden_n1..n5`, `orden_contenido` | meta de orden (resolver `menu_order` para el orden canónico ATO) |
| `requisitos[]`, `pasos[]`, `baseLegal`, `formulario`, `perfilDestinatario`, `migaBreadcrumb` | meta / repetidor ACF |

### 4.2 CPT `sat_proceso`
`no` → meta, `nombre` → título, `pasos[]` → repetidor (numero, accion, pagina, ubicacion, url), `paraQuien`, `etapa`, `categorias`.

### 4.3 Migración
Script Python (`scripts/`) que transforma los JSON a un **WXR** (import nativo) o ejecuta **WP-CLI** (`wp post create`, `wp term create`, `wp post meta`). Idempotente por `sat_codigo`.

**Criterio de aceptación:** 715 trámites, 49 procesos, `sat_codigo` únicos, 100% de `url` con esquema http(s), conteos por segmento/categoría/subcategoría iguales al dataset.

---

## 5. Estrategia de la tarjeta (núcleo del pedido)

### 5.1 Contrato de clases (a completar en Fase 0)
Primero se identifica el **elemento nativo concreto** (WPBakery *Post Grid* vs bloque *Query Loop* del tema) y se documenta su markup:

| Elemento nativo (a relevar) | Clase/token SAT que lo viste |
| :--- | :--- |
| Contenedor de la tarjeta | `border:0`, `border-radius:12px`, `background:#F4F6F9` |
| Título | tipografía Gotham/Montserrat, `#19324B`, hover `#fff` |
| Descripción | `13px`, `#475569`, hover `#fff` |
| Enlace/ícono | chevron `#94A3B8`, hover `#fff` |
| Estado hover | fondo sólido por segmento (`--sat-seg-*`) + sombra |
| Estado foco | anillo `#14649B`, `:focus-visible` |

### 5.2 Implementación
1. **Bridge CSS** (`sat-bridge.css`): mapea las clases del elemento nativo a los tokens SAT (sin HTML nuevo).
2. **Override de plantilla del ítem** (WPBakery *Grid Item* `vc_gitem`, o `template-parts/card.php` para el bloque): inserta el chevron y las clases que el diseño requiere.
3. **Tonos por segmento**: el tono se deriva del término `sat_segmento` del trámite (clase `sat-card--{segmento}`), no se elige a mano por tarjeta.

### 5.3 Criterios de aceptación
- Paridad visual 1:1 con `ui/Card.tsx` (fondo, radio, hover sólido, chevron, tipografía).
- Sin bordes perimetrales; sin badges de conteo; sin íconos decorativos (reglas inmutables del manual).
- `axe` **0 violaciones**; contraste AA.
- Alturas iguales en la cuadrícula (grid con `align-items:stretch`).

---

## 6. Home page (recomposición por secciones)

| # | Sección (origen React) | Implementación WP |
| :-- | :--- | :--- |
| 1 | Hero/encabezado | fila WPBakery + header del tema |
| 2 | 4 segmentos (`UserSegmentCards`) | Grid de tarjetas de términos `sat_segmento` |
| 3 | Banner rotativo (`RotaryBanner`) | carrusel nativo/plugin |
| 4 | Accesos rápidos 7+2 (`QuickAccessCarousel`) | grid de enlaces |
| 5 | Temas populares (`PopularTopicsTabs`) | tabs/pestañas |
| 6 | Procesos guiados (`GuidedProcessesSection`) | grid CPT `sat_proceso` |
| 7 | Noticias y transparencia | CPT/posts + grid nativo |
| 8 | Footer institucional | footer del tema |

---

## 7. Catálogo, filtros y buscador

- Página de catálogo con **Query Loop** + facetas por `sat_segmento`, `sat_categoria`, `sat_subcategoria`, `sat_etapa_ato`, `sat_tipo_interaccion`, `sat_familia`.
- Opciones: **FacetWP** o **Search & Filter**; alternativa propia con `WP_Query` + AJAX.
- Buscador: **Relevanssi** (715 ítems) con sugerencias.
- Orden canónico: por `orden_n1..n5` y `orden_contenido` (comparador ya definido en `src/data/categoryOrder.ts`).
- Rendimiento: caché de facetas y paginación; objetivo < 300 ms por consulta.

---

## 8. Ficha de trámite, procesos y modales

- `single-sat_tramite.php`: título, descripción, requisitos, pasos, base legal, URL de acción, miga de pan, metadatos (etapa ATO, tipo de interacción, canal, plataforma, familia).
- Proceso guiado: plantilla con pasos numerados y enlaces.
- Detalle en modal (paridad con `TramiteDetailModal`) o página propia (SEO). Recomendado: página propia + enlace canónico.

---

## 9. Accesibilidad, SEO y redirecciones

- **Accesibilidad:** conservar 0 violaciones `axe`; mantener el `aria-live`, foco visible, contraste AA; integrar widget **UserWay**. Reutilizar `tests/a11y.spec.ts` apuntando a la URL de WordPress.
- **URLs:** las rutas hash (`#/`, `#/catalogo?segmento=…`, `#/solicitar-nit`) pasan a **permalinks**; definir **301** y canónicas. Sitemap XML por CPT/taxonomía.
- **SEO:** títulos/meta desde los campos; datos estructurados para trámites.

---

## 10. Fases, entregables y Definition of Done

| Fase | Duración est. | Entregable | DoD |
| :--- | :--- | :--- | :--- |
| **0. Decisiones y entorno** | 1–2 d | Builder confirmado (WPBakery vs bloques), tema hijo, plugins; tokens congelados | Elemento nativo de tarjeta identificado y su markup documentado |
| **1. Modelo de contenido** | 3–5 d | CPT + taxonomías + ACF + script de migración | 715/49/683 cargados; códigos únicos; conteos OK |
| **2. Tema hijo + design system** | 2–3 d | Child theme; `tokens.css` + `sat-bridge.css`; bug `.sat-card-head` corregido | Tipografía/colores/radios institucionales aplicados |
| **3. Elemento de tarjeta** | 3–5 d | Bridge CSS + override de plantilla del ítem | Paridad visual 1:1; axe 0 |
| **4. Home page** | 3–4 d | 8 secciones compuestas | Paridad de home; responsive 1/2/4 columnas |
| **5. Catálogo + filtros + buscador** | 5–8 d | Archive + facetas + Relevanssi | Filtros combinables; orden canónico; <300 ms |
| **6. Ficha + procesos + modales** | 4–5 d | Single + plantilla de proceso | Navegación completa desde tarjeta → ficha |
| **7. Accesibilidad + SEO + 301** | 2–3 d | Informe axe, sitemap, mapa de redirecciones | axe 0; sin enlaces rotos |
| **8. QA y lanzamiento** | 3–4 d | Regresión visual + plan de rollback | Paridad aceptada; go-live |

**Total estimado:** 26–39 días de trabajo efectivo.

---

## 11. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
| :--- | :--- | :--- |
| El markup del elemento nativo cambia entre versiones de WPBakery | El diseño se rompe | Bridge CSS + override de plantilla versionados en el tema hijo; fijar versión del builder |
| Dependencia de ACF Pro / plugins de facetas | Coste/licencias | Evaluar alternativas (meta nativa, `WP_Query`) en Fase 0 |
| Doble mantenimiento (React y WordPress) | Deriva de contenido | WordPress como fuente única tras el corte; retirar/archivar la SPA o alimentarla por REST |
| 715 trámites + facetas | Rendimiento | Índices, caché, paginación |
| Migración de rutas hash a permalinks | Pérdida de enlaces/SEO | Mapa de 301 completo y verificado |

---

## 12. Siguiente paso inmediato

**Fase 0:** confirmar builder y tema, e **identificar el elemento de tarjeta nativo** (WPBakery *Post Grid* vs bloque *Query Loop*), documentando su contrato de clases. Con eso se escribe el `sat-bridge.css` y la plantilla del ítem, sin tocar el HTML propio.
