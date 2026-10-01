import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

type PillarType = 'contribuyentes' | 'comercio_exterior' | 'profesionales' | 'organismos_especiales';

interface TramiteItem {
  id: string;
  pillar: PillarType;
  pillarName: string;
  categoria: string;
  subcategoria: string;
  tramite: string;
  seccion: string;
  url: string;
  confianza: string;
  descripcion: string;
  requisitos?: string[];
  pasos?: string[];
}

const TRAMITES_DATA: TramiteItem[] = [
  // 3. Profesionales -> Notarios y Abogados -> Práctica Profesional y Registro
  {
    id: 'prof-1',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Activación de abogados',
    seccion: 'SERVICIOS TRIBUTARIOS / AGENCIA VIRTUAL',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencia-virtual/activacion-de-abogados/',
    confianza: 'Alta (Oficial SAT)',
    descripcion: 'Procedimiento oficial para la activación de profesionales del derecho (Abogados y Notarios) ante la Agencia Virtual de la SAT para realizar gestiones electrónicas y traspasos de vehículos.',
    requisitos: [
      'Estar activo y colegiado en el Colegio de Abogados y Notarios de Guatemala (CANG).',
      'Estar inscrito en el RTU de la SAT con sus obligaciones tributarias al día (IVA, ISR).',
      'Poseer usuario y contraseña activa en Agencia Virtual SAT.',
      'Haber realizado el registro de impresión dactilar (biométrico) en agencias u oficinas tributarias.'
    ],
    pasos: [
      'Iniciar sesión en su cuenta de Agencia Virtual SAT.',
      'Ir al menú de Servicios / Registro Tributario Unificado (RTU).',
      'Seleccionar la opción de Actualización o Activación de Calidad de Abogado y Notario.',
      'Ingresar el número de colegiado activo y adjuntar la documentación requerida.',
      'Confirmar la solicitud para recibir la aprobación y habilitación en el sistema FEL y traspasos electrónicos.'
    ]
  },
  {
    id: 'prof-2a',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Inscripción de Abogado y Notario',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    confianza: 'Alta (Oficial SAT)',
    descripcion: 'Procedimiento de alta inicial en el registro tributario oficial de Abogados y Notarios ante la SAT.',
    requisitos: [
      'DPI original y copia legible.',
      'Constancia vigente de colegiado activo emitida por el CANG.',
      'Título profesional registrado ante la Contraloría General de Cuentas y USAC.'
    ],
    pasos: [
      'Presentar solicitud inicial en oficinas tributarias o agencias virtuales habilitadas.',
      'Validar datos profesionales con el operador de ventanilla.',
      'Recibir confirmación de inscripción y constancia oficial.'
    ]
  },
  {
    id: 'prof-2b',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Actualización de Abogado y Notario',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/inscripcion-actualizacion-de-abogado-y-notario/',
    confianza: 'Alta (Oficial SAT)',
    descripcion: 'Modificación periódica o por cambio de datos en el registro profesional, dirección de notaría o estado colegiado.',
    requisitos: [
      'Constancia reciente de Colegiado Activo emitida por el CANG.',
      'Usuario activo en Agencia Virtual SAT.',
      'DPI vigente del profesional.'
    ],
    pasos: [
      'Ingresar al módulo de actualización de profesionales en Agencia Virtual SAT.',
      'Cargar la constancia vigente de colegiado activo.',
      'Confirmar los cambios en datos de notificación y firma digital.'
    ]
  },
  {
    id: 'prof-3',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Práctica Profesional y Registro',
    tramite: 'Confirmación de Huella en el Registro',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/sin-categoria/requisitos-de-actualizacion-de-impresion-dactilar-para-abogados-y-notarios-que-realizan-traspasos-electronicos-a-traves-de-agencia-virtual/',
    confianza: 'Alta',
    descripcion: 'Actualización biométrica obligatoria para notarios que realizan traspasos electrónicos en Agencia Virtual.',
    requisitos: [
      'Presencia física del profesional notario.',
      'DPI original vigente.',
      'Carné de colegiado activo.'
    ],
    pasos: [
      'Acudir al Centro de Atención Tributaria con cita previa.',
      'Captura biométrica de huellas dactilares.',
      'Firma de consentimiento y activación inmediata.'
    ]
  },

  // 3. Profesionales -> Notarios y Abogados -> Gestiones Vehiculares
  {
    id: 'prof-4',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Gestiones Vehiculares',
    tramite: 'Aviso de Legalización de Firmas en Certificado de Propiedad',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/aviso-de-legalizacion-de-firmas-en-certificado-de-propiedad-de-vehiculos/',
    confianza: 'Alta',
    descripcion: 'Presentación formal del aviso notarial sobre la legalización de firmas en certificados de propiedad automotor.',
    requisitos: [
      'Certificado de propiedad con firmas legalizadas por Notario.',
      'Timbres notariales y fiscales correspondientes.'
    ],
    pasos: [
      'Generar aviso electrónico a través de la Agencia Virtual SAT.',
      'Adjuntar comprobantes y registrar el número de legalización.'
    ]
  },
  {
    id: 'prof-5',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Gestiones Vehiculares',
    tramite: 'Traspaso Electrónico con Anexo Declaraguate',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/traspaso-electronico-de-vehiculos-por-notario-con-anexo-del-certificado-de-propiedad-emitido-via-declaraguate-en-agencia-virtual/',
    confianza: 'Alta',
    descripcion: 'Procedimiento notarial para efectuar el cambio de propietario de vehículos automotores de forma 100% digital.',
    requisitos: [
      'Formulario SAT-8611 pagado en Declaraguate.',
      'Reconocimiento biométrico del notario y partes interesadas.'
    ],
    pasos: [
      'Ingresar al módulo de Traspaso Electrónico en Agencia Virtual.',
      'Verificar datos del comprador y vendedor.',
      'Autorizar la transferencia de dominio y generar el nuevo distintivo digital.'
    ]
  },

  // 3. Profesionales -> Notarios y Abogados -> Especies Fiscales
  {
    id: 'prof-6',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Notarios y Abogados',
    subcategoria: 'Especies Fiscales',
    tramite: 'Venta de Especies Fiscales a Notarios y Patentados',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/venta-de-especies-fiscales-a-notarios-y-patentados/',
    confianza: 'Alta',
    descripcion: 'Adquisición oficial de timbres y especies fiscales para el ejercicio notarial.',
    requisitos: [
      'Patente o acreditación vigente.',
      'Boleta de pago de timbres fiscales generada en Declaraguate.'
    ],
    pasos: [
      'Generar formulario Declaraguate SAT-7130.',
      'Realizar pago en banca en línea.',
      'Retirar las especies fiscales en la agencia seleccionada.'
    ]
  },

  // 3. Profesionales -> Gestores Tributarios
  {
    id: 'prof-7',
    pillar: 'profesionales',
    pillarName: '3. Profesionales',
    categoria: 'Gestores Tributarios',
    subcategoria: 'Gafetes y Acreditaciones',
    tramite: 'Actualización y Renovación del Gafete de Gestor',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/requisitos-tramites-agencias/actualizacion-de-informacion-y-renovacion-del-gafete-de-gestor-tributario-y-o-auxiliar-de-gestor-tributario/',
    confianza: 'Alta',
    descripcion: 'Renovación obligatoria de credenciales para gestores tributarios autorizados.',
    requisitos: ['Constancia de antecedentes penales y policiales', 'DPI vigente'],
    pasos: ['Completar formulario de renovación en portal SAT.']
  },

  // 1. Contribuyentes
  {
    id: 'con-1a',
    pillar: 'contribuyentes',
    pillarName: '1. Contribuyentes',
    categoria: 'Personas Individuales',
    subcategoria: 'Inscripción y RTU',
    tramite: 'Inscripción en el RTU Digital',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    confianza: 'Alta (Oficial SAT)',
    descripcion: 'Solicitud inicial de Número de Identificación Tributaria (NIT) y primera inscripción en el Registro Tributario Unificado digital.',
    requisitos: ['Documento Personal de Identificación (DPI) escaneado', 'Comprobante de domicilio o factura de servicios recientes'],
    pasos: ['Ingresar a la opción de Solicitud de NIT en portal SAT.', 'Completar formulario digital y validar correo electrónico.', 'Recibir confirmación de NIT y activar usuario de Agencia Virtual.']
  },
  {
    id: 'con-1b',
    pillar: 'contribuyentes',
    pillarName: '1. Contribuyentes',
    categoria: 'Personas Individuales',
    subcategoria: 'Inscripción y RTU',
    tramite: 'Actualización en el RTU Digital',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/rtu-digital/',
    confianza: 'Alta (Oficial SAT)',
    descripcion: 'Actualización obligatoria periódica de datos tributarios, domicilio fiscal, actividad económica o datos de contacto.',
    requisitos: ['Acceso activo a Agencia Virtual', 'Documento que soporte el cambio (factura de servicios para cambio de dirección, etc.)'],
    pasos: ['Iniciar sesión en Agencia Virtual SAT.', 'Ingresar a Servicios > RTU > Actualización de Datos.', 'Confirmar datos y descargar la nueva Constancia del RTU Digital.']
  },
  {
    id: 'con-2',
    pillar: 'contribuyentes',
    pillarName: '1. Contribuyentes',
    categoria: 'Personas Individuales',
    subcategoria: 'Facturación Electrónica (FEL)',
    tramite: 'Habilitación como Emisor FEL',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/factura-electronica-en-linea-fel/',
    confianza: 'Alta',
    descripcion: 'Habilitación gratuita para emisión de facturas electrónicas desde la Agencia Virtual.',
    requisitos: ['RTU actualizado', 'Afiliación al régimen de IVA'],
    pasos: ['Generar firma electrónica gratuita en Agencia Virtual.']
  },

  // 2. Comercio Exterior
  {
    id: 'com-1',
    pillar: 'comercio_exterior',
    pillarName: '2. Comercio Exterior',
    categoria: 'Importadores y Exportadores',
    subcategoria: 'Aduanas',
    tramite: 'Habilitación como Operador Económico Autorizado (OEA)',
    seccion: 'ADUANAS',
    url: 'https://portal.sat.gob.gt/portal/operador-economico-autorizado/',
    confianza: 'Alta',
    descripcion: 'Certificación internacional de seguridad en la cadena logística aduanera.',
    requisitos: ['Historial de cumplimiento tributario y aduanero impecable', 'Estándares de seguridad en almacén'],
    pasos: ['Presentar solicitud formal ante la Intendencia de Aduanas.']
  },

  // 4. Organismos Especiales
  {
    id: 'org-1',
    pillar: 'organismos_especiales',
    pillarName: '4. Organismos Especiales',
    categoria: 'Entidades No Lucrativas (ONG)',
    subcategoria: 'Exenciones Fiscales',
    tramite: 'Solicitud de Exención de IVA e ISR para ONG',
    seccion: 'SERVICIOS TRIBUTARIOS',
    url: 'https://portal.sat.gob.gt/portal/exenciones-ongs/',
    confianza: 'Alta',
    descripcion: 'Trámite de reconocimiento de exención fiscal para asociaciones y fundaciones.',
    requisitos: ['Escritura constitutiva registrada', 'Inscripción en Registro de Personas Jurídicas'],
    pasos: ['Presentar expediente en gerencia regional tributaria.']
  }
];

