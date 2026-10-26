# Guía Operativa de Implementación: Portal SAT en WordPress + The7 Classic + WPBakery

Esta guía describe el procedimiento paso a paso, **100% manual y sin requerir línea de comandos (CLI)**, para construir, maquetar y publicar la Arquitectura de Información (Nivel 1 a Nivel 5) y los procesos conectados del **Portal SAT Guatemala** en **WordPress** utilizando el tema **The7 (estilo Classic)** y **WPBakery Page Builder**.

---

## 1. Prerrequisitos y Configuración Inicial de WordPress

### 1.1 Plugins Requeridos
Asegúrate de que los siguientes componentes estén instalados y activos en WordPress:
1. **The7 Theme** (Dream-Theme) con preset de diseño **Classic**.
2. **WPBakery Page Builder** (incluido con The7).
3. **Ultimate Addons for WPBakery Page Builder** (provee el elemento `[bsf-info-box]`, incluido en los plugins recomendados de The7).

### 1.2 Estructura de Enlaces Permanentes (*Permalinks*)
Para que las URLs jerárquicas y limpias (como `/solicitar-nit/` o `/contribuyentes/contribuyente-general/`) funcionen sin colisiones:
1. Ve a **Ajustes > Enlaces permanentes**.
2. Selecciona la opción **Nombre de la entrada** (`/%postname%/`).
3. Guarda los cambios.

---

## 2. Paso 1: Integración de Estilos CSS Oficiales de SAT

Los shortcodes de WPBakery requieren las clases y variables institucionales de SAT para renderizar bordes de colores por segmento, tipografía corporativa, pestañas de procesos conectados en 3 pasos, contenedores de iframes oficiales y efectos *hover*.

1. En tu panel de WordPress, dirígete a:  
   **The7 > Theme Options > Advanced > Custom CSS**  
   *(Alternativa nativa: Apariencia > Personalizar > CSS adicional)*.
2. Copia íntegramente el siguiente bloque y pégalo en el editor:

