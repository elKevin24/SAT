# Auditoría de Arquitectura de Información — Portal SAT Guatemala
**Foco:** Estructura de navegación N1–N5, densidad, clics pasarela, ciclo ATO, compactación y lenguaje ciudadano  
**Fuente primaria:** `src/data/allTramites.json` (715 trámites) + `database/arbol_navegacion.json` (239 nodos)  
**Fecha de análisis:** Octubre 2026

---

## 1. Resumen Ejecutivo

| Severidad | Hallazgo | Regla violada | Trámites afectados |
|-----------|----------|--------------|-------------------|
| 🔴 Crítico | N4 "Autorizaciones, consultas y requisitos" con 68 trámites — 48× el umbral de Miller | Regla 2 (Miller ≥11) | 68 (9.5% catálogo) |
| 🔴 Crítico | 4 clics pasarela estructurales (nodos N2/N3 con 1 solo hijo) | Regla 4 (Zero pass-through) | 4 nodos |
| 🔴 Crítico | N3 "Declaraciones y Pagos" tiene 21 hijos N4 (2× umbral máximo) en arbol_navegacion | Regla 2 | 21 nodos hijo |
| 🟠 Mayor | 13 N3-folders con ≥11 trámites terminales exigen partición modular obligatoria | Regla 2 | 13 carpetas, ~400 trámites |
| 🟠 Mayor | 14 folders con violaciones del ciclo ATO (orden modificar_cerrar antes de empezar) | Regla 7 | 14 carpetas |
| 🟠 Mayor | 27 nodos sub-densos (≤3 hijos) en árbol — pantallas casi vacías | Regla 3 | 27 nodos |
| 🟡 Medio | N4 "Cultura tributaria y capacitación" duplica exactamente el N3 (pasarela temática) | Regla 4 | 58 trámites |
| 🟡 Medio | 21 títulos duplicados exactos dentro del mismo folder | Regla 10 | 21 pares |
| 🟡 Medio | 171 títulos con acrónimos sin contexto (IVA, ISR, RTU, AFPA, DUCA…) | Regla 10 | 171 |
| 🟡 Medio | 5 folders con `orden_contenido` duplicado entre hermanos | Regla 7 | 5 carpetas |
| ⚪ Menor | Profundidad promedio 3.71 clics — margen correcto, pero 77 trámites llegan a 5 clics | Regla 4 | 77 |
| ⚪ Menor | N3 "ZDEEP" con dos N4 de exactamente 15 trámites cada uno (simetría artificial) | Regla 2, 5 | 30 |

---

## 2. Mapa del Árbol — Estado Actual

### Árbol estructural (`arbol_navegacion.json`)

| Nivel | Total nodos | Nodos hoja (sin hijos) |
|-------|-------------|------------------------|
| N1 | 4 | 0 |
| N2 | 20 | 1 (OEA) |
| N3 | 58 | 29 |
| N4 | 157 | 157 (todos hoja en árbol) |
| **Total** | **239** | **187** |

### Trámites terminales por N1 × N2

