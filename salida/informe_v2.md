# Informe Iteración 2 — Re-clustering con Texto Completo
## Portal SAT Guatemala — Arquitectura de Información

*Generado automáticamente el 24/10/2026 20:31. Requiere validación humana antes de aplicar cambios al árbol de navegación.*

---

## Resumen Ejecutivo

Se re-ejecutó el clustering semántico del Catálogo de Gestiones del Portal SAT incorporando el **texto completo extraído** de las páginas (Iteración 2), frente al enfoque exclusivo de título + URL de la Iteración 1.

| Parámetro | Valor |
|-----------|-------|
| Total gestiones analizadas | **532** |
| Modelo de embeddings | `paraphrase-multilingual-MiniLM-L12-v2` |
| Algoritmo de clustering | K-Means, k=8, random_state=42 |
| Silhouette Score v2 | **`0.0707`** |
| Silhouette Score v1 | **`0.0889`** |
| Outliers v2 (dist > p90) | **54** |
| Gestiones sin texto | **61** |

---

## 1. Métricas de Calidad

| Métrica | Valor |
|---------|-------|
| **Silhouette Score v2** | `0.0707` |
| Silhouette Score v1 | `0.0889` |
| Mejora relativa (v2 vs v1) | `-20.5%` |

> El Silhouette Score mide cohesión intra-cluster vs. separación inter-cluster. Rango: −1 (mala) → +1 (perfecta). Valores > 0.20 indican estructura semántica útil.

## 2. Estadísticas de Scraping

- **Total gestiones procesadas:** 532
- **Gestiones con texto extraído:** 471 (88.5%)
- **Gestiones sin texto (errores HTTP / cuerpo vacío):** 61
- **Longitud promedio de texto extraído:** 12,104 chars
- **Mediana de longitud:** 3,323 chars
- **Máximo de longitud:** 889,237 chars

**Distribución de status HTTP:**

| Status HTTP | Cantidad |
|-------------|----------|
| `200` | 472 |
| `TIMEOUT` | 31 |
| `404` | 29 |

## 3. Análisis de Clusters v2

K-Means con k=8 agrupa las 532 gestiones en 8 clusters semánticos. Los clusters se ordenan de mayor a menor densidad poblacional.

### Cluster 1 — 146 gestiones

- **Cohesión promedio (dist. centroide):** `1.4455`
- **Outliers en este cluster:** 7

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Nombrar o cambiar al contador de tu negocio | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-nomb
2. Inscribir una Sociedad de Emprendimiento | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/sociedad-de-empren
3. Actualizar los datos de una empresa | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-pers
4. Traspasar vehículos por fusión de empresas | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-fusio
5. Nombrar, cambiar o cancelar al representante legal | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-o-ca
6. Actualizar tus datos de identificación (nombre, DPI) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-d
7. Traspasar un vehículo a una aseguradora (cesión de derechos) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-cesio
8. Traspasar un vehículo ganado en sorteo o rifa | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-sorte
9. Corregir la casilla de declaración rectificativa | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-correcc
10. Agregar o quitar impuestos a los que estás inscrito | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-afil

### Cluster 5 — 70 gestiones

- **Cohesión promedio (dist. centroide):** `1.7588`
- **Outliers en este cluster:** 8

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Curso: régimen de Pequeño Contribuyente | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
2. Curso: obligaciones del pequeño contribuyente | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
3. Capacitación sobre emisión de razón electrónica de timbres notariales | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
4. Curso: régimen sobre las utilidades | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
5. Curso: regímenes especiales del IVA | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
6. Curso: regímenes del ISR para negocios | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
7. Curso: generalidades del ISR | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
8. Curso: herramienta de inventarios | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
9. Curso: cómo usar Declaraguate | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu
10. Curso: productores agropecuarios, artesanales y de reciclaje | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cursos-virtu

### Cluster 4 — 66 gestiones

