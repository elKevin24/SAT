"""
Generador de src/data/taxonomyDescriptions.ts
Portal SAT Guatemala
Sincroniza los 239 nodos taxonómicos canónicos y las 27 fichas de interfaz con tipado TypeScript estricto.
"""

import json
import re
from pathlib import Path
import sys

# Importar las 27 categorías de interfaz
sys.path.insert(0, str(Path(__file__).resolve().parent))
from nodos_27_data import NODOS_MAPA

def slugify(text: str) -> str:
    if not text or text in ['—', '-', 'None']:
        return ''
    text = text.lower().strip()
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
        'ñ': 'n', '/': '-', '\\': '-', '&': 'y', '(': '', ')': '',
        '[': '', ']': '', ',': '', '.': '', ':': '', ';': '', '"': '', "'": ''
    }
    for orig, rep in replacements.items():
        text = text.replace(orig, rep)
    text = re.sub(r'[^a-z0-9\-]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

with open('database/arbol_navegacion.json', 'r', encoding='utf-8') as f:
    arbol = json.load(f)

# Separar por niveles
n1_nodes = [n for n in arbol if n['nivel'] == 1]
n2_nodes = [n for n in arbol if n['nivel'] == 2]

ts_lines = []
ts_lines.append("""/**
 * DICCIONARIO CANÓNICO DE DESCRIPCIONES TAXONÓMICAS
 * Portal SAT Guatemala
 * Provee fichas informativas oficiales (¿Qué es?, Texto orientador y Base jurídica)
 * para Nivel 1, Nivel 2, Nivel 3 y Nivel 4,
 * así como para las 27 fichas de interfaz por categoría.
 */

export interface TaxonDescription {
  nombre: string;
  que_es: string;
  lead_text: string;
  base_juridica: string;
  alcance?: string;
  nivel: number;
}

export const SEGMENT_DESCRIPTIONS: Record<string, TaxonDescription> = {""")

for n in n1_nodes:
    cs = n['contenido_segmento']
    ts_lines.append(f"""  '{n["slug"]}': {{
    nombre: {json.dumps(n["nombre"], ensure_ascii=False)},
    que_es: {json.dumps(cs["que_es"], ensure_ascii=False)},
    lead_text: {json.dumps(cs["lead_text"], ensure_ascii=False)},
    base_juridica: {json.dumps(cs["base_juridica"], ensure_ascii=False)},
    nivel: 1
  }},""")

ts_lines.append("""};

export const AREA_DESCRIPTIONS: Record<string, TaxonDescription> = {""")

for n in n2_nodes:
    cs = n['contenido_segmento']
    ts_lines.append(f"""  '{n["materialized_path"]}': {{
    nombre: {json.dumps(n["nombre"], ensure_ascii=False)},
    que_es: {json.dumps(cs["que_es"], ensure_ascii=False)},
    lead_text: {json.dumps(cs["lead_text"], ensure_ascii=False)},
    base_juridica: {json.dumps(cs["base_juridica"], ensure_ascii=False)},
    nivel: 2
  }},""")

ts_lines.append("""};

export const TAXONOMY_NODE_DESCRIPTIONS: Record<string, TaxonDescription> = {""")

# 1. Agregar todos los 239 nodos del árbol canónico
for n in arbol:
    cs = n['contenido_segmento']
    ts_lines.append(f"""  '{n["materialized_path"]}': {{
    nombre: {json.dumps(n["nombre"], ensure_ascii=False)},
    que_es: {json.dumps(cs["que_es"], ensure_ascii=False)},
    lead_text: {json.dumps(cs["lead_text"], ensure_ascii=False)},
    base_juridica: {json.dumps(cs["base_juridica"], ensure_ascii=False)},
    nivel: {n["nivel"]}
  }},""")

# 2. Agregar las 27 categorías de interfaz (NODOS_MAPA)
for nodo in NODOS_MAPA:
    cat = nodo['categoria']
    cat_slug = slugify(cat)
    cat_key = f"categoria/{cat_slug}"
    ts_lines.append(f"""  '{cat_key}': {{
    nombre: {json.dumps(cat, ensure_ascii=False)},
    que_es: {json.dumps(nodo["que_es"], ensure_ascii=False)},
    lead_text: {json.dumps(nodo["lead_text"], ensure_ascii=False)},
    base_juridica: {json.dumps(nodo["base_juridica"], ensure_ascii=False)},
    alcance: {json.dumps(nodo.get("alcance", ""), ensure_ascii=False)},
    nivel: 3
  }},""")

ts_lines.append("""};

/**
 * Normaliza cualquier cadena para búsqueda tolerante y determinista:
 * Minúsculas, sin acentos ni signos diacríticos, guiones en vez de espacios.
 */
export function normalizeTaxonKey(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Índice unificado dual (por clave exacta, por slug normalizado y por nombre de nodo)
const NORMALIZED_LOOKUP: Record<string, TaxonDescription> = {};

// Poblado del índice unificado
for (const [key, desc] of Object.entries(TAXONOMY_NODE_DESCRIPTIONS)) {
  NORMALIZED_LOOKUP[key] = desc;
  NORMALIZED_LOOKUP[normalizeTaxonKey(key)] = desc;
  NORMALIZED_LOOKUP[desc.nombre] = desc;
  NORMALIZED_LOOKUP[normalizeTaxonKey(desc.nombre)] = desc;
  
  // Componente terminal de la ruta
  const lastPart = key.split('/').pop();
  if (lastPart) {
    NORMALIZED_LOOKUP[lastPart] = desc;
    NORMALIZED_LOOKUP[normalizeTaxonKey(lastPart)] = desc;
  }
}

// Poblado de segmentos y áreas
for (const [key, desc] of Object.entries(SEGMENT_DESCRIPTIONS)) {
  NORMALIZED_LOOKUP[key] = desc;
  NORMALIZED_LOOKUP[normalizeTaxonKey(key)] = desc;
  NORMALIZED_LOOKUP[desc.nombre] = desc;
  NORMALIZED_LOOKUP[normalizeTaxonKey(desc.nombre)] = desc;
}

for (const [key, desc] of Object.entries(AREA_DESCRIPTIONS)) {
  NORMALIZED_LOOKUP[key] = desc;
  NORMALIZED_LOOKUP[normalizeTaxonKey(key)] = desc;
  NORMALIZED_LOOKUP[desc.nombre] = desc;
  NORMALIZED_LOOKUP[normalizeTaxonKey(desc.nombre)] = desc;
}

/**
 * Resuelve la ficha de descripción técnica/operativa para cualquier nodo,
 * aceptando indiferentemente rutas materializadas, slugs o etiquetas de texto de UI
 * (ej. 'NIT sin Obligaciones', 'Pequeños Contribuyentes', 'Declaraciones y Pagos', 'contribuyentes').
 */
export function getTaxonDescription(query: string | null | undefined): TaxonDescription | undefined {
  if (!query || query === '—') return undefined;
  
  // 1. Coincidencia directa
  if (NORMALIZED_LOOKUP[query]) {
    return NORMALIZED_LOOKUP[query];
  }
  
  // 2. Coincidencia por clave normalizada
  const norm = normalizeTaxonKey(query);
  if (NORMALIZED_LOOKUP[norm]) {
    return NORMALIZED_LOOKUP[norm];
  }
  
  // 3. Coincidencia con prefijo categoria/
  if (NORMALIZED_LOOKUP[`categoria/${norm}`]) {
    return NORMALIZED_LOOKUP[`categoria/${norm}`];
  }
  
  // 4. Búsqueda por subcadena en nombres
  for (const [key, desc] of Object.entries(TAXONOMY_NODE_DESCRIPTIONS)) {
    const normNombre = normalizeTaxonKey(desc.nombre);
    if (normNombre === norm || normNombre.includes(norm) || norm.includes(normNombre)) {
      return desc;
    }
  }
  
  return undefined;
}
""")

content = "\n".join(ts_lines)
with open('src/data/taxonomyDescriptions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"src/data/taxonomyDescriptions.ts generado con éxito. Nodos indexados: {len(arbol)} canónicos + {len(NODOS_MAPA)} fichas UI.")
