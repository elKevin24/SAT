import json
import os

DATA_PATH = 'src/data/allTramites.json'

with open(DATA_PATH, 'r', encoding='utf-8') as f:
    tramites = json.load(f)

print(f"Cargados {len(tramites)} tramites para limpieza de esquema.")

DEPRECATED_KEYS = [
    'macroGrupo',
    'categoria',
    'subcategoria',
    'tema',
    'subtema',
    'tramite',
    'nivel1_segmento',
    'nivel2_area',
    'nivel3_subarea',
    'nivel4_tema',
    'nivel5_tramite',
    'segmento',
    'regimenArea',
    'grupoActor',
    'materiaTema',
    'subtemaGestion',
    'seccionActual'
]

for t in tramites:
    # 1. Renombrar tramite -> gestion
    gestion = t.get('gestion') or t.get('tramite') or t.get('nombreActual', '')
    t['gestion'] = gestion

    # 2. Asegurar campos canónicos nivel1..nivel5 y orden_n1..orden_n5
    t['nivel1'] = t.get('nivel1') or t.get('nivel1_segmento', '')
    t['nivel2'] = t.get('nivel2') or t.get('nivel2_area', '')
    t['nivel3'] = t.get('nivel3') or t.get('nivel3_subarea', '—')
    t['nivel4'] = t.get('nivel4') or t.get('nivel4_tema', '—')
    t['nivel5'] = t.get('nivel5') or t.get('nivel5_tramite', '—')

    # 3. Eliminar claves deprecadas
    for k in DEPRECATED_KEYS:
        t.pop(k, None)

# Ordenar las claves de cada objeto para consistencia y legibilidad
PREFERRED_ORDER = [
    'id', 'codigo', 'codigos_legacy', 'pillar', 'pillarName',
    'orden_n1', 'nivel1',
    'orden_n2', 'nivel2',
    'orden_n3', 'nivel3',
    'orden_n4', 'nivel4',
    'orden_n5', 'nivel5',
    'orden_contenido',
    'gestion', 'nombreActual', 'descripcion', 'url',
    'migaBreadcrumb',
    'tipoInteraccion', 'tipoInteraccionLabel',
    'tipologiaContenido', 'tipologiaContenidoLabel',
    'plataformaSistema', 'plataformaSistemaLabel', 'canalAtencion',
    'etapaAto', 'etapaAtoLabel',
    'baseLegal', 'esBrecha', 'actorEspecifico', 'subfamiliaAduanera', 'familiaAduanera',
    'controlAuditoria', 'rutasProceso', 'familias_ids', 'familiaTematica',
    'grupoNo', 'grupoNombre', 'perfilDestinatario', 'impactoOImportancia', 'nota'
]

cleaned_tramites = []
for t in tramites:
    ordered_t = {}
    for k in PREFERRED_ORDER:
        if k in t:
            ordered_t[k] = t[k]
    # Restantes que no estén en preferred
    for k, v in t.items():
        if k not in ordered_t:
            ordered_t[k] = v
    cleaned_tramites.append(ordered_t)

with open(DATA_PATH, 'w', encoding='utf-8') as f:
    json.dump(cleaned_tramites, f, ensure_ascii=False, indent=2)

all_remaining_keys = set()
for t in cleaned_tramites:
    all_remaining_keys.update(t.keys())

print("Limpieza completada exitosamente.")
print(f"Claves remanentes en allTramites.json: {sorted(all_remaining_keys)}")
