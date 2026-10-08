# Mapa de Navegación Estructurado — Comercio Exterior (Antes vs. Después)

> **Documento Oficial de Transición y Arquitectura de Información**  
> **Área:** Operadores de Comercio Exterior (246 Trámites Consolidados)  
> **Fecha:** Octubre 2026  
> **Fuente de Verdad:** [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json)  
> **Entregables Sincronizados:**  
> * [`docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx)  
> * [`docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx)

---

## 1. Justificación del Cambio Arquitectónico

### Diagnóstico del Árbol Anterior (Dispersión y Redundancia N4/N5)
El modelo anterior presentaba una fragmentación plana en 12 categorías artificiales donde:
* Roles que jurídicamente son **Auxiliares de la Función Pública Aduanera (AFPA)** (`Agentes Aduaneros`, `Apoderados Especiales`, `Courier`, `Depósitos`, `Transportistas`) estaban dispersos como si fueran universos separados.
* Existía una sobre-profundización artificial: Nivel 4 duplicaba el nombre de Nivel 5 (ej. *«Depósitos Aduaneros Temporales > Depósitos Aduaneros Temporales»* o *«ZDEEP > ZDEEP»*).
* Títulos técnicos con abreviaturas internas ininteligibles para el ciudadano (ej. *"MIAD"*, *"Requisitos previos importación aérea"*).
* Subcategorías genéricas de ciclo de vida impuestas artificialmente (*«Registro y acreditación»*, *«Operaciones y trámites»*) en lugar de materias operativas reales.

### Solución Canónica Implementada (6 Ramas Maestras)
1. **Unificación Jurídica:** Se consolidan las 12 categorías en **6 ramas canónicas** naturales por rol del operador.
2. **Compactación Asimétrica:** Eliminación de niveles espejo intermedios; las migas de pan reflejan exactamente la ruta jerárquica de búsqueda.
3. **Lenguaje Ciudadano:** Títulos comprensibles con verbos de acción y eliminación de acrónimos en primera mención.
4. **Agrupación de Miller:** Subcategorías y temas limitados a bloques de $5 \pm 2$ opciones para reducir la carga cognitiva.

---

## 2. Comparativo Estructural: Antes vs. Después

| Dimensión | Estructura Anterior (Legacy v5) | Estructura Canónica Optimizada |
| :--- | :--- | :--- |
| **Categorías Raíz** | 12 categorías planas desarticuladas | **6 ramas maestras canónicas** |
| **Profundidad N4/N5** | Niveles redundantes con texto espejo | **Compactada y asimétrica** (3 a 4 niveles directos) |
| **Subcategorización** | 4 etiquetas genéricas repetidas | **Subcategorías específicas por dominio aduanero** |
| **Trámites Totales** | 246 trámites (con títulos duplicados) | **246 trámites únicos y estandarizados** |
| **Lenguaje en Títulos** | Técnico/burocrático con siglas | **Lenguaje Ciudadano (Plain Language) con verbos de acción** |
| **Brechas Operativas** | Dispersas sin trazabilidad | **12 brechas normativas identificadas con ficha formal** |

---

## 3. Desglose Detallado por Rama (Antes vs. Después)

### Rama 1: Importadores (55 trámites)
* **Antes:** Disperso en categoría plana con 4 subcategorías genéricas (`Registro y acreditación`, `Operaciones`, etc.) que obligaban a mezclar vehículos con abandono y DUCAs.
* **Después:** Organizado en **5 subcategorías temáticas** según el flujo real del importador:
  1. `Registro y Padrón de Importadores` (9 trámites)
  2. `Declaraciones Aduaneras y DUCAs` (10 trámites: DUCAs, gestiones anticipadas, pre-declaraciones)
  3. `Despacho Aduanero, Levante y Selectivo` (17 trámites: semáforo de rampa, inspección física y levante)
  4. `Importación y Nacionalización de Vehículos` (10 trámites: IPRIMA, placas iniciales, rectificaciones)
  5. `Mercancías en Abandono, Depósitos y Franquicias` (9 trámites: subastas aduaneras, rescate, franquicias)

---

### Rama 2: Exportadores (21 trámites)
* **Antes:** Mezclaba devoluciones tributarias de IVA con trámites aduaneros de puerto bajo etiquetas genéricas.
* **Después:** Agrupado en **3 subcategorías operativas claras**:
  1. `Padrón y Registro de Exportadores` (7 trámites: padrón SAT, VUPE/SEADEX, solvencias)
  2. `Declaraciones Aduaneras y Embarques` (4 trámites: transmisión DUCA-D, despacho y manifiestos)
  3. `Devolución de Crédito Fiscal` (10 trámites: régimen general, especial electrónico y dictámenes CPA)

