# Hallazgos en Fuentes SAT — Ola 2 · Sub-lote 2A (13 URLs)

Registro fiel de discrepancias, particularidades técnicas y hallazgos detectados al extraer en vivo las **13 URLs del Sub-lote 2A** (`docs/maquila-paginas/lotes/ola-2/`) frente a la matriz Excel maestra (`docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado (6).xlsx`). En ningún caso se inventaron artículos legales, requisitos, fechas ni enlaces externos a la fuente oficial.

---

## 1. Discrepancias entre título/alcance en matriz Excel y recurso vivo

1. **`curso-aduanas` (`https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtuales-sat/aduanas`)**
   - **En Excel:** rotulado como *«Curso Virtual: Guía Básica para el Nuevo Importador»*.
   - **En fuente viva:** la URL dirige al **índice general de cursos de aduanas** de Cultura Tributaria SAT, con únicamente **2** capacitaciones enlazadas (*Contrabando y Defraudación Aduaneros* y *Declaración Única Centroamericana [DUCA]*) y **2** espacios reservados rotulados como `Curso 3` y `Curso 4` sin contenido ni hipervínculo.
   - **Acción editorial:** se maquiló con título y bajada fieles al índice vivo, se conservaron ambos cursos enlazados sin inventar enlaces para `Curso 3` y `Curso 4`, y se añadió la aclaración de inventario en `nota_soporte`.

2. **`temas-aduaneros--preguntas-frecuentes` (`https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-aduaneros/#1712605945521-99fc8631-e7ff`)**
   - **En Excel:** rotulado como *«Preguntas Frecuentes: Marchamo Electrónico y Corredores Fiscales»*.
   - **En fuente viva:** el ancla `#1712605945521-99fc8631-e7ff` corresponde exclusivamente al bloque de **Marchamo Electrónico** (`43` paneles desplegables en el acordeón vigente; `0` ocurrencias del término *corredor* en toda la página). Adicionalmente, los paneles `#38–#42` (`1769192947016-4fe88f8f-00e3` a `1769192943509-41add813-967d`) tratan sobre **Duda Razonable** intercalados antes del panel `#43` de Entidades Prestadoras del Servicio de Marchamo Electrónico (EPSME).
   - **Defectos puntuales en origen:**
     - Panel `#37` (`¿Cuáles son los requisitos para ser una Empresa Prestadora de Marchamo Electrónico -EPSME-?`): su respuesta en el portal copia por error el texto de la pregunta `#33` (unidades asociadas a una declaración de tránsito), mientras que la respuesta real aparece en el panel `#43`.
     - Panel `#40` (`¿Quiénes participan en el proceso de Duda Razonable?`): repite por error la respuesta del panel `#41` (*«En la automatización, reducción de tiempos, transparencia...»*).
     - En paneles `#26`, `#27`, `#43`, `#31` y `#16` se corrigieron erratas tipográficas menores de origen (`realiz ar` -> `realizar`, `duanera` -> `aduanera`, `Prestadores` -> `Prestadoras`, `transito` -> `tránsito`, `marchamos electrónico` -> `marchamos electrónicos`, cierre de comilla angular en `#30`) sin inventar respuestas en `#37` ni `#40`.

---

## 2. Documentos PDF directos y particularidades de lectura automática

3. **`acuerdo-de-directorio-numero-23-2024-que`**
   - El PDF directo (`1.10 MB`, `3 páginas`, fecha de modificación `27 de noviembre de 2024`) corresponde a un **documento escaneado sin capa de texto seleccionable** (`0` caracteres extraídos por `pypdf`).
   - **Acción editorial:** se construyó una ficha puente `TIPO-2` estrictamente con título oficial, formato, tamaño, páginas, metadato de fecha y base normativa reportada en matriz, absteniéndose de inventar artículos ni disposiciones internas.

4. **`tabla-de-valores-imponibles-del-impuesto-al`**
   - PDF directo con texto seleccionable (`802.28 KB`, `46 páginas`, fecha de creación `6 de noviembre de 2024`), vigente para `2025`, con columnas verificadas (`Tipo`, `Marca`, `Línea`, `C.C.`, `Cilindraje`, `Puertas`, `Combustible`, `Asientos`, modelos `2024` a `2010` y `Resto de Años`).

