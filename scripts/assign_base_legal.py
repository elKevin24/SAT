import json
import re

all_t = json.load(open('src/data/allTramites.json', encoding='utf-8'))

def get_base_legal(item):
    pillar = item.get('pillar', '')
    cat = item.get('categoria', '')
    subcat = item.get('subcategoria', '')
    tema = item.get('tema', '')
    tramite = item.get('tramite', '')
    text = f"{cat} {subcat} {tema} {tramite}".lower()

    # =========================================================================
    # 1. OPERADORES DE COMERCIO EXTERIOR
    # =========================================================================
    if pillar == 'comercio_exterior':
        if 'almacenes generales de depósito' in text or 'bonos de prenda' in text or 'títulos de crédito' in text or 'decreto 1236' in text:
            return "Decreto 1236 (Ley de Almacenes Generales de Depósito) y RECAUCA IV Art. 119."
        if 'zdeep' in text or 'zonas de desarrollo' in text or 'polígono' in text or 'garita' in text:
            return "Decreto 22-73 (Ley Orgánica de ZOLIC / ZDEEP), CAUCA IV y RECAUCA IV."
        if 'decreto 29-89' in text or 'maquila' in text:
            return "Decreto 29-89 (Ley de Fomento y Desarrollo de la Actividad Exportadora y de Maquila)."
        if 'crédito fiscal' in text or 'devolución' in text and 'iva' in text:
            return "Decreto 27-92 (Ley del IVA, Arts. 23 al 25 bis) y Acuerdo de Directorio SAT 07-2007."
        if 'oea' in text or 'operador económico autorizado' in text:
            return "Marco Normativo SAFE de la Organización Mundial de Aduanas (OMA) y Acuerdos de Directorio SAT."
        if 'courier' in text or 'entrega rápida' in text:
            return "CAUCA IV y RECAUCA IV (Arts. 574 al 596, Régimen de Envíos de Entrega Rápida o Courier)."
        if 'transportistas' in text or 'marchamo' in text or 'atc' in text or 'cuscar' in text:
            return "CAUCA IV (Arts. 18 al 28), RECAUCA IV (Tránsito Aduanero Internacional Terrestre) y Ley de Aduanas."
        if 'agentes aduaneros' in text:
            return "CAUCA IV (Arts. 22 al 28), RECAUCA IV (Auxiliares de la Función Pública) y Ley Nacional de Aduanas."
        if 'apoderados especiales' in text:
            return "CAUCA IV y RECAUCA IV (Arts. 86 al 90, Apoderados Especiales Aduaneros)."
        if 'almacenes fiscales' in text or 'depósitos fiscales' in text or 'permanencia' in text:
            return "CAUCA IV y RECAUCA IV (Arts. 119 al 129, Régimen de Depósito Aduanero o Fiscal)."
        if 'depósitos aduaneros temporales' in text or 'dat' in text:
            return "CAUCA IV y RECAUCA IV (Depósitos Aduaneros Temporales en puertos y aeropuertos)."
        if 'duca' in text or 'declaración de mercancías' in text or 'declaración anticipada' in text:
            return "Resolución COMIECO 409-2018 (Régimen DUCA), CAUCA IV y RECAUCA IV."
        if 'arancel' in text or 'sac' in text or 'clasificación' in text:
            return "Convenio sobre el Régimen Arancelario y Aduanero Centroamericano (SAC) y Ley de Aduanas."
        if 'solvencia fiscal' in text:
            return "Código Tributario, Decreto 6-91 del Congreso de la República (Art. 57 'A')."
        if 'rtu' in text:
            return "Código Tributario, Decreto 6-91 (Art. 120) y Acuerdo de Directorio SAT 08-2020."
        if 'vehículos' in text or 'iprima' in text:
            return "Decreto 10-2012 (Ley de Actualización Tributaria, Libro II - IPRIMA) y Decreto 70-94."
        if 'recursos' in text or 'sanciones' in text:
            return "CAUCA IV, RECAUCA IV (Procedimiento Sancionatorio e Impugnaciones) y Ley Nacional de Aduanas."
        return "Código Aduanero Uniforme Centroamericano (CAUCA IV) y su Reglamento (RECAUCA IV)."

    # =========================================================================
    # 2. CONTRIBUYENTES
    # =========================================================================
    if pillar == 'contribuyentes':
        if 'pequeño contribuyente' in text or 'agropecuario' in text or 'decreto 7-2019' in text:
            return "Decreto 27-92 (Ley del IVA, Arts. 45 al 50) y Decreto 7-2019 (Ley de Simplificación Tributaria)."
        if 'fel' in text or 'factura electrónica' in text:
            return "Decreto 27-92 (Ley del IVA, Arts. 29 y 29 'A') y Acuerdo de Directorio SAT 13-2018."
        if 'isr' in text or 'renta' in text or 'utilidades' in text or 'simplificado' in text or 'asalariado' in text:
            return "Decreto 10-2012 (Ley de Actualización Tributaria, Libro I - Impuesto Sobre la Renta)."
        if 'iso' in text or 'solidaridad' in text:
            return "Decreto 73-2008 (Ley del Impuesto de Solidaridad - ISO)."
        if 'vehículo' in text or 'placas' in text or 'traspaso' in text or 'iscv' in text or 'circulación' in text:
            return "Decreto 70-94 (Ley del Impuesto sobre Circulación de Vehículos Terrestres, Marítimos y Aéreos)."
        if 'rtu' in text or 'nit' in text or 'domicilio' in text or 'inscripción' in text:
            return "Código Tributario, Decreto 6-91 (Arts. 112 y 120) y Acuerdo de Directorio SAT 08-2020."
        if 'solvencia' in text:
            return "Código Tributario, Decreto 6-91 del Congreso de la República (Art. 57 'A')."
        if 'iva' in text or 'crédito fiscal' in text or 'débito' in text:
            return "Decreto 27-92 del Congreso de la República (Ley del Impuesto al Valor Agregado)."
        if 'inactivación' in text or 'cese' in text or 'cancelación' in text:
            return "Código Tributario, Decreto 6-91 (Art. 120) y Resolución de Directorio SAT."
        if 'convenio' in text or 'facilidades de pago' in text:
            return "Código Tributario, Decreto 6-91 (Arts. 40 y 40 bis, Facilidades de Pago)."
        return "Código Tributario, Decreto 6-91 del Congreso de la República y Leyes Tributarias Específicas."

    # =========================================================================
    # 3. PROFESIONALES
    # =========================================================================
    if pillar == 'profesionales':
        if 'notario' in text or 'papel sellado' in text or 'protocolo' in text or 'timbre fiscal' in text:
            return "Decreto 37-92 (Ley del Impuesto de Timbres Fiscales y de Papel Sellado Especial para Protocolos)."
        if 'tev' in text or 'traspaso electrónico' in text or 'aviso notarial' in text:
            return "Código de Notariado (Decreto 314), Código Tributario (Art. 57 'A') y Acuerdos de Directorio SAT."
        if 'contador' in text or 'perito' in text or 'auditor' in text:
            return "Decreto 2450 (Normas de la Profesión Contable), Código de Comercio y Código Tributario (Arts. 112 y 120)."
        if 'colegiación' in text or 'colegiado' in text:
            return "Decreto 72-2001 (Ley de Colegiación Profesional Obligatoria)."
        return "Código de Comercio, Código Tributario y Leyes Profesionales Aplicables."

    # =========================================================================
    # 4. ENTES EXENTOS
    # =========================================================================
    if pillar == 'entes_exentos':
        if 'universidad' in text or 'colegio' in text or 'educativo' in text:
            return "Constitución Política de la República de Guatemala (Arts. 73 y 88) y Ley del IVA (Art. 8)."
        if 'iglesia' in text or 'religios' in text:
            return "Constitución Política de la República (Art. 37), Código Civil y Código Tributario (Art. 62)."
        if 'municipalidad' in text or 'gobierno local' in text:
            return "Constitución Política (Art. 257), Código Municipal (Decreto 12-2002) y Ley del IVA."
        if 'estado' in text or 'ministerio' in text or 'institución pública' in text:
            return "Ley Orgánica del Presupuesto (Decreto 101-97), Ley del IVA y Código Tributario."
        if 'no lucrativ' in text or 'ong' in text or 'asociación' in text or 'fundación' in text:
            return "Decreto 02-2003 (Ley de Organizaciones No Gubernamentales para el Desarrollo) y Ley del IVA (Art. 8)."
        if 'decreto' in text or 'fomento' in text:
            return "Decreto Legislativo de Exención / Fomento Específico y Código Tributario."
        return "Constitución Política de la República de Guatemala, Ley del IVA y Código Tributario."

    return "Código Tributario, Decreto 6-91 y Leyes Tributarias de la República de Guatemala."

# Test across all records
mapped = {}
for t in all_t:
    bl = get_base_legal(t)
    mapped[bl] = mapped.get(bl, 0) + 1

print(f"Total registros clasificados con base legal: {len(all_t)}")
print(f"Total bases legales distintas: {len(mapped)}")
print("\nTop bases legales asignadas:")
for bl, count in sorted(mapped.items(), key=lambda x: -x[1])[:15]:
    print(f"  [{count:3d}] {bl}")
