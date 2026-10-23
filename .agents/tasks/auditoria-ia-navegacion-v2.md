# Re-Auditoría de Arquitectura de Información — Portal SAT Guatemala (v2)
**Tipo:** Re-auditoría post-implementación  
**Fuentes:** `src/data/allTramites.json` (714 gestiones) · `database/arbol_navegacion.json` (171 nodos) · `src/data/categoryOrder.ts`  
**Auditoría anterior:** `.agents/tasks/auditoria-ia-navegacion.md` (715 gestiones, 239 nodos)  
**Fecha:** Auditoría v2

---

## 1. Resumen de Cambios

| ID | Hallazgo (v1) | Estado anterior | Estado actual | Veredicto |
|----|---------------|----------------|---------------|-----------|
| IA-01 | N4 "Autorizaciones" con 68 ítems | 68 en flat | 16 con 3 grupos N5 | 🔶 Parcial |
| IA-02 | 4 clics pasarela estructurales | 4 nodos monocatenarios | 0 nodos monocatenarios | ✅ Resuelto |
| IA-03 | N3 "Declaraciones y Pagos" con 21 hijos N4 en árbol | 21 N4 en árbol | 3 N4 hijos, 13 gestiones totales | ✅ Resuelto |
| IA-04 | 13 N3-folders con ≥11 gestiones | 13 carpetas | 16 carpetas (3 nuevas) | ❌ Empeoró |
| IA-05 | 14 folders con ciclo ATO invertido | 14 folders | 0 folders (ATO corregido) | ✅ Resuelto |
| IA-06 | 27 nodos sub-densos en árbol | 27 nodos | 22 nodos sub-densos | 🔶 Parcial |
| IA-07 | N4=N3 en Cultura tributaria (pasarela temática) | 16 registros con N4=N3 | 0 registros con N4=N3 | ✅ Resuelto |
| IA-08 | 21 títulos duplicados exactos en mismo folder | 21 pares (10 en AFPA Depósitos) | 2 pares en mismo folder | ✅ Resuelto (mayor) |
| IA-09 | 171 acrónimos sin contexto | sin expansión | AFPA parcialmente expandido | 🔶 Parcial |
| IA-10 | 5 folders con `orden_contenido` duplicado | 5 folders | 0 duplicados por folder | ✅ Resuelto |
| IA-11 | 77 gestiones a 5 clics (10.8%) | 77 (10.8%), avg 3.71 | 282 (39.5%), avg 4.06 | 🔶 Parcial⁽¹⁾ |
| IA-12 | Asimetría 298:22:14:10 en N1 Contribuyentes | 298:22:14:10 | 298:22:14:10 | ❌ Sin cambio |
| IA-13 | Servicios Profesionales 4 carpetas de 1–2 ítems | 4 N3 con 1–2 ítems | 4 N3 con 1–2 ítems | ❌ Sin cambio |
| — | Schema con sufijos conceptuales (_segmento, _area…) | Presentes en JSON | Eliminados; solo nivel1–5 | ✅ Resuelto |
| — | Legacy fields duplicados | Presentes | Eliminados | ✅ Resuelto |
| 🆕 | N4 con ≥11 gestiones (sobrante de partición) | 1 N4 con 68 (IA-01) | 10 N4 con ≥11 gestiones | 🆕 Nuevo |
| 🆕 | Cultura tributaria: 11 N4 hijos en árbol (>10 tolerancia) | 10 N4 | 11 N4 en árbol | 🆕 Nuevo |
| 🆕 | 14 gestiones globalmente duplicadas en distintos folders | no auditado | 14 títulos en ≥2 folders | 🆕 Nuevo |
| 🆕 | Devoluciones y créditos: 8 flotantes (N4=—) | (sub-set de IA-10) | 8 gestiones sin N4 | 🆕 Nuevo |

> ⁽¹⁾ La profundidad promedio aumentó de 3.71 a 4.06 y los 5 clics pasaron de 10.8% a 39.5%: la partición en N5 añadió profundidad correctamente en algunos casos, pero **generó sobrecarga de N4 en cascada** donde aún no se aplica N5.

---

## 2. Detalle por Hallazgo

### IA-01 — N4 "Autorizaciones, consultas y requisitos" (68 → 16 ítems) 🔶 Parcial

**Estado anterior:** 68 gestiones planas en N4, N5=`—` en todos.  
**Estado actual:**

