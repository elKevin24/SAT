# Hallazgos en Fuentes Origen del Portal SAT — Ola 1 (Sub-lotes 1A y 1B)

Documento de trazabilidad técnica sobre inconsistencias, erratas, enlaces cruzados y notas internas heredadas del portal origen (`portal.sat.gob.gt` y recursos WPFD), detectadas durante la extracción en vivo (`fuentes_extraidas_1a.json` y `fuentes_extraidas_1b.json`) y la maquila de la **Ola 1** (`9` páginas del Sub-lote 1A + `5` páginas del Sub-lote 1B).

> **Criterio aplicado:** cero invención de datos y preservación íntegra de los destinos URL reales capturados en origen (`463/463` en Sub-lote 1A y `56/56` enlaces únicos de contenido en Sub-lote 1B). Las correcciones aplicadas en la maquila se limitan a normalización editorial (lenguaje claro, texto descriptivo de enlaces, correos `mailto:`, ortografía obvia sin alterar códigos oficiales y formato accesible de fechas). Las correcciones estructurales en el repositorio CMS origen corresponden al equipo administrador del portal SAT.

---

## 1. Enlaces cruzados en repositorio documental (`procedimientos-aduanas`)

**URL origen:** `https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1571412473853-2ed0b43f-287f`  
**Página maquilada:** `procedimientos-aduanas--instructivos-manuales-guias`

| Título publicado en la tabla origen | URL literal registrada en el portal origen | Discrepancia detectada |
|---|---|---|
| `IN-IAD/DNO-ADU-GCA-26` Instructivo para el proceso de transmisión del manifiesto electrónico de carga aéreo en los depósitos aduaneros temporales | `https://portal.sat.gob.gt/portal/descarga/13741/instructivos/77536/in-iad-dno-adu-gca-27-instructivo-para-la-recepcion.pdf` | El título `GCA-26` enlaza al archivo PDF del instructivo `GCA-27`. |
| `IN-IAD/DNO-ADU-GCA-27` Instructivo para la recepción de mercancías por vía aérea | `https://portal.sat.gob.gt/portal/descarga/13741/instructivos/77534/in-iad-dno-adu-gca-26-instructivo-proceso-transmision.pdf` | El título `GCA-27` enlaza al archivo PDF del instructivo `GCA-26`. |

**Acción recomendada en CMS SAT:** intercambiar los hipervínculos `77534` y `77536` en la tabla fuente de WordPress para que cada código apunte a su PDF correspondiente. En la maquila actual se respetó el vínculo literal de la fuente viva.

---

## 2. Anomalías editoriales y enlaces en Preguntas Frecuentes (`temas-aduaneros`)

**URL origen:** `https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-aduaneros/`  
**Página maquilada:** `temas-aduaneros`

1. **Nota interna de borrador expuesta (`panel_id="1769199247263-2077eeac-aa2f"`, Transformación Digital):**
   - Texto en origen: `"(mencionar firma electrónica / códigos QR / correlativos únicos)"`.
   - Tratamiento en maquila: redactado como texto ciudadano (`"firma electrónica, códigos QR o correlativos únicos"`), eliminando la instrucción de borrador.
2. **Posible errata en dirección de correo institucional (`panel_id="1673448500081-7e74fe35-036a"`, Despacho de Mercancías):**
   - El portal origen publica `tranformaciondigital@sat.gob.gt` (sin la letra `"s"` en `transformacion`).
   - Tratamiento en maquila: se preservó literal tanto en `mailto:` como en el texto visible para no redirigir a una casilla no verificada. Se recomienda validar con TI SAT si la cuenta activa es `transformaciondigital@sat.gob.gt`.
3. **URL con espacio codificado `%20` (`panel_id="1652982783524-c8102e05-382c"`, DUCA):**
   - El enlace apunta literalmente a `https://portal.sat.gob.gt/portal/declaracion-%20unica-centroamericana-duca/#1558031306158-7c12ffcb-c8ae`.
   - Tratamiento en maquila: se preservó el `href` original para mantener paridad 1:1 y se sustituyó la URL expuesta como texto visible por una etiqueta descriptiva.
