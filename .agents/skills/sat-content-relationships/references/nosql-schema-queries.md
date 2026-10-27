# Esquema NoSQL y Consultas MongoDB (SAT Content Relationships)

## 1. Catálogo de Nomenclatura y Polijerarquía

### Estándar de Identificadores
- **Prefijo de código institucional:** `SAT-GES-####` (ej. `SAT-GES-0015`).
- **ID canónico NoSQL (`_id`):** `[slug-limpio-inmutable]` en kebab-case sin prefijos de nivel ni audiencia (ej. `rtu-inscripcion-digital`, `declaracion-mercancias-duca`), garantizando inmutabilidad si la gestión se proyecta en múltiples ramas.
- **Colección principal en MongoDB:** `gestiones`.

### Especificación de `cat_actores` (Polijerarquía)
Una gestión se define **una única vez** en `gestiones`. Los perfiles o ramas donde aplica se referencian en `actores_ids`.

```json
{
  "_id": "agentes-aduaneros",
  "codigo": "ACT-AFPA-01",
  "nombre": "Agentes Aduaneros",
  "nivel_1_id": "comercio-exterior",
  "grupo_padre": "Auxiliares de la Función Pública Aduanera (AFPA)",
  "nivel_jerarquico": 3,
  "descripcion": "Personas individuales autorizadas por la SAT para actuar como despachantes habituales en gestiones aduaneras.",
  "base_legal": "CAUCA IV Arts. 22 al 28 y RECAUCA IV."
}
```

---

## 2. Esquema Completo de Documento en `gestiones`

```json
{
  "_id": "rtu-inscripcion-digital",
  "codigo": "SAT-GES-0015",
  "titulo": "Solicitar Número de Identificación Tributaria (NIT) e inscripción en el Registro Tributario Unificado (RTU)",
  "descripcion": "Permite a personas individuales y empresas obtener su Número de Identificación Tributaria (NIT) y registrar sus obligaciones fiscales en línea.",
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
    "prerrequisitos_ids": ["solicitud-agencia-virtual"],
    "siguientes_pasos_ids": ["fel-habilitacion-emisor"],
    "herramientas_apoyo_ids": [],
    "normativa_asociada_ids": []
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

## 3. Índices y Patrones de Consulta en MongoDB

### A. Índices Esenciales
```javascript
// 1. Identificadores únicos
db.gestiones.createIndex({ "codigo": 1 }, { unique: true });

// 2. Consultas por perfil y ciclo de vida ATO (Multikey Index)
db.gestiones.createIndex({ "actores_ids": 1, "etapa_ato": 1 });

// 3. Consultas por Familia Temática (Multikey Index)
db.gestiones.createIndex({ "familias_ids": 1 });

// 4. Relaciones inversas (Para calcular siguientes pasos dinámicamente)
db.gestiones.createIndex({ "relaciones_proceso.prerrequisitos_ids": 1 });

// 5. Búsqueda de texto completo
db.gestiones.createIndex({ "titulo": "text", "descripcion": "text" });
```

### B. Consulta de Relaciones Inversas ("Siguientes Pasos")
```javascript
// Gestiones que tienen como prerrequisito la gestión actual:
db.gestiones.find({
  "relaciones_proceso.prerrequisitos_ids": "rtu-inscripcion-digital"
});
```

### C. Consulta Automática de Familia Temática (Cluster Horizontal)
Para poblar el bloque *"En esta sección"* o *"Gestiones relacionadas"* excluyendo la gestión actual (respetando la Ley de Miller: máximo 4 a 6 ítems):
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

## 4. Familias Temáticas Canónicas (`familias_ids`)

1. **`fel` — Factura Electrónica en Línea (FEL):**
   - Habilitación y emisión en Agencia Virtual / APP SAT.
   - Anulación de Documentos Tributarios Electrónicos (DTE).
   - Verificador público de autenticidad de DTE.
   - Catálogo de Certificadores autorizados y facturación en contingencia.
2. **`rfv` — Registro Fiscal de Vehículos (RFV):**
   - Traspaso electrónico de vehículos y primeras placas de circulación.
   - Reposición de tarjeta de circulación y calcomanía vehicular.
   - Consulta y pago del Impuesto sobre Circulación de Vehículos (ISCV).
   - Inactivación definitiva o temporal de vehículos.
3. **`rtu-digital` — Registro Tributario Unificado (RTU):**
   - Solicitud de Número de Identificación Tributaria (NIT) e inscripción inicial.
   - Actualización y ratificación periódica de datos fiscales.
   - Cese temporal o definitivo de actividades económicas.
4. **`duca` — Declaración Única Centroamericana (DUCA - Aduanas):**
   - DUCA-F (Comercio Centroamericano), DUCA-D (Importaciones/Exportaciones Generales), DUCA-T (Tránsito Internacional).
   - Declaración Anticipada y rectificación de DUCAs.
5. **`regimenes-especiales` — Regímenes Aduaneros y Zonas Especiales:**
   - Maquilas (Decreto 29-89), Zonas de Desarrollo Económico Especial Público (ZDEEP) y Zonas Francas (Decreto 65-89).
6. **`afpa` — Auxiliares de la Función Pública Aduanera (AFPA):**
   - Carnés, credenciales, renovación de fianzas y firma electrónica aduanera.