```
N3 Vehículos (como propietario): 80 gestiones totales
  N4 Autorizaciones, consultas y requisitos: 16
    N5 Requisitos y representantes: 9
    N5 Consultas y verificaciones del vehículo: 4
    N5 Autorizaciones y entidades extranjeras: 3
  N4 Inscripción, distintivos y placas: 19
    N5 Inscripción de vehículos: 6
    N5 Título y tarjeta de circulación: 5
    N5 Placas de circulación: 4
    N5 Placas y tarjetas de distribuidor: 4
  N4 Traspasos de vehículos: 17
    N5 Traspasos en casos especiales: 9
    N5 Traspaso de vehículos: 8
  N4 Bajas, inactivación y reactivación: 11
    N5 Dar de baja (inactivar): 6
    N5 Reactivar (activar): 5
  N4 Impuesto de circulación (ISCV) y valores: 11
    N5 Impuesto de circulación y tablas de valores: 9
    N5 Devoluciones de impuestos de vehículos: 2
  N4 Modificaciones y rectificaciones: 6  (sin N5)
```

**Qué mejoró:** El N4 "Autorizaciones" bajó de 68 a 16 ítems. Se creó estructura N5 en todos los N4 de Vehículos con ≥11 ítems. El catch-all de 68 fue distribuido en 6 N4 temáticos.

**Qué queda pendiente:** Cinco de los seis N4 siguen teniendo ≥11 gestiones y por tanto violan la Regla 2. Cada uno de ellos ahora tiene N5, pero los N4 en sí mismos (16, 17, 19, 11, 11) actúan como carpetas de navegación intermedia con sobrecarga — el usuario llega a un N4 de 17–19 ítems y necesita un clic más para llegar a N5. El N4 "Autorizaciones" con 16 ítems también supera el umbral de 10 (tolerancia máxima).

**Evidencia:** `nivel3="Vehículos (como propietario)"`, N4 counts desde `allTramites.json`.

---

### IA-02 — Clics pasarela estructurales (4 → 0) ✅ Resuelto

**Estado anterior:** 4 nodos monocatenarios: Sin Obligaciones, Contribuyentes Especiales, Municipalidades, Maquilas.  
**Estado actual:** 

```
arbol_navegacion.json — nodos con exactamente 1 hijo: 0
```

Verificación en árbol:
- **Sin Obligaciones** (N2): 0 N3 hijos → compactado con N3=`—`. 10 gestiones directamente bajo N2. ✅
- **Municipalidades** (N2): 0 N3 hijos → compactado con N3=`—`. 5 gestiones. ✅
- **Contribuyentes Especiales** (N2): 3 N3 hijos (Gerencias Especiales: 7, Declaraciones Especiales: 5, Capacitación: 2). ✅
- **Maquilas** (N3): 3 N4 hijos (Inscripción y garantías: 4, Operación y descargos: 4, Cierre: 4). ✅

OEA sigue siendo N2 hoja con 2 gestiones y N3=`—` — comportamiento correcto por densidad (Regla 3 y 5).

---

### IA-03 — N3 "Declaraciones y Pagos" con 21 hijos N4 en árbol ✅ Resuelto

**Estado anterior:** 21 nodos N4 en árbol bajo "Declaraciones y Pagos".  
**Estado actual:**

```
N3 Declaraciones, pagos y solvencias en arbol: 3 N4 hijos
  N4 Formas de pago y convenios: 5 gestiones
  N4 Declaraciones: 4 gestiones
  N4 Solvencia fiscal: 3 gestiones
  N4 — (flotante): 1 gestión (SAT-GES-0340)
Total N3: 13 gestiones
```

La divergencia árbol vs. allTramites denunciada en v1 (21 N4 en árbol vs. 14 N4 en JSON) fue resuelta. Ahora árbol y JSON coinciden en 3 N4. La gestión flotante SAT-GES-0340 ("Servicio en línea para consultar listado de contribuyentes morosos") tiene un duplicado en Modernización e Infraestructura (SAT-GES-0715) — ver IA-08 nuevo.

**Nota:** Los N3 análogos RTU Digital (16 N4) y Servicios al Contribuyente (14 N4) que también presentaban sobreedaos en v1 se renombraron y reestructuraron; ya no se identifican con esos nombres.

---

### IA-04 — N3 folders con ≥11 gestiones (13 → 16) ❌ Empeoró

**Estado anterior:** 13 N3-folders con ≥11 gestiones terminales.  
**Estado actual:** 16 N3-folders con ≥11 gestiones. Tres carpetas nuevas superan el umbral.

