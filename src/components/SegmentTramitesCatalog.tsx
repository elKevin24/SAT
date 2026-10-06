import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronRight, ArrowLeft, Home } from 'lucide-react';
import { SegmentId } from './UserSegmentCards';

export interface TramiteItem {
  id: string;
  pillar: string;
  pillarName: string;
  categoria: string;
  subcategoria: string;
  tema?: string;
  subtema?: string;
  nombreActual?: string;
  tramite: string;
  descripcion: string;
  perfilDestinatario?: string;
  impactoOImportancia?: string;
  seccionActual?: string;
  url: string;
  nota?: string;
  baseLegal?: string;
}

interface SegmentTramitesCatalogProps {
  segmentId: SegmentId;
  initialCategory?: string;
  allTramites: TramiteItem[];
  onSelectTramite: (tramite: TramiteItem) => void;
  onBackToHome: () => void;
  onSwitchSegment: (segId: SegmentId) => void;
}

const SEGMENT_METADATA: Record<SegmentId, {
  title: string;
  shortTitle: string;
  desc: string;
  color: string;
  hoverBg: string;
  hoverBorder: string;
  hoverShadow: string;
}> = {
  contribuyentes: {
    title: 'Contribuyentes',
    shortTitle: 'Contribuyentes',
    desc: 'Personas individuales, pequeños contribuyentes, régimen general y contribuyentes especiales.',
    color: '#14649B',
    hoverBg: 'hover:bg-[#14649B]',
    hoverBorder: 'hover:border-[#14649B]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(20,100,155,0.22)]'
  },
  comercio_exterior: {
    title: 'Operadores de Comercio Exterior',
    shortTitle: 'Comercio Exterior',
    desc: 'Importadores, exportadores, auxiliares aduaneros, transportistas y normativa arancelaria.',
    color: '#0284C7',
    hoverBg: 'hover:bg-[#0284C7]',
    hoverBorder: 'hover:border-[#0284C7]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(2,132,199,0.22)]'
  },
  profesionales: {
    title: 'Profesionales',
    shortTitle: 'Profesionales',
    desc: 'Peritos contadores, auditores, abogados, notarios y gestores tributarios acreditados.',
    color: '#4D8014',
    hoverBg: 'hover:bg-[#4D8014]',
    hoverBorder: 'hover:border-[#4D8014]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(77,128,20,0.22)]'
  },
  organismos_especiales: {
    title: 'Organismos Especiales',
    shortTitle: 'Organismos Especiales',
    desc: 'Entidades del Estado, universidades, centros educativos, iglesias y organizaciones exentas.',
    color: '#C25E00',
    hoverBg: 'hover:bg-[#C25E00]',
    hoverBorder: 'hover:border-[#C25E00]',
    hoverShadow: 'hover:shadow-[0_12px_24px_rgba(194,94,0,0.22)]'
  }
};

