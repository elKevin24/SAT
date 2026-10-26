# Guía de Migración: SAT Design System a WordPress (WPBakery Page Builder)

Este documento detalla la implementación y réplica exacta de las reglas del **Design System SAT (Manual de Imagen y Normas Gráficas V.5)** en **WordPress con WPBakery Page Builder (Visual Composer)**.

---

## 1. Principios Inmutables del Design System en WordPress

| Regla del Design System | En React | En WPBakery / WordPress |
| :--- | :--- | :--- |
| **Bordes en Cards** | `border-0` | **`border: 0 !important;`** (Cero bordes perimetrales o líneas laterales). |
| **Superficie Base** | `bg-sat-fondo-tenue` | `background-color: #F4F6F9;` |
| **Hover Sólido** | `hover:bg-sat-azul`, etc. | `background-color: var(--sat-azul) !important;` con texto e icono a blanco. |
| **Íconos decorativos** | Prohibidos | Cero íconos visuales; solo chevron funcional `#94A3B8`. |
| **Badges de conteo** | Prohibidos | Sin etiquetas como *"4 Trámites"* ni números de pasos en tarjetas de navegación. |
| **Tipografía** | Gotham / Montserrat | `font-family: "Gotham", "Montserrat", sans-serif;` |

---

## 2. Métodos de Implementación Oficiales en WPBakery

> **IMPORTANTE — REGLA DE ARQUITECTURA:** El uso de bloques **"Raw HTML" o inyección manual de etiquetas HTML está estrictamente PROHIBIDO**. Las tarjetas deben gestionarse exclusivamente mediante componentes nativos del builder o shortcodes limpios para garantizar la integridad visual, accesibilidad y facilidad de edición para los redactores.

---

### Método 1: Componente Visual Nativo en la Paleta de WPBakery (`vc_map`) — (MÉTODO RECOMENDADO)

Este método integra la tarjeta oficial del SAT directamente en el catálogo de componentes de WPBakery:

1. **Instalación:**
   Copia el archivo `docs/diseno-normativa/sat-wpbakery-shortcodes.php` dentro del directorio de tu tema hijo (`functions.php`) o en `wp-content/plugins/sat-design-system/`.
2. **Carga de Estilos:**
   El plugin encola automáticamente `sat-design-system-wpbakery.css` en WordPress.
3. **Uso en el Editor Visual de WPBakery:**
   * Haz clic en el botón **"+" (Agregar Elemento)** de WPBakery.
   * Ve a la categoría **"SAT Guatemala"**.
   * Selecciona el componente **"Card SAT (Design System)"**.
   * Completa los campos en el formulario nativo (sin tocar una sola línea de código):
     * **Título de la Gestión:** (Texto plano en lenguaje ciudadano).
     * **Descripción Ciudadana:** (Orientada a beneficios y requisitos).
     * **Tono de Segmento:** Selector desplegable (Azul Institucional, Celeste Personas, Verde Empresas, Naranja Aduanas, Morado Auxiliares).
     * **URL de Destino:** Enlace canónico al servicio o aplicativo.
     * **Abrir en:** Misma pestaña (`_self`) o nueva pestaña (`_blank`).

---

### Método 2: Shortcode Limpio en Bloque de Texto Estándar

Para redactores que prefieren escribir contenido dentro de un elemento estándar de WPBakery (**Text Block** normal, **sin HTML**):

```text
[sat_card title="Solicitar NIT" desc="Obtén tu Número de Identificación Tributaria por primera vez en línea para emitir facturas o empleo." tone="azul" url="https://portal.sat.gob.gt/portal/rtu-digital/"]
```

```text
[sat_card title="Operaciones Aduaneras" desc="Gestión de DUCA y tránsitos aduaneros." tone="naranja" url="https://portal.sat.gob.gt/portal/aduanas/"]
```

#### Variantes de Tono disponibles:
* `tone="azul"`: Contribuyentes general (`#14649B`)
* `tone="celeste"`: Personas individuales (`#0284C7`)
* `tone="verde"`: Empresas y personas jurídicas (`#4D8014`)
* `tone="naranja"`: Operadores de Comercio Exterior y Aduanas (`#C25E00`)
* `tone="morado"`: Auxiliares de la función pública y Entes Exentos (`#6366F1`)

---

### Método 3: Elemento Nativo "Post Grid" de WPBakery con CSS Puente

Para catálogos automáticos conectados al Custom Post Type (`sat_tramite`):
1. Inserta el elemento nativo **Post Grid** de WPBakery.
2. Vincula la consulta al CPT de gestiones y filtra por la taxonomía del segmento.
3. El archivo `docs/diseno-normativa/sat-design-system-wpbakery.css` mapea automáticamente los estilos a los contenedores nativos de WPBakery, eliminando bordes y aplicando la tipografía Gotham/Montserrat y el hover sólido institucional.

---

## 3. Disposición de Columnas en WPBakery (Grid Miller $7 \pm 2$)

Para cumplir con la regla de capacidad y densidad visual:
* **Móvil:** 1 columna (`[vc_column width="1/1"]`)
* **Tablet:** 2 columnas (`[vc_column width="1/2"]`)
* **Desktop:** 3 o 4 columnas (`[vc_column width="1/3"]` o `[vc_column width="1/4"]`)
* **Espaciado:** En las opciones de fila de WPBakery (`vc_row`), establecer un gap compacto (15px a 20px).

---

## 4. Colección de Plantillas Pre-generadas por Página

Para acelerar la publicación en WordPress, el repositorio cuenta con la biblioteca completa de **113 plantillas pre-generadas** en shortcodes nativos de WPBakery listo para copiar y pegar:

* **Directorio principal:** `docs/plantillas-wpbakery/`
* **Catálogo e Índice Maestro:** `docs/plantillas-wpbakery/_INDICE.md`

Cada archivo `.txt` de la colección contiene el código listo para copiar y pegar en la pestaña de texto/clásico de WPBakery para cada página de la arquitectura del portal.
