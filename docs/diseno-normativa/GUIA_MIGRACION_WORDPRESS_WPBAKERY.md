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

## 2. Los 3 Métodos de Implementación en WordPress

### Método 1: Inserción Directa de CSS + Elemento "Bloque de Texto" / "HTML Puro" (El más rápido sin programar PHP)

1. En el administrador de WordPress, ve a **Apariencia $\rightarrow$ Personalizar $\rightarrow$ CSS Adicional** (o en **WPBakery Page Builder $\rightarrow$ General Settings $\rightarrow$ Custom CSS**).
2. Pega el contenido completo del archivo:
   `docs/diseno-normativa/sat-design-system-wpbakery.css`
3. En cualquier página con WPBakery:
   * Inserta un elemento **Raw HTML** o **Text Block** (en modo código fuente).
   * Pega la estructura de la tarjeta:

```html
<a href="https://portal.sat.gob.gt/portal/rtu-digital/" class="sat-card sat-card--azul">
  <div class="sat-card-header">
    <h3 class="sat-card-title">Inscripción y Solicitud de NIT</h3>
    <span class="sat-card-chevron" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
    </span>
  </div>
  <p class="sat-card-desc">
    Obtén tu Número de Identificación Tributaria por primera vez en línea para emitir facturas o empleo.
  </p>
</a>
```

#### Variantes de Tono disponibles:
* `sat-card--azul`: Contribuyentes general (#14649B)
* `sat-card--celeste`: Personas individuales (#0284C7)
* `sat-card--verde`: Empresas y personas jurídicas (#4D8014)
* `sat-card--naranja`: Operadores de Comercio Exterior y Aduanas (#C25E00)
* `sat-card--morado`: Auxiliares de la función pública y Entes Exentos (#6366F1)

---

### Método 2: Shortcode Nativo (Fácil para editores de contenido)

Agrega el archivo `docs/diseno-normativa/sat-wpbakery-shortcodes.php` a tu tema hijo (`functions.php` del tema activo) o como un mini-plugin en `wp-content/plugins/sat-design-system/`.

Una vez activo, los redactores pueden usar shortcodes directamente en WPBakery:

```text
[sat_card title="Solicitar NIT" desc="Obtén tu Número de Identificación Tributaria para empleo o negocio." tone="azul" url="https://portal.sat.gob.gt/"]

[sat_card title="Operaciones Aduaneras" desc="Gestión de DUCA y tránsitos aduaneros." tone="naranja" url="https://portal.sat.gob.gt/portal/aduanas/"]
```

---

### Método 3: Elemento Visual Integrado en la Paleta de WPBakery (`vc_map`)

El archivo `sat-wpbakery-shortcodes.php` ya contiene la función `vc_map()`:
* Al presionar el botón **"+" (Agregar Elemento)** en WPBakery, verás la categoría **"SAT Guatemala"** con el componente **"Card SAT (Design System)"**.
* Cuenta con formulario visual para:
  * Título del trámite (texto plano)
  * Descripción orientada a beneficios ciudadanos
  * Selector desplegable de Tono oficial (Azul, Celeste, Verde, Naranja, Morado)
  * URL y destino (`_self` o `_blank`)

---

## 3. Disposición de Columnas en WPBakery (Grid Miller $7 \pm 2$)

Para cumplir con la regla de capacidad y densidad visual:
* **Móvil:** 1 columna (`[vc_column width="1/1"]`)
* **Tablet:** 2 columnas (`[vc_column width="1/2"]`)
* **Desktop:** 3 o 4 columnas (`[vc_column width="1/3"]` o `[vc_column width="1/4"]`)
* **Espaciado:** En las opciones de fila de WPBakery (`vc_row`), establecer un gap compacto (15px a 20px).