| N3-folder | Gestiones | N4 hijos | Max N4 count | Estado |
|-----------|-----------|----------|-------------|--------|
| CG > Vehículos (como propietario) | 80 | 6 | 19 | N4 sobrecargados |
| CG > Cultura tributaria y capacitación | 58 | 11+1(—) | 10 | 11 N4 en árbol |
| CG > Inscripción y actualización RTU | 52 | 4 | 20 | N4 sobrecargados |
| CG > Servicios y gestiones | 50 | 10 | 16 | N4 sobrecargados |
| AFPA > Depósitos Aduaneros | 36 | 6 | 11 | 1 N4 límite |
| RegTerr > ZDEEP | 29 | 5 | 9 | ✅ OK |
| CG > Devoluciones y créditos fiscales | 20 | 3+8(—) | 6 | 8 flotantes |
| NormAd > Modernización e Infraestructura | 18 | 3 | 7 | ✅ OK |
| CG > Facturación electrónica | 17 | 7+1(—) | 3 | ✅ OK |
| AFPA > Apoderados Especiales | 16 | 3 | 6 | ✅ OK |
| Import > Despacho Aduanero | 16 | 3 | 6 | ✅ OK |
| PC > Régimen de Pequeño Contribuyente | 14 | 3 | 5 | ✅ OK |
| NormAd > Consultas Técnicas (**NUEVO**) | 14 | 3 | 7 | ✅ OK |
| AFPA > Transportistas Aduaneros | 14 | 5 | 4 | ✅ OK |
| CG > Declaraciones, pagos y solvencias (**NUEVO**) | 13 | 3+1(—) | 5 | ✅ OK |
| RegTerr > Maquilas (Decreto 29-89) (**NUEVO**) | 12 | 3 | 4 | ✅ OK |

**Las 3 nuevas** incorporan N4 razonablemente estructurados (3–5 ítems por N4), por lo que el hallazgo es moderado. Sin embargo, el total aumentó de 13 a 16 porque se reclasificaron gestiones que antes estaban en otras ramas.

Las carpetas críticas sin resolver son: Vehículos (max N4=19), Inscripción RTU (max N4=20), Servicios y gestiones (max N4=16), Cultura tributaria (11 N4 en árbol).

---

### IA-05 — 14 folders con violación del ciclo ATO ✅ Resuelto

**Estado anterior:** 14 folders con `etapaAto` de menor rango apareciendo después de rango mayor al ordenar por `orden_contenido`. Caso más grave: Vehículos > Traspasos con `modificar_cerrar` en oc=1 antes que `empezar` en oc=2.

**Estado actual:**

```
Verificación: N4 folders con ATO no monotónico (strict) por orden_contenido: 0
Verificación: N3 folders con ATO violado por orden_n4: 0
```

Evidencias específicas resueltas:
- **SAT-GES-0232** (Cambiar características del vehículo): Ahora en N4="Modificaciones y rectificaciones", oc=2, etapaAto=modificar_cerrar. Correcto.
- **SAT-GES-0318** (Traspaso de vehículos por notario): Ahora en N4="Traspasos de vehículos" > N5="Traspaso de vehículos", oc=17, etapaAto=operar. Correcto.
- **Orden dentro de Traspasos**: oc=1..17, todos `[operar]`, secuencia válida.

**Nota pendiente menor:** Cultura tributaria tiene N4 "Cursos de herramientas y gestiones" con etapaAto dominante = `modificar_cerrar` en posición n4_ord=2, precedido por N4 con `consultar` en n4_ord=1. El orden es: consultar(1) → modificar_cerrar(2) → normativa(3..11). La inversión consultar→modificar_cerrar es semánticamente cuestionable pero no viola el criterio estricto del contrato porque el orden se mide con `orden_n4`, no por secuencia ATO. No se cuenta como violación activa.

---

### IA-06 — 27 nodos sub-densos (≤3 hijos) → 22 🔶 Parcial

**Estado anterior:** 27 nodos con ≤3 hijos en árbol (N2 y N3).  
**Estado actual:** 

```
Arbol nodos totales: 171 (anterior: 239 — reducción de 68 nodos)
N2 sub-densos (1-3 N3 hijos): 10/20
N3 sub-densos (1-3 N4 hijos): 12/59
Total sub-densos con hijos: 22
```

**Sub-densos N2 actuales** (1–3 N3 hijos en árbol):
- Pequeños Contribuyentes: 2 N3 (22 gestiones totales — OK por Regla 3 inversa, 22 no compactan)
- Contribuyentes Especiales: 3 N3 (14 gestiones — OK)
- Exportadores: 3 N3 (21 gestiones — OK)
- Regímenes Territoriales: 2 N3 (41 gestiones — OK)
- Peritos Contadores: 2 N3 (11 gestiones — límite)
- Auditores: 2 N3 (4 gestiones — **sub-denso real**, compactable)
- Gestores Tributarios: 2 N3 (8 gestiones — límite)
- Constitucionales: 3 N3 (18 gestiones — OK)
- No Lucrativos: 2 N3 (14 gestiones — OK)
- Decreto: 3 N3 (16 gestiones — OK)