---

### Rama 3: Operador Económico Autorizado — OEA (2 trámites)
* **Antes:** Categoría con subcategorías vacías y redundancia de etiquetas.
* **Después:** Rama especializada con **1 subcategoría unificada**:
  1. `Programa OEA` (2 trámites: certificación de operador de confianza y acuerdos de reconocimiento mutuo)

---

### Rama 4: Auxiliares de la Función Pública Aduanera — AFPA (76 trámites)
* **Antes:** 5 categorías independientes separadas (`Agentes Aduaneros`, `Apoderados`, `Courier`, `Depósitos`, `Transportistas`) que desdibujaban el marco común del CAUCA IV.
* **Después:** Unificación formal bajo el paraguas institucional de AFPA con **5 actores directos**:
  1. `Agentes Aduaneros` (7 trámites: patente, fianza, examen y dependientes)
  2. `Apoderados Especiales Aduaneros` (16 trámites: mandatos corporativos, acreditación y cese)
  3. `Depósitos Aduaneros` (36 trámites estructurados por tipo de recinto):
     * *Depósitos Aduaneros Temporales - DAT* (18 trámites en recintos portuarios/aeroportuarios)
     * *Almacenadoras Generales de Depósito - AGD* (16 trámites de títulos de crédito y bonos)
     * *Almacenes Fiscales* (2 trámites de custodia afianzada)
  4. `Empresas de Entrega Rápida o Courier` (3 trámites: despacho express, garantías y reclasificación)
  5. `Transportistas Aduaneros` (14 trámites: registro de flota, precintos satelitales y tránsitos DUCA-T)

---

### Rama 5: Regímenes Territoriales y Zonas Especiales (42 trámites)
* **Antes:** Separación forzada en tres categorías inconexas (`Maquilas`, `ZDEEP Administradoras`, `ZDEEP Usuarias`) con redundancia N4/N5 ("ZDEEP > ZDEEP").
* **Después:** Unificación en **2 regímenes de fomento y territorio aduanero especial**:
  1. `Maquilas (Decreto 29-89)` (12 trámites: admisión temporal, insumo-producto, cuentas corrientes)
  2. `Zonas de Desarrollo Económico Especial Público (ZDEEP)` (30 trámites sin niveles redundantes):
     * *Empresas Usuarias de ZDEEP* (15 trámites: exenciones fiscales, operaciones industriales, traslados)
     * *Entidades Administradoras de ZDEEP* (15 trámites: autorización de polígono, infraestructura perimetral, garitas)

---

### Rama 6: Normativa y Operaciones Aduaneras Generales (50 trámites)
* **Antes:** Denominada ambiguamente `Normativa y Aranceles` con trámites de infraestructura, modernización y aduana sin papeles dispersos sin jerarquía.
* **Después:** Estructurada en **5 dominios técnicos transversales**:
  1. `Arancel Centroamericano (SAC) y Permisos` (7 trámites: clasificación arancelaria y notas técnicas)
  2. `Acuerdos Comerciales y Facilitación` (8 trámites: certificados de origen, TLCs y trato preferencial)
  3. `Prevención de Contrabando y Defraudación` (3 trámites: denuncias aduaneras y fiscalización posterior)
  4. `Consultas Técnicas, Recursos y Valoración` (14 trámites: valor en aduana, resoluciones anticipadas, recursos)
  5. `Modernización e Infraestructura Aduanera` (18 trámites: Aduana sin Papeles, MIAD, marchamos electrónicos)

---

## 4. Trazabilidad de Entregables Sincronizados

| Entregable | Rol | Estado |
| :--- | :--- | :---: |
| [`src/data/allTramites.json`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/allTramites.json) | Base de datos única con 246 trámites aduaneros bajo las 6 ramas | Sincronizado |
| [`src/data/categoryOrder.ts`](file:///c:/Users/busqu/Documents/GitHub/SAT/src/data/categoryOrder.ts) | Contrato de orden canónico validado por tests automatizados | Sincronizado |
| [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx) | Hoja específica *Comercio Exterior (246)* y fórmulas de resumen | Sincronizado |
| [`Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Mapa_de_Navegacion_y_Descripciones_Portal_SAT.xlsx) | Mapa de navegación completo y fichas en Lenguaje Ciudadano | Sincronizado |
