# Guía de Uso de Maquila WPBakery — Comercio Exterior (SAT)

Esta guía define el estándar operativo del kit de **6 arquetipos maestros** para construir las páginas de **Operadores de Comercio Exterior** en WordPress + WPBakery Page Builder (`Portfolio - list` / `elementor_header_footer`).

---

## 1. Principios de Producción y Reglas Inquebrantables

1. **Cero invención y cero herencia ciega:** Todo contenido se extrae primero desde la URL oficial vigente en `portal.sat.gob.gt`, validando enlaces de descarga, fechas de corte y correos reales (sin `[email protected]`).
2. **Lenguaje ciudadano (ATO + NN/g):**
   - `H1` claro en *Sentence case* (verbo en infinitivo en las primeras 3 palabras para gestiones, o nombre claro del servicio/régimen en Hubs).
   - Bajada inicial de máximo **2 oraciones** (qué es / para qué sirve + qué obtiene o necesita).
   - Prohibición estricta de utilizar el término no permitido en textos visibles, botones o encabezados: usar siempre **"gestión" / "gestiones"** o el verbo directo de acción.
   - Expandir toda sigla en su **primera mención** (`Declaración Única Centroamericana (DUCA - Aduanas)`, `Operador Económico Autorizado (OEA - Empresa Certificada)`, `Auxiliares de la Función Pública Aduanera (AFPA)`, `Registro Tributario Unificado (RTU)`, `Número de Identificación Tributaria (NIT)`).
   - Cero contadores en títulos de acordeones o tarjetas (`Tema X de Y`).
   - Base legal al pie en acordeón colapsable (`active_section="0"`) **únicamente** cuando la página original la incluye.
3. **Shortcodes 100% nativos (0% `[vc_raw_html]`):**
   - Línea 1 obligatoria: `[vc_row][vc_column][dt_breadcrumbs font_style="italic:normal:none" alignment="left"][vc_separator][/vc_column][/vc_row]`.
   - Contenedor raíz único: `[vc_row el_class="sat-mq"]`.
   - Acordeones cerrados por defecto: `active_section="0"`.
   - Tarjetas `[bsf-info-box]` siempre con `icon_type="none"`.
   - URLs dentro de `link="url:..."` siempre codificadas (`https%3A%2F%2F...`, con `||target:%20_blank|` para enlaces externos o documentos).

---

## 2. Catálogo de los 6 Arquetipos Maestros

| Código | Plantilla | Base validada | Cuándo usar |
| :--- | :--- | :--- | :--- |
| **TIPO-1** | `TIPO-1_ficha-gestion-requisitos.txt` | `FEL_emisor-dte` | Gestiones operativas con requisitos (`1/3`), pasos en `.sat-mq-panel`, botón CTA, continuidad y manuales/normativa opcionales. |
| **TIPO-2** | `TIPO-2_puente-aplicativo-buscador.txt` | Nuevo diseño compacto | Puentes de 1 pantalla hacia buscadores, consultas en línea, cursos virtuales, software o descargas directas (PDF/ZIP/XLSX). |
| **TIPO-3** | `TIPO-3_hub-desglose-megapagina.txt` | `FEL_hub-principal` | Páginas madre con tarjetas `[bsf-info-box]` (modo `hub`) o páginas limpias extraídas desde un acordeón `#ancla` de mega-página (modo `desglose_ancla`). |
| **TIPO-4** | `TIPO-4_directorio-tabla-tecnica.txt` | `FEL_certificadores` / `FEL_documentacion-tecnica` | Directorios, listados, tablas comparativas, esquemas XSD/EDI y especificaciones técnicas con tabla HTML semántica. |
| **TIPO-5** | `TIPO-5_normativa-criterio-legal.txt` | Nuevo diseño ciudadano | Compendios normativos: resumen ciudadano al inicio + tabla de vigencia + acordeones por tipo de instrumento con enlaces `(PDF)`. |
| **TIPO-6** | `TIPO-6_preguntas-frecuentes-faq.txt` | `FEL_preguntas-frecuentes` | Preguntas frecuentes agrupadas por `H2` directo con `.sat-mq-section` y `[vc_tta_accordion active_section="0"]`. |

---

## 3. Flujo en WordPress (Importante para Tablas TinyMCE-Safe)

1. Pegar el contenido de `<slug>_wpbakery.txt` en la vista **Modo Clásico -> Texto** del editor WPBakery.
2. Pegar el contenido de `<slug>_custom.css` (o `sat-maquila-base.css`) en **WPBakery -> Configuración de página (ícono engranaje) -> CSS personalizado**.
3. **Protección de tablas en `TIPO-4` y `TIPO-5`:**
   - Las tablas viven dentro de `[vc_column_text el_class="sat-mq-table-box"]<table>...</table>[/vc_column_text]`.
   - Si TinyMCE limpia atributos del tag `<table>` al alternar entre `Visual` y `Texto`, las reglas de `sat-maquila-base.css` apuntan directamente al selector descendiente `.sat-mq .sat-mq-table-box table`, preservando bordes, tipografía, hover y scroll horizontal móvil sin depender de plugins externos.

---

## 4. Compilación Automática y Auditoría

1. Redactar un lote JSON estructurado siguiendo el esquema de `ejemplo_sintetico_6_tipos.json` (solo datos verificados de la fuente oficial).
2. Compilar a shortcodes + CSS:
   ```powershell
   python scripts/generate_maquila_batch.py --input ruta/al/lote.json --output-dir docs/maquila-paginas/lotes/ola-1
   ```
3. Ejecutar prueba sintética de los 6 arquetipos sin crear archivos de páginas reales:
   ```powershell
   python scripts/generate_maquila_batch.py --dry-run
   ```
4. Auditar inventario, plantillas maestras y lotes generados antes de subir a WordPress:
   ```powershell
   python scripts/audit_maquila_ce.py
   ```