**Sub-densos N3 que siguen siendo problemáticos:**
- Servicios Profesionales > Facturación: 1 gestión
- Servicios Profesionales > Actualización RTU: 1 gestión
- Servicios Profesionales > Consultas Jurídico: 2 gestiones
- Servicios Profesionales > Sistemas de Retención: 2 gestiones
- Auditores > Habilitación CPA: 2 gestiones
- Auditores > Dictámenes: 2 gestiones
- Empresas de Entrega Rápida (Courier): 3 gestiones
- Prevención de Contrabando: 3 gestiones

La reducción de 239 → 171 nodos en arbol refleja la eliminación de nodos pasarela y la simplificación de la estructura. Los 27 → 22 sub-densos representan mejora parcial pero Servicios Profesionales y Auditores siguen sin compactar.

---

### IA-07 — N4=N3 "Cultura tributaria" (pasarela temática) ✅ Resuelto

**Estado anterior:** 16 gestiones con `nivel4 = "Cultura tributaria y capacitación"` (idéntico al N3).  
**Estado actual:**

```
Registros donde nivel4 == nivel3 (excl. "—"): 0
```

Los 16 registros fueron redistribuidos en los 11 N4 temáticos del folder. El N4 que repetía el nombre del N3 fue eliminado.

---

### IA-08 — 21 títulos duplicados exactos en mismo folder ✅ Resuelto (mayor)

**Estado anterior:** 21 pares de títulos duplicados dentro del mismo folder N4. AFPA > Depósitos Aduaneros con 10 pares de títulos idénticos.

**Estado actual:**

```
Duplicate gestiones within same N4 folder: 2 pares restantes
  Contribuyente General > Devoluciones > — [2x] "Devolución del impuesto de herencias, legados y donaciones"
    SAT-GES-0230, SAT-GES-0687
  Contribuyente General > Cultura tributaria > Biblioteca virtual y descargas [2x] "Presentaciones virtuales"
    SAT-GES-0092, SAT-GES-0685
```

**Qué mejoró:** Los 10 pares duplicados de AFPA > Depósitos Aduaneros fueron resueltos. Los duplicados de ZDEEP también resueltos. Los duplicados de Cultura tributaria restaron de 4 pares a 1 par.

**Qué queda:** 2 pares dentro del mismo folder. Adicionalmente hay 14 títulos duplicados **globales** (entre folders distintos) — ver hallazgos nuevos.

---

### IA-09 — 171 acrónimos sin contexto 🔶 Parcial

**Estado anterior:** 171 gestiones con acrónimos técnicos sin expansión.  
**Estado actual:** Los campos `nivel1`–`nivel5` están limpios y sin sufijos (eso resuelve el problema de schema). En cuanto a los títulos de las gestiones (`gestion`):

```
AFPA en títulos: 15 gestiones (ej. "Auxiliares de la función pública aduanera (Carné...AFPA)")
DUCA en títulos: 13 gestiones (ej. "Declaración de mercancías (DUCA y aduana sin papeles)")
ZDEEP en títulos: 6 gestiones
OEA en títulos: 3 gestiones
```

Algunos títulos de AFPA ya incluyen expansión entre paréntesis en el subtítulo. DUCA, ZDEEP y OEA siguen sin expansión sistemática. Las gestiones técnicas dirigidas a audiencias profesionales (agentes aduaneros, apoderados) pueden tolerar el acrónimo, pero las ciudadanas no.

**No se puede determinar cuántos de los 171 originales fueron corregidos** sin analizar el delta completo de gestiones. La reducción de 715 → 714 gestiones (1 menos) sugiere cambios mínimos de contenido.

---

### IA-10 — 5 folders con `orden_contenido` duplicado ✅ Resuelto

**Estado anterior:** 5 folders con `orden_contenido` colisionando entre hermanos (ej. Traspasos: SAT-GES-0232 `modificar_cerrar` y SAT-GES-0318 `operar` ambos con oc=1).

**Estado actual:**

```
N4 folders con orden_contenido duplicado entre hermanos: 0
```

Verificado con agrupación por (nivel2, nivel3, nivel4) + orden_contenido. La corrección del ATO (IA-05) corrigió simultáneamente las colisiones de orden_contenido.

---

### IA-11 — 77 gestiones a 5 clics (10.8%) 🔶 Parcial⁽²⁾

**Estado anterior:** 77 gestiones en profundidad 5, promedio 3.71.  
**Estado actual:**

