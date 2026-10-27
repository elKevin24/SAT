# Guía Operativa de Implementación: Portal SAT en WordPress + The7 Classic + WPBakery (100% Cero `[vc_raw_html]`)

Esta guía describe el procedimiento paso a paso, **100% manual, sin línea de comandos (CLI) y estrictamente SIN usar `[vc_raw_html]` (Raw HTML)**, para construir, maquetar y publicar la Arquitectura de Información (Nivel 1 a Nivel 5) y los procesos conectados del **Portal SAT Guatemala** en **WordPress** utilizando el tema **The7 (estilo Classic)** y **WPBakery Page Builder**.

---

## 1. Prerrequisitos y Configuración Inicial de WordPress

### 1.1 Componentes y Bloques Nativos Permitidos (Sin Raw HTML)
Asegúrate de que los siguientes componentes estén activos en WordPress:
1. **The7 Theme** (Dream-Theme) con preset **Classic** (`[dt_breadcrumbs]`, `[dt_fancy_title]`).
2. **WPBakery Page Builder** (`[vc_section]`, `[vc_row]`, `[vc_column]`, `[vc_custom_heading]`, `[vc_column_text]`, `[vc_tta_tabs]`, `[vc_tta_section]`, `[vc_message]`, `[vc_empty_space]`, `[vc_separator]`).
3. **Ultimate Addons for WPBakery Page Builder** (`[bsf-info-box icon_type="none" read_more="box"]`, utilizado como tarjeta clickeable nativa de WPBakery sin íconos ni botones redundantes).

> **Restricción Institucional Estricta:** Ninguna de las **156 plantillas** en `docs/plantillas-wpbakery/` utiliza `[vc_raw_html]`. Todo el portal se construye exclusivamente con shortcodes nativos de WPBakery + The7 y una sola hoja de estilos CSS en las opciones del tema.

### 1.2 Estructura de Enlaces Permanentes (*Permalinks*)
Para que las URLs jerárquicas y limpias (como `/solicitar-nit/` o `/contribuyentes/contribuyente-general/`) funcionen sin colisiones:
1. Ve a **Ajustes > Enlaces permanentes**.
2. Selecciona la opción **Nombre de la entrada** (`/%postname%/`).
3. Guarda los cambios.

---

## 2. Paso 1: Integración del CSS Oficial del Design System SAT

Los shortcodes nativos de WPBakery (`[bsf-info-box]`, `[vc_tta_tabs]`, `.sat-modalidad-card`) reciben automáticamente el diseño normativo del SAT (`bg-white`, `border: 1px solid #DCDCDC`, `border-radius: 14px`, cero íconos y **hover sólido institucional** con texto blanco) pegando la hoja de estilos maestra [`docs/diseno-normativa/sat-design-system-wpbakery.css`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/diseno-normativa/sat-design-system-wpbakery.css).

1. En tu panel de WordPress, dirígete a:  
   **The7 > Theme Options > Advanced > Custom CSS**  
   *(Alternativa nativa: Apariencia > Personalizar > CSS adicional)*.
2. Copia íntegramente el contenido de [`docs/diseno-normativa/sat-design-system-wpbakery.css`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/diseno-normativa/sat-design-system-wpbakery.css) (o cópialo con 1 clic desde el **Modo WPBakery** integrado en la aplicación web) y pégalo en el editor:

```css
:root {
  --sat-azul-institucional: #003865;
  --sat-azul-oscuro: #19324b;
  --sat-celeste: #19afe1;
  --sat-color-contribuyentes: #14649b;
  --sat-color-comercio: #0284c7;
  --sat-color-profesionales: #4d8014;
  --sat-color-exentos: #c25e00;
  --sat-card-bg: #ffffff;
  --sat-card-border: #dcdcdc;
  --sat-text-title: #19324b;
  --sat-text-desc: #475569;
  --sat-radius: 14px;
  --sat-font-family: "Gotham", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Filas Flex de altura uniforme en WPBakery */
.vc_row.vc_row-flex > .vc_column_container { display: flex !important; }
.vc_row.vc_row-flex > .vc_column_container > .vc_column-inner { display: flex !important; flex-direction: column !important; flex-grow: 1 !important; width: 100% !important; }
.vc_row.vc_row-flex > .vc_column_container > .vc_column-inner > .wpb_wrapper { display: flex !important; flex-direction: column !important; flex: 1 1 auto !important; width: 100% !important; }
.vc_row.vc_row-flex .aio-icon-component, .vc_row.vc_row-flex .bsf-info-box-link { display: flex !important; flex-direction: column !important; flex: 1 1 auto !important; width: 100% !important; text-decoration: none !important; }

/* Tarjetas compactas oficiales ([bsf-info-box] & .sat-card) */
.sat-seccion-macro-segmentos .aio-icon-box, .sat-seccion-macro-segmentos .bsf-info-box,
.sat-seccion-contribuyentes .aio-icon-box, .sat-seccion-contribuyentes .bsf-info-box,
.sat-seccion-comercio-exterior .aio-icon-box, .sat-seccion-comercio-exterior .bsf-info-box,
.sat-seccion-profesionales .aio-icon-box, .sat-seccion-profesionales .bsf-info-box,
.sat-seccion-entes-exentos .aio-icon-box, .sat-seccion-entes-exentos .bsf-info-box {
  display: flex !important; flex-direction: column !important; justify-content: flex-start !important;
  width: 100% !important; height: 100% !important; min-height: 132px !important;
  background-color: var(--sat-card-bg) !important; border: 1px solid var(--sat-card-border) !important;
  border-radius: var(--sat-radius) !important; padding: 20px 22px !important; margin-bottom: 14px !important;
  transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease !important;
}

/* Hover institucional sólido por Nivel 1 con textos blancos */
.sat-seccion-macro-segmentos .vc_column_container:nth-child(1) .aio-icon-box:hover,
.sat-seccion-contribuyentes .aio-icon-box:hover, .sat-seccion-contribuyentes .bsf-info-box:hover {
  background-color: var(--sat-color-contribuyentes) !important; border-color: var(--sat-color-contribuyentes) !important;
  transform: translateY(-4px) !important; box-shadow: 0 14px 30px rgba(20, 100, 155, 0.18) !important;
}
.sat-seccion-macro-segmentos .vc_column_container:nth-child(2) .aio-icon-box:hover,
.sat-seccion-comercio-exterior .aio-icon-box:hover, .sat-seccion-comercio-exterior .bsf-info-box:hover {
  background-color: var(--sat-color-comercio) !important; border-color: var(--sat-color-comercio) !important;
  transform: translateY(-4px) !important; box-shadow: 0 14px 30px rgba(2, 132, 199, 0.18) !important;
}
.sat-seccion-macro-segmentos .vc_column_container:nth-child(3) .aio-icon-box:hover,
.sat-seccion-profesionales .aio-icon-box:hover, .sat-seccion-profesionales .bsf-info-box:hover {
  background-color: var(--sat-color-profesionales) !important; border-color: var(--sat-color-profesionales) !important;
  transform: translateY(-4px) !important; box-shadow: 0 14px 30px rgba(77, 128, 20, 0.18) !important;
}
.sat-seccion-macro-segmentos .vc_column_container:nth-child(4) .aio-icon-box:hover,
.sat-seccion-entes-exentos .aio-icon-box:hover, .sat-seccion-entes-exentos .bsf-info-box:hover {
  background-color: var(--sat-color-exentos) !important; border-color: var(--sat-color-exentos) !important;
  transform: translateY(-4px) !important; box-shadow: 0 14px 30px rgba(194, 94, 0, 0.18) !important;
}
.sat-seccion-macro-segmentos .aio-icon-box:hover *, .sat-seccion-macro-segmentos .bsf-info-box:hover *,
.sat-seccion-contribuyentes .aio-icon-box:hover *, .sat-seccion-contribuyentes .bsf-info-box:hover *,
.sat-seccion-comercio-exterior .aio-icon-box:hover *, .sat-seccion-comercio-exterior .bsf-info-box:hover *,
.sat-seccion-profesionales .aio-icon-box:hover *, .sat-seccion-profesionales .bsf-info-box:hover *,
.sat-seccion-entes-exentos .aio-icon-box:hover *, .sat-seccion-entes-exentos .bsf-info-box:hover * {
  color: #ffffff !important;
}
```

3. Haz clic en **Save Options** (o Publicar).

---

## 3. Paso 2: Creación de la Página Principal (Home / Portada)

El código íntegro de la portada se encuentra en **`docs/plantillas-wpbakery/HOME_portada-portal-sat.txt`**.

1. En WordPress, ve a **Páginas > Añadir nueva**.
2. Título de la página: `Inicio` (o `Portal SAT`).
3. En la barra superior del editor, activa **WPBakery Page Builder** y cambia a **Modo Clásico** -> pestaña **Texto** (donde se pegan los shortcodes `[vc_row]...`, **sin** usar el bloque `[vc_raw_html]`).
4. Copia y pega el contenido de `docs/plantillas-wpbakery/HOME_portada-portal-sat.txt`. Al volver a **Backend Editor**, WPBakery mostrará automáticamente todas las filas, columnas y cajas `[bsf-info-box]` listas para editar visualmente.
5. En la barra lateral derecha (**Atributos de página > Plantilla**), selecciona `Default Template` (ancho completo sin barra lateral).
6. Haz clic en **Publicar** y configúrala como página de inicio en **Ajustes > Lectura > Tu portada muestra: Una página estática (`Inicio`)**.

---

