---
name: sat-content-relationships
description: >-
  Modelo de relaciones de contenido, vinculación contextual, polijerarquía y grafos temáticos para
  las gestiones del Portal SAT Guatemala o portales de administración pública. Usar para diseñar,
  estructurar y consultar relaciones de proceso (prerrequisitos, ciclo de vida ATO, siguientes pasos),
  familias temáticas (clusters como FEL, RTU, Vehículos, DUCAs) y contenido relacionado contextual.
---

# Skill: Modelo de Relaciones de Contenido y Grafos Temáticos (SAT Content Relationships)

Esta skill define el estándar metodológico, estructural y técnico para implementar **contenido relacionado, polijerarquía y vinculación contextual** en las **gestiones** del Portal Web SAT Guatemala, tanto en el modelo NoSQL (MongoDB) como en los componentes de interfaz de usuario (React/UI).

---

## 1. Fundamentos y Principios de Diseño

### A. De "Trámites" a "Gestiones"
En portales de administración pública tributaria y aduanera, el término restrictivo "trámite" resulta inexacto:
* Un **trámite** formalmente exige expediente bilateral, liquidación o resolución administrativa.
* Una **gestión** engloba con exactitud trámites transaccionales, consultas públicas de bases de datos, herramientas de cálculo, descargas criptográficas y guías orientativas ciudadanas.
* **Estándar de nomenclatura institucional:**
  * Prefijo de código institucional: `SAT-GES-####` (ej. `SAT-GES-0015`).
  * ID canónico NoSQL: `[slug-limpio-inmutable]` sin prefijos de actor o segmento (ej. `rtu-inscripcion-digital`, `declaracion-mercancias-duca`, `solvencia-fiscal-solicitud`), garantizando que el ID no cambie si la gestión se comparte o reasigna entre actores.
  * Nombre de colección en MongoDB: `gestiones`.

### B. El Principio de Navegación Contextual (Web of Services)
Conforme a las directrices de Nielsen Norman Group y los estándares de GOV.UK:
* Los ciudadanos **no navegan exclusivamente de forma jerárquica** (árbol arriba/abajo).
* La mayor fricción en portales estatales ocurre cuando un usuario termina una gestión y queda en un "callejón sin salida" sin saber cuál es el siguiente paso.
* Toda gestión debe proporcionar navegación contextual en dos dimensiones ortogonales:
  1. **Dimensión de Flujo / Proceso (Secuencial):** Prerrequisito $\rightarrow$ Trámite $\rightarrow$ Siguiente Paso.
  2. **Dimensión Temática / Por Materia (Cluster Horizontal):** Ecosistema de servicios afines (ej. todo lo relacionado con Factura Electrónica FEL).

---

## 2. Las Dos Capas Ortogonales de Relación

```
                              ┌─────────────────────────────────────┐
                              │          Ficha de Gestión           │
                              │            (Ej. FEL-01)             │
                              └──────────────────┬──────────────────┘
                                                 │
                   ┌─────────────────────────────┴─────────────────────────────┐
                   ▼                                                           ▼
    ┌───────────────────────────────┐                           ┌───────────────────────────────┐
    │  Capa A: Relación de Proceso  │                           │  Capa B: Familia Temática     │
    │      (Flujo Secuencial)       │                           │      (Cluster Horizontal)     │
    ├───────────────────────────────┤                           ├───────────────────────────────┤
    │ • prerrequisito               │                           │ Campo indexado:               │
    │ • siguiente_paso              │                           │ "familia_tematica": "FEL"     │
    │ • herramienta_apoyo           │                           │                               │
    │ • normativa_asociada          │                           │ Consulta dinámica directa:    │
    │                               │                           │ Otros trámites, guías y       │
    │ Fuente: Curaduría / Matriz    │                           │ verificadores de la familia   │
    │ Ruta de Procesos              │                           │ sin mantenimiento manual.     │
    └───────────────────────────────┘                           └───────────────────────────────┘
```

---

### Capa A: Relaciones de Proceso / Secuenciales (Taxpayer Journey)

