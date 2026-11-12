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
        {/* Estándar ATO: "Before you start" + "Step-by-step" +       */}
        {/* "What happens next" + 100% Contenido Real del Portal SAT  */}
        {/* ======================================================== */}
        {currentTab === 'emisor' && (
          <div className="space-y-8">
            
            {/* Encabezado Principal con Metadatos ATO (Costo y Tiempo) */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
                  <span>Habilitación Oficial en Línea</span>
                  <span>•</span>
                  <span>100% Gratuito</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro">
                  Habilitarme como emisor de facturas (FEL)
                </h1>
                <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                  Un emisor es la persona o empresa facultada para emitir y entregar facturas, recibos y notas de crédito electrónicas (DTE) a sus clientes desde la Agencia Virtual, la App FEL o sus propios sistemas contables.
                </p>
              </div>

              {/* Ficha Resumen Rápida ATO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-sat-gris text-xs">
                <div>
                  <span className="text-sat-texto-suave block">Costo de la gestión:</span>
                  <strong className="text-sat-azul-oscuro text-sm font-black">Gratuito (Q 0.00)</strong>
                </div>
                <div>
                  <span className="text-sat-texto-suave block">Tiempo estimado:</span>
                  <strong className="text-sat-azul-oscuro text-sm font-black">Menos de 5 minutos</strong>
                </div>
                <div>
                  <span className="text-sat-texto-suave block">Vigencia de firma digital:</span>
                  <strong className="text-sat-azul-oscuro text-sm font-black">Indefinida (Renovación web)</strong>
                </div>
              </div>
            </header>

            {/* 1. ATO "BEFORE YOU START": Requisitos Mínimos Indispensables */}
            <section aria-labelledby="before-start-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Antes de empezar (Before you start)
                </span>
                <h2 id="before-start-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                  ¿Qué necesitas tener listo antes de iniciar la gestión?
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Verifica que cumples con estos tres requisitos previos para completar tu habilitación sin contratiempos:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-1.5">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">1. NIT Activo</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Tener tu Número de Identificación Tributaria (NIT) en estado activo y sin declaraciones pendientes u omisos en la SAT.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-1.5">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">2. Usuario de Agencia Virtual</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Contar con acceso activo a la Agencia Virtual. Si no tienes usuario, puedes solicitarlo en línea con tu DPI vigente.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-1.5">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">3. Datos de RTU al Día</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Información actualizada en el Registro Tributario Unificado (RTU) con un negocio o actividad económica registrada.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/15746/emisores-dte/77271/guia-de-requisitos-minimos-dte-3.pdf', '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  <span>Descargar guía oficial de requisitos mínimos DTE (PDF)</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/14792/registro-de-emisores-fel/96594/habilitados-al-31-08-2026', '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  <span>Consultar Registro de Emisores Habilitados (XLSX)</span>
                </Button>
              </div>
            </section>

            {/* 2. ATO "STEP-BY-STEP": Pasos Secuenciales Oficiales de la Infografía SAT */}
            <section aria-labelledby="pasos-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Paso a paso oficial (Infografía SAT)
                </span>
                <h2 id="pasos-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                  Pasos para habilitarte desde Agencia Virtual
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Proceso oficial de 5 etapas para emitir Documentos Tributarios Electrónicos (DTE):
                </p>
              </div>

              <div className="space-y-3.5">
                
                {/* Paso 1 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 01</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Ubicación: Menú Principal</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Ingresar a tu Agencia Virtual y seleccionar Servicios Tributarios
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Inicia sesión en tu cuenta de Agencia Virtual SAT con tu usuario y contraseña. En el menú superior izquierdo, haz clic en la sección <strong>Servicios Tributarios</strong>.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 02</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Módulo: Factura Electrónica</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Dirigirte a Factura Electrónica en Línea (FEL) y hacer clic en "Habilitarse como emisor"
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Dentro de Servicios Tributarios, busca el apartado <strong>Factura Electrónica en Línea (FEL)</strong> y haz clic sobre la opción <strong>Habilitarse como emisor</strong>.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 03</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Validación Automática del Sistema</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    El sistema validará que cumplas con los requisitos necesarios
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    La plataforma revisará automáticamente tu historial tributario y te mostrará la pantalla de confirmación con los tres indicadores en verde:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span>NIT Activo</span>
                      <span className="font-bold">¿Cumple? Sí</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span>Sin Omisos</span>
                      <span className="font-bold">¿Cumple? Sí</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span>RTU Actualizado</span>
                      <span className="font-bold">¿Cumple? Sí</span>
                    </div>
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 04</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Seguridad y Firma</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Asignar una contraseña para tu firma electrónica digital
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Define una contraseña segura para tu firma digital gratuita. Esta clave certificará legalmente cada factura o comprobante emitido a tus clientes.
                  </p>
                </div>

                {/* Paso 5 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 05</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Aprobación Final</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Hacer clic en "Acepto los términos y condiciones"
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Confirma la aceptación de términos y condiciones. ¡Listo! Tu certificado queda emitido y ya puedes generar Documentos Tributarios Electrónicos (DTE).
                  </p>
                </div>

              </div>

              {/* Botón de Inicio Inmediato */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={() => window.open('https://agenciavirtual.sat.gob.gt/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Iniciar habilitación en Agencia Virtual</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={() => window.open('/downloads/FEL-capsula-HABILITACION-FEL-DTE-2026-1.jpg', '_blank')}
                >
                  <span>Ver infografía oficial original (JPG)</span>
                </Button>
              </div>
            </section>

            {/* 3. ATO "WHAT HAPPENS NEXT": ¿Qué pasa después? */}
            <section aria-labelledby="next-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Continuidad (What happens next)
                </span>
                <h2 id="next-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                  ¿Qué debes hacer una vez habilitado?
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Tu estado de emisor queda activo inmediatamente. Ya puedes elegir cómo facturar:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">Opción A: Facturar desde la Web</h3>
                  <p className="text-xs text-sat-texto-suave">
                    Ingresa nuevamente a tu Agencia Virtual y haz clic en <strong>Emitir DTE</strong>. Podrás desglosar ítems, aplicar descuentos y guardar clientes frecuentes.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">Opción B: Facturar desde el Celular</h3>
                  <p className="text-xs text-sat-texto-suave">
                    Descarga la aplicación <strong>App FEL</strong> en tu teléfono Android o iOS. Ingresa con tu NIT y contraseña de Agencia Virtual para facturar en tu negocio.
                  </p>
                </div>
              </div>
            </section>

            {/* 4. REPOSITORIO COMPLETO DE MANUALES OFICIALES SAT (Organizados por Categoría) */}
            <section aria-labelledby="manuales-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Biblioteca Oficial de Manuales
                </span>
                <h2 id="manuales-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                  Manuales oficiales para emisores de facturas
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Guías paso a paso descargables en formato PDF publicadas por la SAT:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Grupo A: Habilitación y Permisos */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sat-azul-oscuro uppercase tracking-wider border-b border-sat-gris pb-1">
                    Habilitación, Consulta y Permisos
                  </h3>
                  <ul className="text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/85784/1-manual-de-usuario-fel-habilitacion-acreditacion-descarga-de-firma-electronica-2.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Habilitación, Acreditación y Descarga de Firma</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92749/manual-de-usuario-app-fel-3" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Usuario APP Móvil FEL</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/85785/3-manual-de-consulta-de-documentos-tributarios-electronicos-dte.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Consulta de Facturas y Comprobantes (DTE)</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92747/4-manual-de-usuario-fel-permisos-delegados-a-terceros" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Permisos Delegados a Terceros</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92759/manual-de-usuario-para-activar-el-servicio-de-notificaciones-fel" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual para Activar Notificaciones por Correo Electrónico</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92765/manuel-de-usuario-aviso-de-notificaciones-en-contingencia-fel" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Notificaciones de Contingencia (Sin Internet)</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92771/manual-de-usuario-aviso-de-emision-de-dte-en-establecimiento-temporal-4" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Emisión en Establecimientos Temporales o Ferias</a>
                    </li>
                  </ul>
                </div>

                {/* Grupo B: Emisión de Documentos Especiales */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sat-azul-oscuro uppercase tracking-wider border-b border-sat-gris pb-1">
                    Emisión y Operaciones Especiales
                  </h3>
                  <ul className="text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/97342/manual-de-emision-de-documentos-tributarios-electronicos-dte-2" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual General de Emisión de Facturas y DTE</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93106/manual-emision-masiva-de-dte" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Emisión Masiva de Documentos</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93102/manual-de-emision-constancias-de-exension-de-iva-civa" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Constancias de Exención de IVA (CIVA)</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/77266/manual-de-emision-de-constancias-de-adquisicion-de-insumos-y-servicios-cais.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Constancias de Compra Libre de Impuestos (CAIS)</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93108/manual-para-emision-de-factura-provisional" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Emisión de Factura Provisional</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/97344/manual-de-anulacion-de-documentos-tributarios-electronicos-dte-3" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de Anulación de Documentos Tributarios</a>
                    </li>
                    <li>
                      • <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/97346/manual-para-solicitar-reversion-de-anulacion-de-dte" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual para Reversión de Anulaciones de DTE</a>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

            {/* 5. RESOLUCIONES DE INCORPORACIÓN POR SECTOR (Certeza Jurídica en Acordeón) */}
            <section aria-labelledby="resoluciones-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm">
              <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-sm text-sat-azul-oscuro focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded-lg py-1">
                  <span id="resoluciones-heading">
                    Resoluciones oficiales de incorporación al Régimen FEL por sector
                  </span>
                  <span className="text-xs font-semibold text-sat-azul group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="pt-3 mt-3 border-t border-sat-gris text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/46321/resolucion-sat-dsi-243-2019-incorporacion-de-proveedores-del-estado-al-regimen-de-factura-electronica-en-linea-fel-2.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-243-2019: Proveedores del Estado</a></p>
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/39867/resolucion-de-superintendencia-sat-dsi-838-2019-regimen-de-factura-electronica-en-linea-fel-incorpora-a-los-contribuyentes-que-proveen-servicios-profesionales-individuales-en-general.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-838-2019: Servicios Profesionales</a></p>
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/46215/resolucion-sat-dsi-640-2020-incorporacion-fel-emisores-face.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-640-2020: Emisores FACE (Migración)</a></p>
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/57856/resolucion-r-sat-dsi-1218-2021-incorporacion-fel-contadores-auditores-y-firmas.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1218-2021: Peritos Contadores, Auditores y Firmas Contables</a></p>
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/57855/resolucion-r-sat-dsi-1240-2021-incorporacion-fel-contribuyentes-del-regimen-general-del-iva.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1240-2021: Contribuyentes del Régimen General del IVA</a></p>
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/66005/resolucion-sat-dsi-1350-2022-incorporacion-fel-de-pequenos-contribuyentes.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1350-2022: Pequeños Contribuyentes del IVA</a></p>
                  <p>• <a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/69739/resolucion-sat-dsi-400-2023-ampliacion-para-incorporacion-a-fel-de-pequenos-contribuyentes-del-iva.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-400-2023: Ampliación de Plazos para Pequeños Contribuyentes</a></p>
                </div>
              </details>
            </section>

          </div>
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
