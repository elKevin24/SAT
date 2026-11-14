# Guía Paso a Paso: Cómo Revisar y Migrar una Página a WordPress (Modelo ATO + NN/g + SAT)

> **Para quién es esta guía:** Para cualquier persona del equipo que ya conoce la normativa de la **Superintendencia de Administración Tributaria (SAT)** y va a tomar una página actual de `portal.sat.gob.gt` para reescribirla y armarla en WordPress. No necesitas conocimientos técnicos ni de programación: solo sigue los **5 pasos en orden** y no te saltarás nada.

---

## Antes de empezar: ¿Cómo funciona el modelo ATO?

La **ATO** (*Australian Taxation Office*) parte de una idea muy simple: **la gente entra al portal a hacer una tarea, no a leer legislación** (*Lead with the need / task, not the law*).

- ❌ **Enfoque legislación (lo que hay que quitar del inicio):** empezar citando acuerdos, artículos o la historia de cuándo se creó la ley.
- ✅ **Enfoque tarea (modelo ATO):** decirle de inmediato a la persona qué puede hacer, qué necesita tener listo y cuáles son los pasos para lograrlo. *La ley respalda al final, nunca estorba al principio.*

Por eso, toda página operativa se ordena de arriba hacia abajo en **5 bloques** (en inglés se llaman *Layered Content*):

1. ***Summary / Start now*** **(Resumen y acción):** qué es y para qué sirve (máximo 2 oraciones).
2. ***Before you start*** **(Antes de empezar):** qué requisitos necesitas tener listos antes de iniciar.
3. ***Step-by-step*** **(Paso a paso):** cómo hacerlo en orden numerado (`1, 2, 3...`).
4. ***What happens next*** **(Qué sigue después):** qué pasa al terminar o a dónde ir después.
5. ***Legislation / Legal basis*** **(Base legal al pie):** acuerdos, decretos o resoluciones guardados en un acordeón colapsable al final (**solo si la página original los incluye**).

---

## Paso 1: Abre la página original y anota todo lo que tiene

Antes de tocar WordPress, abre la página vieja en `portal.sat.gob.gt` y haz una lista rápida de lo que ves:

1. **¿Es una página suelta o tiene subpáginas?**
   - *Ejemplo de página suelta:* *Solicitar Número de Identificación Tributaria (NIT)* (solo explica cómo hacer una gestión).
   - *Ejemplo de ecosistema (Hub + subpáginas):* *Factura Electrónica en Línea (FEL)*, que tiene portada + *Emisor*, *Certificadores*, *Documentación Técnica*, *Auditor* y *Preguntas frecuentes*.
2. **Anota todo lo que aparece en la pantalla:**
   - Título, texto de bienvenida ("la historia"), requisitos, pasos, tablas, manuales, acuerdos/resoluciones, imágenes o diagramas, enlaces a otros lados y preguntas frecuentes.
3. **Aplica las 3 reglas para no meter cosas de más:**
   - **No inventes:** si el original no trae requisitos ni pasos, no los inventes.
   - **No pegues leyes de otra página:** si una subpágina (como *Documentación técnica* o *Preguntas frecuentes*) no tiene base legal en el original, no le copies la de la portada.
   - **No metas servicios hermanos:** si un enlace lleva a otro servicio grande que ya tiene su propio espacio en la portada del portal (ejemplo: *Verificador Integrado*), no lo metas como subpágina aquí.

---

## Paso 2: Decide qué va en cada lugar (Ordenar la casa)

Antes de redactar o maquetar, decide dónde vive cada cosa que encontraste en el Paso 1:

- **Si es una página única (1 sola gestión):**
  - **No lleva menú lateral.** Todo va de arriba hacia abajo siguiendo los 5 bloques ATO (*Resumen → Antes de empezar → Paso a paso → Qué sigue después → Base legal al pie*).
- **Si es un ecosistema (Portada / *Hub* + Subpáginas):**
  - **Portada (*Hub*):** lleva el resumen del tema y **tarjetas limpias** únicamente para las subpáginas reales.
  - **Menú lateral (*"En esta sección"*):** lleva `Inicio` + exactamente las **mismas subpáginas** que están en las tarjetas (en computadora va a la izquierda; en celular va arriba como menú desplegable).
