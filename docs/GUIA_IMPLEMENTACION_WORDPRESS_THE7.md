# Guía Operativa de Implementación: Portal SAT en WordPress + The7 Classic + WPBakery

Esta guía describe el procedimiento paso a paso, **100% manual y sin requerir línea de comandos (CLI)**, para construir, maquetar y publicar la Arquitectura de Información (IA) de SAT en **WordPress** utilizando el tema **The7 (estilo Classic)** y **WPBakery Page Builder**.

---

## 1. Prerrequisitos y Configuración Inicial de WordPress

### 1.1 Plugins Requeridos
Asegúrate de que los siguientes componentes estén instalados y activos en WordPress:
1. **The7 Theme** (Dream-Theme) con preset de diseño **Classic**.
2. **WPBakery Page Builder** (incluido con The7).
3. **Ultimate Addons for WPBakery Page Builder** (provee el elemento `[bsf-info-box]`, incluido en los plugins recomendados de The7).

### 1.2 Estructura de Enlaces Permanentes (*Permalinks*)
Para que las URLs jerárquicas funcionen sin colisiones:
1. Ve a **Ajustes > Enlaces permanentes**.
2. Selecciona la opción **Nombre de la entrada** (`/%postname%/`).
3. Guarda los cambios.

---

## 2. Paso 1: Integración de Estilos CSS Oficiales de SAT

Los shortcodes de WPBakery requieren las clases y variables institucionales de SAT para renderizar bordes de colores por segmento, tipografía corporativa y efectos *hover*.

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

/* 3. MACRO-SEGMENTOS (NIVEL 1) */
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

/* 4. TARJETAS DE GESTIONES (NIVEL 2 Y 3) */
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
.sat-seccion-contribuyentes .aio-icon-box:hover, .sat-seccion-contribuyentes .bsf-info-box:hover {
  transform: translateY(-3px) !important;
  border-color: var(--sat-celeste-sat) !important;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08) !important;
}
.sat-seccion-contribuyentes .aio-icon-title, .sat-seccion-contribuyentes .info-box-title {
  font-size: 15px !important; font-weight: 700 !important; color: var(--sat-azul-institucional) !important; line-height: 1.35 !important;
}
.sat-seccion-contribuyentes .aio-icon-description, .sat-seccion-contribuyentes .info-box-description {
  font-size: 12.5px !important; color: var(--sat-text-desc) !important; line-height: 1.45 !important;
}
```

3. Haz clic en **Save Options** (o Publicar).

---

## 3. Paso 2: Creación de la Página Principal (Home / Portada)

1. En WordPress, ve a **Páginas > Añadir nueva**.
2. Título de la página: `Inicio` (o `Portal SAT`).
3. En la barra superior del editor, activa **WPBakery Page Builder** y selecciona la pestaña **Modo Clásico** / **Texto** (para ver el editor HTML/Shortcode).
4. Pega el siguiente shortcode oficial de la Home:

```shortcode
[vc_row full_width="stretch_row" el_class="sat-hero-section" css=".vc_custom_hero{background-color: #003865; padding: 45px 0;}"]
[vc_column]
[vc_custom_heading text="Portal SAT Guatemala" font_container="tag:h1|font_size:32px|text_align:center|color:%23ffffff" use_theme_fonts="yes"]
[vc_custom_heading text="Gestiones, requisitos oficiales y servicios tributarios y aduaneros en línea" font_container="tag:p|font_size:16px|text_align:center|color:%23e2e8f0" use_theme_fonts="yes"]
[/vc_column]
[/vc_row]

