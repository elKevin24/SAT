import React, { useState, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  NodeProps,
  Panel,
  useReactFlow,
  MarkerType,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  ArrowLeft,
  Layers,
  ChevronRight,
  Filter,
  FileText,
  ExternalLink,
  Scale,
  ShieldCheck,
  Search,
  X,
  Compass,
  Sparkles,
  Globe,
  Database,
  Download,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { SatIsologotipo } from '../components/SatIsologotipo';
import rawTramites from '../data/allTramites.json';
import { SEGMENT_DESCRIPTIONS, getTaxonDescription, TaxonDescription } from '../data/taxonomyDescriptions';

// --- NIVEL 1 ---
export type SegmentKey = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'entes_exentos';

const SEGMENT_META: Record<SegmentKey, { name: string; color: string; desc: string; que_es: string; base_juridica: string }> = {
  contribuyentes: {
    name: 'Contribuyentes',
    color: '#14649B',
    desc: SEGMENT_DESCRIPTIONS['contribuyentes']?.lead_text || 'Información y servicios tributarios para personas individuales y jurídicas.',
    que_es: SEGMENT_DESCRIPTIONS['contribuyentes']?.que_es || '',
    base_juridica: SEGMENT_DESCRIPTIONS['contribuyentes']?.base_juridica || ''
  },
  comercio_exterior: {
    name: 'Operadores de Comercio Exterior',
    color: '#0284C7',
    desc: SEGMENT_DESCRIPTIONS['operadores-de-comercio-exterior']?.lead_text || 'Servicios e información aduanera para importación, exportación y logística.',
    que_es: SEGMENT_DESCRIPTIONS['operadores-de-comercio-exterior']?.que_es || '',
    base_juridica: SEGMENT_DESCRIPTIONS['operadores-de-comercio-exterior']?.base_juridica || ''
  },
  profesionales: {
    name: 'Profesionales',
    color: '#4D8014',
    desc: SEGMENT_DESCRIPTIONS['profesionales']?.lead_text || 'Herramientas y habilitaciones para profesionales tributarios y auxiliares.',
    que_es: SEGMENT_DESCRIPTIONS['profesionales']?.que_es || '',
    base_juridica: SEGMENT_DESCRIPTIONS['profesionales']?.base_juridica || ''
  },
  entes_exentos: {
    name: 'Entes Exentos',
    color: '#C25E00',
    desc: SEGMENT_DESCRIPTIONS['entes-exentos']?.lead_text || 'Gestiones para entidades públicas, organizaciones no lucrativas y exenciones.',
    que_es: SEGMENT_DESCRIPTIONS['entes-exentos']?.que_es || '',
    base_juridica: SEGMENT_DESCRIPTIONS['entes-exentos']?.base_juridica || ''
  }
};

// --- CARACTERÍSTICA TRANSVERSAL DE CICLO DE VIDA (ATO) ---
const ATO_FEATURE_META: Record<string, { label: string; bg: string; text: string; border: string; icon: string }> = {
  empezar: {
    label: 'Empezar y registrarse',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: '🌱'
  },
  operar: {
    label: 'Operación y declaraciones',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: '⚡'
  },
  consultar: {
    label: 'Consultas y herramientas',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-300',
    icon: '🔍'
  },
  modificar_cerrar: {
    label: 'Modificaciones y cierre',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: '🔄'
  },
  normativa: {
    label: 'Normativa y asistencia',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    icon: '⚖️'
  }
};

// --- ESTRUCTURA DE CADA TRÁMITE (CANÓNICA DEL EXCEL) ---
export interface FullTramiteItem {
  id: string;
  codigo: string;
  titulo: string;
  pillar: string;
  nivel1_segmento: string;
  nivel2_area: string;
  nivel3_subarea: string;
  nivel4_tema: string;
  categoria?: string;
  subcategoria?: string;
  tema?: string;
  subtema?: string;
  etapaAto: string;
  etapaAtoLabel: string;
  tipoInteraccionLabel: string;
  descripcion: string;
  baseLegal: string;
  perfilDestinatario?: string;
  url?: string;
}

// --- NODOS DE REACT FLOW (ROTULADOS POR NIVEL OFICIAL) ---

// --- NODOS DE REACT FLOW (ROTULADOS POR NIVEL OFICIAL) ---

// Nivel 1
const NodeLevel1Component = ({ data }: NodeProps) => (
  <div
    className="w-76 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden"
    style={{ borderTop: `4px solid ${data.color as string}` }}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-slate-800 bg-slate-100 border border-slate-200">
        <Layers className="w-3 h-3 text-slate-600" />
        Nivel 1
      </span>
      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-xs">
        {data.total as number} Gestiones
      </span>
    </div>
    <p className="text-sm font-black text-slate-900 mt-2 leading-snug">{data.name as string}</p>
    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{data.desc as string}</p>
    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
      <span>Nodos en Nivel 2:</span>
      <span className="font-bold text-slate-800 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/60">
        {data.n2Count as number} Áreas
      </span>
    </div>
    <Handle type="source" position={Position.Right} className="w-3.5 h-3.5 !bg-slate-800 ring-4 ring-white shadow-md" />
  </div>
);

// Nivel 2
const NodeLevel2Component = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div
      className={`w-76 bg-white border rounded-2xl p-3.5 shadow-xs transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'ring-2 ring-sky-500 border-sky-500 bg-gradient-to-br from-white via-sky-50/40 to-sky-50/70 shadow-lg shadow-sky-500/10 -translate-y-0.5'
          : 'border-slate-200 hover:border-sky-300 hover:shadow-md'
      }`}
      style={{ borderTop: isSelected ? '4px solid #0284C7' : '3px solid #E2E8F0' }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-500 ring-3 ring-white shadow-sm" />
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isSelected ? 'bg-sky-100 text-sky-900 border border-sky-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}>
          Nivel 2
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
          {data.count as number} gestiones
        </span>
      </div>
      <p className="text-xs font-black text-slate-900 mt-1.5 leading-snug">{data.name as string}</p>
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[170px]">{data.detailText as string}</span>
        {isSelected && (
          <span className="font-bold text-sky-700 flex items-center gap-0.5 text-[10px] bg-sky-100/70 px-1.5 py-0.5 rounded">
            Activo <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-sky-600 ring-3 ring-white shadow-sm" />
    </div>
  );
};

// Nivel 3
const NodeLevel3Component = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div
      className={`w-76 bg-white border rounded-2xl p-3.5 shadow-xs transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'ring-2 ring-emerald-500 border-emerald-500 bg-gradient-to-br from-white via-emerald-50/40 to-emerald-50/70 shadow-lg shadow-emerald-500/10 -translate-y-0.5'
          : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
      }`}
      style={{ borderTop: isSelected ? '4px solid #10B981' : '3px solid #E2E8F0' }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-500 ring-3 ring-white shadow-sm" />
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isSelected ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}>
          Nivel 3
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
          {data.count as number} gestiones
        </span>
      </div>
      <p className="text-xs font-black text-slate-900 mt-1.5 leading-snug">{data.name as string}</p>
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[170px]">{data.detailText as string}</span>
        {isSelected && (
          <span className="font-bold text-emerald-700 flex items-center gap-0.5 text-[10px] bg-emerald-100/70 px-1.5 py-0.5 rounded">
            Activo <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-emerald-600 ring-3 ring-white shadow-sm" />
    </div>
  );
};

// Nivel 4
const NodeLevel4Component = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div
      className={`w-76 bg-white border rounded-2xl p-3.5 shadow-xs transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'ring-2 ring-violet-500 border-violet-500 bg-gradient-to-br from-white via-violet-50/40 to-violet-50/70 shadow-lg shadow-violet-500/10 -translate-y-0.5'
          : 'border-slate-200 hover:border-violet-300 hover:shadow-md'
      }`}
      style={{ borderTop: isSelected ? '4px solid #8B5CF6' : '3px solid #E2E8F0' }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-500 ring-3 ring-white shadow-sm" />
      <div className="flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isSelected ? 'bg-violet-100 text-violet-900 border border-violet-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
        }`}>
          Nivel 4
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
          {data.count as number} gestiones
        </span>
      </div>
      <p className="text-xs font-black text-slate-900 mt-1.5 leading-snug">{data.name as string}</p>
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[170px]">{data.detailText as string}</span>
        {isSelected && (
          <span className="font-bold text-violet-700 flex items-center gap-0.5 text-[10px] bg-violet-100/70 px-1.5 py-0.5 rounded">
            Activo <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-violet-600 ring-3 ring-white shadow-sm" />
    </div>
  );
};

// Nivel 5 Oficial (Ficha de Gestión)
const NodeLevel5TramiteComponent = ({ data }: NodeProps) => {
  const atoStyle = ATO_FEATURE_META[data.etapaAto as string] || ATO_FEATURE_META.empezar;
  const handleInspect = () => {
    if (typeof data.onInspect === 'function') data.onInspect();
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleInspect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleInspect();
        }
      }}
      className="w-84 bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs space-y-2 hover:border-sky-500 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group relative overflow-hidden"
      style={{ borderLeft: `4px solid ${atoStyle.text.includes('sky') ? '#0284c7' : atoStyle.text.includes('emerald') ? '#10b981' : atoStyle.text.includes('amber') ? '#f59e0b' : atoStyle.text.includes('purple') ? '#8b5cf6' : '#64748b'}` }}
    >
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-700 ring-3 ring-white shadow-sm" />
      <div className="flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-black text-slate-700 uppercase tracking-wider bg-slate-100 text-[10px]">
          Nivel 5
        </span>
        <span className="text-slate-600 font-mono text-[11px] font-bold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">
          {data.codigo as string}
        </span>
      </div>
      <p className="text-xs font-black text-slate-900 leading-snug group-hover:text-sky-800 transition-colors">
        {data.titulo as string}
      </p>

      {/* Característica Transversal (ATO) como atributo explícito */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px]">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border ${atoStyle.bg} ${atoStyle.text} ${atoStyle.border}`}
          title="Característica transversal del ciclo de vida"
        >
          <span>{atoStyle.icon}</span>
          <span>{data.etapaAtoLabel as string}</span>
        </span>
        <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {data.tipo as string}
        </span>
      </div>

      <div className="pt-1 flex items-center justify-between text-[11px] text-sky-700 font-black group-hover:text-sky-800">
        <span className="inline-flex items-center gap-1">Ver ficha oficial</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

const NODE_TYPES = {
  macroNode: NodeLevel1Component,
  level2Node: NodeLevel2Component,
  level3Node: NodeLevel3Component,
  level4Node: NodeLevel4Component,
  tramiteNode: NodeLevel5TramiteComponent
};

// --- ESTRUCTURA DEL ÁRBOL LIMPIO CON REGLA DE COLAPSO (<= 2) ---
interface CleanBranch {
  name: string;
  total: number;
  tramites: FullTramiteItem[];
  subBranches?: Record<string, CleanBranch>;
}

interface SegmentTree {
  name: string;
  total: number;
  color: string;
  desc: string;
  n2Branches: Record<string, CleanBranch>;
}

const AutoFitView: React.FC<{ activeKey: string }> = ({ activeKey }) => {
  const { fitView } = useReactFlow();
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.12, duration: 350 });
    }, 60);
    return () => clearTimeout(timer);
  }, [activeKey, fitView]);
  return null;
};

