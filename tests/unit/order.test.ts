import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { compareCanonicalTramiteOrder, compareByCategoryOrder, subcategoryOrderFor, OFFICIAL_CATEGORY_ORDER, OFFICIAL_SUBCATEGORY_ORDER } from '../../src/data/categoryOrder';

describe('categoryOrder.compareByCategoryOrder', () => {
  test('respeta orden oficial', () => {
    const list = ['B', 'A', 'C'];
    const order = ['A', 'B', 'C'];
    const sorted = [...list].sort((a,b)=>compareByCategoryOrder(order,a,b));
    assert.deepEqual(sorted, ['A', 'B', 'C']);
  });
  test('elementos no oficiales van al final alfabéticamente', () => {
    const list = ['Z', 'A', 'Y'];
    const order = ['A'];
    const sorted = [...list].sort((a,b)=>compareByCategoryOrder(order,a,b));
    assert.deepEqual(sorted, ['A', 'Y', 'Z']);
  });
  test('inscripción tiene preferencia ante empate', () => {
    const list = ['Otras gestiones', 'Inscripción y actualización'];
    const order: string[] = [];
    const sorted = [...list].sort((a,b)=>compareByCategoryOrder(order,a,b));
    assert.equal(sorted[0], 'Inscripción y actualización');
  });
});

describe('categoryOrder.compareCanonicalTramiteOrder', () => {
  test('ordena por orden_n1..orden_n5', () => {
    const a: any = { gestion: 'B', orden_n1: 1, orden_n2: 1, orden_n3: 1, orden_n4: 1, orden_n5: 2 };
    const b: any = { gestion: 'A', orden_n1: 1, orden_n2: 1, orden_n3: 1, orden_n4: 1, orden_n5: 1 };
    assert.equal(compareCanonicalTramiteOrder(a,b), 1);
    assert.equal(compareCanonicalTramiteOrder(b,a), -1);
  });
  test('sigue ciclo ATO como desempate', () => {
    const a: any = { gestion: 'A', orden_n1: 1, orden_n2: 1, orden_n3: 1, orden_n4: 1, orden_n5: 1, etapaAto: 'normativa' };
    const b: any = { gestion: 'B', orden_n1: 1, orden_n2: 1, orden_n3: 1, orden_n4: 1, orden_n5: 1, etapaAto: 'empezar' };
    assert.equal(compareCanonicalTramiteOrder(b,a), -4);
  });
  test('coalesce dash/strings a 999', () => {
    const a: any = { gestion: 'A', orden_n1: 1, orden_n2: 1, orden_n3: '—', orden_n4: '—', orden_n5: '—' };
    const b: any = { gestion: 'B', orden_n1: 1, orden_n2: 1, orden_n3: 1, orden_n4: 1, orden_n5: 1 };
    assert.equal(compareCanonicalTramiteOrder(b,a), -998);
  });
});

describe('categoryOrder.contracts', () => {
  test('categorías oficiales cubiertas', () => {
    assert.ok(OFFICIAL_CATEGORY_ORDER.contribuyentes.includes('Contribuyente General'));
    assert.ok(OFFICIAL_CATEGORY_ORDER.comercio_exterior.includes('Importadores'));
  });
  test('Sin Obligaciones es compacto', () => {
    assert.deepEqual(OFFICIAL_SUBCATEGORY_ORDER['Sin Obligaciones'], ['Sin Obligaciones']);
    assert.deepEqual(subcategoryOrderFor('Sin Obligaciones'), ['Sin Obligaciones']);
  });
});
