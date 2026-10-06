/**
 * Saneado mecanico de src/data/allTramites.json (690 registros).
 *
 * Aplica unicamente transformaciones que NO requieren criterio editorial:
 * el dato corregido se deduce del propio registro o de su categoria oficial.
 * El texto que exige redaccion humana se reporta en
 * docs/auditoria-contenido.md y no se toca.
 *
 *   1. perfilDestinatario: etiquetas de procedencia del dataset -> categoria oficial
 *   2. impactoOImportancia: etiquetas de clasificacion -> nota interna, campo vacio
 *   3. descripcion: expansion de acronimos en su primera mencion
 *
 * Uso: node scripts/sanitize-contenido.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const RUTA_DATOS = join(RAIZ, 'src/data/allTramites.json');
const RUTA_INFORME = join(RAIZ, 'docs/auditoria-contenido.md');
const DRY_RUN = process.argv.includes('--dry-run');

/** Etiquetas de procedencia interna que nunca deben llegar a la interfaz. */
const PROCEDENCIA = /^(Análisis|Grupos y categorías|Marcada .*)$/i;

/**
 * Etiquetas de clasificacion del dataset (en mayusculas sostenidas) que
 * ocupaban impactoOImportancia sin describir ningun beneficio ciudadano.
 */
const CLASIFICACION = /^(SERVICIOS TRIBUTARIOS|ADUANAS|CAPACITACIÓN|INSTITUCIONAL|CONTÁCTANOS|ESTADÍSTICAS)$/;

const ACRONIMOS = [
  ['NIT', 'Número de Identificación Tributaria'],
  ['RTU', 'Registro Tributario Unificado'],
  ['DPI', 'Documento Personal de Identificación'],
  ['FEL', 'Factura Electrónica en Línea'],
  ['IVA', 'Impuesto al Valor Agregado'],
  ['ISR', 'Impuesto sobre la Renta'],
];

/** categorias cuyo nombre no describe por si solo una audiencia. */
const AUDIENCIA_POR_CATEGORIA = {
  'NIT sin Obligaciones': 'Personas individuales sin actividad económica',
  'Pequeños Contribuyentes': 'Personas y empresas del régimen de pequeño contribuyente',
  'Contribuyente General': 'Personas y empresas con régimen general',
  'Contribuyentes Especiales': 'Personas y empresas con calidad de contribuyente especial',
};

/**
 * `perfilDestinatario` es inutil como etiqueta de procedencia ("Analisis",
 * "Grupos y categorias") o como repeticion del nombre de la categoria. En ambos
 * casos se sustituye por la categoria oficial, que si identifica al destinatario.
 */
const esPerfilInutil = (valor, categoria) => {
  const v = (valor ?? '').trim();
  if (!v) return true;
  if (PROCEDENCIA.test(v)) return true;
  if (/:\s*\S/.test(v)) return true;
  return v === categoria && Boolean(AUDIENCIA_POR_CATEGORIA[categoria]);
};

/**
 * Expande un acronimo en su primera mencion, salvo que ya venga entre
 * parentesis (p. ej. "... (NIT)") o que la Expansion completa ya este escrita.
 */
function expandirAcrónimo(texto, sigla, Expansion) {
  if (!texto) return texto;
  const yaExpandido = texto.includes(`${Expansion} (${sigla})`);
  if (yaExpandido) return texto;
  const patron = new RegExp(`(?<!\\()\\b${sigla}\\b(?!\\s*\\()`, 'i');
  if (!patron.test(texto)) return texto;
  return texto.replace(patron, `${Expansion} (${sigla})`);
}

const original = readFileSync(RUTA_DATOS, 'utf8');
const datos = JSON.parse(original);

const informe = {
  perfilCorregido: [],
  impactoDevuelto: [],
  acronimosExpandidos: [],
  descripcionPlantilla: [],
};

