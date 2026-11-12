import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { FelSubnav, FelTabId } from '../components/FelSubnav';

interface FelPageProps {
  onBackToHome: () => void;
  initialTab?: FelTabId;
}

export const FelPage: React.FC<FelPageProps> = ({ onBackToHome, initialTab = 'hub' }) => {
  const [currentTab, setCurrentTab] = useState<FelTabId>(initialTab);

  return (
    <div className="bg-sat-fondo-tenue min-h-screen pb-20 text-sat-texto antialiased">
      {/* 1. Miga de pan y control de retorno */}
      <div className="bg-sat-blanco border-b border-sat-gris pt-4 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: 'Gestiones', onClick: onBackToHome },
              { label: 'Contribuyentes', onClick: onBackToHome },
              { label: 'Facturación Electrónica (FEL)', onClick: () => setCurrentTab('hub'), isCurrent: currentTab === 'hub' },
              ...(currentTab !== 'hub' ? [{ label: getTabLabel(currentTab), isCurrent: true }] : [])
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
            <span>Volver al catálogo</span>
          </button>
        </div>
      </div>

      {/* 2. Subnavegación del Ecosistema FEL */}
      <FelSubnav activeTab={currentTab} onSelectTab={setCurrentTab} />

      {/* 3. Contenedor Dinámico del Ecosistema */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        
        {/* ======================================================== */}
        {/* VISTA 1: HUB PRINCIPAL FEL                               */}
        {/* ======================================================== */}
        {currentTab === 'hub' && (
          <>
            {/* CAPA 1 ATO: Hero y Acción Inmediata */}
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
                  onClick={() => setCurrentTab('emisor')}
                >
                  <span>Habilitarme como emisor</span>
                </Button>
              </div>
            </header>

            {/* CAPA 2 ATO: Módulos de Gestión Oficiales (CERO ÍCONOS en tarjetas) */}
            <section aria-labelledby="modulos-fel-heading" className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Ecosistema del Régimen FEL
                </span>
                <h2 id="modulos-fel-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
                  ¿Qué necesitas gestionar en Factura Electrónica?
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Explora las guías oficiales, normas técnicas y opciones del régimen para emisores y empresas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* 1. Habilitación de Emisores */}
                <div 
                  onClick={() => setCurrentTab('emisor')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Habilitarme como emisor de facturas
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Acredítate en el régimen FEL, obtén tu firma electrónica gratuita y conoce las opciones para facturar desde la web o el móvil.
                    </p>
                  </div>
                </div>

                {/* 2. Certificadores */}
                <div 
                  onClick={() => setCurrentTab('certificadores')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Certificadores de facturas autorizados
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Consulta el listado oficial de empresas certificadoras autorizadas por la SAT para emisión masiva o integración contable.
                    </p>
                  </div>
                </div>

                {/* 3. Documentación Técnica */}
                <div 
                  onClick={() => setCurrentTab('tecnica')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Documentación técnica e integración
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Especificaciones XML, esquemas XSD, servicios web y manuales para integradores de sistemas y departamentos de tecnología.
                    </p>
                  </div>
                </div>

                {/* 4. Auditor de Seguridad */}
                <div 
                  onClick={() => setCurrentTab('auditor')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Auditor de seguridad de certificadores
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Requisitos y normas de acreditación para auditores independientes de seguridad de la información de empresas certificadoras.
                    </p>
                  </div>
                </div>

                {/* 5. Preguntas Frecuentes */}
                <div 
                  onClick={() => setCurrentTab('faq')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Preguntas frecuentes sobre facturación
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Respuestas oficiales a dudas comunes sobre emisión de facturas, anulación de documentos, plazos y casos especiales.
                    </p>
                  </div>
                </div>

                {/* 6. Lista de Renuentes */}
                <div 
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/15595/renuentes-fel/96588/renuentes-pequenos-contribuyentes-31-08-2026', '_blank')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Lista de contribuyentes pendientes de migración
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Listado oficial de personas y empresas pendientes de incorporarse al Régimen FEL conforme a las disposiciones legales.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Material Didáctico */}
            <section aria-labelledby="didactico-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-7 shadow-sat-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h3 id="didactico-heading" className="text-base font-bold text-sat-azul-oscuro">
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
                <span>Descargar presentación (PDF)</span>
              </Button>
            </section>
          </>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: HABILITACIÓN DE EMISORES (/portal/emisor-de-dte/) */}
        {/* ======================================================== */}
        {currentTab === 'emisor' && (
          <section className="space-y-6">
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro">
                Habilitarme como emisor de facturas (FEL)
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Cualquier persona individual o empresa puede habilitarse como emisor de facturas de forma gratuita. La SAT te proporciona la firma digital y el facturador web sin costo alguno.
              </p>
            </header>

            {/* 3 Pasos con Visual Chunking */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-sat-blanco border border-sat-gris rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider block">Paso 1</span>
                <h3 className="text-base font-bold text-sat-azul-oscuro">Tener usuario de Agencia Virtual</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Ingresa con tu usuario y contraseña a la Agencia Virtual de la SAT. Si aún no tienes usuario, solicítalo en línea con tu DPI.
                </p>
              </div>
              <div className="bg-sat-blanco border border-sat-gris rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider block">Paso 2</span>
                <h3 className="text-base font-bold text-sat-azul-oscuro">Generar tu firma electrónica gratuita</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  En el menú de Servicios Tributarios, ingresa a Factura Electrónica y genera tu contraseña para firmar tus comprobantes digitales.
                </p>
              </div>
              <div className="bg-sat-blanco border border-sat-gris rounded-2xl p-6 space-y-3">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider block">Paso 3</span>
                <h3 className="text-base font-bold text-sat-azul-oscuro">Emitir tu primera factura</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Escribe el NIT de tu cliente, ingresa el producto o servicio y emite de inmediato desde tu computadora o la app móvil.
                </p>
              </div>
            </div>

            {/* Canales Oficiales */}
            <div className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-sat-azul-oscuro">Canales disponibles para emitir</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">Agencia Virtual Web</h3>
                  <p className="text-xs text-sat-texto-suave">Ideal para computadoras de escritorio, negocios con inventario o emisión con múltiples líneas de detalle.</p>
                  <Button variant="primary" size="sm" onClick={() => window.open('https://agenciavirtual.sat.gob.gt/', '_blank')}>
                    <span>Ir a Agencia Virtual</span>
                  </Button>
                </div>
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">App Móvil FEL (Celulares)</h3>
                  <p className="text-xs text-sat-texto-suave">Facturación al instante desde tu teléfono Android o iPhone. Comparte comprobantes por WhatsApp o correo.</p>
                  <Button variant="outline" size="sm" onClick={() => window.open('https://portal.sat.gob.gt/portal/emisor-de-dte/', '_blank')}>
                    <span>Ver instructivo de instalación</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* VISTA 3: CERTIFICADORES (/portal/certificador-de-dte/)   */}
        {/* ======================================================== */}
        {currentTab === 'certificadores' && (
          <section className="space-y-6">
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro">
                Certificadores de facturas autorizados
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                La SAT es el certificador público oficial y gratuito. Si tu empresa maneja facturación masiva integrada por API a tu sistema contable, puedes contratar a uno de los certificadores autorizados.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                { nombre: 'SAT (Superintendencia de Administración Tributaria)', tipo: 'Certificador Público Oficial', costo: 'Gratuito', url: 'https://portal.sat.gob.gt/portal/emisor-de-dte/' },
                { nombre: 'Infile, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificador-de-dte/' },
                { nombre: 'Guatefacturas, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificador-de-dte/' },
                { nombre: 'Megaprint, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificador-de-dte/' },
                { nombre: 'CODISA, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificador-de-dte/' },
                { nombre: 'Soluciones Digitales (Digifact)', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificador-de-dte/' },
              ].map(cert => (
                <div 
                  key={cert.nombre} 
                  onClick={() => window.open(cert.url, '_blank')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sat-fondo-tenue text-sat-azul group-hover:bg-white/20 group-hover:text-white transition-colors">{cert.costo}</span>
                    </div>
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      {cert.nombre}
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      {cert.tipo}. Consulta los términos de integración técnica y resoluciones de autorización en el portal.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* VISTA 4: DOCUMENTACIÓN TÉCNICA (/portal/documentacion-tecnica/) */}
        {/* ======================================================== */}
        {currentTab === 'tecnica' && (
          <section className="space-y-6">
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro">
                Documentación técnica e integración del Régimen FEL
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Especificaciones para desarrolladores, casas de software y áreas de tecnología encargadas de conectar sistemas ERP con el régimen de facturación electrónica.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => window.open('https://portal.sat.gob.gt/portal/documentacion-tecnica-del-regimen-fel/', '_blank')}
                className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                    Esquemas de validación XSD y XML
                  </h3>
                  <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                    Estructuras oficiales para facturas comerciales, facturas especiales, notas de crédito, recibos y complementos de retención.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => window.open('https://portal.sat.gob.gt/portal/documentacion-tecnica-del-regimen-fel/', '_blank')}
                className="group bg-sat-blanco border border-sat-gris rounded-2xl p-6 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                    Servicios Web (Web Services) y Certificación
                  </h3>
                  <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                    Protocolos SOAP y REST para transmisión, firma digital de comprobantes y recepción de autorizaciones de la SAT.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* VISTA 5: AUDITOR DE SEGURIDAD (/portal/auditor-de-seguridad...) */}
        {/* ======================================================== */}
        {currentTab === 'auditor' && (
          <section className="space-y-6">
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro">
                Auditor de seguridad de certificadores FEL
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Pautas y requisitos de acreditación para profesionales y firmas de auditoría de seguridad que evalúan los controles de las empresas certificadoras autorizadas.
              </p>
            </header>

            <div className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-sat-azul-oscuro">Normas y requisitos de evaluación</h2>
              <div className="space-y-3 text-xs text-sat-texto-suave leading-relaxed">
                <p>• Los auditores deben acreditar experiencia comprobable en estándares de ciberseguridad (ISO 27001 o equivalentes).</p>
                <p>• Se requiere la presentación de informes periódicos de auditoría de infraestructura, respaldo y confidencialidad de datos fiscales.</p>
                <p>• La acreditación se renueva anualmente ante la Gerencia de Tecnologías de la Información de la SAT.</p>
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => window.open('https://portal.sat.gob.gt/portal/auditor-de-seguridad-de-la-informacion/', '_blank')}
              >
                <span>Consultar requisitos completos en el portal</span>
              </Button>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* VISTA 6: PREGUNTAS FRECUENTES (/portal/preguntas-frecuentes/) */}
        {/* ======================================================== */}
        {currentTab === 'faq' && (
          <section className="space-y-6">
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro">
                Preguntas frecuentes sobre Factura Electrónica
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Respuestas claras en lenguaje cotidiano a las dudas más comunes sobre la emisión, anulación y plazos de tus comprobantes fiscales.
              </p>
            </header>

            <div className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 space-y-4">
              <div className="space-y-4">
                <div className="border-b border-sat-gris pb-3 space-y-1">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">¿Tiene algún costo emitir facturas electrónicas?</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">No. La emisión desde la Agencia Virtual de la SAT y desde la aplicación móvil FEL es 100% gratuita y sin límite de documentos.</p>
                </div>
                <div className="border-b border-sat-gris pb-3 space-y-1">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">¿Cómo puedo anular una factura con error?</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">Puedes anular la factura desde la Agencia Virtual durante el mismo mes en que la emitiste. Si el mes ya cerró, debes emitir una Nota de Crédito Electrónica vinculada.</p>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">¿Qué hago si no tengo internet en el momento de la venta?</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">Puedes emitir comprobantes de contingencia y certificarlos en el sistema en un plazo máximo de 15 días posteriores a la operación.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CAPA 3 ATO: CERTEZA JURÍDICA COMÚN AL PIE DE PÁGINA     */}
        {/* ======================================================== */}
        <section aria-labelledby="base-legal-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-sm text-sat-azul-oscuro focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded-lg py-1">
              <span id="base-legal-heading">
                Base legal y acuerdos ministeriales del Régimen FEL
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

      </main>
    </div>
  );
};

function getTabLabel(tab: FelTabId): string {
  switch (tab) {
    case 'emisor': return 'Habilitación de Emisores';
    case 'certificadores': return 'Certificadores Autorizados';
    case 'tecnica': return 'Documentación Técnica';
    case 'auditor': return 'Auditor de Seguridad';
    case 'faq': return 'Preguntas Frecuentes';
    default: return 'Factura Electrónica';
  }
}