const CANONICAL_CATEGORY_ORDER: Record<string, string[]> = {
  contribuyentes: [
    'NIT sin Obligaciones',
    'Pequeños Contribuyentes',
    'Contribuyente General',
    'Contribuyentes Especiales'
  ],
  comercio_exterior: [
    'Importadores',
    'Exportadores',
    'Transportistas',
    'Agentes Aduaneros',
    'Normativa y Aranceles',
    'OEA',
    'Courier',
    'Almacenes Fiscales'
  ],
  profesionales: [
    'Abogados y Notarios',
    'Peritos Contadores',
    'Auditores',
    'Gestores Tributarios',
    'Servicios Profesionales'
  ],
  organismos_especiales: [
    'Entidades del Estado',
    'Constitucionales',
    'No Lucrativos',
    'Municipalidades',
    'Decreto'
  ]
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'NIT sin Obligaciones': 'Personas individuales, estudiantes y graduados sin actividad económica que requieren NIT para trámites civiles, cuentas bancarias, títulos y remesas.',
  'Pequeños Contribuyentes': 'Régimen simplificado con tarifa definitiva del 5% hasta Q150,000 anuales y actividades agropecuarias especiales.',
  'Contribuyente General': 'Personas y empresas con obligaciones generales de IVA e ISR, facturación electrónica, asalariados y gestión vehicular.',
  'Contribuyentes Especiales': 'Medianos y grandes contribuyentes sujetos a control diferenciado y gerencias de fiscalización tributaria intensiva.',
  'Importadores': 'Padrón de importadores, declaraciones DUCA, aranceles DAI, levante aduanero y vehículos para importación.',
  'Exportadores': 'Padrón de exportadores, declaraciones aduaneras y solicitud de Devolución de Crédito Fiscal del IVA.',
  'Transportistas': 'Empresas de transporte terrestre, aéreo y marítimo internacional, tránsito aduanero y manifiestos de carga.',
  'Agentes Aduaneros': 'Auxiliares de la función pública autorizados para el despacho oficial y representación aduanera.',
  'Normativa y Aranceles': 'Criterios aduaneros oficiales, Sistema Arancelario Centroamericano (SAC) y facilitación de comercio.',
  'Abogados y Notarios': 'Habilitación profesional ante la SAT, adquisición de Papel Sellado Especial para Protocolos y timbres fiscales, traspasos electrónicos y avisos notariales obligatorios.',
  'Peritos Contadores': 'Inscripción y actualización de contadores autorizados ante la SAT para llevar contabilidades formales.',
  'Auditores': 'Habilitación para dictámenes fiscales, auditorías tributarias y trámites de devolución de crédito fiscal.',
  'Gestores Tributarios': 'Acreditación de gestores y personas autorizadas para tramitar ante agencias de la SAT.',
  'Servicios Profesionales': 'Profesionales liberales independientes, emisión de facturas y pago de timbres profesionales.',
  'Entidades del Estado': 'Ministerios, dependencias públicas y secretarías con retenciones tributarias y exenciones oficiales.',
  'Constitucionales': 'Universidades, centros educativos y misiones diplomáticas exentas de tributos por mandato constitucional.',
  'No Lucrativos': 'Asociaciones, fundaciones, cooperativas e iglesias con reconocimiento de exención de impuestos.',
  'Municipalidades': 'Gobiernos locales y empresas municipales con trámites tributarios y acreditaciones ante SAT.',
  'Decreto': 'Entidades beneficiarias de incentivos fiscales y exenciones específicas normadas por decreto legislativo.'
};

const SUBCATEGORY_DESCRIPTIONS: Record<string, string> = {
  // Abogados y Notarios (4 Subtemas Canónicos)
  'Habilitación y Registro Profesional': 'Inscripción y actualización en RTU como Abogado y Notario (CANG), registro de huella biométrica y activación en Agencia Virtual.',
  'Timbres Fiscales y Papel Sellado de Protocolo': 'Compra de Papel Sellado Especial para Protocolos (SAT-7130), timbres fiscales, razón electrónica en línea y retiro por procurador.',
  'Traspaso Electrónico Vehicular (e-Traspaso)': 'Habilitación en sistema TEV con firma electrónica avanzada, formalización notarial de compraventa y envío de expedientes digitales.',
  'Avisos Notariales ante la SAT': 'Presentación obligatoria de avisos de legalización de firmas, transferencias de dominio vehicular y calendario de plazos legales.',

  // NIT sin Obligaciones
  'Inscripción de NIT': 'Solicitud de primer NIT para personas individuales sin actividad mercantil y actualización de datos de identificación.',
  'Servicios en Línea y Solvencias': 'Habilitación de Agencia Virtual, solicitud de Solvencia Fiscal, cita previa y consulta de expedientes.',
  'Títulos Universitarios': 'Registro de títulos a nivel medio y universitario para habilitación profesional y consulta con código QR.',
  'Información Pública': 'Solicitud formal y consulta de información pública de oficio de la SAT conforme al Decreto 57-2008.',
  'Pequeño Contribuyente': 'Inscripción en régimen de pequeño contribuyente, emisión de factura electrónica FEL y declaración mensual SAT-2046.',
  'Primario': 'Régimen especial agropecuario para productores primarios de granos, hortalizas y frutas sin intermediarios.',
  'Pecuario': 'Régimen especial agropecuario para actividades de ganadería, avicultura y crianza de animales.',
  'RTU e Inscripción': 'Inscripción de sociedades mercantiles, actualización de datos, nombramientos de representantes y cese de actividades.',
  'Obligaciones y Regímenes': 'Declaraciones juradas de IVA e ISR, retenciones, facturación FEL y autorizaciones de regímenes contables.',
  'Registro Fiscal de Vehículos': 'Inscripción de vehículos, e-traspasos, calcomanías, pago de impuesto de circulación ISCV y placas.',
  'Capacitación y Cultura Tributaria': 'Cursos virtuales por impuesto, herramientas electrónicas, biblioteca tributaria y formación ciudadana.',
  'Devoluciones y Créditos Fiscales': 'Solicitud de devolución de crédito fiscal de IVA, devolución de ISR para asalariados y pagos indebidos.',
  'Servicios al Contribuyente': 'Constancias del RTU, habilitación de libros contables, atención de citas y corrección de formularios.',
  'Consultas y Verificadores': 'Verificadores públicos de solvencias, documentos con firma electrónica y consulta de omisos.'
};