- **Cohesión promedio (dist. centroide):** `1.6534`
- **Outliers en este cluster:** 6

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Devolución del impuesto de herencias, legados y donaciones | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devoulucion-impues
2. Cambiar a ISR Opcional Simplificado con pago directo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-del-
3. Usar el saldo a favor de retenciones de IVA | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solicitud-de-acred
4. Devolución de IVA retenido | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-de-rete
5. Devolución de IVA por compraventa de inmuebles | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-acredit
6. Obtener tu solvencia fiscal | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solvencia-fiscal/
7. Devolución del Impuesto Sobre la Renta (ISR) trimestral | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-acredit
8. Devolución del Impuesto Sobre la Renta (ISR) opcional mensual | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-acredit
9. Solvencia fiscal (Requisito institucional de cumplimiento) | https://portal.sat.gob.gt/portal/solvencia-fiscal/
10. Emitir constancias CAIS | https://portal.sat.gob.gt/portal/emision-constancias-de-adquisicion-de-insumos-y

### Cluster 7 — 62 gestiones

- **Cohesión promedio (dist. centroide):** `1.7232`
- **Outliers en este cluster:** 9

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Entregar documentos del traspaso electrónico en Agencia Virtual | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/entrega-de-documen
2. Requisitos, pasos y documentos para habilitarte para emitir constancias CAIS. | https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/habilitacio
3. Autorizar máquinas registradoras en Agencia Virtual | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autorizacion-de-ma
4. Anular documentos en Agencia Virtual | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/aviso-anulacion-de
5. Requisitos, pasos y documentos para inscribirte como exportador. | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-para-la
6. Informe de servicios de impresión (imprentas) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/informe-de-servici
7. Autorizar facturas si las imprimes tú mismo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autorizacion-de-fa
8. Habilitar libros contables | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/habilitacion-de-li
9. Solicitar facilidades de pago (convenio) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solicitud-de-facil
10. Requisitos del formulario SAT-2390 | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-formula

### Cluster 2 — 58 gestiones

- **Cohesión promedio (dist. centroide):** `1.5255`
- **Outliers en este cluster:** 6

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Inscribir un vehículo comprado en subasta | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-veh
2. Corregir el NIT del propietario del vehículo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/rectificacion-de-n
3. Reactivar un vehículo dado de baja | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/activacion-de-vehi
4. Traspasar un vehículo con declaración jurada | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-con-decla
5. Traspasar un vehículo con certificado de propiedad | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-con-certi
6. Activar un vehículo para traspaso con declaración jurada o mandato | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/activacion-de-vehi
7. Traspasar un vehículo por anulación del contrato | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-resci
8. Traspasar un vehículo heredado | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-proce
9. Dar de baja un vehículo de forma definitiva | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inactivacion-de-ve
10. Traslado y asignación vehicular entre dependencias de una Entidad del Estado | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traslado-de-vehicu

### Cluster 6 — 52 gestiones

- **Cohesión promedio (dist. centroide):** `1.4001`
- **Outliers en este cluster:** 2

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Ver el estado de tu cita | https://portal.sat.gob.gt/portal/consulta-estado-de-cita/
2. Consulta de Asignación de Revisores Aduaneros | https://portal.sat.gob.gt/portal/asignacion-de-revisores/
3. Historial de facilidades de pago | https://portal.sat.gob.gt/portal/consulta-movimiento-convenio/bitacora-de-facili
4. Información sobre: Catálogo de permisos y arancel integrado. | https://portal.sat.gob.gt/portal/arancel-integrado/
5. Ver el estado de tu queja | https://portal.sat.gob.gt/portal/contacto/consulta-estado-de-queja/
6. Consultar imprentas autorizadas | https://portal.sat.gob.gt/portal/imprentas-inscritas/
7. Consulta y Verificación de Documentos del Manifiesto de Carga | https://portal.sat.gob.gt/portal/documentos-manifiesto/
8. Documentación y herramientas del Programa de Cumplimiento Tributario Voluntario | https://portal.sat.gob.gt/portal/cumplimiento-tributario/
9. Requisitos, pasos y documentos para enviar una consulta tributaria o aduanera. | https://portal.sat.gob.gt/portal/contacto/ingreso-de-consulta-tributaria-y-aduan
10. Consulta de Estado de Gestión de Agencia Virtual | https://portal.sat.gob.gt/portal/consulta-de-gestion-del-contribuyente/

### Cluster 3 — 42 gestiones