export const PortalFlowPage: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentKey>('contribuyentes');
  const [selectedN2, setSelectedN2] = useState<string>('');
  const [selectedN3, setSelectedN3] = useState<string>('');
  const [selectedN4, setSelectedN4] = useState<string>('');
  const [selectedTramite, setSelectedTramite] = useState<FullTramiteItem | null>(null);
  const [selectedTaxonNode, setSelectedTaxonNode] = useState<TaxonDescription | null>(null);
  const [filtroCaracteristica, setFiltroCaracteristica] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. CONSTRUCCIÓN DEL ÁRBOL SANADO CON LA REGLA DE COLAPSO
  const fullTree = useMemo<Record<SegmentKey, SegmentTree>>(() => {
    const tree: Record<SegmentKey, SegmentTree> = {
      contribuyentes: { ...SEGMENT_META.contribuyentes, total: 0, n2Branches: {} },
      comercio_exterior: { ...SEGMENT_META.comercio_exterior, total: 0, n2Branches: {} },
      profesionales: { ...SEGMENT_META.profesionales, total: 0, n2Branches: {} },
      entes_exentos: { ...SEGMENT_META.entes_exentos, total: 0, n2Branches: {} }
    };

    // Procesar todos los trámites
    (rawTramites as unknown as any[]).forEach((t) => {
      const segId = t.pillar as SegmentKey;
      if (!tree[segId]) return;

      const tramiteItem: FullTramiteItem = {
        id: t.id,
        codigo: t.codigo || t.id,
        titulo: t.tramite || t.nombreActual || 'Gestión Oficial',
        pillar: segId,
        nivel1_segmento: t.nivel1_segmento || SEGMENT_META[segId].name,
        nivel2_area: (t.nivel2_area || '').trim(),
        nivel3_subarea: (t.nivel3_subarea || '').trim(),
        nivel4_tema: (t.nivel4_tema || '').trim(),
        categoria: t.categoria || '',
        subcategoria: t.subcategoria || '',
        tema: t.tema || '',
        subtema: t.subtema || '',
        etapaAto: t.etapaAto || 'empezar',
        etapaAtoLabel: t.etapaAtoLabel || 'Empezar y registrarse',
        tipoInteraccionLabel: t.tipoInteraccionLabel || 'Guía Informativa',
        descripcion: t.descripcion || 'Procedimiento del Portal SAT.',
        baseLegal: t.baseLegal || 'Normativa tributaria y aduanera vigente.',
        perfilDestinatario: t.perfilDestinatario || '',
        url: t.url || ''
      };

      tree[segId].total++;

      // NIVEL 2: Área oficial (de la columna Nivel 2 del Excel)
      const n2Key = tramiteItem.nivel2_area;
      if (!n2Key || n2Key === '—') return;

      if (!tree[segId].n2Branches[n2Key]) {
        tree[segId].n2Branches[n2Key] = {
          name: n2Key,
          total: 0,
          tramites: [],
          subBranches: {}
        };
      }
      tree[segId].n2Branches[n2Key].total++;
      tree[segId].n2Branches[n2Key].tramites.push(tramiteItem);

      // NIVEL 3 (de la columna Nivel 3 del Excel, donde exista)
      const n3Key = (tramiteItem.nivel3_subarea && tramiteItem.nivel3_subarea !== '—') ? tramiteItem.nivel3_subarea : '';

      if (n3Key) {
        const n2Node = tree[segId].n2Branches[n2Key];
        if (!n2Node.subBranches![n3Key]) {
          n2Node.subBranches![n3Key] = {
            name: n3Key,
            total: 0,
            tramites: [],
            subBranches: {}
          };
        }
        n2Node.subBranches![n3Key].total++;
        n2Node.subBranches![n3Key].tramites.push(tramiteItem);

        // NIVEL 4: Tema oficial (de la columna Nivel 4 del Excel, donde exista)
        const n4Key = (tramiteItem.nivel4_tema && tramiteItem.nivel4_tema !== '—') ? tramiteItem.nivel4_tema : '';

        if (n4Key) {
          const n3Node = n2Node.subBranches![n3Key];
          if (!n3Node.subBranches![n4Key]) {
            n3Node.subBranches![n4Key] = {
              name: n4Key,
              total: 0,
              tramites: []
            };
          }
          n3Node.subBranches![n4Key].total++;
          n3Node.subBranches![n4Key].tramites.push(tramiteItem);
        }
      }
    });

    return tree;
  }, []);

  // Orden oficial de Nivel 2
  const n2Keys = useMemo(() => {
    const current = fullTree[selectedSegment];
    const keys = Object.keys(current?.n2Branches || {});
    if (selectedSegment === 'contribuyentes') {
      const order = ['Sin Obligaciones', 'Pequeños Contribuyentes', 'Contribuyente General', 'Contribuyentes Especiales'];
      const sorted = order.filter((k) => keys.includes(k));
      const remaining = keys.filter((k) => !order.includes(k));
      return [...sorted, ...remaining];
    }
    return keys;
  }, [selectedSegment, fullTree]);

  // Sincronizar selección inicial de forma fiel a los datos existentes
  useEffect(() => {
    if (n2Keys.length > 0) {
      const activeN2 = selectedN2 && n2Keys.includes(selectedN2) ? selectedN2 : n2Keys[0];
      setSelectedN2(activeN2);

      const n2Data = fullTree[selectedSegment]?.n2Branches[activeN2];
      const rawSub = Object.keys(n2Data?.subBranches || {});

      if (rawSub.length > 0) {
        const activeN3 = selectedN3 && rawSub.includes(selectedN3) ? selectedN3 : rawSub[0];
        setSelectedN3(activeN3);

        const n3Data = n2Data.subBranches![activeN3];
        const rawN4 = Object.keys(n3Data?.subBranches || {});
        if (rawN4.length > 0) {
          const activeN4 = selectedN4 && rawN4.includes(selectedN4) ? selectedN4 : rawN4[0];
          setSelectedN4(activeN4);
        } else {
          setSelectedN4('');
        }
      } else {
        setSelectedN3('');
        setSelectedN4('');
      }
    } else {
      setSelectedN2('');
      setSelectedN3('');
      setSelectedN4('');
    }
    setSelectedTramite(null);
  }, [selectedSegment, fullTree, n2Keys]);

  // Manejo de clic en Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedTramite) {
        setSelectedTramite(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTramite]);

  // 2. GENERACIÓN DEL MAPA EN REACT FLOW CON REGLA DE COLAPSO TAXONÓMICO
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const segInfo = fullTree[selectedSegment];
    if (!segInfo) return { initialNodes: [], initialEdges: [] };

    // --- COLUMNA 1: NIVEL 1 ---
    const macroNodeId = `n1-${selectedSegment}`;
    const macroCenterY = Math.max(160, (n2Keys.length * 115) / 2);
    nodes.push({
      id: macroNodeId,
      type: 'macroNode',
      position: { x: 30, y: macroCenterY },
      data: {
        name: segInfo.name,
        total: segInfo.total,
        color: segInfo.color,
        desc: segInfo.desc,
        n2Count: n2Keys.length
      }
    });

    // --- COLUMNA 2: NIVEL 2 ---
    n2Keys.forEach((n2Key, aIdx) => {
      const n2Obj = segInfo.n2Branches[n2Key];
      const n2NodeId = `n2-${aIdx}`;
      const isN2Selected = n2Key === selectedN2;
      const subBranchesCount = Object.keys(n2Obj.subBranches || {}).length;

      const detailText =
        subBranchesCount > 0
          ? `${subBranchesCount} nodos (Nivel 3)`
          : `${n2Obj.total} gestiones directas`;

      nodes.push({
        id: n2NodeId,
        type: 'level2Node',
        position: { x: 350, y: 40 + aIdx * 115 },
        data: {
          name: n2Key,
          count: n2Obj.total,
          detailText,
          isSelected: isN2Selected,
          n2Key
        }
      });

      // Arista Nivel 1 -> Nivel 2
      edges.push({
        id: `e-${macroNodeId}-${n2NodeId}`,
        source: macroNodeId,
        target: n2NodeId,
        type: 'smoothstep',
        animated: isN2Selected,
        style: {
          stroke: isN2Selected ? segInfo.color : '#CBD5E1',
          strokeWidth: isN2Selected ? 2.5 : 1.2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: isN2Selected ? segInfo.color : '#94A3B8'
        }
      });
    });

    const activeN2Obj = segInfo.n2Branches[selectedN2];
    if (!activeN2Obj) return { initialNodes: nodes, initialEdges: edges };

    const activeN2Idx = n2Keys.indexOf(selectedN2);
    const activeN2NodeId = `n2-${activeN2Idx >= 0 ? activeN2Idx : 0}`;

    // EVALUACIÓN DE N3:
    const n3BranchesList = Object.entries(activeN2Obj.subBranches || {});

    // CASO 1: Rama sin Nivel 3 (ej. OEA donde no existen nodos de Nivel 3)
    if (n3BranchesList.length === 0) {
      let tramitesList = activeN2Obj.tramites;
      if (filtroCaracteristica !== 'todos') {
        tramitesList = tramitesList.filter((t) => t.etapaAto === filtroCaracteristica);
      }
      if (searchQuery.trim().length > 1) {
        tramitesList = tramitesList.filter(
          (t) =>
            t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.codigo.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      tramitesList.slice(0, 16).forEach((trItem, trIdx) => {
        const tramiteNodeId = `t-direct-${trIdx}`;
        nodes.push({
          id: tramiteNodeId,
          type: 'tramiteNode',
          position: { x: 700, y: 40 + trIdx * 135 },
          data: {
            id: trItem.id,
            codigo: trItem.codigo,
            titulo: trItem.titulo,
            tipo: trItem.tipoInteraccionLabel,
            etapaAto: trItem.etapaAto,
            etapaAtoLabel: trItem.etapaAtoLabel,
            onInspect: () => setSelectedTramite(trItem)
          }
        });

        edges.push({
          id: `e-${activeN2NodeId}-${tramiteNodeId}`,
          source: activeN2NodeId,
          target: tramiteNodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#0284C7', strokeWidth: 1.8 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: '#0284C7'
          }
        });
      });
    } else {
      // CASO 2: NIVEL 3 EXISTE — SE RENDERIZAN TODAS LAS SUBÁREAS N3
      const activeN3Key = (selectedN3 && activeN2Obj.subBranches![selectedN3]) ? selectedN3 : n3BranchesList[0][0];

      n3BranchesList.forEach(([n3Name, n3Obj], sIdx) => {
        const n3NodeId = `n3-${sIdx}`;
        const isN3Selected = n3Name === activeN3Key;
        const subCount = Object.keys(n3Obj.subBranches || {}).length;
        const detailText =
          subCount > 0 ? `${subCount} nodos (Nivel 4)` : `${n3Obj.total} gestiones directas`;

        nodes.push({
          id: n3NodeId,
          type: 'level3Node',
          position: { x: 700, y: 40 + sIdx * 115 },
          data: {
            name: n3Name,
            count: n3Obj.total,
            detailText,
            isSelected: isN3Selected,
            n3Key: n3Name
          }
        });

        edges.push({
          id: `e-${activeN2NodeId}-${n3NodeId}`,
          source: activeN2NodeId,
          target: n3NodeId,
          type: 'smoothstep',
          animated: isN3Selected,
          style: {
            stroke: isN3Selected ? '#0284C7' : '#CBD5E1',
            strokeWidth: isN3Selected ? 2.5 : 1.2
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
            color: isN3Selected ? '#0284C7' : '#94A3B8'
          }
        });
      });

      const activeN3Obj = activeN2Obj.subBranches![activeN3Key];
      if (activeN3Obj) {
        const activeN3Idx = n3BranchesList.findIndex(([k]) => k === activeN3Key);
        const activeN3NodeId = `n3-${activeN3Idx >= 0 ? activeN3Idx : 0}`;

        const n4BranchesList = Object.entries(activeN3Obj.subBranches || {});

        // SUB-CASO 2.A: ASIMETRÍA NATURAL — Nivel 4 no existe en esta rama (ej. Profesionales, Entes Exentos)
        // Las gestiones cuelgan directamente de Nivel 3 en Columna 4 (x = 1050)
        if (n4BranchesList.length === 0) {
          let tramitesList = activeN3Obj.tramites;
          if (filtroCaracteristica !== 'todos') {
            tramitesList = tramitesList.filter((t) => t.etapaAto === filtroCaracteristica);
          }
          if (searchQuery.trim().length > 1) {
            tramitesList = tramitesList.filter(
              (t) =>
                t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.codigo.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          tramitesList.slice(0, 16).forEach((trItem, trIdx) => {
            const tramiteNodeId = `t-n3-${trIdx}`;
            nodes.push({
              id: tramiteNodeId,
              type: 'tramiteNode',
              position: { x: 1050, y: 40 + trIdx * 135 },
              data: {
                id: trItem.id,
                codigo: trItem.codigo,
                titulo: trItem.titulo,
                tipo: trItem.tipoInteraccionLabel,
                etapaAto: trItem.etapaAto,
                etapaAtoLabel: trItem.etapaAtoLabel,
                onInspect: () => setSelectedTramite(trItem)
              }
            });

            edges.push({
              id: `e-${activeN3NodeId}-${tramiteNodeId}`,
              source: activeN3NodeId,
              target: tramiteNodeId,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#10B981', strokeWidth: 1.8 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 14,
                height: 14,
                color: '#10B981'
              }
            });
          });
        } else {
          // SUB-CASO 2.B: NIVEL 4 SÍ EXISTE — SE RENDERIZAN TODOS LOS TEMAS DE NIVEL 4 (Columna 4, x = 1050)
          const activeN4Key = (selectedN4 && activeN3Obj.subBranches![selectedN4]) ? selectedN4 : n4BranchesList[0][0];

          n4BranchesList.forEach(([n4Name, n4Obj], tIdx) => {
            const n4NodeId = `n4-${tIdx}`;
            const isN4Selected = n4Name === activeN4Key;

            nodes.push({
              id: n4NodeId,
              type: 'level4Node',
              position: { x: 1050, y: 40 + tIdx * 115 },
              data: {
                name: n4Name,
                count: n4Obj.total,
                detailText: `${n4Obj.total} gestiones`,
                isSelected: isN4Selected,
                n4Key: n4Name
              }
            });

            edges.push({
              id: `e-${activeN3NodeId}-${n4NodeId}`,
              source: activeN3NodeId,
              target: n4NodeId,
              type: 'smoothstep',
              animated: isN4Selected,
              style: {
                stroke: isN4Selected ? '#8B5CF6' : '#CBD5E1',
                strokeWidth: isN4Selected ? 2.5 : 1.2
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 14,
                height: 14,
                color: isN4Selected ? '#8B5CF6' : '#94A3B8'
              }
            });
          });

          // Renderizar Nivel 5 (Gestiones del Nivel 4 activo en Columna 5, x = 1400)
          const activeN4Obj = activeN3Obj.subBranches![activeN4Key];
          if (activeN4Obj) {
            const activeN4Idx = n4BranchesList.findIndex(([k]) => k === activeN4Key);
            const activeN4NodeId = `n4-${activeN4Idx >= 0 ? activeN4Idx : 0}`;

            let tramitesList = activeN4Obj.tramites;
            if (filtroCaracteristica !== 'todos') {
              tramitesList = tramitesList.filter((t) => t.etapaAto === filtroCaracteristica);
            }
            if (searchQuery.trim().length > 1) {
              tramitesList = tramitesList.filter(
                (t) =>
                  t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.codigo.toLowerCase().includes(searchQuery.toLowerCase())
              );
            }

            tramitesList.slice(0, 16).forEach((trItem, trIdx) => {
              const tramiteNodeId = `t-n4-${trIdx}`;
              nodes.push({
                id: tramiteNodeId,
                type: 'tramiteNode',
                position: { x: 1400, y: 40 + trIdx * 135 },
                data: {
                  id: trItem.id,
                  codigo: trItem.codigo,
                  titulo: trItem.titulo,
                  tipo: trItem.tipoInteraccionLabel,
                  etapaAto: trItem.etapaAto,
                  etapaAtoLabel: trItem.etapaAtoLabel,
                  onInspect: () => setSelectedTramite(trItem)
                }
              });

              edges.push({
                id: `e-${activeN4NodeId}-${tramiteNodeId}`,
                source: activeN4NodeId,
                target: tramiteNodeId,
                type: 'smoothstep',
                animated: true,
                style: { stroke: '#8B5CF6', strokeWidth: 1.8 },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  width: 14,
                  height: 14,
                  color: '#8B5CF6'
                }
              });
            });
          }
        }
      }
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    selectedSegment,
    selectedN2,
    selectedN3,
    selectedN4,
    filtroCaracteristica,
    searchQuery,
    fullTree,
    n2Keys
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Manejar clics en nodos del árbol
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.type === 'macroNode') {
      const segSlug = selectedSegment === 'comercio_exterior' ? 'operadores-de-comercio-exterior' : selectedSegment;
      const taxon = getTaxonDescription(segSlug);
      if (taxon) setSelectedTaxonNode(taxon);
      setSelectedTramite(null);
    } else if (node.type === 'level2Node' && node.data.n2Key) {
      const newN2 = node.data.n2Key as string;
      setSelectedN2(newN2);
      const taxon = getTaxonDescription(newN2);
      if (taxon) setSelectedTaxonNode(taxon);
      setSelectedTramite(null);

      const n2Obj = fullTree[selectedSegment]?.n2Branches[newN2];
      const subKeys = Object.keys(n2Obj?.subBranches || {});
      if (subKeys.length > 0) {
        setSelectedN3(subKeys[0]);
        const n3Obj = n2Obj?.subBranches![subKeys[0]];
        const n4Keys = Object.keys(n3Obj?.subBranches || {});
        setSelectedN4(n4Keys.length > 0 ? n4Keys[0] : '');
      } else {
        setSelectedN3('');
        setSelectedN4('');
      }
    } else if (node.type === 'level3Node' && node.data.n3Key) {
      const newN3 = node.data.n3Key as string;
      setSelectedN3(newN3);
      const taxon = getTaxonDescription(newN3);
      if (taxon) setSelectedTaxonNode(taxon);
      setSelectedTramite(null);

      const n3Obj = fullTree[selectedSegment]?.n2Branches[selectedN2]?.subBranches![newN3];
      const n4Keys = Object.keys(n3Obj?.subBranches || {});
      setSelectedN4(n4Keys.length > 0 ? n4Keys[0] : '');
    } else if (node.type === 'level4Node' && node.data.n4Key) {
      const newN4 = node.data.n4Key as string;
      setSelectedN4(newN4);
      const taxon = getTaxonDescription(newN4);
      if (taxon) setSelectedTaxonNode(taxon);
      setSelectedTramite(null);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col font-sans overflow-hidden">
      {/* 1. HEADER INSTITUCIONAL COMPLETO */}
      <header className="bg-sat-azul-oscuro text-white border-b border-sat-azul px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="#/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition focus:outline-hidden focus:ring-2 focus:ring-sat-celeste"
            title="Volver al Portal Ciudadano SAT"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Portal SAT</span>
          </a>

          <div className="h-6 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <SatIsologotipo variant="oscuro" />
            <div className="hidden md:block">
              <span className="text-[10px] text-sat-celeste font-bold uppercase tracking-wider block leading-none">
                República de Guatemala
              </span>
              <h1 className="text-sm font-black text-white leading-tight">
                Mapa Jerárquico Oficial — Portal SAT
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Jerarquía Oficial N1 → N5 (Excel Portal SAT)
          </span>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            715 Gestiones Canónicas
          </span>
        </div>
      </header>

      {/* 2. BARRA DE CONTROL DE LA TAXONOMÍA */}
      <section aria-label="Control de taxonomía y filtros" className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
        {/* Nivel 1 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider mr-1">
            Nivel 1:
          </span>
          {(['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'] as SegmentKey[]).map((segId) => {
            const item = SEGMENT_META[segId];
            const totalCount = fullTree[segId]?.total || 0;
            const isActive = selectedSegment === segId;
            return (
              <button
                key={segId}
                onClick={() => setSelectedSegment(segId)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                  isActive
                    ? 'border-sky-700 bg-sky-700 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.name} ({totalCount})
              </button>
            );
          })}
        </div>

        {/* Filtro por Característica Transversal (ATO) y Buscador */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Característica Transversal */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <label htmlFor="filtro-caracteristica-page" className="text-xs font-bold text-slate-700">
              Característica:
            </label>
            <select
              id="filtro-caracteristica-page"
              value={filtroCaracteristica}
              onChange={(e) => setFiltroCaracteristica(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              aria-label="Filtrar gestiones por característica transversal de ciclo de vida"
            >
              <option value="todos">Todas las características (atributo transversal)</option>
              <option value="empezar">🌱 Empezar y registrarse</option>
              <option value="operar">⚡ Operación y declaraciones</option>
              <option value="consultar">🔍 Consultas y herramientas</option>
              <option value="modificar_cerrar">🔄 Modificaciones y cierre</option>
              <option value="normativa">⚖️ Normativa y asistencia</option>
            </select>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar en tema activo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden w-44"
              aria-label="Buscar gestiones en el tema seleccionado"
            />
          </div>
        </div>
      </section>

      {/* 3. CANVAS COMPLETO DE REACT FLOW (PÁGINA COMPLETA) */}
      <main className="flex-1 w-full relative bg-slate-50 overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={NODE_TYPES}
            fitView
            minZoom={0.2}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
          >
            <AutoFitView activeKey={`${selectedSegment}-${selectedN2}-${selectedN3}-${selectedN4}`} />
            <Background variant={BackgroundVariant.Dots} color="#cbd5e1" gap={20} size={1.5} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'macroNode') return SEGMENT_META[selectedSegment].color;
                if (node.type === 'level2Node') return '#0284c7';
                if (node.type === 'level3Node') return '#10b981';
                if (node.type === 'level4Node') return '#8b5cf6';
                return '#64748b';
              }}
              className="!border !border-slate-200 !rounded-xl !bg-white/90 !shadow-sm"
            />

            {/* Panel Informativo de Metodología */}
            <Panel position="bottom-left" className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3.5 shadow-md text-xs space-y-1.5 max-w-md">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Compass className="w-4 h-4 text-sky-700" />
                <span>Estructura Taxonómica Oficial del Portal SAT:</span>
              </div>
              <ul className="text-[11px] text-slate-700 space-y-1 font-medium">
                <li>• <strong>Nivel 1 a Nivel 5:</strong> Estructura canónica del Excel (Nivel 1 → Nivel 2 → Nivel 3 → Nivel 4 → Nivel 5).</li>
                <li>• <strong>Nivel 4 donde sí existe:</strong> Se despliega en las 577 gestiones con tema específico.</li>
                <li>• <strong>Asimetría Natural:</strong> Gestiones sin Nivel 4 (o sin Nivel 3) se vinculan directamente al nivel superior sin crear niveles inventados.</li>
                <li>• <strong>Ciclo ATO:</strong> Atributo transversal de la gestión, reflejado en cada gestión.</li>
              </ul>
            </Panel>
          </ReactFlow>
        </div>

        {/* 4. DRAWER LATERAL: FICHA OFICIAL DE GESTIÓN (NIVEL 5) */}
        {selectedTramite && (
          <aside aria-label="Ficha oficial de gestión" className="absolute top-0 right-0 w-full sm:w-[480px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-20 animate-in slide-in-from-right duration-200">
            {/* Header de la Ficha */}
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
                  Ficha Oficial de Gestión
                </span>
                <h2 className="text-sm font-black text-slate-900 leading-tight">
                  Nivel 5 — Detalle de la Gestión
                </h2>
              </div>
              <button
                onClick={() => setSelectedTramite(null)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                aria-label="Cerrar ficha de gestión"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido de la Ficha */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              {/* Ruta Oficial de Niveles en el Excel */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Jerarquía Taxonómica en el Portal SAT:
                </span>
                <div className="space-y-1.5 text-xs text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 w-16 text-center">Nivel 1</span>
                    <span className="font-semibold text-slate-900">{selectedTramite.nivel1_segmento}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 w-16 text-center">Nivel 2</span>
                    <span className="text-slate-800">{selectedTramite.nivel2_area}</span>
                  </div>
                  {selectedTramite.nivel3_subarea && selectedTramite.nivel3_subarea !== '—' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 w-16 text-center">Nivel 3</span>
                      <span className="text-slate-800">{selectedTramite.nivel3_subarea}</span>
                    </div>
                  )}
                  {selectedTramite.nivel4_tema && selectedTramite.nivel4_tema !== '—' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-800 w-16 text-center">Nivel 4</span>
                      <span className="text-slate-800">{selectedTramite.nivel4_tema}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Título y Código Oficial (Nivel 5) */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 uppercase tracking-wider">
                    Nivel 5 Oficial
                  </span>
                  <span className="font-mono text-slate-700 font-bold text-xs bg-slate-100 px-2 py-0.5 rounded">
                    {selectedTramite.codigo}
                  </span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {selectedTramite.titulo}
                </h3>
              </div>

              {/* ¿Para qué sirve? (Definición Operativa del Excel) */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>¿Para qué sirve? (Definición Operativa)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {selectedTramite.descripcion}
                </p>
              </div>

              {/* Atributo Transversal: Ciclo de Vida (ATO) */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {ATO_FEATURE_META[selectedTramite.etapaAto]?.icon || '🌱'}
                  </span>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
                      Ciclo de Vida del Contribuyente (ATO):
                    </span>
                    <p className="text-xs font-bold text-emerald-900">
                      {selectedTramite.etapaAtoLabel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tipo de Interacción y Canal */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Tipo de Interacción:</span>
                  <span className="px-2 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-800 border border-slate-200 text-xs">
                    {selectedTramite.tipoInteraccionLabel}
                  </span>
                </div>
              </div>

              {/* Base Legal / Fundamento Jurídico */}
              <div className="border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Scale className="w-4 h-4 text-slate-700" />
                  <span>Base Legal / Fundamento Jurídico</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedTramite.baseLegal}
                </p>
              </div>

              {/* Enlace Oficial al Portal SAT */}
              {selectedTramite.url && (
                <div className="pt-2">
                  <a
                    href={selectedTramite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sat-azul hover:bg-sat-azul-oscuro text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>Abrir gestión en Portal SAT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* 5. DRAWER LATERAL: INSPECTOR DE NODO TAXONÓMICO (N1, N2, N3, N4) */}
        {!selectedTramite && selectedTaxonNode && (
          <aside aria-label="Ficha canónica de arquitectura" className="absolute top-0 right-0 w-full sm:w-[480px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-20 animate-in slide-in-from-right duration-200">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    Nivel {selectedTaxonNode.nivel} Taxonómico
                  </span>
                </div>
                <h2 className="text-sm font-black text-slate-900 leading-tight mt-1">
                  {selectedTaxonNode.nombre}
                </h2>
              </div>
              <button
                onClick={() => setSelectedTaxonNode(null)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                aria-label="Cerrar ficha taxonómica"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 bg-sky-50/50 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Layers className="w-4 h-4 text-sky-700" />
                  <span>¿Qué es? (Definición Operativa Ciudadana)</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">
                  {selectedTaxonNode.que_es}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <span>Texto Orientador de Interfaz (Lead Text)</span>
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed pt-1">
                  "{selectedTaxonNode.lead_text}"
                </p>
              </div>

              {selectedTaxonNode.base_juridica && (
                <div className="border border-slate-200 rounded-xl p-4 space-y-1.5 bg-slate-50">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Scale className="w-4 h-4 text-indigo-700" />
                    <span>Fundamento Legal Oficial (CAUCA, RECAUCA, Leyes)</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed pt-1 font-medium">
                    {selectedTaxonNode.base_juridica}
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </main>
    </div>
  );
};