export const SegmentTramitesCatalog: React.FC<SegmentTramitesCatalogProps> = ({
  segmentId,
  initialCategory,
  allTramites,
  onSelectTramite,
  onBackToHome,
  onSwitchSegment
}) => {
  const [internalQuery, setInternalQuery] = useState('');

  // Categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory && initialCategory !== 'Todas las categorías' ? initialCategory : null
  );

  // Subcategoría seleccionada
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory && initialCategory !== 'Todas las categorías') {
      setSelectedCategory(initialCategory);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  }, [initialCategory, segmentId]);

  const meta = SEGMENT_METADATA[segmentId];

  // Trámites del segmento actual
  const segmentTramites = useMemo(() => {
    return allTramites.filter(t => t.pillar === segmentId);
  }, [allTramites, segmentId]);

  // Categorías disponibles dentro del segmento actual
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    segmentTramites.forEach(t => {
      if (t.categoria) set.add(t.categoria);
    });
    const orderList = CANONICAL_CATEGORY_ORDER[segmentId] || [];
    return Array.from(set).sort((a, b) => {
      const idxA = orderList.indexOf(a);
      const idxB = orderList.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [segmentTramites, segmentId]);

  // Subcategorías disponibles dentro de la categoría seleccionada
  const subcategoriesList = useMemo(() => {
    if (!selectedCategory) return [];
    const inCurrentCategory = segmentTramites.filter(t => t.categoria === selectedCategory);
    const set = new Set<string>();
    inCurrentCategory.forEach(t => {
      if (t.subcategoria) set.add(t.subcategoria);
    });

    return Array.from(set).sort((a, b) => {
      // Regla canónica estricta para NIT: Inscripción va estrictamente primero
      if (selectedCategory === 'NIT sin Obligaciones') {
        const orderNIT = [
          'Inscripción de NIT',
          'Servicios en Línea y Solvencias',
          'Títulos Universitarios',
          'Información Pública'
        ];
        const idxA = orderNIT.indexOf(a);
        const idxB = orderNIT.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
      }

      // Regla canónica estricta para Abogados y Notarios
      if (selectedCategory === 'Abogados y Notarios') {
        const orderAN = [
          'Habilitación y Registro Profesional',
          'Timbres Fiscales y Papel Sellado de Protocolo',
          'Traspaso Electrónico Vehicular (e-Traspaso)',
          'Avisos Notariales ante la SAT'
        ];
        const idxA = orderAN.indexOf(a);
        const idxB = orderAN.indexOf(b);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
      }
      const aIsInsc = a.toLowerCase().includes('inscripci');
      const bIsInsc = b.toLowerCase().includes('inscripci');
      if (aIsInsc && !bIsInsc) return -1;
      if (!aIsInsc && bIsInsc) return 1;
      return a.localeCompare(b);
    });
  }, [segmentTramites, selectedCategory]);

  // Trámites finales (filtrados por subcategoría o por búsqueda global si hay query)
  const currentTramites = useMemo(() => {
    if (internalQuery.trim()) {
      const q = internalQuery.toLowerCase();
      return segmentTramites.filter(t =>
        (t.tramite && t.tramite.toLowerCase().includes(q)) ||
        (t.descripcion && t.descripcion.toLowerCase().includes(q)) ||
        (t.subcategoria && t.subcategoria.toLowerCase().includes(q)) ||
        (t.categoria && t.categoria.toLowerCase().includes(q))
      );
    }

    if (!selectedCategory || !selectedSubcategory) return [];

    return segmentTramites.filter(
      t => t.categoria === selectedCategory && t.subcategoria === selectedSubcategory
    );
  }, [segmentTramites, selectedCategory, selectedSubcategory, internalQuery]);

  // Navegación limpia de migas de pan
  const handleResetToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setInternalQuery('');
  };

  const handleResetToSubcategories = () => {
    setSelectedSubcategory(null);
    setInternalQuery('');
  };

  return (
    <div className="py-8 bg-white min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* -----------------------------------------------------------------
         * MIGA DE PAN LIMPIA (Sin la palabra 'Nivel' ni números redundantes)
         * ----------------------------------------------------------------- */}
        <nav aria-label="Navegación de trámites" className="flex items-center flex-wrap gap-2 text-xs font-medium text-[#475569] pb-3 border-b border-[#DCDCDC]">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 hover:text-[#14649B] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </button>

          <ChevronRight className="w-3 h-3 text-[#94A3B8]" />

          <button
            onClick={handleResetToCategories}
            className={`font-bold transition-colors ${
              !selectedCategory && !internalQuery ? 'text-[#14649B]' : 'hover:text-[#14649B]'
            }`}
          >
            {meta.title}
          </button>

          {selectedCategory && (
            <>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
              <button
                onClick={handleResetToSubcategories}
                className={`font-bold transition-colors ${
                  !selectedSubcategory && !internalQuery ? 'text-[#14649B]' : 'hover:text-[#14649B]'
                }`}
              >
                {selectedCategory}
              </button>
            </>
          )}

          {selectedSubcategory && (
            <>
              <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
              <span className="font-bold text-[#14649B]">
                {selectedSubcategory}
              </span>
            </>
          )}
        </nav>

        {/* -----------------------------------------------------------------
         * CABECERA DEL SEGMENTO CON BUSCADOR
         * ----------------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {meta.shortTitle}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#19324B] tracking-tight">
              {internalQuery
                ? `Resultados para "${internalQuery}"`
                : selectedSubcategory
                  ? selectedSubcategory
                  : selectedCategory
                    ? selectedCategory
                    : meta.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 max-w-3xl leading-relaxed">
              {internalQuery
                ? `Trámites encontrados en ${meta.shortTitle}.`
                : selectedSubcategory
                  ? (SUBCATEGORY_DESCRIPTIONS[selectedSubcategory] || 'Selecciona el trámite para ver sus requisitos y pasos normados.')
                  : selectedCategory
                    ? (CATEGORY_DESCRIPTIONS[selectedCategory] || meta.desc)
                    : meta.desc}
            </p>
          </div>

          {/* Buscador reactivo dentro del segmento */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={internalQuery}
              onChange={(e) => setInternalQuery(e.target.value)}
              placeholder="Buscar en este segmento..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DCDCDC] rounded-xl focus:border-[#14649B] focus:ring-1 focus:ring-[#14649B] outline-none"
            />
          </div>
        </div>

        {/* -----------------------------------------------------------------
         * VISTA 1: BÚSQUEDA DIRECTA (Si el usuario escribió algo en el input)
         * ----------------------------------------------------------------- */}
        {internalQuery.trim() ? (
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DCDCDC]">
              <h2 className="text-sm font-bold text-[#19324B]">
                Trámites coincidentes
              </h2>
              <button
                onClick={() => setInternalQuery('')}
                className="text-xs font-bold text-[#14649B] hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>

            {currentTramites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {currentTramites.map((tramite) => (
                  <div
                    key={tramite.id}
                    onClick={() => onSelectTramite(tramite)}
                    className={`group relative block rounded-2xl border border-[#CDE3F1] bg-[#F0F7FC] p-5 transition-all duration-200 hover:-translate-y-1 ${meta.hoverBg} ${meta.hoverShadow} cursor-pointer`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-[#19324B] transition-colors group-hover:text-white leading-snug">
                        {tramite.tramite}
                      </h3>
                      <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#475569] transition-colors group-hover:text-white/90">
                      {tramite.descripcion}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-[#DCDCDC] bg-[#F4F6F9] p-8 text-center">
                <p className="text-sm font-bold text-[#19324B]">No se encontraron trámites</p>
                <p className="text-xs text-[#475569] mt-1">
                  Intenta buscar con otros términos como NIT, RTU, Vehículos o Facturas.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* -----------------------------------------------------------------
           * NAVEGACIÓN EN TARJETAS (Fondo azul mínimo institucional #F0F7FC)
           * ----------------------------------------------------------------- */
          <>
            {/* =============================================================
             * VISTA DE CATEGORÍAS / CLASIFICACIONES (Sin títulos redundantes)
             * ============================================================= */}
            {!selectedCategory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {categoriesList.map((catName) => {
                  const desc = CATEGORY_DESCRIPTIONS[catName] || 'Explora los trámites y obligaciones agrupadas en esta clasificación oficial.';

                  return (
                    <div
                      key={catName}
                      onClick={() => {
                        setSelectedCategory(catName);
                        setSelectedSubcategory(null);
                      }}
                      className={`group relative block rounded-2xl border border-[#CDE3F1] bg-[#F0F7FC] p-5 transition-all duration-200 hover:-translate-y-1 ${meta.hoverBg} ${meta.hoverShadow} cursor-pointer`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-[#19324B] transition-colors group-hover:text-white leading-snug">
                          {catName}
                        </h3>
                        <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#475569] transition-colors group-hover:text-white/90">
                        {desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* =============================================================
             * VISTA DE SUBTEMAS (Sin subtítulos redundantes ni números)
             * ============================================================= */}
            {selectedCategory && !selectedSubcategory && (
              <div>
                <div className="flex items-center justify-end mb-3">
                  <button
                    onClick={handleResetToCategories}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a {meta.shortTitle}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                  {subcategoriesList.map((subName) => {
                    const desc = SUBCATEGORY_DESCRIPTIONS[subName] || 'Consulta los trámites específicos y requisitos correspondientes.';

                    return (
                      <div
                        key={subName}
                        onClick={() => setSelectedSubcategory(subName)}
                        className={`group relative block rounded-2xl border border-[#CDE3F1] bg-[#F0F7FC] p-5 transition-all duration-200 hover:-translate-y-1 ${meta.hoverBg} ${meta.hoverShadow} cursor-pointer`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-bold text-[#19324B] transition-colors group-hover:text-white leading-snug">
                            {subName}
                          </h3>
                          <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-[#475569] transition-colors group-hover:text-white/90">
                          {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* =============================================================
             * VISTA DE TRÁMITES FINALES (Sin conteos redundantes)
             * ============================================================= */}
            {selectedCategory && selectedSubcategory && (
              <div>
                <div className="flex items-center justify-end mb-3">
                  <button
                    onClick={handleResetToSubcategories}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14649B] hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver a {selectedCategory}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                  {currentTramites.map((tramite) => (
                    <div
                      key={tramite.id}
                      onClick={() => onSelectTramite(tramite)}
                      className={`group relative block rounded-2xl border border-[#CDE3F1] bg-[#F0F7FC] p-5 transition-all duration-200 hover:-translate-y-1 ${meta.hoverBg} ${meta.hoverShadow} cursor-pointer`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-[#19324B] transition-colors group-hover:text-white leading-snug">
                          {tramite.tramite}
                        </h3>
                        <ChevronRight className="h-5 w-5 shrink-0 text-[#94A3B8] transition-colors group-hover:text-white" />
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-[#475569] transition-colors group-hover:text-white/90">
                        {tramite.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
