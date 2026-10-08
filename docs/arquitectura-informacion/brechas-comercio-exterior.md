# Registro de Brechas Operativas y Normativas — Operadores de Comercio Exterior

Este documento registra las **12 brechas de contenido y trámites aduaneros** consolidadas en el dataset de producción (`src/data/allTramites.json`) y en el libro de entrega [`Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx`](file:///c:/Users/busqu/Documents/GitHub/SAT/docs/fuentes-datos/Estructura_Final_Contenido_Portal_SAT_Actualizado.xlsx) (Hoja *Brechas Normativas (12)*).

> [!NOTE]
> **Definición de Brecha (`[Propuesta brecha]`):**  
> Es un trámite u obligación operativa que los operadores de comercio exterior y auxiliares aduaneros (AFPA / ZDEEP / Maquilas) necesitan gestionar ante la SAT conforme al **CAUCA IV / RECAUCA IV** y leyes especiales, pero que en el portal actual de la SAT **no cuenta con ficha pública de requisitos estandarizados, se encuentra disperso en directrices internas no indexadas, o carece de procedimiento digital formal**.

---

## Matriz de las 12 Brechas Consolidadas para Mesa Técnica

| No. | Rama Canónica | Actor / Subcategoría | Trámite Identificado como Brecha | Justificación y Pregunta para Mesa Técnica de SAT |
|:---:|:---|:---|:---|:---|
| **1** | **Auxiliares de la Función Pública (AFPA)** | Apoderados Especiales Aduaneros | **Autorización inicial y registro de mandato de apoderado especial** | *Situación:* El portal actual solo publica renovación.<br>*Pregunta SAT:* ¿Cuáles son los requisitos exactos para el primer nombramiento de un empleado de empresa como apoderado aduanero exclusivo? |
| **2** | **Auxiliares de la Función Pública (AFPA)** | Depósitos Aduaneros (AGD) | **Registro y emisión de títulos de crédito (Certificados de depósito y bonos de prenda)** | *Situación:* Regulado en Decreto 1236, pero sin guía aduanera en el portal.<br>*Pregunta SAT:* ¿Qué comunicación electrónica emite el almacén a la aduana al emitir o liberar un bono de prenda? |
| **3** | **Auxiliares de la Función Pública (AFPA)** | Depósitos Aduaneros (AGD) | **Reporte de saldos y existencias afianzadas ante SAT** | *Situación:* Exigido en fiscalizaciones pero sin formato ni frecuencia pública.<br>*Pregunta SAT:* ¿Qué periodicidad y formato oficial aplica para el informe de existencias afianzadas? |
| **4** | **Auxiliares de la Función Pública (AFPA)** | Depósitos Aduaneros Temporales (DAT) | **Control de descarga, ingreso de bultos y actas de recepción DAT** | *Situación:* Justificación de faltantes y sobrantes tras desembarque portuario.<br>*Pregunta SAT:* ¿Cuál es el plazo y sistema digital para registrar actas de avería, faltante o sobrante de bultos? |
| **5** | **Auxiliares de la Función Pública (AFPA)** | Depósitos Aduaneros Temporales (DAT) | **Requisitos para habilitación y delimitación de recintos aduaneros temporales (DAT)** | *Situación:* Requisito portuario/aeroportuario no publicado como ficha de servicio.<br>*Pregunta SAT:* ¿Qué requisitos perimetrales y de aduana sin papeles aplican para autorizar un DAT? |
| **6** | **Regímenes Territoriales y Zonas Especiales** | Maquilas (Decreto 29-89) | **Descargo Periódico de Cuentas Corrientes y Cuadre Insumo-Producto** | *Situación:* Control de mermas y balance de materias primas internadas temporalmente.<br>*Pregunta SAT:* ¿Cómo se presenta y audita el descargo periódico de materias primas importadas bajo Decreto 29-89? |
| **7** | **Regímenes Territoriales y Zonas Especiales** | Zonas Especiales (ZDEEP) | **Control, descargo y reporte periódico de inventarios de transformación** | *Situación:* Justificación de coeficiente de consumo de materias primas en ZDEEP.<br>*Pregunta SAT:* ¿Cómo se presenta el reporte de mermas y desperdicios de transformación industrial ante la SAT? |
| **8** | **Regímenes Territoriales y Zonas Especiales** | Zonas Especiales (ZDEEP) | **Procedimiento aduanero de traslado de mercancías hacia y desde ZDEEP** | *Situación:* Flujo logístico entre aduana de arribo y nave industrial en ZDEEP.<br>*Pregunta SAT:* ¿Qué régimen aduanero ampara el traslado entre una aduana de entrada y la nave del usuario en ZDEEP? |
| **9** | **Regímenes Territoriales y Zonas Especiales** | Zonas Especiales (ZDEEP) | **Registro de empresas usuarias calificadas en ZDEEP ante SAT** | *Situación:* Inscripción tributaria para acceder a las exenciones de la Ley ZOLIC.<br>*Pregunta SAT:* ¿Qué formulario de RTU o gestión en Agencia Virtual habilita los beneficios fiscales de usuario ZDEEP? |
| **10** | **Regímenes Territoriales y Zonas Especiales** | Zonas Especiales (ZDEEP) | **Procedimiento de control para ingreso y egreso de carga en garita ZDEEP** | *Situación:* Operativa diaria en garitas fiscales de control.<br>*Pregunta SAT:* ¿Se utiliza el sistema DUCA-T o una boleta electrónica interna de traslado hacia la ZDEEP? |
| **11** | **Regímenes Territoriales y Zonas Especiales** | Zonas Especiales (ZDEEP) | **Registro y control de garitas aduaneras e infraestructura perimetral** | *Situación:* Homologación de sistemas tecnológicos de seguridad.<br>*Pregunta SAT:* ¿Qué requisitos mínimos de circuito cerrado (CCTV) y básculas exige SAT en las garitas de ZDEEP? |
| **12** | **Regímenes Territoriales y Zonas Especiales** | Zonas Especiales (ZDEEP) | **Requisitos para habilitación y delimitación perimetral del polígono ZDEEP** | *Situación:* Dictamen de cerramiento perimetral de polígono.<br>*Pregunta SAT:* ¿Qué dictamen emite la SAT para certificar el cerramiento y garitas de una nueva ZDEEP? |

---

## Estrategia de Presentación en la Interfaz Web

Para garantizar transparencia ciudadana sin comprometer la certidumbre jurídica:

1. **Badge identificador en la Card:**  
   Se utiliza el distintivo accesible:  
   `Propuesta normativa SAT` (fondo neutro `#F1F5F9`, borde `#CBD5E1`, texto `#475569`).
2. **Modal informativo:**  
   Al abrir la ficha de trámite, se visualiza una alerta clara:  
   *"Este procedimiento se encuentra en proceso de estandarización o incorporación normativa por la Intendencia de Aduanas. Para consultas directas, diríjase a la Intendencia de Aduanas de la SAT."*
