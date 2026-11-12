import React from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  BookOpen, 
  UserCheck, 
  ShieldCheck, 
  Code2, 
  HelpCircle, 
  AlertCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';

interface FelPageProps {
  onBackToHome: () => void;
}

export const FelPage: React.FC<FelPageProps> = ({ onBackToHome }) => {
  return (
    <div className="bg-sat-fondo-tenue min-h-screen pt-4 pb-20 text-sat-texto antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Miga de pan y control de retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sat-gris">
          <Breadcrumbs
            items={[
              { label: 'Gestiones', onClick: onBackToHome },
              { label: 'Contribuyentes', onClick: onBackToHome },
              { label: 'Facturación Electrónica', isCurrent: true }
            ]}
            onHomeClick={onBackToHome}
          />

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sat-azul hover:text-sat-azul-oscuro transition-colors py-1.5 px-3 rounded-sat-sm hover:bg-sat-fondo-medio focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul min-h-[32px] self-start sm:self-auto"
            aria-label="Volver al inicio"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* 2. CAPA 1 ATO: Hero de Acción Principal (Lead with the need, not the law) */}
        <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-10 shadow-sat-sm space-y-5">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
              <span>Servicio Público Gratuito</span>
              <span>•</span>
              <span>Régimen FEL</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-sat-azul-oscuro tracking-tight leading-tight">
              Emitir Factura Electrónica (FEL)
            </h1>
            <p className="text-sm sm:text-base text-sat-texto-suave leading-relaxed">
              Emite tus facturas, recibos y notas de crédito de forma gratuita y con validez legal desde tu computadora o celular. No necesitas comprar talonarios de papel ni contratar a proveedores privados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button 
              variant="primary" 
              size="md"
              onClick={() => window.open('https://agenciavirtual.sat.gob.gt/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              <span>Emitir factura en Agencia Virtual</span>
            </Button>
            <Button 
              variant="outline" 
              size="md"
              onClick={() => window.open('https://portal.sat.gob.gt/portal/emisor-de-dte/', '_blank')}
            >
              <span>Habilitarme como emisor</span>
            </Button>
          </div>
        </header>

        {/* 3. CAPA 2 ATO: Módulos de Gestión de la Página Oficial efactura */}
        <section aria-labelledby="secciones-fel-heading" className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Ecosistema del Régimen FEL
            </span>
            <h2 id="secciones-fel-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
              ¿Qué necesitas gestionar en Factura Electrónica?
            </h2>
            <p className="text-xs sm:text-sm text-sat-texto-suave">
              Accede directamente a los servicios, guías técnicas y opciones para emisores y certificadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Card 1: Emisor de DTE */}
            <div 
              onClick={() => window.open('https://portal.sat.gob.gt/portal/emisor-de-dte/', '_blank')}
              className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sat-azul/10 text-sat-azul flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                  Habilitarme como emisor de facturas
                </h3>
                <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                  Acredítate como emisor en el régimen FEL, obtén tu firma electrónica gratuita y conoce las opciones para facturar desde la web o el móvil.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-sat-azul group-hover:text-white">
                <span>Ver requisitos de emisor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Certificador de DTE */}
            <div 
              onClick={() => window.open('https://portal.sat.gob.gt/portal/certificador-de-dte/', '_blank')}
              className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sat-azul/10 text-sat-azul flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                  Certificadores de facturas autorizados
                </h3>
                <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                  Conoce el listado oficial de empresas certificadoras de facturas acreditadas por la SAT para emisión masiva o integración contable.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-sat-azul group-hover:text-white">
                <span>Consultar certificadores</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Documentación Técnica */}
            <div 
              onClick={() => window.open('https://portal.sat.gob.gt/portal/documentacion-tecnica-del-regimen-fel/', '_blank')}
              className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sat-azul/10 text-sat-azul flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                  Documentación técnica y reglas de esquema
                </h3>
                <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                  Especificaciones XML, esquemas XSD, servicios web y manuales para integradores de software y departamentos de tecnología.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-sat-azul group-hover:text-white">
                <span>Descargar manuales técnicos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Auditor de Seguridad */}
            <div 
              onClick={() => window.open('https://portal.sat.gob.gt/portal/auditor-de-seguridad-de-la-informacion/', '_blank')}
              className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sat-azul/10 text-sat-azul flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                  Auditor de seguridad de certificadores
                </h3>
                <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                  Requisitos y normas de acreditación para auditores independientes de seguridad de la información de empresas certificadoras.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-sat-azul group-hover:text-white">
                <span>Ver requisitos de auditoría</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Preguntas Frecuentes */}
            <div 
              onClick={() => window.open('https://portal.sat.gob.gt/portal/preguntas-frecuentes/cumplimiento-tributario/#1674938805376-f6c4abc5-cfda', '_blank')}
              className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sat-azul/10 text-sat-azul flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                  Preguntas frecuentes sobre facturación
                </h3>
                <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                  Respuestas oficiales a dudas sobre emisión de facturas electrónicas, anulación de documentos, plazos y casos especiales.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-sat-azul group-hover:text-white">
                <span>Consultar preguntas frecuentes</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 6: Reporte de Cumplimiento (Renuentes) */}
            <div 
              onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/15595/renuentes-fel/96588/renuentes-pequenos-contribuyentes-31-08-2026', '_blank')}
              className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-sat-azul/10 text-sat-azul flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                  Lista de contribuyentes pendientes de migración
                </h3>
                <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                  Listado público de personas y empresas pendientes de incorporarse al Régimen FEL conforme a las disposiciones legales.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-sat-azul group-hover:text-white">
                <span>Descargar listado oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </section>

        {/* 4. Material de Capacitación y Generalidades del Régimen */}
        <section aria-labelledby="capacitacion-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-7 shadow-sat-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <h3 id="capacitacion-heading" className="text-base font-bold text-sat-azul-oscuro">
              Presentación interactiva: Generalidades del Régimen FEL
            </h3>
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Descarga la guía didáctica oficial de la SAT con el paso a paso gráfico para conocer cómo funciona el sistema de Factura Electrónica.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/92802/proceso-de-factura-electronica-en-linea-2026-2', '_blank')}
            className="self-start sm:self-auto shrink-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            <span>Descargar presentación (PDF)</span>
          </Button>
        </section>

        {/* 5. CAPA 3 ATO: Certeza Jurídica (Base Legal y Acuerdos de Directorio Colapsables) */}
        <section aria-labelledby="base-legal-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-sm text-sat-azul-oscuro focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded-lg py-1">
              <span id="base-legal-heading" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sat-azul" />
                <span>Base legal y acuerdos del Régimen FEL</span>
              </span>
              <span className="text-xs font-semibold text-sat-azul group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            <div className="pt-3 mt-3 border-t border-sat-gris text-xs text-sat-texto-suave space-y-3 leading-relaxed">
              <p>
                • <strong>Acuerdo de Directorio Número 13-2018:</strong>{' '}
                <a 
                  href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/25094/acuerdo-de-directorio-13-2018.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Descargar acuerdo (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                . Crea el Régimen de Factura Electrónica en Línea (FEL) en la República de Guatemala.
              </p>
              <p>
                • <strong>Acuerdo de Directorio Número 26-2019:</strong>{' '}
                <a 
                  href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/45898/acuerdo-de-directorio-26-2019-reformas-al-regimen-de-factura-electronica-en-linea-fel.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Descargar reformas (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                . Establece reformas y el calendario de incorporación progresiva de contribuyentes.
              </p>
              <p>
                • <strong>Acuerdo de Directorio Número 15-2020:</strong>{' '}
                <a 
                  href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/49283/acuerdo-de-directorio-numero-15-2020.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <span>Descargar acuerdo (PDF)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                . Disposiciones complementarias para pequeños contribuyentes y prestadores de servicios profesionales.
              </p>
            </div>
          </details>
        </section>

      </div>
    </div>
  );
};
