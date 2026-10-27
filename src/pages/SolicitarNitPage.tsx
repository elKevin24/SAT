import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  User,
  Briefcase,
  HeartHandshake,
  Globe,
  FileText,
  AlertCircle,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Info,
  Download,
  Search,
  Sparkles
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

interface SolicitarNitPageProps {
  onBackToHome: () => void;
  onOpenConsultasNIT?: () => void;
  onOpenProcesoGuiado?: () => void;
}

type ModalidadNitId =
  | 'sin_obligaciones'
  | 'con_obligaciones'
  | 'discapacidad_invalidez'
  | 'residente_extranjero';

interface RequisitoCiudadano {
  id: string;
  titulo: string;
  detalle: string;
  opciones?: string[];
}

interface ModalidadNitData {
  id: ModalidadNitId;
  nombreCorto: string;
  titulo: string;
  subtitulo: string;
  requisitos: RequisitoCiudadano[];
  pasosPreparacion: string[];
  consejoDomicilio: {
    sinAdjunto: string;
    conAdjunto: string;
  };
  comoFinaliza: string;
  resultadoObtenido: string;
  advertenciaDpi: string;
}

const MODALIDADES_CIUDADANAS: Record<ModalidadNitId, ModalidadNitData> = {
  sin_obligaciones: {
    id: 'sin_obligaciones',
    nombreCorto: 'Sin Obligaciones Tributarias',
    titulo: 'NIT para gestiones personales, laborales o bancarias',
    subtitulo: 'Para personas individuales que necesitan identificarse ante bancos, empleadores o estudios, sin emitir facturas ni inscribir un negocio.',
    requisitos: [
      {
        id: 'dpi',
        titulo: 'Documento Personal de Identificación (DPI) vigente',
        detalle: 'Escaneado o fotografiado de ambos lados de forma clara y legible (en formato PDF, JPG o PNG).',
      },
      {
        id: 'pasaporte',
        titulo: 'Pasaporte vigente (únicamente si eres extranjero)',
        detalle: 'Copia digital legible de la hoja de datos personales de tu pasaporte.',
      },
      {
        id: 'domicilio',
        titulo: 'Comprobante de domicilio reciente (máximo 3 meses de antigüedad)',
        detalle: 'Puedes utilizar cualquiera de los siguientes respaldos de tu dirección de residencia:',
        opciones: [
          'Factura de energía eléctrica, agua potable, teléfono de línea fija, internet residencial o cable.',
          'Recibo de agua potable o certificación municipal de residencia (no mayor a 3 meses).',
          'Recibo de pago del IUSI (del último trimestre o del año en curso si pagas por adelantado).',
        ],
      },
    ],
    pasosPreparacion: [
      'Ten a la mano un correo electrónico personal activo; allí recibirás el código de seguridad para iniciar tu solicitud.',
      'Verifica que las imágenes de tu DPI se lean con claridad en ambos lados antes de subirlas.',
    ],
    consejoDomicilio: {
      sinAdjunto:
        'Si eliges "Factura de Servicios" (luz, teléfono fijo, internet o cable), NO necesitas subir ningún archivo: el sistema solo te pedirá escribir el número de serie y documento de la factura.',
      conAdjunto:
        'Si eliges recibo de agua municipal, recibo de IUSI o certificación municipal de domicilio, sí deberás adjuntar el archivo digital en PDF, JPG o PNG.',
    },
    comoFinaliza:
      'Tu gestión se aprueba y finaliza 100% en línea (únicamente las personas extranjeras deben acudir a una agencia para validar su pasaporte).',
    resultadoObtenido:
      'Recibirás la confirmación en tu correo y podrás descargar tu Constancia de Inscripción en el Registro Tributario Unificado (RTU) directamente desde Agencia Virtual.',
    advertenciaDpi:
      'Tu DPI debe estar físico y vigente. No se acepta la constancia de solicitud o renovación emitida por el RENAP.',
  },

  con_obligaciones: {
    id: 'con_obligaciones',
    nombreCorto: 'Con Obligaciones Tributarias',
    titulo: 'NIT para iniciar un negocio, comercio o servicios profesionales',
    subtitulo: 'Para personas individuales que van a emitir facturas, abrir un establecimiento comercial o prestar servicios técnicos o profesionales.',
    requisitos: [
      {
        id: 'dpi_ob',
        titulo: 'Documento Personal de Identificación (DPI) vigente',
        detalle: 'Escaneado o fotografiado de ambos lados en formato PDF, JPG o PNG.',
      },
      {
        id: 'pasaporte_ob',
        titulo: 'Pasaporte vigente (si eres extranjero)',
        detalle: 'Copia digital legible de tu pasaporte vigente.',
      },
      {
        id: 'domicilio_ob',
        titulo: 'Comprobante de domicilio fiscal y comercial (máximo 3 meses)',
        detalle: 'Presenta uno de los siguientes documentos para respaldar tu ubicación:',
        opciones: [
          'Factura de energía eléctrica, agua potable, teléfono fijo o internet residencial.',
          'Recibo de IUSI reciente o del año en curso.',
          'Patente de comercio de empresa (cuando registres el domicilio comercial de tu negocio).',
        ],
      },
    ],
    pasosPreparacion: [
      'La solicitud debe realizarla personalmente el titular del negocio o actividad económica.',
      'Digitaliza tus documentos en formato PDF, JPG o PNG antes de abrir el formulario.',
    ],
    consejoDomicilio: {
      sinAdjunto:
        'Si seleccionas "Factura de Servicios" (energía eléctrica, teléfono fijo o internet), solo debes digitar la serie y número de la factura sin adjuntar archivo.',
      conAdjunto:
        'Si seleccionas "Otro tipo de documento" (recibo de agua, IUSI o patente de comercio), deberás subir el documento escaneado.',
    },
    comoFinaliza:
      'Si usas factura de servicios finaliza en línea. Si registras obligaciones seleccionando "otro tipo de documento", deberás presentar los originales en agencia mediante cita previa.',
    resultadoObtenido:
      'Obtendrás tu Constancia de Inscripción y Actualización de Datos en el RTU con tus obligaciones e impuestos afiliados.',
    advertenciaDpi:
      'Tu DPI debe estar físico y vigente. No se acepta la constancia de solicitud o renovación emitida por el RENAP.',
  },

  discapacidad_invalidez: {
    id: 'discapacidad_invalidez',
    nombreCorto: 'Discapacidad o Invalidez Física',
    titulo: 'NIT mediante representante para personas con discapacidad o invalidez física',
    subtitulo: 'Diseñado para ciudadanos cuya condición física les impide presentarse personalmente a una agencia tributaria.',
    requisitos: [
      {
        id: 'dpi_mandante',
        titulo: 'DPI vigente del solicitante (mandante)',
        detalle: 'Escaneado de ambos lados en formato PDF, JPG o PNG.',
      },
      {
        id: 'dpi_mandatario',
        titulo: 'DPI o Pasaporte vigente del representante (mandatario)',
        detalle: 'El representante debe contar con Agencia Virtual activa y sus propios datos actualizados en el RTU.',
      },
      {
        id: 'mandato',
        titulo: 'Testimonio de escritura pública de mandato vigente',
        detalle: 'Documento legal que acredita la representación para realizar la gestión.',
      },
      {
        id: 'domicilio_disc',
        titulo: 'Comprobante de domicilio (máximo 3 meses)',
        detalle: 'Factura de servicios básicos (luz, agua, teléfono o internet) o recibo de IUSI.',
      },
    ],
    pasosPreparacion: [
      'El representante legal debe tener su usuario de Agencia Virtual activo y sus datos al día.',
      'Dentro del formulario, en la pregunta "¿Quién finalizará la gestión?", selecciona la opción "Mandatario/Representante".',
    ],
    consejoDomicilio: {
      sinAdjunto:
        'Con "Factura de Servicios" solo necesitas ingresar la serie y el número de la factura.',
      conAdjunto:
        'Con recibo de agua, IUSI o certificación municipal de domicilio deberás adjuntar el archivo digitalizado.',
    },
    comoFinaliza:
      'La gestión finaliza en línea a través del representante acreditado (salvo personas extranjeras que requieren validación presencial).',
    resultadoObtenido:
      'Constancia de Datos del Registro Tributario Unificado (RTU) descargable desde Agencia Virtual.',
    advertenciaDpi:
      'Tanto el DPI del solicitante como el del representante deben estar físicos y vigentes. No se acepta constancia de renovación del RENAP.',
  },

  residente_extranjero: {
    id: 'residente_extranjero',
    nombreCorto: 'Guatemaltecos en el Extranjero',
    titulo: 'NIT para guatemaltecos residentes en el extranjero (Compra o alquiler de inmuebles)',
    subtitulo: 'Gestionado por medio de un mandatario en Guatemala para adquirir o arrendar bienes inmuebles en el país.',
    requisitos: [
      {
        id: 'dpi_mandante_ext',
        titulo: 'DPI vigente del ciudadano en el extranjero (mandante)',
        detalle: 'Escaneado de ambos lados en formato PDF, JPG o PNG.',
      },
      {
        id: 'dpi_mandatario_ext',
        titulo: 'DPI o Pasaporte vigente del mandatario en Guatemala',
        detalle: 'El mandatario debe contar con Agencia Virtual activa y datos actualizados en el RTU.',
      },
      {
        id: 'mandato_ext',
        titulo: 'Testimonio de escritura pública de mandato vigente',
        detalle: 'Debidamente inscrito en los registros legales correspondientes.',
      },
      {
        id: 'cert_propiedad',
        titulo: 'Certificación del Registro General de la Propiedad',
        detalle: 'Donde conste la ubicación geográfica del bien inmueble en Guatemala.',
      },
      {
        id: 'domicilio_ext',
        titulo: 'Comprobante de domicilio en Guatemala (máximo 3 meses)',
        detalle: 'Factura de servicios básicos o recibo del IUSI vigente.',
      },
    ],
    pasosPreparacion: [
      'El mandatario en Guatemala debe tener su Agencia Virtual habilitada y datos actualizados.',
      'En el formulario electrónico, selecciona que la gestión será finalizada por "Mandatario/Representante".',
    ],
    consejoDomicilio: {
      sinAdjunto:
        'Con "Factura de Servicios" basta con digitar la serie y el número de documento sin adjuntar archivo.',
      conAdjunto:
        'Con recibo de agua, IUSI o certificación municipal sí debes subir el documento escaneado.',
    },
    comoFinaliza:
      'Se gestiona y concluye por medio del mandatario designado en Guatemala.',
    resultadoObtenido:
      'Constancia de Inscripción y Actualización del RTU disponible para descarga en Agencia Virtual.',
    advertenciaDpi:
      'El DPI debe estar físico y vigente. No se acepta la constancia de solicitud o renovación emitida por el RENAP.',
  },
};