4. **Preguntas duplicadas en áreas *Franquicias* y *Exportaciones Temporales* (8 pares / 16 entradas):**
   - *Franquicias*:
     - `¿Cómo puedo presentar una Franquicia?` (`1769033876890-3a75e436-1727` y `1769193503588-dbc2b037-e265`)
     - `¿Cómo hago para solicitar la habilitación de la forma de pago si ya tengo la resolución de autorización de Franquicia?` (`1769033979084-c4803e6e-9425` y `1769193512216-a376b087-9afe`). Además de la duplicación, la respuesta fuente contiene la errata `"repreentante"`, repetición interna de `"firmada por el representante legal o el agente aduanero"` dentro del inciso `a)` y el correo `AsuntosAduanales@sat.gob.gt` en texto plano.
     - `¿Quién tiene derecho a solicitar franquicia?` (`1769033977876-d724d677-fe5d` y `1769193512012-ad9ccf00-e325`)
     - `¿Quién puede realizar la solicitud de franquicia electrónica?` (`1769034096506-a722d856-1977` y `1769193764186-17809708-8c3d`)
   - *Exportaciones Temporales*:
     - `¿Cómo puedo presentar una Exportación Temporal?` (`1738357976076-eeade571-4190` y `1769193907994-adb917c5-c0e7`)
     - `¿Puedo ingresar la solicitud de Exportación Temporal de forma electrónica?` (`1769098251563-87c00ed5-7456` y `1769193907794-7b8f90e2-9bf7`)
     - `¿Cómo me notifican una exportación temporal?` (`1769098250715-c2af10b4-cf46` y `1769193907598-367dec73-5aa7`)
     - `¿Mi agente aduanero puede... la solicitud de Exportación Temporal de forma electrónica?` (`1769098420847-fa8d906d-d542` y `1769193907202-300ce0c6-6d17`).
   - **Acción recomendada en CMS SAT:** depurar los 8 paneles repetidos en origen y revisar el inciso `a)` de habilitación de forma de pago en Franquicias.
5. **Normalización verbal y erratas tipográficas menores (`temas-aduaneros`):**
   - Tres preguntas en origen empleaban el verbo `"tramitar"` (`1769193762660-6ff2b706-7bcb` en Franquicias y el par duplicado `1769098420847-fa8d906d-d542` / `1769193907202-300ce0c6-6d17` en Exportaciones Temporales); las tres se sustituyeron en maquila por `"gestionar"`.
   - Asimismo se corrigieron tres erratas tipográficas puntuales detectadas en origen: `"indivivual"` → `"individual"` (`1769193503588-dbc2b037-e265`), `"Manfiesto"` → `"Manifiesto"` (`1769200128585-d2c9baf9-cf95`) y el formato monetario `"Q.1, 200.00"` → `"Q1,200.00"` (`1655325782834-1b7d3969-10c3`), manteniendo sin cambios todas las URLs e importes.
6. **Enlaces no descriptivos y URLs expuestas en texto:**
   - Se detectaron en origen `5` enlaces con texto `"haz clic AQUÍ"`, `24` enlaces `<a>` cuyo texto visible era la URL cruda, `7` URLs sueltas en texto plano sin etiqueta `<a>` y `2` apariciones del correo `AsuntosAduanales@sat.gob.gt` sin `mailto:`. Todos fueron normalizados en maquila conservando exactamente las URLs destino.
7. **Siglas sin desarrollar y puntuación en origen:**
   - El encabezado de bloque contenía coma duplicada (`"Zonas Francas, , ZOLIC y ZDEEP"`), limpiada en maquila.
   - En `panel_id="1769192943509-41add813-967d"` (Duda Razonable), la sigla `DRD` aparece como `"Requerimiento de información DRD"` sin definición expandida en el portal; en maquila se mantuvo el nombre literal sin inventar significado.