| N1 | N2 | N3 count | Trámites | Prof. máx. | Nota |
|----|----|----------|----------|------------|------|
| Contribuyentes | Sin Obligaciones | 1 (compactado a `—`) | 10 | 2 | Pasarela N2→N3 |
| Contribuyentes | Pequeños Contribuyentes | 2 | 22 | 4 | Sub-denso |
| Contribuyentes | **Contribuyente General** | **8** | **298** | **5** | **42% del catálogo** |
| Contribuyentes | Contribuyentes Especiales | 3 | 14 | 3 | Sub-denso; pasarela |
| Comercio Exterior | Importadores | 5 | 54 | 4 | OK |
| Comercio Exterior | Exportadores | 3 | 21 | 4 | Sub-denso |
| Comercio Exterior | OEA | 0 (nodo hoja) | 2 | 2 | Pasarela extrema |
| Comercio Exterior | AFPA | 5 | 76 | 4 | N4 sobrecarga |
| Comercio Exterior | Regímenes Territoriales | 2 | 42 | 4 | Sub-denso N2 |
| Comercio Exterior | Normativa Aduanera General | 5 | 50 | 4 | OK |
| Profesionales | Abogados y Notarios | 4 | 18 | 3 | OK |
| Profesionales | Peritos Contadores | 2 | 11 | 3 | Sub-denso |
| Profesionales | Auditores | 2 | 4 | 3 | Sub-denso |
| Profesionales | Gestores Tributarios | 2 | 8 | 3 | Sub-denso |
| Profesionales | Servicios Profesionales | 4 | 6 | 3 | 4 N3s sub-densos |
| Entes Exentos | Entidades del Estado | 4 | 26 | 3 | OK |
| Entes Exentos | Constitucionales | 3 | 18 | 3 | Sub-denso |
| Entes Exentos | No Lucrativos | 2 | 14 | 3 | Sub-denso |
| Entes Exentos | Municipalidades | 1 (compactado a `—`) | 5 | 2 | Pasarela N2→N3 |
| Entes Exentos | Decreto | 3 | 16 | 3 | Sub-denso |

### Distribución de profundidad de trámites terminales

| Profundidad | Trámites | % |
|-------------|----------|---|
| 2 clics (N2) | 17 | 2.4% |
| 3 clics (N3) | 249 | 34.8% |
| 4 clics (N4) | 372 | 52.0% |
| 5 clics (N5) | 77 | 10.8% |
| **Promedio** | **3.71** | — |

---

## 3. Hallazgos Críticos 🔴

### 3.1 N4 "Autorizaciones, consultas y requisitos" — Sobrecarga extrema: 68 trámites terminales

**Ruta:** Contribuyentes > Contribuyente General > Vehículos (como propietario) > Autorizaciones, consultas y requisitos

Este nodo N4 acumula **68 trámites** (9.5% del catálogo completo) en una sola pantalla de lista. No existe un nivel N5 clasificado: todos los 68 ítems llegan con `nivel5 = "—"`. El ciudadano que busca cualquier gestión vehicular de Contribuyente General aterriza en una lista de 68 tarjetas sin subdivisión alguna.

**Evidencia exacta:**
```
N4="Autorizaciones, consultas y requisitos": 68 tramites (todos con N5=—)
Total N3 "Vehículos (como propietario)": 80 tramites
  N4="Autorizaciones, consultas y requisitos": 68 (85% de vehículos)
  N4="Modificaciones y rectificaciones":        5
  N4="Inscripción, distintivos y placas":        4
  N4="Impuesto de circulación (ISCV) y valores": 2
  N4="Traspasos de vehículos":                   1
```

El nombre "Autorizaciones, consultas y requisitos" es un catch-all que viola el principio de agrupación homogénea. Los 68 ítems incluyen inscripciones, traspasos, actas, multas, distintivos, permisos turísticos, etc. La partición en N5 temas coherentes es obligatoria (Regla 2).

### 3.2 Cuatro clics pasarela estructurales (nodos monocatenarios en árbol)

Los siguientes nodos tienen **exactamente 1 hijo** en `arbol_navegacion.json`, generando un clic inútil antes de llegar a contenido real:

| Nodo pasarela | Nivel | Único hijo | Trámites bajo él |
|---------------|-------|------------|-----------------|
| Sin Obligaciones de Impuestos | N2 | Asalariados, Compradores de Bienes y Residentes en el Extranjero (N3) | 10 |
| Contribuyentes Especiales | N2 | Grandes y Medianos Contribuyentes (N3) | 14 |
| Municipalidades | N2 | Gestión Tributaria y Patrimonio Municipal (N3) | 5 |
| Maquilas (Decreto 29-89) | N3 | Fomento a la Exportación y Maquila (N4) | 12 |

Todos violan la Regla 4 (Zero Pass-through Clicks). El N2 actúa como simple rótulo de sección, no como una decisión real entre alternativas.