```css
/* ============================================================================
 * SAT GUATEMALA — ESTILOS OFICIALES PARA THE7 CLASSIC & WPBAKERY
 * ============================================================================ */
:root {
  --sat-azul-institucional: #003865;
  --sat-celeste-sat: #0072ce;
  --sat-color-contribuyentes: #14649b;
  --sat-color-comercio: #0284c7;
  --sat-color-profesionales: #2e7d32;
  --sat-color-exentos: #c25e00;
  --sat-card-border: #dde2e5;
  --sat-text-title: #19324b;
  --sat-text-desc: #475569;
}

/* 1. HERO INSTITUCIONAL */
.sat-hero-section {
  background: linear-gradient(135deg, #003865 0%, #19324b 100%) !important;
  color: #ffffff !important;
  border-bottom: 4px solid var(--sat-celeste-sat);
}
.sat-hero-section h1, .sat-hero-section p { color: #ffffff !important; margin: 0 auto !important; }

/* 2. ACCESOS RÁPIDOS */
.sat-quick-access-row .aio-icon-box, .sat-quick-access-row .bsf-info-box {
  background: #ffffff !important;
  border: 1px solid var(--sat-card-border) !important;
  border-top: 3px solid var(--sat-azul-institucional) !important;
  border-radius: 6px !important;
  padding: 12px 14px !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.04) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.sat-quick-access-row .aio-icon-box:hover, .sat-quick-access-row .bsf-info-box:hover {
  transform: translateY(-2px) !important;
  border-top-color: var(--sat-celeste-sat) !important;
}
.sat-quick-access-row .aio-icon-title, .sat-quick-access-row .info-box-title {
  font-size: 13px !important; font-weight: 700 !important; color: var(--sat-azul-institucional) !important;
}
.sat-quick-access-row .aio-icon-description, .sat-quick-access-row .info-box-description {
  font-size: 11px !important; color: var(--sat-text-desc) !important; line-height: 1.3 !important;
}

/* 3. TARJETAS DE NIVEL 1 */
.sat-seccion-macro-segmentos .aio-icon-box, .sat-seccion-macro-segmentos .bsf-info-box {
  background: #ffffff !important;
  border: 1px solid var(--sat-card-border) !important;
  border-radius: 8px !important;
  padding: 22px 18px !important;
  min-height: 160px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
  transition: all 0.2s ease !important;
}
.sat-seccion-macro-segmentos .aio-icon-box:hover, .sat-seccion-macro-segmentos .bsf-info-box:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 10px 24px rgba(0,0,0,0.09) !important;
}
.sat-seccion-macro-segmentos .vc_column_container:nth-child(1) .aio-icon-box { border-top: 4px solid var(--sat-color-contribuyentes) !important; }
.sat-seccion-macro-segmentos .vc_column_container:nth-child(2) .aio-icon-box { border-top: 4px solid var(--sat-color-comercio) !important; }
.sat-seccion-macro-segmentos .vc_column_container:nth-child(3) .aio-icon-box { border-top: 4px solid var(--sat-color-profesionales) !important; }
.sat-seccion-macro-segmentos .vc_column_container:nth-child(4) .aio-icon-box { border-top: 4px solid var(--sat-color-exentos) !important; }

/* 4. TARJETAS DE GESTIONES Y NIVELES INTERNOS (NIVEL 2, NIVEL 3 Y NIVEL 4) */
.sat-seccion-contribuyentes .aio-icon-box, .sat-seccion-contribuyentes .bsf-info-box,
.sat-seccion-comercio-exterior .aio-icon-box, .sat-seccion-comercio-exterior .bsf-info-box,
.sat-seccion-profesionales .aio-icon-box, .sat-seccion-profesionales .bsf-info-box,
.sat-seccion-entes-exentos .aio-icon-box, .sat-seccion-entes-exentos .bsf-info-box {
  background: #ffffff !important;
  border: 1px solid var(--sat-card-border) !important;
  border-radius: 8px !important;
  padding: 16px 18px !important;
  margin-bottom: 14px !important;
  min-height: 130px !important;
  transition: all 0.2s ease !important;
}
.sat-seccion-contribuyentes .aio-icon-box:hover, .sat-seccion-contribuyentes .bsf-info-box:hover,
.sat-seccion-comercio-exterior .aio-icon-box:hover, .sat-seccion-comercio-exterior .bsf-info-box:hover,
.sat-seccion-profesionales .aio-icon-box:hover, .sat-seccion-profesionales .bsf-info-box:hover,
.sat-seccion-entes-exentos .aio-icon-box:hover, .sat-seccion-entes-exentos .bsf-info-box:hover {
  transform: translateY(-3px) !important;
  border-color: var(--sat-celeste-sat) !important;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08) !important;
}
.sat-seccion-contribuyentes .aio-icon-title, .sat-seccion-contribuyentes .info-box-title,
.sat-seccion-comercio-exterior .aio-icon-title, .sat-seccion-comercio-exterior .info-box-title,
.sat-seccion-profesionales .aio-icon-title, .sat-seccion-profesionales .info-box-title,
.sat-seccion-entes-exentos .aio-icon-title, .sat-seccion-entes-exentos .info-box-title {
  font-size: 15px !important; font-weight: 700 !important; color: var(--sat-azul-institucional) !important; line-height: 1.35 !important;
}
.sat-seccion-contribuyentes .aio-icon-description, .sat-seccion-contribuyentes .info-box-description,
.sat-seccion-comercio-exterior .aio-icon-description, .sat-seccion-comercio-exterior .info-box-description,
.sat-seccion-profesionales .aio-icon-description, .sat-seccion-profesionales .info-box-description,
.sat-seccion-entes-exentos .aio-icon-description, .sat-seccion-entes-exentos .info-box-description {
  font-size: 12.5px !important; color: var(--sat-text-desc) !important; line-height: 1.45 !important;
}

/* 5. PESTAÑAS CONECTADAS DE 3 PASOS E IFRAMES OFICIALES (SOLICITAR NIT) */
.sat-connected-steps-tabs .vc_tta-tabs-list .vc_tta-tab > a {
  font-weight: 700 !important;
  font-size: 14px !important;
  padding: 14px 24px !important;
}
.sat-connected-steps-tabs .vc_tta-tab.vc_active > a {
  background-color: var(--sat-azul-institucional) !important;
  color: #ffffff !important;
  border-color: var(--sat-azul-institucional) !important;
}
.sat-modalidad-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.sat-modalidad-card:hover {
  box-shadow: 0 8px 20px rgba(0,56,101,0.08);
}
```

3. Haz clic en **Save Options** (o Publicar).

---

## 3. Paso 2: Creación de la Página Principal (Home / Portada)

El código íntegro de la portada se encuentra en **`docs/plantillas-wpbakery/HOME_portada-portal-sat.txt`**.

