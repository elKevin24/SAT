# Guía Paso a Paso: De Cero a Página Migrada en WordPress (Modelo ATO + NN/g + SAT)

> **Cómo usar esta guía:** Sigue las **5 fases en orden** cada vez que tomes una página del portal actual (`portal.sat.gob.gt`) para transformarla y maquetarla en WordPress. Está construida con los criterios de **ATO (*Structuring content* y *Layered Content*)**, **Nielsen Norman Group (NN/g)** y el **Design System SAT**, tal como se aplicó en **Factura Electrónica (FEL)**.

---

## Fase 0: Abrir la página original y hacer el inventario completo

Antes de diseñar o armar la página en WordPress, abre la página actual en `portal.sat.gob.gt` y levanta el inventario exacto:

1. **Identifica si es una página única o un ecosistema:** revisa si es una sola gestión (ejemplo: *Solicitar NIT*) o un tema con varias subpáginas en su menú (ejemplo en FEL: *Inicio*, *Emisor*, *Certificadores*, *Documentación Técnica*, *Auditor*, *Preguntas frecuentes*).
2. **Anota todos los elementos visibles:**
   - Título, párrafos iniciales ("historia", fechas de creación, artículos de ley).
   - Enlaces internos y externos, botones de descarga (PDF, XLSX, ZIP) y enlaces a tiendas de aplicaciones.
   - Tablas, listas de requisitos, manuales, resoluciones, imágenes o diagramas y preguntas frecuentes.
3. **Aplica las 3 reglas de contención:**
   - **Cero invención:** no agregues requisitos, tarjetas ni pasos que no existan en la fuente oficial.
   - **Cero herencia ciega:** si una subpágina no tiene apartado legal en el original, no le arrastres la base legal de la página principal.
   - **Cero absorción de servicios hermanos:** si un enlace apunta a un servicio de nivel superior con acceso propio en portada (ejemplo: *Verificador Integrado*), no lo metas como subpágina interna.

---

## Fase 1: Clasificar la arquitectura (Página única vs. Hub + Subpáginas vs. Archivo suelto)

Con el inventario en mano, define la estructura antes de maquetar en WordPress:

- **Si es Página única (1 sola gestión):**
  - **No lleva menú lateral** `"En esta sección"`. Va directo en flujo vertical: *Encabezado → Qué necesitas (requisitos) → Cómo hacerlo (pasos) → Base legal al pie (si aplica)*.
- **Si es Ecosistema (Hub + Subpáginas):**
  - **Página Hub (Inicio del tema):** presenta el servicio o régimen, enlaza a canales oficiales (ejemplo: App FEL) y agrupa en tarjetas únicamente las **subpáginas con contenido propio**.
  - **Subpágina interna:** entra al menú lateral vertical `"En esta sección"` en **simetría 1:1** con las tarjetas del Hub (barra activa a la izquierda en escritorio; acordeón colapsable en móvil).
- **Si hay Archivos sueltos (1 PDF, 1 Excel o tabla de 1 fila):**
  - ❌ Nunca va en el menú lateral (crearía un clic pasarela vacío).
  - ❌ Nunca compite como tarjeta principal del Hub al mismo nivel que una sección completa.
  - ✅ Va en un bloque secundario al final (*Documentos de consulta directa*) indicando título, descripción corta y formato `(PDF)` / `(XLSX)`.

---

## Fase 2: Limpiar y redactar el texto (NN/g + Lenguaje Claro SAT)

Reescribe todo el contenido de la página aplicando estas reglas en orden:

1. **Título principal:**
   - En páginas operativas o de gestión: inicia con **verbo en infinitivo en las primeras 3 palabras** (*Front-Loading*), ejemplo: *«Habilitarme como emisor de facturas (FEL)»*.
   - En páginas Hub o catálogos: usa el **nombre claro del régimen o tema**, ejemplo: *«Régimen de Factura Electrónica en Línea (FEL)»*.
   - Aplica **Sentence Case** (mayúscula solo al inicio, nombres propios y siglas).
   - **Sin etiquetas o badges decorativos** ni índices *"En esta página"* arriba del título.
2. **Párrafo introductorio (Regla del 50% + Pirámide Invertida):**
   - Toma la "historia" burocrática del original (*"Creado mediante Acuerdo 13-2018 el 23 de mayo..."*) y **corta el 50%+ de relleno** (fechas de creación, citas legales, cortesía).
   - Deja máximo **2 oraciones directas** respondiendo qué hace el ciudadano y para qué le sirve.
3. **Limpieza terminológica obligatoria:**
   - **Cero «trámite» / «trámites»:** reemplázalo siempre por **«gestión» / «gestiones»** o el verbo directo.
   - **Cero acrónimos huérfanos:** expande toda sigla en su primera mención por página, ejemplo: `Documentos Tributarios Electrónicos (DTE)`, `Registro Tributario Unificado (RTU)`, `Número de Identificación Tributaria (NIT)`.
   - **Regla del 79% (escaneo NN/g):** elimina párrafos largos; usa bloques cortos y viñetas con **negrita inicial**.
   - **Enlaces y botones predictivos:** prohíbe *"clic aquí"* o *"ver más"*; usa acciones concretas con formato (`Descargar manual (PDF)`) y asegúrate de que URLs y correos sean enlaces reales.

### Mini diccionario rápido de reemplazos
| No usar en el texto | Usar en su lugar |
| :--- | :--- |
| *Trámite / trámites* | **Gestión / gestiones** (o verbo directo: *solicitar*, *actualizar*) |
| *Sujeto pasivo / contribuyente afecto* | **Personas y empresas** |
| *Omisos tributarios* | **Declaraciones o pagos pendientes** |
| *Clic aquí / Ver más* | **Acción + destino o formato** (ej. *Descargar manual (PDF)*) |
| *En virtud de / conforme a derecho* | *(Eliminar o resumir en lenguaje directo)* |