export const SolicitarNitPage: React.FC<SolicitarNitPageProps> = ({
  onBackToHome,
  onOpenConsultasNIT,
}) => {
  const [pasoActivo, setPasoActivo] = useState<1 | 2 | 3>(1);
  const [modalidadActiva, setModalidadActiva] = useState<ModalidadNitId>('sin_obligaciones');
  const [requisitosMarcados, setRequisitosMarcados] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pasoActivo]);

  const modData = MODALIDADES_CIUDADANAS[modalidadActiva];
  const totalReqs = modData.requisitos.length;
  const marcadosCount = modData.requisitos.filter((r) => requisitosMarcados[r.id]).length;

  const toggleReq = (id: string) => {
    setRequisitosMarcados((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="bg-slate-50/60 min-h-screen pt-3 pb-12 text-slate-800 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* 1. Miga de pan y botón de retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <Breadcrumbs
            includeHome
            onHomeClick={onBackToHome}
            items={[
              { label: 'Contribuyentes', onClick: onBackToHome },
              { label: 'Sin Obligaciones', onClick: onBackToHome },
              { label: 'Solicitar Número de Identificación Tributaria (NIT)', isCurrent: true },
            ]}
          />

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al catálogo</span>
          </button>
        </div>

        {/* 2. Encabezado Institucional */}
        <header className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-sky-300 bg-sky-950/80 border border-sky-700/60 px-3 py-1 rounded-full">
              Inscripción RTU Digital · Proceso Guiado en 3 Pasos
            </span>
            {onOpenConsultasNIT && (
              <button
                type="button"
                onClick={onOpenConsultasNIT}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>¿Ya tienes NIT y no lo recuerdas? Consúltalo con tu CUI</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Solicitar Número de Identificación Tributaria (NIT)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Revisa los documentos necesarios según tu caso, llena la solicitud electrónica en línea y programa tu cita únicamente si tu gestión requiere validación presencial.
          </p>
        </header>

        {/* 3. Navegador de los 3 Pasos Conectados */}
        <nav aria-label="Pasos para solicitar el NIT" className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <button
              type="button"
              onClick={() => setPasoActivo(1)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                pasoActivo === 1
                  ? 'bg-sky-700 text-white border-sky-800 shadow-xs ring-2 ring-sky-300'
                  : pasoActivo > 1
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                pasoActivo === 1 ? 'bg-white/20 text-white' : pasoActivo > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {pasoActivo > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div>
                <span className="text-[10px]  block">
                  Paso 1 · Preparación
                </span>
                <span className="font-bold text-xs sm:text-sm block leading-tight">
                  Requisitos
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPasoActivo(2)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                pasoActivo === 2
                  ? 'bg-sky-700 text-white border-sky-800 shadow-xs ring-2 ring-sky-300'
                  : pasoActivo > 2
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                pasoActivo === 2 ? 'bg-white/20 text-white' : pasoActivo > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {pasoActivo > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <div>
                <span className="text-[10px]  block">
                  Paso 2 · Formulario en Línea
                </span>
                <span className="font-bold text-xs sm:text-sm block leading-tight">
                  Solicitar Gestión
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPasoActivo(3)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                pasoActivo === 3
                  ? 'bg-sky-700 text-white border-sky-800 shadow-xs ring-2 ring-sky-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${
                pasoActivo === 3 ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                3
              </div>
              <div>
                <span className="text-[10px]  block">
                  Paso 3 · Cita Controlada
                </span>
                <span className="font-bold text-xs sm:text-sm block leading-tight">
                  Solicitar Cita
                </span>
              </div>
            </button>

          </div>
        </nav>

        {/* =====================================================================
            PASO 1: REQUISITOS Y RECOMENDACIONES EN LENGUAJE CIUDADANO
           ===================================================================== */}
        {pasoActivo === 1 && (
          <div className="space-y-6">

            {/* Selector de Modalidad */}
            <section aria-labelledby="modalidad-heading" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  ¿Para qué necesitas tu NIT?
                </span>
                <h2 id="modalidad-heading" className="text-base sm:text-lg font-bold text-slate-900">
                  Elige tu situación para ver únicamente los requisitos que te corresponden
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'sin_obligaciones',
                    label: 'Uso Personal o Laboral',
                    sub: 'Sin obligaciones tributarias ni facturación',
                    icon: User,
                  },
                  {
                    id: 'con_obligaciones',
                    label: 'Negocio o Profesión',
                    sub: 'Para facturar o abrir un comercio',
                    icon: Briefcase,
                  },
                  {
                    id: 'discapacidad_invalidez',
                    label: 'Discapacidad o Invalidez',
                    sub: 'Gestión por medio de representante',
                    icon: HeartHandshake,
                  },
                  {
                    id: 'residente_extranjero',
                    label: 'Guatemalteco en el Exterior',
                    sub: 'Compra o alquiler de inmuebles con mandatario',
                    icon: Globe,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = modalidadActiva === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setModalidadActiva(item.id as ModalidadNitId)}
                      className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-sky-700 bg-sky-50/70 shadow-2xs ring-1 ring-sky-600'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-sky-700' : 'text-slate-400'}`} />
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-700" />}
                      </div>
                      <span className="text-xs font-bold text-slate-900">{item.label}</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Lista de Documentos Requeridos */}
            <section aria-labelledby="requisitos-heading" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                    Documentos Necesarios
                  </span>
                  <h2 id="requisitos-heading" className="text-base sm:text-lg font-bold text-slate-900">
                    {modData.titulo}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{modData.subtitulo}</p>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-bold text-slate-800">
                    Listos: {marcadosCount} de {totalReqs}
                  </span>
                </div>
              </div>

              {/* Aviso Importante sobre el DPI */}
              <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Importante sobre tu identificación:</strong> {modData.advertenciaDpi}
                </span>
              </div>

              <div className="space-y-3">
                {modData.requisitos.map((req) => {
                  const isChecked = !!requisitosMarcados[req.id];
                  return (
                    <div
                      key={req.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isChecked ? 'bg-sky-50/60 border-sky-300' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          id={`req-${req.id}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleReq(req.id)}
                          className="mt-1 w-4 h-4 rounded text-sky-700 focus:ring-sky-600 border-slate-300 cursor-pointer"
                        />
                        <label htmlFor={`req-${req.id}`} className="text-xs cursor-pointer flex-1 space-y-1.5">
                          <span className="font-bold text-slate-900 block leading-snug">
                            {req.titulo}
                          </span>
                          <span className="text-slate-600 block leading-relaxed">
                            {req.detalle}
                          </span>

                          {req.opciones && req.opciones.length > 0 && (
                            <ul className="pl-5 pt-1 space-y-1 text-slate-700 list-disc">
                              {req.opciones.map((op, i) => (
                                <li key={i} className="text-xs leading-relaxed">
                                  {op}
                                </li>
                              ))}
                            </ul>
                          )}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Cómo presentar el comprobante de domicilio y qué obtendrás */}
            <section aria-labelledby="guia-domicilio-heading" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-sky-700" />
                <h2 id="guia-domicilio-heading" className="text-base sm:text-lg font-bold text-slate-900">
                  Recomendaciones antes de llenar el formulario
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Cuándo NO necesitas subir factura de domicilio</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {modData.consejoDomicilio.sinAdjunto}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <FileText className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>Cuándo SÍ debes adjuntar el comprobante</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {modData.consejoDomicilio.conAdjunto}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 text-xs text-sky-950 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-sky-900">
                    <Info className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>¿Cómo concluye tu solicitud?</span>
                  </span>
                  <p className="leading-relaxed">{modData.comoFinaliza}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold flex items-center gap-1.5 text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>¿Qué documento obtendrás?</span>
                  </span>
                  <p className="leading-relaxed">{modData.resultadoObtenido}</p>
                </div>
              </div>

              {/* Botón de conexión directa al Paso 2 */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Cuando tengas listos tus documentos, avanza al Paso 2 para llenar la solicitud en línea.
                </p>
                <button
                  type="button"
                  onClick={() => setPasoActivo(2)}
                  className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Ir al Paso 2: Solicitar Gestión</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>

          </div>
        )}

        {/* =====================================================================
            PASO 2: SOLICITAR GESTIÓN — IFRAME OFICIAL DEL RTU DIGITAL DE LA SAT
           ===================================================================== */}
        {pasoActivo === 2 && (
          <div className="space-y-5">

            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                    Paso 2 · Formulario Electrónico Oficial
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Solicitud Electrónica de NIT en Línea
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ingresa tu correo electrónico activo en el módulo de abajo para recibir el código de verificación e iniciar el llenado.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onOpenConsultasNIT && (
                    <button
                      type="button"
                      onClick={onOpenConsultasNIT}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-sky-700" />
                      <span>Consultar NIT con CUI (DPI)</span>
                    </button>
                  )}
                  <a
                    href="https://app.c.sat.gob.gt/rtu/formulario-inscripcion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Abrir aplicativo en pestaña completa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Contenedor del Iframe Oficial de Solicitud de NIT */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <iframe
                  src="https://app.c.sat.gob.gt/rtu/formulario-inscripcion"
                  title="Formulario Oficial de Solicitud Electrónica de NIT - SAT"
                  className="w-full h-[680px] border-0 bg-white"
                  loading="lazy"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPasoActivo(1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Regresar a Paso 1: Requisitos
                </button>

                <button
                  type="button"
                  onClick={() => setPasoActivo(3)}
                  className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Ir al Paso 3: Solicitar Cita</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>

          </div>
        )}

        {/* =====================================================================
            PASO 3: SOLICITAR CITA — IFRAME OFICIAL DE CITAS SAT
           ===================================================================== */}
        {pasoActivo === 3 && (
          <div className="space-y-5">

            <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                    Paso 3 · Cita Previa Controlada
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Programar Cita para Solicitud de NIT
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://portal.sat.gob.gt/portal/descarga/15389/cita-controlada/96248/manual-usuario-portal-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-700" />
                    <span>Descargar guía de citas (PDF)</span>
                  </a>
                  <a
                    href="https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Abrir módulo en pestaña completa</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>Exclusivo para finalizar Solicitud de NIT</span>
                  </p>
                  <p className="leading-relaxed">
                    Agenda aquí únicamente si ya enviaste el formulario del{' '}
                    <button
                      type="button"
                      onClick={() => setPasoActivo(2)}
                      className="font-bold text-sky-700 underline cursor-pointer"
                    >
                      Paso 2
                    </button>{' '}
                    y el sistema te indicó asistir a una agencia. Para cualquier otra gestión tributaria, las citas se programan desde Agencia Virtual.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Gestión personal e intransferible</span>
                  </p>
                  <p className="leading-relaxed">
                    La cita se registra con tu correo y número de solicitud. Haz buen uso de esta herramienta para evitar la anulación de tu gestión.
                  </p>
                </div>
              </div>

              {/* Contenedor del Iframe Oficial de Citas SAT */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                <iframe
                  src="https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal"
                  title="Sistema Oficial de Citas para Solicitud de NIT - SAT"
                  className="w-full h-[680px] border-0 bg-white"
                  loading="lazy"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-start">
                <button
                  type="button"
                  onClick={() => setPasoActivo(2)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Regresar a Paso 2: Solicitar Gestión
                </button>
              </div>
            </section>

          </div>
        )}

      </div>
    </div>
  );
};