**Casos de máxima gravedad:**
- **OEA (Operador Económico Autorizado):** N2 con 0 hijos en árbol, solo 2 trámites terminales con N3=`—`. No hay nodo intermedio — el N2 es directamente un folder de contenido. Arquitectura inconsistente respecto al resto.
- **Sin Obligaciones → Asalariados…:** El ciudadano hace clic en "Sin Obligaciones de Impuestos" y la única opción siguiente es "Asalariados, Compradores de Bienes y Residentes en el Extranjero". Si la población objetivo es exactamente esa, el nivel N2 no aporta ninguna decisión de filtrado.

### 3.3 N3 "Declaraciones y Pagos" con 21 hijos N4 en árbol — 2× el umbral de sobrecarga

**Ruta árbol:** contribuyentes/regimen-general/declaraciones-y-pagos  
**Conteo:** 21 nodos N4 hijos directos.

Adicionalmente en el mismo N2 "Régimen General":
- "RTU Digital y Agencia Virtual": **16 hijos N4**
- "Servicios al Contribuyente": **14 hijos N4**

Estas tres N3 del pilar Contribuyentes concentran 51 de los 157 nodos N4 del árbol (32%), pero en `allTramites.json` sus trámites están asignados bajo N2="Contribuyente General" con N3 distintos, creando una divergencia entre la estructura del árbol y la asignación de trámites (coherencia estructural N2-vs-árbol).

---

## 4. Hallazgos Mayores 🟠

### 4.1 13 N3-folders con ≥11 trámites terminales — Partición obligatoria

Según la Regla 2, toda lista de ≥11 elementos **debe** modularse. Los siguientes folders superan el umbral:

| Folder (N2 > N3) | Trámites terminales | N4 hijos |
|-----------------|---------------------|---------|
| Contribuyente General > **Vehículos (como propietario)** | 80 | 5 (pero 1 con 68 items) |
| Contribuyente General > **Cultura tributaria y capacitación** | 58 | 10 |
| Contribuyente General > **Inscripción y actualización en el RTU** | 52 | 4 |
| Contribuyente General > **Servicios y gestiones al contribuyente** | 50 | 8 |
| AFPA > **Depósitos Aduaneros** | 36 | 3 |
| Regímenes Territoriales > **ZDEEP** | 30 | 2 |
| Contribuyente General > **Devoluciones y créditos fiscales** | 20 | 3 |
| Normativa Aduanera > **Modernización e Infraestructura Aduanera** | 18 | 3 |
| Contribuyente General > **Facturación electrónica** | 17 | — (N4 sí existe en árbol) |
| AFPA > **Apoderados Especiales Aduaneros** | 16 | 3 |
| Importadores > **Despacho Aduanero, Levante y Selectivo** | 16 | 3 |
| Pequeños Contribuyentes > **Régimen de Pequeño Contribuyente** | 14 | 6 |
| AFPA > **Transportistas Aduaneros** | 14 | 5 |

**Nota crítica:** Los folders de Contribuyente General (Vehículos, Cultura, Inscripción, Servicios) **tienen** N4 hijos en el árbol, pero en `allTramites.json` la mayoría de trámites se asignan directamente al N3 con `nivel4=—` o con valores que no correlacionan 1:1 con el árbol. Esto sugiere que el árbol fue diseñado correctamente pero la asignación de trámites no siguió la granularidad definida.

### 4.2 14 folders con violaciones del ciclo ATO

Los siguientes folders presentan al menos un trámite con `etapaAto` de menor valor numérico (ej. `empezar=1`) apareciendo **después** en `orden_contenido` que trámites de mayor valor (ej. `modificar_cerrar=4`):

1. Contribuyente General > Cultura tributaria y capacitación
2. Contribuyente General > Declaraciones, pagos y solvencias
3. Contribuyente General > Devoluciones y créditos fiscales
4. Contribuyente General > Inscripción y actualización en el RTU
5. Contribuyente General > Regímenes tributarios
6. Contribuyente General > Servicios y gestiones al contribuyente
7. **Contribuyente General > Vehículos (como propietario)** — caso más grave
8. Importadores > Declaraciones Aduaneras y DUCAs
9. Importadores > Despacho Aduanero, Levante y Selectivo
10. Importadores > Importación y Nacionalización de Vehículos
11. Importadores > Mercancías en Abandono, Depósitos y Franquicias
12. AFPA > Apoderados Especiales Aduaneros
13. AFPA > Depósitos Aduaneros
14. AFPA > Transportistas Aduaneros

