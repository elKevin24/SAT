---
name: sat-plain-language
description: >-
  Audita, redacta y estandariza textos en Lenguaje Claro (Plain Language), UX Writing ciudadano y
  terminología oficial del SAT Guatemala. Aplica la prohibición estricta de "trámite" (uso de "gestión"),
  expansión canónica de acrónimos en primera mención (RTU, FEL, NIT, DUCA, ISCV), fórmulas de titulación
  orientada a la acción (verbos en infinitivo o sustantivos directos), descripciones operativas en máximo
  2 oraciones y sustitución de jerga burocrática por lenguaje comprensible para el contribuyente.
  Úsalo cuando el usuario pida auditar textos, redactar microcopys, transformar jerga fiscal/aduanera a
  lenguaje ciudadano, revisar títulos/descripciones en allTramites.json o componentes de la interfaz.
---

# SAT Plain Language (Lenguaje Claro y UX Writing Ciudadano)

Especialización operativa para auditar, estandarizar y redactar todo contenido textual, microcopy, títulos, descripciones y documentación del Portal SAT bajo los estándares de **Lenguaje Claro (Plain Language ISO 24495-1)** y la normativa institucional de SAT Guatemala.

---

## 1. Reglas Inquebrantables de Terminología

### A. Prohibición Absoluta de "Trámite" / "Trámites"
- **Regla:** Queda terminantemente prohibido utilizar el término *"trámite"* o *"trámites"* en textos visibles, botones, encabezados, títulos, contadores, microcopys, badges y documentación ciudadana.
- **Término Institucional Obligatorio:** Usar siempre **"gestión" / "gestiones"**.
  - ❌ *"Catálogo de trámites aduaneros"* ➔  *"Catálogo de gestiones aduaneras"*
  - ❌ *"Trámites disponibles (24)"* ➔  *"Gestiones disponibles (24)"*
  - ❌ *"Realizar este trámite"* ➔  *"Iniciar esta gestión"* o *"Realizar esta gestión"*

### B. Expansión Canónica de Acrónimos (Cero Acrónimos Huérfanos)
Toda sigla o acrónimo tributario o aduanero debe expandirse en su **primera mención** dentro de cada título, tarjeta o sección de gestión:

| Acrónimo | Forma Canónica Obligatoria (Primera Mención) |
| :--- | :--- |
| **NIT** | `Número de Identificación Tributaria (NIT)` |
| **RTU** | `Registro Tributario Unificado (RTU)` |
| **FEL** | `Factura Electrónica (FEL)` |
| **ISCV** | `Impuesto de Circulación de Vehículos (ISCV)` |
| **DUCA** | `Declaración Única Centroamericana (DUCA - Aduanas)` |
| **AFPA** | `Auxiliares de la Función Pública Aduanera (AFPA)` o `Agentes de aduanas, transporte y logística (AFPA)` |
| **RFV** | `Registro Fiscal de Vehículos (RFV)` |
| **OEA** | `Operador Económico Autorizado (OEA - Empresa Certificada en Seguridad)` |
| **CUI / DPI** | `Número de DPI (Código Único de Identificación)` |
| **SOFI** | `Solvencia Fiscal en Línea (SOFI)` |
| **IVA** | `Impuesto al Valor Agregado (IVA)` |
| **ISR** | `Impuesto Sobre la Renta (ISR)` |
| **SAT-GES-####**| Identificador canónico inmutable de la gestión (uso técnico y de referencia). |

---

## 2. Fórmulas de Redacción y Estructura

### A. Títulos Orientados a la Acción (Action-Oriented Titles)
Los títulos deben reflejar la intención del contribuyente, no el nombre del departamento administrativo:
1. **Con verbo en infinitivo:** Priorizar verbos directos que indiquen la tarea.
   - *"Solicitar mi Número de Identificación Tributaria (NIT)"*
   - *"Emitir Factura Electrónica (FEL)"*
   - *"Actualizar datos en el Registro Tributario Unificado (RTU)"*
   - *"Pagar el Impuesto de Circulación de Vehículos (ISCV)"*
2. **Con sustantivo directo y preciso:** Cuando se trata de un concepto central o servicio continuo.
   - *"Número de Identificación Tributaria (NIT)"*
   - *"Solvencia Fiscal en Línea (SOFI)"*
   - *"Consulta de vehículos con orden de captura"*

### B. Fórmula de Descripción Concisa (Máximo 2 Oraciones)
Las descripciones en tarjetas (`cards`) y cabeceras deben responder a la fórmula de 2 oraciones:
$$\text{Descripción} = \underbrace{\text{Oración 1: ¿Qué es o para qué sirve?}}_{\text{Definición clara y operativa}} + \underbrace{\text{Oración 2: ¿Qué beneficio obtiene o qué necesita?}}_{\text{Acción, prerrequisito o resultado}}$$

> **Ejemplo Benchmark:**  
> *"Cómo solicitar un Número de Identificación Tributaria (NIT), actualizar sus datos y consultar su estado tributario. Permite operar legalmente, emitir facturas y acceder a los servicios de la Agencia Virtual."*

---

## 3. Matriz de Sustitución de Jerga Burocrática

| Jerga Administrativa / Fiscal Interna | Término Ciudadano Aprobado (UX Writing) |
| :--- | :--- |
| *Sujeto Pasivo / Contribuyente afecto* | *Personas y empresas con o sin negocio* |
| *Omisos tributarios* | *Consultar pagos o declaraciones pendientes* |
| *Régimen de Rentas del Trabajo* | *Impuestos para personas con empleo o salario en relación de dependencia* |
| *Distintivos electrónicos del Registro Fiscal* | *Tarjeta de circulación y calcomanía vehicular* |
| *Transacción de cambio de régimen* | *Paso de persona sin negocio a persona con negocio* |
| *Auxiliares de la Función Pública Aduanera* | *Agentes de aduanas, transportistas y operadores logísticos* |
| *Constancia de Adquisición de Insumos* | *Constancia de compra libre de impuestos para entidades exentas* |
| *Acreditamiento de tributos* | *Aplicar crédito fiscal a favor* |
| *Inscripción per se* | *Inscripción formal de oficio o voluntaria* |
| *Despacho aduanero de mercancías* | *Revisión y salida de mercancías en aduana* |

---

## 4. Bucle de Verificación y Auditoría de Contenido

Al redactar o auditar textos en JSON (`src/data/allTramites.json`), componentes React o documentación:

1. **Escaneo de palabras prohibidas:**
   - Buscar regex `\btr[aá]mites?\b` (case-insensitive) y reemplazar por `gestión` / `gestiones`.
2. **Validación de acrónimos:**
   - Verificar que acrónimos como RTU, FEL, NIT, DUCA, ISCV no aparezcan aislados en su primera mención.
3. **Validación de longitud de descripciones:**
   - Confirmar que las descripciones de tarjetas no excedan 2 oraciones ni sobrecarguen cognitivamente al lector.
4. **Verificación de tono:**
   - Tono empático, facilitador, no sancionatorio y orientado al cumplimiento voluntario.