const PILLARS_CONFIG: { id: PillarType; name: string; desc: string }[] = [
  { id: 'contribuyentes', name: '1. Contribuyentes', desc: 'Personas individuales, asalariados y regímenes de inscripción tributaria.' },
  { id: 'comercio_exterior', name: '2. Comercio Exterior', desc: 'Gestiones aduaneras, importadores, exportadores y auxiliares.' },
  { id: 'profesionales', name: '3. Profesionales', desc: 'Notarios, abogados, gestores tributarios y agentes aduaneros.' },
  { id: 'organismos_especiales', name: '4. Organismos Especiales', desc: 'Entidades no lucrativas, ONGs y misiones diplomáticas.' }
];

export default function App() {
  // Navigation Hierarchy (Max 4 levels):
  // Level 1: Macro Grupos (Pilares)
  // Level 2: Categorías
  // Level 3: Subcategorías
  // Level 4: Trámites (List & Detail)
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPillar, setSelectedPillar] = useState<PillarType>('profesionales');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('Notarios y Abogados');
  const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>('Práctica Profesional y Registro');
  const [selectedTramite, setSelectedTramite] = useState<TramiteItem | null>(null);

  // Requirement: Default closed (false) in levels 1, 2, 3; Auto-opens in level 4!
  const [menuSidebarOpen, setMenuSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Items filtered by current selection
  const currentPillarItems = TRAMITES_DATA.filter(i => i.pillar === selectedPillar);
  const currentCategoriaItems = currentPillarItems.filter(i => i.categoria === selectedCategoria);
  const currentSubcategoriaItems = currentCategoriaItems.filter(i => i.subcategoria === selectedSubcategoria);

  // Available options for each level
  const categoriasInPillar = Array.from(new Set(currentPillarItems.map(i => i.categoria)));
  const subcategoriasInCategoria = Array.from(new Set(currentCategoriaItems.map(i => i.subcategoria)));

  // Navigation handlers
  const handleGoHome = () => {
    setLevel(1);
    setSelectedTramite(null);
    setMenuSidebarOpen(false); // Default closed in level 1
  };

  const handleSelectPillar = (pillarId: PillarType) => {
    setSelectedPillar(pillarId);
    const pItems = TRAMITES_DATA.filter(i => i.pillar === pillarId);
    const firstCat = pItems[0]?.categoria || '';
    setSelectedCategoria(firstCat);
    const firstSub = pItems.filter(i => i.categoria === firstCat)[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(2);
    setMenuSidebarOpen(false); // Default closed in level 2
  };

  const handleSelectCategoria = (cat: string) => {
    setSelectedCategoria(cat);
    const subItems = currentPillarItems.filter(i => i.categoria === cat);
    const firstSub = subItems[0]?.subcategoria || '';
    setSelectedSubcategoria(firstSub);
    setSelectedTramite(null);
    setLevel(3);
    setMenuSidebarOpen(false); // Default closed in level 3
  };

  const handleSelectSubcategoria = (sub: string) => {
    setSelectedSubcategoria(sub);
    const trms = currentCategoriaItems.filter(i => i.subcategoria === sub);
    setSelectedTramite(trms[0] || null);
    setLevel(4);
    setMenuSidebarOpen(true); // Requirement: SE ABRE AUTO A LA CUARTA CATEGORIA
  };

  const handleSelectTramite = (item: TramiteItem) => {
    setSelectedTramite(item);
    setLevel(4);
    setMenuSidebarOpen(true); // Open in 4th level
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased flex flex-col selection:bg-slate-900 selection:text-white">
      
      {/* 1st Top Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleGoHome}>
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-tighter">
              SAT
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Portal Tributario</span>
              <span className="text-sm font-bold text-slate-900 tracking-tight">Guatemala</span>
            </div>
          </div>

          <div className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="Buscar en el portal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* 2nd Bar: Centered Contents (Menú, Inicio, and Pillars) */}
      <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-2.5 flex items-center justify-center gap-6 overflow-x-auto text-xs font-medium">
        
        {/* Hamburger Menu button with ONLY the menu icon as requested */}
        <button 
          onClick={() => setMenuSidebarOpen(!menuSidebarOpen)}
          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-400 text-slate-900 rounded-md font-semibold shrink-0 transition-colors flex items-center gap-1.5"
        >
          {menuSidebarOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          {menuSidebarOpen ? 'Cerrar Menú' : 'Menú'}
        </button>

        {/* Inicio button right after Menú */}
        <button 
          onClick={handleGoHome}
          className={`px-3.5 py-1.5 rounded-md font-bold shrink-0 transition-colors ${
            level === 1 
              ? 'bg-slate-900 text-white shadow-2xs' 
              : 'bg-white border border-slate-200 hover:border-slate-400 text-slate-900'
          }`}
        >
          Inicio
        </button>

        {/* The 4 Macro Groups */}
        <div className="flex items-center gap-6 text-xs whitespace-nowrap pl-4 border-l border-slate-200">
          {PILLARS_CONFIG.map((p) => (
            <button 
              key={p.id}
              onClick={() => handleSelectPillar(p.id)}
              className={`transition-colors py-1 ${
                selectedPillar === p.id && level > 1 
                  ? 'text-slate-900 font-bold border-b border-slate-900' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout: Context-Aware Lateral Menu + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        
        {/* LATERAL MENU:
            - Closed by default on level 1, 2, 3
            - AUTO-OPENS on level 4
            - Displays the CURRENT OPTIONS according to current level in screen!
        */}
        {menuSidebarOpen && (
          <aside className="w-full md:w-72 border-r border-slate-100 p-8 space-y-6 shrink-0 bg-white">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Nivel {level} · Opciones en Pantalla
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {level === 1 && 'Macro Grupos (Pilares)'}
                {level === 2 && `Categorías de ${PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}`}
                {level === 3 && `Subcategorías de ${selectedCategoria}`}
                {level === 4 && `Trámites en ${selectedSubcategoria}`}
              </h3>
            </div>

            {/* Menu options synchronised with the current screen options */}
            <div className="space-y-2 border-l border-slate-200 pl-3 text-xs">
              
              {/* Level 1 menu options */}
              {level === 1 && (
                <ul className="space-y-1">
                  {PILLARS_CONFIG.map((p) => (
                    <li key={p.id}>
                      <button 
                        onClick={() => handleSelectPillar(p.id)}
                        className={`text-left w-full py-1.5 px-2 rounded transition-colors ${
                          selectedPillar === p.id 
                            ? 'text-slate-900 font-bold bg-slate-50' 
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Level 2 menu options */}
              {level === 2 && (
                <ul className="space-y-1">
                  {categoriasInPillar.map((cat, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSelectCategoria(cat)}
                        className={`text-left w-full py-1.5 px-2 rounded transition-colors ${
                          selectedCategoria === cat 
                            ? 'text-slate-900 font-bold bg-slate-50' 
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Level 3 menu options */}
              {level === 3 && (
                <ul className="space-y-1">
                  {subcategoriasInCategoria.map((sub, idx) => (
                    <li key={idx}>
                      <button 
                        onClick={() => handleSelectSubcategoria(sub)}
                        className={`text-left w-full py-1.5 px-2 rounded transition-colors ${
                          selectedSubcategoria === sub 
                            ? 'text-slate-900 font-bold bg-slate-50' 
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Level 4 menu options (Trámites in this subcategory) */}
              {level === 4 && (
                <ul className="space-y-1">
                  {currentSubcategoriaItems.map((item) => (
                    <li key={item.id}>
                      <button 
                        onClick={() => handleSelectTramite(item)}
                        className={`text-left w-full py-1.5 px-2 rounded transition-colors ${
                          selectedTramite?.id === item.id 
                            ? 'text-slate-900 font-bold bg-slate-50 border-l-2 border-slate-900' 
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        {item.tramite}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

            </div>

            {/* Quick reset navigation */}
            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={handleGoHome}
                className="text-[11px] text-slate-400 hover:text-slate-900 underline"
              >
                Volver al Inicio (Nivel 1)
              </button>
            </div>
          </aside>
        )}

        {/* RIGHT MAIN CONTENT: CARDS NAVIGATION UP TO 4TH LEVEL */}
        <main className="flex-1 p-8 md:p-14 space-y-8 bg-white">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
            <button onClick={handleGoHome} className="hover:text-slate-900">Inicio</button>
            {level >= 2 && (
              <>
                <span>/</span>
                <button onClick={() => { setLevel(2); setSelectedTramite(null); }} className="hover:text-slate-900">
                  {PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}
                </button>
              </>
            )}
            {level >= 3 && (
              <>
                <span>/</span>
                <button onClick={() => { setLevel(3); setSelectedTramite(null); }} className="hover:text-slate-900">
                  {selectedCategoria}
                </button>
              </>
            )}
            {level >= 4 && (
              <>
                <span>/</span>
                <span className="text-slate-800">{selectedSubcategoria}</span>
              </>
            )}
          </div>

          {/* ========================================================
              LEVEL 1: CARDS OF MACRO GROUPS (PILARES)
              ======================================================== */}
          {level === 1 && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nivel 1 de 4 · Macro Grupos</span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Seleccione un Grupo Tributario</h2>
                <p className="text-xs text-slate-500">Explore las categorías principales de trámites y requisitos fiscales.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PILLARS_CONFIG.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectPillar(p.id)}
                    className="p-6 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-900 transition-all cursor-pointer space-y-3 group"
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.desc}</p>
                    <div className="text-xs font-semibold text-slate-900 pt-1">Explorar pilar</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 2: CARDS OF CATEGORIES
              ======================================================== */}
          {level === 2 && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Nivel 2 de 4 · Categorías de {PILLARS_CONFIG.find(p => p.id === selectedPillar)?.name}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Seleccione una Categoría</h2>
                <p className="text-xs text-slate-500">El menú lateral puede abrirse con el botón superior para ver estas opciones.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoriasInPillar.map((cat, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectCategoria(cat)}
                    className="p-6 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-900 transition-all cursor-pointer space-y-3 group"
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700">{cat}</h3>
                    <p className="text-xs text-slate-500">Acceda a los submenús y requisitos oficiales de {cat}.</p>
                    <div className="text-xs font-semibold text-slate-900 pt-1">Ver subcategorías</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 3: CARDS OF SUBCATEGORIES
              ======================================================== */}
          {level === 3 && (
            <div className="space-y-8 max-w-4xl">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Nivel 3 de 4 · Subcategorías de {selectedCategoria}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Seleccione una Subcategoría</h2>
                <p className="text-xs text-slate-500">Al seleccionar una subcategoría se abrirá automáticamente el menú lateral en el 4º nivel.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subcategoriasInCategoria.map((sub, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSelectSubcategoria(sub)}
                    className="p-6 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-900 transition-all cursor-pointer space-y-3 group"
                  >
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-700">{sub}</h3>
                    <p className="text-xs text-slate-500">Trámites y normativas oficiales correspondientes a {sub}.</p>
                    <div className="text-xs font-semibold text-slate-900 pt-1">Acceder al 4º nivel</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              LEVEL 4: TRÁMITES & DETAIL (MENU OPENS AUTOMATICALLY HERE)
              ======================================================== */}
          {level === 4 && (
            <div className="space-y-8 max-w-3xl animate-fadeIn">
              
              {selectedTramite ? (
                <div className="space-y-8">
                  <div className="space-y-3 border-b border-slate-100 pb-6">
                    <div className="text-[11px] text-slate-400 font-mono">
                      Nivel 4 de 4 · Trámite Detallado
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                      {selectedTramite.tramite}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed font-normal">
                      {selectedTramite.descripcion}
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Sección SAT: {selectedTramite.seccion} · Confianza: <span className="text-slate-900 font-semibold">{selectedTramite.confianza}</span>
                    </div>
                  </div>

                  {/* "En esta página" quick jump */}
                  <div className="p-5 bg-slate-50/80 border border-slate-100 rounded-xl space-y-2">
                    <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">En esta página</h4>
                    <ul className="space-y-1 text-xs text-slate-600 font-medium">
                      <li><a href="#requisitos" className="hover:underline">Requisitos obligatorios</a></li>
                      <li><a href="#pasos" className="hover:underline">Pasos del trámite</a></li>
                      <li><a href="#enlace" className="hover:underline">Enlace oficial SAT</a></li>
                    </ul>
                  </div>

                  {/* Requisitos */}
                  {selectedTramite.requisitos && (
                    <div id="requisitos" className="space-y-3 pt-2">
                      <h3 className="text-lg font-bold text-slate-900">Requisitos obligatorios</h3>
                      <div className="space-y-2">
                        {selectedTramite.requisitos.map((req, idx) => (
                          <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg text-xs text-slate-700">
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pasos */}
                  {selectedTramite.pasos && (
                    <div id="pasos" className="space-y-3 pt-2">
                      <h3 className="text-lg font-bold text-slate-900">Pasos para realizar el trámite</h3>
                      <div className="space-y-2">
                        {selectedTramite.pasos.map((paso, idx) => (
                          <div key={idx} className="p-3 bg-slate-50/50 border border-slate-100 rounded-lg text-xs text-slate-700">
                            {idx + 1}. {paso}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enlace oficial */}
                  <div id="enlace" className="pt-4">
                    <a 
                      href={selectedTramite.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors inline-block"
                    >
                      Abrir Trámite Oficial en la SAT
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">Trámites en {selectedSubcategoria}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentSubcategoriaItems.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => handleSelectTramite(item)}
                        className="p-5 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-900 transition-all cursor-pointer space-y-2"
                      >
                        <h4 className="text-sm font-bold text-slate-900">{item.tramite}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.descripcion}</p>
                        <div className="text-xs font-semibold text-slate-900 pt-1">Ver trámite</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-100 py-8 px-8">
        <div className="max-w-7xl mx-auto text-center text-[11px] text-slate-400 font-normal">
          © 2026 Superintendencia de Administración Tributaria — SAT Guatemala
        </div>
      </footer>

    </div>
  );
}
