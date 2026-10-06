# Reglas Oficiales de Diseño y UI/UX - SAT Guatemala

Este documento establece los principios de diseño, estilo, accesibilidad y **UX Writing en Lenguaje Ciudadano** obligatorios para el proyecto del **Portal Web SAT Guatemala**.

---

## 1. Regla de Tarjetas (Cards) Compactas sin Íconos, sin Números y sin Botones Redundantes
- **Cero íconos decorativos en tarjetas**: Las tarjetas **NO deben contener íconos gráficos**.
- **Cero números o conteos administrativos**: Eliminar etiquetas como `4 Grupos`, `350 Trámites`, `7 pasos`, etc.
- **Sin textos de pie redundantes (ej. "Ver trámites")**: 
  - Toda la tarjeta es un área clickeable uniforme.
  - La tarjeta presenta exclusivamente: **Título en lenguaje claro** y **Descripción concisa con UX Writing**.
- **Espaciado y gap compacto**:
  - `gap-3` o `gap-3.5` entre tarjetas para evitar dispersión visual innecesaria y optimizar el espacio en pantalla.

---

## 2. Guía de UX Writing y Tratamiento de Acrónimos Tributarios

En el ámbito fiscal y aduanero de la SAT, el ciudadano promedio suele confundirse con tecnicismos y siglas. Se aplican las siguientes reglas de **Plain Language (Lenguaje Claro)**:

### A. Regla de Acrónimos y Siglas
1. **Siempre acompañar la sigla de su significado o propósito en el contexto**:
   - ❌ *RTU Digital* ➔  *Registro Tributario Unificado (RTU)*
   - ❌ *SOFI* ➔  *Solvencia Fiscal en Línea*
   - ❌ *ISCV* ➔  *Impuesto de Circulación de Vehículos*
   - ❌ *FEL / DTEs* ➔  *Factura Electrónica (FEL)*
   - ❌ *CUI / DPI* ➔  *Número de DPI (Código Único de Identificación)*
   - ❌ *DUCA* ➔  *Declaración Única Centroamericana (DUCA - Aduanas)*
   - ❌ *OEA* ➔  *Operador Económico Autorizado (Empresa Certificada en Seguridad)*
   - ❌ *IVA / ISR* ➔  *Impuesto al Valor Agregado (IVA) / Impuesto Sobre la Renta (ISR)*

### B. Sustitución de Jerga Burocrática por Lenguaje Ciudadano
| Término Interno / Burocrático | Término Ciudadano Recomendado (UX Writing) |
| :--- | :--- |
| *Sujeto Pasivo / Contribuyente afecto* | *Personas y Empresas con o sin negocio* |
| *Omisos tributarios* | *Consultar pagos o declaraciones pendientes* |
| *Régimen de Rentas del Trabajo* | *Impuestos para personas con empleo o salario* |
| *Distintivos electrónicos del Registro Fiscal* | *Tarjeta de circulación y calcomanía vehicular* |
| *Transacción de cambio de régimen* | *Paso de persona sin negocio a persona con negocio* |
| *Auxiliares de la Función Pública Aduanera* | *Agentes de aduanas, transporte y logística* |
| *Constancia de Adquisición de Insumos* | *Constancia de compra libre de impuestos para entidades exentas* |

### C. Redacción Orientada a la Acción y al Beneficio
- **Títulos con verbos de acción directa**: Priorizar verbos en infinitivo que respondan a la intención del usuario (*"Solicitar mi NIT"*, *"Emitir facturas electrónicas"*, *"Actualizar mis datos"*).
- **Descripciones en 2 oraciones máximo**:
  1. *Qué es o para qué sirve*.
  2. *Qué beneficio obtiene o qué necesita para realizarlo*.

### D. Patrón Modelo Oficial (Benchmark de UX Writing Ciudadano)
> **Número de Identificación Tributaria (NIT)**  
> *Cómo solicitar un Número de Identificación Tributaria (NIT), actualizar sus datos, consultar su NIT y qué hacer si ha sido utilizado de forma indebida.*
>
> *(Aplica acrónimo expandido en primera mención, verbos de acción directa y atención proactiva al problema ciudadano de uso indebido).*

---

## 3. Uso Mínimo y Restringido de Iconografía
- La iconografía se restringe a controles funcionales indispensables (lupa de búsqueda, flechas `<` `>`, botón de cerrar `×`, o menú móvil).
- Cero saturación visual con íconos decorativos o repetitivos.

---

## 4. Estilo Estándar de las Tarjetas (SAT Design System Original)
- **Estructura**: `bg-white`, borde `border border-[#DCDCDC]`, esquinas `rounded-[16px]` o `rounded-[14px]`.
- **Efecto Hover Sólido Interactivo**:
  - Al pasar el cursor (`hover`), el fondo cambia al color institucional del segmento (`hover:bg-[#14649B]`, `hover:bg-[#0284C7]`, `hover:bg-[#4D8014]`, `hover:bg-[#C25E00]`).
  - Sombra suave `hover:shadow-[0_14px_30px_rgba(...)]` y elevación `hover:-translate-y-1`.
  - Transición automática de todos los textos interiores a blanco (`group-hover:text-white`).

---

## 5. Accesibilidad y Modo Claro (WCAG 2.2 AA & Heurísticas Nielsen)
- Fondos neutros y claros (`#FFFFFF`, `#F8FAFC`).
- Contraste tipográfico superior a 4.5:1 para texto normal.
- Prevención de errores con validaciones claras y ayudas contextuales sin lenguaje sancionatorio.

---

## 6. Arquitectura del Viaje del Contribuyente (Taxpayer Journey)
Para el detalle exhaustivo del ciclo de vida, la jerarquía de las 5 categorías oficiales y las 6 etapas cronológicas de navegación, consultar:
- [TAXPAYER_JOURNEY.md](file:///mnt/datos/GitHub/SAT/TAXPAYER_JOURNEY.md)

---

*Fecha de actualización: Octubre 2026*