**Caso más grave — Vehículos (como propietario):**
```
N4="Traspasos de vehículos":
  oc=1  [modificar_cerrar] SAT-GES-0232 "Cambiar características del vehículo"
  oc=1  [operar]           SAT-GES-0318 "Traspaso de vehículos por notario"
  oc=2  [empezar]          SAT-GES-0260 "Inscribir un vehículo"
```
El primer trámite visible es una modificación/cierre; el trámite de inicio (inscripción) aparece en posición 2. El ciclo empieza por el medio.

**Caso adicional — Importadores > Importación de Vehículos:**
```
oc=4  [operar]    SAT-GES-0382 "Información sobre documentos para ingresar vehículos"
oc=4  [consultar] SAT-GES-0377 "Consultar tablas de valores" 
```
Duplicado de `orden_contenido=4` dentro del mismo folder.

### 4.3 27 nodos sub-densos (≤3 hijos) en árbol estructural

De los 52 nodos con hijos en el árbol, 27 (52%) tienen ≤3 hijos — generan pantallas casi vacías:

**Sub-densos con 1 solo hijo (pasarelas):** Sin Obligaciones de Impuestos, Contribuyentes Especiales, Municipalidades, Maquilas (Decreto 29-89) → ya cubiertos en §3.2.

**Sub-densos con 2 hijos (nivel N2):**
- Pequeños Contribuyentes: 2 N3 hijos (OK por tamaño, pero limítrofe)
- Facturación Electrónica (FEL): 2 N4 hijos (6 trámites en 2 opciones)
- Importación y Nacionalización de Vehículos: 2 N4 hijos (10 trámites)
- Mercancías en Abandono, Depósitos y Franquicias: 2 N4 hijos (9 trámites)
- Declaraciones Aduaneras y Embarques: 2 N4 hijos (4 trámites)
- Regímenes Territoriales y Zonas Especiales: 2 N3 hijos (42 trámites — asimetría 30:12)
- ZDEEP: 2 N4 hijos (exactamente 15:15 — simetría artificial sospechosa)
- Prevención de Contrabando y Defraudación: 2 N4 hijos (3 trámites)
- Auditores: 2 N3 hijos (4 trámites totales)
- Gestores Tributarios: 2 N3 hijos (8 trámites)
- No Lucrativos: 2 N3 hijos (14 trámites — compactable al N2)
- Peritos Contadores: 2 N3 hijos (11 trámites)

---

## 5. Hallazgos Medios 🟡

### 5.1 Pasarela temática N4=N3 en "Cultura tributaria y capacitación"

En `allTramites.json`, 16 de los 58 trámites de Cultura tributaria tienen `nivel4 = "Cultura tributaria y capacitación"` (idéntico al N3), lo que genera un nivel N4 que repite exactamente el nombre del N3. Esto es un clic pasarela disfrazado de profundidad: el ciudadano hace clic en "Cultura tributaria y capacitación" y llega a otra pantalla llamada "Cultura tributaria y capacitación".

**Adicionalmente**, esta carpeta tiene 10 N4 subcategorías:
```
N4="Cursos por impuesto": 18 tramites
N4="Cursos de herramientas y gestiones": 10 tramites
N4="Calendario y modalidades": 9 tramites
N4="—": 5 tramites (flotantes sin clasificar)
N4="Preguntas frecuentes": 4 tramites
N4="Biblioteca virtual y descargas": 3 tramites
N4="Programas de cultura tributaria": 3 tramites
N4="Cursos por tipo de contribuyente": 2 tramites
N4="Información institucional": 2 tramites
N4="Leyes y normativa": 2 tramites
```
Tanto la sobrecarga (58 terminales) como la duplicación de título son señales de que esta carpeta necesita reorganización.

