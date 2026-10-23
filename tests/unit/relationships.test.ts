import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { FAMILIAS_TEMATICAS, RELACIONES_PROCESO_CANONICAS, buildRelationshipGraph } from '../../src/data/contentRelationships';

describe('contentRelationships.familias', () => {
  test('10 familias con códigos FAM-XX', () => {
    const keys = Object.keys(FAMILIAS_TEMATICAS);
    assert.equal(keys.length, 10);
    for (const k of keys) {
      assert.match(FAMILIAS_TEMATICAS[k as keyof typeof FAMILIAS_TEMATICAS].codigo, /^FAM-\d{2}$/);
    }
  });
});

describe('contentRelationships.relaciones', () => {
  test('relaciones canónicas con endpoints y justificación', () => {
    const tramites = [
      { id: 'x', codigo: 'SAT-GES-0001', gestion: 'A', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] },
      { id: 'y', codigo: 'SAT-GES-0003', gestion: 'B', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] },
      { id: 'z', codigo: 'SAT-GES-0319', gestion: 'C', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] },
      { id: 'w', codigo: 'SAT-GES-0005', gestion: 'D', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] },
      { id: 'v', codigo: 'SAT-GES-0274', gestion: 'E', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] },
      { id: 'u', codigo: 'SAT-GES-0275', gestion: 'F', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] },
      { id: 's', codigo: 'SAT-GES-0358', gestion: 'G', url: 'https://x', pillar: 'comercio_exterior', familias_ids: [] },
      { id: 'r', codigo: 'SAT-GES-0359', gestion: 'H', url: 'https://x', pillar: 'comercio_exterior', familias_ids: [] },
      { id: 'q', codigo: 'SAT-GES-0015', gestion: 'I', url: 'https://x', pillar: 'contribuyentes', familias_ids: [] }
    ] as any;
    for (const rel of RELACIONES_PROCESO_CANONICAS) {
      assert.ok(tramites.some((t: any) => t.codigo === rel.origenCodigo), `origen missing ${rel.origenCodigo}`);
      assert.ok(tramites.some((t: any) => t.codigo === rel.destinoCodigo), `destino missing ${rel.destinoCodigo}`);
      assert.ok(rel.justificacion);
    }
  });
});

describe('contentRelationships.grafo', () => {
  const tramites = [
    { id: 'x', codigo: 'SAT-GES-0001', gestion: 'Solicitar NIT', url: 'https://x', pillar: 'contribuyentes', familias_ids: ['rtu-digital'] },
    { id: 'y', codigo: 'SAT-GES-0003', gestion: 'Agencia Virtual', url: 'https://y', pillar: 'contribuyentes', familias_ids: ['agencia-virtual'] },
    { id: 'z', codigo: 'SAT-GES-0319', gestion: 'FEL', url: 'https://z', pillar: 'contribuyentes', familias_ids: ['fel'] }
  ] as any;

  test('prerrequisitos y siguientes pasos', () => {
    const g = buildRelationshipGraph(tramites);
    const pre = g.getPrerrequisitos('SAT-GES-0003');
    assert.ok(pre.some(p => p.tramite.codigo === 'SAT-GES-0001'));
    const sig = g.getSiguientesPasos('SAT-GES-0001');
    assert.ok(sig.some(p => p.tramite.codigo === 'SAT-GES-0003'));
  });

  test('familia con límite y exclude', () => {
    const g = buildRelationshipGraph(tramites);
    const list = g.getGestionesFamilia('rtu-digital', { limit: 1, excludeCodigo: 'SAT-GES-0001' });
    assert.equal(list.length, 0);
  });

  test('getGrafoRelaciones', () => {
    const g = buildRelationshipGraph(tramites);
    const grafo = g.getGrafoRelaciones('SAT-GES-0001');
    assert.ok(grafo);
    assert.equal(g.getGrafoRelaciones('NO-EXISTE'), null);
  });
});