for (const registro of datos) {
  const id = registro.id;
  const categoria = (registro.categoria ?? '').trim();

  // 1. perfilDestinatario
  if (esPerfilInutil(registro.perfilDestinatario, categoria)) {
    const antes = (registro.perfilDestinatario ?? '').trim();
    const despues = AUDIENCIA_POR_CATEGORIA[categoria] || categoria;
    if (antes !== despues) {
      informe.perfilCorregido.push({ id, antes: antes || '(vacio)', despues });
      registro.perfilDestinatario = despues;
    }
  }

  // 2. impactoOImportancia
  const impacto = (registro.impactoOImportancia ?? '').trim();
  if (!impacto || CLASIFICACION.test(impacto) || PROCEDENCIA.test(impacto)) {
    if (impacto) {
      const marca = `Clasificacion en el dataset: ${impacto}.`;
      registro.nota = registro.nota ? `${registro.nota} ${marca}` : marca;
      informe.impactoDevuelto.push({ id, valor: impacto });
    }
    registro.impactoOImportancia = '';
  }

  // 3. acronimos en descripcion
  let descripcion = registro.descripcion;
  for (const [sigla, expansion] of ACRONIMOS) {
    descripcion = expandirAcrónimo(descripcion, sigla, expansion);
  }
  if (descripcion !== registro.descripcion) {
    if (/^(Requisitos, pasos y documentos para|Servicio en línea para)/.test(descripcion)) {
      informe.descripcionPlantilla.push(id);
    }
    informe.acronimosExpandidos.push(id);
    registro.descripcion = descripcion;
  } else if (/^(Requisitos, pasos y documentos para|Servicio en línea para)/.test(descripcion ?? '')) {
    informe.descripcionPlantilla.push(id);
  }
}

// Redaccion pendiente: descripciones que solo repiten el titulo del tramite.
const plantillas = datos.filter((r) =>
  /^(Requisitos, pasos y documentos para|Servicio en línea para)/.test(r.descripcion ?? '')
);

const salida = `\n${JSON.stringify(datos, null, 2)}`;

if (!DRY_RUN) {
  writeFileSync(RUTA_DATOS, salida);
  mkdirSync(dirname(RUTA_INFORME), { recursive: true });
  writeFileSync(
    RUTA_INFORME,
    `# Auditoria de contenido — src/data/allTramites.json

Generado por \`scripts/sanitize-contenido.mjs\`. ${DRY_RUN ? 'Ejecucion en seco.' : ''}

## Aplicado automaticamente

| Transformacion | Registros |
|---|---|
| \`perfilDestinatario\`: etiqueta de procedencia -> categoria oficial | ${informe.perfilCorregido.length} |
| \`impactoOImportancia\`: etiqueta de clasificacion -> nota interna | ${informe.impactoDevuelto.length} |
| \`descripcion\`: acronimo expandido en primera mencion | ${informe.acronimosExpandidos.length} |

## Pendiente de redaccion humana

| Caso | Registros | Por que no es automatico |
|---|---|---|
| Descripcion que repite el titulo del tramite | ${plantillas.length} | Cada una requiere informacion propia del tramite; no se puede derivar del registro. |
| \`impactoOImportancia\` vacio tras el saneado | ${datos.filter((r) => !r.impactoOImportancia).length} | El beneficio ciudadano no es deducible de la clasificacion. |
| Nombre oficial de regimen dentro de frase | ${datos.filter((r) => /Pequeño Contribuyente/.test(r.descripcion ?? '')).length} | "Regimen Electronico de Pequeno Contribuyente" es nombre oficial: distinguirlo del uso generico exige criterio editorial. |
| \`descripcion\` con "Informacion sobre:" | ${datos.filter((r) => /^Informacion sobre:/.test(r.descripcion ?? '')).length} | Etiqueta de seccion, no descripcion. |
`
  );
}

console.log(`perfilDestinatario corregido : ${informe.perfilCorregido.length}`);
console.log(`impactoOImportancia devuelto : ${informe.impactoDevuelto.length}`);
console.log(`descripcion con acronimos    : ${informe.acronimosExpandidos.length}`);
console.log(`pendiente redaccion humana   : ${plantillas.length} descripciones`);
console.log(DRY_RUN ? '(dry-run: no se escribio nada)' : `escrito: ${RUTA_DATOS}`);