---

## 3. Biblioteca de Legislación Aduanera (`legislacion-aduanera`)

**URL origen:** `https://portal.sat.gob.gt/portal/biblioteca-en-linea-sat/legislacion-aduanera/` (categoría WPFD `1895`, `225` archivos)  
**Página maquilada:** `legislacion-aduanera`

1. **Erratas y códigos atípicos en títulos WPFD:**
   - `SAT-DSI-812-2016 ... las operaciones de tánsito` (errata `"tánsito"`, corregida a `"tránsito"` en la maquila).
   - `R-SAT DSI-1008-2023 DISPOSIONES ADMON. REGULAR TRASLADO ATU II-PUERTO FRONTERIZO ING. JUAN LUIS LIZARRALDE ARRIVILLA HACIA CENTRALES TRANFERENCIA CARGA Y VICEVERSA` (mayúsculas sostenidas, `"DISPOSIONES"`, `"TRANFERENCIA"`, y sigla `"ATU II"` sin expansión en el registro WPFD).
   - `Resolucion de Intedencia de Aduanas Número SAT-IAD-012-2023` (`"Resolucion"`, `"Intedencia"`).
   - `Resolución Superintendencia SAT-IAD-00r-2014. Vía electrónica declaración de mercancías` (código con carácter `"00r"` en el título oficial del repositorio WPFD; se conservó literal el código).
   - `Resolución SAT-IAD-005-2021 Duda Razonable..` (doble punto final).
2. **Títulos con formato de slug o mayúsculas sostenidas:**
   - Casos como `DECRETO DEL CONGRESO 14-2013 LEY DE ADUANAS`, `DECRETO 58-90 LEY CONTRA LA DEFRAUDACION Y EL CONTRABANDO ADUANEROS`, `TABLA-IVA-IMPORTACIÓN-E-IPRIMA-2019`, `ACUERDO-No.-35-2018-...` y `ACUERDO-No.-34-2018-...` fueron normalizados a *Sentence Case* legible manteniendo intactos los códigos normativos y las URLs de descarga.
3. **Metadatos de fecha WPFD:**
   - Todos los registros (`225`) se publican en origen en formato numérico `DD-MM-YYYY`; en maquila se formatearon a español legible (`"26 de octubre de 2026"`).
   - Asimismo, instrumentos históricos como `DECRETO DEL CONGRESO 14-2013` (`26-10-2026`), `DECRETO 58-90` (`23-10-2026`), `SAT-DSI-812-2016` (`23-10-2026`) y `SISTEMA ARANCELARIO CENTROAMERICANO SAC 2026` (`23-10-2026`) reportan fecha de actualización/carga reciente en WPFD y no la fecha original de promulgación legal.

---

## 4. Trazabilidad de estado en prototipo (Inventario Excel)

- `pacto-de-integridad-del-serv-aduanero` (`https://portal.sat.gob.gt/portal/wpfd_file/pacto-de-integridad-del-serv-aduanero/`): figura en el inventario Excel con observación `"Error 404 Prototipo"`, aunque su archivo WPFD fuente responde HTTP `200` en vivo.
- `curso-10-consecuencias-de-la-defraudacion-y` (`https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat/aduanas/10-consecuencias-de-la-defraudaci%C3%B3n-y-contrabando-aduanero`): figura con observación `"No se ha migrado aun"` y enlaza a Google Sites, videos en YouTube y formularios externos.

---

## 5. Hallazgos y decisiones arquitectónicas — Sub-lote 1B (MIAD y casos FEL)

**Páginas maquiladas (`5`):** `programa-miad`, `programa-miad-componente-procesos`, `declaracion-jurada-regional-de-viajero`, `solvencia-fiscal` y `consulta-movimiento-convenio` (todas modeladas bajo el arquetipo `TIPO-3` sin inventar submódulos inexistentes).