1. En WordPress, ve a **Páginas > Añadir nueva**.
2. Título de la página: `Inicio` (o `Portal SAT`).
3. En la barra superior del editor, activa **WPBakery Page Builder** y selecciona la pestaña **Modo Clásico** / **Texto** (para ver el editor HTML/Shortcode).
4. Copia y pega el contenido de `docs/plantillas-wpbakery/HOME_portada-portal-sat.txt`.
5. En la barra lateral derecha (**Atributos de página > Plantilla**), selecciona `Default Template` (ancho completo sin barra lateral).
6. Haz clic en **Publicar** y configúrala como página de inicio en **Ajustes > Lectura > Tu portada muestra: Una página estática (`Inicio`)**.

---

## 4. Paso 3: Creación de la Página Universal Conectada en 3 Pasos (`/solicitar-nit/`)

Para evitar redirecciones dispersas o ventanas modales (prohibidas por Regla 13), la gestión **Solicitar Número de Identificación Tributaria (NIT)** (`SAT-GES-0001`) se implementa en una **única página universal dedicada** con slug limpio **`/solicitar-nit/`**, a la cual apuntan todos los puntos de entrada del portal (Acceso Rápido, Gestiones Frecuentes, Procesos y Catálogo de Contribuyentes).

### 4.1 Arquitectura de la Página `/solicitar-nit/` en WPBakery
La plantilla oficial lista para pegar se encuentra en:
- **`docs/plantillas-wpbakery/procesos-conectados/G_solicitar-nit.txt`**

Utiliza el contenedor de pestañas nativo de WPBakery (`[vc_tta_tabs]`) para conectar los 3 pasos sin recargar ni abandonar la página:

1. **Pestaña `1. Requisitos` (Texto nativo optimizado en Lenguaje Ciudadano):**
   - **Aviso prioritario sobre el DPI:** Destaca mediante `[vc_message]` que el Documento Personal de Identificación (DPI) debe estar **físico y vigente**, aclarando expresamente que **no se acepta la constancia de solicitud o renovación emitida por el RENAP**.
   - **4 Modalidades claras:**
     - *Uso Personal o Laboral (Sin Obligaciones de Impuestos)*
     - *Negocio, Comercio o Profesión (Con Obligaciones Tributarias)*
     - *Personas con Discapacidad Visual, Auditiva o Invalidez*
     - *Guatemalteco Residente en el Extranjero*
   - **Guía de comprobante de domicilio:** Explica cuándo NO se requiere adjuntar factura de servicios (cuando se marca *"Dirección según DPI"*) y qué documentos son válidos cuando la dirección difiere.
   - **Depuración arquitectónica:** Se omite el listado antiguo de *"5. Oficinas o Agencias Tributarias habilitadas por Región"*.
2. **Pestaña `2. Solicitar Gestión` (Iframe oficial de RTU Digital):**
   - Utiliza `[vc_raw_html]` para incrustar directamente el formulario transaccional oficial de la SAT:
     - **URL del Iframe:** `https://app.c.sat.gob.gt/rtu/formulario-inscripcion`
   - Incluye barra superior institucional con enlace de respaldo para abrir en pestaña completa si el ciudadano lo prefiere.
3. **Pestaña `3. Solicitar Cita` (Iframe oficial de Cita Validada + Manual PDF):**
   - Utiliza `[vc_raw_html]` para incrustar el sistema oficial de programación de citas para finalizar la solicitud de NIT:
     - **URL del Iframe:** `https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal`
     - **Manual Oficial en PDF:** `https://portal.sat.gob.gt/portal/descarga/15389/cita-controlada/96248/manual-usuario-portal-2`

---

## 5. Paso 4: Creación de Páginas Jerárquicas del Catálogo (Nivel 1 a Nivel 4)

Todas las plantillas WPBakery del catálogo (**714 gestiones canónicas**) se encuentran generadas y organizadas jerárquicamente en **`docs/plantillas-wpbakery/`** (consulta el inventario completo en **`docs/plantillas-wpbakery/_INDICE.md`**).

### 5.1 Árbol Canónico de Páginas de Nivel 1 y Nivel 2

Crea primero las **4 páginas de Nivel 1** y luego sus **19 páginas de Nivel 2** asignando el atributo "Superior" (*Parent Page*):

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