- **Si encuentras un archivo suelto (1 solo PDF, 1 Excel o una tabla de 1 fila, como *Renuentes FEL* o *Presentación Generalidades*):**
  - ❌ **No** lo pongas en el menú lateral (sería hacer clic para ver un solo botón).
  - ❌ **No** lo pongas como tarjeta principal junto a las secciones grandes.
  - ✅ Ponlo abajo, en un bloque secundario llamado **Documentos de consulta directa**, con su título, 1 línea de explicación y el botón de descarga diciendo el formato `(PDF)` o `(XLSX)`.

---

## Paso 3: Reescribe los textos en Lenguaje Claro (NN/g + SAT)

Aquí aplicamos las reglas de **Nielsen Norman Group (NN/g)** y **SAT** para que la gente entienda rápido sin ser contadora ni abogada:

### 1. El Título principal
- Si es una **gestión** (algo que el ciudadano hace): empieza con **verbo en infinitivo en las primeras 3 palabras** (*Front-Loading*).
  - ❌ *Procedimiento para la habilitación de emisores de DTE*
  - ✅ **Habilitarme como emisor de facturas (FEL)**
- Si es una **portada (*Hub*) o catálogo**: usa el nombre claro del servicio.
  - ✅ **Régimen de Factura Electrónica en Línea (FEL)**
- Escribe en **Sentence Case** (mayúscula solo al inicio, nombres propios y siglas), **sin MAYÚSCULAS sostenidas**, **sin números quemados** en títulos de tarjetas/menús (`1. Emisor`) y **sin etiquetas decorativas** encima del título.

### 2. La "historia" del principio → Regla del 50% (*50% Cut Rule* + *Inverted Pyramid*)
- En el portal viejo casi todas las páginas empiezan contando cuándo se creó el acuerdo o citando leyes. **Corta la mitad o más de ese texto:** saca fechas de creación y números de acuerdo de la entrada (eso va al pie en *Base legal*).
- Deja **máximo 2 oraciones directas** respondiendo: *¿qué puedo hacer aquí y para qué me sirve?*

> **Ejemplo real (FEL):**
> - **Antes:** *"Creado a través del Acuerdo de Directorio Número 13-2018, vigente desde el 23 de mayo del año 2018. El Régimen FEL es el modelo operativo... el cual comprende la emisión, transmisión certificación... a los que se les denomina DTE, el cual tiene por objetivo la facilitación del cumplimiento..."*
> - **Después:** *"Emite, transmite y conserva facturas, recibos, notas de crédito, notas de débito y otros Documentos Tributarios Electrónicos (DTE) de forma gratuita y con validez legal desde la Agencia Virtual o la App FEL."*

### 3. Reglas rápidas de redacción (Checklist mientras escribes)

**A. Cómo escribir las frases**
- **Habla directo, en positivo y en voz activa (ATO / Microsoft Style Guide):** usa *"tú"* o *"usted"* de forma consistente y di qué hacer en lugar de usar dobles negaciones o prohibiciones (*«Adjunta tu DPI al enviar»* en vez de *«No podrás enviar si no adjuntas...»* o *«El contribuyente deberá...»*).
- **Oraciones cortas (máximo 15–20 palabras, 1 idea por oración):** si una frase pasa de 20 palabras o tiene varias comas, divídela en dos oraciones o en viñetas.
- **Verbo directo en lugar de frases infladas (*Nominalisations*):** evita *"realizar la emisión"*, *"efectuar el pago"* o *"proceder a la anulación"* → escribe directo **emitir**, **pagar** o **anular**.
- **Condicionales claros («Si… entonces»):** para excepciones o límites, evita *"salvo en los casos previstos..."* y escribe directo: *«Si facturas Q2,500.00 o más, coloca el NIT o CUI del comprador»*.
- **Listas en paralelo con verbo en infinitivo (*Lists* — Style Manual):** cuando escribas una lista de requisitos o acciones, empieza todos los puntos igual (idealmente con verbo en infinitivo) y asegúrate de que completen la frase inicial:
  - ✅ *Para emitir facturas debes:* **habilitar** tu usuario / **actualizar** tu domicilio / **tener** un establecimiento activo.
  - ❌ *No mezcles verbos con adjetivos o gerundios:* *habilitando tu usuario / actualizando tu domicilio / activo en un establecimiento.*
- **Regla del 79% (*Scanning*):** la gente en internet escanea, no lee párrafos largos. Divide todo en bloques cortos y listas con **negrita al inicio** (*Chunking*).

