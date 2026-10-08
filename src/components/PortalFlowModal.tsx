import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { X, Layers, Info } from 'lucide-react';
import { SegmentId } from './UserSegmentCards';
import rawTramites from '../data/allTramites.json';

// --- METADATOS DE SEGMENTOS ---
const SEGMENT_META: Record<SegmentId, { name: string; color: string; desc: string }> = {
  contribuyentes: {
    name: 'Contribuyentes',
    color: '#14649B',
    desc: 'Información y servicios tributarios para personas y empresas.'
  },
  comercio_exterior: {
    name: 'Operadores de Comercio Exterior',
    color: '#0284C7',
    desc: 'Servicios e información aduanera para importación, exportación y logística.'
  },
  profesionales: {
    name: 'Profesionales',
    color: '#4D8014',
    desc: 'Herramientas y servicios especializados para profesionales tributarios y auxiliares.'
  },
  entes_exentos: {
    name: 'Entes Exentos',
    color: '#C25E00',
    desc: 'Gestiones para entidades públicas, ONGs y exenciones constitucionales.'
  }
};

// --- NODOS PERSONALIZADOS CON DISEÑO INSTITUCIONAL ---
const MacroNodeComponent = ({ data }: NodeProps) => (
  <div className="w-64 bg-white border-2 rounded-xl p-4 shadow-md transition-transform hover:-translate-y-1" style={{ borderColor: data.color as string }}>
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nivel 1 — Segmento</span>
      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">{data.total as number} Trámites</span>
    </div>
    <h3 className="text-base font-black text-slate-900 mt-1">{data.name as string}</h3>
    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{data.desc as string}</p>
    <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-700" />
  </div>
);

const CategoriaL2NodeComponent = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div className={`w-64 bg-white border-2 rounded-xl p-3.5 shadow-sm transition-all cursor-pointer ${isSelected ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/40 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-600" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nivel 2 — Categoría</span>
        <span className="text-[11px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-700">{data.count as number} trámites</span>
      </div>
      <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{data.name as string}</h4>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-sky-600" />
    </div>
  );
};

const SubcategoriaN3NodeComponent = ({ data }: NodeProps) => {
  const isSelected = data.isSelected as boolean;
  return (
    <div className={`w-64 bg-white border-2 rounded-xl p-3 shadow-xs transition-all cursor-pointer ${isSelected ? 'ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/40 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-600" />
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Nivel 3 — Subárea</span>
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">{data.count as number} trámites</span>
      </div>
      <h5 className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">{data.name as string}</h5>
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-emerald-600" />
    </div>
  );
};

const TramiteN5NodeComponent = ({ data }: NodeProps) => (
  <div className="w-80 bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-1 hover:border-slate-400 transition-colors">
    <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-600" />
    <div className="flex items-center justify-between text-[11px]">
      <span className="font-bold text-sky-700 uppercase tracking-wider">{data.tipo as string}</span>
      <span className="text-slate-600 font-mono text-xs">{data.codigo as string}</span>
    </div>
    <h6 className="text-xs font-semibold text-slate-900 leading-snug">{data.titulo as string}</h6>
  </div>
);

const NODE_TYPES = {
  macroNode: MacroNodeComponent,
  categoriaNode: CategoriaL2NodeComponent,
  subcategoriaNode: SubcategoriaN3NodeComponent,
  tramiteNode: TramiteN5NodeComponent
};

interface PortalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSegment?: SegmentId;
}