### 5.2 Compactaciones y Consolidaciones Aplicadas en Nivel 3 y Nivel 4 (Hallazgos A y B)
- **Hallazgo A (`Profesionales`):**
  - `Profesionales > Auditores` (4 gestiones) y `Profesionales > Servicios Profesionales` (6 gestiones) se presentan en **lista directa en Nivel 2** (`N2_auditores.txt` y `N2_servicios-profesionales.txt`), eliminando carpetas intermedias de sub-densidad.
- **Hallazgo B (`Contribuyentes > Contribuyente General`):**
  - `Regímenes tributarios` (8 gestiones) se presenta en **lista directa en Nivel 3** (`N3_regimenes-tributarios.txt`), sin fragmentación en Nivel 4.
  - `Facturación electrónica y documentos tributarios` (17 gestiones) agrupa sus gestiones en **3 bloques equilibrados de Nivel 4**:
    1. *Factura Electrónica en Línea (FEL) y Autorización de Documentos* (6 gestiones)
    2. *Imprentas, Máquinas Registradoras y Sistemas* (5 gestiones)
    3. *Formularios y Constancias de Exención* (6 gestiones)
  - `Servicios y gestiones al contribuyente` (50 gestiones) agrupa sus gestiones en **5 bloques equilibrados de Nivel 4**:
    1. *Constancias y gestiones del RTU* (9 gestiones)
    2. *Agencia Virtual y accesos* (9 gestiones)
    3. *Citas, estado y quejas* (8 gestiones)
    4. *Orientación y constancias* (8 gestiones)
    5. *Otros servicios al contribuyente* (16 gestiones)

---

## 6. Paso 5: Estructuración del Menú de Navegación de The7

Para garantizar el cumplimiento de Miller ($7 \pm 2$ opciones visibles) y cero clics pasarela:

1. Ve a **Apariencia > Menús**.
2. Crea un menú llamado **Menú Principal SAT**.
3. Añade las páginas principales y organízalas jerárquicamente:
   * **Inicio** (`/`)
   * **Contribuyentes** (`/contribuyentes/`)
     * Sin Obligaciones
     * Pequeños Contribuyentes
     * Contribuyente General
     * Contribuyentes Especiales
   * **Operadores de Comercio Exterior** (`/operadores-de-comercio-exterior/`)
     * Importadores
     * Exportadores
     * Operador Económico Autorizado (OEA)
     * Auxiliares de la Función Pública Aduanera (AFPA)
     * Regímenes Territoriales y Zonas Especiales
     * Normativa y Operaciones Aduaneras Generales
   * **Profesionales** (`/profesionales/`)
     * Abogados y Notarios
     * Peritos Contadores
     * Auditores
     * Gestores Tributarios
     * Servicios Profesionales
   * **Entes Exentos** (`/entes-exentos/`)
     * Entidades del Estado
     * Constitucionales
     * No Lucrativos
     * Municipalidades
     * Decreto
4. En **Ajustes del menú > Dónde se verá**, marca la casilla: **Main Menu** (o Menú primario de The7).
5. Guarda el menú.

---

## 7. Reglas de Gobernanza en la Administración Diaria y Regeneración Automática

Al crear o editar páginas en WordPress o actualizar el catálogo, el equipo debe mantener rigurosamente estas reglas institucionales:

1. **Sincronización Automática de Plantillas WPBakery:**  
   Cada vez que se actualice `src/data/allTramites.json`, ejecuta:
   ```bash
   python3 scripts/generar_wpbakery_shortcodes.py
   ```
   Esto regenera automáticamente todas las plantillas en `docs/plantillas-wpbakery/` y su índice `_INDICE.md`.
2. **Prohibición de la palabra "Trámite":**  
   Queda terminantemente prohibido utilizar "trámite" o "trámites" en títulos, botones, migas de pan y textos. Usar estrictamente **"gestión" / "gestiones"**.
3. **Prohibición de Modales o Popovers para Contenido:**  
   Ninguna gestión o proceso puede abrirse en ventanas emergentes o modales flotantes; toda gestión se presenta en su propia página completa dedicada.
4. **Niveles Estructurales sin Nombres Inventados:**  
   Los niveles son exclusivamente numéricos: **Nivel 1, Nivel 2, Nivel 3, Nivel 4, Nivel 5**.
5. **Ciclo ATO (Australian Taxation Office):**  
   Al agregar nuevas tarjetas, mantener el orden cronológico del ciclo de vida del contribuyente:  
   `1. Empezar` $\to$ `2. Operar` $\to$ `3. Consultar` $\to$ `4. Modificar/Cerrar` $\to$ `5. Normativa`.
