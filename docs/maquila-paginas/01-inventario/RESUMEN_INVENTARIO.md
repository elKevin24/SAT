# Resumen del Inventario Deduplicado — Comercio Exterior (Portal SAT)

- **Fuente oficial (solo lectura):** `docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado (6).xlsx` (hoja `Comercio Exterior (197)`)
- **Fecha de generación:** `2026-11-15T23:06:52.024666+00:00`

## 1. Cuadre Matemático de Deduplicación

| Métrica | Cantidad | Verificación |
| :--- | :---: | :--- |
| Filas totales en hoja origen | **197** | 100% mapeadas en `Trazabilidad (197)` |
| Destinos URL únicos (incluyendo `#ancla`) | **120** | Suma de `row_count` = **197** |
| URLs base únicas (verificadas por HTTP) | **109** | Sin fragmento `#` |
| Destinos con fragmento `#ancla` | **15** | Incluye bloques internos de mega-páginas |
| Colisiones de tipología resueltas | **22** | 1 arquetipo maestro único por URL |
| URLs accionables (`OLA-1` a `OLA-4`) | **89** | Descuenta `PAUSA` (31) |
| URLs únicas con maquila completada | **89 / 120** | Pares `_wpbakery.txt` + `_custom.css` detectados |

## 2. Distribución por Ola de Producción

| Ola | URLs Únicas | Filas Consolidadas | Criterio |
| :--- | :---: | :---: | :--- |
| **PAUSA** | 31 | 32 | 100% de filas asociadas con `Lenguaje Claro = True` y `Observaciones` vacía |
| **OLA-1** | 14 | 52 | URLs con observaciones explícitas en la fuente (casos FEL, `#ancla`, migración pendiente) |
| **OLA-2** | 26 | 41 | Pendientes de arquetipos `TIPO-2`, `TIPO-4`, `TIPO-5` y `TIPO-6` |
| **OLA-3** | 22 | 35 | Pendientes `TIPO-1` de `Importadores` y `Operador Económico Autorizado (OEA)` |
| **OLA-4** | 27 | 37 | Resto de pendientes `TIPO-1` (`AFPA`, `Exportadores`, `Regímenes Territoriales y Zonas Especiales`) |

## 3. Distribución por Arquetipo Maestro (`TIPO-1` a `TIPO-6`)

| Arquetipo | Descripción | URLs Únicas | Filas Consolidadas |
| :--- | :--- | :---: | :---: |
| **TIPO-1** | Ficha de Gestión y Requisitos | 67 | 91 |
| **TIPO-2** | Puente a Aplicativo, Buscador o Descarga | 24 | 37 |
| **TIPO-3** | Hub / Desglose de Mega-Página | 14 | 41 |
| **TIPO-4** | Directorio, Tabla o Documentación Técnica | 8 | 10 |
| **TIPO-5** | Normativa y Criterio Legal | 5 | 11 |
| **TIPO-6** | Preguntas Frecuentes (FAQ) | 2 | 7 |

## 4. Hallazgos de Verificación HTTP en Vivo

| Estado HTTP | URLs Únicas | URLs Base Únicas |
| :--- | :---: | :---: |
| `200` | 120 | 109 |

## 5. Colisiones de Tipología Consolidadas (22)

| Slug | Filas | Arquetipo Asignado | Tipologías Observadas |
| :--- | :---: | :---: | :--- |
| `legislacion-aduanera` | 7 | **TIPO-5** | `Guía Informativa / Texto`, `Guía de Requisitos y Pasos`, `Normativa y Criterio Legal` |
| `programa-miad` | 4 | **TIPO-3** | `Guía Informativa / Texto`, `Guía de Requisitos y Pasos` |
| `procedimientos-aduanas--manual-operativo-aduana-sin` | 6 | **TIPO-3** | `Guía Informativa / Texto`, `Guía de Requisitos y Pasos`, `Trámite Transaccional` |
| `declaracion-unica-centroamericana-duca` | 2 | **TIPO-1** | `Trámite / Aplicativo en Línea`, `Trámite Transaccional` |
| `consulta-declaracion-unica-aduanera` | 2 | **TIPO-2** | `Consulta Pública / Buscador`, `Trámite Transaccional` |
| `facilitacion-de-comercio` | 2 | **TIPO-1** | `Guía Informativa / Texto`, `Trámite / Aplicativo en Línea` |
| `consulta-del-estado-o-actuaciones-de` | 7 | **TIPO-2** | `Consulta Pública / Buscador`, `Guía Informativa / Texto` |
| `puestos-de-control-interinstitucional-pci` | 2 | **TIPO-4** | `Guía Informativa / Texto`, `Guía de Requisitos y Pasos` |
| `union-aduanera` | 2 | **TIPO-1** | `Guía Informativa / Texto`, `Guía de Requisitos y Pasos` |
| `importacion-y-exportacion-menor-con-declaracion` | 3 | **TIPO-1** | `Guía Informativa / Texto`, `Trámite Transaccional` |
| `recepcion-de-seguro-de-caucion-importacion-y` | 6 | **TIPO-1** | `Guía de Requisitos y Pasos`, `Trámite / Aplicativo en Línea`, `Trámite Transaccional` |
| `franquicias-electronicas` | 3 | **TIPO-1** | `Guía Informativa / Texto`, `Trámite / Aplicativo en Línea`, `Trámite Transaccional` |
| `declaracion-jurada-regional-de-viajero` | 2 | **TIPO-3** | `Trámite / Aplicativo en Línea`, `Trámite Transaccional` |
| `solicitud-de-renovacion-de-auxiliares-de-la` | 4 | **TIPO-1** | `Guía de Requisitos y Pasos`, `Trámite / Aplicativo en Línea` |
| `procedimientos-aduanas--carne-auxiliares-funcion` | 4 | **TIPO-3** | `Guía Informativa / Texto`, `Recurso / Software Descargable` |
| `temas-aduaneros` | 6 | **TIPO-6** | `Guía Informativa / Texto`, `Normativa y Criterio Legal` |
| `procedimientos-aduanas--administrativos-aduanas` | 5 | **TIPO-3** | `Guía Informativa / Texto`, `Multimedia / Video e Infografía` |
| `sanciones-aplicables-a-la-importacion` | 2 | **TIPO-1** | `Guía Informativa / Texto`, `Multimedia / Video e Infografía` |
| `sistema-de-cobro-por-permanencia` | 2 | **TIPO-2** | `Trámite / Aplicativo en Línea`, `Trámite Transaccional` |
| `registro-ampliacion-atc` | 3 | **TIPO-1** | `Guía de Requisitos y Pasos`, `Trámite / Aplicativo en Línea` |
| `registro-atc-terrestre` | 3 | **TIPO-2** | `Consulta Pública / Buscador`, `Guía de Requisitos y Pasos`, `Trámite / Aplicativo en Línea` |
| `habilitacion-emision-cais` | 2 | **TIPO-1** | `Guía Informativa / Texto`, `Trámite Transaccional` |

