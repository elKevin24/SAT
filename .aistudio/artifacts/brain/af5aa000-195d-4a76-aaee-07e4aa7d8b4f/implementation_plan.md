# Plan de Acción Revisado: Diagnóstico de Páginas Existentes y Pasos Siguientes

Con base en la lista de páginas actualmente creadas en tu panel de WordPress, se ha realizado una auditoría contra el **Plan Maestro de 160 Páginas** (`docs/PLAN_CREACION_PAGINAS_WORDPRESS.md`).

---

## 1. Diagnóstico del Estado Actual en tu WordPress

Tienes **15 páginas creadas** (11 publicadas con jerarquía correcta, 1 publicada en Nivel 2 y 3 borradores huérfanos que requieren ajuste de página superior).

### A. Rama `Contribuyentes` (Excelente avance — 10 páginas)
La jerarquía de **Pequeños Contribuyentes** y **Sin Obligaciones** está perfectamente estructurada:
- ✅ `Contribuyentes` (Nivel 1 — Raíz)
  - ✅ `Sin Obligaciones` (Nivel 2 — Padre: `Contribuyentes` | Lista compactada de 10 gestiones)
  - ✅ `Pequeños Contribuyentes` (Nivel 2 — Padre: `Contribuyentes`)
    - ✅ `Régimen Agropecuario y Productores` (Nivel 3 — Padre: `Pequeños Contribuyentes`)
    - ✅ `Régimen Pequeño Contribuyente` (Nivel 3 — Padre: `Pequeños Contribuyentes`)
      - ✅ `Inscripción y cambios de régimen` (Nivel 4 — Padre: `Régimen Pequeño Contribuyente`)
      - ✅ `Normativa y devoluciones` (Nivel 4 — Padre: `Régimen Pequeño Contribuyente`)
      - ✅ `Obligaciones y operación` (Nivel 4 — Padre: `Régimen Pequeño Contribuyente`)
  - ⚠️ `Contribuyente General` (Nivel 2 — Publicada, pero **aún no tiene sus 8 páginas hijas de Nivel 3**)
  - ⚠️ `Contribuyentes Especiales` (Nivel 2 — Publicada, pero **aún no tiene sus 3 páginas hijas de Nivel 3**)

### B. Rama `Profesionales` (5 páginas — Requieren ajuste de jerarquía)
- ✅ `Profesionales` (Nivel 1 — Raíz)
  - ✅ `Abogados y Notarios` (Nivel 2 — Padre: `Profesionales` | Faltan sus 4 páginas hijas de Nivel 3)
  - ⚠️ `Auditores (CPA)` (**Borrador Huérfano**): Debe asignarse como Página Superior: `Profesionales` y publicarse con slug `auditores`.
  - ⚠️ `Peritos Contadores` (**Borrador Huérfano**): Debe asignarse como Página Superior: `Profesionales` y publicarse con slug `peritos-contadores`.
  - ⚠️ `Gestores Tributarios` (**Borrador Huérfano**): Debe asignarse como Página Superior: `Profesionales` y publicarse con slug `gestores-tributarios`.
  - ❌ *Falta en Nivel 2:* `Servicios Profesionales` (slug: `servicios-profesionales`).

---

## 2. Hoja de Ruta Priorizada de Próximos Pasos

Para mantener el orden de arriba hacia abajo (Padres $\to$ Hijos) y evitar enlaces rotos o breadcrumbs desconectados, este es el orden de ejecución recomendado:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOJA DE RUTA PRIORIZADA                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
  PASO 1: Sanear Borradores de N2 en Profesionales (3 asignaciones)
  ├── Auditores (CPA) ➔ Superior: Profesionales
  ├── Peritos Contadores ➔ Superior: Profesionales
  ├── Gestores Tributarios ➔ Superior: Profesionales
  └── Crear: Servicios Profesionales
                                    │
  PASO 2: Completar Hijas de Contribuyente General (8 páginas N3)
  ├── 2.1 Inscripción y actualización en el RTU
  ├── 2.2 Facturación electrónica y documentos tributarios
  ├── 2.3 Declaraciones, pagos y solvencias
  ├── 2.4 Devoluciones y créditos fiscales
  ├── 2.5 Regímenes tributarios
  ├── 2.6 Vehículos (como propietario)
  ├── 2.7 Servicios y gestiones al contribuyente
  └── 2.8 Cultura tributaria y capacitación
                                    │
  PASO 3: Completar Hijas de Contribuyentes Especiales (3 páginas N3)
  ├── 3.1 Gerencias Especiales y Control Tributario
  ├── 3.2 Declaraciones e Informes Especiales
  └── 3.3 Capacitación y Orientación Diferenciada
                                    │
  PASO 4: Completar Hijas de Abogados y Notarios (4 páginas N3)
  ├── 4.1 Habilitación y Registro Notarial
  ├── 4.2 Timbres Fiscales y Papel Sellado de Protocolo
  ├── 4.3 Traspaso Electrónico Vehicular (e-Traspaso)
  └── 4.4 Avisos Notariales y Fe Pública
                                    │
  PASO 5: Crear las 7 Páginas Troncales de OLA 0 (Portada y Procesos)
  ├── Portada: Inicio (/)
  └── 6 Procesos Conectados: solicitar-nit, actualizar-rtu, fel, solvencia, etc.
                                    │
  PASO 6: Crear las 2 Ramas Raíz Restantes de Nivel 1
  ├── Operadores de Comercio Exterior (/operadores-de-comercio-exterior/)
  └── Entes Exentos (/entes-exentos/)
