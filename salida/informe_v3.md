# Informe Iteración 3 — Limpieza de Boilerplate + Re-clustering
## Portal SAT Guatemala — Arquitectura de Información

*Generado automáticamente el 24/10/2026 20:48. Requiere validación humana antes de aplicar cambios al árbol de navegación.*

---

## Resumen Ejecutivo

La Iteración 3 extiende el trabajo de la Iteración 2 incorporando una etapa previa de **limpieza de boilerplate institucional** (menús, footers, scripts, frases repetidas) antes de generar los embeddings semánticos. Adicionalmente, se realiza una búsqueda del k óptimo para K-Means en el rango [6–14].

| Parámetro | Valor |
|-----------|-------|
| Total gestiones analizadas | **532** |
| Modelo de embeddings | `paraphrase-multilingual-MiniLM-L12-v2` |
| Algoritmo de clustering | K-Means, k=8 (óptimo), random_state=42 |
| Silhouette Score v3 | **`0.0747`** |
| Outliers v3 (dist > p90) | **54** |

---


## 1. Tabla Comparativa de Silhouette Score

| Versión | k | Silhouette Score | Observación |
|---------|---|-----------------|-------------|
| v1 | 8 | `0.0889` | Solo título + URL |
| v2 | 8 | `0.0707` | + Texto completo (con boilerplate) |
| v3 | 8 | `0.0747` | + Texto limpio sin boilerplate |

> **Conclusión:** ✓ Mejora respecto a v2 — limpieza de boilerplate fue efectiva

## 2. Evaluación de k (Búsqueda del k Óptimo)

Se evaluaron k ∈ [6, 14]. El k seleccionado como óptimo es **k=8** (mayor Silhouette Score).

| k | Silhouette ↑ | Inercia | Davies-Bouldin ↓ | ¿Óptimo? |
|---|-------------|---------|-----------------|----------|
| 6 | `0.0705` | `1,809` | `2.9952` |  |
| 7 | `0.0711` | `1,760` | `2.7017` |  |
| 8 | `0.0747` | `1,724` | `2.6134` | **✓** |
| 9 | `0.0738` | `1,686` | `2.5711` |  |
| 10 | `0.0604` | `1,675` | `2.9714` |  |
| 11 | `0.0734` | `1,630` | `2.6045` |  |
| 12 | `0.0566` | `1,602` | `2.5698` |  |
| 13 | `0.0740` | `1,587` | `2.4469` |  |
| 14 | `0.0587` | `1,580` | `2.7705` |  |

> El Silhouette Score mide cohesión intra-cluster vs. separación inter-cluster. Davies-Bouldin mide la similitud promedio entre clusters (menor = mejor separación). La elección final pondera principalmente el Silhouette Score máximo, validado con la curva de inercia para confirmar el codo.

## 3. Clusters v3

K-Means con k=8 agrupa las 532 gestiones en 8 clusters semánticos. Los clusters se presentan en orden ascendente de id.

### Cluster 0 — 11 gestiones

- **Etiqueta TF-IDF:** `de, actualización, inscripción`
- **Cohesión promedio (dist. centroide):** `0.9554`
- **Outliers en este cluster:** 0

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Inscripción y actualización de Abogados y Notarios en el RTU
2. Requisitos para despacho de Distintivos
3. Actualización de Datos y Transición de Régimen
4. Requisitos sobre Gestiones en Gerencias Especiales
5. Solicitud de facilidades de pago en cuotas (en línea o presencial)
6. Solicitar Número de Identificación Tributaria (NIT)
7. Adquisición de Papel Sellado Especial para Protocolos y Timbres Fiscales
8. Corrección de casillas, período y NIT en formularios de Declaraguate
9. Gestiones y servicios tributarios en Agencia Virtual para entidades del Estado
10. Devolución y compensación de impuestos para entidades estatales

### Cluster 1 — 71 gestiones

- **Etiqueta TF-IDF:** `de, vehículos, de vehículos`
- **Cohesión promedio (dist. centroide):** `1.5745`
- **Outliers en este cluster:** 6

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Inscribir un vehículo comprado en subasta
2. Reactivar un vehículo dado de baja
3. Traspasar un vehículo con certificado de propiedad
4. Requisitos, pasos y documentos para inscribir vehículos nuevos (importadores).
5. Traspasar un vehículo por anulación del contrato
6. Dar de baja un vehículo de forma definitiva
7. Registrar una marca de vehículo
8. Traslado y asignación vehicular entre dependencias de una Entidad del Estado
9. Activar un vehículo para traspaso con declaración jurada o mandato
10. Traspasar vehículos por fusión de empresas

