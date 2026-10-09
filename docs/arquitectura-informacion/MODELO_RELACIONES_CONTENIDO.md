# Modelo de Relaciones de Contenido y Grafos Temáticos — Portal SAT Guatemala

Este documento establece la especificación técnica y de arquitectura de información para el modelado de **relaciones de proceso, familias temáticas y polijerarquía** de las **gestiones** del Portal SAT en la base de datos NoSQL (MongoDB) y su consumo en el frontend.

---

## 1. Justificación y Adopción Terminológica

### 1.1 De "Trámites" a "Gestiones"
En la administración tributaria y aduanera de Guatemala, el concepto "trámite" resulta restrictivo, pues exige la existencia de un expediente administrativo o solicitud bilateral. 
El portal contiene adicionalmente verificadores públicos, guías de requisitos, descargas de componentes y consultas en tiempo real. Por ello, la unidad atómica de contenido se denomina **Gestión**:
* **Código Oficial:** `SAT-GES-####`
* **Identificador Canónico NoSQL (`_id`):** `[slug-limpio-inmutable]` sin prefijos de actor o segmento (ej. `solvencia-fiscal-solicitud`, `declaracion-mercancias-duca`, `rtu-inscripcion-digital`). Al no estar amarrado a un actor o área, **el ID jamás cambia si la gestión se comparte o reasigna entre múltiples actores**.
* **Colección NoSQL:** `gestiones`

### 1.2 Principio de Contenido Universal y Compartido (Fin de los Silos)
Los servicios de la SAT no pertenecen en exclusiva a un régimen o dirección:
* **El Contenido es Universal:** Una gestión se define una sola vez en el catálogo maestro.
* **Los Actores son Vistas:** Cada gestión declara en `actores_ids: []` todos los perfiles que tienen acceso o necesidad de realizarla.
* Cada gestión declara en `familias_ids: []` todos los ecosistemas temáticos a los que pertenece.

---

## 2. Las Dos Capas Ortogonales de Relación

### Capa A: Relaciones de Proceso / Secuenciales
* `prerrequisito`: Gestión previa obligatoria (ej. tener Agencia Virtual antes de actualizar RTU).
* `siguiente_paso`: Calculado dinámicamente mediante consulta inversa sobre `relaciones_proceso.prerrequisitos_ids`.
* `herramienta_apoyo`: Verificador o simulador auxiliar (ej. Verificador de DTE o Arancel Integrado).
* `normativa_asociada`: Base legal, criterio institucional o resolución vinculante.

### Capa B: Familias Temáticas Canónicas (Clusters con multikey)
* **Factura Electrónica en Línea (`fel`)**
* **Registro Fiscal de Vehículos (`vehiculos`)**
* **Registro Tributario Unificado (`rtu-digital`)**
* **Declaraciones Aduaneras (`ducas`)**
* **Regímenes Especiales y Maquilas (`maquilas-29-89`)**
* **Zonas de Desarrollo Económico Especial Público (`zdeep`)**
* **Auxiliares de la Función Pública Aduanera (`afpa`)**

---

## 3. Modelo NoSQL en MongoDB (Colecciones Nucleares)

### Colección 1: `cat_actores` (Gobernanza de Perfiles)
Garantiza coherencia terminológica y control de la polijerarquía:
```json
{
  "_id": "agentes-aduaneros",
  "codigo": "ACT-AFPA-01",
  "nombre": "Agentes Aduaneros",
  "segmento_id": "comercio-exterior",
  "grupo_padre": "Auxiliares de la Función Pública Aduanera",
  "nivel_jerarquico": 2,
  "descripcion": "Personas autorizadas por SAT para actuar en el despacho de mercancías.",
  "base_legal": "CAUCA IV Arts. 22 al 28 y RECAUCA IV."
}
```

### Colección 2: `gestiones` (Catálogo Maestro y Relaciones)
```json
{
  "_id": "rtu-inscripcion-digital",
  "codigo": "SAT-GES-0015",
  "titulo": "Inscripción en el Registro Tributario Unificado (RTU) Digital",
  "descripcion": "Trámite 100% digital para personas individuales y jurídicas para obtener su NIT.",
  "base_legal": "Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT 08-2020.",
  "url_oficial": "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-rtu-digital/",
  "etapa_ato": "empezar",
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
    "actualizado_por": "mesa_tecnica_sat",
    "fecha_revision": "2026-10-08T18:00:00Z"
  }
}
```

---

## 4. Patrones de Consulta en MongoDB

1. **Consulta directa de la gestión por su ID canónico inmutable:**
   ```javascript
   db.gestiones.findOne({ "_id": "rtu-inscripcion-digital" });
   ```
2. **Consulta inversa para obtener los "Siguientes Pasos" (0 riesgo de desincronización):**
   ```javascript
   db.gestiones.find({ "relaciones_proceso.prerrequisitos_ids": "rtu-inscripcion-digital" });
   ```
3. **Consulta de gestiones que aplican a un actor específico (Multikey):**
   ```javascript
   db.gestiones.find({ "actores_ids": "importadores", "auditoria.estado": "publicado" });
   ```
4. **Consulta automática de servicios afines por Familia Temática:**
   ```javascript
   db.gestiones.find(
     { "familias_ids": "fel", "_id": { "$ne": "fel-habilitacion-emisor" } },
     { "codigo": 1, "titulo": 1, "tipo_interaccion": 1, "url_oficial": 1 }
   ).limit(4);
   ```

---

## 5. Referencias y Documentación Relacionada

* **Skill Operativa:** [`.agents/skills/sat-content-relationships/SKILL.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/.agents/skills/sat-content-relationships/SKILL.md)
* **Skill de Auditoría y Sincronización:** [`.agents/skills/sat-ia-audit-sync/SKILL.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/.agents/skills/sat-ia-audit-sync/SKILL.md)
* **Taxpayer Journey:** [`docs/arquitectura-informacion/TAXPAYER_JOURNEY.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/arquitectura-informacion/TAXPAYER_JOURNEY.md)