```
Distribución de profundidad:
  2 clics (N2): 17 gestiones (2.4%)   — sin cambio
  3 clics (N3): 204 gestiones (28.6%) — bajó desde 249 (34.8%)
  4 clics (N4): 211 gestiones (29.6%) — bajó desde 372 (52.0%)
  5 clics (N5): 282 gestiones (39.5%) — subió desde 77 (10.8%)
  Promedio: 4.06                       — subió desde 3.71
```

| N3 que generó más N5 | Gestiones a 5 clics |
|----------------------|---------------------|
| Vehículos (como propietario) | 74 |
| Inscripción y actualización RTU | 52 |
| Servicios y gestiones al contribuyente | 16 |
| Devoluciones y créditos fiscales | 8 |
| Cultura tributaria y capacitación | 5 |
| Regímenes tributarios | 1 |

> ⁽²⁾ El aumento a 282 gestiones a 5 clics es consecuencia directa de la partición modular aplicada en IA-01 e IA-04. La profundidad extra **es correcta** cuando el N5 aporta agrupación real (ej. Vehículos > Traspasos > N5 "Casos especiales"). Sin embargo, hay 156 gestiones a 5 clics bajo N4 "Personas y representantes", "Inscripción distinivos", "Traspasos" etc., que ya tienen N4 con ≥11 ítems — se añadió N5 adecuadamente.

El promedio 4.06 supera la meta de ≤3.5 clics de la regla 4. El ciudadano promedio ahora da 4 clics, no 3.7.

---

### IA-12 — Asimetría 298:22:14:10 en N1 Contribuyentes ❌ Sin cambio

**Estado anterior:** Distribución 298:22:14:10 (CG:PC:CE:SO).  
**Estado actual:**

```
Contribuyente General: 298
Pequeños Contribuyentes: 22
Contribuyentes Especiales: 14
Sin Obligaciones: 10
```

Idéntico. El 42% del catálogo sigue en un único N2 "Contribuyente General". La asimetría cognitiva persiste: un ciudadano en N1 "Contribuyentes" elige entre 4 N2 que esconden 298, 22, 14 y 10 gestiones sin indicación visual de la magnitud.

---

### IA-13 — Servicios Profesionales: 4 carpetas de 1–2 ítems ❌ Sin cambio

**Estado anterior:** 4 N3 con 1–2 gestiones cada uno.  
**Estado actual:**

```
Servicios Profesionales > Facturación por Honorarios y Formularios: 1 gestión
Servicios Profesionales > Actualización de Actividad y RTU: 1 gestión
Servicios Profesionales > Consultas Jurídico Tributarias: 2 gestiones
Servicios Profesionales > Sistemas de Retención y Cumplimiento: 2 gestiones
```

Igual que antes. 6 gestiones totales distribuidas en 4 carpetas. Todos los N3 tienen ≤2 ítems. Viola Regla 3 (sub-densidad ≤3 → compactar). El usuario ve 4 carpetas que al abrirlas tienen 1–2 tarjetas cada una.

---

### Schema y campos del JSON — ✅ Resuelto

**Estado anterior:** `nivel1_segmento`, `nivel2_area`, `nivel3_subarea`, `nivel4_tema`, `nivel5_tramite` + campos legacy (`nivel2_categoria`, `nivel3_subcategoria`, `segmento`, `regimenArea`, `grupoActor`, `materiaTema`, `subtemaGestion`).

**Estado actual:**

```
Campos nivel en schema: nivel1, nivel2, nivel3, nivel4, nivel5  (sin sufijos)
nivel1_segmento presente en JSON: 0 registros
nivel2_area presente en JSON: 0 registros
nivel2_categoria presente: 0 registros
Todos los alias legacy: AUSENTES
```

El schema fue limpiado completamente. Los 5 campos de nivel usan nombres estrictamente numéricos. **Esto resuelve la violación de Regla 1 en el JSON.**

---

## 3. Nuevos Hallazgos

### NV-01 — 10 N4 con ≥11 gestiones (nueva capa de sobrecarga) 🔴 Crítico

La partición de los N3 sobrecargados creó N4 que ahora **heredan el problema de Miller**. Diez N4-folders tienen ≥11 gestiones y el usuario llega a ellos después de 3–4 clics:

