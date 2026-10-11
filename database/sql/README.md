# Base de Datos Relacional SQL — Portal SAT Guatemala

Este directorio contiene los entregables del modelo de base de datos relacional (SQL) normalizado en 3ª Forma Normal (3NF), diseñado para PostgreSQL, MySQL, MariaDB y SQLite.

---

## 🏛️ Estructura del Modelo Relacional

El modelo desacopla formalmente las entidades de contenido y la jerarquía de navegación:

1. **`macro_grupos` (Nivel 1):**
   - 4 macro grupos oficiales: Contribuyentes, Operadores de Comercio Exterior, Entes Exentos y Profesionales.
2. **`regimenes_nivel_2` (Nivel 2):**
   - 13 regímenes y clasificaciones tributarias/aduaneras oficiales.
3. **`categorias_nivel_3` (Nivel 3):**
   - Áreas temáticas y subcategorías normadas sin acrónimos aislados.
4. **`tramites` / `gestiones`:**
   - 683 trámites/gestiones canónicas con identificador institucional inmutable `SAT-GES-####`, nombre oficial en lenguaje ciudadano, descripción, URL activa, tipo de interacción y base legal.
5. **`tramite_regimen` (Tabla intermedia pivote N:M):**
   - Resuelve la polijerarquía y la transversalidad (18 contenidos compartidos entre múltiples audiencias) sin duplicar texto.
6. **`vw_tramites_portal` (Vista relacional consolidada):**
   - Resuelve el árbol completo desnormalizado de 716 proyecciones con orden canónico $N_1$ a $N_5$ para reportes y APIs.

---

## 💾 Archivos Disponibles

* **`sat_portal_dump.sql`**: Script DDL y DML estándar compatible con PostgreSQL y MySQL.
* **`sat_portal.db`**: Base de datos SQLite compilada para consultas locales rápidas.

---

## 🚀 Instrucciones de Importación

### PostgreSQL:
```bash
psql -U usuario -d nombre_bd -f database/sql/sat_portal_dump.sql
```

### MySQL / MariaDB:
```bash
mysql -u usuario -p nombre_bd < database/sql/sat_portal_dump.sql
```

### SQLite (inspección local):
```bash
sqlite3 database/sql/sat_portal.db "SELECT count(*) FROM tramites;"
```
