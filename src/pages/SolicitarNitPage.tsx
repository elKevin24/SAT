import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Users, 
  Baby, 
  Globe, 
  FileText, 
  Clock, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface SolicitarNitPageProps {
  onBackToHome: () => void;
  onOpenConsultasNIT?: () => void;
  onOpenProcesoGuiado?: () => void;
}

type PerfilSolicitante = 'individual' | 'menor' | 'extranjero' | 'juridica';

interface RequisitoPerfil {
  id: string;
  nombre: string;
  detalle: string;
  obligatorio: boolean;
}

const REQUISITOS_POR_PERFIL: Record<PerfilSolicitante, { titulo: string; descripcion: string; requisitos: RequisitoPerfil[] }> = {
  individual: {
    titulo: 'Persona Individual (Mayor de edad nacional)',
    descripcion: 'Para ciudadanos guatemaltecos mayores de 18 años con Documento Personal de Identificación (DPI).',
    requisitos: [
      { id: 'dpi', nombre: 'Documento Personal de Identificación (DPI)', detalle: 'DPI original escaneado de ambos lados, vigente y legible emitido por RENAP.', obligatorio: true },
      { id: 'correo', nombre: 'Correo electrónico personal activo', detalle: 'Dirección de correo a la que tengas acceso inmediato; allí recibirás el código de confirmación y tu NIT.', obligatorio: true },
      { id: 'factura_servicios', nombre: 'Comprobante de domicilio (Agua, Luz o Teléfono)', detalle: 'Recibo reciente (no mayor a 3 meses) que coincida con tu dirección física de residencia.', obligatorio: true },
      { id: 'foto', nombre: 'Fotografía reciente tipo selfie/cédula', detalle: 'Fotografía nítida sosteniendo tu DPI para la validación biométrica digital.', obligatorio: false }
    ]
  },
  menor: {
    titulo: 'Menor de Edad (Nacional)',
    descripcion: 'Inscripción gestionada a través de padres en ejercicio de patria potestad o tutor legal.',
    requisitos: [
      { id: 'cert_nacimiento', nombre: 'Certificado de Nacimiento del menor', detalle: 'Emitido por RENAP con Código Único de Identificación (CUI), no mayor a 6 meses de emisión.', obligatorio: true },
      { id: 'dpi_padres', nombre: 'DPI de los padres o tutor legal', detalle: 'DPI vigente escaneado de ambos lados del padre, madre o tutor con representación legal comprobada.', obligatorio: true },
      { id: 'tutor_doc', nombre: 'Documento de Tutela Legal (si aplica)', detalle: 'Certificación judicial en caso de menores bajo tutela declarada legalmente.', obligatorio: false },
      { id: 'correo_rep', nombre: 'Correo electrónico del representante', detalle: 'Cuenta de correo del tutor donde se recibirán las notificaciones tributarias del menor.', obligatorio: true }
    ]
  },
  extranjero: {
    titulo: 'Extranjero (Residente o No Residente)',
    descripcion: 'Para personas de otra nacionalidad que realizan actividades civiles, laborales o mercantiles en el país.',
    requisitos: [
      { id: 'pasaporte', nombre: 'Pasaporte vigente original', detalle: 'Copia completa escaneada de las hojas con datos de identificación y visa o sello de ingreso.', obligatorio: true },
      { id: 'residencia', nombre: 'Constancia de Residencia en Guatemala (si aplica)', detalle: 'Emitida por el Instituto Guatemalteco de Migración para residentes temporales o permanentes.', obligatorio: false },
      { id: 'mandatario', nombre: 'Nombramiento de Mandatario Legal (no residentes)', detalle: 'Testimonio de escritura pública de mandato con representación debidamente registrado.', obligatorio: false },
      { id: 'correo_ext', nombre: 'Correo electrónico personal', detalle: 'Bandeja activa para notificaciones oficiales de la SAT.', obligatorio: true }
    ]
  },
  juridica: {
    titulo: 'Persona Jurídica (Empresas y Sociedades)',
    descripcion: 'Para sociedades mercantiles, ONGs, entidades religiosas o colectividades constituidas.',
    requisitos: [
      { id: 'escritura', nombre: 'Testimonio de Escritura de Constitución', detalle: 'Inscrita debidamente en el Registro Mercantil o registro público respectivo.', obligatorio: true },
      { id: 'rep_legal', nombre: 'Nombramiento del Representante Legal', detalle: 'Vigente e inscrito en el Registro Mercantil, con DPI/pasaporte del representante.', obligatorio: true },
      { id: 'nit_socios', nombre: 'NIT y RTU actualizado de socios y representante', detalle: 'El representante legal y socios fundadores deben tener NIT activo y sin omisos tributarios.', obligatorio: true },
      { id: 'factura_empresa', nombre: 'Comprobante de domicilio fiscal', detalle: 'Recibo de servicios a nombre de la sociedad o contrato de arrendamiento del inmueble.', obligatorio: true }
    ]
  }
};