Definen la interacción en el ciclo de vida tributario (ATO Lifecycle):

| Tipo de Relación (`tipo_relacion`) | Propósito Funcional | Ejemplo SAT |
| :--- | :--- | :--- |
| `prerrequisito` | Requisito o gestión previa mandatoria para poder operar. | Tener *Agencia Virtual* antes de inscribir una empresa en *RTU Digital*. |
| `siguiente_paso` | Continuidad natural una vez completada la gestión. | Inscribirse en RTU $\rightarrow$ *Habilitación como Emisor FEL*. |
| `herramienta_apoyo` | Verificador, validador, simulador o cálculo en tiempo real. | Al llenar DUCA $\rightarrow$ *Consulta en Línea del Arancel Integrado*. |
| `normativa_asociada` | Marco legal, criterio institucional o resolución vinculante. | En Maquilas $\rightarrow$ *Criterios Operativos del Decreto 29-89*. |

---

### Capa B: Familias Temáticas Canónicas (Ecosistemas de Servicio)

Permiten agrupar horizontalmente todos los servicios de una misma materia para que el usuario descubra herramientas afines sin enlaces manuales:

1. **Factura Electrónica en Línea (FEL):**
   * Emisión en Agencia Virtual / APP SAT.
   * Anulación de Documentos Tributarios Electrónicos (DTE).
   * Verificador público de autenticidad de DTE.
   * Catálogo de Certificadores de Factura Electrónica autorizados.
   * Facturación en contingencia.
2. **Registro Fiscal de Vehículos (RFV):**
   * Traspaso electrónico de vehículos.
   * Primeras placas de circulación.
   * Reposición de distintivos y placas por pérdida/robo.
   * Pago del Impuesto sobre Circulación de Vehículos (ISCV).
   * Inactivación definitiva o temporal de vehículos.
3. **Registro Tributario Unificado (RTU) Digital:**
   * Solicitud de NIT e inscripción inicial.
   * Actualización periódica de datos del contribuyente.
   * Ratificación anual de domicilio y actividad económica.
   * Cese temporal o definitivo de actividades.
4. **Declaraciones y Operaciones Aduaneras (DUCAs):**
   * DUCA-F (Comercio Centroamericano).
   * DUCA-D (Importaciones y Exportaciones Generales).
   * DUCA-T (Tránsito Aduanero Internacional Terrestre).
   * Declaración Anticipada de Mercancías.
   * Rectificación de DUCAs.
5. **Regímenes Aduaneros de Fomento y Zonas Especiales:**
   * Maquilas y Perfeccionamiento Activo (Decreto 29-89): Calificación, Cuenta Corriente, Fianzas, Descargos.
   * Zonas de Desarrollo Económico Especial Público (ZDEEP): Administradoras y Usuarias.
   * Zonas Francas (Decreto 65-89).
6. **Auxiliares de la Función Pública Aduanera (AFPA):**
   * Carné y credenciales de auxiliares.
   * Renovación y actualización de garantías y fianzas.
   * Componente criptográfico ActiveX PKI/DUA.
   * Régimen sancionatorio y recursos.

---

## 3. Catálogo de Actores (`cat_actores`) y Polijerarquía

Para evitar ambigüedades en la asignación de perfiles, la arquitectura desacopla el catálogo de actores:

### Especificación de la Colección `cat_actores`
```json
{
  "_id": "agentes-aduaneros",
  "codigo": "ACT-AFPA-01",
  "nombre": "Agentes Aduaneros",
  "segmento_id": "comercio-exterior",
  "grupo_padre": "Auxiliares de la Función Pública Aduanera",
  "nivel_jerarquico": 2,
  "descripcion": "Personas individuales autorizadas por SAT para actuar como despachantes habituales en el trámite aduanero.",
  "base_legal": "CAUCA IV Arts. 22 al 28 y RECAUCA IV."
}
```

