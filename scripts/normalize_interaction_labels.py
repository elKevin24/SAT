# -*- coding: utf-8 -*-
"""
Normaliza el campo `tipoInteraccionLabel` de src/data/allTramites.json a las
4 etiquetas canónicas de la Dimensión 3 (Tipología de Interacción) definidas en
la gobernanza de la arquitectura de información:

    guia_informativa      -> "Guía Informativa / Texto"
    servicio_transaccional-> "Trámite / Aplicativo en Línea"
    consulta_datos        -> "Consulta en Base de Datos"
    descarga_recurso      -> "Descarga de Documento / Software"

Motivo: el dataset arrastraba 8 variantes de etiqueta para las mismas 4
categorías (p. ej. "Consulta a Base de Datos", "Buscador / Consulta en Línea",
"Descarga / Software"), lo que rompía los conteos de los libros Excel
(Resumen Arquitectura sumaba 658 en lugar de 715) y mostraba textos
inconsistentes en la interfaz.

El campo de código `tipoInteraccion` (usado por la lógica de UI) no se modifica.
"""
import json
import shutil

PATH = 'src/data/allTramites.json'
BACKUP = 'src/data/allTramites.json.labelbak'

# Canónico -> variantes observadas
CANONICAL = {
    'guia_informativa': 'Guía Informativa / Texto',
    'servicio_transaccional': 'Trámite / Aplicativo en Línea',
    'consulta_datos': 'Consulta en Base de Datos',
    'descarga_recurso': 'Descarga de Documento / Software',
}

# Mapa explícito de variantes -> etiqueta canónica
LABEL_MAP = {
    'Guía Informativa / Texto': 'Guía Informativa / Texto',
    'Trámite / Aplicativo en Línea': 'Trámite / Aplicativo en Línea',
    'Consulta en Base de Datos': 'Consulta en Base de Datos',
    'Consulta a Base de Datos': 'Consulta en Base de Datos',
    'Buscador / Consulta en Línea': 'Consulta en Base de Datos',
    'Descarga de Documento / Software': 'Descarga de Documento / Software',
    'Descarga / Software': 'Descarga de Documento / Software',
    'Formulario / Documento Descargable': 'Descarga de Documento / Software',
}

with open(PATH, encoding='utf-8') as f:
    data = json.load(f)

shutil.copyfile(PATH, BACKUP)

cambios = 0
desconocidos = []
for t in data:
    code = t.get('tipoInteraccion')
    actual = t.get('tipoInteraccionLabel')
    esperado = CANONICAL.get(code)
    if esperado is None:
        desconocidos.append((t.get('codigo'), code, actual))
        continue
    if actual != esperado:
        t['tipoInteraccionLabel'] = esperado
        cambios += 1
    else:
        # asegura el idioma/casing canónico aunque coincida
        t['tipoInteraccionLabel'] = esperado

with open(PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f'Registros normalizados: {cambios}')
print(f'Respaldo: {BACKUP}')
if desconocidos:
    print(f'ADVERTENCIA: {len(desconocidos)} registros con tipoInteraccion desconocido:')
    for c in desconocidos[:10]:
        print('  ', c)