5. **`procedimientos-aduanas--obligaciones-decreto-29-89`**
   - El panel `#1774965265742-b33a96d6-e1b8` contiene dos archivos PDF:
     - `Obligaciones Decreto Número 29-89` (`39.76 KB`, `3 páginas`): en la página 2 (fila *Informe del cómputo de ISR*), la columna *Sanciones* presenta en origen el texto literal con errata tipográfica `Q 1.00.00 y el pago de impuesto omitido`. Se optó por remitir al artículo 94 del Código Tributario y al PDF oficial sin alterar ni adivinar el monto exacto.
     - `Trifoliar interinstitucional sobre gestiones y obligaciones Dto. No. 29-89` (`10.71 MB`, `2 páginas`): PDF gráfico exportado sin texto seleccionable (`CMYK`), preservado íntegro como tarjeta de descarga oficial.

---

## 3. Marcos incrustados (`<iframe>`), correos ofuscados, paginación WPFD y codificación

6. **Eliminación de `<iframe>` al 100 % con paridad de acceso:**
   - **`curso-26-factura-y-declaracion-unica-centroamericana`** y **`curso-declaracion-unica-centroamericana-duca`**: contenían `4` videos embebidos de YouTube cada uno (`4` + `4` = `8` iframes); se migraron a tarjetas `TIPO-2` con enlaces directos `https://www.youtube.com/watch?v=...`, conservando además los formularios `cdn.c.sat.gob.gt` y `forms.gle`.
   - **`puestos-de-control-interinstitucional-pci`**: incluía `<iframe src="https://view.genial.ly/648b72ad1cb4180011757f6d">`, convertido en botón principal (`cta_principal`) sin perder acceso ni tabla de 7 PCI + nota al pie.
   - **`documentos-manifiesto`**: la página viva únicamente posee `<h1>Documentos Manifiesto</h1>` y un `<iframe src="https://farm3.sat.gob.gt/consultas-publicas-aduanas/public/consultas-publicas/documentosManifiesto.jsf">`. Se estructuró como `TIPO-4` accesible con enlace directo al aplicativo y criterios reales verificados (*Catálogo de empresas*, *Código interno*, *Nombre*).

7. **`mensaje-carga-aduanera-cuscar` (`WP File Download` categoría `5032`):**
   - La tabla visible inicial muestra únicamente **20** registros paginados; la extracción vía endpoint oficial AJAX (`wpfd` categoría `5032`) recuperó la biblioteca completa de **43 archivos** (`20` con enlace de descarga + vista previa en Google Viewer/preview y `23` adicionales de páginas 2 y 3 = `63` URLs únicas).
   - El archivo `id=17512` presenta mojibake literal en origen (`ANEXO 10 AGENCIAS RESPONSABLES DE IDENTIFICACI+ôN DE MEDIOS DE TRANSPORTE`), normalizado a `IDENTIFICACIÓN` en la etiqueta visible manteniendo intacta la URL oficial. Todas las fechas (`14-11-2017`, `08-12-2017`, `17-03-2015`, `24-06-2005`) se normalizaron al español literal (`día de mes de año`).

8. **`marchamo-electronico` (`38` enlaces y correos Cloudflare):**
   - Los `5` correos protegidos por Cloudflare (`/__cf_email__`, `data-cfemail`) se decodificaron fielmente (`marchamoelectronico@grupodisatel.com`, `Yanlock@yantarnisecurity.com`, `SAC.gt@yantarnisecurity.com`, `marchamoselectronicos@deltanueve.com`, `serviciomarchamoelectronico@sat.gob.gt`) y se estructuraron como enlaces `mailto:` válidos.
   - Se reemplazaron textos de enlace con URL literal (`www.marchamoelectronicogt.com`, `www.grupodisatel.com`, `www.yantarnisecurity.com`, `www.deltanueve.com.gt`) y URLs sueltas en texto plano (`manual-de-procedimientos-de-la-intendencia-de-aduanas/` del procedimiento `PR-IAD/DNO-ADU-AYR-10`) por botones y enlaces descriptivos accesibles manteniendo el 100 % de las `38` URLs originales.

9. **`componente-activex-pki-dua`:**
   - Conserva el contexto técnico histórico para `SAQB’E` e `Internet Explorer` y el instalador `AresPKI` (`888.53 KB`, `22 de febrero de 2018`), sustituyendo textos genéricos heredados (*«siguiente Link»*, *«página de EBCLOSION»*) por tarjetas y botones descriptivos que preservan los `7` enlaces de la página original.
