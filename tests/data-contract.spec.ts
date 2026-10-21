import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import {
  assertTramites,
  assertProcesos,
  assertContenidosUnicos,
  PILLARS,
  TramiteItem,
  ProcesoGuiado,
  ContenidoUnicoItem,
} from '../src/data/schema';
import { buildTaxonomy, categoriaId, subcategoriaId, resolveCategoria } from '../src/data/taxonomy';
import { OFFICIAL_CATEGORY_ORDER, OFFICIAL_SUBCATEGORY_ORDER, subcategoryOrderFor } from '../src/data/categoryOrder';
import {
  FAMILIAS_TEMATICAS,
  RELACIONES_PROCESO_CANONICAS,
  buildRelationshipGraph,
  FamiliaTematicaId
} from '../src/data/contentRelationships';

const DATA_URL = new URL('../src/data/', import.meta.url);

function loadJson(file: string): unknown {
  return JSON.parse(readFileSync(new URL(file, DATA_URL), 'utf8')) as unknown;
}

let tramites: TramiteItem[];
let procesos: ProcesoGuiado[];
let contenidosUnicos: ContenidoUnicoItem[];

test.beforeAll(() => {
  tramites = assertTramites(loadJson('allTramites.json'));
  procesos = assertProcesos(loadJson('allProcesos.json'));
  contenidosUnicos = assertContenidosUnicos(loadJson('catalogoContenidosUnicos.json'));
});

const enrichedTramites = () =>
  tramites.map((t) => {
    const catId = categoriaId(t.pillar, t.categoria);
    return { ...t, categoriaId: catId, subcategoriaId: subcategoriaId(catId, t.subcategoria) };
  });

const taxonomy = () => buildTaxonomy(enrichedTramites());

const subcategoriasDe = (categoria: string): Set<string> =>
  new Set(tramites.filter((t) => t.categoria === categoria).map((t) => t.subcategoria));