- **Cohesión promedio (dist. centroide):** `1.9955`
- **Outliers en este cluster:** 14

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Autorización de Cartas de Ingreso a Zona Primaria Aduanera | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/autorizacion-de-car
2. Información sobre: Equipo de revisión no intrusivo. | https://portal.sat.gob.gt/portal/programa-miad/componente-de-tecnologia/equipos-
3. Requisitos, pasos y documentos para entregar documentos de envíos parciales. | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/recepcion-documento
4. Requisitos, pasos y documentos para presentar declaración complementaria de expo | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/presentacion-y-anal
5. Renovación Anual de Operación de Auxiliares de la Función Pública y Garantía de  | https://portal.sat.gob.gt/portal/requisitos-de-aduanas/
6. Requisitos, pasos y documentos para confirmar declaraciones de mercancías. | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/confirmacion-de-dec
7. Requisitos, pasos y documentos para presentar declaración de importación con fia | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/presentacion-de-dec
8. Manual de procedimientos y despacho aduanero para misiones y cooperación interna | https://portal.sat.gob.gt/portal/manual-de-procedimientos-de-la-intendencia-de-a
9. Registro y Recepción de Póliza de Fianza / Seguro de Caución Courier | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/recepcion-de-segur
10. Culminación de Admisión Temporal de Equipo de Carga (ATC) | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/culminacion-de-admi

### Cluster 0 — 36 gestiones

- **Cohesión promedio (dist. centroide):** `1.6081`
- **Outliers en este cluster:** 2

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Procedimiento Administrativo Sancionatorio y Recursos de Impugnación | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1555105635499-a4507e58-
2. Registro y control de garitas aduaneras e infraestructura perimetral | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1571412473853-2ed0b43f-
3. Traspaso de Mercancías entre Empresas Calificadas bajo Decreto 29-89 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1774965265742-b33a96d6-
4. Procedimientos administrativos de aduanas (Sanciones y recursos) | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1570112033454-be3581a4-
5. Ubicar agencias de la SAT | https://portal.sat.gob.gt/portal/contacto/
6. Inscripción de Dependencia o Entidad del Estado en el Registro Tributario Unific | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-entida
7. Autorización y Control de Lista de Embarque en Aduana | https://portal.sat.gob.gt/portal/procedimientos-aduanas/
8. Procedimiento de control para ingreso y egreso de carga en garita de Zonas Espec | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1570052747713-e3285271-
9. Actualización de datos de Dependencia o Entidad del Estado en el RTU Digital | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-e
10. Sistema de cobro por permanencia en el país | https://portal.sat.gob.gt/portal/consultas-aduanas/

## 4. Análisis de Outliers

- **Total outliers v2** (distancia > p90): **54** (10.2%)
- **Outliers v1** (Iteración 1): **24**
- **Gestiones que eran outlier en v1 y están en cluster coherente en v2:** 19

**Top 20 outliers v2 (mayor distancia al centroide):**