export const SolicitarNitPage: React.FC<SolicitarNitPageProps> = ({
  onBackToHome,
  onOpenConsultasNIT,
  onOpenProcesoGuiado
}) => {
  const [perfilActivo, setPerfilActivo] = useState<PerfilSolicitante>('individual');
  const [requisitosCompletados, setRequisitosCompletados] = useState<Record<string, boolean>>({});
  
  // Estado para el verificador de solicitud
  const [numSolicitud, setNumSolicitud] = useState('');
  const [estadoSolicitud, setEstadoSolicitud] = useState<{
    tipo: 'encontrado' | 'error' | null;
    mensaje?: string;
    detalle?: string;
    fecha?: string;
  }>({ tipo: null });

  const perfilData = REQUISITOS_POR_PERFIL[perfilActivo];

  const handleToggleRequisito = (id: string) => {
    setRequisitosCompletados(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleConsultarSolicitud = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = numSolicitud.trim();
    if (!cleanNum) return;

    if (cleanNum.length < 5) {
      setEstadoSolicitud({
        tipo: 'error',
        mensaje: 'Número de solicitud no válido',
        detalle: 'El número de solicitud emitido por el RTU Digital debe contener al menos 6 dígitos numéricos.'
      });
      return;
    }

    // Demostración interactiva ciudadana
    setEstadoSolicitud({
      tipo: 'encontrado',
      mensaje: `Solicitud #${cleanNum} en proceso de validación registral`,
      detalle: 'Tus documentos fueron recibidos correctamente en el portal RTU Digital. Un operador de la SAT está revisando la concordancia de tu DPI con RENAP.',
      fecha: 'Tiempo estimado de respuesta: 24 a 48 horas hábiles.'
    });
  };

  const totalRequisitos = perfilData.requisitos.length;
  const completadosCount = perfilData.requisitos.filter(r => requisitosCompletados[r.id]).length;
  const progresoPorcentaje = Math.round((completadosCount / totalRequisitos) * 100);

  return (
    <div className="bg-sat-fondo-tenue min-h-screen pt-3 pb-12 text-sat-texto antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Miga de pan y control de retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sat-gris">
          <Breadcrumbs
            items={[
              { label: 'Gestiones', onClick: onBackToHome },
              { label: 'Inscripción Tributaria', onClick: onBackToHome },
              { label: 'Solicitar NIT', isCurrent: true }
            ]}
            onHomeClick={onBackToHome}
          />

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sat-azul hover:text-sat-azul-oscuro transition-colors py-1.5 px-3 rounded-sat-sm hover:bg-sat-fondo-medio focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul min-h-[32px] self-start sm:self-auto"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* 2. Hero Principal */}
        <header className="bg-sat-blanco rounded-xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-black text-sat-azul-oscuro tracking-tight leading-tight">
              Solicitar NIT
            </h1>
            <p className="text-sm font-bold text-sat-azul uppercase tracking-wide">
              Número de Identificación Tributaria
            </p>
            <p className="text-sm sm:text-base text-sat-texto-suave leading-relaxed">
              El NIT es tu identificación oficial ante la SAT para actos civiles, contratos laborales, apertura de cuentas bancarias, emitir facturas o inscribir un negocio. La gestión es 100% gratuita y en línea.
            </p>
          </div>
        </header>

        {/* 3. Selector de Perfil del Solicitante */}
        <section aria-labelledby="perfil-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-6 shadow-sat-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sat-gris pb-3">
            <div>
              <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                Paso Previo Indispensable
              </span>
              <h2 id="perfil-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                ¿A nombre de quién solicitas el NIT?
              </h2>
            </div>
            <span className="text-xs text-sat-texto-suave">
              Selecciona tu tipo de personería para ver los requisitos exactos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'individual', label: 'Persona Individual', sub: 'Mayor de 18 años con DPI', icon: User },
              { id: 'menor', label: 'Menor de Edad', sub: 'Con CUI y tutor legal', icon: Baby },
              { id: 'extranjero', label: 'Extranjero', sub: 'Con Pasaporte vigente', icon: Globe },
              { id: 'juridica', label: 'Persona Jurídica', sub: 'Sociedades, ONGs o Empresas', icon: Users },
            ].map(perfil => {
              const Icon = perfil.icon;
              const isSelected = perfilActivo === perfil.id;
              return (
                <button
                  key={perfil.id}
                  type="button"
                  onClick={() => setPerfilActivo(perfil.id as PerfilSolicitante)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul min-h-[90px] ${
                    isSelected 
                      ? 'border-sat-azul bg-sat-azul/5 shadow-sat-sm ring-1 ring-sat-azul' 
                      : 'border-sat-gris hover:border-sat-azul-medio hover:bg-sat-fondo-tenue'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-sat-azul' : 'text-sat-texto-suave'}`} />
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-sat-azul" />}
                  </div>
                  <span className="text-sm font-bold text-sat-azul-oscuro">{perfil.label}</span>
                  <span className="text-xs text-sat-texto-suave leading-snug">{perfil.sub}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Checklist Interactivo de Requisitos */}
        <section aria-labelledby="requisitos-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-6 shadow-sat-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sat-gris pb-3">
            <div>
              <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                Verificación de Documentos
              </span>
              <h2 id="requisitos-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                Requisitos obligatorios para: {perfilData.titulo}
              </h2>
              <p className="text-xs text-sat-texto-suave mt-0.5">
                {perfilData.descripcion}
              </p>
            </div>

            {/* Barra de Progreso de Documentación */}
            <div className="flex items-center gap-3 bg-sat-fondo-tenue px-3 py-1.5 rounded-lg border border-sat-gris self-start sm:self-auto">
              <span className="text-xs font-bold text-sat-azul-oscuro">
                Listo: {completadosCount} de {totalRequisitos}
              </span>
              <div className="w-24 bg-sat-gris rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-sat-azul h-full transition-all duration-300"
                  style={{ width: `${progresoPorcentaje}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {perfilData.requisitos.map(req => {
              const isChecked = !!requisitosCompletados[req.id];
              return (
                <label
                  key={req.id}
                  htmlFor={`req-check-${req.id}`}
                  aria-label={`${req.nombre}: ${req.detalle}`}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isChecked 
                      ? 'border-sat-azul/40 bg-sat-azul/5' 
                      : 'border-sat-gris hover:bg-sat-fondo-tenue'
                  }`}
                >
                  <input
                    id={`req-check-${req.id}`}
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleRequisito(req.id)}
                    className="mt-0.5 w-4 h-4 rounded text-sat-azul focus:ring-sat-azul border-sat-gris cursor-pointer"
                  />
                  <span className="space-y-0.5 text-left cursor-pointer flex-1 block">
                    <span className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isChecked ? 'text-sat-azul-oscuro' : 'text-sat-texto'}`}>
                        {req.nombre}
                      </span>
                      {req.obligatorio && (
                        <span className="text-[10px] uppercase font-bold text-sat-azul bg-sat-azul/10 px-1.5 py-0.2 rounded">
                          Obligatorio
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-sat-texto-suave leading-relaxed block">
                      {req.detalle}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>

          {progresoPorcentaje === 100 ? (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span><strong>¡Excelente!</strong> Tienes todos los requisitos listos. Ahora puedes proceder al <strong>Paso 2</strong> para llenar tu solicitud electrónica.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-sat-fondo-tenue border border-sat-gris text-sat-texto-suave text-xs">
              <AlertCircle className="w-4 h-4 text-sat-azul flex-shrink-0" />
              <span>Marca los documentos que ya tienes listos para asegurar que no te rechacen tu solicitud en línea.</span>
            </div>
          )}
        </section>

        {/* 5. El Recorrido Oficial en 3 Pasos */}
        <section aria-labelledby="pasos-heading" className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Flujo Oficial de Gestión
            </span>
            <h2 id="pasos-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
              Cómo obtener tu NIT en 3 pasos
            </h2>
            <p className="text-xs sm:text-sm text-sat-texto-suave">
              Sigue la secuencia lógica: prepara los documentos, ingresa la solicitud electrónica y asegura la confirmación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Paso 1: Requisitos de Inscripción */}
            <Card
              title="1. Requisitos de Inscripción"
              description="Verifica los documentos obligatorios escaneados según tu personería (DPI, recibo de servicios y correo activo)."
              tone="azul"
              badges={<Badge tone="neutral" dot={false}>Paso 01 · Preparación</Badge>}
              footer={
                <span className="flex items-center justify-between w-full">
                  <span>Consultar acordeón oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/#1615485066841-639e67c5-51e3', '_blank')}
            />

            {/* Paso 2: Solicitar NIT en Línea */}
            <Card
              title="2. Llenar Solicitud en Línea"
              description="Ingresa al formulario electrónico del RTU Digital para completar tus datos, adjuntar tus documentos y generar tu número de gestión."
              tone="azul"
              badges={<Badge tone="online">Paso 02 · Gestión en Línea</Badge>}
              footer={
                <span className="flex items-center justify-between w-full font-bold">
                  <span>Abrir aplicativo RTU Digital</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://portal.sat.gob.gt/portal/solicitud-electronica-de-nit/', '_blank')}
            />

            {/* Paso 3: Agendar mi Cita */}
            <Card
              title="3. Confirmación o Cita"
              description="Si tu solicitud requiere validación presencial o por videollamada, agenda tu cita oficial en la agencia que elijas."
              tone="azul"
              badges={<Badge tone="cita">Paso 03 · Confirmación</Badge>}
              footer={
                <span className="flex items-center justify-between w-full">
                  <span>Agendar cita de validación</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://portal.sat.gob.gt/portal/citas-solicitud-de-NIT/', '_blank')}
            />

          </div>
        </section>

        {/* 6. Verificador Interactivo de Estado de Solicitud */}
        <section aria-labelledby="verificador-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-6 shadow-sat-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-sat-azul" />
            <div>
              <h2 id="verificador-heading" className="text-base sm:text-lg font-bold text-sat-azul-oscuro">
                ¿Ya llenaste tu solicitud? Consulta su estado
              </h2>
              <p className="text-xs text-sat-texto-suave">
                Ingresa el número de solicitud que recibiste en tu correo al completar el formulario electrónico.
              </p>
            </div>
          </div>

          <form onSubmit={handleConsultarSolicitud} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={numSolicitud}
              onChange={(e) => setNumSolicitud(e.target.value)}
              placeholder="Ej. 10482910 o SAT-2026-..."
              className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-sat-gris focus:outline-none focus:ring-2 focus:ring-sat-azul focus:border-sat-azul"
              aria-label="Número de solicitud de NIT"
            />
            <Button type="submit" variant="primary" size="md">
              <Search className="w-4 h-4 mr-1.5" />
              <span>Verificar Estado</span>
            </Button>
          </form>

          {estadoSolicitud.tipo === 'encontrado' && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-sat-azul-oscuro space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-sat-azul" />
                <span>{estadoSolicitud.mensaje}</span>
              </div>
              <p className="text-xs text-sat-texto-suave leading-relaxed">
                {estadoSolicitud.detalle}
              </p>
              {estadoSolicitud.fecha && (
                <span className="inline-block text-[11px] font-semibold text-sat-azul mt-1">
                  {estadoSolicitud.fecha}
                </span>
              )}
            </div>
          )}

          {estadoSolicitud.tipo === 'error' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{estadoSolicitud.mensaje}</span>
              </div>
              <p className="text-xs text-red-700">
                {estadoSolicitud.detalle}
              </p>
            </div>
          )}
        </section>

        {/* 7. Herramientas de Apoyo Complementarias */}
        <section aria-labelledby="apoyo-heading" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-sat-blanco rounded-xl border border-sat-gris p-6 space-y-3">
            <h3 id="apoyo-heading" className="text-base font-bold text-sat-azul-oscuro flex items-center gap-2">
              <Search className="w-4 h-4 text-sat-azul" />
              <span>¿Ya tienes NIT y no lo recuerdas?</span>
            </h3>
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Si solicitaste tu NIT en el pasado o no estás seguro de tu número, consúltalo al instante ingresando los 13 dígitos de tu DPI (CUI).
            </p>
            {onOpenConsultasNIT && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenConsultasNIT}
              >
                <span>Consultar mi NIT con DPI</span>
              </Button>
            )}
          </div>

          <div className="bg-sat-blanco rounded-xl border border-sat-gris p-6 space-y-3">
            <h3 className="text-base font-bold text-sat-azul-oscuro flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sat-azul" />
              <span>Recorrido Guiado Paso a Paso</span>
            </h3>
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Explora el recorrido interactivo con cada una de las etapas detalladas del proceso para evitar rechazos o cometer omisos tributarios.
            </p>
            {onOpenProcesoGuiado && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenProcesoGuiado}
              >
                <span>Ver guía paso a paso</span>
              </Button>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
