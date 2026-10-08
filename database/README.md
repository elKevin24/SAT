# Bases de Datos Oficiales del Portal SAT Guatemala

Este directorio contiene las bases de datos del catálogo maestro del Portal SAT, exportadas bajo dos paradigmas complementarios:

1. **NoSQL Documental (`sat_portal_nosql.json`)**: 683 contenidos únicos desacoplados con matriz de audiencias, ideal para frontend, Headless CMS, APIs REST/GraphQL, MongoDB, Elasticsearch y Firebase.
2. **SQL Dump Relacional (`sat_portal_dump.sql`)**: Estándar corporativo normalizado en 3ª Forma Normal (3NF) con claves foráneas, tablas pivote e índices para PostgreSQL, MySQL y MariaDB.

---

## 1. Archivo NoSQL Documental: `sat_portal_nosql.json`

### Estructura de cada documento (683 contenidos únicos):
Cada trámite, guía o servicio existe **una sola vez** como un documento autónomo. Las ramas o categorías donde se publica se definen en el array polijerárquico `audiencias`:

```json
{
  "id": "cnt-contribuyentes-54",
  "codigo": "SAT-CNT-0042",
  "idOriginal": "contribuyentes-54",
  "titulo": "Actualización de Datos en el Registro Tributario Unificado (RTU)",
  "nombreActual": "Actualización de Datos en el Registro Tributario Unificado (RTU)",
  "descripcion": "Requisitos y pasos para actualizar tu información personal, domicilio fiscal y actividad económica en el RTU Digital.",
  "url": "https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/",
  "tipoInteraccion": "servicio_transaccional",
  "tipoInteraccionLabel": "Trámite / Aplicativo en Línea",
  "tipologiaContenido": "guia_requisitos",
  "tipologiaContenidoLabel": "Guía Informativa / Texto",
  "plataformaSistema": "portal_web",
  "plataformaSistemaLabel": "Portal Web SAT",
  "canalAtencion": "Digital / Web",
  "etapaAto": "modificar_cerrar",
  "etapaAtoLabel": "Modificaciones y cierre",
  "baseLegal": "Código Tributario y Leyes Aplicables",
  "esBrecha": false,
  "esTransversal": false,
  "totalAudiencias": 1,
  "audiencias": [
    {
      "tramiteId": "contribuyentes-54",
      "segmentoId": "contribuyentes",
      "segmentoNombre": "Contribuyentes",
      "categoria": "NIT sin Obligaciones",
      "subcategoria": "Registro Tributario Unificado (RTU)",
      "tema": "Constancias y gestiones del RTU",
      "subtema": "Requisitos de persona/empresa",
      "actorEspecifico": "—",
      "migaBreadcrumb": "Contribuyentes > NIT sin Obligaciones > Registro Tributario Unificado (RTU) > Actualización de Datos en el RTU"
    }
  ],
  "segmentosAplicables": ["contribuyentes"],
  "categoriasAplicables": ["NIT sin Obligaciones"],
  "perfilDestinatario": "Ciudadanos y empresas"
}
```

### Importación en MongoDB:
```bash
mongoimport --db sat_portal --collection tramites --file database/sat_portal_nosql.json --jsonArray
```

---

## 2. Archivo SQL Dump Relacional: `sat_portal_dump.sql`

### Estructura del Modelo Relacional:
- `macro_grupos` (Nivel 1): 4 macro grupos.
- `regimenes_nivel_2` (Nivel 2): 13 regímenes/segmentos oficiales.
- `categorias_nivel_3` (Nivel 3): Áreas temáticas con nombres completos (sin siglas aisladas).
- `tramites`: 676 trámites oficiales.
- `tramite_regimen`: Tabla intermedia N:M que resuelve la polijerarquía sin redundancia de texto.
- `vw_tramites_portal`: Vista que desnormaliza automáticamente para consultas y reportes.

### Importación en PostgreSQL:
```bash
psql -U usuario -d nombre_bd -f database/sat_portal_dump.sql
```

### Importación en MySQL / MariaDB:
```bash
mysql -u usuario -p nombre_bd < database/sat_portal_dump.sql
```

---

## 3. Principios de Arquitectura Aplicados
1. **Cero acrónimos aislados:** Todos los títulos y categorías temáticas despliegan su nombre completo formal (ej. *Registro Tributario Unificado (RTU)*, *Factura Electrónica en Línea (FEL)*).
2. **Cero jerga interna para el ciudadano:** Se eliminaron etiquetas técnicas como 'compartido' o 'transversal' de las categorías públicas.
3. **Integridad referencial estricta:** Relación formal de Nivel 1, Nivel 2 y Nivel 3.