### Regla de Polijerarquía
Un trámite se define **una única vez** en `gestiones`. Los actores a los que aplica se listan en el arreglo `actores_aplicables`.
* **Cero duplicación de contenido:** Actualizar la base legal de la DUCA modifica un solo documento en MongoDB.
* **Proyección multi-perfil:** En la vista de Importadores, de Agentes Aduaneros y de ZDEEP se proyecta la misma gestión con sus particularidades de contexto.

---

## 4. Esquema Completo de Documento NoSQL (`gestiones`)

```json
{
  "_id": "rtu-inscripcion-digital",
  "codigo": "SAT-GES-0015",
  "titulo": "Inscripción en el Registro Tributario Unificado (RTU) Digital",
  "descripcion": "Trámite 100% digital para personas individuales y jurídicas para obtener su Número de Identificación Tributaria (NIT) y registrar sus obligaciones fiscales.",
  "base_legal": "Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT 08-2020.",
  "url_oficial": "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-rtu-digital/",
  
  "etapa_ato": "Empezar y registrarse",
  "tipo_interaccion": "servicio_transaccional",
  "familias_ids": ["rtu-digital", "agencia-virtual"],
  
  "actores_ids": [
    "nit-sin-obligaciones",
    "pequenos-contribuyentes",
    "contribuyente-general",
    "profesionales-independientes",
    "importadores"
  ],
  
  "relaciones_proceso": {
    "prerrequisitos_ids": ["solicitud-agencia-virtual"]
  },
  
  "auditoria": {
    "estado": "publicado",
    "version": 1,
    "vigente_desde": "2026-01-01T00:00:00Z",
    "vigente_hasta": null,
    "actualizado_por": "mesa_tecnica_sat",
    "fecha_revision": "2026-10-08T18:00:00Z"
  }
}
```

---

## 5. Patrones de Consulta y Rendimiento en MongoDB

### A. Índices Esenciales
```javascript
// 1. Identificadores únicos
db.gestiones.createIndex({ "codigo": 1 }, { unique: true });

// 2. Consultas por actor y ciclo de vida ATO (Multikey Index)
db.gestiones.createIndex({ "actores_ids": 1, "etapa_ato": 1 });

// 3. Consultas por Familia Temática (Multikey Index)
db.gestiones.createIndex({ "familias_ids": 1 });

// 4. Relaciones inversas (Para calcular siguientes pasos)
db.gestiones.createIndex({ "relaciones_proceso.prerrequisitos_ids": 1 });

// 5. Búsqueda de texto completo
db.gestiones.createIndex({ "titulo": "text", "descripcion": "text" });
```

### B. Consulta de Relaciones Inversas ("Siguientes Pasos")
```javascript
// Para saber qué gestiones tienen como prerrequisito a la actual:
db.gestiones.find({ "relaciones_proceso.prerrequisitos_ids": "rtu-inscripcion-digital" });
```

### C. Consulta Automática de Familia Temática
Para poblar el bloque *"Más servicios de esta temática"* excluyendo la gestión actual:
```javascript
db.gestiones.find(
  {
    "familias_ids": "fel",
    "_id": { "$ne": "fel-habilitacion-emisor" }
  },
  { "codigo": 1, "titulo": 1, "tipo_interaccion": 1, "url_oficial": 1 }
).limit(4);
```

---

## 6. Reglas de Presentación en la Interfaz de Usuario (UI/UX)

1. **Ley de Miller ($7 \pm 2$):**
   * Máximo **3 a 4 relaciones de proceso** visibles por ficha.
   * Máximo **4 a 6 elementos** en el carrusel/listado de Familia Temática.
2. **Diferenciación Visual Clara:**
   * El bloque de **Proceso** se presenta como una línea de tiempo o tarjetas con badges de estado (`Prerrequisito`, `Siguiente Paso`).
   * El bloque de **Familia Temática** se presenta como un catálogo o listado de enlaces con el ícono de su tipo de interacción (transaccional, consulta o guía).
3. **Integridad de Enlaces:**
   * Todos los `gestion_id` de `relaciones_proceso` deben ser validados mediante script ETL para asegurar que no existan enlaces rotos hacia gestiones inexistentes.