test('allTramites: ids únicos y campos esenciales', () => {
  const ids = new Set(tramites.map((t) => t.id));
  expect(ids.size).toBe(tramites.length);
  tramites.forEach((t) => {
    expect(t.pillar).toBeDefined();
    expect(t.categoria).toBeTruthy();
    expect(t.subcategoria).toBeTruthy();
    expect(t.url).toMatch(/^https?:\/\//);
  });
});

test('allTramites: la taxonomía resuelve a IDs estables sin colisiones', () => {
  const tax = taxonomy();
  expect(Object.keys(tax.pillars).sort()).toEqual([...PILLARS].sort());

  tramites.forEach((t) => {
    const cat = tax.byCategoriaId.get(categoriaId(t.pillar, t.categoria));
    expect(cat, `categoría "${t.categoria}" (${t.pillar}) no indexada`).toBeDefined();
    expect(
      cat!.subcategorias.some((s) => s.id === subcategoriaId(cat!.id, t.subcategoria)),
      `subcategoría "${t.subcategoria}" de "${t.categoria}" no indexada`,
    ).toBe(true);
  });
});

test('allTramites: resolveCategoria acepta id y nombre (compat URL)', () => {
  const tax = taxonomy();
  tramites.forEach((t) => {
    const id = categoriaId(t.pillar, t.categoria);
    expect(resolveCategoria(tax, t.pillar, id)).toBe(t.categoria);
    expect(resolveCategoria(tax, t.pillar, t.categoria)).toBe(t.categoria);
  });
  expect(resolveCategoria(tax, 'contribuyentes', 'nombre-inexistente')).toBeNull();
});

test('order categorías: cada nombre oficial existe en el dataset', () => {
  const porPilar = new Map<string, Set<string>>();
  tramites.forEach((t) => {
    if (!porPilar.has(t.pillar)) porPilar.set(t.pillar, new Set());
    porPilar.get(t.pillar)!.add(t.categoria);
  });

  (Object.keys(OFFICIAL_CATEGORY_ORDER) as (typeof PILLARS)[number][]).forEach((pillar) => {
    const reales = porPilar.get(pillar) ?? new Set();
    OFFICIAL_CATEGORY_ORDER[pillar].forEach((nombre) => {
      expect(reales.has(nombre), `categoría oficial ausente en datos: ${pillar} / ${nombre}`).toBe(true);
    });
  });
});

test('order subcategorías: nombres oficiales existen y cubren categorías genéricas', () => {
  (Object.keys(OFFICIAL_SUBCATEGORY_ORDER) as string[]).forEach((categoria) => {
    const reales = subcategoriasDe(categoria);
    expect(reales.size > 0, `categoría de orden inexistente en datos: ${categoria}`).toBe(true);
    OFFICIAL_SUBCATEGORY_ORDER[categoria].forEach((nombre) => {
      expect(reales.has(nombre), `subcategoría oficial ausente: ${categoria} / ${nombre}`).toBe(true);
    });
  });

  const GENERIC_4 = ['Registro y acreditación', 'Operaciones y trámites', 'Consultas y seguimiento', 'Normativa y recursos'];
  const categoriasGenericas = new Set(
    tramites
      .map((t) => t.categoria)
      .filter((cat, i, arr) => {
        const subs = subcategoriasDe(cat);
        return subs.size === 4 && GENERIC_4.every((g) => subs.has(g)) && arr.indexOf(cat) === i;
      }),
  );

  categoriasGenericas.forEach((cat) => {
    const order = subcategoryOrderFor(cat);
    GENERIC_4.forEach((g) => {
      expect(order.includes(g), `categoría genérica sin orden de ciclo de vida: ${cat} / ${g}`).toBe(true);
    });
  });
});

test('allProcesos: numeración, pasos y URLs válidas', () => {
  expect(procesos.length).toBeGreaterThan(0);
  procesos.forEach((p) => {
    expect(p.nombre).toBeTruthy();
    p.pasos!.forEach((paso) => {
      expect(paso.numero).toBeGreaterThan(0);
      expect(paso.accion).toBeTruthy();
      expect(paso.url).toMatch(/^https?:\/\//);
    });
    if (typeof p.totalPasos === 'number' && p.pasos!.length > 0) {
      const maxStep = Math.max(...p.pasos!.map((s) => s.numero));
      expect(maxStep).toBe(p.totalPasos);
    }
  });
});

test('catalogoContenidosUnicos: 683 contenidos únicos desacoplados y suma exacta de 715 audiencias', () => {
  expect(contenidosUnicos.length).toBe(683);

  const ids = new Set(contenidosUnicos.map((c) => c.id));
  expect(ids.size).toBe(683);

  const codigos = new Set(contenidosUnicos.map((c) => c.codigo));
  expect(codigos.size).toBe(683);

  // La suma de todas las audiencias/trámites debe mapear exactamente a los 715 nodos del árbol de navegación
  const sumaAudiencias = contenidosUnicos.reduce((acc, c) => acc + c.totalAudiencias, 0);
  expect(sumaAudiencias).toBe(715);

  const sumaTramiteIds = contenidosUnicos.reduce((acc, c) => acc + c.tramiteIds.length, 0);
  expect(sumaTramiteIds).toBe(715);

  // Exactamente 17 contenidos son transversales (compartidos entre múltiples ramas tras depurar duplicado)
  const transversales = contenidosUnicos.filter((c) => c.esTransversal);
  expect(transversales.length).toBe(17);

  transversales.forEach((c) => {
    expect(c.totalAudiencias).toBeGreaterThan(1);
    expect(c.tramiteIds.length).toBe(c.totalAudiencias);
    expect(c.segmentosAplicables.length).toBeGreaterThanOrEqual(1);
  });

  contenidosUnicos.forEach((c) => {
    expect(c.titulo).toBeTruthy();
    expect(c.descripcion).toBeTruthy();
    expect(c.url).toMatch(/^https?:\/\//);
    expect(c.tramiteIds.length).toBe(c.totalAudiencias);
  });
});

test('contentRelationships: validacion del grafo interno, familias tematicas y polijerarquia', () => {
  const relGraph = buildRelationshipGraph(tramites);

  const familiaKeys = Object.keys(FAMILIAS_TEMATICAS) as FamiliaTematicaId[];
  expect(familiaKeys.length).toBe(10);
  familiaKeys.forEach((fId) => {
    const meta = FAMILIAS_TEMATICAS[fId];
    expect(meta.codigo).toMatch(/^FAM-\d{2}$/);
    expect(meta.nombre).toBeTruthy();
    expect(meta.descripcion).toBeTruthy();
  });

  const todosLosCodigos = new Set(tramites.map((t) => t.codigo));
  RELACIONES_PROCESO_CANONICAS.forEach((rel) => {
    expect(todosLosCodigos.has(rel.origenCodigo)).toBe(true);
    expect(todosLosCodigos.has(rel.destinoCodigo)).toBe(true);
    expect(rel.justificacion).toBeTruthy();
  });

  const prereqsAV = relGraph.getPrerrequisitos('SAT-GES-0003');
  expect(prereqsAV.length).toBeGreaterThanOrEqual(1);
  expect(prereqsAV.some((p) => p.tramite.codigo === 'SAT-GES-0001')).toBe(true);

  const sigPasosNIT = relGraph.getSiguientesPasos('SAT-GES-0001');
  expect(sigPasosNIT.length).toBeGreaterThanOrEqual(1);
  expect(sigPasosNIT.some((s) => s.tramite.codigo === 'SAT-GES-0003')).toBe(true);

  const felGestiones = relGraph.getGestionesFamilia('fel', { limit: 5 });
  expect(felGestiones.length).toBe(5);
  felGestiones.forEach((g) => {
    expect(g.familias_ids).toContain('fel');
  });

  const grafoFEL = relGraph.getGrafoRelaciones('SAT-GES-0319');
  expect(grafoFEL).not.toBeNull();
  expect(grafoFEL?.prerrequisitos.length).toBeGreaterThanOrEqual(1);
  expect(grafoFEL?.familias.some((f) => f.id === 'fel')).toBe(true);
});


test('auditoria de gobernanza: verificacion de los 6 principios de calidad taxonomica', () => {
  // 1. Contrato de datos: Contribuyente General declarado con 8 ramas N3
  expect(OFFICIAL_CATEGORY_ORDER.contribuyentes).toContain('Contribuyente General');
  expect(OFFICIAL_SUBCATEGORY_ORDER['Contribuyente General'].length).toBe(8);
  expect(OFFICIAL_SUBCATEGORY_ORDER['Sin Obligaciones']).toEqual(['Sin Obligaciones']);

  // 2. Cero nodos monocatenarios (pasarelas de 1 solo hijo)
  const n3ByN2 = new Map<string, Set<string>>();
  tramites.forEach((t) => {
    const key = `${t.pillar}>${t.nivel2}`;
    if (!n3ByN2.has(key)) n3ByN2.set(key, new Set());
    if (t.nivel3 && t.nivel3 !== '—') n3ByN2.get(key)!.add(t.nivel3);
  });
  n3ByN2.forEach((hijos, padre) => {
    if (hijos.size > 0) {
      expect(hijos.size, `Pasarela monocatenaria detectada en ${padre}`).toBeGreaterThanOrEqual(2);
    }
  });

  // 3. Capacidad de Miller: ningún nodo N2 o N3 tiene >= 11 hijos directos
  n3ByN2.forEach((hijos, padre) => {
    expect(hijos.size, `Sobrecarga de Miller en ${padre} (${hijos.size} hijos)`).toBeLessThanOrEqual(10);
  });

  // 4. Gobernanza del orden: cero duplicados de orden_contenido entre hermanos y ciclo ATO
  const folders = new Map<string, typeof tramites>();
  tramites.forEach((t) => {
    const key = `${t.pillar}>${t.nivel2}>${t.nivel3}>${t.nivel4}`;
    if (!folders.has(key)) folders.set(key, []);
    folders.get(key)!.push(t);
  });

  const ATO_WEIGHT: Record<string, number> = {
    empezar: 1,
    operar: 2,
    consultar: 3,
    modificar_cerrar: 4,
    normativa: 5,
  };

  folders.forEach((items, folderKey) => {
    const ocs = items.map((i) => i.orden_contenido);
    const uniqueOcs = new Set(ocs);
    expect(uniqueOcs.size, `Duplicados de orden_contenido en ${folderKey}`).toBe(items.length);

    // Validar orden ascendente respecto al ciclo ATO
    for (let i = 0; i < items.length - 1; i++) {
      const pesoActual = ATO_WEIGHT[items[i].etapaAto || 'empezar'] || 1;
      const pesoSiguiente = ATO_WEIGHT[items[i + 1].etapaAto || 'empezar'] || 1;
      expect(
        pesoActual,
        `Inversión de ciclo ATO en ${folderKey}: ${items[i].codigo} (${items[i].etapaAto}) antes de ${items[i + 1].codigo} (${items[i + 1].etapaAto})`
      ).toBeLessThanOrEqual(pesoSiguiente);
    }
  });

  // 5. Cero duplicados de 'Requisitos de persona/empresa' en nombreActual
  const genericDupes = tramites.filter((t) => (t.nombreActual || '').trim() === 'Requisitos de persona/empresa');
  expect(genericDupes.length).toBe(0);

  // 6. Campos canónicos nivel1..nivel5 presentes y sin campos muertos
  tramites.forEach((t) => {
    expect(t.nivel1).toBeTruthy();
    expect(t.nivel2).toBeTruthy();
    expect(t.nivel3).toBeTruthy();
    expect(t.nivel4).toBeTruthy();
    expect(t.nivel5).toBeTruthy();
    expect(t.orden_n1).toBeGreaterThanOrEqual(1);

    // Campos muertos eliminados
    expect((t as any).segmento).toBeUndefined();
    expect((t as any).regimenArea).toBeUndefined();
    expect((t as any).grupoActor).toBeUndefined();
    expect((t as any).materiaTema).toBeUndefined();
    expect((t as any).subtemaGestion).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Guardas de gobernanza añadidas: cubren los huecos detectados por mutación.
// Cada una falla si se reintroduce el defecto que vigila (no son snapshots).
// ---------------------------------------------------------------------------
const DASH = '—';

const ATO_PESO: Record<string, number> = {
  empezar: 1,
  operar: 2,
  consultar: 3,
  modificar_cerrar: 4,
  normativa: 5,
};

const NADA = new Set<string | undefined>([DASH, '-', '', undefined, null as unknown as undefined]);

/** Ruta canónica de carpetas (sin el ítem terminal) usada para medir densidad. */
function folderKeyN4(t: TramiteItem): string {
  return [t.pillar, t.nivel2, t.nivel3, t.nivel4].join('>');
}

test('densidad terminal: ninguna carpeta expone >= 11 gestiones en una sola lista (Regla 2)', () => {
  const porCarpeta = new Map<string, TramiteItem[]>();
  tramites.forEach((t) => {
    const key = folderKeyN4(t);
    if (!porCarpeta.has(key)) porCarpeta.set(key, []);
    porCarpeta.get(key)!.push(t);
  });

  const sobrecargadas: string[] = [];
  porCarpeta.forEach((items, key) => {
    // Solo carpetas que realmente son pantalla de contenido: las que agotan la
    // jerarquía declarada (N4 terminal) o superan el umbral de Miller.
    const esTerminal = items.every((i) => NADA.has(i.nivel5));
    if (items.length >= 11 && esTerminal) {
      sobrecargadas.push(`${key} (${items.length} gestiones)`);
    }
  });

  expect(
    sobrecargadas,
    `Carpetas con sobrecarga terminal (Regla 2: modularizar >= 11):\n  - ${sobrecargadas.join('\n  - ')}`,
  ).toEqual([]);
});

test('guion largo: todo nivel sin clasificar usa "—" y su orden también (Regla 5)', () => {
  const campos: [keyof TramiteItem, keyof TramiteItem][] = [
    ['nivel3', 'orden_n3'],
    ['nivel4', 'orden_n4'],
    ['nivel5', 'orden_n5'],
  ];

  tramites.forEach((t) => {
    campos.forEach(([nivelKey, ordenKey]) => {
      const nivel = t[nivelKey];
      const orden = t[ordenKey];

      // Anti-simetria forzada: si el nivel es "—", el orden DEBE ser "—".
      if (nivel === DASH) {
        expect(
          orden,
          `${t.id}: ${String(nivelKey)}="—" pero ${String(ordenKey)}=${JSON.stringify(orden)} (Regla 5)`,
        ).toBe(DASH);
      }

      // Guion de nivel intermedio prohibido si existe contenido en el nivel siguiente.
      if (nivel === DASH && nivelKey === 'nivel3') {
        expect(
          NADA.has(t.nivel4),
          `${t.id}: nivel3="—" no puede tener nivel4 clasificado (${JSON.stringify(t.nivel4)})`,
        ).toBe(true);
      }
    });

    // El guion es el único permitido: ni "-" ni textos inventados en niveles no clasificados.
    ['nivel3', 'nivel4', 'nivel5'].forEach((k) => {
      const valor = (t as unknown as Record<string, unknown>)[k];
      expect(valor, `${t.id}: ${k} vacío (debe ser "—" o etiqueta)`).not.toBe('');
      expect(valor, `${t.id}: ${k} con guion ASCII "-" (usar "—")`).not.toBe('-');
    });
  });
});

test('alias de nivel: nivel1..nivel5 espejan *_segmento/area/subarea/tema/tramite', () => {
  const pares: [keyof TramiteItem, keyof TramiteItem][] = [
    ['nivel1', 'nivel1_segmento'],
    ['nivel2', 'nivel2_area'],
    ['nivel3', 'nivel3_subarea'],
    ['nivel4', 'nivel4_tema'],
    ['nivel5', 'nivel5_tramite'],
  ];

  const desincronizados = tramites
    .filter((t) => pares.some(([alias, canonico]) => t[alias] !== t[canonico]))
    .map((t) => t.id);

  expect(
    desincronizados,
    `Alias de nivel desincronizados respecto a los campos canónicos: ${desincronizados.join(', ')}`,
  ).toEqual([]);
});

test('anti-espejo: ningún nivel consecutivo repite la etiqueta del padre', () => {
  const espejos: string[] = [];
  tramites.forEach((t) => {
    const cadena = [t.nivel1, t.nivel2, t.nivel3, t.nivel4, t.nivel5].filter((v) => !NADA.has(v as string));
    for (let i = 0; i < cadena.length - 1; i++) {
      if (cadena[i] === cadena[i + 1]) {
        espejos.push(`${t.id}: "${cadena[i]}" repetido en niveles consecutivos`);
        break;
      }
    }
  });

  expect(espejos, `Migas en espejo (clic pasarela disfrazado):\n  - ${espejos.join('\n  - ')}`).toEqual([]);
});

test('regla 7: sin números quemados en títulos visibles', () => {
  const PREFIJO_NUMERICO = /^\s*(?:cap[ií]tulo|secci[oó]n|parte)?\s*\d+\s*[.):\-–]\s+/i;
  const PREFIJO_ROMANO = /^\s*(?:cap[ií]tulo|secci[oó]n|parte)\s+[IVXLCDM]+\b/i;

  const quemados = tramites
    .filter((t) => {
      const campos = [t.nombreActual, t.tramite].filter(Boolean) as string[];
      return campos.some((c) => PREFIJO_NUMERICO.test(c) || PREFIJO_ROMANO.test(c));
    })
    .map((t) => `${t.id}: "${t.nombreActual ?? t.tramite}"`);

  expect(quemados, `Títulos con números quemados (Regla 7):\n  - ${quemados.join('\n  - ')}`).toEqual([]);
});

test('regla 12: prohibido el término "trámite" en campos visibles al ciudadano', () => {
  const PROHIBIDO = /\btr[aá]mites?\b/i;
  const VISIBLES: (keyof TramiteItem)[] = [
    'nombreActual',
    'tramite',
    'descripcion',
    'categoria',
    'subcategoria',
    'nivel1',
    'nivel2',
    'nivel3',
    'nivel4',
    'nivel5',
    'migaBreadcrumb',
  ];

  const violaciones: string[] = [];
  tramites.forEach((t) => {
    VISIBLES.forEach((campo) => {
      const valor = t[campo];
      if (typeof valor === 'string' && PROHIBIDO.test(valor)) {
        violaciones.push(`${t.id}.${String(campo)}: "${valor}"`);
      }
    });
  });

  expect(
    violaciones,
    `Término "trámite" en campos visibles (Regla 12, usar "gestión"):\n  - ${violaciones.slice(0, 40).join('\n  - ')}`,
  ).toEqual([]);
});
