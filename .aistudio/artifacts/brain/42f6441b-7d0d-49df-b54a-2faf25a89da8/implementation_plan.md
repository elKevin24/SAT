# Plan de Implementación: Página Universal Conectada — Actualización de Datos en el RTU Digital

## 1. ¿Qué significa crear una "Página Universal Conectada en 3 Pasos"?

En el portal actual de la SAT, cuando un contribuyente necesita **actualizar sus datos en el RTU Digital**, la información está fragmentada en más de 12 páginas separadas (requisitos de domicilio fiscal, requisitos de establecimiento, afiliación de impuestos, nombramiento de contador, videos y enlaces sueltos para consultar el estado o imprimir la constancia).

Al igual que hicimos con **Solicitar NIT (`#/solicitar-nit`)**, crear una **Página Universal Conectada** para **Actualización de Datos en el RTU Digital (`#/actualizar-rtu`)** consiste en:

1. **Unificar en una sola URL amigable (`#/actualizar-rtu`)** todos los caminos de navegación (desde el Catálogo de Gestiones `SAT-GES-0002`, `SAT-GES-0071`, `SAT-GES-0072` y desde la sección de Procesos Guiados `Proceso #9: Actualizar mis datos`).
2. **Conectar todo el flujo en 3 pasos dentro de la misma página**, sin redirecciones innecesarias ni pérdida de contexto:
   - **Paso 1 — Requisitos según tu caso:** Selector en lenguaje ciudadano (Datos personales y domicilio fiscal, Datos de negocio o establecimiento, Impuestos y actividad económica, Contador y representante legal, o Persona Jurídica / Ente Exento), con la regla oficial del comprobante de domicilio (ingreso de serie y número de factura de servicios sin adjuntar archivo vs. recibo de agua o IUSI) y el plazo legal de 30 días hábiles (Art. 94 Código Tributario).
   - **Paso 2 — Realizar Actualización en Línea (Agencia Virtual):** Guía operativa paso a paso para enviar la solicitud desde Agencia Virtual (`Servicios › RTU › Actualizar Datos`), con acceso directo al portal de Agencia Virtual (`https://farm3.sat.gob.gt/menu/login.jsf`) y descarga directa de los manuales oficiales en PDF de la SAT (*Guía de Actualización RTU Digital* y *Manual de Comprobante de Domicilio*).
   - **Paso 3 — Seguimiento y Constancia de RTU (Con Iframes Oficiales Integrados):**
     - Sub-pestaña 3A: **Consultar Estado de Gestión RTU Digital** embebiendo el iframe oficial `https://cdn.c.sat.gob.gt/rtu/consulta-gestion`.
     - Sub-pestaña 3B: **Imprimir Constancia de RTU** embebiendo el iframe oficial `https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal`.
     - Sub-pestaña 3C: **Solicitar Cita Presencial** (`https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal`) para contribuyentes con obligaciones que seleccionen "otro tipo de documento" como comprobante de domicilio y deban concluir su gestión en agencia.

---

## 2. Alcance de los Cambios Técnicos

### A. Aplicación Web Interactiva (React + TypeScript)
1. **Nuevo componente `src/pages/ActualizarRtuPage.tsx`**:
   - Diseño institucional con miga de pan dinámica, selector de los **3 pasos conectados** y tarjetas interactivas de requisitos en lenguaje ciudadano basadas 100 % en el contenido oficial de la SAT.
   - Aviso destacado sobre el **Comprobante de Domicilio Fiscal y Comercial** (factura de energía eléctrica, agua potable, teléfono fijo o internet residencial no mayor a 3 meses ingresando solo serie y número, o adjunto en JPG/PDF/PNG para recibo de IUSI/agua).
   - Integración de los iframes oficiales de la SAT (`consulta-gestion`, `constancia-rtu-portal` y `cita-validada-portal`) en el Paso 3 con enlace de respaldo en caso de bloqueo del navegador.
2. **Enrutamiento Canónico Universal en `src/App.tsx` y `src/pages/GestionContentPage.tsx`**:
   - Ruta amigable `#/actualizar-rtu` conectada automáticamente cuando el usuario selecciona las gestiones `SAT-GES-0002`, `SAT-GES-0071` o `SAT-GES-0072` desde cualquier nivel del catálogo o cuando ingresa al **Proceso #9 ("Actualizar mis datos")**.

### B. Plantilla WPBakery + The7 Classic (`docs/plantillas-wpbakery/`)
1. **Generación de `docs/plantillas-wpbakery/procesos-conectados/G_actualizar-rtu.txt`**:
   - Shortcodes puros de WPBakery (`[vc_row]`, `[vc_tta_tabs]`, `[vc_tta_accordion]`, `[vc_raw_html]`) listos para copiar y pegar en WordPress (`/portal/actualizar-rtu/`).
   - Actualización de `scripts/generar_plantillas_wpbakery.py` para que las tarjetas de `SAT-GES-0002`, `SAT-GES-0071` y `SAT-GES-0072` apunten a la ruta interna `/portal/actualizar-rtu/` y regeneración del índice `docs/plantillas-wpbakery/_INDICE.md` y la guía `docs/GUIA_IMPLEMENTACION_WORDPRESS_THE7.md`.

---

## 3. Verificación y Gobernanza
- Cumplimiento estricto de las reglas de arquitectura (`AGENTS.md` y `DESIGN_RULES.md`): cero uso del término prohibido, niveles estrictamente numéricos (Nivel 1 a Nivel 5), página completa dedicada sin modales ni popovers, y lenguaje claro orientado al ciudadano.
- Compilación limpia con `compile_applet` y validación con `lint_applet` sin errores.