## 6. Destinos con Fragmento `#ancla` (15)

| Slug | Ola | Arquetipo | URL Destino |
| :--- | :--- | :---: | :--- |
| `componente-procesos-importacion--conceptos-generales` | OLA-3 | TIPO-1 | https://portal.sat.gob.gt/portal/programa-miad/componente-procesos/importacion/#1623281268015-fb939ea7-9dfb |
| `procedimientos-aduanas--manual-operativo-aduana-sin` | OLA-1 | TIPO-3 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1555105635499-a4507e58-10e9 |
| `consultas-aduanas--monitoreo-historico` | OLA-3 | TIPO-1 | https://portal.sat.gob.gt/portal/consultas-aduanas/#1507054761278-36cb86bc-8c2d:~:text=Monitoreo%20Hist%C3%B3rico%20de%20Selectivo%20en%20Aduanas |
| `alza-e-importacion-vehiculos--alza-importacion-vehiculos` | OLA-3 | TIPO-1 | https://portal.sat.gob.gt/portal/alza-e-importacion-vehiculos/#1510763502627-ec3a24b4-76f4 |
| `procedimientos-aduanas--manuales-guias-normativas` | OLA-1 | TIPO-3 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1570052747713-e3285271-1d9c |
| `manual-de-procedimientos-de-la-intendencia-de--autorizacion-registro` | OLA-4 | TIPO-1 | https://portal.sat.gob.gt/portal/manual-de-procedimientos-de-la-intendencia-de-aduanas/#1604422245409-426e1795-7cff |
| `procedimientos-aduanas--carne-auxiliares-funcion` | OLA-1 | TIPO-3 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1570112086149-de895ac7-a87c |
| `procedimientos-aduanas--importacion-software` | OLA-4 | TIPO-1 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1767131417221-467c5ac0-037e |
| `procedimientos-aduanas--administrativos-aduanas` | OLA-1 | TIPO-3 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1570112033454-be3581a4-383a |
| `procedimientos-aduanas--instructivos-manuales-guias` | OLA-1 | TIPO-3 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1571412473853-2ed0b43f-287f |
| `facilitacion-de-comercio--declaracion-anticipada` | OLA-4 | TIPO-1 | https://portal.sat.gob.gt/portal/facilitacion-de-comercio/#1559325573466-1284efd5-2d1b |
| `temas-aduaneros--preguntas-frecuentes` | OLA-2 | TIPO-6 | https://portal.sat.gob.gt/portal/preguntas-frecuentes/temas-aduaneros/#1712605945521-99fc8631-e7ff |
| `procedimientos-aduanas--obligaciones-decreto-29-89` | OLA-2 | TIPO-5 | https://portal.sat.gob.gt/portal/procedimientos-aduanas/#1774965265742-b33a96d6-e1b8 |
| `manual-de-procedimientos-de-la-intendencia-de--aduanero-traslado` | OLA-4 | TIPO-1 | https://portal.sat.gob.gt/portal/manual-de-procedimientos-de-la-intendencia-de-aduanas/#1604422422212-34e75916-0886 |
| `consultas-aduanas--monitoreo-sistemas` | PAUSA | TIPO-2 | https://portal.sat.gob.gt/portal/consultas-aduanas/#1507054605628-6418edea-e908 |

## 7. Avance de Maquila Sincronizado

- **URLs únicas de la matriz con maquila completada:** `89` / `120`
- **Subpáginas derivadas detectadas en lotes compilados:** `0`

| Estado Maquila | URLs Únicas |
| :--- | :---: |
| Maquilado (ola-1) | 14 |
| Maquilado (ola-2) | 26 |
| Maquilado (ola-3) | 22 |
| Maquilado (ola-4) | 27 |
| Pausa (LC=True) | 31 |
