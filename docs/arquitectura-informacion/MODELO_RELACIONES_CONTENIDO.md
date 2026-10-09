# Modelo de Relaciones de Contenido y Grafos Temáticos — Portal SAT Guatemala

Este documento establece la especificación técnica y de arquitectura de información para el modelado de **relaciones de proceso, familias temáticas y polijerarquía** de las **gestiones** del Portal SAT en la base de datos NoSQL (MongoDB) y su consumo en el frontend.

---

## 1. Justificación y Adopción Terminológica

### 1.1 De "Trámites" a "Gestiones"
En la administración tributaria y aduanera de Guatemala, el concepto "trámite" resulta restrictivo, pues exige la existencia de un expediente administrativo o solicitud bilateral. 
El portal contiene adicionalmente verificadores públicos, guías de requisitos, descargas de componentes y consultas en tiempo real. Por ello, la unidad atómica de contenido se denomina **Gestión**:
* **Código Oficial:** `SAT-GES-####`
* **Identificador Canónico:** `ges-[segmento]-[slug]`
* **Colección NoSQL:** `gestiones`

### 1.2 Principio de Navegación Contextual (Web of Services)
Los usuarios no interactúan con el portal exclusivamente mediante árboles de carpetas. Siguiendo las directrices del **Taxpayer Journey** y los estándares de **GOV.UK**, cada gestión ofrece dos dimensiones de conexión contextual:
1. **Dimensión de Flujo / Proceso (Secuencial):** Qué se necesita antes (prerrequisito) y qué se debe hacer después (siguiente paso en el ciclo de vida ATO).
2. **Dimensión Temática (Cluster Horizontal):** Qué otros servicios pertenecen a la misma familia de soluciones (ej. ecosistema FEL, Vehículos, RTU, DUCAs).

---

## 2. Las Dos Capas Ortogonales de Relación

### Capa A: Relaciones de Proceso / Secuenciales
* `prerrequisito`: Gestión previa obligatoria (ej. tener Agencia Virtual antes de actualizar RTU).
* `siguiente_paso`: Continuidad lógica en el ciclo de vida tributario (ej. inscribir NIT $\rightarrow$ habilitar FEL).
* `herramienta_apoyo`: Verificador o simulador auxiliar (ej. Verificador de DTE o Arancel Integrado).
* `normativa_asociada`: Base legal, criterio institucional o resolución vinculante.

### Capa B: Familias Temáticas Canónicas (Clusters)
Campos indexados para resolución automática sin enlaces manuales:
* **Factura Electrónica en Línea (FEL)**
* **Registro Fiscal de Vehículos (RFV)**
* **Registro Tributario Unificado (RTU) Digital**
* **Declaraciones Aduaneras y DUCAs**
* **Regímenes Especiales y Maquilas (Decreto 29-89)**
* **Zonas de Desarrollo Económico Especial Público (ZDEEP)**
* **Auxiliares de la Función Pública Aduanera (AFPA)**

---

## 3. Modelo NoSQL en MongoDB (3 Colecciones)

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
  "_id": "ges-trib-rtu-digital",
  "codigo": "SAT-GES-0015",
  "titulo": "Inscripción en el Registro Tributario Unificado (RTU) Digital",
  "descripcion": "Trámite 100% digital para personas individuales y jurídicas para obtener su NIT.",
  "base_legal": "Código Tributario (Decreto 6-91, Art. 120) y Acuerdo de Directorio SAT 08-2020.",
  "url_oficial": "https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-rtu-digital/",
  "etapa_ato": "Empezar y registrarse",
  "tipo_interaccion": "servicio_transaccional",
  "familia_tematica": "Registro Tributario Unificado (RTU) Digital",
  "actores_aplicables": [
    "nit-sin-obligaciones",
    "pequenos-contribuyentes",
    "contribuyente-general",
    "profesionales-independientes"
  ],
  "relaciones_proceso": [
    {
      "gestion_id": "ges-trib-agencia-virtual",
      "tipo_relacion": "prerrequisito",
      "titulo": "Solicitud y Activación de Agencia Virtual",
      "descripcion_corta": "Requisito previo obligatorio para autenticación."
    },
    {
      "gestion_id": "ges-trib-fel-habilitacion",
      "tipo_relacion": "siguiente_paso",
      "titulo": "Habilitación como Emisor de Factura Electrónica en Línea (FEL)",
      "descripcion_corta": "Paso posterior obligatorio para quienes tengan actividad mercantil."
    }
  ],
  "control_auditoria": "APROBADO"
}
```

### Colección 3: `arbol_navegacion` (Estructura de Menús UI)
Almacena los nodos jerárquicos de navegación (N1 a N4) que apuntan a los IDs de las gestiones, permitiendo que la interfaz renderice carpetas, breadcrumbs y menús laterales de forma instantánea.

---

## 4. Patrones de Consulta en MongoDB

1. **Consulta directa de la gestión y sus prerrequisitos/siguientes pasos (0 ms overhead):**
   ```javascript
   db.gestiones.findOne({ "_id": "ges-trib-rtu-digital" });
   ```
2. **Consulta automática de servicios afines por Familia Temática:**
   ```javascript
   db.gestiones.find(
     { "familia_tematica": "Factura Electrónica en Línea (FEL)", "_id": { "$ne": "ges-trib-fel-habilitacion" } },
     { "codigo": 1, "titulo": 1, "tipo_interaccion": 1, "url_oficial": 1 }
   ).limit(4);
   ```

---

## 5. Referencias y Documentación Relacionada

* **Skill Operativa:** [`.agents/skills/sat-content-relationships/SKILL.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/.agents/skills/sat-content-relationships/SKILL.md)
* **Skill de Auditoría y Sincronización:** [`.agents/skills/sat-ia-audit-sync/SKILL.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/.agents/skills/sat-ia-audit-sync/SKILL.md)
* **Taxpayer Journey:** [`docs/arquitectura-informacion/TAXPAYER_JOURNEY.md`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/arquitectura-informacion/TAXPAYER_JOURNEY.md)