## 4. Paso 3: Creación de las Páginas Universales Conectadas en 3 Pasos (`/solicitar-nit/` y `/actualizar-rtu/`) — Sin `[vc_raw_html]`

Para evitar redirecciones dispersas o ventanas modales (prohibidas por Regla 13), y cumpliendo la restricción de **cero `[vc_raw_html]`**, las gestiones de más alta demanda del Registro Tributario Unificado (RTU Digital) se construyen con pestañas nativas `[vc_tta_tabs]`, avisos `[vc_message]`, bloques de texto `[vc_column_text]` y tarjetas de lanzamiento directo `[bsf-info-box]` hacia los aplicativos oficiales:

### 4.1 Página `/solicitar-nit/` (`docs/plantillas-wpbakery/procesos-conectados/G_solicitar-nit.txt`)
1. **Pestaña `1. Requisitos` (`[vc_tta_section]`):**
   - Aviso prioritario `[vc_message]` sobre **DPI físico y vigente** (aclarando que no se acepta constancia emitida por el RENAP).
   - 4 tarjetas `.sat-modalidad-card` dentro de `[vc_column_text]` (*Uso Personal o Laboral*, *Negocio o Profesión*, *Personas con Discapacidad*, *Guatemalteco en el Extranjero*).
   - 2 avisos `[vc_message]` con la regla oficial sobre cuándo NO adjuntar factura de servicios (*"Dirección según DPI"*).
2. **Pestaña `2. Solicitar Gestión` (`[vc_tta_section]`):**
   - Guía numerada en `[vc_column_text]` (`.sat-app-launch-card`) + tarjeta `[bsf-info-box]` de acción directa hacia `https://app.c.sat.gob.gt/rtu/formulario-inscripcion`.
3. **Pestaña `3. Solicitar Cita` (`[vc_tta_section]`):**
   - 2 tarjetas `[bsf-info-box]` nativas: programación de cita en `https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal` y descarga del Manual Oficial en PDF.

### 4.2 Página `/actualizar-rtu/` (`docs/plantillas-wpbakery/procesos-conectados/G_actualizar-rtu.txt`)
1. **Pestaña `1. Requisitos según tu caso`:** Plazo legal de 30 días hábiles (Art. 94 Código Tributario) en `[vc_message]`, 4 escenarios ciudadanos y reglas sobre Factura de Servicios (solo serie y número).
2. **Pestaña `2. Realizar Actualización`:** Pasos dentro de Agencia Virtual SAT + tarjeta `[bsf-info-box]` de ingreso a `https://farm3.sat.gob.gt/menu/login.jsf` + 2 tarjetas `[bsf-info-box]` para los manuales PDF oficiales.
3. **Pestaña `3. Estado, Constancia y Cita`:** 3 tarjetas `[bsf-info-box]` en 3 columnas hacia:
   - `https://cdn.c.sat.gob.gt/rtu/consulta-gestion` (*3.1 Consultar Estado de Gestión*)
   - `https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal` (*3.2 Imprimir Constancia de RTU*)
   - `https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal` (*3.3 Solicitar Cita Presencial*)

---

## 5. Paso 4: Creación de Páginas Jerárquicas del Catálogo (Nivel 1 a Nivel 4)

Las **156 plantillas WPBakery** del catálogo (**714 gestiones canónicas**) están generadas en **`docs/plantillas-wpbakery/`** (consulta el inventario completo en **`docs/plantillas-wpbakery/_INDICE.md`** o cópialas desde la vista **`#/wpbakery`** del prototipo web).