### Ejemplo rápido: Antes vs. Después (Caso FEL)
- **Antes (portal original):** *"Creado a través del Acuerdo de Directorio Número 13-2018, vigente desde el 23 de mayo del año 2018. El Régimen FEL es el modelo operativo... el cual comprende la emisión, transmisión certificación... a los que se les denomina DTE, el cual tiene por objetivo la facilitación del cumplimiento..."*
- **Después (regla del 50% + siglas expandidas):** *"Emite, transmite y conserva facturas, recibos, notas de crédito, notas de débito y otros Documentos Tributarios Electrónicos (DTE) de forma gratuita y con validez legal desde la Agencia Virtual o la App FEL."* *(Y el Acuerdo 13-2018 pasa al acordeón de base legal al pie).*

---

## Fase 3: Estructurar cada bloque en WordPress (ATO *Structuring content* + WPBakery)

Ordena la página en **3 capas ATO** (*Lead with the need, not the law*) y elige el bloque exacto para cada contenido:

| Qué estás migrando | Cómo debes estructurarlo |
| :--- | :--- |
| **Encabezado del Hub** | Título + 2 oraciones + enlaces de canales si existen (ejemplo: tiendas de App FEL). **Sin botones internos duplicados** si las acciones ya están en las tarjetas de abajo. |
| **Encabezado de Subpágina / Página única** | Título + 2 oraciones + máximo 2 botones estándar (primario / secundario) si hay acción externa o descarga principal. |
| **Tarjetas del Hub** | Solo Título + Descripción (máx. 2 oraciones). **Cero íconos, cero conteos, cero botones internos.** Ajusta las columnas para no dejar huecos visuales. |
| **Listas largas (más de 10 manuales o enlaces)** | **Agrupa por tema o etapa** (Ley de Miller $7\pm 2$): ejemplo, dividir 23 manuales en 4 categorías (*Inicio*, *Emisión*, *Consultas*, *Regímenes especiales*). |
| **Diagramas o flujos en imagen** | **Reemplázalos por texto accesible:** lista numerada paso a paso para que se lea bien en móvil y en lectores de pantalla. |
| **Requisitos o procedimientos** | Lista numerada (ejemplo: 1 a 5), nunca párrafos corridos. |
| **Directorios, documentos o resoluciones** | Tabla estructurada con encabezados claros en escritorio; en móvil usar contenedor con desplazamiento horizontal o bloques apilados para que no se corte la pantalla. |
| **Preguntas frecuentes (+15 ítems)** | **Buscador o filtro rápido** + **acordeones colapsables** agrupados por tema, con enlaces reales dentro de las respuestas. |
| **Cierre operativo (*Qué sigue después*)** | En páginas operativas (ej. *Emisor FEL*), cerrar con 1–2 enlaces al siguiente paso lógico (ej. *Elegir certificador* o *Preguntas frecuentes*) para evitar callejones sin salida. |
| **Leyes, acuerdos y resoluciones** | **Al pie de la página** dentro de un acordeón colapsable secundario, **solo** en las páginas que sí tienen base legal en el original. |

### Reglas clave al armar en WordPress / WPBakery
1. **Plantilla y ancho:** usar plantilla **Elementor Full Width**, con barra lateral de The7 desactivada y sin duplicar el título de cabecera de The7.
2. **Componentes nativos:** prohibido usar bloques de HTML crudo (`[vc_raw_html]`); usar los módulos nativos de WPBakery / The7 Classic y el *breadcrumb* automático al inicio.
3. **Jerarquía de página (`Superior / Padre`):** asignar correctamente la página padre en WordPress para que el *breadcrumb* y la URL reflejen el nivel real.
4. **Color del segmento institucional:** aplicar la clase de color del Nivel 1 que corresponda (**Contribuyentes** `#14649B`, **Comercio Exterior** `#0284C7`, **Profesionales** `#4D8014`, **Entes Exentos** `#C25E00`).

---

## Fase 4: Revisión final en WordPress antes de publicar

Antes de publicar la página, verifica punto por punto:
- [ ] **Fidelidad:** ¿Está todo el contenido de la página original sin textos inventados ni bloques legales heredados por error?
- [ ] **Lenguaje claro:** ¿Se eliminó «trámite», se expandieron siglas en 1.ª mención y se aplicó la regla del 50%?
- [ ] **Navegación dedicada:** ¿Todo contenido se muestra en su página completa (sin ventanas emergentes, modales ni popovers)?
- [ ] **Responsive:** ¿Se lee limpio en escritorio y en móvil sin cortes ni scroll horizontal?
- [ ] **Accesibilidad:** ¿Los botones y enlaces tienen buen espacio táctil para pulsar fácil en celular, buen contraste y no dependen de imágenes para leer pasos?

---

## Documentos de respaldo (consulta)

- [DESIGN_RULES.md](./DESIGN_RULES.md) — Reglas visuales, tarjetas, responsive y accesibilidad WCAG 2.2 AA.
- [METODOLOGIA_UX_WRITING_ATO_SAT.md](./METODOLOGIA_UX_WRITING_ATO_SAT.md) — Marco teórico ATO y pilares de *Content Design*.
- [GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md](./GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md) — Diccionario de traducción de jerga tributaria a lenguaje ciudadano.
- [GUIA_MIGRACION_WORDPRESS_WPBAKERY.md](./GUIA_MIGRACION_WORDPRESS_WPBAKERY.md) — Estándar técnico de maquetación en WordPress y WPBakery.
