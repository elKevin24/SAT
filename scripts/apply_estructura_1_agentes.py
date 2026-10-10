import json

ALL_TRAMITES_PATH = 'src/data/allTramites.json'

def apply_estructura_1():
    with open(ALL_TRAMITES_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Definición canónica exacta de ESTRUCTURA 1 ADOPTADA (7 trámites directos bajo N3)
    estructura_1_agentes = {
        'comercio_exterior-83': {
            'orden_n4': 1,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Inscripción y Habilitación de Auxiliares de la Función Pública Aduanera',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Inscripción y Habilitación de Auxiliares de la Función Pública Aduanera',
            'etapaAto': 'empezar',
            'etapaAtoLabel': 'Empezar y registrarse',
            'tipoInteraccion': 'guia_informativa',
            'tipoInteraccionLabel': 'Guía Informativa / Texto',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Guía normativa y procedimental para la inscripción, autorización inicial de operaciones y registro en el padrón aduanero de la SAT.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-84': {
            'orden_n4': 2,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Renovación Anual de Operación de Auxiliares Aduaneros',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Renovación Anual de Operación de Auxiliares Aduaneros',
            'etapaAto': 'modificar_cerrar',
            'etapaAtoLabel': 'Modificaciones y cierre',
            'tipoInteraccion': 'servicio_transaccional',
            'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
            'tipologiaContenido': 'tramite_transaccional',
            'tipologiaContenidoLabel': 'Trámite / Aplicativo en Línea',
            'descripcion': 'Gestión en línea de prórroga y renovación anual de la fianza y autorización para operar como auxiliar aduanero conforme al CAUCA y RECAUCA.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-82': {
            'orden_n4': 3,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Acreditación y Carné de Identificación para AFPA',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Acreditación y Carné de Identificación para AFPA',
            'etapaAto': 'empezar',
            'etapaAtoLabel': 'Empezar y registrarse',
            'tipoInteraccion': 'guia_informativa',
            'tipoInteraccionLabel': 'Guía Informativa / Texto',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Requisitos, directrices de emisión de carné de identificación oficial y manual para registro, consulta y actualización de auxiliares aduaneros.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-97': {
            'orden_n4': 4,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Instalador y Soporte de Firma Digital ActiveX PKI/DUA',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Instalador y Soporte de Firma Digital ActiveX PKI/DUA',
            'etapaAto': 'operar',
            'etapaAtoLabel': 'Operación y declaraciones',
            'tipoInteraccion': 'descarga_recurso',
            'tipoInteraccionLabel': 'Formulario / Documento Descargable',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Descarga oficial y soporte técnico del componente ActiveX PKI necesario para firmar digitalmente y transmitir la declaración aduanera (DUCA).',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-143': {
            'orden_n4': 5,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Consulta del Estado de Expedientes en Gestión Aduanera',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Consulta del Estado de Expedientes en Gestión Aduanera',
            'etapaAto': 'consultar',
            'etapaAtoLabel': 'Consultas y herramientas',
            'tipoInteraccion': 'consulta_datos',
            'tipoInteraccionLabel': 'Buscador / Consulta en Línea',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Servicio web para consultar el avance, estado procesal y unidad responsable de expedientes administrativos en la Intendencia de Aduanas.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-100': {
            'orden_n4': 6,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Especificaciones de Videovigilancia y CCTV en Recintos Aduaneros',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Especificaciones de Videovigilancia y CCTV en Recintos Aduaneros',
            'etapaAto': 'operar',
            'etapaAtoLabel': 'Operación y declaraciones',
            'tipoInteraccion': 'guia_informativa',
            'tipoInteraccionLabel': 'Guía Informativa / Texto',
            'tipologiaContenido': 'guia_informativa',
            'tipologiaContenidoLabel': 'Guía Informativa / Texto',
            'descripcion': 'Guía técnica y normativa para la interconexión y visualización remota de cámaras de seguridad en puestos fronterizos y depósitos fiscales.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        },
        'comercio_exterior-95': {
            'orden_n4': 7,
            'orden_n5': 1,
            'nivel4_tema': '—',
            'materiaTema': '—',
            'nivel5_tramite': '—',
            'subtemaGestion': '—',
            'tramite': 'Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)',
            'migaBreadcrumb': 'Operadores de Comercio Exterior > Auxiliares de la Función Pública Aduanera (AFPA) > Agentes Aduaneros > Curso Virtual: Generalidades de la Declaración Única Centroamericana (DUCA)',
            'etapaAto': 'normativa',
            'etapaAtoLabel': 'Normativa y asistencia',
            'tipoInteraccion': 'servicio_transaccional',
            'tipoInteraccionLabel': 'Trámite / Aplicativo en Línea',
            'tipologiaContenido': 'tramite_transaccional',
            'tipologiaContenidoLabel': 'Trámite / Aplicativo en Línea',
            'descripcion': 'Capacitación oficial interactiva sobre llenado, transmisión y soporte legal de la DUCA (modalidades D, F y T) para el despacho de mercancías.',
            'baseLegal': 'CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas.'
        }
    }

    # Aplicar a los 7 trámites de Agentes Aduaneros
    count = 0
    for item in data:
        tid = item.get('id')
        if tid in estructura_1_agentes:
            for k, v in estructura_1_agentes[tid].items():
                item[k] = v
            count += 1

    print(f"Actualizados {count} trámites de Agentes Aduaneros bajo Estructura 1 Adoptada.")

    # Ordenar dataset para que respete rigurosamente (orden_n1, orden_n2, orden_n3, orden_n4, orden_n5)
    data.sort(key=lambda x: (
        x.get('orden_n1', 1),
        x.get('orden_n2', 1),
        x.get('orden_n3', 1),
        x.get('orden_n4', 1),
        x.get('orden_n5', 1)
    ))

    # Guardar allTramites.json
    with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Guardado exitosamente {ALL_TRAMITES_PATH}")

    # Verificar salida de Agentes Aduaneros
    agentes_items = [t for t in data if t.get('subcategoria') == 'Agentes Aduaneros']
    print(f"\nVerificación ESTRUCTURA 1 ADOPTADA ({len(agentes_items)} trámites):")
    for t in agentes_items:
        print(f"  {t['orden_n4']}. [{t['id']}] {t['tramite']} (ATO: {t.get('etapaAtoLabel')})")
        print(f"     Miga: {t.get('migaBreadcrumb')}")

if __name__ == '__main__':
    apply_estructura_1()