| Nivel 1 (Página Padre) | Nivel 2 (Página Hija) | Comportamiento Arquitectónico | Slug Sugerido | Archivo Shortcode en `docs/plantillas-wpbakery/` |
| :--- | :--- | :--- | :--- | :--- |
| **Contribuyentes** | *(Hub Nivel 1)* | Muestra 4 tarjetas de Nivel 2 | `/contribuyentes/` | `contribuyentes/N1_contribuyentes.txt` |
| Contribuyentes | Sin Obligaciones | **Lista directa (10 gestiones)** | `/contribuyentes/sin-obligaciones/` | `contribuyentes/N2_sin-obligaciones.txt` |
| Contribuyentes | Pequeños Contribuyentes | Muestra 2 tarjetas de Nivel 3 | `/contribuyentes/pequenos-contribuyentes/` | `contribuyentes/N2_pequenos-contribuyentes.txt` |
| Contribuyentes | Contribuyente General | Muestra 8 tarjetas de Nivel 3 | `/contribuyentes/contribuyente-general/` | `contribuyentes/N2_contribuyente-general.txt` |
| Contribuyentes | Contribuyentes Especiales | Muestra 3 tarjetas de Nivel 3 | `/contribuyentes/contribuyentes-especiales/` | `contribuyentes/N2_contribuyentes-especiales.txt` |
| **Operadores de Comercio Exterior** | *(Hub Nivel 1)* | Muestra 6 tarjetas de Nivel 2 | `/operadores-de-comercio-exterior/` | `operadores-de-comercio-exterior/N1_operadores-de-comercio-exterior.txt` |
| Operadores de Comercio Exterior | Importadores | Muestra 5 tarjetas de Nivel 3 | `/operadores-de-comercio-exterior/importadores/` | `operadores-de-comercio-exterior/N2_importadores.txt` |
| Operadores de Comercio Exterior | Exportadores | Muestra 3 tarjetas de Nivel 3 | `/operadores-de-comercio-exterior/exportadores/` | `operadores-de-comercio-exterior/N2_exportadores.txt` |
| Operadores de Comercio Exterior | Operador Económico Autorizado (OEA) | **Lista directa (2 gestiones)** | `/operadores-de-comercio-exterior/operador-economico-autorizado-oea/` | `operadores-de-comercio-exterior/N2_operador-economico-autorizado-oea.txt` |
| Operadores de Comercio Exterior | Auxiliares de la Función Pública Aduanera (AFPA) | Muestra 5 tarjetas de Nivel 3 | `/operadores-de-comercio-exterior/auxiliares-de-la-funcion-publica-aduanera-afpa/` | `operadores-de-comercio-exterior/N2_auxiliares-de-la-funcion-publica-aduanera-afpa.txt` |
| Operadores de Comercio Exterior | Regímenes Territoriales y Zonas Especiales | Muestra 2 tarjetas de Nivel 3 | `/operadores-de-comercio-exterior/regimenes-territoriales-y-zonas-especiales/` | `operadores-de-comercio-exterior/N2_regimenes-territoriales-y-zonas-especiales.txt` |
| Operadores de Comercio Exterior | Normativa y Operaciones Aduaneras Generales | Muestra 5 tarjetas de Nivel 3 | `/operadores-de-comercio-exterior/normativa-y-operaciones-aduaneras-generales/` | `operadores-de-comercio-exterior/N2_normativa-y-operaciones-aduaneras-generales.txt` |
| **Profesionales** | *(Hub Nivel 1)* | Muestra 5 tarjetas de Nivel 2 | `/profesionales/` | `profesionales/N1_profesionales.txt` |
| Profesionales | Abogados y Notarios | Muestra 4 tarjetas de Nivel 3 | `/profesionales/abogados-y-notarios/` | `profesionales/N2_abogados-y-notarios.txt` |
| Profesionales | Peritos Contadores | Muestra 2 tarjetas de Nivel 3 | `/profesionales/peritos-contadores/` | `profesionales/N2_peritos-contadores.txt` |
| Profesionales | Auditores | **Lista directa (4 gestiones — Compactación Hallazgo A)** | `/profesionales/auditores/` | `profesionales/N2_auditores.txt` |
| Profesionales | Gestores Tributarios | Muestra 2 tarjetas de Nivel 3 | `/profesionales/gestores-tributarios/` | `profesionales/N2_gestores-tributarios.txt` |
| Profesionales | Servicios Profesionales | **Lista directa (6 gestiones — Compactación Hallazgo A)** | `/profesionales/servicios-profesionales/` | `profesionales/N2_servicios-profesionales.txt` |
| **Entes Exentos** | *(Hub Nivel 1)* | Muestra 5 tarjetas de Nivel 2 | `/entes-exentos/` | `entes-exentos/N1_entes-exentos.txt` |
| Entes Exentos | Entidades del Estado | Muestra 4 tarjetas de Nivel 3 | `/entes-exentos/entidades-del-estado/` | `entes-exentos/N2_entidades-del-estado.txt` |
| Entes Exentos | Constitucionales | Muestra 3 tarjetas de Nivel 3 | `/entes-exentos/constitucionales/` | `entes-exentos/N2_constitucionales.txt` |
| Entes Exentos | No Lucrativos | Muestra 2 tarjetas de Nivel 3 | `/entes-exentos/no-lucrativos/` | `entes-exentos/N2_no-lucrativos.txt` |
| Entes Exentos | Municipalidades | **Lista directa (5 gestiones)** | `/entes-exentos/municipalidades/` | `entes-exentos/N2_municipalidades.txt` |
| Entes Exentos | Decreto | Muestra 3 tarjetas de Nivel 3 | `/entes-exentos/decreto/` | `entes-exentos/N2_decreto.txt` |

---

## 6. Regeneración Automática de Plantillas

Cada vez que se actualice `src/data/allTramites.json`, ejecuta:
```bash
python scripts/generar_wpbakery_shortcodes.py
```
Esto regenera las **156 plantillas libres de `[vc_raw_html]`** en `docs/plantillas-wpbakery/` y su índice `_INDICE.md`.
