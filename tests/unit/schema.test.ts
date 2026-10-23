import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, collectTramiteErrors, collectProcesoErrors, collectContenidoUnicoErrors } from '../../src/data/schema';

describe('schema.slugify', () => {
  test('normaliza acentos y espacios', () => {
    assert.equal(slugify('Inscripción y Actualización'), 'inscripcion-y-actualizacion');
  });
  test('colapsa guiones y quita bordes', () => {
    assert.equal(slugify('  Facturación -- Electrónica  '), 'facturacion-electronica');
  });
  test('solo minúsculas alfanumérico', () => {
    assert.equal(slugify('FEL (Factura Electrónica)'), 'fel-factura-electronica');
  });
});

describe('schema.collectTramiteErrors', () => {
  test('rechaza no-arreglo', () => {
    assert.deepEqual(collectTramiteErrors({}), ['allTramites: se esperaba un arreglo']);
  });
  test('detecta duplicados de id', () => {
    const errs = collectTramiteErrors([
      { id: 'a', pillar: 'contribuyentes', pillarName: 'Contribuyentes', nivel1: 'Contribuyentes', nivel2: 'X', nivel3: '—', gestion: 'G', descripcion: 'D', url: 'https://x' },
      { id: 'a', pillar: 'contribuyentes', pillarName: 'Contribuyentes', nivel1: 'Contribuyentes', nivel2: 'Y', nivel3: '—', gestion: 'G', descripcion: 'D', url: 'https://x' }
    ]);
    assert.ok(errs.some((e) => e.includes('duplicado')));
  });
  test('valida pillar y url', () => {
    const errs = collectTramiteErrors([{ id: 'a', pillar: 'otro', pillarName: 'X', nivel1: 'X', nivel2: 'X', nivel3: '—', gestion: 'G', descripcion: 'D', url: 'ftp://x' }]);
    assert.ok(errs.some((e) => e.includes('pillar')));
    assert.ok(errs.some((e) => e.includes('url')));
  });
});

describe('schema.collectProcesoErrors', () => {
  test('valida url de paso', () => {
    const errs = collectProcesoErrors([{ no: 1, nombre: 'P', pasos: [{ numero: 1, accion: 'A', url: 'bad' }] }]);
    assert.ok(errs.some((e) => e.includes('url')));
  });
  test('numero entero >=1', () => {
    const errs = collectProcesoErrors([{ no: 1, nombre: 'P', pasos: [{ numero: 0, accion: 'A' }] }]);
    assert.ok(errs.some((e) => e.includes('numero')));
  });
});

describe('schema.collectContenidoUnicoErrors', () => {
  test('longitud tramiteIds == totalAudiencias', () => {
    const errs = collectContenidoUnicoErrors([{ id: 'c1', codigo: 'SAT-GES-0001', titulo: 'T', descripcion: 'D', url: 'https://x', esTransversal: false, totalAudiencias: 2, tramiteIds: ['a'], segmentosAplicables: ['s'] }]);
    assert.ok(errs.some((e) => e.includes('totalAudiencias')));
  });
  test('duplicados id/codigo', () => {
    const errs = collectContenidoUnicoErrors([
      { id: 'c1', codigo: 'X', titulo: 'T', descripcion: 'D', url: 'https://x', esTransversal: false, totalAudiencias: 1, tramiteIds: ['a'], segmentosAplicables: ['s'] },
      { id: 'c1', codigo: 'Y', titulo: 'T', descripcion: 'D', url: 'https://x', esTransversal: false, totalAudiencias: 1, tramiteIds: ['b'], segmentosAplicables: ['s'] }
    ]);
    assert.ok(errs.some((e) => e.includes('duplicado')));
  });
});
