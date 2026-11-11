#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Alineación Exacta con Contenido de Producción - Gestiones de Vehículos (SAT-GES-0384 y SAT-GES-0385)
Corrige:
1. SAT-GES-0385: Incluye el 100% de los requisitos, perfiles, formularios (SAT-8620, Anexo, SAT-4041/4081),
   tarifas exactas (Q75 / Q30 / Q0), delegaciones y casos especiales (segunda revisión DEIC).
2. SAT-GES-0384: Rectifica su identidad real en produccion como repositorio de descargas mensuales
   de reportes de importacion de vehiculos en portal.sat.gob.gt/portal/alza-e-importacion-vehiculos/#1510763502681-dff4b62b-fd76.
3. SAT-GES-0383: Rectifica su identidad real en produccion como repositorio de descargas mensuales de alzas.
4. SAT-GES-0382: Trifoliar oficial de Aduana de Vehiculos (Colonia Mariscal Zona 11).
"""

import json
from pathlib import Path

VEHICULOS_PATCH = {
    # -------------------------------------------------------------------------------------------------
    # SAT-GES-0385: Inscripción de Vehículos para Importadores de Vehículos Nuevos
    # URL: https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-de-vehiculos-para-importadores-de-vehiculos-nuevos/
    # -------------------------------------------------------------------------------------------------
    "SAT-GES-0385": {
        "gestion": "Inscribir vehículos nuevos para importadores",
        "nombreActual": "Inscribir vehículos nuevos para importadores",
        "descripcion": "Requisitos, formularios (SAT-8620 y SAT-4041/4081), pasos y delegaciones autorizadas para inscribir y obtener primeras placas de vehículos automotores nuevos.",
        "requisitos": [
            "Documento de identificación vigente: DPI original o pasaporte si es extranjero (propietario, mandatario o representante legal).",
            "Agencia Virtual activa y datos actualizados en el Registro Tributario Unificado (RTU Digital).",
            "Estar solvente en el Impuesto Sobre Circulación de Vehículos (ISCV) de todos los vehículos registrados.",
            "Formulario Declaraguate SAT-8620 (Primeras Placas) cancelado: Q75.00 (2 placas) o Q30.00 (1 placa/motocicleta).",
            "Anexo del Formulario SAT-8620 firmado por el representante legal (descargado en Declaraguate mediante 'Buscar formulario').",
            "Constancia de pago del IPRIMA en Declaraguate: Formulario SAT-4041 (unitario) o SAT-4081 (múltiple).",
            "Primera página de la DUCA / DUA con Constancia de Autorización de Levante de Mercancías y fotocopia.",
            "Factura emitida por el importador a favor del comprador del vehículo.",
            "Para Entidades del Estado: Resolución de la Dirección de Bienes del Estado (placas de uso oficial a Q0.00).",
            "Para Diplomáticos y Organismos Internacionales: Cédula Diplomática vigente y nota verbal del MINEX."
        ],
        "pasos": [
            "Ingresa a Declaraguate y llena el formulario SAT-8620 (Declaración Jurada, Solicitud y Recibo de Pago de Primeras Placas).",
            "Genera la boleta SAT-2000 y efectúa el pago en bancos autorizados del sistema (Q75 vehículo / Q30 motocicleta).",
            "Ingresa de nuevo a Declaraguate en la opción 'Buscar formulario' con el número y código de acceso para generar y descargar el Anexo firmado.",
            "Llena en Declaraguate el formulario SAT-4041 o SAT-4081 y paga el IPRIMA correspondiente mediante boleta SAT-2000.",
            "Preséntate a una Oficina, Agencia Tributaria o delegación autorizada (Delegación ASIM, Cofiño Stahl o Excel Automotriz).",
            "En ventanilla se te entregará la contraseña para el pago del Impuesto Sobre Circulación de Vehículos (ISCV) la cual debes cancelar.",
            "Finalizada la gestión, ingresa a tu Agencia Virtual para descargar tus Distintivos Electrónicos y recoge tus placas metálicas."
        ],
        "documentos": [
            "Formulario SAT-8620 y Anexo firmado.",
            "Comprobante de pago del IPRIMA (SAT-4041 o SAT-4081).",
            "DUCA con autorización de levante aduanero.",
            "Factura del importador a favor del comprador.",
            "DPI del propietario o representante legal."
        ],
        "resultadoObtenido": "Placas metálicas físicas entregadas en ventanilla + Tarjeta de Circulación y Certificado de Propiedad electrónicos en Agencia Virtual + Calcomanía Electrónica en sitio web SAT.",
        "tiempoEstimado": "Entrega inmediata en ventanilla con cita o delegación",
        "costo": "Vehículo de 2 placas: Q75.00 | Vehículo de 1 placa (motocicleta): Q30.00 | Vehículos oficiales: Q0.00 | IPRIMA según cilindraje",
        "advertencia": "Si el vehículo presenta inconsistencias, la aduana requerirá Segunda Revisión física con peritaje de la DEIC en la Aduana de Vehículos (26 calle 7-25 Zona 11, Colonia Mariscal). Delegaciones autorizadas: ASIM, Cofiño Stahl y Excel Automotriz."
    },

    # -------------------------------------------------------------------------------------------------
    # SAT-GES-0384: Alza e Importación de Vehículos (Pestaña: Importación de Vehículos)
    # URL: https://portal.sat.gob.gt/portal/alza-e-importacion-vehiculos/#1510763502681-dff4b62b-fd76
    # -------------------------------------------------------------------------------------------------
    "SAT-GES-0384": {
        "gestion": "Descargar reportes mensuales de importación de vehículos",
        "nombreActual": "Descargar reportes mensuales de importación de vehículos",
        "descripcion": "Repositorio oficial de descargas en PDF con los reportes mensuales de vehículos automotores importados publicados periódicamente por la Intendencia de Aduanas.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT.",
            "Lector de archivos PDF para visualizar y descargar los informes mensuales."
        ],
        "pasos": [
            "Ingresa al módulo de Alza e Importación de Vehículos en el portal web de la SAT.",
            "Selecciona el panel de 'Importación de Vehículos' (#1510763502681).",
            "Ubica el año y mes que deseas auditar (archivos mensuales desde 2018 hasta 2026).",
            "Haz clic en 'Descargar' o 'Vista previa' para obtener el archivo PDF oficial con el desglose de unidades importadas."
        ],
        "documentos": [
            "Archivos PDF mensuales de importación de vehículos (actualizados mes a mes)."
        ],
        "resultadoObtenido": "Descarga oficial de estadísticas e informes mensuales de vehículos importados en Guatemala.",
        "tiempoEstimado": "Descarga inmediata",
        "costo": "Gratuito",
        "advertencia": "Los reportes mensuales son de consulta pública y contienen el registro oficial consolidado de unidades importadas para fines de transparencia y análisis de mercado."
    },

    # -------------------------------------------------------------------------------------------------
    # SAT-GES-0383: Alza e Importación de Vehículos (Pestaña: Alza de Importación de Vehículos)
    # URL: https://portal.sat.gob.gt/portal/alza-e-importacion-vehiculos/#1510763502627-ec3a24b4-76f4
    # -------------------------------------------------------------------------------------------------
    "SAT-GES-0383": {
        "gestion": "Descargar reportes mensuales de alzas de vehículos",
        "nombreActual": "Descargar reportes mensuales de alzas de vehículos",
        "descripcion": "Repositorio oficial de descargas con los informes mensuales de alzas y ajustes de valor aplicados por la autoridad aduanera en la importación de vehículos.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT.",
            "Lector de archivos PDF para consultar los listados oficiales de alzas."
        ],
        "pasos": [
            "Ingresa al módulo de Alza e Importación de Vehículos en el portal web de la SAT.",
            "Selecciona el panel de 'Alza de Importación de Vehículos' (#1510763502627).",
            "Selecciona el año y mes de interés para consultar los ajustes aplicados.",
            "Descarga el documento en PDF para verificar los criterios de alza y valores promedio determinados."
        ],
        "documentos": [
            "Archivos PDF mensuales de alzas de vehículos emitidos por Intendencia de Aduanas."
        ],
        "resultadoObtenido": "Reporte oficial de ajustes y alzas de valoración vehicular por mes.",
        "tiempoEstimado": "Descarga inmediata",
        "costo": "Gratuito",
        "advertencia": "Las alzas de importación corresponden a ajustes técnicos realizados cuando el valor declarado en factura resulta inferior a los precios de referencia de mercado."
    },

    # -------------------------------------------------------------------------------------------------
    # SAT-GES-0382: Documentación a presentar ante la Aduana de Vehículos (Trifoliar)
    # URL: https://portal.sat.gob.gt/portal/documentacion-a-presentar-ante-la-aduana-de-vehiculos-trifoliar/
    # -------------------------------------------------------------------------------------------------
    "SAT-GES-0382": {
        "gestion": "Consultar trifoliar de la Aduana de Vehículos",
        "nombreActual": "Consultar trifoliar de la Aduana de Vehículos",
        "descripcion": "Guía informativa oficial sobre qué presentar en la Aduana de Vehículos (Colonia Mariscal Zona 11) para la revisión física y documental de unidades importadas.",
        "requisitos": [
            "Presentar obligatoriamente el o los vehículos en las instalaciones de la Aduana (26 calle 7-25 Zona 11, Colonia Mariscal).",
            "Constancia de autorización de levante de mercancías o DUCA resumida.",
            "Constancia de recepción de documentos en original y copia.",
            "Para comprobar valor: Documento de orientación para comprobación del valor declarado."
        ],
        "pasos": [
            "Traslada el vehículo a las instalaciones de la Aduana de Vehículos en la 26 calle 7-25 Zona 11, Colonia Mariscal.",
            "Presenta en ventanilla la DUCA con autorización de levante y la constancia de recepción de documentos.",
            "El técnico aduanero realiza la inspección física de los números de chasis (VIN) y motor.",
            "Espera la emisión de la resolución final del aforo (tiempo promedio de revisión física y documental: hasta 4 horas)."
        ],
        "documentos": [
            "Trifoliar informativo descargable en PDF.",
            "DUCA o constancia de levante.",
            "Constancia de recepción de documentos."
        ],
        "resultadoObtenido": "Constancia de revisión física y documental aprobada en la Aduana de Vehículos.",
        "tiempoEstimado": "Revisión física: hasta 4 horas en sede",
        "costo": "Gratuito",
        "advertencia": "Ubicación oficial: 26 calle 7-25 Zona 11, Colonia Mariscal. Teléfono: 2329-7070 extensiones 3326 a 3332. Es obligatorio llevar el vehículo físico."
    },

    # -------------------------------------------------------------------------------------------------
    # SAT-GES-0376: Comprobación de valor de importación de vehículos usados
    # URL: https://portal.sat.gob.gt/portal/comprobacion-valor-de-importacion/
    # -------------------------------------------------------------------------------------------------
    "SAT-GES-0376": {
        "gestion": "Guía para comprobar valor de vehículos usados",
        "nombreActual": "Guía para comprobar valor de vehículos usados",
        "descripcion": "Documento normativo de orientación para evitar discrecionalidad y sustentar válidamente el precio de factura en la declaración de vehículos usados importados.",
        "requisitos": [
            "Acceso libre al portal web oficial de la SAT.",
            "Factura comercial o comprobante de compra en subasta internacional (Copart, IAAI, Manheim)."
        ],
        "pasos": [
            "Descarga el 'Documento de orientación para la comprobación del valor declarado'.",
            "Verifica los medios de prueba admisibles (transferencias bancarias internacionales SWIFT, tarjetas a nombre del comprador).",
            "Revisa los lineamientos sobre fotografías certificadas del estado del vehículo al momento de la compra.",
            "Presenta la carpeta de pruebas ante la aduana para sustentar el valor de transacción declarado."
        ],
        "documentos": [
            "Documento de orientación de comprobación de valor en PDF."
        ],
        "resultadoObtenido": "Sustento documental oficial para evitar ajustes de valor discrecionales en aduana.",
        "tiempoEstimado": "Consulta y descarga inmediata",
        "costo": "Gratuito",
        "advertencia": "Publicado oficialmente por la SAT para garantizar transparencia y evitar cobros discrecionales en la verificación de vehículos usados."
    }
}

def apply_fix():
    catalog_path = Path("src/data/allTramites.json")
    with open(catalog_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    for item in data:
        gid = item.get("id")
        if gid in VEHICULOS_PATCH:
            for k, v in VEHICULOS_PATCH[gid].items():
                item[k] = v
            updated += 1

    with open(catalog_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Éxito: Se corrigieron y alinearon exactamente {updated} gestiones de vehículos en allTramites.json")

    # Sincronizar catalogoContenidosUnicos.json
    catalogo_path = Path("src/data/catalogoContenidosUnicos.json")
    if catalogo_path.exists():
        with open(catalogo_path, "r", encoding="utf-8") as f:
            catalogo = json.load(f)
        
        c_updated = 0
        for item in catalogo:
            code = item.get("codigo") or item.get("idOriginal") or item.get("id", "").replace("cnt-", "")
            if code in VEHICULOS_PATCH:
                src = VEHICULOS_PATCH[code]
                for field in ["gestion", "nombreActual", "descripcion", "requisitos", "pasos", "documentos", "resultadoObtenido", "tiempoEstimado", "costo", "advertencia"]:
                    if field in src:
                        item[field] = src[field]
                if "gestion" in src:
                    item["titulo"] = src["gestion"]
                c_updated += 1
                
        with open(catalogo_path, "w", encoding="utf-8") as f:
            json.dump(catalogo, f, indent=2, ensure_ascii=False)
        print(f"Sincronizados {c_updated} registros en catalogoContenidosUnicos.json")

if __name__ == "__main__":
    apply_fix()
