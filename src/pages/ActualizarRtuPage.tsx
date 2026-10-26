import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Calendar,
  ShieldCheck,
  UserCheck,
  Briefcase,
  Building2,
  Calculator,
  HelpCircle,
  Download,
  RefreshCw,
  Info,
  KeyRound,
  Search,
  Printer,
  Clock
} from 'lucide-react';

export type CasoActualizacionId =
  | 'domicilio_fiscal'
  | 'establecimiento_negocio'
  | 'afiliaciones_contador'
  | 'persona_juridica';

interface ActualizarRtuPageProps {
  onBackToHome: () => void;
  initialCaso?: CasoActualizacionId;
}

interface CasoOption {
  id: CasoActualizacionId;
  titulo: string;
  subtitulo: string;
  icon: React.ReactNode;
  badge: string;
  requisitos: {
    titulo: string;
    detalle: string;
    obligatorio: boolean;
  }[];
  notaEspecial?: string;
}

const CASOS_ACTUALIZACION: CasoOption[] = [
  {
    id: 'domicilio_fiscal',
    titulo: 'Datos Personales, Domicilio Fiscal o Ratificación Anual',
    subtitulo: 'Cambio de dirección de residencia, teléfono, correo electrónico, actividad económica personal o confirmación anual de datos.',
    icon: <UserCheck className="w-5 h-5" />,
    badge: 'Personas Individuales',
    requisitos: [
      {
        titulo: 'Documento Personal de Identificación (DPI) vigente de ambos lados',
        detalle: 'Escaneado o fotografiado de ambos lados de forma legible en formato PDF, JPG o PNG. Si eres extranjero, adjunta tu Pasaporte vigente.',
        obligatorio: true
      },
      {
        titulo: 'Comprobante de domicilio fiscal (con máximo 3 meses de emisión)',
        detalle: 'Factura de energía eléctrica, agua potable, teléfono de línea fija o internet residencial (solo digitas serie y número de factura). O bien recibo de agua potable o recibo de IUSI (del trimestre o año en curso) digitalizado.',
        obligatorio: true
      },
      {
        titulo: 'Usuario activo de Agencia Virtual SAT',
        detalle: 'Necesario para ingresar al menú Servicios › RTU › Actualizar Datos o confirmar la ratificación anual de datos.',
        obligatorio: true
      }
    ],
    notaEspecial: 'Si únicamente realizas la Ratificación o Confirmación Anual de Datos sin cambiar tu dirección fiscal, el sistema confirmará tus datos de forma inmediata dentro de Agencia Virtual sin requerir adjuntos adicionales.'
  },
  {
    id: 'establecimiento_negocio',
    titulo: 'Establecimiento Comercial, Negocio o Actividad Económica',
    subtitulo: 'Apertura, cambio de dirección comercial, cambio de nombre comercial o modificación de actividad económica de tu negocio.',
    icon: <Briefcase className="w-5 h-5" />,
    badge: 'Comercios y Negocios',
    requisitos: [
      {
        titulo: 'Documento Personal de Identificación (DPI) vigente o Pasaporte vigente',
        detalle: 'Del propietario o representante legal, digitalizado de ambos lados en formato PDF, JPG o PNG.',
        obligatorio: true
      },
      {
        titulo: 'Comprobante de domicilio comercial (máximo 3 meses de antigüedad)',
        detalle: 'Factura de servicios (energía eléctrica, agua potable, teléfono fijo o internet residencial) o recibo de agua / recibo de IUSI del local o inmueble donde opera el establecimiento.',
        obligatorio: true
      },
      {
        titulo: 'Patente de Comercio de Empresa (para comerciantes inscritos en Registro Mercantil)',
        detalle: 'Si tu negocio está inscrito como empresa mercantil, adjunta la patente de comercio con la dirección comercial actualizada.',
        obligatorio: false
      },
      {
        titulo: 'Resolución o certificación específica según el tipo de establecimiento',
        detalle: 'Centros educativos: Resolución del MINEDUC o Dirección Departamental. Zonas Francas / ZOLIC / Decreto 29-89 / Movilidad Eléctrica (Decreto 40-2022): Resolución del Ministerio correspondiente. Fincas o centros de operaciones: Certificación o solvencia municipal que indique la dirección.',
        obligatorio: false
      }
    ]
  },
  {
    id: 'afiliaciones_contador',
    titulo: 'Impuestos, Afiliaciones, Cambio de Régimen o Contador',
    subtitulo: 'Agregar o actualizar afiliaciones de impuestos (IVA, ISR, ISO), transición de régimen o nombramiento/cambio de Perito Contador.',
    icon: <Calculator className="w-5 h-5" />,
    badge: 'Obligaciones y Contador',
    requisitos: [
      {
        titulo: 'Usuario activo de Agencia Virtual y datos de identificación actualizados',
        detalle: 'Previo a modificar afiliaciones o nombrar contador, tu registro en el RTU Digital debe estar actualizado.',
        obligatorio: true
      },
      {
        titulo: 'Para nombrar o cambiar Perito Contador o Auditor',
        detalle: 'El Perito Contador o Contador Público y Auditor (CPA) debe poseer usuario de Agencia Virtual activo, tener sus propios datos actualizados en el RTU Digital y estar activo en el registro de contadores de la SAT. Él deberá autorizar su nombramiento desde su propia Agencia Virtual.',
        obligatorio: true
      },
      {
        titulo: 'DPI vigente y comprobante de domicilio (si el sistema solicita actualizar ficha integral)',
        detalle: 'En caso de que tu última actualización tenga más de un año, el sistema te pedirá confirmar tu domicilio fiscal vigente.',
        obligatorio: false
      }
    ],
    notaEspecial: 'Al solicitar el nombramiento o cambio de Perito Contador en Agencia Virtual, el contador seleccionado recibirá una notificación electrónica y deberá ingresar a su propia Agencia Virtual para confirmar la vinculación.'
  },
  {
    id: 'persona_juridica',
    titulo: 'Persona Jurídica (Sociedad, Empresa) o Ente Exento',
    subtitulo: 'Actualización de datos de sociedades mercantiles, nombramiento o cambio de Representante Legal, entidades no lucrativas o del Estado.',
    icon: <Building2 className="w-5 h-5" />,
    badge: 'Empresas y Entidades',
    requisitos: [
      {
        titulo: 'Agencia Virtual activa y RTU Digital actualizado para los 3 actores vinculados',
        detalle: 'Es requisito indispensable que la Entidad (Persona Jurídica), su Representante Legal y su Perito Contador registrado cuenten con usuario de Agencia Virtual activo y sus propios datos actualizados en el RTU Digital antes de iniciar la solicitud.',
        obligatorio: true
      },
      {
        titulo: 'DPI vigente de ambos lados (o Pasaporte vigente) del Representante Legal',
        detalle: 'Digitalizado de forma clara en formato PDF, JPG o PNG.',
        obligatorio: true
      },
      {
        titulo: 'Acta Notarial de Nombramiento vigente e inscrita',
        detalle: 'Con razón de inscripción en el Registro Mercantil General de la República, Registro de Personas Jurídicas (REPEJU) o entidad registral correspondiente cuando se actualice o renueve Representante Legal.',
        obligatorio: true
      },
      {
        titulo: 'Comprobante de domicilio fiscal y comercial (máximo 3 meses de emisión)',
        detalle: 'Factura de servicios (digitar serie y número) o recibo de IUSI / agua potable del inmueble donde se ubica la sede social.',
        obligatorio: true
      }
    ],
    notaEspecial: 'Si deseas cancelar tu nombramiento como Representante Legal por haber concluido tu relación laboral con la entidad, debes adjuntar el documento que acredite la terminación laboral o renuncia presentada.'
  }
];