| N4-folder | Gestiones | N5 subdivisión | Estado |
|-----------|-----------|----------------|--------|
| CG > Inscripción RTU > Personas y representantes | 20 | 5 N5 (max=9) | N5 tienen ≤9 — OK |
| CG > Vehículos > Inscripción, distintivos y placas | 19 | 4 N5 (max=6) | N5 tienen ≤6 — OK |
| CG > Vehículos > Traspasos de vehículos | 17 | 2 N5 (max=9) | N5 tienen ≤9 — OK |
| CG > Vehículos > Autorizaciones, consultas | 16 | 3 N5 (max=9) | N5 tienen ≤9 — OK |
| CG > Servicios > Otros servicios al contribuyente | 16 | 7 N5 (max=5) | N5 tienen ≤5 — OK |
| CG > Inscripción RTU > Sociedades y empresas | 13 | 3 N5 (max=6) | N5 tienen ≤6 — OK |
| CG > Inscripción RTU > Otras entidades y patrimonios | 12 | 5 N5 (max=4) | N5 tienen ≤4 — OK |
| CG > Vehículos > Bajas, inactivación y reactivación | 11 | 2 N5 (max=6) | N5 tienen ≤6 — OK |
| CG > Vehículos > Impuesto de circulación (ISCV) | 11 | 2 N5 (max=9) | N5 tienen ≤9 — OK |
| AFPA > Depósitos > Normativa y asistencia | 11 | 7 N5 (max=2) | Muy fragmentado |

**Evaluación:** Todos los N4 sobrecargados tienen N5 que acotan el tamaño. Ningún N5 supera 9 ítems. Desde la perspectiva del usuario, el clic en N4 lleva a una pantalla con ≥11 tarjetas, pero con subdivisión inmediata por N5. Esto es aceptable **solo si la UI muestra las agrupaciones N5 como secciones visibles**, no como lista plana de 11–20 tarjetas. Si la UI muestra lista plana en N4, sigue siendo una violación de Regla 2.

**AFPA > Depósitos > Normativa y asistencia (11 ítems en 7 N5 de 1–2 ítems cada uno)** es el peor caso: la fragmentación extrema en N5 (siete grupos de 1–2 ítems) genera sobre-andamiaje artificial. Debería consolidarse en 3–4 N5 temáticos.

---

### NV-02 — Cultura tributaria tiene 11 N4 en árbol (viola tolerancia máxima de 10) 🟠 Mayor

```
arbol_navegacion.json:
  N3 "Cultura tributaria y capacitación": 11 N4 hijos

allTramites.json N4 breakdown:
  Cursos de herramientas y gestiones: 10
  Calendario y modalidades: 9
  Cursos de ISR: 7
  Cursos de otros impuestos y criterios: 7
  —: 5 (flotantes sin N4)
  Cursos de IVA: 4
  Preguntas frecuentes: 4
  Programas de cultura tributaria: 3
  Biblioteca virtual y descargas: 3
  Cursos por tipo de contribuyente: 2
  Información institucional: 2
  Leyes y normativa: 2
```

La Regla 2 permite hasta 10 opciones como **tolerancia excepcional residual** (≤5% del catálogo, alta homogeneidad). Cultura tributaria tiene 11 N4 en árbol + 5 gestiones flotantes (N4=`—`), lo que supera el umbral. Además, 6 de los 11 N4 tienen ≤3 gestiones (sub-densos): "Programas de cultura tributaria" (3), "Biblioteca virtual" (3), "Cursos por tipo" (2), "Información institucional" (2), "Leyes y normativa" (2). Estos 6 sub-densos podrían fusionarse en 2–3 N4 más densos.

---

### NV-03 — 14 gestiones globalmente duplicadas entre folders distintos 🟠 Mayor

La auditoría v1 identificó duplicados **dentro** del mismo folder. Ahora hay 14 títulos que aparecen en múltiples folders distintos:

| Título (truncado) | Instancias | Folders |
|-------------------|-----------|---------|
| Auxiliares de la función pública aduanera (Carné…) | ×3 | Apoderados/Habilitación + Depósitos/Habilitación recintos + Depósitos/Habilitación garantías |
| Requisitos para renovación de operaciones de auxiliares | ×3 | Apoderados/Habilitación + Depósitos/Habilitación recintos + Depósitos/Habilitación garantías |
| Requisitos para consulta de expedientes de gestión aduanera (para Aux…) | ×3 | Apoderados/Operaciones + Depósitos/Operación mercancías + Depósitos/Operación saldos |
| Declaración de mercancías (DUCA y aduana sin papeles) | ×2 | Depósitos/Operación mercancías + Depósitos/Operación saldos |
| Recepción de seguro de caución y pólizas de garantía | ×2 | Depósitos/Habilitación recintos + Depósitos/Habilitación garantías |
| Programa MIAD (para Auxiliares de la función pública…) | ×2 | Depósitos/Normativa + Depósitos/Operación saldos |
| Solvencia fiscal (Requisito para renovación como auxiliar AFPA…) | ×2 | Apoderados/Habilitación + Depósitos/Habilitación recintos |
| Requisitos para consulta de expedientes (para Regímenes Territoriales) | ×2 | ZDEEP/Registro habilitación + ZDEEP/Operación carga |
| Guías operativas e instructivos aduaneros (para Regímenes Territoriales) | ×2 | ZDEEP/Normativa + ZDEEP/Operación zonas francas |
| Monitoreo de sistemas informáticos de aduanas | ×2 | ZDEEP/Habilitación infraestructura + Depósitos/Operación mercancías |
| Devolución del impuesto de herencias, legados y donaciones | ×2 | Devoluciones/— + Devoluciones/— (mismo N3, N4=—) |
| Presentaciones virtuales | ×2 | Cultura/Biblioteca virtual (mismo folder exacto) |
| Curso: Régimen Electrónico de Pequeño Contribuyente | ×2 | PC/Inscripción + PC/Obligaciones |
| Servicio en línea para consultar contribuyentes morosos | ×2 | Declaraciones/— + Modernización/Transparencia |