### 5.2 Duplicados de títulos exactos dentro del mismo folder

| Folder | Título duplicado | Instancias |
|--------|------------------|-----------|
| Contribuyente General > Cultura tributaria | "Presentaciones virtuales" | ×2 (SAT-GES-0092, SAT-GES-0685) |
| Contribuyente General > Cultura tributaria | "Curso: rentas y ganancias de capital" | ×2 |
| Contribuyente General > Devoluciones | "Devolución del impuesto de herencias, legados y donaciones" | ×2 |
| Pequeños Contribuyentes > Régimen | "Curso: Régimen Electrónico de Pequeño Contribuyente" | ×2 |
| **AFPA > Depósitos Aduaneros** | "Recepción de seguro de caución y pólizas de garantía operativa" | ×2 |
| AFPA > Depósitos Aduaneros | "Auxiliares de la función pública aduanera (Carné, ActiveX PKI/DUA)" | ×2 |
| AFPA > Depósitos Aduaneros | "Requisitos para renovación de operaciones de auxiliares aduaneros" | ×2 |
| AFPA > Depósitos Aduaneros | "Guías operativas e instructivos aduaneros" | ×2 |
| AFPA > Depósitos Aduaneros | "Programa de modernización integral aduanera MIAD" | ×2 |
| AFPA > Depósitos Aduaneros | "Declaración de mercancías (DUCA y aduana sin papeles)" | ×2 |
| AFPA > Depósitos Aduaneros | "Requisitos para consulta de expedientes de gestión aduanera" | ×2 |
| AFPA > Depósitos Aduaneros | "Capacitaciones y programas de formación" | ×2 |
| AFPA > Depósitos Aduaneros | "Preguntas frecuentes sobre operaciones aduaneras" | ×2 |
| AFPA > Depósitos Aduaneros | "Procedimientos administrativos de aduanas, sanciones y recursos" | ×2 |
| ZDEEP | "Guías operativas e instructivos aduaneros (para RTZE)" | ×2 |
| ZDEEP | "Requisitos para consulta de expedientes de gestión aduanera (para RTZE)" | ×2 |
| ZDEEP | "Procedimientos administrativos de aduanas, sanciones y recursos (para RTZE)" | ×2 |

El folder **AFPA > Depósitos Aduaneros** es el más afectado: 10 títulos duplicados exactos. El patrón indica que los ítems de AGD (Almacenes Generales de Depósito) y DAT (Depósitos Aduaneros Temporales) fueron clonados sin diferenciación de título, generando el efecto de "tarjetas idénticas" denunciado por el análisis previo. El ciudadano ve 10 pares de tarjetas indistinguibles.

### 5.3 171 títulos con acrónimos sin contexto

| Acrónimo | Títulos afectados | Ejemplo problemático |
|----------|-------------------|---------------------|
| SAT | 31 | "Requisitos, pasos y documentos para descargar aplicaciones de la SAT." |
| IVA | 31 | "Consultar constancias de retención del IVA e ISR recibidas" |
| RTU | 24 | "Requisitos, pasos y documentos para autorizar a otra persona para gestiones del RTU." |
| AFPA | 23 | "Auxiliares de la función pública aduanera (Carné, componente ActiveX PKI/DUA)" |
| ISR | 20 | "Devolución del ISR retenido al pequeño contribuyente" |
| NIT | 16 | "Agendar cita para obtener tu NIT" |
| DUCA | 13 | "Declaración de mercancías (DUCA y aduana sin papeles)" |
| FEL | 8 | "Curso: LET para pequeño contribuyente" |
| ZDEEP | 6 | "Empresas Usuarias Calificadas ZDEEP" |

NIT, IVA, ISR y RTU son acrónimos ya familiarizados en el contexto guatemalteco, por lo que no todos requieren expansión. Sin embargo, AFPA, DUCA, ZDEEP y OEA son técnicos y deben expandirse en el título o subtítulo del trámite (Plain Language, Regla 10).

### 5.4 Cinco folders con `orden_contenido` duplicado entre hermanos

