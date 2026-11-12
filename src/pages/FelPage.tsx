import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import type { FelTabId } from '../components/FelSubnav';
import { FEL_CERTIFICADORES, FEL_AUDITORES, FEL_TECNICA_DOCS, FEL_FAQS } from '../data/felEcosystemData';

export type { FelTabId };

interface FelPageProps {
  onBackToHome: () => void;
  initialTab?: FelTabId;
  activeTab?: FelTabId;
  onTabChange?: (tab: FelTabId) => void;
}

export const FelPage: React.FC<FelPageProps> = ({
  onBackToHome,
  initialTab = 'hub',
  activeTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<FelTabId>(initialTab);
  const currentTab = activeTab ?? internalTab;

  const setCurrentTab = (nextTab: FelTabId) => {
    setInternalTab(nextTab);
    onTabChange?.(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-sat-fondo-tenue min-h-screen pb-10 text-sat-texto antialiased">
      {/* 1. Miga de pan y control de retorno (sin barra horizontal extra) */}
      <div className="bg-sat-blanco border-b border-sat-gris py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
            onClick={() => (currentTab !== 'hub' ? setCurrentTab('hub') : onBackToHome())}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sat-azul hover:text-sat-azul-oscuro transition-colors py-1 px-2.5 rounded-sat-sm hover:bg-sat-fondo-medio focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul min-h-[30px] self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentTab !== 'hub' ? 'Volver a Inicio FEL' : 'Volver al catálogo'}</span>
          </button>
        </div>
      </div>

      {/* 2. Contenedor Dinámico del Ecosistema */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-5">
        
        {/* ======================================================== */}
        {/* VISTA 1: HUB PRINCIPAL FEL                               */}
        {/* ======================================================== */}
        {currentTab === 'hub' && (
          <>
            {/* CAPA 1 ATO: Hero y Acción Inmediata */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-5 sm:p-6 shadow-sat-sm space-y-4">
              <div className="max-w-3xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
                  <span>Servicio Público Gratuito</span>
                  <span>•</span>
                  <span>Régimen FEL</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight leading-tight">
                  Emitir Factura Electrónica (FEL)
                </h1>
                <p className="text-sm text-sat-texto-suave leading-relaxed">
                  Emite tus facturas, recibos y notas de crédito de forma gratuita y con validez legal desde tu computadora o celular. No necesitas comprar talonarios de papel ni contratar a proveedores privados.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
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
                <button
                  type="button"
                  onClick={() => setCurrentTab('emisor')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Habilitarme como emisor de facturas
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Acredítate en el régimen FEL, obtén tu firma electrónica gratuita y conoce las opciones para facturar desde la web o el móvil.
                    </p>
                  </div>
                </button>

                {/* 2. Certificadores */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('certificadores')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Certificadores de facturas autorizados
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Consulta el listado oficial de empresas certificadoras autorizadas por la SAT para emisión masiva o integración contable.
                    </p>
                  </div>
                </button>

                {/* 3. Documentación Técnica */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('tecnica')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Documentación técnica e integración
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Especificaciones XML, esquemas XSD, servicios web y manuales para integradores de sistemas y departamentos de tecnología.
                    </p>
                  </div>
                </button>

                {/* 4. Auditor de Seguridad */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('auditor')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Auditor de seguridad de certificadores
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Requisitos y normas de acreditación para auditores independientes de seguridad de la información de empresas certificadoras.
                    </p>
                  </div>
                </button>

                {/* 5. Preguntas Frecuentes */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('faq')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Preguntas frecuentes sobre facturación
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Respuestas oficiales a dudas comunes sobre emisión de facturas, anulación de documentos, plazos y casos especiales.
                    </p>
                  </div>
                </button>

                {/* 6. Lista de Renuentes */}
                <button
                  type="button"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/15595/renuentes-fel/96588/renuentes-pequenos-contribuyentes-31-08-2026', '_blank')}
                  className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Lista de contribuyentes pendientes de migración
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Listado oficial de personas y empresas pendientes de incorporarse al Régimen FEL conforme a las disposiciones legales.
                    </p>
                  </div>
                </button>

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
          <div className="space-y-8">
            {/* CAPA 1 ATO: Resumen, orientación y acción primaria */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
                <span>Directorio Oficial</span>
                <span>•</span>
                <span>Certificadores Autorizados</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Certificadores de Facturas Electrónicas (DTE)
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                La SAT es el certificador público oficial y gratuito para todos los contribuyentes. Si tu negocio maneja facturación masiva integrada a tu propio sistema ERP o software contable, puedes contratar los servicios de una de las 18 empresas privadas autorizadas por la SAT.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/80213/procedimiento-de-autorizacion-de-certificador.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-sat-azul text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-sat-sm hover:bg-sat-azul-oscuro transition-colors shadow-sat-sm min-h-[44px]"
                >
                  <span>Procedimiento para autorizarse como certificador (PDF)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </header>

            {/* CAPA 2 ATO: Antes de empezar / Explicación del rol */}
            <section aria-labelledby="rol-certificador-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <h2 id="rol-certificador-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                ¿Qué hace un Certificador de Factura Electrónica?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">1. Valida las reglas tributarias</strong>
                  <p>Revisa en tiempo real que el archivo XML cumpla estrictamente con la estructura técnica y cálculos normados por la SAT.</p>
                </div>
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">2. Asigna la autorización y firma</strong>
                  <p>Incorpora el Número de Autorización (UUID), serie y correlativo, aplicando su firma electrónica avanzada vinculante.</p>
                </div>
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">3. Transmite a la SAT de inmediato</strong>
                  <p>Devuelve el comprobante certificado al emisor para su cliente y lo envía en milisegundos a los servidores de la SAT.</p>
                </div>
              </div>
            </section>

            {/* CAPA 3 ATO: Directorio oficial completo (18 Certificadores) */}
            <section aria-labelledby="directorio-cert-heading" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 id="directorio-cert-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                    Directorio oficial de entidades autorizadas ({FEL_CERTIFICADORES.length + 1})
                  </h2>
                  <p className="text-xs text-sat-texto-suave">
                    Listado oficial fiscalizado por la Intendencia de Recaudación de la SAT.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Opción 1: SAT Pública Gratuita */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('emisor')}
                  className="group bg-sat-blanco border-2 border-sat-azul/40 rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sat-azul/10 text-sat-azul group-hover:bg-white/20 group-hover:text-white transition-colors">
                        Público Oficial • 100% Gratuito
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      SAT (Superintendencia de Administración Tributaria)
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Certificador público disponible para todos los contribuyentes desde Agencia Virtual y App FEL. Sin costo ni contratos.
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-sat-gris/60 group-hover:border-white/20 text-[11px] text-sat-texto-suave group-hover:text-white/80">
                    <span>Acceso libre con tu usuario y contraseña de Agencia Virtual</span>
                  </div>
                </button>

                {/* 18 Certificadores Privados Oficiales */}
                {FEL_CERTIFICADORES.map((cert) => (
                  <button
                    type="button"
                    key={cert.nombre}
                    onClick={() => {
                      if (cert.web) window.open(cert.web, '_blank', 'noopener,noreferrer');
                    }}
                    className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                  >
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sat-fondo-tenue text-sat-texto-suave group-hover:bg-white/20 group-hover:text-white transition-colors">
                          NIT: {cert.nit || 'Registrado'}
                        </span>
                        <span className="text-[11px] text-sat-texto-suave group-hover:text-white/80 transition-colors">
                          Vence: {cert.renovacion}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors leading-snug">
                        {cert.nombre}
                      </h3>
                      <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors line-clamp-3">
                        {cert.direccion}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sat-gris/60 group-hover:border-white/20 text-[11px] text-sat-texto-suave group-hover:text-white/80 space-y-1 w-full">
                      <p className="truncate"><strong>Contacto:</strong> {cert.contacto.replace(/\|/g, ' • ')}</p>
                      {cert.web && (
                        <p className="text-sat-azul group-hover:text-white font-semibold underline truncate">
                          {cert.web.replace('https://', '').replace('http://', '')}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 4: DOCUMENTACIÓN TÉCNICA (/portal/documentacion-tecnica/) */}
        {/* ======================================================== */}
        {currentTab === 'tecnica' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO: Resumen, propósito y enlaces clave */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
                <span>Desarrolladores y TI</span>
                <span>•</span>
                <span>Especificaciones Técnicas</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Documentación Técnica del Régimen FEL
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Especificaciones oficiales, esquemas XSD, casos de prueba y servicios web para desarrolladores, casas de software y áreas de tecnología encargadas de conectar sistemas informáticos y ERP al régimen de facturación electrónica.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/25545/fel-casos-de-prueba.zip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-sat-azul text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-sat-sm hover:bg-sat-azul-oscuro transition-colors shadow-sat-sm min-h-[44px]"
                >
                  <span>Descargar casos de prueba (ZIP)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="https://portal.sat.gob.gt/portal/descarga/14852/reglas-y-validaciones/97423/fel_reglas_y_validaciones-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-sat-azul border border-sat-azul font-bold text-xs sm:text-sm px-4 py-2.5 rounded-sat-sm hover:bg-sat-azul/5 transition-colors min-h-[44px]"
                >
                  <span>Reglas y validaciones oficiales</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </header>

            {/* CAPA 2 ATO: Antes de empezar / Arquitectura del sistema */}
            <section aria-labelledby="arquitectura-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <h2 id="arquitectura-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                Arquitectura de integración del servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">1. Formato XML y firma electrónica</strong>
                  <p>Todos los documentos tributarios se generan en XML estructurado bajo el estándar UBL / SAT con codificación UTF-8 y firma digital con certificado X.509.</p>
                </div>
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">2. Servicios Web SOAP y REST</strong>
                  <p>Protocolos seguros HTTPS con autenticación mutua TLS para el envío, certificación y consulta de documentos tributarios autorizados.</p>
                </div>
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">3. Asignación de UUID</strong>
                  <p>Cada documento recibe un Identificador Universal Único (UUID) de 32 caracteres hexadecimales que garantiza su inalterabilidad y validez fiscal.</p>
                </div>
              </div>
            </section>

            {/* CAPA 3 ATO: Catálogo completo de documentos y esquemas XSD */}
            <section aria-labelledby="docs-tecnicos-heading" className="space-y-4">
              <div>
                <h2 id="docs-tecnicos-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                  Documentos técnicos, guías y esquemas oficiales ({FEL_TECNICA_DOCS.length})
                </h2>
                <p className="text-xs text-sat-texto-suave">
                  Selecciona cualquier documento para descargar la versión oficial desde el repositorio de la SAT.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {FEL_TECNICA_DOCS.map((doc) => (
                  <a
                    key={doc.num}
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sat-fondo-tenue text-sat-azul group-hover:bg-white/20 group-hover:text-white transition-colors">
                          Documento #{doc.num}
                        </span>
                        <span className="text-[11px] font-semibold text-sat-texto-suave group-hover:text-white/80 transition-colors">
                          {doc.link.includes('github') ? 'Esquema XSD' : (doc.link.includes('.zip') ? 'Archivo ZIP' : 'Guía Técnica')}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors leading-snug">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                        {doc.link.includes('github') 
                          ? 'Estructura formal de etiquetas XML, validaciones de tipo de dato y restricciones para este tipo de comprobante.'
                          : 'Manual técnico oficial y especificaciones de comunicación para emisión en el régimen FEL.'}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sat-gris/60 group-hover:border-white/20 text-xs text-sat-azul group-hover:text-white font-semibold flex items-center justify-between">
                      <span>Abrir especificación</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 5: AUDITOR DE SEGURIDAD (/portal/auditor-de-seguridad...) */}
        {/* ======================================================== */}
        {currentTab === 'auditor' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO: Resumen, orientación y acción primaria */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
                <span>Acreditación Oficial</span>
                <span>•</span>
                <span>Seguridad de la Información</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Auditor de Seguridad de la Información
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Es la entidad o firma especializada autorizada por la SAT para auditar y certificar los procesos de seguridad, infraestructura tecnológica y controles de confidencialidad de las empresas certificadoras de DTE, garantizando la integridad de los datos fiscales del país.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/80050/fel-procedimiento-de-autorizacion-del-auditor-4.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-sat-azul text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-sat-sm hover:bg-sat-azul-oscuro transition-colors shadow-sat-sm min-h-[44px]"
                >
                  <span>Procedimiento de autorización del auditor (PDF)</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </header>

            {/* CAPA 2 ATO: Antes de empezar / Requisitos de acreditación */}
            <section aria-labelledby="requisitos-auditor-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <h2 id="requisitos-auditor-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                Requisitos y alcances de la auditoría técnica
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">1. Certificaciones internacionales</strong>
                  <p>Acreditar personal certificado en seguridad de la información (CISA, CISM, CISSP, CEH o ISO/IEC 27001 Lead Auditor).</p>
                </div>
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">2. Evaluación de infraestructura</strong>
                  <p>Ejecutar pruebas periódicas de penetración (pentesting), análisis de vulnerabilidades y verificación de cifrado de llaves criptográficas.</p>
                </div>
                <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris/60 space-y-2">
                  <strong className="block font-bold text-sat-azul-oscuro text-sm">3. Dictamen anual vinculante</strong>
                  <p>Emitir el informe técnico anual de auditoría requerido por la SAT para la renovación de licencias a certificadores privados.</p>
                </div>
              </div>
            </section>

            {/* CAPA 3 ATO: Directorio oficial de auditores acreditados */}
            <section aria-labelledby="directorio-auditor-heading" className="space-y-4">
              <div>
                <h2 id="directorio-auditor-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                  Firmas de auditoría autorizadas por la SAT ({FEL_AUDITORES.length})
                </h2>
                <p className="text-xs text-sat-texto-suave">
                  Entidades registradas oficialmente ante la SAT para auditar la seguridad de certificadores FEL.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {FEL_AUDITORES.map((aud) => (
                  <button
                    type="button"
                    key={aud.nombre}
                    onClick={() => {
                      if (aud.web) window.open(aud.web, '_blank', 'noopener,noreferrer');
                    }}
                    className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                  >
                    <div className="space-y-2 w-full">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sat-fondo-tenue text-sat-texto-suave group-hover:bg-white/20 group-hover:text-white transition-colors">
                          NIT: {aud.nit || 'Registrado'}
                        </span>
                        <span className="text-[11px] text-sat-texto-suave group-hover:text-white/80 transition-colors">
                          Registro: {aud.fecha_reg}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors leading-snug">
                        {aud.nombre}
                      </h3>
                      <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                        {aud.direccion}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-sat-gris/60 group-hover:border-white/20 text-[11px] text-sat-texto-suave group-hover:text-white/80 space-y-1 w-full">
                      <p className="truncate"><strong>Contacto:</strong> {aud.contacto.replace(/\|/g, ' • ')}</p>
                      {aud.web && (
                        <p className="text-sat-azul group-hover:text-white font-semibold underline truncate">
                          {aud.web.replace('https://', '').replace('http://', '')}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 6: PREGUNTAS FRECUENTES (/portal/preguntas-frecuentes/) */}
        {/* ======================================================== */}
        {currentTab === 'faq' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO: Resumen y orientación */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sat-azul/10 text-sat-azul text-xs font-bold">
                <span>Ayuda al Ciudadano</span>
                <span>•</span>
                <span>Lenguaje Claro</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Preguntas frecuentes sobre Factura Electrónica
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Respuestas oficiales en lenguaje claro a las dudas más comunes sobre la emisión gratuita, plazos de anulación, uso de la App FEL y obligaciones tributarias.
              </p>
            </header>

            {/* CAPA 2 y 3 ATO: Acordeones categorizados con todas las dudas oficiales */}
            <div className="space-y-6">
              {Object.entries(FEL_FAQS).map(([categoria, items], idxCat) => (
                <section key={categoria} aria-labelledby={`cat-heading-${idxCat}`} className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
                  <h2 id={`cat-heading-${idxCat}`} className="text-lg font-black text-sat-azul-oscuro border-b border-sat-gris pb-3">
                    {categoria} ({items.length})
                  </h2>

                  <div className="space-y-3">
                    {items.map((item, idx) => (
                      <details
                        key={idx}
                        className="group border border-sat-gris/70 rounded-xl p-4 hover:border-sat-azul/50 transition-colors"
                      >
                        <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-sm text-sat-azul-oscuro group-hover:text-sat-azul focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded-lg py-1">
                          <span className="pr-4">{item.q}</span>
                          <span className="text-xs font-bold text-sat-azul group-open:rotate-180 transition-transform shrink-0">
                            ▼
                          </span>
                        </summary>
                        <div className="pt-3 mt-3 border-t border-sat-gris/50 text-xs sm:text-sm text-sat-texto-suave leading-relaxed space-y-2">
                          <p>{item.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
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

      </div>
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