export const PortalFlowModal: React.FC<PortalFlowModalProps> = ({
  isOpen,
  onClose,
  initialSegment = 'contribuyentes'
}) => {
  const [selectedSegment, setSelectedSegment] = useState<SegmentId>(initialSegment);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  // Construir el árbol real directamente de allTramites.json
  const treeData = useMemo(() => {
    const segments: Record<SegmentId, {
      total: number;
      categories: Record<string, {
        total: number;
        subcategories: Record<string, Array<{
          id: string;
          titulo: string;
          tipo: string;
        }>>;
      }>;
    }> = {
      contribuyentes: { total: 0, categories: {} },
      comercio_exterior: { total: 0, categories: {} },
      profesionales: { total: 0, categories: {} },
      entes_exentos: { total: 0, categories: {} }
    };

    rawTramites.forEach((t) => {
      const segId = t.pillar as SegmentId;
      if (!segments[segId]) return;

      const catName = t.categoria || 'Sin Categoría';
      const subName = t.subcategoria || 'General';
      const tramiteTitulo = t.tramite || t.nombreActual || 'Trámite';
      const tipoLabel = t.tipoInteraccionLabel || 'Guía Informativa';

      segments[segId].total++;

      if (!segments[segId].categories[catName]) {
        segments[segId].categories[catName] = { total: 0, subcategories: {} };
      }
      segments[segId].categories[catName].total++;

      if (!segments[segId].categories[catName].subcategories[subName]) {
        segments[segId].categories[catName].subcategories[subName] = [];
      }
      segments[segId].categories[catName].subcategories[subName].push({
        id: t.id,
        titulo: tramiteTitulo,
        tipo: tipoLabel
      });
    });

    return segments;
  }, []);

  // Inicializar selección al cambiar segmento o abrir modal
  useEffect(() => {
    if (initialSegment) {
      setSelectedSegment(initialSegment);
    }
  }, [initialSegment]);

  useEffect(() => {
    const currentSeg = treeData[selectedSegment];
    const catKeys = Object.keys(currentSeg?.categories || {});
    if (catKeys.length > 0) {
      const firstCat = catKeys[0];
      setSelectedCategory(firstCat);
      const subKeys = Object.keys(currentSeg.categories[firstCat]?.subcategories || {});
      setSelectedSubcategory(subKeys.length > 0 ? subKeys[0] : '');
    } else {
      setSelectedCategory('');
      setSelectedSubcategory('');
    }
  }, [selectedSegment, treeData]);

  // Manejo de tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Generar Nodos y Conexiones según la jerarquía real definida
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const segInfo = SEGMENT_META[selectedSegment];
    const currentSeg = treeData[selectedSegment];
    if (!currentSeg) return { initialNodes: [], initialEdges: [] };

    const categoriesList = Object.entries(currentSeg.categories);
    const activeCatName = selectedCategory || (categoriesList[0] ? categoriesList[0][0] : '');
    const activeCatData = currentSeg.categories[activeCatName];
    const subcategoriesList = activeCatData ? Object.entries(activeCatData.subcategories) : [];
    const activeSubName = selectedSubcategory || (subcategoriesList[0] ? subcategoriesList[0][0] : '');
    const activeTramites = activeCatData?.subcategories[activeSubName] || [];

    // 1. Nodo Nivel 1 — Segmento (Macro Grupo)
    const macroNodeId = `n1-${selectedSegment}`;
    const macroCenterY = Math.max(180, (categoriesList.length * 110) / 2);
    nodes.push({
      id: macroNodeId,
      type: 'macroNode',
      position: { x: 30, y: macroCenterY },
      data: {
        name: segInfo.name,
        total: currentSeg.total,
        color: segInfo.color,
        desc: segInfo.desc
      }
    });

    // 2. Nodos Nivel 2 — Categorías Oficiales
    categoriesList.forEach(([catName, catObj], idx) => {
      const catNodeId = `n2-${idx}`;
      const isCatSelected = catName === activeCatName;

      nodes.push({
        id: catNodeId,
        type: 'categoriaNode',
        position: { x: 350, y: 40 + idx * 115 },
        data: {
          name: catName,
          count: catObj.total,
          isSelected: isCatSelected,
          catKey: catName
        }
      });

      // Edge Nivel 1 -> Nivel 2
      edges.push({
        id: `e-${macroNodeId}-${catNodeId}`,
        source: macroNodeId,
        target: catNodeId,
        animated: isCatSelected,
        style: {
          stroke: isCatSelected ? segInfo.color : '#CBD5E1',
          strokeWidth: isCatSelected ? 2.5 : 1.2
        }
      });
    });

    // 3. Nodos Nivel 3 — Subáreas Temáticas de la Categoría Activa
    subcategoriesList.forEach(([subName, tramitesArr], sIdx) => {
      const subNodeId = `n3-${sIdx}`;
      const isSubSelected = subName === activeSubName;

      nodes.push({
        id: subNodeId,
        type: 'subcategoriaNode',
        position: { x: 670, y: 45 + sIdx * 115 },
        data: {
          name: subName,
          count: tramitesArr.length,
          isSelected: isSubSelected,
          subKey: subName
        }
      });

      // Edge Nivel 2 -> Nivel 3
      const activeCatIdx = categoriesList.findIndex(([c]) => c === activeCatName);
      const activeCatNodeId = `n2-${activeCatIdx}`;
      edges.push({
        id: `e-${activeCatNodeId}-${subNodeId}`,
        source: activeCatNodeId,
        target: subNodeId,
        animated: isSubSelected,
        style: {
          stroke: isSubSelected ? '#10B981' : segInfo.color,
          strokeOpacity: isSubSelected ? 1 : 0.4,
          strokeWidth: isSubSelected ? 2.2 : 1.2
        }
      });
    });

    // 4. Nodos Nivel 5 — Trámites y Servicios Reales de la Subárea Activa
    activeTramites.slice(0, 8).forEach((tItem, tIdx) => {
      const tramiteNodeId = `n5-${tIdx}`;

      nodes.push({
        id: tramiteNodeId,
        type: 'tramiteNode',
        position: { x: 990, y: 50 + tIdx * 95 },
        data: {
          titulo: tItem.titulo,
          tipo: tItem.tipo,
          codigo: tItem.id
        }
      });

      // Edge Nivel 3 -> Nivel 5
      const activeSubIdx = subcategoriesList.findIndex(([s]) => s === activeSubName);
      const activeSubNodeId = `n3-${activeSubIdx}`;
      edges.push({
        id: `e-${activeSubNodeId}-${tramiteNodeId}`,
        source: activeSubNodeId,
        target: tramiteNodeId,
        animated: true,
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [selectedSegment, selectedCategory, selectedSubcategory, treeData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Manejar interacción por clic en los nodos del árbol
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (node.type === 'categoriaNode' && node.data.catKey) {
      const newCat = node.data.catKey as string;
      setSelectedCategory(newCat);
      const subKeys = Object.keys(treeData[selectedSegment]?.categories[newCat]?.subcategories || {});
      setSelectedSubcategory(subKeys.length > 0 ? subKeys[0] : '');
    } else if (node.type === 'subcategoriaNode' && node.data.subKey) {
      setSelectedSubcategory(node.data.subKey as string);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flow-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-7xl h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#14649B]/10 text-[#14649B] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="flow-modal-title" className="text-lg font-black text-slate-900 tracking-tight">
                  Estructura Jerárquica del Portal SAT (Árbol Oficial)
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  Taxonomía Oficial
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Jerarquía temático-funcional: <strong>Nivel 1 (Segmento)</strong> → <strong>Nivel 2 (Categoría / Régimen)</strong> → <strong>Nivel 3 (Subárea Temática)</strong> → <strong>Nivel 5 (Trámites y Servicios)</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Cerrar modal de diagrama de flujo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barra de Control de Segmentos */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Seleccionar Audiencia:</span>
            {(['contribuyentes', 'comercio_exterior', 'profesionales', 'entes_exentos'] as SegmentId[]).map((segId) => {
              const item = SEGMENT_META[segId];
              const totalCount = treeData[segId]?.total || 0;
              const isActive = selectedSegment === segId;
              return (
                <button
                  key={segId}
                  onClick={() => setSelectedSegment(segId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    isActive
                      ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.name} ({totalCount})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-3.5 h-3.5 text-sky-600" />
            <span>Haz clic en tarjetas de <strong>Nivel 2</strong> o <strong>Nivel 3</strong> para desplegar sus ramas temáticas reales.</span>
          </div>
        </div>

        {/* Canvas de React Flow */}
        <div className="flex-1 w-full h-full relative bg-slate-50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={NODE_TYPES}
            fitView
            minZoom={0.25}
            maxZoom={1.5}
            attributionPosition="bottom-right"
          >
            <Background color="#cbd5e1" gap={20} size={1} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={(node) => {
                if (node.type === 'macroNode') return SEGMENT_META[selectedSegment].color;
                if (node.type === 'categoriaNode') return '#0284c7';
                if (node.type === 'subcategoriaNode') return '#10b981';
                return '#94a3b8';
              }}
              className="!border !border-slate-200 !rounded-xl !bg-white/90 !shadow-sm"
            />
            <Panel position="bottom-left" className="bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3 shadow-md text-xs space-y-1">
              <span className="font-bold text-slate-700">Jerarquía Temática Oficial:</span>
              <ul className="text-[11px] text-slate-500 space-y-0.5">
                <li>• <strong>Columna 1:</strong> Nivel 1 — Segmento / Macro Grupo.</li>
                <li>• <strong>Columna 2:</strong> Nivel 2 — Categoría / Régimen principal.</li>
                <li>• <strong>Columna 3:</strong> Nivel 3 — Subárea temática contextual.</li>
                <li>• <strong>Columna 4:</strong> Nivel 5 — Fichas y trámites concretos.</li>
              </ul>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};