| Folder | Valores duplicados | IDs afectados |
|--------|-------------------|--------------|
| Cultura tributaria > Programas de cultura tributaria | oc=1 ×2 | SAT-GES-0095, SAT-GES-0161 |
| Cultura tributaria > — (flotantes) | oc=1 ×5 | SAT-GES-0222, 0223, 0224 + 2 más |
| Contribuyente General > Vehículos > Traspasos | oc=1 ×2 | SAT-GES-0232 (modificar_cerrar), SAT-GES-0318 (operar) |
| Importadores > Importación Vehículos > Tablas valores | oc=4 ×2 | SAT-GES-0382, SAT-GES-0377 |
| Importadores > Mercancías en Abandono | varios | múltiples |

El caso de los 5 ítems flotantes (N3 y N4 = `—`) con `orden_contenido=1` es especialmente indicativo: son trámites sin clasificar correctamente que colisionan todos en posición 1.

---

## 6. Hallazgos Menores ⚪

### 6.1 77 trámites a 5 clics (10.8% del catálogo)

Todos los 77 trámites en profundidad 5 pertenecen a **Contribuyente General** (N1>N2>N3>N4>N5). Su breadcrumb tipo:
```
Contribuyentes > Contribuyente General > Cultura tributaria y capacitación > 
Cultura tributaria y capacitación > Calendario y modalidades
```
El N5 adicional agrega valor de clasificación (ej. "Calendario y modalidades", "Programas de cultura tributaria"), pero el hecho de que N4 repita el nombre de N3 en 16 casos crea confusión de profundidad sin beneficio real.

**Trámite más profundo (N5 real):** SAT-GES-0161 "Proyección educativa"  
Ruta: Contribuyentes > CG > Cultura tributaria > **Programas de cultura tributaria** > Proyección educativa

### 6.2 Asimetría extrema de ramificación dentro del mismo N1

El N1 "Contribuyentes" muestra una asimetría severa:
- "Sin Obligaciones" → 1 N3 → 10 trámites (profundidad 2–3)
- "Pequeños Contribuyentes" → 2 N3 → 22 trámites (profundidad 3–4)
- **"Contribuyente General" → 8 N3 → 298 trámites (profundidad 3–5)**
- "Contribuyentes Especiales" → 1 N3 → 14 trámites (profundidad 3)

Un ciudadano en N1 "Contribuyentes" elige entre 4 opciones que esconden catálogos de 10, 22, **298** y 14 trámites respectivamente. La sobrecarga de Contribuyente General no es visible desde N2; la asimetría 298:10 viola el principio de carga cognitiva homogénea entre hermanos.

### 6.3 ZDEEP: dos N4 de exactamente 15:15 — simetría artificial

```
N4="Empresas Usuarias Calificadas ZDEEP": 15 tramites
N4="Entidades Administradoras ZDEEP":     15 tramites
```
La simetría perfecta (15:15) sugiere que los trámites fueron distribuidos en dos grupos de igual tamaño por conveniencia administrativa, no por agrupación temática natural. Ambos N4 superan el rango óptimo (≥11 exige partición). Además, 3 títulos están duplicados entre ambos grupos.

### 6.4 Sub-densidad extrema en Servicios Profesionales

Los 4 N3 de "Servicios Profesionales" tienen 1, 1, 2 y 2 trámites:
```
N3="Actualización de Actividad y RTU":    1 tramite
N3="Facturación por Honorarios y Formularios": 1 tramite
N3="Consultas Jurídico Tributarias":      2 tramites
N3="Sistemas de Retención y Cumplimiento": 2 tramites
```
Un ciudadano ve 4 "carpetas" que al abrirse tienen 1–2 tarjetas. Deben compactarse todos al nivel N2 (Regla 3: ≤3 hojas terminales → compactar).

### 6.5 OEA como N2 prácticamente vacío

El N2 "Operador Económico Autorizado (OEA)" tiene:
- 0 hijos en `arbol_navegacion.json` (es nodo hoja en el árbol estructural)
- 2 trámites terminales en `allTramites.json` con `nivel3=—`, `nivel4=—`

