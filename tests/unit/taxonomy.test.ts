import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildTaxonomy, categoriaId, subcategoriaId, resolveCategoria } from '../../src/data/taxonomy';

describe('taxonomy.ids', () => {
  test('categoriaId y subcategoriaId estables', () => {
    assert.equal(categoriaId('contribuyentes', 'Contribuyente General'), 'contribuyentes/contribuyente-general');
    assert.equal(subcategoriaId('contribuyentes/contribuyente-general', 'RTU Digital'), 'contribuyentes/contribuyente-general/rtu-digital');
  });
});

describe('taxonomy.buildTaxonomy', () => {
  const tramites = [
    { pillar: 'contribuyentes', categoria: 'Contribuyente General', subcategoria: 'RTU' },
    { pillar: 'contribuyentes', categoria: 'Contribuyente General', subcategoria: 'RTU' },
    { pillar: 'contribuyentes', categoria: 'Contribuyente General', subcategoria: 'FEL' },
    { pillar: 'contribuyentes', categoria: 'Sin Obligaciones', subcategoria: '—' }
  ] as any;

  test('cuenta categorías y subcategorías', () => {
    const tax = buildTaxonomy(tramites);
    const cg = tax.byCategoriaId.get(categoriaId('contribuyentes', 'Contribuyente General'))!;
    assert.equal(cg.count, 3);
    assert.equal(cg.subcategorias.length, 2);
    assert.equal(cg.subcategorias.find(s => s.nombre === 'RTU')?.count, 2);
  });

  test('no añade subcategoría para —', () => {
    const tax = buildTaxonomy(tramites);
    const so = tax.byCategoriaId.get(categoriaId('contribuyentes', 'Sin Obligaciones'))!;
    assert.equal(so.count, 1);
    assert.equal(so.subcategorias.length, 0);
  });
});

describe('taxonomy.resolveCategoria', () => {
  const tramites = [
    { pillar: 'contribuyentes', categoria: 'Contribuyente General', subcategoria: 'RTU' }
  ] as any;
  const tax = buildTaxonomy(tramites);

  test('resuelve por id, nombre y slug', () => {
    assert.equal(resolveCategoria(tax, 'contribuyentes', categoriaId('contribuyentes', 'Contribuyente General')), 'Contribuyente General');
    assert.equal(resolveCategoria(tax, 'contribuyentes', 'Contribuyente General'), 'Contribuyente General');
    assert.equal(resolveCategoria(tax, 'contribuyentes', 'contribuyente-general'), 'Contribuyente General');
    assert.equal(resolveCategoria(tax, 'contribuyentes', 'inexistente'), null);
  });
});