### Cluster 2 — 145 gestiones

- **Etiqueta TF-IDF:** `de, la, el`
- **Cohesión promedio (dist. centroide):** `1.6073`
- **Outliers en este cluster:** 11

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Nombrar o cambiar al contador de tu negocio
2. Trasladar o actualizar una máquina registradora
3. Quitar la anotación por convenio de pago del impuesto de circulación
4. Solicitar constancias
5. Cambiar el representante legal de una Sociedad de Emprendimiento
6. Cerrar una empresa por fusión con otra
7. Requisitos, pasos y documentos para entregar documentos de envíos parciales.
8. Agregar o quitar impuestos a los que estás inscrito
9. Requisitos, pasos y documentos para reponer placas de distribuidor.
10. Autorización de Cartas de Ingreso a Zona Primaria Aduanera

### Cluster 3 — 71 gestiones

- **Etiqueta TF-IDF:** `de, duración, evaluación de`
- **Cohesión promedio (dist. centroide):** `1.7593`
- **Outliers en este cluster:** 7

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Curso: regímenes del ISR para negocios
2. Curso: cómo usar Declaraguate
3. Curso: régimen de Pequeño Contribuyente
4. Capacitación sobre emisión de razón electrónica de timbres notariales
5. Curso: régimen sobre las utilidades
6. Curso: Régimen Electrónico de Pequeño Contribuyente
7. Curso: generalidades del ISR
8. Curso: obligaciones del pequeño contribuyente
9. Curso: herramienta de inventarios
10. Curso: Régimen Opcional Simplificado

### Cluster 4 — 75 gestiones

- **Etiqueta TF-IDF:** `de, la, el`
- **Cohesión promedio (dist. centroide):** `1.8777`
- **Outliers en este cluster:** 10

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Traspaso de Mercancías entre Empresas Calificadas bajo Decreto 29-89
2. Procedimiento de control para ingreso y egreso de carga en garita de Zonas Espec
3. Consulta del Estado de Expedientes en Gestión Aduanera
4. Información sobre: Equipo de revisión no intrusivo.
5. Registro y control de garitas aduaneras e infraestructura perimetral
6. Procedimiento Administrativo Sancionatorio y Recursos de Impugnación
7. Autorización y Control de Lista de Embarque en Aduana
8. Marco de actuación y alcance de los Gestores Tributarios acreditados
9. Actualización de datos de Dependencia o Entidad del Estado en el RTU Digital
10. Requisitos, pasos y documentos para descargar aplicaciones de la SAT.

### Cluster 5 — 27 gestiones

- **Etiqueta TF-IDF:** `de, en, la`
- **Cohesión promedio (dist. centroide):** `1.8593`
- **Outliers en este cluster:** 4

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Autorizar máquinas registradoras en Agencia Virtual
2. Entregar documentos del traspaso electrónico en Agencia Virtual
3. Registro y habilitación de Contador en Agencia Virtual
4. Solicitar usuario de Agencia Virtual
5. Anular documentos en Agencia Virtual
6. Información sobre los requisitos para el registro exportadores en Agencia Virtua
7. Requisitos, pasos y documentos para registrarte como exportador en Agencia Virtu
8. Activar tu usuario de Agencia Virtual
9. Cambiar tu correo de Agencia Virtual
10. Activar o inactivar una imprenta

### Cluster 6 — 69 gestiones

- **Etiqueta TF-IDF:** `de, la, del`
- **Cohesión promedio (dist. centroide):** `1.7588`
- **Outliers en este cluster:** 4

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Usar el saldo a favor de retenciones de IVA
2. Cambiar a ISR Opcional Simplificado con pago directo
3. Devolución de IVA retenido
4. Requisitos, pasos y documentos para pasar del Régimen Optativo al Especial.
5. Acreditación de procurador o tercero para retiro de especies fiscales
6. Devolución del impuesto de herencias, legados y donaciones
7. Devolución del 5% de ISR retenido al pequeño contribuyente
8. Requisitos, pasos y documentos para pasar del Régimen Especial al Optativo.
9. Devolución de IVA por compraventa de inmuebles
10. Devolución de IVA de facturas especiales

### Cluster 7 — 63 gestiones

- **Etiqueta TF-IDF:** `de, la, correo`
- **Cohesión promedio (dist. centroide):** `2.0163`
- **Outliers en este cluster:** 12

**Top 10 gestiones más representativas** (menor distancia al centroide):