[vc_row el_class="sat-quick-access-row" css=".vc_custom_qa{margin-top: -25px; margin-bottom: 30px;}"]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Declaraguate" read_more="box" link="url:https%3A%2F%2Fdeclaraguate.sat.gob.gt%2F||target:%20_blank|"]Presentación y pago de formularios.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Agencia Virtual" read_more="box" link="url:https%3A%2F%2Ffarm3.sat.gob.gt%2Fmenu%2Flogin.jsf||target:%20_blank|"]Servicios en línea y constancia RTU.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="RTU Digital" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Frtu-digital%2F||target:%20_blank|"]Actualización y datos personales.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Factura FEL" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Ffactura-electronica-en-linea-fel%2F||target:%20_blank|"]Emisión y verificación de DTE.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Consulta de NIT" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Fconsulta-cui-nit%2F||target:%20_blank|"]Verificar estado y validez tributaria.[/bsf-info-box][/vc_column]
[vc_column width="1/6"][bsf-info-box icon_type="none" title="Cita Previa" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Fcita-previa%2F||target:%20_blank|"]Programar atención en agencias.[/bsf-info-box][/vc_column]
[/vc_row]

[vc_row]
[vc_column]
[dt_fancy_title title="Selecciona tu perfil de atención" title_size="h2" title_color="accent"]
[vc_empty_space height="20px"]
[/vc_column]
[/vc_row]

[vc_row gap="15px" el_class="sat-seccion-macro-segmentos"]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Contribuyentes" read_more="box" link="url:%2Fcontribuyentes%2F|||"]Información y servicios tributarios para personas y empresas. RTU Digital, régimen general, pequeños contribuyentes y vehículos.[/bsf-info-box][/vc_column]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Operadores de Comercio Exterior" read_more="box" link="url:%2Fcomercio-exterior%2F|||"]Servicios e información aduanera. Importación, exportación, padrones, auxiliares de la función pública (AFPA) y declaraciones DUCA.[/bsf-info-box][/vc_column]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Profesionales" read_more="box" link="url:%2Fprofesionales%2F|||"]Herramientas especializadas para auxiliares y profesionales tributarios. Abogados, notarios, contadores públicos, auditores y gestores.[/bsf-info-box][/vc_column]
[vc_column width="1/4"][bsf-info-box icon_type="none" title="Entes Exentos" read_more="box" link="url:%2Fentes-exentos%2F|||"]Gestiones y normativa para entidades públicas, centros educativos, misiones diplomáticas, ONG y organismos no lucrativos.[/bsf-info-box][/vc_column]
[/vc_row]

[vc_row]
[vc_column]
[vc_empty_space height="30px"]
[dt_fancy_title title="Gestiones más frecuentes" title_size="h2" title_color="accent"]
[vc_empty_space height="20px"]
[/vc_column]
[/vc_row]

