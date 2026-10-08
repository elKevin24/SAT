import json
import shutil
import os

ALL_TRAMITES_PATH = 'src/data/allTramites.json'
BACKUP_PATH = 'src/data/allTramites.json.bak'

# 1. Asegurar respaldo
if not os.path.exists(BACKUP_PATH):
    shutil.copyfile(ALL_TRAMITES_PATH, BACKUP_PATH)
    print(f"Respaldo creado en {BACKUP_PATH}")
else:
    print(f"Respaldo existente verificado en {BACKUP_PATH}")

with open(BACKUP_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

TITLE_CORRECTIONS = {
    'comercio_exterior-52': 'Requisitos previos a la importación aérea',
    'comercio_exterior-134': 'Manual operativo de Aduana sin Papeles y digitalización'
}

count_ce = 0
for t in data:
    if t.get('pillar') == 'comercio_exterior' or t.get('pillarName') == 'Operadores de Comercio Exterior':
        count_ce += 1
        tid = t.get('id')
        
        # Corrección de título si aplica
        if tid in TITLE_CORRECTIONS:
            t['nombreActual'] = TITLE_CORRECTIONS[tid]
            
        n = t.get('nombreActual') or t.get('tramite')
        b = t.get('nivel2_area') or t.get('categoria')
        sc = t.get('subcategoria') or ''
        n3 = t.get('nivel3_subarea') or ''
        act = t.get('actorEspecifico') or ''
        
        cat_final, subcat_final, tema_final = None, None, ''
        
        if 'OEA' in b:
            cat_final = 'Operador Económico Autorizado (OEA)'
            subcat_final = 'Programa OEA'
        elif 'Regímenes' in b or 'Zonas Especiales' in b or 'Regmenes' in b:
            cat_final = 'Regímenes Territoriales y Zonas Especiales'
            if 'maq-' in tid or '29-89' in sc or '29-89' in n3:
                subcat_final = 'Maquilas (Decreto 29-89)'
            else:
                subcat_final = 'Zonas de Desarrollo Económico Especial Público (ZDEEP)'
                if 'zdeep-usr' in tid or 'Usuaria' in act:
                    tema_final = 'Empresas Usuarias Calificadas ZDEEP'
                else:
                    tema_final = 'Entidades Administradoras ZDEEP'
        elif 'Auxiliares' in b or 'AFPA' in b:
            cat_final = 'Auxiliares de la Función Pública Aduanera (AFPA)'
            if 'Courier' in n3 or tid in ['comercio_exterior-87', 'comercio_exterior-88', 'comercio_exterior-89']:
                subcat_final = 'Empresas de Entrega Rápida o Courier'
            elif 'Agente' in n3 or 'age-' in tid:
                subcat_final = 'Agentes Aduaneros'
            elif 'Apoderado' in n3 or 'apod-' in tid or 'apo-' in tid:
                subcat_final = 'Apoderados Especiales Aduaneros'
            elif 'Transportista' in n3 or tid in [
                'comercio_exterior-104', 'comercio_exterior-102', 'comercio_exterior-103', 'comercio_exterior-101',
                'comercio_exterior-110', 'comercio_exterior-112', 'comercio_exterior-111', 'entes_exentos-82',
                'comercio_exterior-109', 'comercio_exterior-108', 'comercio_exterior-107', 'comercio_exterior-106',
                'comercio_exterior-5', 'comercio_exterior-137'
            ]:
                subcat_final = 'Transportistas Aduaneros'
                if tid in ['comercio_exterior-104', 'comercio_exterior-102', 'comercio_exterior-103', 'comercio_exterior-101']:
                    tema_final = 'Equipo de Carga y Contenedores — Régimen ATC'
                elif tid in ['comercio_exterior-110', 'comercio_exterior-112']:
                    tema_final = 'Manifiestos de Carga y CUSCAR'
                elif tid in ['comercio_exterior-111', 'entes_exentos-82', 'comercio_exterior-109']:
                    tema_final = 'Monitoreo en Ruta y Marchamo Electrónico'
                elif tid in ['comercio_exterior-108', 'comercio_exterior-107', 'comercio_exterior-106']:
                    tema_final = 'Despacho y Operaciones en Recintos'
                elif tid in ['comercio_exterior-5', 'comercio_exterior-137']:
                    tema_final = 'Infracciones y Defensa Aduanera'
            else:
                subcat_final = 'Depósitos Aduaneros'
                if 'dat-' in tid or 'DAT' in act:
                    tema_final = 'Depósitos Aduaneros Temporales (DAT)'
                elif 'agd-' in tid or 'AGD' in act:
                    tema_final = 'Almacenes Generales de Depósito (AGD)'
                else:
                    tema_final = 'Almacenes Fiscales'
        elif 'Exportador' in b:
            cat_final = 'Exportadores'
            if 'Padrón' in sc or 'Padrn' in sc or tid in ['comercio_exterior-69', 'comercio_exterior-66', 'comercio_exterior-70', 'comercio_exterior-67', 'comercio_exterior-71', 'comercio_exterior-68', 'comercio_exterior-76']:
                subcat_final = 'Padrón y Registro de Exportadores'
            elif 'Declaración' in sc or 'Declaracin' in sc or 'Embarque' in sc or tid in ['comercio_exterior-63', 'comercio_exterior-64', 'comercio_exterior-65', 'comercio_exterior-77']:
                subcat_final = 'Declaraciones Aduaneras y Embarques'
            else:
                subcat_final = 'Devolución de Crédito Fiscal'
        elif 'Importador' in b:
            cat_final = 'Importadores'
            if 'Registro' in sc or 'Padrón' in sc or 'Padrn' in sc:
                subcat_final = 'Registro y Padrón de Importadores'
            elif 'Declaraciones' in sc or 'DUCA' in sc:
                subcat_final = 'Declaraciones Aduaneras y DUCAs'
                if tid == 'comercio_exterior-133':
                    tema_final = ''
                elif tid in ['comercio_exterior-19', 'comercio_exterior-134']:
                    tema_final = '1. Preparación y Documentos de Soporte'
                elif tid in ['comercio_exterior-18', 'comercio_exterior-17', 'comercio_exterior-38', 'comercio_exterior-39', 'entes_exentos-59']:
                    tema_final = '2. Transmisión de la Declaración de Mercancías'
                else:
                    tema_final = '3. Verificación y Seguimiento de Declaraciones'
            elif 'Despacho' in sc or 'Levante' in sc or 'Selectivo' in sc:
                subcat_final = 'Despacho Aduanero, Levante y Selectivo'
                if tid in ['comercio_exterior-128', 'profesionales-15', 'comercio_exterior-21', 'comercio_exterior-20', 'contribuyentes-18', 'profesionales-28']:
                    tema_final = '1. Gestiones anticipadas'
                elif tid in ['comercio_exterior-15', 'comercio_exterior-132', 'profesionales-22', 'entes_exentos-58', 'comercio_exterior-13', 'comercio_exterior-12', 'comercio_exterior-144']:
                    tema_final = '2. Operaciones en recinto, selectivo y levante'
                else:
                    tema_final = '3. Puestos de control, trazabilidad y facilitación'
            elif 'Vehículo' in sc or 'Vehculo' in sc:
                subcat_final = 'Importación y Nacionalización de Vehículos'
                if tid in ['comercio_exterior-177', 'comercio_exterior-42', 'comercio_exterior-41', 'comercio_exterior-33']:
                    tema_final = '1. Tablas de valores y cálculo de impuestos'
                else:
                    tema_final = '2. Trámites de importación y registro'
            else:
                subcat_final = 'Mercancías en Abandono, Depósitos y Franquicias'
                if tid in ['comercio_exterior-24', 'comercio_exterior-45', 'comercio_exterior-44', 'comercio_exterior-43', 'comercio_exterior-28']:
                    tema_final = '1. Rescate de mercancías y devoluciones'
                else:
                    tema_final = '2. Franquicias y menor cuantía'
        elif 'Normativa' in b or 'Arancel' in b:
            cat_final = 'Normativa y Operaciones Aduaneras Generales'
            if 'Arancel' in sc or 'SAC' in sc:
                subcat_final = 'Arancel Centroamericano (SAC) y Permisos'
            elif 'Acuerdo' in sc or 'Facilitación' in sc:
                subcat_final = 'Acuerdos Comerciales y Facilitación'
            elif 'Contrabando' in sc or 'Defraudación' in sc:
                subcat_final = 'Prevención de Contrabando y Defraudación'
            elif 'Consulta' in sc or 'Recurso' in sc or 'Valoración' in sc:
                subcat_final = 'Consultas Técnicas, Recursos y Valoración'
                if tid in ['comercio_exterior-169', 'comercio_exterior-168', 'comercio_exterior-167', 'comercio_exterior-170']:
                    tema_final = '1. Consultas técnicas y criterios vinculantes'
                elif tid in ['comercio_exterior-23', 'comercio_exterior-127', 'comercio_exterior-165']:
                    tema_final = '2. Recursos administrativos y defensa aduanera'
                else:
                    tema_final = '3. Gestiones generales del operador'
            else:
                subcat_final = 'Modernización e Infraestructura Aduanera'
                if tid in ['entes_exentos-86', 'comercio_exterior-149', 'comercio_exterior-154', 'comercio_exterior-153', 'comercio_exterior-152', 'comercio_exterior-151', 'comercio_exterior-150']:
                    tema_final = '1. Infraestructura y puestos fronterizos'
                elif tid in ['comercio_exterior-159', 'comercio_exterior-160', 'comercio_exterior-158', 'comercio_exterior-157']:
                    tema_final = '2. Tecnología y revisión no intrusiva'
                else:
                    tema_final = '3. Transparencia, repositorio y estadísticas'

        # Asignar campos normalizados
        t['pillar'] = 'comercio_exterior'
        t['pillarName'] = 'Operadores de Comercio Exterior'
        t['macroGrupo'] = 'Operadores de Comercio Exterior'
        t['nivel1_segmento'] = 'Operadores de Comercio Exterior'
        t['grupoNo'] = 5
        t['grupoNombre'] = 'Operadores de Comercio Exterior'
        
        t['categoria'] = cat_final
        t['nivel2_area'] = cat_final
        t['regimenArea'] = cat_final
        
        t['subcategoria'] = subcat_final
        t['nivel3_subarea'] = subcat_final
        
        t['tema'] = tema_final
        t['nivel4_tema'] = tema_final
        
        t['subtema'] = ''
        t['nivel5_tramite'] = n
        
        miga_parts = ['Operadores de Comercio Exterior', cat_final]
        if subcat_final and subcat_final != cat_final:
            miga_parts.append(subcat_final)
        if tema_final:
            miga_parts.append(tema_final)
        miga_parts.append(n)
        
        t['migaBreadcrumb'] = ' > '.join(miga_parts)

print(f"Total registros Comercio Exterior procesados: {count_ce}")

if count_ce == 246:
    with open(ALL_TRAMITES_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Dataset maestro {ALL_TRAMITES_PATH} actualizado exitosamente con los 246 registros de Comercio Exterior.")
else:
    print(f"Error: Conteo inesperado ({count_ce} != 246).")