Es la única N2 que funciona directamente como folder de contenido sin ninguna clasificación intermedia. Arquitectónicamente es correcta (aplica compactación con guion `—`) pero inconsistente con el resto del árbol donde incluso los N2 pequeños tienen al menos un N3 nominal.

---

## 7. Matriz de Priorización

| ID | Hallazgo | Impacto UX | Esfuerzo | Bloquea | Prerequisito |
|----|---------|-----------|---------|---------|-------------|
| IA-01 | N4 "Autorizaciones…" con 68 ítems | 🔴 Crítico | Alto | IA-03 | — |
| IA-02 | 4 clics pasarela estructurales | 🔴 Crítico | Medio | — | — |
| IA-03 | N3 Vehículos: asignación de trámites no sigue el árbol | 🔴 Crítico | Alto | IA-01 | Mapa de trámites a N4/N5 |
| IA-04 | 13 N3-folders con ≥11 trámites | 🟠 Mayor | Alto | — | IA-01 (parcial) |
| IA-05 | 14 folders con violación ciclo ATO | 🟠 Mayor | Medio | — | — |
| IA-06 | 27 nodos sub-densos en árbol | 🟠 Mayor | Medio | IA-02 | IA-02 |
| IA-07 | N4=N3 en Cultura tributaria (pasarela temática) | 🟡 Medio | Bajo | — | IA-04 |
| IA-08 | 21 duplicados de título exacto en mismo folder | 🟡 Medio | Bajo | — | IA-04 |
| IA-09 | 171 acrónimos sin contexto en títulos | 🟡 Medio | Medio | — | IA-08 |
| IA-10 | 5 folders con `orden_contenido` duplicado | 🟡 Medio | Bajo | — | — |
| IA-11 | 77 trámites a 5 clics | ⚪ Menor | Bajo | — | IA-07 |
| IA-12 | Asimetría 298:10:22:14 en N1 Contribuyentes | ⚪ Menor | Alto | — | IA-04 |
| IA-13 | Servicios Profesionales: 4 carpetas de 1–2 ítems | ⚪ Menor | Bajo | — | IA-06 |

---

## 8. Recomendaciones — Acciones Concretas Ordenadas por Prerequisito

### Nivel 1: Correcciones de estructura (prerequisito para todo lo demás)

**R1 — Eliminar clics pasarela (IA-02)**  
- **Sin Obligaciones de Impuestos** → absorber el único N3 "Asalariados, Compradores de Bienes y Residentes en el Extranjero" al nivel N2. El N3 pasa a ser el contenido directo del N2.  
- **Contribuyentes Especiales** → lo mismo: el único N3 "Grandes y Medianos Contribuyentes" asciende al N2.  
- **Municipalidades** → compactar N3 "Gestión Tributaria y Patrimonio Municipal" al N2 (5 trámites, Regla 3).  
- **Maquilas (Decreto 29-89)** → compactar N4 "Fomento a la Exportación y Maquila" al N3.

**R2 — Reclasificar trámites flotantes (N3/N4 = `—`) (IA-10)**  
Los 5 trámites en Cultura tributaria con `nivel3=—`, `nivel4=—` y `orden_contenido=1` deben asignarse a uno de los 10 N4 existentes o crear un N4 "Otros recursos de capacitación" que los agrupe.

### Nivel 2: Partición obligatoria de carpetas sobrecargadas (IA-01, IA-04)

**R3 — Descomponer N4 "Autorizaciones, consultas y requisitos" (68 ítems) (IA-01)**  
Esta es la corrección de mayor impacto. Los 68 trámites vehiculares deben organizarse en N5 temáticos coherentes con el ciclo ATO. Propuesta de módulos:
- Inscripción y primeras placas (empezar)
- Impuesto de circulación (ISCV) (operar)
- Traspasos y compraventas (operar)
- Distintivos, tarjetas y placas (operar)
- Consultas y autorizaciones (consultar)
- Modificaciones y rectificaciones (modificar_cerrar)

