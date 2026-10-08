"""
Script de Normalización de Acrónimos y Títulos Ciudadanos:
Expande de forma exhaustiva y rigurosa todos los acrónimos huérfanos en títulos del catálogo del Portal SAT (src/data/allTramites.json),
cumpliendo estrictamente el estándar de UX de 'Cero siglas sin explicar' y eliminando etiquetas internas como '[Propuesta brecha]' por '[Propuesta normativa SAT]'.
"""

import json
import os
import re

DATA_PATH = os.path.join("src", "data", "allTramites.json")

# Lista de transformaciones ordenadas (de mayor especificidad a menor)
RULES = [
    # 1. Limpieza de etiquetas internas y saltos de línea
    (r"\[Propuesta brecha\]", "[Propuesta normativa SAT]"),
    (r"\r?\n\s*", " "),

    # 2. Reemplazo de guiones por paréntesis formales: -FEL- -> (FEL), etc.
    (r"\s*-(FEL|ISR|IVA|LET|OPF|NAF|CAIS|CIVA|ICT)-\s*", r" (\1)"),
    (r"\s*-([A-Z]{3,5})-\s*", r" (\1)"),

    # 3. Casos específicos y combinados de alto impacto
    (r"\bIVA-IPRIMA\b", "Impuesto al Valor Agregado e Impuesto a la Primera Matrícula (IVA-IPRIMA)"),
    (r"\bPlanilla IVA-\s*FEL\b", "Planilla del Impuesto al Valor Agregado en Factura Electrónica en Línea (IVA-FEL)"),
    (r"\bPlanilla del IVA en FEL\b", "Planilla del Impuesto al Valor Agregado (IVA) en Factura Electrónica en Línea (FEL)"),
    (r"\bPlanilla del IVA en Factura Electrónica en Línea \(FEL\)\b", "Planilla del Impuesto al Valor Agregado (IVA) en Factura Electrónica en Línea (FEL)"),
    (r"\bPlanilla del IVA\b", "Planilla del Impuesto al Valor Agregado (IVA)"),

    (r"\bSistema Retenciones Web de Impuestos Específicos \(ICT\)\b", "Sistema Retenciones Web de Impuestos Específicos (ICT)"),
    (r"\bSistema Retenciones Web \(ICT\)\b", "Sistema Retenciones Web de Impuestos Específicos (ICT)"),
    (r"\bSistema Retenciones Web \(ISR\)\b", "Sistema Retenciones Web del Impuesto Sobre la Renta (ISR)"),
    (r"\bSistema Retenciones Web \(IVA\)\b", "Sistema Retenciones Web del Impuesto al Valor Agregado (IVA)"),
    
    (r"\bEmisión Constancias de Adquisición de Insumos y Servicios\b", "Emisión de Constancias de Adquisición de Insumos y Servicios"),
    (r"\bEmisión Constancias de Exención de IVA \(CIVA\)\b", "Emisión de Constancias de Exención del Impuesto al Valor Agregado (CIVA)"),
    (r"\bEmitir constancias de exención de IVA \(CIVA\)\b", "Emitir constancias de exención del Impuesto al Valor Agregado (CIVA)"),
    (r"\bHabilitarte para emitir constancias de exención de IVA \(CIVA\)\b", "Habilitación para emitir constancias de exención del Impuesto al Valor Agregado (CIVA)"),
    (r"\bConstancias de Retención del IVA e ISR recibidos\b", "Constancias de Retención del Impuesto al Valor Agregado (IVA) e Impuesto Sobre la Renta (ISR) recibidos"),
    (r"\bConsultar constancias de retención de IVA e ISR recibidas\b", "Consultar constancias de retención del Impuesto al Valor Agregado (IVA) e Impuesto Sobre la Renta (ISR) recibidas"),
    (r"\bTabla de Valores ISCV e IVA Enajenación 2025\b", "Tabla de Valores del Impuesto sobre Circulación de Vehículos (ISCV) e Impuesto al Valor Agregado (IVA) Enajenación 2025"),
    (r"\bTabla de IVA enajenación\b", "Tabla del Impuesto al Valor Agregado (IVA) para enajenación de vehículos"),
    (r"\bde DAI e IVA\b", "de Derechos Arancelarios a la Importación (DAI) e Impuesto al Valor Agregado (IVA)"),
    (r"\bAgentes de Retención IVA\b", "Agentes de Retención del Impuesto al Valor Agregado (IVA)"),
    (r"\bAgentes de retención del ISR\b", "Agentes de retención del Impuesto Sobre la Renta (ISR)"),
    (r"\bSolicitud de Inscripción como Agente de Retención del IVA\b", "Solicitud de Inscripción como Agente de Retención del Impuesto al Valor Agregado (IVA)"),
    (r"\bRégimen General del IVA\b", "Régimen General del Impuesto al Valor Agregado (IVA)"),
    (r"\bRégimen general del IVA\b", "Régimen general del Impuesto al Valor Agregado (IVA)"),
    (r"\bRegímenes Especiales del IVA\b", "Regímenes Especiales del Impuesto al Valor Agregado (IVA)"),
    (r"\bGeneralidades del IVA\b", "Generalidades del Impuesto al Valor Agregado (IVA)"),
    (r"\bSistema de retenciones del IVA\b", "Sistema de retenciones del Impuesto al Valor Agregado (IVA)"),
    (r"\bSistema de retenciones del ISR\b", "Sistema de retenciones del Impuesto Sobre la Renta (ISR)"),
    (r"\bUso Comercial no Inscrito IVA: Propietarios de Vehículos con placas de uso Empresarial.*", "Uso Comercial no Inscrito en IVA: Propietarios de Vehículos con placas de uso Empresarial no Inscritos en el Impuesto al Valor Agregado (IVA)"),

    # 4. Contextual RTU
    (r"\bde RTU Digital\b", "del Registro Tributario Unificado (RTU) Digital"),
    (r"\bdel RTU\b", "del Registro Tributario Unificado (RTU)"),
    (r"\ben RTU\b", "en el Registro Tributario Unificado (RTU)"),
    (r"\bde RTU\b", "del Registro Tributario Unificado (RTU)"),
    (r"\bActualización RTU\b", "Actualización en el Registro Tributario Unificado (RTU)"),
    (r"\bInscripción RTU\b", "Inscripción en el Registro Tributario Unificado (RTU)"),
    (r"\bImpresión de RTU\b", "Impresión de Constancia del Registro Tributario Unificado (RTU)"),
    (r"^RTU\b", "Registro Tributario Unificado (RTU)"),

    # 5. Contextual TEV
    (r"\bde TEV\b", "de Traspaso Electrónico de Vehículos (TEV)"),

    # 6. Contextual FEL
    (r"\ben FEL\b", "en Factura Electrónica en Línea (FEL)"),
    (r"\bCurso: FEL para\b", "Curso: Factura Electrónica en Línea (FEL) para"),
    (r"^FEL\b", "Factura Electrónica en Línea (FEL)"),

    # 7. Contextual IVA e ISR en declaraciones
    (r"\bdeclaración mensual del IVA\b", "declaración mensual del Impuesto al Valor Agregado (IVA)"),
    (r"\bRetenciones de IVA\b", "Retenciones del Impuesto al Valor Agregado (IVA)"),
    (r"\bDevolución o Compensación de IVA\b", "Devolución o Compensación del Impuesto al Valor Agregado (IVA)"),
    (r"\bDevolución de ISR\b", "Devolución del Impuesto Sobre la Renta (ISR)"),
    (r"\bdeclaración anual del ISR\b", "declaración anual del Impuesto Sobre la Renta (ISR)"),
    (r"\bDevolución o Compensación de ISR\b", "Devolución o Compensación del Impuesto Sobre la Renta (ISR)"),
    (r"\bCompensación de Retenciones de ISR\b", "Compensación de Retenciones del Impuesto Sobre la Renta (ISR)"),
    (r"\bRetenciones de ISR\b", "Retenciones del Impuesto Sobre la Renta (ISR)"),
    (r"\bPagos en Exceso del ISR\b", "Pagos en Exceso del Impuesto Sobre la Renta (ISR)"),
    (r"\bdevolución de pagos indebidos del IVA\b", "devolución de pagos indebidos del Impuesto al Valor Agregado (IVA)"),

    # 8. ISCV / IPRIMA / CUI / Vehicular
    (r"\bTabla ISCV\b", "Tabla del Impuesto sobre Circulación de Vehículos (ISCV)"),
    (r"\bPago ISCV\b", "Pago del Impuesto sobre Circulación de Vehículos (ISCV)"),
    (r"\btabla de IPRIMA\b", "tabla del Impuesto a la Primera Matrícula (IPRIMA)"),
    (r"\bConsulta CUI / NIT\b", "Consulta de Código Único de Identificación (CUI) / NIT"),

    # 9. Entidades, ONGs, OPF, SENABED / CONABED
    (r"\buna ONG\b", "una Organización No Gubernamental (ONG)"),
    (r"\buna OPF\b", "una Organización de Padres de Familia (OPF)"),
    (r"\bSENABED / CONABED\b", "entidades de extinción de dominio (SENABED / CONABED)"),

    # 10. Comercio Exterior y Aduanas
    (r"\brenovación AFPA\b", "renovación de Auxiliares de la Función Pública Aduanera (AFPA)"),
    (r"\bcalificada OEA\b", "calificada de Operador Económico Autorizado (OEA)"),
    (r"\bConsultas Pago DUCA-F\b", "Consultas de Pago de Declaración Única Centroamericana (DUCA-F)"),
    (r"\bDeclaraciones Únicas Centroamericanas de Exportación \(DUCA-F\)\b", "Declaración Única Centroamericana de Exportación (DUCA-F)"),
    (r"\(DUCA y [Aa]duana sin papeles\)", "(Declaración Única Centroamericana - DUCA y Aduana sin papeles)"),
    (r"\(DUCA, tránsitos y aduana sin papeles\)", "(Declaración Única Centroamericana - DUCA, tránsitos y aduana sin papeles)"),
    (r"\(DUCA, tránsitos aduaneros y aduana sin papeles\)", "(Declaración Única Centroamericana - DUCA, tránsitos aduaneros y aduana sin papeles)"),
    (r"\(Carné, componente ActiveX PKI/DUA\)", "(Carné, firma electrónica PKI y Declaración Aduanera DUA)"),
    (r"\bactas de recepción DAT\b", "actas de recepción en Depósito Aduanero Temporal (DAT)"),
    (r"\bpolígono ZDEEP\b", "polígono de Zona de Desarrollo Económico Especial Público (ZDEEP)"),
    (r"\bgarita ZDEEP\b", "garita de Zona de Desarrollo Económico Especial Público (ZDEEP)"),
    (r"\brégimen especial ZDEEP\b", "régimen especial de Zona de Desarrollo Económico Especial Público (ZDEEP)"),
    (r"\bcalificadas en ZDEEP\b", "calificadas en Zona de Desarrollo Económico Especial Público (ZDEEP)"),
    (r"\bhacia y desde ZDEEP\b", "hacia y desde Zona de Desarrollo Económico Especial Público (ZDEEP)"),
    (r"\bmarco legal ZDEEP\b", "marco legal de Zona de Desarrollo Económico Especial Público (ZDEEP)"),
    (r"\bArancel Integrado \(SAC y gravámenes aplicables\)\b", "Arancel Integrado (Sistema Arancelario Centroamericano - SAC y gravámenes aplicables)"),
    (r"\(CAUCA IV, RECAUCA IV y Ley Nacional de Aduanas\)", "(Código Aduanero CAUCA IV, Reglamento RECAUCA IV y Ley Nacional de Aduanas)"),
    (r"\(RECAUCA Art\. (\d+)\b", r"(Reglamento Aduanero RECAUCA, Art. \1"),
    (r"\(RECAUCA Arts\. (\d+) al (\d+)\)\b", r"(Reglamento Aduanero RECAUCA, Arts. \1 al \2)"),
    (r"\by RECAUCA\)", "y Reglamento Aduanero RECAUCA)"),
    (r"\(Programa MIAD\)", "(Programa de Mesa de Información y Atención al Despacho - MIAD)"),
    (r"\(Acuerdo OMC\)", "(Acuerdo de Valoración de la Organización Mundial del Comercio - OMC)"),
    (r"\(B/L / AWB\)", "(Conocimiento de Embarque B/L y Guía Aérea AWB)"),
    (r"\(ATC Terrestre\)", "(Admisión Temporal de Contenedores - ATC Terrestre)"),
    (r"\(Dispositivo RFID / Precinto satelital\)", "(Marchamo Electrónico RFID / Precinto satelital)"),
    (r"mensajes EDIFACT / CUSCAR", "mensajes estándar de aduanas (EDIFACT / CUSCAR)"),
    (r"\(DUCA-T\)", "(Declaración Única Centroamericana de Tránsito - DUCA-T)"),
    (r"\(DUCA-T en ruta aduanera\)", "(Declaración Única Centroamericana de Tránsito - DUCA-T en ruta aduanera)"),
    (r"\(DUCA-D de importación y DUA sin papeles\)", "(Declaración Única Centroamericana DUCA-D e importación DUA sin papeles)"),
    (r"SAT - VUPE / SEADEX", "SAT ante la Ventanilla Única para las Exportaciones (VUPE / SEADEX)"),
]

def normalize_title(title: str) -> str:
    res = title.strip()
    for pattern, repl in RULES:
        res = re.sub(pattern, repl, res)
    return res

def main():
    print(f"Cargando dataset maestro: {DATA_PATH}...")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    modificados = 0
    for item in data:
        orig_nombre = item.get("nombreActual", "")
        orig_tramite = item.get("tramite", "")

        nuevo_nombre = normalize_title(orig_nombre)
        nuevo_tramite = normalize_title(orig_tramite)

        if nuevo_nombre != orig_nombre or nuevo_tramite != orig_tramite:
            item["nombreActual"] = nuevo_nombre
            item["tramite"] = nuevo_tramite
            modificados += 1

    print(f"Se actualizaron {modificados} trámites con expansión formal de títulos.")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Dataset maestro {DATA_PATH} actualizado exitosamente.")

if __name__ == "__main__":
    main()