```

---

## 3. Guía Detallada de Archivos y Slugs para la Ejecución Inmediata

### Paso 1: Ajustar los 3 Borradores y Crear N2 Faltante en Profesionales
En tu WordPress, en cada una de estas páginas haz clic en **Edición rápida**:

| Página | Acción en WP | Página Superior | Slug (`post_name`) | Archivo Plantilla `.txt` |
| :--- | :--- | :--- | :--- | :--- |
| **Auditores (CPA)** | Asignar superior y Publicar | `Profesionales` | `auditores` | `profesionales/N2_auditores.txt` |
| **Peritos Contadores** | Asignar superior y Publicar | `Profesionales` | `peritos-contadores` | `profesionales/N2_peritos-contadores.txt` |
| **Gestores Tributarios** | Asignar superior y Publicar | `Profesionales` | `gestores-tributarios` | `profesionales/N2_gestores-tributarios.txt` |
| **Servicios Profesionales** | Crear nueva página | `Profesionales` | `servicios-profesionales` | `profesionales/N2_servicios-profesionales.txt` |

---

### Paso 2: Las 8 Páginas de Nivel 3 bajo `Contribuyente General`
Crea estas 8 páginas seleccionando siempre como **Página Superior: `Contribuyente General`**:

| # | Título de la Página | Slug en WP | Página Superior | URL Resultante | Archivo Plantilla en `docs/plantillas-wpbakery/` |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | **Inscripción y actualización en el RTU** | `inscripcion-y-actualizacion-en-el-rtu` | `Contribuyente General` | `/contribuyentes/contribuyente-general/inscripcion-y-actualizacion-en-el-rtu/` | `contribuyentes/contribuyente-general/N3_inscripcion-y-actualizacion-en-el-rtu.txt` |
| 2 | **Facturación electrónica y documentos tributarios** | `facturacion-electronica-y-documentos-tributarios` | `Contribuyente General` | `/contribuyentes/contribuyente-general/facturacion-electronica-y-documentos-tributarios/` | `contribuyentes/contribuyente-general/N3_facturacion-electronica-y-documentos-tributarios.txt` |
| 3 | **Declaraciones, pagos y solvencias** | `declaraciones-pagos-y-solvencias` | `Contribuyente General` | `/contribuyentes/contribuyente-general/declaraciones-pagos-y-solvencias/` | `contribuyentes/contribuyente-general/N3_declaraciones-pagos-y-solvencias.txt` |
| 4 | **Devoluciones y créditos fiscales** | `devoluciones-y-creditos-fiscales` | `Contribuyente General` | `/contribuyentes/contribuyente-general/devoluciones-y-creditos-fiscales/` | `contribuyentes/contribuyente-general/N3_devoluciones-y-creditos-fiscales.txt` |
| 5 | **Regímenes tributarios** | `regimenes-tributarios` | `Contribuyente General` | `/contribuyentes/contribuyente-general/regimenes-tributarios/` | `contribuyentes/contribuyente-general/N3_regimenes-tributarios.txt` |
| 6 | **Vehículos (como propietario)** | `vehiculos-como-propietario` | `Contribuyente General` | `/contribuyentes/contribuyente-general/vehiculos-como-propietario/` | `contribuyentes/contribuyente-general/N3_vehiculos-como-propietario.txt` |
| 7 | **Servicios y gestiones al contribuyente** | `servicios-y-gestiones-al-contribuyente` | `Contribuyente General` | `/contribuyentes/contribuyente-general/servicios-y-gestiones-al-contribuyente/` | `contribuyentes/contribuyente-general/N3_servicios-y-gestiones-al-contribuyente.txt` |
| 8 | **Cultura tributaria y capacitación** | `cultura-tributaria-y-capacitacion` | `Contribuyente General` | `/contribuyentes/contribuyente-general/cultura-tributaria-y-capacitacion/` | `contribuyentes/contribuyente-general/N3_cultura-tributaria-y-capacitacion.txt` |

---

### Paso 3: Las 3 Páginas de Nivel 3 bajo `Contribuyentes Especiales`
Página Superior: `Contribuyentes Especiales`:

| # | Título de la Página | Slug en WP | URL Resultante | Archivo Plantilla |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Gerencias Especiales y Control Tributario** | `gerencias-especiales-y-control-tributario` | `/contribuyentes/contribuyentes-especiales/gerencias-especiales-y-control-tributario/` | `contribuyentes/contribuyentes-especiales/N3_gerencias-especiales-y-control-tributario.txt` |
| 2 | **Declaraciones e Informes Especiales** | `declaraciones-e-informes-especiales` | `/contribuyentes/contribuyentes-especiales/declaraciones-e-informes-especiales/` | `contribuyentes/contribuyentes-especiales/N3_declaraciones-e-informes-especiales.txt` |
| 3 | **Capacitación y Orientación Diferenciada** | `capacitacion-y-orientacion-diferenciada` | `/contribuyentes/contribuyentes-especiales/capacitacion-y-orientacion-diferenciada/` | `contribuyentes/contribuyentes-especiales/N3_capacitacion-y-orientacion-diferenciada.txt` |

---

### Paso 4: Las 4 Páginas de Nivel 3 bajo `Abogados y Notarios`
Página Superior: `Abogados y Notarios`:

| # | Título de la Página | Slug en WP | URL Resultante | Archivo Plantilla |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **Habilitación y Registro Notarial** | `habilitacion-y-registro-notarial` | `/profesionales/abogados-y-notarios/habilitacion-y-registro-notarial/` | `profesionales/abogados-y-notarios/N3_habilitacion-y-registro-notarial.txt` |
| 2 | **Timbres Fiscales y Papel Sellado de Protocolo** | `timbres-fiscales-y-papel-sellado-de-protocolo` | `/profesionales/abogados-y-notarios/timbres-fiscales-y-papel-sellado-de-protocolo/` | `profesionales/abogados-y-notarios/N3_timbres-fiscales-y-papel-sellado-de-protocolo.txt` |
| 3 | **Traspaso Electrónico Vehicular (e-Traspaso)** | `traspaso-electronico-vehicular-e-traspaso` | `/profesionales/abogados-y-notarios/traspaso-electronico-vehicular-e-traspaso/` | `profesionales/abogados-y-notarios/N3_traspaso-electronico-vehicular-e-traspaso.txt` |
| 4 | **Avisos Notariales y Fe Pública** | `avisos-notariales-y-fe-publica` | `/profesionales/abogados-y-notarios/avisos-notariales-y-fe-publica/` | `profesionales/abogados-y-notarios/N3_avisos-notariales-y-fe-publica.txt` |

---

### Paso 5: OLA 0 — Portada y los 6 Procesos Universales Conectados
Todas van **(Sin superior — Nivel Raíz)**:

| # | Título de la Página | Slug en WP | URL | Archivo Plantilla |
| :---: | :--- | :--- | :--- | :--- |
| 0.1 | **Inicio** (Portada) | `inicio` | `/` | `HOME_portada-portal-sat.txt` |
| 0.2 | **Solicitar Número de Identificación Tributaria (NIT)** | `solicitar-nit` | `/solicitar-nit/` | `procesos-conectados/G_solicitar-nit.txt` |
| 0.3 | **Actualizar o Ratificar Datos en el RTU Digital** | `actualizar-rtu` | `/actualizar-rtu/` | `procesos-conectados/G_actualizar-rtu.txt` |
| 0.4 | **Habilitación y Emisión de Factura Electrónica en Línea (FEL)** | `factura-electronica-fel` | `/factura-electronica-fel/` | `procesos-conectados/G_factura-electronica-fel.txt` |
| 0.5 | **Solicitud y Emisión de Solvencia Fiscal en Línea** | `solvencia-fiscal` | `/solvencia-fiscal/` | `procesos-conectados/G_solvencia-fiscal.txt` |
| 0.6 | **Traspaso Electrónico de Vehículos en Línea (e-Traspaso)** | `traspaso-vehiculos` | `/traspaso-vehiculos/` | `procesos-conectados/G_traspaso-vehiculos.txt` |
| 0.7 | **Inscripción y Activación en el Padrón de Importadores** | `padron-importadores` | `/padron-importadores/` | `procesos-conectados/G_padron-importadores.txt` |

---

## 4. Herramienta Recomendada para Copiado Rápido

Para no abrir manualmente cada archivo `.txt`:
- Abre la app en **`http://localhost:3000/#/wpbakery`**.
- Dispondrás de un buscador interactivo por página con botones de copiado con un solo clic de **Título**, **Slug**, **Página Superior** y **Código Shortcode WPBakery**.