Los tres títulos con ×3 instancias (SAT-GES-0437/0695/0688, SAT-GES-0439/0704/0694, SAT-GES-0426/0703/0693) son el residuo de la reestructuración de AFPA Depósitos: los AGD (Almacenes Generales de Depósito) y DAT (Depósitos Aduaneros Temporales) se separaron en N4 distintos pero heredaron gestiones con el mismo título. La diferenciación de audiencia debe reflejarse en el título (añadir "para AGD" / "para DAT").

---

### NV-04 — 8 gestiones flotantes (N4=`—`) en "Devoluciones y créditos fiscales" 🟡 Medio

```
N3 Devoluciones y créditos fiscales — gestiones con N4=—: 8
  SAT-GES-0213: Recuperar el pago por habilitación de libros
  SAT-GES-0067: Formulario para solicitar devolución de pagos en exceso
  SAT-GES-0214: Recuperar multas, recargos o intereses pagados
  SAT-GES-0215: Recuperar un pago duplicado
  SAT-GES-0216: Recuperar un pago hecho de más
  SAT-GES-0217: Recuperar un pago hecho por error
  SAT-GES-0230: Devolución del impuesto de herencias, legados y donaciones [dup]
  SAT-GES-0687: Devolución del impuesto de herencias, legados y donaciones [dup]

N4 existentes en mismo N3:
  ISR (Impuesto Sobre la Renta): 6 gestiones
  IVA (Impuesto al Valor Agregado): 4 gestiones
  Otros impuestos: 2 gestiones
```

Los 8 flotantes son gestiones de "pagos en exceso / errores generales" que no caben en ISR o IVA. Forman un grupo semántico propio: podrían agruparse en un N4 "Pagos en exceso y devoluciones generales". Los dos duplicados (SAT-GES-0230/0687) son el mismo título en el mismo N3/N4=`—` — uno debe eliminarse o diferenciarse.

---

### NV-05 — Servicios y gestiones al contribuyente: 4 N4 micro-densos (1 gestión cada uno) 🟡 Medio

```
N3 Servicios y gestiones (50 gestiones, 10 N4):
  Correcciones: 2 gestiones
  Acceso y usuario: 1 gestión
  Citas y oficinas: 1 gestión
  Libros, facturas y máquinas: 1 gestión
  Sistemas de retención: 1 gestión
```

Cuatro N4 con 1 gestión cada uno violan Regla 3 (sub-densidad ≤3 → compactar). Deben fusionarse con N4 vecinos semánticamente afines o absorberse en "Otros servicios al contribuyente".

---

### NV-06 — Profundidad promedio aumentó de 3.71 a 4.06 🟡 Medio

La partición N4→N5 incrementó el promedio de clics. El 39.5% del catálogo (282 gestiones) ahora requiere 5 clics. Esto es consecuencia directa y esperada de la partición, pero el objetivo de Regla 4 (≤3 clics preferentemente) se aleja.

**Acciones para corregir:** Reducir el impacto requiere tanto simplificar N3 sobre-profundos (compactando sub-densos per IA-06/IA-13) como verificar que la UI renderice los N4 con N5 como secciones colapsables en la misma pantalla, no como pantallas separadas — esto reduciría el clic efectivo de N4→N5 a navegación in-page.

---

## 4. Pendientes Críticos (Lista Priorizada)