[vc_row gap="10px" el_class="sat-seccion-contribuyentes"]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Solicitar tu NIT en línea" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Fsolicitar-nit%2F||target:%20_blank|"]Requisitos, pasos y documentos para solicitar tu Número de Identificación Tributaria (NIT) en línea.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Solicitud y Activación de Agencia Virtual" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Frequisitos-tramites-agencia-virtual%2F||target:%20_blank|"]Acceso a la plataforma web de la SAT para consultar datos personales y constancia RTU.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Solicitud y Emisión de Solvencia Fiscal en Línea" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Fsolvencia-fiscal%2F||target:%20_blank|"]Consulta, pago y descarga del certificado electrónico que acredita la ausencia de adeudos tributarios.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Habilitación para emitir Factura Electrónica (FEL)" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Ffactura-electronica-en-linea-fel%2F||target:%20_blank|"]Pasos para incorporarte al régimen FEL y emitir documentos tributarios electrónicos de forma gratuita.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Traspaso Electrónico de Vehículos en Línea" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Ftraspaso-electronico-de-vehiculos%2F||target:%20_blank|"]Transferencia de dominio de automotores autorizada notarialmente a través de Agencia Virtual.[/bsf-info-box][/vc_column]
[vc_column width="1/3"][bsf-info-box icon_type="none" title="Inscripción en el Padrón de Importadores" read_more="box" link="url:https%3A%2F%2Fportal.sat.gob.gt%2Fportal%2Fpadron-de-importadores%2F||target:%20_blank|"]Requisitos y activación de estado en el padrón aduanero para el despacho de mercancías.[/bsf-info-box][/vc_column]
[/vc_row]
```

5. En la barra lateral derecha:
   * **Atributos de página > Plantilla:** Selecciona `Default Template` (o ancho completo sin barra lateral).
6. Haz clic en **Publicar**.
7. Ve a **Ajustes > Lectura > Tu portada muestra:** Selecciona **Una página estática** y elige la página `Inicio`.

---

## 4. Paso 3: Flujo de Copiado y Creación de Páginas Internas (N1, N2 y N3)

Para crear cada página interna con cero fricción, utiliza las plantillas HTML preparadas en el proyecto.

### 4.1 Árbol Canónico de Páginas y Slugs

Crea primero las **4 páginas padre (Nivel 1)** y luego sus **páginas hijas (Nivel 2)** asignando el atributo "Superior" (*Parent Page*):

| Nivel 1 (Página Padre) | Nivel 2 (Página Hija) | Slug sugerido | Plantilla HTML con el código |
| :--- | :--- | :--- | :--- |
| **Contribuyentes** | *(Página Hub N1)* | `/contribuyentes/` | `html-template/paginas/contribuyentes.html` |
| Contribuyentes | NIT sin Obligaciones | `/contribuyentes/nit-sin-obligaciones/` | `.../contribuyentes/nit-sin-obligaciones.html` |
| Contribuyentes | Pequeños Contribuyentes | `/contribuyentes/pequenos-contribuyentes/` | `.../contribuyentes/pequenos-contribuyentes.html` |
| Contribuyentes | Régimen Agropecuario | `/contribuyentes/regimen-agropecuario/` | `.../contribuyentes/regimen-agropecuario.html` |
| Contribuyentes | Contribuyente General | `/contribuyentes/regimen-general/` | `.../contribuyentes/regimen-general.html` |
| Contribuyentes | Contribuyentes Especiales | `/contribuyentes/contribuyentes-especiales/` | `.../contribuyentes/contribuyentes-especiales.html` |
| **Comercio Exterior** | *(Página Hub N1)* | `/comercio-exterior/` | `html-template/paginas/comercio-exterior.html` |
| Comercio Exterior | AFPA (Auxiliares Aduaneros) | `/comercio-exterior/afpa/` | `.../comercio-exterior/afpa.html` |
| Comercio Exterior | Importadores | `/comercio-exterior/importadores/` | `.../comercio-exterior/importadores.html` |
| Comercio Exterior | Exportadores | `/comercio-exterior/exportadores/` | `.../comercio-exterior/exportadores.html` |
| Comercio Exterior | Regímenes Territoriales | `/comercio-exterior/regimenes-territoriales/`| `.../comercio-exterior/regimenes-territoriales-y-zonas-especiales.html` |
| Comercio Exterior | Normativa Aduanera | `/comercio-exterior/normativa-aduanera/` | `.../comercio-exterior/normativa-y-operaciones-aduaneras-generales.html` |
| **Profesionales** | *(Página Hub N1)* | `/profesionales/` | `html-template/paginas/profesionales.html` |
| Profesionales | Abogados y Notarios | `/profesionales/abogados-y-notarios/` | `.../profesionales/abogados-y-notarios.html` |
| Profesionales | Peritos Contadores | `/profesionales/peritos-contadores/` | `.../profesionales/peritos-contadores.html` |
| Profesionales | Auditores | `/profesionales/auditores/` | `.../profesionales/auditores.html` |
| Profesionales | Gestores Tributarios | `/profesionales/gestores-tributarios/` | `.../profesionales/gestores-tributarios.html` |
| Profesionales | Servicios Profesionales | `/profesionales/servicios-profesionales/` | `.../profesionales/servicios-profesionales.html` |
| **Entes Exentos** | *(Página Hub N1)* | `/entes-exentos/` | `html-template/paginas/entes-exentos.html` |
| Entes Exentos | Entidades del Estado | `/entes-exentos/entidades-del-estado/` | `.../entes-exentos/entidades-del-estado.html` |
| Entes Exentos | Centros Educativos | `/entes-exentos/centros-educativos/` | `.../entes-exentos/constitucionales.html` |
| Entes Exentos | No Lucrativos | `/entes-exentos/no-lucrativos/` | `.../entes-exentos/no-lucrativos.html` |
| Entes Exentos | Decreto | `/entes-exentos/decreto/` | `.../entes-exentos/decreto.html` |
| Entes Exentos | Municipalidades | `/entes-exentos/municipalidades/` | `.../entes-exentos/municipalidades.html` |

### 4.2 Procedimiento de 3 Pasos por Página

1. **Abrir la plantilla:** Abre el archivo HTML correspondiente de la tabla en tu navegador (ej. haciendo doble clic en `pequenos-contribuyentes.html`).
2. **Copiar shortcode:** Baja al final de la página (bajo las tarjetas) y haz clic en el botón azul **"Copiar Shortcode"**. El botón mostrará `¡Copiado!` en verde.
3. **Pegar en WordPress:**
   * En WordPress: **Páginas > Añadir nueva**.
   * Pon el título de la página.
   * Si es página de Nivel 2, en la barra lateral selecciona la **Página superior** (ej. *Contribuyentes*).
   * Pega en la pestaña **Texto** de WPBakery.
   * Haz clic en **Publicar**.

---

## 5. Paso 4: Estructuración del Menú de Navegación de The7

Para garantizar el cumplimiento de Miller ($7 \pm 2$ opciones visibles) y cero clics pasarela:

1. Ve a **Apariencia > Menús**.
2. Crea un menú llamado **Menú Principal SAT**.
3. Añade las páginas y organízalas jerárquicamente arrastrando hacia la derecha:
   * **Inicio**
   * **Contribuyentes**
     * NIT sin Obligaciones
     * Pequeños Contribuyentes
     * Régimen Agropecuario
     * Contribuyente General
     * Contribuyentes Especiales
   * **Operadores de Comercio Exterior**
     * Auxiliares Aduaneros (AFPA)
     * Importadores
     * Exportadores
     * Regímenes Territoriales
     * Normativa Aduanera
   * **Profesionales**
     * Abogados y Notarios
     * Peritos Contadores
     * Auditores
     * Gestores Tributarios
     * Servicios Profesionales
   * **Entes Exentos**
     * Entidades del Estado
     * Centros Educativos y Universidades
     * Organizaciones No Lucrativas
     * Misiones y Decretos
     * Municipalidades
4. En **Ajustes del menú > Dónde se verá**, marca la casilla: **Main Menu** (o Menú primario de The7).
5. Guarda el menú.

---

## 6. Reglas de Gobernanza en la Administración Diaria

Al crear o editar páginas en WordPress, el equipo debe mantener rigurosamente estas reglas institucionales:

1. **Prohibición de la palabra "Trámite":**  
   Queda terminantemente prohibido utilizar "trámite" o "trámites" en títulos, botones, migas de pan y textos. Usar estrictamente **"gestión" / "gestiones"**.
2. **Niveles Estructurales sin Nombres Inventados:**  
   Los niveles son exclusivamente numéricos: **Nivel 1, Nivel 2, Nivel 3, Nivel 4, Nivel 5**. No inventar nombres de taxonomía ficticios.
3. **Capacidad de Miller ($7 \pm 2$):**  
   Ninguna página debe contener listas masivas indiferenciadas. Mantener de 5 a 9 tarjetas por fila o subtema.
4. **Ciclo ATO (Australian Taxation Office):**  
   Al agregar nuevas tarjetas, mantener el orden cronológico de vida del contribuyente:  
   `1. Empezar/Inscripción` $\to$ `2. Operar/Declarar` $\to$ `3. Consultar` $\to$ `4. Modificar/Cerrar` $\to$ `5. Normativa/Cursos`.
5. **Código Canónico Inmutable:**  
   Cada gestión terminal debe conservar su código canónico `SAT-GES-####` en la documentación y base legal.