export const ActualizarRtuPage: React.FC<ActualizarRtuPageProps> = ({
  onBackToHome,
  initialCaso = 'domicilio_fiscal'
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selectedCaso, setSelectedCaso] = useState<CasoActualizacionId>(initialCaso);
  const [step3SubTab, setStep3SubTab] = useState<'estado_gestion' | 'constancia_rtu' | 'cita_agencia'>('estado_gestion');
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    setSelectedCaso(initialCaso);
  }, [initialCaso]);

  const currentCaso = CASOS_ACTUALIZACION.find(c => c.id === selectedCaso) || CASOS_ACTUALIZACION[0];

  const handleGoToStep = (step: 1 | 2 | 3) => {
    setActiveStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Encabezado Institucional Unificado */}
      <div className="bg-gradient-to-r from-[#00264d] via-[#003876] to-[#0b4c8c] text-white border-b-4 border-sky-400">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-sky-300" />
                Gestión Conectada en 3 Pasos · RTU Digital SAT
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Actualizar o Ratificar Datos en el RTU Digital
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-blue-100 leading-relaxed">
                Actualiza tu dirección fiscal, datos de identificación, establecimientos comerciales, afiliaciones de impuestos, contador o representante legal y descarga tu Constancia de RTU actualizada.
              </p>
            </div>

            {/* Indicador resumen de tiempo y costo */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-4 flex flex-col gap-2 min-w-[240px]">
              <div className="flex items-center justify-between text-xs text-blue-100">
                <span>Costo de la gestión:</span>
                <span className="font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">100% Gratuito</span>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-100">
                <span>Plazo legal (Art. 94):</span>
                <span className="font-semibold text-amber-300">30 días hábiles</span>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-100">
                <span>Modalidad:</span>
                <span className="font-semibold text-white">En línea (Agencia Virtual)</span>
              </div>
            </div>
          </div>

          {/* Barra de 3 Pasos Conectados (Stepper) */}
          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-3" role="tablist" aria-label="Pasos para actualizar datos en el RTU Digital">
            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 1}
              onClick={() => handleGoToStep(1)}
              className={`group text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                activeStep === 1
                  ? 'bg-white text-slate-900 border-white shadow-lg ring-2 ring-sky-300'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-base shrink-0 ${
                  activeStep === 1
                    ? 'bg-blue-900 text-white'
                    : 'bg-white/15 text-sky-200'
                }`}
              >
                1
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${activeStep === 1 ? 'text-blue-700' : 'text-sky-200'}`}>
                  Paso 1 · Preparación
                </div>
                <div className="font-bold text-sm sm:text-base truncate">
                  1. Requisitos según tu caso
                </div>
              </div>
              <FileText className={`w-5 h-5 shrink-0 ${activeStep === 1 ? 'text-blue-800' : 'text-white/60'}`} />
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 2}
              onClick={() => handleGoToStep(2)}
              className={`group text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                activeStep === 2
                  ? 'bg-white text-slate-900 border-white shadow-lg ring-2 ring-sky-300'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-base shrink-0 ${
                  activeStep === 2
                    ? 'bg-blue-900 text-white'
                    : 'bg-white/15 text-sky-200'
                }`}
              >
                2
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${activeStep === 2 ? 'text-blue-700' : 'text-sky-200'}`}>
                  Paso 2 · Agencia Virtual
                </div>
                <div className="font-bold text-sm sm:text-base truncate">
                  2. Realizar Actualización
                </div>
              </div>
              <KeyRound className={`w-5 h-5 shrink-0 ${activeStep === 2 ? 'text-blue-800' : 'text-white/60'}`} />
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeStep === 3}
              onClick={() => handleGoToStep(3)}
              className={`group text-left p-4 rounded-xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                activeStep === 3
                  ? 'bg-white text-slate-900 border-white shadow-lg ring-2 ring-sky-300'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-base shrink-0 ${
                  activeStep === 3
                    ? 'bg-blue-900 text-white'
                    : 'bg-white/15 text-sky-200'
                }`}
              >
                3
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${activeStep === 3 ? 'text-blue-700' : 'text-sky-200'}`}>
                  Paso 3 · Aplicativos Oficiales
                </div>
                <div className="font-bold text-sm sm:text-base truncate">
                  3. Estado, Constancia y Cita
                </div>
              </div>
              <Search className={`w-5 h-5 shrink-0 ${activeStep === 3 ? 'text-blue-800' : 'text-white/60'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Dinámico por Paso */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-8">
        {/* =====================================================================
            PASO 1: REQUISITOS SEGÚN TU CASO (TEXTO NATIVO REDISEÑADO)
           ===================================================================== */}
        {activeStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Alerta crítica sobre plazo legal Art. 94 y documento vigente */}
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-5 shadow-xs flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-sm text-amber-950 leading-relaxed">
                <h2 className="font-bold text-amber-900 text-base mb-1">
                  Plazo legal de 30 días hábiles y requisitos de identificación
                </h2>
                <p>
                  De acuerdo con el <strong>Artículo 94 del Código Tributario (Decreto 6-91)</strong>, a partir de la fecha en que realices cualquier modificación en tus datos registrales o cambies de dirección fiscal o comercial, cuentas con un plazo de <strong>treinta (30) días hábiles</strong> para actualizar tu información en la SAT sin sanciones. Tu <strong>DPI debe estar físico y vigente</strong> (no se acepta la constancia de solicitud o renovación emitida por el RENAP).
                </p>
              </div>
            </div>

            {/* Selector de Caso de Actualización */}
            <section aria-labelledby="selecciona-caso-heading">
              <div className="mb-4">
                <h2 id="selecciona-caso-heading" className="text-xl font-bold text-slate-900">
                  ¿Qué información necesitas actualizar en tu RTU Digital?
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Selecciona tu caso para ver únicamente los documentos que te corresponden antes de ingresar a Agencia Virtual:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {CASOS_ACTUALIZACION.map((m) => {
                  const isSelected = m.id === selectedCaso;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedCaso(m.id)}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-400'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-white/15 text-sky-200' : 'bg-blue-50 text-blue-800'
                            }`}
                          >
                            {m.icon}
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              isSelected ? 'bg-sky-400/20 text-sky-200' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {m.badge}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm leading-snug mb-1.5">{m.titulo}</h3>
                        <p className={`text-xs leading-relaxed ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                          {m.subtitulo}
                        </p>
                      </div>

                      <div className={`mt-4 pt-2.5 border-t text-xs font-bold flex items-center justify-between ${
                        isSelected ? 'border-white/15 text-sky-200' : 'border-slate-100 text-blue-700'
                      }`}>
                        <span>{isSelected ? 'Caso seleccionado' : 'Ver requisitos'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Detalle de Requisitos del Caso Seleccionado */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                    {currentCaso.icon}
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-sky-300 font-bold block">
                      Documentos requeridos (Formatos aceptados: PDF, JPG o PNG)
                    </span>
                    <h3 className="text-lg font-bold text-white">{currentCaso.titulo}</h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleGoToStep(2)}
                  className="bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Ya tengo mis requisitos · Ir al Paso 2</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentCaso.requisitos.map((req, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{req.titulo}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              req.obligatorio
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {req.obligatorio ? 'Obligatorio' : 'Según el caso'}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed">{req.detalle}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {currentCaso.notaEspecial && (
                  <div className="bg-blue-50/90 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-blue-950">
                    <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">Nota operativa importante:</span>
                      {currentCaso.notaEspecial}
                    </div>
                  </div>
                )}

                {/* Reglas Oficiales sobre el Comprobante de Domicilio */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-700" />
                    Regla oficial sobre el Comprobante de Domicilio Fiscal o Comercial
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
                      <div className="font-bold text-emerald-950 text-sm mb-1.5 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ¿Cuándo NO necesitas adjuntar el archivo de la factura?
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        Si en el campo <em>"Tipo de documento comprobante de domicilio"</em> seleccionas la opción <strong>"Factura de Servicios"</strong> (energía eléctrica, agua potable, teléfono de línea fija o internet residencial con máximo 3 meses de emisión), <strong>únicamente debes digitar la serie y el número de documento de la factura</strong>. No necesitas subir ningún archivo PDF ni fotografía de la factura, y tu actualización se procesa 100% en línea.
                      </p>
                    </div>

                    <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                      <div className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-800 shrink-0" />
                        ¿Cuándo SÍ debes adjuntar comprobante digital (JPG, PDF o PNG)?
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed mb-2">
                        Si seleccionas <strong>Recibo de agua potable</strong>, <strong>Recibo de IUSI</strong> (no mayor a 3 meses o del año en curso) o <strong>Certificación/Solvencia municipal</strong> (para fincas o centros de operaciones), debes adjuntar el archivo digitalizado.
                      </p>
                      <p className="text-[11px] text-amber-900 bg-amber-100/80 border border-amber-200 rounded-lg px-2.5 py-1.5 font-medium">
                        <strong>Importante:</strong> Los contribuyentes con obligaciones activas (establecimientos y afiliación al IVA en estado activo) que elijan "otro tipo de documento" distinto a Factura de Servicios deberán finalizar su gestión de forma presencial en Agencia Tributaria (puedes programar tu cita en el Paso 3).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botón de avance al Paso 2 */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    ¿Listo para actualizar? Continúa al Paso 2 para seguir la ruta exacta dentro de Agencia Virtual.
                  </div>
                  <button
                    type="button"
                    onClick={() => handleGoToStep(2)}
                    className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-6 py-3 rounded-xl inline-flex items-center gap-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Continuar al Paso 2: Realizar Actualización</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            PASO 2: REALIZAR ACTUALIZACIÓN EN AGENCIA VIRTUAL + MANUALES PDF
           ===================================================================== */}
        {activeStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    Paso 2 de 3 · Plataforma Transaccional Segura SAT
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Realiza tu actualización o ratificación dentro de Agencia Virtual
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Por seguridad tributaria, la modificación de datos del RTU Digital requiere iniciar sesión con tu NIT y contraseña de Agencia Virtual.
                  </p>
                </div>

                <a
                  href="https://farm3.sat.gob.gt/menu/login.jsf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm px-5 py-3 rounded-xl inline-flex items-center gap-2 transition-all shadow-sm"
                >
                  <KeyRound className="w-4 h-4 text-sky-300" />
                  <span>Ingresar a Agencia Virtual SAT</span>
                  <ExternalLink className="w-4 h-4 ml-0.5" />
                </a>
              </div>

              {/* Ruta operativa paso a paso dentro de Agencia Virtual */}
              <div className="mt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Ruta paso a paso dentro de Agencia Virtual
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                      1
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Inicia sesión con tu usuario</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Ingresa a <strong>Agencia Virtual</strong> con tu NIT y contraseña. En el menú principal selecciona <strong>Servicios › RTU › Actualizar Datos</strong> (o <em>Ratificación de Datos</em>).
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                      2
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Modifica las secciones necesarias</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Actualiza tus datos de identificación, ubicación (domicilio fiscal), actividad económica, establecimientos comerciales, afiliaciones o contador según tu caso.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                      3
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Ingresa tu comprobante y DPI</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Adjunta tu DPI vigente de ambos lados. En domicilio, elige <strong>"Factura de Servicios"</strong> para digitar solo serie y número de factura sin subir archivo.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-blue-900 text-white text-xs font-bold flex items-center justify-center mb-2.5">
                      4
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Envía la solicitud y descarga tu RTU</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Al enviar la gestión recibirás confirmación por correo electrónico. Luego pasa al <strong>Paso 3</strong> en esta misma página para consultar el estado o imprimir tu Constancia de RTU.
                    </p>
                  </div>
                </div>
              </div>

              {/* Manuales Oficiales Descargables y Ayuda de Acceso */}
              <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-700" />
                    Manuales oficiales paso a paso (PDF)
                  </h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Consulta las guías ilustradas oficiales de la SAT si deseas ver capturas de pantalla de cada campo:
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href="https://portal.sat.gob.gt/portal/descarga/14366/rtu-digital/43540/actualizacion-rtu-digital.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-white hover:bg-blue-100 border border-blue-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-700" />
                      <span>Guía de Actualización RTU Digital (PDF)</span>
                    </a>
                    <a
                      href="https://portal.sat.gob.gt/portal/descarga/14366/rtu-digital/80676/manual-comprobante-de-domicilio-actualizacion-2.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-white hover:bg-blue-100 border border-blue-300 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-700" />
                      <span>Manual de Comprobante de Domicilio (PDF)</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-700" />
                    ¿No tienes Agencia Virtual o no recuerdas tu contraseña?
                  </h4>
                  <p className="text-xs text-slate-600 mb-3">
                    Si aún no cuentas con usuario activo o cambiaste tu correo electrónico, realiza primero una de estas gestiones de acceso:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href="https://portal.sat.gob.gt/portal/solicitud-usuario-agencia-virtual/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg"
                    >
                      <span>Solicitar usuario de Agencia Virtual</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://portal.sat.gob.gt/portal/recuperacion-contrasena/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg"
                    >
                      <span>Recuperar contraseña</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href="https://portal.sat.gob.gt/portal/cambio-de-correo-electronico-de-agencia-virtual/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg"
                    >
                      <span>Cambiar correo de Agencia Virtual</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Barra inferior para pasar al Paso 3 */}
              <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleGoToStep(1)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer"
                >
                  ← Volver a Requisitos (Paso 1)
                </button>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-slate-600">
                    ¿Ya enviaste tu actualización en Agencia Virtual?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGoToStep(3)}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Ir al Paso 3: Consultar Estado, Constancia o Cita</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            PASO 3: CONSULTAR ESTADO, IMPRIMIR CONSTANCIA DE RTU O AGENDAR CITA
            (3 IFRAMES OFICIALES DE LA SAT INTEGRADOS)
           ===================================================================== */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1">
                    Paso 3 de 3 · Aplicativos Oficiales Integrados
                  </span>
                  <h2 className="text-xl font-bold text-slate-900">
                    Consulta el estado de tu gestión, imprime tu Constancia de RTU o agenda cita
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    Selecciona la herramienta oficial que necesitas utilizar sin salir de esta página:
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIframeKey(prev => prev + 1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recargar aplicativo</span>
                </button>
              </div>

              {/* Sub-pestañas para alternar entre los 3 aplicativos oficiales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => setStep3SubTab('estado_gestion')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    step3SubTab === 'estado_gestion'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50/40'
                  }`}
                >
                  <Search className={`w-5 h-5 shrink-0 ${step3SubTab === 'estado_gestion' ? 'text-sky-300' : 'text-blue-800'}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">3.1 Consultar Estado de Gestión</div>
                    <div className={`text-[11px] ${step3SubTab === 'estado_gestion' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Verifica si tu solicitud en el RTU ya fue aprobada
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStep3SubTab('constancia_rtu')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    step3SubTab === 'constancia_rtu'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50/40'
                  }`}
                >
                  <Printer className={`w-5 h-5 shrink-0 ${step3SubTab === 'constancia_rtu' ? 'text-sky-300' : 'text-blue-800'}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">3.2 Imprimir Constancia de RTU</div>
                    <div className={`text-[11px] ${step3SubTab === 'constancia_rtu' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Descarga tu constancia con código QR o ID de impresión
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStep3SubTab('cita_agencia')}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    step3SubTab === 'cita_agencia'
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-blue-50/40'
                  }`}
                >
                  <Calendar className={`w-5 h-5 shrink-0 ${step3SubTab === 'cita_agencia' ? 'text-sky-300' : 'text-blue-800'}`} />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">3.3 Solicitar Cita Presencial</div>
                    <div className={`text-[11px] ${step3SubTab === 'cita_agencia' ? 'text-blue-100' : 'text-slate-500'}`}>
                      Solo si el sistema indicó finalizar en Agencia Tributaria
                    </div>
                  </div>
                </button>
              </div>

              {/* Iframe 3.1: Consulta Estado de Gestión RTU Digital */}
              {step3SubTab === 'estado_gestion' && (
                <div className="rounded-xl border border-slate-300 overflow-hidden bg-white">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="font-bold">Aplicativo Oficial SAT:</span>
                      <span className="text-slate-300 font-mono">https://cdn.c.sat.gob.gt/rtu/consulta-gestion</span>
                    </div>
                    <a
                      href="https://cdn.c.sat.gob.gt/rtu/consulta-gestion"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-300 hover:text-sky-200 font-semibold inline-flex items-center gap-1 underline"
                    >
                      <span>Abrir en ventana completa</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <iframe
                    key={`estado-${iframeKey}`}
                    src="https://cdn.c.sat.gob.gt/rtu/consulta-gestion"
                    title="Consulta de Estado de Gestión de RTU Digital — SAT Guatemala"
                    className="w-full h-[680px] border-0 bg-white"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Iframe 3.2: Imprimir Constancia de RTU */}
              {step3SubTab === 'constancia_rtu' && (
                <div className="rounded-xl border border-slate-300 overflow-hidden bg-white">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="font-bold">Aplicativo Oficial SAT:</span>
                      <span className="text-slate-300 font-mono">https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal</span>
                    </div>
                    <a
                      href="https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-300 hover:text-sky-200 font-semibold inline-flex items-center gap-1 underline"
                    >
                      <span>Abrir en ventana completa</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <iframe
                    key={`constancia-${iframeKey}`}
                    src="https://cdn.c.sat.gob.gt/rtu/constancia-rtu-portal"
                    title="Impresión de Constancia de Inscripción y Actualización en el RTU — SAT Guatemala"
                    className="w-full h-[680px] border-0 bg-white"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Iframe 3.3: Solicitar Cita Presencial */}
              {step3SubTab === 'cita_agencia' && (
                <div className="rounded-xl border border-slate-300 overflow-hidden bg-white">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="font-bold">Aplicativo Oficial SAT:</span>
                      <span className="text-slate-300 font-mono">https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://portal.sat.gob.gt/portal/descarga/15389/cita-controlada/96248/manual-usuario-portal-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 font-semibold inline-flex items-center gap-1 underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Manual de Cita (PDF)</span>
                      </a>
                      <a
                        href="https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-300 hover:text-sky-200 font-semibold inline-flex items-center gap-1 underline"
                      >
                        <span>Abrir en ventana completa</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <iframe
                    key={`cita-${iframeKey}`}
                    src="https://cdn.c.sat.gob.gt/cita-validada/cita-validada-portal/portal"
                    title="Sistema Oficial de Cita Validada — SAT Guatemala"
                    className="w-full h-[760px] border-0 bg-white"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Pie de navegación entre pasos */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleGoToStep(2)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 bg-white cursor-pointer"
                >
                  ← Volver al Paso 2 (Agencia Virtual)
                </button>
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="text-xs font-bold text-blue-800 hover:text-blue-950 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50/50 cursor-pointer"
                >
                  Volver al catálogo de gestiones
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