**B. Números, siglas y enlaces**
- **Números, monedas, porcentajes y rangos (Guatemala):**
  - Escribe los números en cifras (`5`, `3 meses`, `72 horas`, `10 días hábiles`), salvo `cero` y `uno/una` en texto corrido, y nunca empieces una oración con un dígito.
  - Escribe monedas y porcentajes **pegados al número, sin espacio** y con coma en miles (`Q2,500.00`, `5%`, `10,000`).
  - Escribe rangos con palabras (**«de … a …» / «entre … y …»**): *«del 1 al 10 de enero»*, *«de 8:00 a 16:00»* (nunca `8:00–16:00`, porque los lectores de pantalla omiten el guion).
- **Puntuación mínima:** sin punto final en títulos ni en ítems cortos de lista; sin puntos dentro de siglas (`SAT`, `FEL`, `RTU`, nunca `S.A.T.`).
- **Expande todas las siglas la 1.ª vez que aparecen en la página** (nunca dejes una sigla suelta sin explicar):
  - `FEL` → **Factura Electrónica en Línea (FEL)**
  - `DTE` → **Documentos Tributarios Electrónicos (DTE)**
  - `NIT` → **Número de Identificación Tributaria (NIT)**
  - `RTU` → **Registro Tributario Unificado (RTU)**
  - `ISCV` → **Impuesto de Circulación de Vehículos (ISCV)**
  - `DUCA` → **Declaración Única Centroamericana (DUCA - Aduanas)**
  - `RFV` → **Registro Fiscal de Vehículos (RFV)**
  - `AFPA` → **Auxiliares de la Función Pública Aduanera (AFPA)**
  - `SOFI` → **Solvencia Fiscal en Línea (SOFI)**
  - `DPI / CUI` → **Documento Personal de Identificación (DPI) / Código Único de Identificación (CUI)**
- **Enlaces y botones claros:** nunca pongas *"clic aquí"* o *"ver más"*; di qué hace y qué formato abre (*Descargar manual de emisión (PDF)*).

### Mini diccionario rápido (Qué evitar → Qué escribir)

| No uses en la página | Escribe en su lugar |
| :--- | :--- |
| *Trámite / trámites* | **Gestión / gestiones** (o el verbo directo: *solicitar*, *actualizar*, *consultar*) |
| *Sujeto pasivo / contribuyente afecto* | **Personas y empresas** |
| *Omisos tributarios* | **Declaraciones o pagos pendientes** |
| *Realizar la emisión / efectuar el pago* | **Emitir / pagar** |
| *Clic aquí / Ver más* | **Acción + destino o formato** (ej. *Descargar listado oficial (XLSX)*) |
| *En virtud de / conforme a derecho* | *(Quítalo o dilo en palabras cotidianas)* |

---

## Paso 4: Elige la forma correcta de mostrar cada cosa (ATO *Structuring content*)

La guía oficial de Australia (*Structuring content*) define qué formato usar según el tipo de información:

| Qué tienes en la página original | Cómo debes armarlo en WordPress |
| :--- | :--- |
| **Encabezado del *Hub* (Portada)** | Título + 2 oraciones + enlaces oficiales si hay apps (*Google Play*, *App Store*, *AppGallery*). **Sin botones repetidos** si esas opciones ya están en las tarjetas de abajo. |
| **Encabezado de Subpágina o Página única** | Título + 2 oraciones + máximo 2 botones principales (por ejemplo, ir a *Agencia Virtual* o descargar el documento principal). |
| **Tarjetas del *Hub*** | **Solo Título + Descripción (máx. 2 oraciones).** Sin íconos, sin números de conteo y sin botones dentro de la tarjeta. Ajusta las columnas para que no queden huecos vacíos. |
| **Listas largas (más de 10 manuales o enlaces)** | **Agrupa por tema o etapa** (Ley de Miller: grupos de 5 a 9 elementos). *Ejemplo:* en lugar de 23 manuales juntos, divídelos en 4 bloques (*Inicio*, *Emisión*, *Consultas*, *Regímenes especiales*). |
| **Imágenes con texto o diagramas de flujo** | **Conviértelas en lista numerada (`1, 2, 3, 4`).** Así se lee perfecto en celular y funciona para personas con discapacidad visual. *(Ejemplo: el diagrama de emisión FEL pasó a 4 pasos escritos).* |
| **Requisitos o pasos de un proceso** | **Lista numerada (*Ordered list*):** `1, 2, 3...` nunca en párrafo corrido. |
| **Directorios, documentos o resoluciones** | **Tabla (*Table*)** con encabezados claros. En celular, asegúrate de que la tabla tenga desplazamiento horizontal o se apile por bloques para que no se corte la pantalla. |
| **Preguntas frecuentes (+15 preguntas)** | **Buscador rápido + Acordeones colapsables (*Accordions*)** agrupados por tema, para que la persona vea primero solo las preguntas y abra únicamente la que necesita. |
| **Leyes, acuerdos y resoluciones** | **Acordeón colapsable al final de la página** (*Base legal*), únicamente en las vistas que sí los traen en el portal original. Cita siempre normativa vigente colocando **primero el nombre de la ley o acuerdo y después el artículo** (*«Reglamento de la Ley del IVA, Artículo 30, numeral 9»*). |