| Prioridad | ID | Acción requerida | Regla | Gestiones afectadas |
|-----------|----|--------------------|-------|---------------------|
| 🔴 P1 | NV-01/NV-03 | Diferenciar los 3 títulos ×3 y los 11 ×2 globales en AFPA/ZDEEP (AGD vs. DAT, RTZE etc.) | Regla 10 | 28 registros |
| 🔴 P2 | IA-13/IA-06 | Compactar Servicios Profesionales (4 N3 de 1–2 ítems → todos al N2 directo) | Regla 3 | 6 gestiones |
| 🟠 P3 | NV-02 | Reducir Cultura tributaria de 11 a ≤9 N4 fusionando sub-densos (Programas+Biblioteca+Info institucional → "Recursos y materiales"; Cursos ISR+IVA+Otros → "Cursos por impuesto") | Reglas 2, 3 | 58 gestiones |
| 🟠 P4 | NV-04 | Crear N4 "Pagos en exceso y devoluciones generales" para los 8 flotantes de Devoluciones; eliminar duplicado SAT-GES-0230/0687 | Regla 5, 10 | 8 gestiones |
| 🟠 P5 | NV-05 | Fusionar 4 N4 de 1 gestión en Servicios y gestiones con N4 vecinos afines | Regla 3 | 4 gestiones |
| 🟠 P6 | IA-12 | Evaluar sub-partición de "Contribuyente General" (298 gestiones en un solo N2) — al menos señalización visual de la magnitud | Regla 2 | 298 gestiones |
| 🟡 P7 | IA-08 | Eliminar 2 pares de títulos duplicados en mismo folder (SAT-GES-0230/0687 y SAT-GES-0092/0685) | Regla 10 | 4 gestiones |
| 🟡 P8 | IA-09 | Expandir DUCA, ZDEEP y OEA en los títulos de gestiones ciudadanas (no en gestiones técnicas a profesionales aduaneros) | Regla 10 | ~22 gestiones |
| 🟡 P9 | NV-01-AFPA | Consolidar AFPA > Depósitos > Normativa (11 ítems en 7 N5 de 1–2 ítems) en 3–4 N5 temáticos | Regla 3 | 11 gestiones |
| ⚪ P10 | IA-13-Auditores | Compactar Auditores (2 N3 × 2 ítems = 4 gestiones) al N2 directo | Regla 3 | 4 gestiones |

---

## 5. Métricas Comparativas

| Métrica | Auditoría v1 | Auditoría v2 | Delta |
|---------|-------------|-------------|-------|
| Total gestiones | 715 | 714 | −1 |
| Nodos en árbol | 239 | 171 | −68 |
| N4 nodos en árbol | 157 | 88 | −69 |
| Profundidad promedio | 3.71 | 4.06 | +0.35 |
| Gestiones a 5 clics | 77 (10.8%) | 282 (39.5%) | +205 |
| Gestiones a 4 clics | 372 (52.0%) | 211 (29.6%) | −161 |
| Gestiones a 3 clics | 249 (34.8%) | 204 (28.6%) | −45 |
| Clics pasarela (nodos monocatenarios) | 4 | 0 | −4 ✅ |
| N3-folders ≥11 gestiones | 13 | 16 | +3 |
| N4-folders ≥11 gestiones | 1 (68 items) | 10 | +9 (pero todos con N5) |
| Folders ATO invertido | 14 | 0 | −14 ✅ |
| Folders orden_contenido duplicado (N4) | 5 | 0 | −5 ✅ |
| Duplicados exactos dentro mismo folder | 21 pares | 2 pares | −19 ✅ |
| Duplicados globales entre folders | N/A | 14 títulos | 🆕 |
| Nodos sub-densos (≤3 hijos) en árbol | 27 | 22 | −5 |
| Campos schema con sufijos conceptuales | 5+7 legacy | 0 | −12 ✅ |
| N4 "Autorizaciones" (mayor hotspot) | 68 ítems planos | 16 con N5 | ✅ mejorado |
| Servicios Profesionales compactado | No | No | sin cambio |
| N4=N3 pasarela temática | 16 registros | 0 | ✅ |

---

## 6. Notas Metodológicas

- Fuente primaria: `src/data/allTramites.json` (714 registros, schema con `nivel1`–`nivel5` limpios + `gestion` como campo de título).
- Fuente estructural: `database/arbol_navegacion.json` (171 nodos, schema con `nivel`, `padre_id`, `materialized_path`).
- Fuente contractual: `src/data/categoryOrder.ts` — "Contribuyente General" ahora sí está declarado en `OFFICIAL_CATEGORY_ORDER.contribuyentes`, resolviendo la deuda de sincronía del contrato.
- Los análisis de profundidad usan `nivel1`–`nivel5` excluyendo valores `"—"`.
- La verificación ATO se realizó agrupando por (nivel2, nivel3, nivel4) y comprobando monotonía de `etapaAto` por `orden_contenido`. Cero violaciones confirmadas.
- Los análisis de duplicados usaron el campo `gestion` (título ciudadano) como clave de comparación.
- Diferencia de total (715 → 714): se eliminó 1 gestión entre auditorías (ID no identificado con precisión en esta auditoría).
