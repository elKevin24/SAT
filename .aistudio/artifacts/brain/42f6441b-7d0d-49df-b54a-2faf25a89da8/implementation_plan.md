# Plan de Implementación: Asistentes Guiados Paso a Paso para Gestiones Clave

Este plan detalla el desarrollo de la siguiente fase del portal: un módulo interactivo de **Asistentes Guiados Paso a Paso** para orientar al ciudadano en la preparación y ejecución de las gestiones con mayor demanda institucional.

---

## 1. Alcance y Objetivos

* **Objetivo:** Proporcionar una experiencia interactiva a página completa (cumpliendo con la Regla 13 de cero modales ni overlays) donde el ciudadano verifique requisitos, complete listas de chequeo y siga una secuencia clara hasta la ejecución en los sistemas de la SAT.
* **Gestiones prioritarias a integrar:**
  1. **Solicitud de Primer NIT para Personas Individuales** (`/primer-nit`).
  2. **Habilitación y Activación de Agencia Virtual** (`/agencia-virtual-guia`).
  3. **Inscripción y Cambio al Régimen de Pequeño Contribuyente** (`/pequeno-contribuyente-guia`).
  4. **Traspaso Electrónico Vehicular (e-Traspaso)** (`/e-traspaso-guia`).

---

## 2. Componentes e Integración de Arquitectura

### A. Estructura de Datos (`src/data/guidedFlowsData.ts`)
* Arreglo fuertemente tipado con la secuencia de pasos, requisitos previos con opción de verificación (checkbox), estimación de tiempo, avisos importantes y enlace oficial final.

### B. Vista Principal a Página Completa (`src/pages/GuidedAssistantPage.tsx`)
* **Barra de Progreso y Miga de Pan:** Muestra la etapa actual (Paso X de Y) con la ruta canónica `Inicio › Gestiones › Asistente Guiado`.
* **Paso 1: Verificación de Requisitos:** Lista interactiva con casillas de selección para que el usuario confirme si cuenta con DPI, factura reciente, correo activo, etc.
* **Paso 2: Guía Operativa de Ejecución:** Instrucciones en lenguaje ciudadano orientadas a la acción (verbos en infinitivo).
* **Paso 3: Redirección Segura:** Botón de acción hacia la plataforma transaccional oficial de la SAT (`portal.sat.gob.gt` o `agenciavirtual.sat.gob.gt`).

### C. Integración en Navegación y Catálogo (`src/App.tsx`)
* Registro de rutas hash dedicadas (`#/asistente/primer-nit`, `#/asistente/agencia-virtual`, etc.).
* Botón de acceso directo en las fichas de gestión relevantes (*"Iniciar con Asistente Guiado"*).

---

## 3. Fases de Ejecución

1. **Fase 1 (Dataset y Tipado):** Definir el modelo de datos `GuidedStep` y `GuidedAssistant` en `src/data/guidedFlowsData.ts`.
2. **Fase 2 (Componente de Interfaz):** Crear `src/pages/GuidedAssistantPage.tsx` con estilos Tailwind responsive y accesibilidad WCAG 2.2 AA.
3. **Fase 3 (Enrutamiento y Puntos de Entrada):** Conectar las rutas hash en `App.tsx` e integrar los accesos en el catálogo.
4. **Fase 4 (Verificación):** Ejecutar `compile_applet`, `lint_applet` y los tests de Playwright (`tests/data-contract.spec.ts`).

---

## 4. Criterios de Aceptación

* Cumplimiento estricto de la **Regla 13** (pantalla completa dedicada con URL navegable, sin popups ni modales).
* Lenguaje ciudadano alineado a la **Regla 10** (sin jerga burocrática ni términos prohibidos).
* Total compatibilidad móvil y persistencia local del estado del checklist.
