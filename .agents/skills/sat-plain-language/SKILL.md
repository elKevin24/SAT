---
name: sat-plain-language
description: >-
  Audita, redacta, refactoriza y valida textos en Lenguaje Claro, UX Writing ciudadano y microcopy
  del Portal SAT Guatemala bajo los estándares metodológicos de ATO (Australia), Nielsen Norman Group
  (NN/g), Microsoft Style Guide, Google Material Design y directrices maestras SAT. Aplica la prohibición
  estricta de "trámite" (uso obligatorio de "gestión"), front-loading en primeras 3 palabras, corte del 50%
  de relleno burocrático, separación de leyes en capa colapsable secundaria, expansión obligatoria de siglas
  en 1.ª mención, mensajes de error sin culpa al usuario y botones de acción que predicen el resultado.
  Úsalo al auditar textos, redactar microcopys, transformar jerga fiscal/aduanera a lenguaje ciudadano,
  revisar títulos/requisitos en allTramites.json o componentes React/Tailwind.
---

# SAT Plain Language (Agente de Lenguaje Claro y UX Writing Ciudadano)

Brazo ejecutor de la metodología oficial documentada en [`docs/diseno-normativa/GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md`](../../../docs/diseno-normativa/GUIA_METODOLOGICA_LENGUAJE_CLARO_PERSONAS.md). Su misión es auditar, reescribir y validar contenidos en datasets (`src/data/allTramites.json`), componentes React (`src/components/`, `src/pages/`) y documentación institucional.

---

## 1. El Marco Metodológico (Pilares de Ejecución del Agente)

El agente opera bajo la síntesis de 4 estándares internacionales:

1. **ATO (Australian Taxation Office) — *"Lead with the need, not the law"*:**
   - La intención del usuario manda. La ley respalda, pero no entorpece la acción.
   - **Layered Content (3 Capas):**
     - *Capa 1:* Instrucción directa de qué hacer hoy y plazos.
     - *Capa 2:* Requisitos en viñetas y ejemplos prácticos.
     - *Capa 3:* Artículos, decretos y base legal aislados al pie o colapsados.
2. **Nielsen Norman Group (NN/g) — Ciencia de Usabilidad y Escaneo:**
   - **Regla del 79%:** El usuario escanea; cero párrafos densos o bloques de texto corrido.
   - **Corte del 50%:** Eliminar cortesía burocrática y palabras de relleno administrativo.
   - **Pirámide Invertida:** La conclusión y el resultado principal en las primeras líneas.
   - **Heurística 5 y 9:** Prevención de errores con textos de ayuda y mensajes de error sin códigos crudos con salida inmediata.
3. **Microsoft Style Guide — Tono Humano y Botones Accionables:**
   - **Cero culpa al usuario:** Describir la situación objetiva y guiar la solución.
   - **Botones con predicción de resultado:** Cero genéricos (*"Continuar"*, *"Enviar"*). Usar acciones concretas (*"Descargar calcomanía vehicular"*, *"Pagar en Declaraguate"*).
4. **Google Material Design — Tríada Claro, Conciso y Útil:**
   - Sentence case estricto en títulos (mayúscula solo al inicio).
   - Textos de ayuda (*Helper text*) preventivos en formularios.

---

## 2. Reglas Inquebrantables de Dominio SAT (Zero-Tolerance)

### A. Prohibición Absoluta de "Trámite" $\to$ Uso Obligatorio de "Gestión"
- **Regla:** Queda terminantemente prohibido usar *"trámite"* o *"trámites"* en textos visibles, botones, encabezados, títulos, badges, microcopys y documentación ciudadana.
- **Término Institucional:** Usar **"gestión" / "gestiones"** o el verbo directo de la acción (*"inscribir"*, *"pagar"*, *"solicitar"*, *"actualizar"*).
  - ❌ *"Catálogo de trámites aduaneros"* ➔  *"Catálogo de gestiones aduaneras"*
  - ❌ *"Realizar trámite"* ➔  *"Iniciar gestión"* o *"Solicitar inscripción"*

### B. Expansión Canónica de Acrónimos (Cero Acrónimos Huérfanos)
Toda sigla técnica debe expandirse en su **primera mención** por página, componente o ficha:

| Acrónimo | Forma Canónica Obligatoria (Primera Mención) |
| :--- | :--- |
| **NIT** | `Número de Identificación Tributaria (NIT)` |
| **RTU** | `Registro Tributario Unificado (RTU)` |
| **FEL** | `Factura Electrónica (FEL)` |
| **ISCV** | `Impuesto de Circulación de Vehículos (ISCV)` |
| **DUCA** | `Declaración Única Centroamericana (DUCA - Aduanas)` |
| **AFPA** | `Auxiliares de la Función Pública Aduanera (AFPA)` |
| **RFV** | `Registro Fiscal de Vehículos (RFV)` |
| **OEA** | `Operador Económico Autorizado (OEA - Empresa Certificada)` |
| **SOFI** | `Solvencia Fiscal en Línea (SOFI)` |
| **CUI / DPI** | `Número de DPI (Código Único de Identificación)` |
| **SAT-GES-####**| Código canónico inmutable de gestión (uso técnico/sistema). |

---

## 3. Matriz de Traducción Burocrática (Law to Plain)

Al procesar descripciones, requisitos o manuales administrativos, reemplaza automáticamente según este diccionario:

| Jerga Administrativa / Fiscal Interna | Término Ciudadano Aprobado (UX Writing) |
| :--- | :--- |
| *Sujeto pasivo / Contribuyente afecto* | **Personas y empresas con o sin negocio** |
| *Omisos tributarios* | **Pagos o declaraciones pendientes** |
| *Régimen de rentas del trabajo* | **Impuestos para personas con empleo o salario** |
| *Distintivos electrónicos del Registro Fiscal* | **Tarjeta de circulación y calcomanía vehicular** |
| *Transacción de cambio de régimen* | **Paso de persona sin negocio a persona con negocio** |
| *Auxiliares de la Función Pública Aduanera* | **Agentes de aduanas, transportistas y logística** |
| *Constancia de Adquisición de Insumos* | **Constancia de compra libre de impuestos** |
| *Acreditamiento fiscal* | **Aplicar crédito fiscal a favor** |
| *Inscripción per se* | **Inscripción formal de oficio o voluntaria** |
| *Inobservancia de deberes formales* | **Incumplimiento de requisitos o fechas límite** |
| *Despacho aduanero de mercancías* | **Revisión y salida de mercancías en aduana** |

---

## 4. Patrones de Redacción y Microcopy para el Agente

### A. Títulos Orientados a la Acción (Front-Loading & GDS)
El verbo de acción debe situarse en las **primeras 3 palabras**:
$$\text{Título} = \mathbf{Verbo\ en\ Infinitivo} + \mathbf{Objeto/Servicio} + \mathbf{(Sigla)}$$
- ❌ *Procedimiento para la Obtención de Facturas Electrónicas*  
  ➔ ✅ **Emitir Factura Electrónica (FEL)**
- ❌ *Inscripción de Personas Individuales en el Sistema Tributario*  
  ➔ ✅ **Solicitar mi Número de Identificación Tributaria (NIT)**

### B. Requisitos en Visual Chunking (UK GDS + NN/g)
Cero párrafos densos. Estructurar siempre en viñetas cortas con negrita inicial:
- **DPI vigente:** Código Único de Identificación (CUI) del titular.
- **Estar al día:** Sin declaraciones ni pagos pendientes con la SAT.
- **Boleta de pago:** Formulario SAT-8933 cancelado en el banco o banca en línea.

### C. Mensajes de Error y Alertas (Microsoft + NN/g Heurística 9)
Estructura obligatoria para cualquier mensaje de error de sistema o formulario:
1. **Título:** Qué pasó en lenguaje humano (sin códigos crudos como `Error 500` o `ORA-014`).
2. **Causa:** Explicación simple sin culpar al usuario (*"El NIT necesita 8 dígitos"* en vez de *"Usted escribió mal el NIT"*).
3. **Acción de salida:** Instrucción clara o enlace directo para resolverlo.

### D. Botones de Acción (Actionable CTAs - Microsoft)
El texto del botón debe predecir la acción:
- ❌ *Aceptar*, *Continuar*, *Enviar*, *Clic aquí*.
- ✅ **Descargar calcomanía vehicular**, **Pagar en Declaraguate**, **Solicitar cita**.

---

## 5. Bucle de Verificación Automatizado para el Agente (Verification Loop)

Antes de dar por completada cualquier tarea de redacción, edición de JSON o modificación de componentes:

1. **Escaneo de Término Prohibido:**  
   Ejecutar búsqueda regex `\btr[aá]mites?\b` (case-insensitive). Si arroja coincidencias en textos visibles, corregir inmediatamente.
2. **Validación de Acrónimos Huérfanos:**  
   Confirmar que `NIT`, `RTU`, `FEL`, `ISCV`, `DUCA`, etc., tengan su forma canónica expandida en su primera aparición.
3. **Auditoría de Oraciones y Front-Loading:**  
   Validar que los títulos comiencen con verbos en infinitivo y que las oraciones no superen las 20 palabras.
4. **Verificación de Tono:**  
   Asegurar voz activa en segunda persona, tono facilitador y eliminación de jerga sancionatoria.
