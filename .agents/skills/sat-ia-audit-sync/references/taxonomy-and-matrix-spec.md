# Marco Teórico de Arquitectura de Información y Matriz de 25 Columnas (SAT)

## 1. Desacoplamiento Formal de Capas (IA vs. Navegación)
- **Arquitectura de Información (IA):** Estructura relacional del conocimiento (árbol lógico N1–N5).
- **Sistema de Navegación:** Mecanismos visuales para recorrer la arquitectura (Breadcrumb, Sidebar, Menú Principal, Enlaces transversales).
- **Regla de Profundidad Desacoplada:** Que un contenido se ubique en el Nivel 5 de la IA no implica mostrar 5 niveles de menú simultáneos. El Sidebar muestra solo el hub local de la sección activa y el Breadcrumb usa compactación elíptica `[…]` en pantallas móviles (`< 1024px`).

---

## 2. Regla de Umbral de Densidad y Ramificación Asimétrica ($A, A_1, A_2$)

La profundidad del árbol nunca es simétrica; se rige por la densidad real de cada subrama:

### A. Condición de Compactación / Sub-densidad ($A \to A_1, A_2$ con hojas $\le 3$)
```text
        A
      /   \
    A1     A2       Si A1 y A2 contienen solo 1, 2 o 3 gestiones sueltas y ahí terminan:
    |      |        -> Se eliminan los niveles intermedios A1 y A2 (sobre-andamiaje).
   [G1]   [G2]      -> G1 y G2 cuelgan directamente de A.
```
- **Diagnóstico:** Crear un nivel intermedio para $\le 3$ gestiones terminales genera **nodos pasarela (*pass-through nodes*)**.
- **Acción:** **Compactar al nivel superior**. Ejemplos: *Empresas de Entrega Rápida o Courier* (3 gestiones pasan a N3 directo) y *Operador Económico Autorizado (OEA)* (2 gestiones pasan a N2 directo).

### B. Condición de Retención de Jerarquía Profunda ($A \to A_1$ con masa crítica $\ge 10$)
```text
        A
        |
       A1 (>= 10 gestiones con subestructura compleja)
     /    \
   A1.1   A1.2 ...  -> NO se compacta. Se preserva la jerarquía profunda (N4 / N5).
```
- **Diagnóstico:** Aplanar un subárbol con $\ge 10$ gestiones provoca **colapso de contexto (*context collapse*)**.
- **Acción:** **Preservar la profundidad**. Ejemplos: *Depósitos Aduaneros Temporales (DAT - 18)*, *Almacenes Generales de Depósito (AGD - 16)* y *Zonas de Desarrollo Económico Especial Público (ZDEEP - 30)*.

### C. Asimetría Rama por Rama (Nodos Monocatenarios)
- **Rama Monocatenaria ($A_1 \to A_{1.1}$):** Un nodo con un único hijo no clasifica nada (clasificar exige elegir entre $\ge 2$ opciones) $\to$ **Se compacta**.
- **Rama Bifurcada ($A_2 \to A_{2.1}, A_{2.2}, A_{2.3}$):** Bifurcación funcional genuina $\to$ **Se preserva la jerarquía**.

---

## 3. Matriz Oficial de 25 Columnas (Opción A Intercalada)

Estructura obligatoria para todos los libros Excel vivos y exportaciones tabulares:

| Columna | Nombre Oficial de Columna | Regla de Gobernanza |
| :---: | :--- | :--- |
| **1** | `No.` | Correlativo secuencial de fila (`1..715`). |
| **2** | `Código Oficial (SAT-GES-####)` | Identificador inmutable (`SAT-GES-0001` a `SAT-GES-0683`). |
| **3** | `Orden N1` | Entero positivo según orden de Nivel 1. |
| **4** | `Nivel 1` | Nombre oficial sin números quemados (ej. `Contribuyentes`, `Comercio Exterior`). |
| **5** | `Orden N2` | Entero positivo según secuencia de Nivel 2. |
| **6** | `Nivel 2` | Segunda jerarquía estructural sin prefijos numéricos. |
| **7** | `Orden N3` | Entero positivo o guion largo (`—`) si la gestión se compactó en N2. |
| **8** | `Nivel 3` | Tercera jerarquía o guion largo (`—`) si no aplica. |
| **9** | `Orden N4` | Entero positivo (según ciclo ATO) o guion largo (`—`) si no aplica. |
| **10** | `Nivel 4` | Cuarta jerarquía o guion largo (`—`) si no aplica. |
| **11** | `Orden N5` | Entero positivo o guion largo (`—`) si la rama terminó en N3/N4. |
| **12** | `Nivel 5` | Quinta jerarquía o guion largo (`—`) si no aplica. |
| **13** | `Nombre de la Gestión (Lenguaje Claro)` | Verbo de acción + objeto + acrónimos expandidos. Cero números al inicio. |
| **14** | `Ruta de Navegación (Miga de Pan)` | Ruta concatenada de niveles reales (excluyendo niveles con `—`). |
| **15** | `Etapa Ciclo de Vida ATO` | `1. Empezar` $\to$ `2. Operar` $\to$ `3. Consultar` $\to$ `4. Modificar/Cerrar` $\to$ `5. Normativa`. |
| **16** | `Tipo de Interacción` | `servicio_transaccional`, `consulta_datos`, `guia_informativa`, `descarga_recurso`. |
| **17** | `Tipología de Contenido` | Clasificación documental u operativa de la gestión. |
| **18** | `Plataforma / Sistema` | `Agencia Virtual`, `Declaraguate`, `Sistemas Aduaneros`, `Portal Web SAT`. |
| **19** | `Canal` | `100% En Línea`, `Híbrido`, `Presencial en Agencia / Aduana`. |
| **20** | `Control de Auditoría` | Estado de curaduría y trazabilidad (`Consolidado`, `Compactado`, etc.). |
| **21** | `¿Para qué sirve? (Descripción Operativa)` | Máximo 2 oraciones: qué es/para qué sirve + beneficio o requisito clave. |
| **22** | `Base Legal / Fundamento Jurídico` | Decretos, Acuerdos de Directorio SAT, CAUCA/RECAUCA aplicables. |
| **23** | `Ruta de Procesos Asociada` | Vínculo con la matriz histórica de procesos SAT. |
| **24** | `Estado Normativo` | `Vigente`, `Brecha Normativa`, `En Revisión`. |
| **25** | `URL Portal SAT` | URL canónica verificada (`HTTP 200 OK`), nunca raíz `/` ni `404`. |

---

## 4. Taxonomía Canónica de Nivel 1: Comercio Exterior (245 Gestiones en 6 Ramas)

| Nivel 2 (Rama Canónica) | Gestiones | Nivel 3 (Subcategorías Oficiales) |
| :--- | :---: | :--- |
| **Importadores** | **54** | `Registro y Padrón de Importadores` (9), `Declaraciones Aduaneras y DUCAs` (10), `Despacho Aduanero, Levante y Selectivo` (16), `Importación y Nacionalización de Vehículos` (10), `Mercancías en Abandono, Depósitos y Franquicias` (9). |
| **Exportadores** | **21** | `Padrón y Registro de Exportadores` (7), `Declaraciones Aduaneras y Embarques` (4), `Devolución de Crédito Fiscal` (10). |
| **Operador Económico Autorizado (OEA)** | **2** | Compactado directo en Nivel 2 (`Nivel 3 = —`, `Nivel 4 = —`, `Nivel 5 = —`). |
| **Auxiliares de la Función Pública Aduanera (AFPA)** | **76** | `Agentes Aduaneros` (7 en lista directa), `Apoderados Especiales Aduaneros` (16), `Depósitos Aduaneros` (36: DAT 18, AGD 16, Fiscales 2), `Empresas de Entrega Rápida o Courier` (3 en lista directa), `Transportistas Aduaneros` (14). |
| **Regímenes Territoriales y Zonas Especiales** | **42** | `Maquilas (Decreto 29-89)` (12), `Zonas de Desarrollo Económico Especial Público (ZDEEP)` (30: Usuarias 15, Administradoras 15). |
| **Normativa y Operaciones Aduaneras Generales** | **50** | `Arancel Centroamericano (SAC) y Permisos` (7), `Acuerdos Comerciales y Facilitación` (8), `Prevención de Contrabando y Defraudación` (3), `Consultas Técnicas, Recursos y Valoración` (14), `Modernización e Infraestructura Aduanera` (18). |
