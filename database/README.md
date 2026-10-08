# Bases de Datos Oficiales del Portal SAT Guatemala

Este directorio contiene las bases de datos del catálogo maestro del Portal SAT (676 trámites oficiales), exportadas bajo dos paradigmas complementarios:

1. **NoSQL Documental (`sat_portal_nosql.json`)**: Ideal para frontend, APIs REST/GraphQL, Node.js, MongoDB, Elasticsearch y Firebase.
2. **SQL Dump Relacional (`sat_portal_dump.sql`)**: Estándar corporativo normalizado en 3ª Forma Normal (3NF) con claves foráneas, tablas pivote e índices para PostgreSQL, MySQL y MariaDB.

---

## 1. Archivo NoSQL Documental: `sat_portal_nosql.json`

### Estructura de cada documento:
Cada trámite existe **una sola vez** como un documento autónomo que contiene sus audiencias (`regimenes_aplicables`) y su área temática:

```json
{
  "_id": "contribuyentes-rtu-01",
  "codigo": "SAT-TR-0042",
  "titulo": "Actualización de Datos en el Registro Tributario Unificado (RTU)",
  "macro_grupo": {
    "id": "contribuyentes",
    "nombre": "Contribuyentes"
  },
  "regimenes_aplicables": [
    { "id": "nit-sin-obligaciones", "nombre": "NIT sin Obligaciones" },
    { "id": "pequenos-contribuyentes", "nombre": "Pequeños Contribuyentes" },
    { "id": "contribuyente-general", "nombre": "Contribuyente General" }
  ],
  "categoria_tematica": {
    "id": "registro-tributario-unificado-rtu-digital-y-agencia-virtual",
    "nombre": "Registro Tributario Unificado (RTU) Digital y Agencia Virtual"
  },
  "etapa_ciclo_vida": "Operación y Cumplimiento",
  "canal_atencion": "En Línea",
  "descripcion": "...",
  "base_legal": "Código Tributario (Decreto 6-91)",
  "url_oficial": "https://portal.sat.gob.gt"
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