1. **`programa-miad` (`https://portal.sat.gob.gt/portal/programa-miad/`):**
   - La página viva únicamente mostraba el título `Programa MIAD` y cinco tarjetas enlazadas sin texto introductorio (con variante de mayúsculas en la ruta `/portal/programa-miad/Componente-de-Seguridad/`, conservada literal).
   - En maquila se agregó descripción en lenguaje claro del programa y resúmenes ciudadanos fieles al contenido real de cada uno de sus cinco subcomponentes en producción.
2. **`programa-miad-componente-procesos` (`https://portal.sat.gob.gt/portal/programa-miad/componente-procesos/`):**
   - **Errata tipográfica en acordeón fuente:** el primer panel aparece publicado como `"Intructivos"` (sin la `"s"`), corregido a `"Instructivos"` en maquila.
   - **Mismo cruce de archivos `GCA-26` / `GCA-27`:** igual que en `procedimientos-aduanas`, la fila `IN-IAD/DNO-ADU-GCA-26` enlaza al PDF `77536/in-iad-dno-adu-gca-27-instructivo-para-la-recepcion.pdf` y la fila `IN-IAD/DNO-ADU-GCA-27` enlaza al PDF `77534/in-iad-dno-adu-gca-26-instructivo-proceso-transmision.pdf`. Se preservaron las URLs literales para mantener paridad 1:1; se recomienda intercambiarlos en el CMS origen.
   - **Evaluación de separación de VUMAR (`"analizar separar vumar"`):** en origen, la sección de la Ventanilla Única Marítima (VUMAR) contiene únicamente `3` PDFs y carece de texto operativo propio o aplicativo separado. Para evitar una subpágina huérfana de tres enlaces sin respaldo documental extra, en maquila se separó visualmente en un bloque propio de tarjetas horizontales (`Ventanilla Única Marítima (VUMAR)`) distinto de los dos acordeones del despacho aéreo (`Instructivos (5)` y `Guías (9)`), junto con un bloque comparativo inicial por modalidad.
3. **`declaracion-jurada-regional-de-viajero` (`https://portal.sat.gob.gt/portal/declaracion-jurada-regional-de-viajero/`):**
   - El botón principal hacia `declaracionJuradaDelViajero.html` dependía de una imagen sin texto alternativo accesible; se sustituyó por CTA nativo descriptivo.
   - El documento `GU-IAD/DNO-ADU-GDE-18` (`.../91710/gu-iad_dno-adu-gde-18-guia-para-el-uso-de-la-app-movil-en-el-llenado-de-la-declaracion-jurada-regional-de-viajero-electronica`) carece de extensión `.pdf` en la ruta de descarga del portal origen; se conservó literal.
   - El panel `Información General` contenía `2` videos en `<iframe>` de YouTube (migrados a botones externos `youtube.com/watch?v=...` conforme a la regla `0% <iframe>`) y `18` afiches/infografías `.jpg`/`.png` enlazados sin atributo `alt` descriptivo (incluyendo archivos con acentos en forma NFD en servidor), rotulados en lenguaje claro según sus nombres reales manteniendo las URLs exactas.
4. **`solvencia-fiscal` y `consulta-movimiento-convenio` (patrón Hub `FEL`):**
   - Ambas páginas en vivo ya operan como hubs de enrutamiento hacia subpáginas y aplicaciones reales existentes en el portal (`requisitos-sofi`, `bitacora-de-solvencia-fiscal`, `Declaraguate SAT 8421`, `bitacora-de-facilidades-de-pago`, `requisitos-de-personas-empresas` y `preguntas-frecuentes`), por lo que se estructuraron como `TIPO-3` análogos a `FEL_hub-principal` sin crear páginas redundantes.
   - En `consulta-movimiento-convenio`, el texto origen usa `"a las contribuyentes"` y nombra el documento `"Reconocimiento de Adeudo Tributario -RUAT-"` (en maquila se estandarizó la sigla a `(RUAT)` y se estructuraron en tabla semántica TinyMCE-safe las cuatro excepciones legales de impuestos y retenciones).