| Cluster v2 | Título | URL | Distancia |
|------------|--------|-----|-----------|
| 5 | Presentaciones virtuales | https://portal.sat.gob.gt/portal/referencia-virtual/ | `3.9742` |
| 3 | Tratados de Libre Comercio y Acuerdos de Alcance Parcial | https://portal.sat.gob.gt/portal/tratados-y-acuerdos-comerciales/ | `3.5033` |
| 3 | Información sobre: Pacto de integridad. | https://portal.sat.gob.gt/portal/pacto-de-integridad/ | `3.4646` |
| 7 | Consultar productores inscritos | https://portal.sat.gob.gt/portal/consulta-productores/ | `3.3696` |
| 7 | Solicitud de acceso a la información pública | https://portal.sat.gob.gt/portal/solicitud-informacion-publica/ | `3.1853` |
| 7 | Cerrar un negocio que inscribieron a tu nombre sin autorizac | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/cese-de- | `3.1677` |
| 6 | Sistema de retenciones para servicios médicos y hospitalario | https://portal.sat.gob.gt/portal/sistemas-web/asistehospitalesweb/ | `3.1346` |
| 3 | Información sobre: Componente de procesos. | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos/ | `3.1329` |
| 5 | Videos introductorios y eventos en vivo | https://portal.sat.gob.gt/portal/capacitaciones/videos-introductorios- | `3.1072` |
| 1 | Ver calendario de capacitaciones | https://portal.sat.gob.gt/portal/events/ | `3.0390` |
| 1 | Requisitos, pasos y documentos para ampliar una consulta. | https://portal.sat.gob.gt/portal/contacto/ampliacion-de-la-consulta/ | `3.0287` |
| 7 | Actualización de datos de Organización Comunitaria en el RTU | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualiz | `2.9445` |
| 3 | Normas y Métodos de Valoración Aduanera de Mercancías | https://portal.sat.gob.gt/portal/valoracion-clasificacion-y-origen-de- | `2.9256` |
| 5 | Curso: Impuesto de Solidaridad (ISO) | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1g | `2.9203` |
| 3 | Permiso Temporal de Exportación Ocasional | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/permiso- | `2.9148` |
| 4 | Pago del Impuesto de Timbres Fiscales en línea con razón ele | https://portal.sat.gob.gt/portal/razon-electronica-timbres-fiscales/ | `2.8530` |
| 3 | Inscripción y Habilitación en el Registro de Exportadores (V | https://portal.sat.gob.gt/portal/registro-de-exportadores/ | `2.8464` |
| 4 | Registro de exenciones del Impuesto a la Distribución de Pet | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solicitu | `2.8154` |
| 7 | Autorizar facturas impresas por una imprenta | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autoriza | `2.8034` |
| 2 | Corregir datos del vehículo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/rectific | `2.8020` |

## 5. Gestiones sin Texto Extraído

Las siguientes 61 gestiones no tienen texto extraído (error HTTP, timeout o cuerpo vacío). Su análisis semántico se basó únicamente en título + URL.

| Título | URL | Status HTTP |
|--------|-----|-------------|
| Curso: qué libros debo llevar y qué documentos puedo emitir | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Tutorial: conciliación bancaria | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Servicio en línea para consultar listado de contribuyentes m | https://portal.sat.gob.gt/portal/listado-de-contribuyentes-morosos/ | `404` |
| Información general: Qué considerar al enviar por vía aérea | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/#1623281275 | `404` |
| Inscribir un vehículo con declaración jurada | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-veh | `TIMEOUT` |
| Placas de uso empresarial si no estás inscrito en el IVA | https://portal.sat.gob.gt/portal/propietarios-de-vehiculos-con-placas-de-uso-emp | `TIMEOUT` |
| Actualización de datos de Organización Comunitaria en el RTU | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-o | `TIMEOUT` |
| Información general: Qué considerar antes de comprar en el e | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/#1623281275 | `TIMEOUT` |
| Habilitación para emisión de Constancias de Exención del IVA | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/habilitacion-para- | `TIMEOUT` |
| Información sobre: Pasos antes de importar por vía aérea. | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/#1623281274 | `TIMEOUT` |
| Curso: Impuesto de Solidaridad (ISO) | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Tabla de valores del impuesto de circulación e IVA 2025 | https://portal.sat.gob.gt/portal/descarga/1899/legislacion-tributaria/82540/tabl | `TIMEOUT` |
| Traspasar un vehículo comprado en subasta | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-subas | `TIMEOUT` |
| Traspasar un vehículo entregado como pago de una deuda | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-por-adjud | `TIMEOUT` |
| Taller sobre cultura de legalidad | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Requisitos, pasos y documentos para presentar la declaración | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/presentacion-de-la- | `TIMEOUT` |
| Solicitud de acceso a la información pública | https://portal.sat.gob.gt/portal/solicitud-informacion-publica/ | `404` |
| Requisitos, pasos y documentos para ampliar una consulta. | https://portal.sat.gob.gt/portal/contacto/ampliacion-de-la-consulta/ | `TIMEOUT` |
| Información sobre: Pacto de integridad. | https://portal.sat.gob.gt/portal/pacto-de-integridad/ | `404` |
| Curso: LET para pequeño contribuyente | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Servicio en línea para ver el estado de tu consulta. | https://portal.sat.gob.gt/portal/contacto/revision-de-estado-de-consulta-tributa | `TIMEOUT` |
| Capacitación virtual de la SAT sobre sistema de franquicias  | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Videos introductorios y eventos en vivo | https://portal.sat.gob.gt/portal/capacitaciones/videos-introductorios-temas-trib | `TIMEOUT` |
| Permiso de Internación Temporal de Vehículos Turísticos / Ex | https://portal.sat.gob.gt/portal/requisitos-tramites-aduanas/ingreso-temporal-de | `TIMEOUT` |
| Solicitud de Devolución de Tributos Arancelarios (DAI e IVA  | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-de-impu | `404` |
| Información sobre: Plan maestro Puerto Fronterizo Juan Luis  | https://portal.sat.gob.gt/portal/programa-miad/componente-de-infraestructura/pla | `TIMEOUT` |
| Directorio, Horarios y Ubicación de Aduanas de la República | https://portal.sat.gob.gt/portal/aduanas-de-guatemala/ | `TIMEOUT` |
| Rescate y Desaduanamiento de Mercancías en Abandono Tácito | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/rescate-de-mercanc | `TIMEOUT` |
| Cómo llenar el formulario SAT-1411 (ISR anual) | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Plataforma anticorrupción (Contraloría) | https://clicelpoderanticorrupcion.cgc.gob.gt/clic | `200` |
| Inscripción y Habilitación en el Registro de Exportadores (V | https://portal.sat.gob.gt/portal/registro-de-exportadores/ | `404` |
| Consultar productores inscritos | https://portal.sat.gob.gt/portal/consulta-productores/ | `404` |
| Pasar a Régimen Electrónico de Pequeño Contribuyente | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisitos-de-actu | `TIMEOUT` |
| Corregir datos del vehículo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/rectificaciones-va | `TIMEOUT` |
| Sistema de retenciones para servicios médicos y hospitalario | https://portal.sat.gob.gt/portal/sistemas-web/asistehospitalesweb/ | `TIMEOUT` |
| Afiliarte al Régimen Especial Agropecuario | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-a | `404` |
| Declaración Simplificada de Exportación (DUCA-D / Aduana sin | https://portal.sat.gob.gt/portal/declaracion-de-mercancias-duca/ | `404` |
| Compendio de Criterios Vinculantes de Clasificación Arancela | https://portal.sat.gob.gt/portal/criterios-aduaneros/ | `404` |
| Notas Explicativas del Sistema Arancelario Centroamericano ( | https://portal.sat.gob.gt/portal/notas-explicativas-del-sac/ | `404` |
| Permiso Temporal de Exportación Ocasional | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/permiso-temporal-e | `404` |
| Información sobre: Componente de procesos. | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos/ | `TIMEOUT` |
| Capacitación virtual de la SAT sobre actualización de export | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Presentaciones virtuales | https://portal.sat.gob.gt/portal/referencia-virtual/ | `404` |
| Curso: beneficios de formalizarte si eres emprendedor | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Devolución del Impuesto Sobre la Renta (ISR) retenido (con e | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/devolucion-acredit | `TIMEOUT` |
| Cómo llenar la declaración anual de ISR (transporte aéreo in | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Cerrar un negocio que inscribieron a tu nombre sin autorizac | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/cese-de-actividade | `TIMEOUT` |
| Consulta de Estado de Solicitudes de Devolución de Crédito F | https://portal.sat.gob.gt/portal/consulta-devolucion-de-credito-fiscal/ | `404` |
| Normas y Métodos de Valoración Aduanera de Mercancías | https://portal.sat.gob.gt/portal/valoracion-clasificacion-y-origen-de-la-mercanc | `404` |
| Pago del Impuesto de Timbres Fiscales en línea con razón ele | https://portal.sat.gob.gt/portal/razon-electronica-timbres-fiscales/ | `TIMEOUT` |
| Guía y Despacho Simplificado para Importación Courier | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/importacion | `TIMEOUT` |
| Capacitación virtual de la SAT sobre régimen electrónico de  | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1gina-princi | `404` |
| Solicitud Electrónica Mensual de Devolución de Crédito Fisca | https://portal.sat.gob.gt/portal/devolucion-de-credito-fiscal-exportadores/ | `404` |
| Tratados de Libre Comercio y Acuerdos de Alcance Parcial | https://portal.sat.gob.gt/portal/tratados-y-acuerdos-comerciales/ | `404` |
| Denuncia Ciudadana de Contrabando y Defraudación Aduanera | https://portal.sat.gob.gt/portal/denuncias-contrabando/ | `404` |
| Inscripción al Régimen Especial de Devolución de Crédito Fis | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-al-reg | `TIMEOUT` |
| Autorizar documentos para espectáculos públicos | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autorizacion-de-do | `TIMEOUT` |
| Autorizar facturas impresas por una imprenta | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autorizacion-de-fa | `TIMEOUT` |
| Inscripción al Régimen Optativo de Devolución de Crédito Fis | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-al-reg | `TIMEOUT` |
| Anular resolución de documentos (imprentas) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/anulacion-de-resol | `TIMEOUT` |
| Pasar de Régimen General a Pequeño Contribuyente | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-camb | `TIMEOUT` |

## 6. Recomendaciones para la Arquitectura de Información

Cada cluster semántico sugiere un agrupamiento natural de gestiones. A continuación se propone la posible categoría del árbol de navegación (N1–N2) que podría acoger cada cluster, sujeto a validación con expertos en la materia.

> **Nota metodológica:** La asignación a niveles N1–N5 es orientativa. La arquitectura final requiere revisión humana para respetar las reglas de Miller (5–9 opciones por nivel), el ciclo ATO (Empezar → Operar → Consultar → Modificar/Cerrar → Normativa) y la regla del guion largo (`—`) para nodos sin clasificación intermedia.

### Cluster 0 — 36 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.6081` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Inscribir un vehículo fabricado o ensamblado en Gu"; "Actualización de datos de Federación o Asociación "; "Gestiones tributarias y exenciones de la Confedera"; "Inscripción de Municipalidad y corporaciones munic"; "Actualización de datos de Municipalidad y mancomun".

### Cluster 1 — 146 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.4455` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Requisitos, pasos y documentos para reponer la tar"; "Requisitos, pasos y documentos para reponer placas"; "Actualización de datos de Centro Educativo en el R"; "Requisitos, pasos y documentos para reponer placas"; "Inscripción de Universidad Privada en el Registro ".

### Cluster 2 — 58 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.5255` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Inscribir un vehículo con cambio de motor o color"; "Inscribir un vehículo comprado en subasta"; "Traspaso de vehículos por notario (vista del compr"; "Requisitos para la Inscripción de Vehículos"; "Requisitos para la Reposiciones con Formularios en".

### Cluster 3 — 42 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.9955` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Información general: Qué considerar al enviar por "; "Información general: Qué considerar antes de compr"; "Información sobre: Pasos antes de importar por vía"; "Requisitos, pasos y documentos para presentar decl"; "Renovación anual de registro como Auxiliar de la F".

### Cluster 4 — 66 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.6534` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Requisitos para la solvencia fiscal (SOFI)"; "Consultar morosos del impuesto de circulación"; "Solicitar devolución o compensación de impuestos d"; "Solicitar devolución del impuesto de primera matrí"; "Obtener tu solvencia fiscal".

### Cluster 5 — 70 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.7588` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Solicitud de actividades y talleres de Cultura Tri"; "Capacitación virtual sobre obligaciones tributaria"; "Curso: Libros Electrónicos Tributarios (LET)"; "Curso: cancelación por prescripción en Agencia Vir"; "Curso: Factura Electrónica en Línea".

### Cluster 6 — 52 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.4001` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Consulta de historial de Solvencias Fiscales emiti"; "Historial de facilidades de pago"; "Servicio en línea para consultar listado de contri"; "IVA e IPRIMA de vehículos usados"; "Información sobre: Pólizas de importación.".

### Cluster 7 — 62 gestiones

- **Categoría sugerida en IA:** N1: Registro e Inscripción
- **Cohesión promedio:** `1.7232` — Alta cohesión semántica, cluster bien definido.

**Patrón observado:** Incluye gestiones como: "Requisitos, pasos y documentos para solicitar plac"; "Entregar documentos del traspaso electrónico en Ag"; "Enviar documentos digitales del traspaso electróni"; "Título y tarjeta de circulación electrónicos"; "Solicitar facilidades de pago (convenio)".

---

### Próximos Pasos Recomendados

1. **Validación humana de clusters:** Revisar los 10 títulos más representativos por cluster con el equipo de Arquitectura de Información.
2. **Revisión de outliers v2:** Las gestiones con `es_outlier_v2 = True` requieren clasificación manual o refinamiento del modelo.
3. **Gestiones sin texto:** Resolver los errores HTTP e implementar estrategia de recuperación para las URLs caídas o redirigidas.
4. **Iteración 3:** Con los clusters v2 validados, mapear cada uno a la jerarquía N1–N5 del árbol de navegación y actualizar el dataset canónico `allTramites.json`.
---

*Fin del informe. Archivo generado por `scripts/informe_iter2.py`.*
*Para reproducir: `python scripts/informe_iter2.py`*