### Ejemplo de orden real en una página cargada (Caso *Habilitarme como emisor*)
Cuando una página original mezcla requisitos, pasos, muchos manuales y resoluciones, ordénala exactamente así de arriba hacia abajo:
1. ***Summary / Start now:*** Título + 2 oraciones + botones principales (*Ir a Agencia Virtual* / *Registro de Emisores*).
2. ***Before you start:*** Lista numerada de requisitos mínimos (`1` al `5`).
3. ***Step-by-step:*** Pasos para habilitarse en orden + los 23 manuales agrupados en 4 categorías por tema.
4. ***What happens next:*** Enlace al siguiente paso (*Elegir certificador* o *Emitir facturas*).
5. ***Legislation (al pie):*** Acordeón colapsable con las 11 resoluciones de incorporación obligatoria.

### Reglas fijas al armar en WordPress / WPBakery
- **Contenido en la página antes que en PDF:** si la información es texto operativo (requisitos, pasos, preguntas), publícala directo en WordPress; deja el PDF solo para formularios oficiales o manuales extensos.
- **Dirección web (URL) y resumen para Google:** usa direcciones web cortas (menos de 100 caracteres) con palabras clave separadas por guion medio (`-`, nunca `_`); título en buscadores de máximo **70 caracteres** y descripción de máximo **160 caracteres**.
- **Sin ventanas emergentes:** todo contenido se abre en su propia página completa (nunca en *popups* o cuadros flotantes).
- **Plantilla limpia:** usar **Elementor Full Width**, con la barra lateral de The7 desactivada y sin duplicar el título de cabecera.
- **Sin HTML crudo:** usar módulos nativos de WPBakery / The7 Classic y dejar el *breadcrumb* automático arriba.
- **Página padre correcta:** asignar en WordPress el campo **Superior / Padre** para que la ruta y el *breadcrumb* salgan bien.
- **Color del segmento institucional:** aplicar el color del Nivel 1 que corresponda (**Contribuyentes** azul `#14649B`, **Comercio Exterior** celeste `#0284C7`, **Profesionales** verde `#4D8014`, **Entes Exentos** naranja `#C25E00`).

---

## Paso 5: Revisión final en 3 pasadas antes de publicar

Revisa tu página terminada en computadora y en celular en este orden:
1. **Estructura y fidelidad:** ¿Está todo lo del original sin textos inventados ni leyes pegadas en páginas donde no iban? ¿Tiene cierre claro (*What happens next*)?
2. **Estilo y lenguaje claro:** ¿Se entiende en 5 segundos? ¿Cero «trámite», siglas expandidas, listas en paralelo con infinitivo, cifras (`Q2,500.00`, `5%`) y rangos con palabras (*de 8:00 a 16:00*)?
3. **Vista previa y celular:** ¿Pasos en lista numerada, tablas legibles sin corte horizontal, URL limpia y botones fáciles de pulsar con el dedo?

---

## Documentos de respaldo (si necesitas profundizar)

- [DESIGN_RULES.md](./DESIGN_RULES.md) — Reglas visuales, tarjetas, responsive y accesibilidad WCAG 2.2 AA.
- [METODOLOGIA_UX_WRITING_ATO_SAT.md](./METODOLOGIA_UX_WRITING_ATO_SAT.md) — Marco teórico ATO y pilares de *Content Design*.
- [GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md](./GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md) — Diccionario completo de traducción de jerga tributaria.
- [GUIA_MIGRACION_WORDPRESS_WPBAKERY.md](./GUIA_MIGRACION_WORDPRESS_WPBAKERY.md) — Estándar técnico de maquetación en WordPress y WPBakery.