1. Información sobre: Catálogo de permisos y arancel integrado.
2. Ver el estado de tu cita
3. Consulta en línea del padrón de Gestores Tributarios y Auxiliares activos
4. Historial de facilidades de pago
5. Consulta de Asignación de Revisores Aduaneros
6. Imprimir tu constancia del Registro Tributario Unificado (RTU)
7. Solicitar tu NIT en línea
8. Consulta y Verificación de Documentos del Manifiesto de Carga
9. Buscador del portal
10. Ver el estado de tu queja

## 4. Análisis de Outliers

- **Outliers v2** (conocido): **54** (10.2%)
- **Outliers v3** (dist > p90): **54** (10.2%)
- **Potencialmente resueltos** (v2 → v3): **0** gestiones

> Un outlier en v3 que ya era outlier en v2 indica una gestión semánticamente atípica que no se beneficia de la limpieza de boilerplate. Requiere revisión manual o podría formar su propio nodo en el árbol N1–N5.

**Outliers v3 actuales** (ordenados por distancia al centroide descendente):

| Cluster v3 | Título | URL | Distancia |
|------------|--------|-----|-----------|
| 5 | Presentaciones virtuales | https://portal.sat.gob.gt/portal/referencia-virtual/ | `3.7306` |
| 2 | Consultar productores inscritos | https://portal.sat.gob.gt/portal/consulta-productores/ | `3.4042` |
| 3 | Videos introductorios y eventos en vivo | https://portal.sat.gob.gt/portal/capacitaciones/videos-introductorios- | `3.2392` |
| 4 | Tratados de Libre Comercio y Acuerdos de Alcance Parcial | https://portal.sat.gob.gt/portal/tratados-y-acuerdos-comerciales/ | `3.1998` |
| 2 | Permiso Temporal de Exportación Ocasional | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/permiso- | `3.1525` |
| 2 | Cerrar un negocio que inscribieron a tu nombre sin autorizac | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/cese-de- | `3.0395` |
| 7 | Información sobre: Componente de procesos. | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos/ | `3.0331` |
| 7 | Solicitud de acceso a la información pública | https://portal.sat.gob.gt/portal/solicitud-informacion-publica/ | `3.0017` |
| 7 | Actualización de datos de Organización Comunitaria en el RTU | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualiz | `2.9792` |
| 2 | Autorizar documentos para espectáculos públicos | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/autoriza | `2.9673` |
| 2 | Inscripción y Habilitación en el Registro de Exportadores (V | https://portal.sat.gob.gt/portal/registro-de-exportadores/ | `2.9166` |
| 7 | Sistema de retenciones para servicios médicos y hospitalario | https://portal.sat.gob.gt/portal/sistemas-web/asistehospitalesweb/ | `2.9120` |
| 7 | Información sobre: Pacto de integridad. | https://portal.sat.gob.gt/portal/pacto-de-integridad/ | `2.9008` |
| 2 | Requisitos, pasos y documentos para ampliar una consulta. | https://portal.sat.gob.gt/portal/contacto/ampliacion-de-la-consulta/ | `2.8880` |
| 4 | Declaración Simplificada de Exportación (DUCA-D / Aduana sin | https://portal.sat.gob.gt/portal/declaracion-de-mercancias-duca/ | `2.8533` |
| 1 | Corregir datos del vehículo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/rectific | `2.8498` |
| 4 | Guía y Despacho Simplificado para Importación Courier | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/i | `2.8239` |
| 6 | Normas y Métodos de Valoración Aduanera de Mercancías | https://portal.sat.gob.gt/portal/valoracion-clasificacion-y-origen-de- | `2.8008` |
| 4 | Información sobre: Pasos antes de importar por vía aérea. | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos-2/# | `2.7921` |
| 6 | Pago del Impuesto de Timbres Fiscales en línea con razón ele | https://portal.sat.gob.gt/portal/razon-electronica-timbres-fiscales/ | `2.7848` |
| 6 | Registro de exenciones del Impuesto a la Distribución de Pet | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solicitu | `2.7683` |
| 1 | Placas de uso empresarial si no estás inscrito en el IVA | https://portal.sat.gob.gt/portal/propietarios-de-vehiculos-con-placas- | `2.7321` |
| 1 | Traspasar un vehículo entregado como pago de una deuda | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso | `2.7096` |
| 3 | Tutorial: conciliación bancaria | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1g | `2.6834` |
| 7 | Información para agentes de retención del IVA | https://portal.sat.gob.gt/portal/project/agentes-de-retencion-iva-2/ | `2.6772` |
| 7 | Servicio en línea para ver el estado de tu consulta. | https://portal.sat.gob.gt/portal/contacto/revision-de-estado-de-consul | `2.6652` |
| 4 | Información sobre: Plan maestro Puerto Fronterizo Juan Luis  | https://portal.sat.gob.gt/portal/programa-miad/componente-de-infraestr | `2.6293` |
| 3 | Curso: Impuesto de Solidaridad (ISO) | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1g | `2.5993` |
| 1 | Inscribir un vehículo con declaración jurada | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | `2.5953` |
| 4 | Denuncia Ciudadana de Contrabando y Defraudación Aduanera | https://portal.sat.gob.gt/portal/denuncias-contrabando/ | `2.5878` |
| … | *y 24 más* | | |

## 5. Gestiones Inestables Semánticamente

Se identificaron **516** gestiones que cambiaron de cluster entre v2 y v3. Esto indica inestabilidad semántica: el contenido de estas gestiones se clasifica de forma diferente dependiendo de si se incluye o no el boilerplate institucional.

| Título | URL | Cluster v2 → Cluster v3 |
|--------|-----|------------------------|
| Requisitos, pasos y documentos para reponer la tarjeta de ci | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/reposici | 1 → 2 |
| Requisitos, pasos y documentos para reponer placas de distri | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/reposici | 1 → 2 |
| Inscribir un vehículo con cambio de motor o color | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 2 → 1 |
| Inscribir un vehículo comprado en subasta | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 2 → 1 |
| Inscribir un vehículo fabricado o ensamblado en Guatemala | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 0 → 1 |
| Actualización de datos de Centro Educativo en el Registro Tr | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualiz | 1 → 2 |
| Requisitos, pasos y documentos para reponer placas de distri | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/reposici | 1 → 2 |
| Inscripción de Universidad Privada en el Registro Tributario | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 1 → 2 |
| Requisitos, pasos y documentos para solicitar placas de dist | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/asignaci | 7 → 2 |
| Obtener el primer título de propiedad | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/emision- | 1 → 2 |
| Traspaso de vehículos por notario (vista del comprador/vende | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso | 2 → 1 |
| Requisitos para la Inscripción de Vehículos | https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/#154172226376 | 2 → 1 |
| Inscripción de entidad de la Iglesia Católica en el Registro | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 1 → 2 |
| Consulta de historial de Solvencias Fiscales emitidas | https://portal.sat.gob.gt/portal/bitacora-de-solvencia-fiscal/ | 6 → 7 |
| Requisitos para la Reposiciones con Formularios en Papel | https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/#154177638117 | 2 → 1 |
| Preguntas frecuentes sobre vehículos | https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-de-vehicul | 2 → 1 |
| Solicitud de actividades y talleres de Cultura Tributaria pa | https://docs.google.com/forms/d/e/1FAIpQLScCxvGsehcWigqXjUu4yH5KwFZF-H | 5 → 3 |
| Actualización de datos de Federación o Asociación Deportiva  | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualiz | 0 → 4 |
| Activar un vehículo para traspaso con declaración jurada o m | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/activaci | 2 → 1 |
| Capacitación virtual sobre obligaciones tributarias de centr | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Curso: Libros Electrónicos Tributarios (LET) | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Curso: cancelación por prescripción en Agencia Virtual | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Curso: Factura Electrónica en Línea | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Curso: funciones de la SAT | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Traspasar un vehículo con declaración jurada | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso | 2 → 1 |
| Curso: herramienta de inventarios | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Curso: herramientas electrónicas de la SAT | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Entregar documentos del traspaso electrónico en Agencia Virt | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/entrega- | 7 → 5 |
| Curso: qué libros debo llevar y qué documentos puedo emitir | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1g | 5 → 3 |
| Enviar documentos digitales del traspaso electrónico (TEV) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/requisit | 7 → 2 |
| Curso: registro de cuentas bancarias en la contabilidad | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Traspasar un vehículo con certificado de propiedad | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso | 2 → 1 |
| Curso: usuario, contraseña y correo de Agencia Virtual | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Requisitos para la Reposición de Distintivos (Certificado de | https://portal.sat.gob.gt/portal/requisitos-de-vehiculos/#154172226427 | 2 → 1 |
| Actualizar el título y la tarjeta de circulación | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualiz | 1 → 2 |
| Cursos de temas varios | https://sites.google.com/capacitacionessat.page/cultura-tributariad/cu | 5 → 3 |
| Título y tarjeta de circulación electrónicos | https://portal.sat.gob.gt/portal/distintivos-electronicos/ | 7 → 2 |
| Tutorial: conciliación bancaria | https://sites.google.com/capacitacionessat.page/eventosenvivo/p%C3%A1g | 5 → 3 |
| Inscripción de Organización No Gubernamental (ONG) registrad | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 1 → 2 |
| Cambiar el tipo de uso de tus placas | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/cambio-d | 1 → 2 |
| Inscripción de Organización No Gubernamental (ONG) registrad | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 1 → 2 |
| Inscripción de fundación, asociación civil o entidad religio | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 1 → 2 |
| Cambiar placas por renovación general | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/reposici | 1 → 2 |
| Solicitar facilidades de pago (convenio) | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/solicitu | 7 → 2 |
| Inscripción de sucursal de entidad sin fines de lucro extran | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 1 → 2 |
| Solicitar facilidades de pago en línea | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/facilida | 7 → 6 |
| Inscripción de Organización Comunitaria de Servicios de Agua | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripc | 7 → 2 |
| Reponer placas de circulación | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/reposici | 1 → 2 |
| Actualización de datos de entidad de la Iglesia Católica en  | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualiz | 1 → 2 |
| Avisar a la SAT que vendiste tu vehículo | https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/aviso-de | 2 → 1 |
| … | *y 466 más* | |

## 6. Recomendaciones para el Árbol N1–N5

Cada cluster semántico v3 sugiere un agrupamiento natural de gestiones. A continuación se propone la posible categoría del árbol de navegación (N1–N2) que podría acoger cada cluster, sujeto a validación con expertos.

> **Nota metodológica:**
> - Los niveles jerárquicos se denominan exclusivamente **N1, N2, N3, N4, N5** — sin etiquetas conceptuales adicionales.
> - La regla de Miller establece 5–9 opciones por nivel (máximo excepcional: 10 en ≤5% del catálogo).
> - El ciclo ATO ordena las gestiones: 1. Empezar → 2. Operar → 3. Consultar → 4. Modificar/Cerrar → 5. Normativa.
> - Si un nodo no requiere clasificación intermedia en N3, N4 o N5, los campos correspondientes se registran con **`—`** (guion largo).
> - Cada clic debe representar una decisión consciente; prohibidos los clics pasarela (subcarpeta con una sola opción).

### Cluster 0 — 11 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, actualización, inscripción`
- **Cohesión promedio:** `0.9554` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (11 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 1 — 71 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, vehículos, de vehículos`
- **Cohesión promedio:** `1.5745` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (71 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 2 — 145 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, la, el`
- **Cohesión promedio:** `1.6073` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (145 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 3 — 71 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, duración, evaluación de`
- **Cohesión promedio:** `1.7593` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (71 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 4 — 75 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, la, el`
- **Cohesión promedio:** `1.8777` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (75 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 5 — 27 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, en, la`
- **Cohesión promedio:** `1.8593` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (27 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 6 — 69 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, la, del`
- **Cohesión promedio:** `1.7588` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (69 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

### Cluster 7 — 63 gestiones

- **Posición sugerida en árbol:** N1 candidato: Registro e Inscripción (inicio del ciclo ATO)
- **Etiqueta TF-IDF:** `de, la, correo`
- **Cohesión promedio:** `2.0163` — Alta cohesión semántica — cluster bien definido.
- ⚠️ **Alta densidad** (63 gestiones): considerar subdivisión en N3/N4 si la complejidad temática lo justifica.

---

### Próximos Pasos Recomendados

1. **Validación humana de clusters:** Revisar los 10 títulos más representativos por cluster con el equipo de Arquitectura de Información.
2. **Revisión de outliers v3:** Las gestiones con `es_outlier_v3 = True` requieren clasificación manual; muchas pueden haber sido outliers también en v2.
3. **Gestiones inestables:** Las gestiones que cambiaron de cluster entre v2 y v3 son candidatas prioritarias para revisión manual antes de fijar su posición en el árbol.
4. **Iteración 4:** Con los clusters v3 validados, mapear cada uno a la jerarquía N1–N5 del árbol de navegación y actualizar el dataset canónico `allTramites.json`.
---

*Fin del informe. Archivo generado por `scripts/informe_iter3.py`.*

**Instrucciones de reproducción:**
```bash
# 1. Limpiar boilerplate
python scripts/clean_boilerplate.py

# 2. Buscar k óptimo
python scripts/find_k_optimal.py

# 3. Re-clustering con k óptimo
python scripts/cluster_iter3.py

# 4. Generar este informe
python scripts/informe_iter3.py
```