**R4 — Particionar N3 "Cultura tributaria" (58 ítems, 10 N4s) (IA-07)**  
Consolidar los 10 N4 en ≤5 grupos temáticos homogéneos y eliminar el N4 que repite el nombre N3. El N4=`—` (5 ítems) debe asignarse a alguno de los grupos resultantes.

**R5 — Particionar N3 "Inscripción y actualización en el RTU" (52 ítems, 4 N4s)** — ya tiene estructura N4 correcta (4 módulos de 7–20 ítems); revisar que los trámites estén correctamente asignados en `allTramites.json`.

**R6 — Particionar N3 "Servicios y gestiones al contribuyente" (50 ítems, 8 N4s)** — 19 trámites tienen `nivel4=—`; deben clasificarse en los 7 N4 existentes.

**R7 — Descomponer AFPA > Depósitos Aduaneros (36 ítems, 3 N4s)** — los duplicados de título entre AGD y DAT deben resolverse asignando cada ítem a su depositario correcto con título diferenciado.

### Nivel 3: Ciclo ATO (IA-05)

**R8 — Reordenar `orden_contenido` en 14 folders** siguiendo la secuencia canónica:  
1 = empezar → 2 = operar → 3 = consultar → 4 = modificar_cerrar → 5 = normativa.  
Prioridad: Vehículos > Traspasos (tiene `modificar_cerrar` en posición 1 antes de `empezar`). Corrección: SAT-GES-0260 "Inscribir un vehículo" debe tener `orden_contenido=1`.

### Nivel 4: Lenguaje ciudadano y títulos (IA-08, IA-09)

**R9 — Eliminar 21 títulos duplicados exactos dentro de folders**  
- AFPA > Depósitos Aduaneros: los 10 pares de duplicados deben diferenciarse con el tipo de depósito en el título (DAT vs. AGD) o consolidarse en un único ítem con URL que cubra ambos.
- ZDEEP: los 3 pares de duplicados deben diferenciarse (Empresa Usuaria vs. Entidad Administradora).

**R10 — Expandir acrónimos técnicos en títulos de trámites de audiencias específicas**  
AFPA, DUCA, ZDEEP, OEA: añadir expansión entre paréntesis o en el campo `descripcion` para cumplir Plain Language (Regla 10). NIT, IVA, ISR pueden mantenerse como abreviaturas reconocidas.

### Nivel 5: Compactaciones de sub-densidad (IA-06, IA-13)

**R11 — Compactar Servicios Profesionales** (4 N3 con 1–2 ítems cada uno) al N2 directo, con `nivel3=—`. Los 6 trámites quedan directamente bajo N2="Servicios Profesionales".

**R12 — Compactar Auditores** (2 N3 con 2 ítems cada uno = 4 trámites totales) al N2. Un folder de 4 ítems no necesita subdivisión.

**R13 — Evaluar fusión de No Lucrativos** (2 N3: Inscripción 10 + Exenciones 4): el N3 de 4 ítems está en el límite inferior; si los 4 trámites de "Exenciones CIVA" son temáticamente distintos de los 10 de "Inscripción", se preserva la división. Si son parte del ciclo ATO de la misma audiencia, se compactan.

---

## 9. Notas metodológicas

- Toda la evidencia proviene de `src/data/allTramites.json` (715 registros) y `database/arbol_navegacion.json` (239 nodos).
- Las profundidades se calculan sobre los campos `nivel1`–`nivel5` del JSON, excluyendo valores `—` o que repiten el nivel padre.
- El ciclo ATO se evalúa sobre `etapaAto` × `orden_contenido` dentro de cada folder (N1+N2+N3+N4).
- La densidad de nodos en el árbol se mide sobre hijos directos; la densidad de trámites terminales se mide sobre el total de ítems con ese prefijo de ruta.
- Scripts de análisis en `.agents/analyze_ia_temp.py`, `.agents/analyze_ia_deep.py`, `.agents/analyze_ato_detail.py`, `.agents/analyze_language.py` (solo lectura, no modifican datos).
