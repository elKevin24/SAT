import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Search, ChevronDown, X } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { FelSubnav, type FelTabId } from '../components/FelSubnav';
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
  const [faqQuery, setFaqQuery] = useState('');
  const currentTab = activeTab ?? internalTab;

  const setCurrentTab = (nextTab: FelTabId) => {
    setInternalTab(nextTab);
    onTabChange?.(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const normalizedFaqQuery = faqQuery.trim().toLowerCase();
  const filteredFaqSections = Object.entries(FEL_FAQS)
    .map(([categoria, items]) => {
      const matched = normalizedFaqQuery
        ? items.filter(
            (item) =>
              item.q.toLowerCase().includes(normalizedFaqQuery) ||
              item.a.toLowerCase().includes(normalizedFaqQuery)
          )
        : items;
      return [categoria, matched] as const;
    })
    .filter(([, items]) => items.length > 0);
  const totalFaqMatches = filteredFaqSections.reduce((acc, [, items]) => acc + items.length, 0);

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
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sat-azul hover:text-sat-azul-oscuro transition-colors py-2 px-3 rounded-sat-sm hover:bg-sat-fondo-medio focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul min-h-[44px] self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentTab !== 'hub' ? 'Volver a Inicio FEL' : 'Volver al catálogo'}</span>
          </button>
        </div>
      </div>

      {/* 2. Contenedor Dinámico del Ecosistema con Menú Vertical */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 flex flex-col lg:flex-row gap-6 items-start">
        <FelSubnav activeTab={currentTab} onSelectTab={setCurrentTab} />

        <div className="flex-1 min-w-0 w-full space-y-5">
        
        {/* ======================================================== */}
        {/* VISTA 1: HUB PRINCIPAL FEL                               */}
        {/* ======================================================== */}
        {currentTab === 'hub' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO: Hero, acción inmediata y canales oficiales */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight leading-tight">
                Régimen de Factura Electrónica en Línea (FEL)
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Emite, transmite y conserva facturas, recibos, notas de crédito, notas de débito y otros Documentos Tributarios Electrónicos (DTE) de forma gratuita y con validez legal desde la Agencia Virtual o la App FEL.
              </p>

              <div className="pt-3 border-t border-sat-gris/70 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-sat-texto-suave">
                <span className="font-bold text-sat-azul-oscuro">Descargar App FEL gratuita:</span>
                <a
                  href="https://play.google.com/store/apps/details?id=gob.sat.fel"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1 min-h-[44px]"
                >
                  <span>Google Play (Android)</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href="https://apps.apple.com/gt/app/fel/id1555900357"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1 min-h-[44px]"
                >
                  <span>App Store (iOS)</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
                <a
                  href="https://appgallery.cloud.huawei.com/ag/n/app/C104282259?locale=en_US&source=appshare&subsource=C104282259"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1 min-h-[44px]"
                >
                  <span>AppGallery (Huawei)</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </header>

            {/* CAPA 2 ATO: Módulos de Gestión Oficiales (CERO ÍCONOS en tarjetas) */}
            <section aria-labelledby="modulos-fel-heading" className="space-y-4">
              <div className="space-y-1">
                <h2 id="modulos-fel-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro tracking-tight">
                  ¿Qué necesitas gestionar en Factura Electrónica (FEL)?
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Explora las guías oficiales, normas técnicas y opciones para emisores y empresas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* 1. Habilitación de Emisores (destacada a ancho completo) */}
                <button
                  type="button"
                  onClick={() => setCurrentTab('emisor')}
                  className="md:col-span-2 group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-sat-azul-oscuro group-hover:text-white transition-colors">
                      Habilitarme como emisor de facturas (FEL)
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Activa tu usuario en Factura Electrónica (FEL), obtén tu firma electrónica gratuita, consulta las resoluciones de incorporación y descarga los manuales de usuario.
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
                      Elegir certificador de facturas autorizado
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Usa el servicio gratuito de la SAT o consulta la lista oficial de empresas autorizadas para facturación masiva.
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
                      Integrar sistemas contables (XML y XSD)
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Especificaciones XML, esquemas de validación (XSD), servicios web y guías para desarrolladores y equipos de tecnología.
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
                      Consultar o acreditarse como auditor de seguridad
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Requisitos de acreditación y firmas registradas para auditar la seguridad informática de empresas certificadoras.
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
                      Resolver dudas frecuentes sobre facturación
                    </h3>
                    <p className="text-xs text-sat-texto-suave group-hover:text-white/90 leading-relaxed transition-colors">
                      Respuestas directas sobre emisión gratuita, anulación de facturas, plazos y uso de la aplicación móvil.
                    </p>
                  </div>
                </button>

              </div>
            </section>

            {/* Proceso de Emisión FEL (versión accesible del flujo oficial) */}
            <section aria-labelledby="proceso-fel-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <h2 id="proceso-fel-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                  Cómo funciona la emisión de Factura Electrónica (FEL)
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                  Cada Documento Tributario Electrónico (DTE) sigue cuatro pasos automáticos de validación en línea:
                </p>
              </div>
              <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <li>
                  <strong className="text-sat-azul-oscuro">Emisión:</strong>{' '}
                  El contribuyente genera el documento con su firma electrónica desde la Agencia Virtual, la App FEL o su sistema contable y lo envía al certificador.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Certificación:</strong>{' '}
                  El certificador (la SAT de forma gratuita o un certificador privado autorizado) valida la estructura y asigna el número de autorización único.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Recepción y validez en la SAT:</strong>{' '}
                  El certificador transmite el documento a la SAT para su verificación y resguardo, dejándolo disponible para consulta inmediata.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Entrega al receptor:</strong>{' '}
                  El emisor entrega el documento certificado al comprador por medio digital (correo, enlace o mensajería) o impreso si el receptor lo solicita.
                </li>
              </ol>
            </section>

            {/* Documentos de consulta directa (archivos descargables individuales) */}
            <section aria-labelledby="recursos-directos-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-7 shadow-sat-sm space-y-4">
              <h2 id="recursos-directos-heading" className="text-base sm:text-lg font-black text-sat-azul-oscuro">
                Documentos de consulta directa
              </h2>
              <div className="divide-y divide-sat-gris/70">
                <div className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <h3 className="text-sm font-bold text-sat-azul-oscuro">
                      Presentación interactiva: Generalidades de Factura Electrónica (FEL)
                    </h3>
                    <p className="text-xs text-sat-texto-suave leading-relaxed">
                      Guía didáctica oficial de la SAT con el paso a paso gráfico para conocer cómo funciona el sistema.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    href="https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/92802/proceso-de-factura-electronica-en-linea-2026-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />}
                    className="self-start sm:self-auto shrink-0"
                  >
                    Descargar presentación (PDF)
                  </Button>
                </div>

                <div className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-2xl">
                    <h3 className="text-sm font-bold text-sat-azul-oscuro">
                      Lista de contribuyentes pendientes de migración (Renuentes FEL)
                    </h3>
                    <p className="text-xs text-sat-texto-suave leading-relaxed">
                      Listado oficial vigente al 31 de octubre de 2026 de personas y empresas que aún deben incorporarse al Régimen de Factura Electrónica en Línea (FEL).
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    href="https://portal.sat.gob.gt/portal/descarga/15595/renuentes-fel/98108/renuentes-pequenos-contribuyentes-31-10-2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon={<ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />}
                    className="self-start sm:self-auto shrink-0"
                  >
                    Descargar listado oficial
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: HABILITACIÓN DE EMISORES (/portal/emisor-de-dte/) */}
        {/* Estándar ATO: "Before you start" + "Step-by-step" +       */}
        {/* "What happens next" + 100% Contenido Real del Portal SAT  */}
        {/* ======================================================== */}
        {currentTab === 'emisor' && (
          <div className="space-y-8">
            
            {/* Encabezado Principal */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Habilitarme como emisor de facturas (FEL)
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Habilítate gratis para emitir facturas, recibos y notas de crédito electrónicas desde tu computadora, celular o sistema contable.
              </p>
            </header>

            {/* 1. ATO "BEFORE YOU START": Requisitos Mínimos Indispensables */}
            <section aria-labelledby="before-start-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Antes de empezar
                </span>
                <h2 id="before-start-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro scroll-mt-6">
                  ¿Qué necesitas antes de empezar?
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Comprueba que cumples estos tres requisitos para completar tu habilitación sin errores:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-1.5">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">1. NIT activo</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Tu Número de Identificación Tributaria (NIT) debe estar activo y sin declaraciones ni pagos pendientes.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-1.5">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">2. Usuario de Agencia Virtual</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Necesitas acceso a Agencia Virtual. Si aún no tienes usuario, solicítalo en línea con tu Documento Personal de Identificación (DPI) vigente.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-1.5">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">3. Datos del RTU al día</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Tu Registro Tributario Unificado (RTU) debe estar actualizado y con al menos un negocio o actividad económica registrada.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl border-l-4 border-[#14649B] bg-[#14649B]/5 text-xs text-sat-azul-oscuro leading-relaxed">
                <strong>¿Te falta un requisito?</strong> Actualiza tus datos del RTU o ponte al día con tus declaraciones en Agencia Virtual antes de iniciar este proceso.
              </div>

              <div className="pt-1 flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/15746/emisores-dte/77271/guia-de-requisitos-minimos-dte-3.pdf', '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  <span>Descargar guía de requisitos mínimos (PDF)</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/14792/registro-de-emisores-fel/98110/habilitados-al-31-10-2026', '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  <span>Consultar registro de emisores habilitados (XLSX)</span>
                </Button>
              </div>
            </section>

            {/* 2. ATO "STEP-BY-STEP": Pasos Secuenciales Oficiales de la Infografía SAT */}
            <section aria-labelledby="pasos-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Paso a paso
                </span>
                <h2 id="pasos-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro scroll-mt-6">
                  Pasos para habilitarte desde Agencia Virtual
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Completa estas cinco etapas para emitir Documentos Tributarios Electrónicos (DTE):
                </p>
              </div>

              <div className="space-y-3.5">
                
                {/* Paso 1 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 1</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Menú principal</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Ingresa a tu Agencia Virtual y abre Servicios Tributarios
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Inicia sesión con tu usuario y contraseña. En el menú superior izquierdo, haz clic en <strong>Servicios Tributarios</strong>.
                  </p>
                </div>

                {/* Paso 2 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 2</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Módulo Factura Electrónica</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Entra a Factura Electrónica en Línea (FEL) y elige Habilitarse como emisor
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Dentro de Servicios Tributarios, busca <strong>Factura Electrónica en Línea (FEL)</strong> y haz clic en <strong>Habilitarse como emisor</strong>.
                  </p>
                </div>

                {/* Paso 3 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 3</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Validación automática</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Revisa que los tres requisitos aparezcan en verde
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    El sistema revisará tu estado automáticamente y confirmará que cumples con las tres condiciones:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs font-semibold">
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span>NIT activo</span>
                      <span className="font-bold">¿Cumple? Sí</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span>Sin pagos pendientes</span>
                      <span className="font-bold">¿Cumple? Sí</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <span>RTU actualizado</span>
                      <span className="font-bold">¿Cumple? Sí</span>
                    </div>
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 4</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Firma electrónica</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Crea una contraseña para tu firma electrónica gratuita
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Escribe una contraseña segura para tu firma digital. Esta clave validará legalmente cada factura que emitas.
                  </p>
                </div>

                {/* Paso 5 */}
                <div className="border border-sat-gris rounded-xl p-5 bg-sat-fondo-tenue space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#14649B] text-white">Paso 5</span>
                    <span className="text-xs text-sat-texto-suave font-medium">Confirmación final</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-sat-azul-oscuro">
                    Acepta los términos y condiciones
                  </h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Confirma los términos de uso. Tu certificado quedará activo de inmediato para emitir facturas electrónicas.
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
                  Qué sigue después
                </span>
                <h2 id="next-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro scroll-mt-6">
                  ¿Cómo empiezas a facturar una vez habilitado?
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Tu perfil de emisor se activa al instante. Elige la opción que mejor se adapte a tu negocio:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">1. Desde la web (Gratis)</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Entra a Agencia Virtual y haz clic en <strong>Emitir DTE</strong> para generar facturas, aplicar descuentos y guardar clientes frecuentes.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2">
                  <h3 className="text-sm font-bold text-sat-azul-oscuro">2. Desde el celular (Gratis)</h3>
                  <p className="text-xs text-sat-texto-suave leading-relaxed">
                    Descarga la <strong>aplicación móvil FEL</strong> en Android o iOS e ingresa con tu NIT y contraseña de Agencia Virtual.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-sat-gris bg-sat-fondo-tenue space-y-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-sat-azul-oscuro">3. Con sistema propio</h3>
                    <p className="text-xs text-sat-texto-suave leading-relaxed">
                      Si emites facturas de forma masiva desde tu sistema contable, puedes contratar un certificador autorizado.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('certificadores')}
                    className="text-xs font-bold text-sat-azul hover:underline text-left pt-1"
                  >
                    Ver certificadores autorizados →
                  </button>
                </div>
              </div>
            </section>

            {/* 4. REPOSITORIO COMPLETO DE MANUALES OFICIALES SAT (Organizados por Categoría) */}
            <section aria-labelledby="manuales-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
                  Biblioteca Oficial de Manuales
                </span>
                <h2 id="manuales-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro scroll-mt-6">
                  Manuales oficiales para emisores de facturas
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  Guías paso a paso descargables en formato PDF publicadas por la SAT:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Grupo 1: Habilitación, consulta y permisos (10) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sat-azul-oscuro uppercase tracking-wider border-b border-sat-gris pb-1">
                    Habilitación, consulta y permisos
                  </h3>
                  <ul className="list-disc pl-4 text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/85784/1-manual-de-usuario-fel-habilitacion-acreditacion-descarga-de-firma-electronica-2.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de habilitación, acreditación de certificador y descarga de firma electrónica (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92749/manual-de-usuario-app-fel-3" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de la aplicación móvil FEL (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/85785/3-manual-de-consulta-de-documentos-tributarios-electronicos-dte.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de consulta de facturas y comprobantes (DTE) (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92747/4-manual-de-usuario-fel-permisos-delegados-a-terceros" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de permisos delegados a terceros (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92759/manual-de-usuario-para-activar-el-servicio-de-notificaciones-fel" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual para activar notificaciones por correo electrónico (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92757/manual-de-usuario-para-rechazo-de-dte-2" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de rechazo de Documentos Tributarios Electrónicos (DTE) (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92758/manual-de-usuario-opciones-directas-desde-la-consulta-de-dte-2" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de opciones directas desde la consulta de DTE (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92765/manuel-de-usuario-aviso-de-notificaciones-en-contingencia-fel" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de notificaciones en contingencia sin internet (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92771/manual-de-usuario-aviso-de-emision-de-dte-en-establecimiento-temporal-4" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de aviso de emisión en establecimiento temporal o feria (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92773/manual-de-usuario-consulta-de-aviso-de-emision-de-dte-2" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de consulta de aviso de emisión en establecimiento temporal (PDF)</a>
                    </li>
                  </ul>
                </div>

                {/* Grupo 2: Emisión de documentos (8) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sat-azul-oscuro uppercase tracking-wider border-b border-sat-gris pb-1">
                    Emisión de documentos
                  </h3>
                  <ul className="list-disc pl-4 text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/97342/manual-de-emision-de-documentos-tributarios-electronicos-dte-2" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual general de emisión de facturas y DTE (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93106/manual-emision-masiva-de-dte" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de emisión masiva de documentos (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93102/manual-de-emision-constancias-de-exension-de-iva-civa" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de constancias de exención del Impuesto al Valor Agregado (IVA) (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93101/manual-de-emision-de-constancias-de-exension-de-iva-civa-app-fel" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de constancias de exención de IVA en la aplicación móvil FEL (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/94729/manual-de-emision-de-constancias-de-exencion-de-iva-app-fel-e-impresion-de-comprobante-en-pos" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de constancias de exención de IVA en aplicación móvil e impresión en punto de venta (POS) (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/77266/manual-de-emision-de-constancias-de-adquisicion-de-insumos-y-servicios-cais.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de constancias de compra libre de impuestos (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93108/manual-para-emision-de-factura-provisional" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de emisión de factura provisional (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93107/manual-de-emision-de-documentos-tributarios-electronicos-dte-regimen-primario-y-pecuario" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de emisión de DTE para régimen primario y pecuario (PDF)</a>
                    </li>
                  </ul>
                </div>

                {/* Grupo 3: Gestión de anulación (3) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sat-azul-oscuro uppercase tracking-wider border-b border-sat-gris pb-1">
                    Gestión de anulación
                  </h3>
                  <ul className="list-disc pl-4 text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/97344/manual-de-anulacion-de-documentos-tributarios-electronicos-dte-3" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de anulación de Documentos Tributarios Electrónicos (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/97346/manual-para-solicitar-reversion-de-anulacion-de-dte" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual para solicitar reversión de anulación de DTE (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/93111/manual-reporte-anulacion-improcedentepdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de reporte de anulación improcedente (PDF)</a>
                    </li>
                  </ul>
                </div>

                {/* Grupo 4: Generación de reportes (2) */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-sat-azul-oscuro uppercase tracking-wider border-b border-sat-gris pb-1">
                    Generación de reportes
                  </h3>
                  <ul className="list-disc pl-4 text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92764/manual-de-usuario-generacion-de-informe-trimestral-civa" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de generación de informe trimestral de exenciones de IVA (PDF)</a>
                    </li>
                    <li>
                      <a href="https://portal.sat.gob.gt/portal/descarga/15747/manuales/92763/manual-de-usuario-generacion-de-reporte-mensual-cais" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline font-medium">Manual de generación de reporte mensual de constancias de compra libre de impuestos (PDF)</a>
                    </li>
                  </ul>
                </div>

              </div>
            </section>

            {/* 5. RESOLUCIONES DE INCORPORACIÓN POR SECTOR (Certeza Jurídica en Acordeón) */}
            <section aria-labelledby="resoluciones-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm">
              <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between font-bold text-sm text-sat-azul-oscuro focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded-lg py-1">
                  <span id="resoluciones-heading" className="scroll-mt-6">
                    Resoluciones oficiales de incorporación a Factura Electrónica (FEL)
                  </span>
                  <span className="text-xs font-semibold text-sat-azul group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <ul className="pt-3 mt-3 border-t border-sat-gris list-disc pl-4 text-xs text-sat-texto-suave space-y-2 leading-relaxed">
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/46321/resolucion-sat-dsi-243-2019-incorporacion-de-proveedores-del-estado-al-regimen-de-factura-electronica-en-linea-fel-2.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-243-2019: Proveedores del Estado (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/39867/resolucion-de-superintendencia-sat-dsi-838-2019-regimen-de-factura-electronica-en-linea-fel-incorpora-a-los-contribuyentes-que-proveen-servicios-profesionales-individuales-en-general.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-838-2019: Servicios profesionales (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/17662/resolucion-superintendencia-sat-s-639-2011-funciones-de-unidad-de-informacion-publica.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-639-2020: Servicios técnicos (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/46215/resolucion-sat-dsi-640-2020-incorporacion-fel-emisores-face.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-640-2020: Emisores FACE (migración) (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/47495/sat-dsi-887-2020.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-887-2020: Compra directa y baja cuantía (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/51799/resolucion-sat-dsi-398-2021-incorporacion-de-proveedores-del-estado-al-regimen-fel-proveedor-unico-arrendamiento-y-dragado.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-398-2021: Proveedor único, arrendamiento y dragado (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/57857/resolucion-r-sat-dsi-1074-2021-incorporacion-por-servicios-y-bienes-relacionados-a-la-salud.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1074-2021: Proveedores de bienes y servicios de salud y asistencia social (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/57856/resolucion-r-sat-dsi-1218-2021-incorporacion-fel-contadores-auditores-y-firmas.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1218-2021: Peritos contadores, auditores y firmas contables (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/57855/resolucion-r-sat-dsi-1240-2021-incorporacion-fel-contribuyentes-del-regimen-general-del-iva.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1240-2021: Contribuyentes del Régimen General del IVA (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/66005/resolucion-sat-dsi-1350-2022-incorporacion-fel-de-pequenos-contribuyentes.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-1350-2022: Pequeños contribuyentes del IVA (PDF)</a></li>
                  <li><a href="https://portal.sat.gob.gt/portal/descarga/1897/normativa-sat/69739/resolucion-sat-dsi-400-2023-ampliacion-para-incorporacion-a-fel-de-pequenos-contribuyentes-del-iva.pdf" target="_blank" rel="noopener noreferrer" className="text-sat-azul hover:underline">Resolución SAT-DSI-400-2023: Ampliación de plazos para pequeños contribuyentes (PDF)</a></li>
                </ul>
              </details>
            </section>

          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 3: CERTIFICADORES (/portal/certificador-de-dte/)   */}
        {/* ======================================================== */}
        {currentTab === 'certificadores' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO + PIRÁMIDE INVERTIDA: Lo esencial primero */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                  Elegir un certificador de Factura Electrónica (FEL)
                </h1>
                <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                  La SAT certifica tus Documentos Tributarios Electrónicos (DTE) gratis desde Agencia Virtual y la aplicación móvil FEL, sin contratos privados. Si tu negocio factura de forma masiva desde su propio sistema contable, puedes contratar a una de las {FEL_CERTIFICADORES.length} empresas privadas autorizadas en la Tabla 1.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setCurrentTab('emisor')}
                >
                  <span>Habilitarme gratis con la SAT</span>
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/80213/procedimiento-de-autorizacion-de-certificador.pdf', '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Requisitos y procedimiento para autorizarse (PDF)</span>
                </Button>
              </div>
            </header>

            {/* ESTRUCTURA EN LISTA ORDENADA (Style Manual: Lists) */}
            <section aria-labelledby="rol-certificador-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h2 id="rol-certificador-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                Qué hace un certificador de facturas
              </h2>
              <p className="text-xs sm:text-sm text-sat-texto-suave">
                Cuando emites un Documento Tributario Electrónico (DTE), el certificador realiza tres acciones en segundos:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <li>
                  <strong className="text-sat-azul-oscuro">Valida las reglas tributarias:</strong> comprueba que el archivo XML cumpla con el formato y los cálculos exigidos por la SAT.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Asigna autorización y firma:</strong> agrega el Identificador Universal Único (UUID), la serie y el número correlativo con su firma electrónica.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Envía la factura a la SAT:</strong> devuelve el documento autorizado al emisor y lo transmite de inmediato a los servidores de la SAT.
                </li>
              </ol>
            </section>

            {/* ESTRUCTURA EN TABLA ACCESIBLE (Style Manual: Tables) */}
            <section aria-labelledby="directorio-cert-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <h2 id="directorio-cert-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                  Empresas certificadoras autorizadas ({FEL_CERTIFICADORES.length})
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  La Tabla 1 muestra las empresas privadas autorizadas y supervisadas por la SAT para certificar facturas.
                </p>
              </div>

              {/* Vista Desktop: Tabla semántica con caption y th scope */}
              <div className="hidden md:block overflow-x-auto border border-sat-gris rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <caption className="sr-only">
                    Tabla 1: Registro oficial de certificadores privados autorizados por la SAT
                  </caption>
                  <thead className="bg-sat-fondo-tenue border-b border-sat-gris text-sat-azul-oscuro">
                    <tr>
                      <th scope="col" className="py-3 px-4 font-bold">Certificador</th>
                      <th scope="col" className="py-3 px-4 font-bold">Dirección</th>
                      <th scope="col" className="py-3 px-4 font-bold">Contacto</th>
                      <th scope="col" className="py-3 px-4 font-bold whitespace-nowrap">Autorización y vigencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sat-gris/70 text-sat-texto-suave">
                    {FEL_CERTIFICADORES.map((cert) => (
                      <tr key={cert.nombre} className="hover:bg-sat-fondo-tenue/60 transition-colors align-top">
                        <td className="py-3.5 px-4 space-y-1">
                          <div className="font-bold text-sat-azul-oscuro">{cert.nombre}</div>
                          <div>NIT: {cert.nit || 'No disponible'}</div>
                          {cert.web && (
                            <div>
                              <a
                                href={cert.web}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1"
                              >
                                <span>{cert.web.replace('https://', '').replace('http://', '')}</span>
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              </a>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 leading-relaxed">{cert.direccion || 'No disponible'}</td>
                        <td className="py-3.5 px-4 leading-relaxed">{formatContactInfo(cert.contacto) || 'No disponible'}</td>
                        <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                          <div>Autorizado: {cert.autorizacion || 'n/a'}</div>
                          <div>Vence: {cert.renovacion || 'n/a'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Vista Mobile (< 768px): Bloques apilados sin scroll horizontal */}
              <div className="md:hidden divide-y divide-sat-gris border border-sat-gris rounded-xl">
                {FEL_CERTIFICADORES.map((cert) => (
                  <div key={cert.nombre} className="p-4 space-y-2 text-xs text-sat-texto-suave">
                    <div>
                      <h3 className="text-sm font-bold text-sat-azul-oscuro">{cert.nombre}</h3>
                      <p>NIT: {cert.nit || 'No disponible'} • Vence: {cert.renovacion || 'n/a'}</p>
                    </div>
                    <p className="leading-relaxed">{cert.direccion || 'No disponible'}</p>
                    <p className="leading-relaxed">
                      <strong className="text-sat-azul-oscuro">Contacto:</strong> {formatContactInfo(cert.contacto) || 'No disponible'}
                    </p>
                    {cert.web && (
                      <a
                        href={cert.web}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1 min-h-[44px]"
                      >
                        <span>{cert.web.replace('https://', '').replace('http://', '')}</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-xs text-sat-texto-suave leading-relaxed">
                <strong>Nota:</strong> Las fechas de autorización y renovación corresponden al registro oficial vigente supervisado por la SAT.
              </p>
            </section>

            {/* MENOR IMPORTANCIA AL PIE (Pirámide Invertida): Solicitudes en proceso y cómo autorizarse */}
            <section aria-labelledby="autorizarse-cert-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h2 id="autorizarse-cert-heading" className="text-lg font-black text-sat-azul-oscuro">
                Empresas en proceso y solicitud de autorización
              </h2>
              <p className="text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <strong>Empresas en proceso de autorización:</strong> actualmente no hay solicitudes activas en proceso ante la SAT.
              </p>
              <p className="text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                Si tu empresa desea acreditarse como certificador privado, consulta los requisitos oficiales:
              </p>
              <div>
                <a
                  href="https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/80213/procedimiento-de-autorizacion-de-certificador.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-sat-azul hover:underline min-h-[44px]"
                >
                  <span>Descargar procedimiento para autorizarse como certificador (PDF)</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
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
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                  Documentación técnica de Factura Electrónica (FEL)
                </h1>
                <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                  Consulta las especificaciones oficiales, esquemas de validación (XSD), casos de prueba y servicios web para conectar sistemas contables o de gestión empresarial (ERP) con Factura Electrónica (FEL) en la Tabla 1.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/25545/fel-casos-de-prueba.zip', '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Descargar casos de prueba (ZIP)</span>
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => window.open('https://portal.sat.gob.gt/portal/descarga/14852/reglas-y-validaciones/97423/fel_reglas_y_validaciones-3', '_blank', 'noopener,noreferrer')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <span>Reglas y validaciones oficiales (PDF)</span>
                </Button>
              </div>
            </header>

            {/* ESTRUCTURA EN LISTA ORDENADA (Style Manual: Lists) */}
            <section aria-labelledby="arquitectura-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-3">
              <h2 id="arquitectura-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                Cómo funciona la integración técnica
              </h2>
              <p className="text-xs sm:text-sm text-sat-texto-suave">
                Todo sistema que se conecte al régimen FEL debe cumplir tres requisitos técnicos:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                <li>
                  <strong className="text-sat-azul-oscuro">Formato XML y firma electrónica:</strong> genera cada documento en XML bajo el estándar UBL / SAT (UTF-8) y fírmalo con un certificado digital X.509.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Servicios web seguros (SOAP y REST):</strong> envía, certifica y consulta documentos mediante HTTPS con autenticación mutua TLS.
                </li>
                <li>
                  <strong className="text-sat-azul-oscuro">Asignación de Identificador Universal Único (UUID):</strong> cada documento autorizado recibe un código único de 32 caracteres hexadecimales que garantiza su validez fiscal.
                </li>
              </ol>
            </section>

            {/* ESTRUCTURA EN TABLA ACCESIBLE (Style Manual: Tables) */}
            <section aria-labelledby="docs-tecnicos-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <h2 id="docs-tecnicos-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                  Documentos técnicos, guías y esquemas oficiales ({FEL_TECNICA_DOCS.length})
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave">
                  La Tabla 1 reúne las {FEL_TECNICA_DOCS.length} especificaciones oficiales publicadas por la SAT para integradores y certificadores.
                </p>
              </div>

              {/* Vista Desktop: Tabla semántica */}
              <div className="hidden md:block overflow-x-auto border border-sat-gris rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <caption className="sr-only">
                    Tabla 1: Documentación técnica oficial y esquemas XSD de Factura Electrónica (FEL)
                  </caption>
                  <thead className="bg-sat-fondo-tenue border-b border-sat-gris text-sat-azul-oscuro">
                    <tr>
                      <th scope="col" className="py-3 px-4 font-bold w-16">No.</th>
                      <th scope="col" className="py-3 px-4 font-bold">Documento</th>
                      <th scope="col" className="py-3 px-4 font-bold w-36">Tipo</th>
                      <th scope="col" className="py-3 px-4 font-bold w-40">Descarga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sat-gris/70 text-sat-texto-suave">
                    {FEL_TECNICA_DOCS.map((doc) => {
                      const formato = doc.link.includes('github') ? 'Esquema XSD' : doc.link.includes('.zip') ? 'Archivo ZIP' : 'Documento PDF';
                      const accion = doc.link.includes('github') ? 'Ver en GitHub' : doc.link.includes('.zip') ? 'Descargar (ZIP)' : 'Descargar (PDF)';
                      return (
                        <tr key={doc.num} className="hover:bg-sat-fondo-tenue/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-sat-azul-oscuro">{doc.num}</td>
                          <td className="py-3.5 px-4 font-medium text-sat-azul-oscuro">{doc.name}</td>
                          <td className="py-3.5 px-4">{formato}</td>
                          <td className="py-3.5 px-4">
                            <a
                              href={doc.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <span>{accion}</span>
                              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista Mobile (< 768px): Bloques apilados */}
              <div className="md:hidden divide-y divide-sat-gris border border-sat-gris rounded-xl">
                {FEL_TECNICA_DOCS.map((doc) => {
                  const formato = doc.link.includes('github') ? 'Esquema XSD' : doc.link.includes('.zip') ? 'Archivo ZIP' : 'Documento PDF';
                  const accion = doc.link.includes('github') ? 'Ver esquema en GitHub' : doc.link.includes('.zip') ? 'Descargar archivo (ZIP)' : 'Descargar documento (PDF)';
                  return (
                    <div key={doc.num} className="p-4 space-y-1.5 text-xs text-sat-texto-suave">
                      <p className="font-bold text-sat-azul-oscuro text-sm">
                        {doc.num}. {doc.name}
                      </p>
                      <p>{formato}</p>
                      <a
                        href={doc.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1 min-h-[44px]"
                      >
                        <span>{accion}</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 5: AUDITOR DE SEGURIDAD (/portal/auditor-de-seguridad-de-la-informacion/) */}
        {/* ======================================================== */}
        {currentTab === 'auditor' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO: Resumen, orientación y acción primaria */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Auditor de seguridad de la información (FEL)
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Es la entidad autorizada por la SAT para certificar los procesos y requisitos funcionales de los Certificadores de Documentos Tributarios Electrónicos (DTE), con lo cual garantiza que el Certificador cumple con los requerimientos técnicos del Régimen de Factura Electrónica en Línea (FEL), en cuanto a la integridad y calidad de la información.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  href="https://portal.sat.gob.gt/portal/descarga/6524/factura-electronica-fel/91828/fel-procedimiento-de-autorizacion-del-auditor-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  icon={<ExternalLink className="w-4 h-4" aria-hidden="true" />}
                >
                  Requisitos y procedimiento para autorizarse como auditor
                </Button>
              </div>
            </header>

            {/* CAPA 2 ATO: Directorio oficial de auditores autorizados */}
            <section aria-labelledby="directorio-auditor-heading" className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <div className="space-y-1">
                <h2 id="directorio-auditor-heading" className="text-lg sm:text-xl font-black text-sat-azul-oscuro">
                  Auditores de seguridad autorizados ({FEL_AUDITORES.length})
                </h2>
                <p className="text-xs sm:text-sm text-sat-texto-suave leading-relaxed">
                  Consulta los datos de contacto, dirección y fecha de registro de las entidades autorizadas por la SAT en la Tabla 1.
                </p>
              </div>

              {/* Vista Desktop (>= 768px): Tabla semántica accesible */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <caption className="text-left text-xs font-bold text-sat-texto-suave pb-3">
                    Tabla 1: Auditores de seguridad de la información autorizados por la SAT
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-sat-gris text-sat-azul-oscuro font-bold">
                      <th scope="col" className="py-3 pr-4">Auditor</th>
                      <th scope="col" className="py-3 px-4">Dirección</th>
                      <th scope="col" className="py-3 px-4">Contacto</th>
                      <th scope="col" className="py-3 pl-4 whitespace-nowrap">Fecha de registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sat-gris">
                    {FEL_AUDITORES.map((aud) => {
                      const contactoLimpio = formatContactInfo(aud.contacto);
                      return (
                        <tr key={aud.nombre} className="align-top hover:bg-sat-fondo-tenue/50 transition-colors">
                          <td className="py-3.5 pr-4 space-y-1">
                            <p className="font-bold text-sat-azul-oscuro text-sm leading-snug">
                              {aud.nombre}
                            </p>
                            {aud.nit && (
                              <p className="text-[11px] text-sat-texto-suave">
                                NIT: {aud.nit}
                              </p>
                            )}
                            {aud.web && (
                              <a
                                href={aud.web}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1"
                              >
                                <span>{aud.web.replace('https://', '').replace('http://', '')}</span>
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                              </a>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-sat-texto-suave leading-relaxed max-w-xs">
                            {aud.direccion}
                          </td>
                          <td className="py-3.5 px-4 text-sat-texto-suave leading-relaxed max-w-xs">
                            {contactoLimpio || 'Sin datos de contacto publicados'}
                          </td>
                          <td className="py-3.5 pl-4 text-sat-texto-suave whitespace-nowrap">
                            {aud.fecha_reg}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista Mobile (< 768px): Bloques apilados */}
              <div className="md:hidden divide-y divide-sat-gris border border-sat-gris rounded-xl">
                {FEL_AUDITORES.map((aud) => {
                  const contactoLimpio = formatContactInfo(aud.contacto);
                  return (
                    <div key={aud.nombre} className="p-4 space-y-1.5 text-xs text-sat-texto-suave">
                      <p className="font-bold text-sat-azul-oscuro text-sm">
                        {aud.nombre}
                      </p>
                      {aud.nit && <p>NIT: {aud.nit}</p>}
                      <p>{aud.direccion}</p>
                      {contactoLimpio && (
                        <p>
                          <strong className="text-sat-azul-oscuro">Contacto:</strong> {contactoLimpio}
                        </p>
                      )}
                      <p>
                        <strong className="text-sat-azul-oscuro">Fecha de registro:</strong> {aud.fecha_reg}
                      </p>
                      {aud.web && (
                        <a
                          href={aud.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sat-azul hover:underline font-semibold inline-flex items-center gap-1 min-h-[44px]"
                        >
                          <span>{aud.web.replace('https://', '').replace('http://', '')}</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 6: PREGUNTAS FRECUENTES (/portal/preguntas-frecuentes/) */}
        {/* ======================================================== */}
        {currentTab === 'faq' && (
          <div className="space-y-8">
            {/* CAPA 1 ATO: Resumen, orientación y filtro rápido */}
            <header className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-sat-azul-oscuro tracking-tight">
                Preguntas frecuentes sobre Factura Electrónica (FEL)
              </h1>
              <p className="text-sm text-sat-texto-suave leading-relaxed max-w-3xl">
                Respuestas directas sobre habilitación, emisión gratuita, anulación, uso de la aplicación móvil y regímenes especiales. Selecciona una pregunta o filtra por palabra clave.
              </p>

              <div className="pt-1 max-w-xl">
                <label htmlFor="fel-faq-search" className="sr-only">
                  Buscar en preguntas frecuentes sobre Factura Electrónica (FEL)
                </label>
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-sat-texto-suave absolute left-3.5 pointer-events-none" aria-hidden="true" />
                  <input
                    id="fel-faq-search"
                    type="search"
                    value={faqQuery}
                    onChange={(e) => setFaqQuery(e.target.value)}
                    placeholder="Filtrar preguntas (ej. anulación, Q2,500, voz, DUCA)..."
                    className="w-full min-h-[44px] pl-10 pr-11 py-2 rounded-sat-sm border border-sat-gris bg-sat-fondo-tenue/50 text-xs sm:text-sm text-sat-azul-oscuro placeholder:text-sat-texto-suave focus:outline-none focus:bg-sat-blanco focus:border-sat-azul focus:ring-2 focus:ring-sat-azul/20 transition-colors"
                  />
                  {faqQuery && (
                    <button
                      type="button"
                      onClick={() => setFaqQuery('')}
                      aria-label="Limpiar búsqueda"
                      className="absolute right-1 w-10 h-10 inline-flex items-center justify-center rounded-sat-sm text-sat-texto-suave hover:text-sat-azul-oscuro focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-sat-texto-suave mt-2" aria-live="polite">
                  {normalizedFaqQuery
                    ? `${totalFaqMatches} ${totalFaqMatches === 1 ? 'pregunta encontrada' : 'preguntas encontradas'} para «${faqQuery.trim()}»`
                    : `${totalFaqMatches} preguntas frecuentes organizadas en ${filteredFaqSections.length} temas`}
                </p>
              </div>
            </header>

            {/* CAPA 2 ATO: Acordeones colapsables por tema (divulgación progresiva) */}
            {filteredFaqSections.length === 0 ? (
              <section className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm text-center space-y-3">
                <p className="text-sm font-bold text-sat-azul-oscuro">
                  No se encontraron preguntas que coincidan con «{faqQuery.trim()}».
                </p>
                <p className="text-xs text-sat-texto-suave">
                  Intenta con otro término como DTE, RTU, pequeño contribuyente o contingencia.
                </p>
                <div>
                  <Button variant="outline" size="sm" onClick={() => setFaqQuery('')}>
                    Mostrar todas las preguntas
                  </Button>
                </div>
              </section>
            ) : (
              <div className="space-y-6">
                {filteredFaqSections.map(([categoria, items], idxCat) => (
                  <section
                    key={categoria}
                    aria-labelledby={`cat-heading-${idxCat}`}
                    className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm"
                  >
                    <h2
                      id={`cat-heading-${idxCat}`}
                      className="text-base sm:text-lg font-black text-sat-azul-oscuro border-b border-sat-gris pb-3 mb-2"
                    >
                      {categoria} ({items.length})
                    </h2>

                    <div className="divide-y divide-sat-gris/70">
                      {items.map((item) => (
                        <details
                          key={item.q}
                          open={Boolean(normalizedFaqQuery)}
                          className="group py-1"
                        >
                          <summary className="cursor-pointer list-none min-h-[44px] py-2.5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-sat-azul-oscuro hover:text-sat-azul leading-snug focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded-lg">
                            <span>{item.q}</span>
                            <ChevronDown
                              className="w-4 h-4 shrink-0 text-sat-azul transition-transform duration-200 group-open:rotate-180"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="pb-3.5 pt-1 pr-6 text-xs sm:text-sm text-sat-texto-suave leading-relaxed whitespace-pre-line">
                            {renderFaqAnswer(item.a, setCurrentTab)}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        )}


        {/* ======================================================== */}
        {/* CAPA 3 ATO: CERTEZA JURÍDICA COMÚN AL PIE DE PÁGINA     */}
        {/* ======================================================== */}
        {currentTab !== 'tecnica' && currentTab !== 'auditor' && currentTab !== 'faq' && (
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
        )}

        </div>
      </div>
    </div>
  );
};

function renderFaqAnswer(text: string, onNavigateTab: (tab: FelTabId) => void): React.ReactNode {
  const tokenRegex = /(ayuda@sat\.gob\.gt|efactura@sat\.gob\.gt|portal\.sat\.gob\.gt\/portal\/verificador-integrado\/|portal\.sat\.gob\.gt\/portal\/|Habilitarse como emisor FEL|Certificadores autorizados de Factura Electrónica \(FEL\))/g;
  const parts = text.split(tokenRegex);
  return parts.map((part, idx) => {
    if (part === 'ayuda@sat.gob.gt' || part === 'efactura@sat.gob.gt') {
      return (
        <a key={idx} href={`mailto:${part}`} className="text-sat-azul font-semibold hover:underline">
          {part}
        </a>
      );
    }
    if (part === 'portal.sat.gob.gt/portal/verificador-integrado/') {
      return (
        <a
          key={idx}
          href="https://portal.sat.gob.gt/portal/verificador-integrado/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sat-azul font-semibold hover:underline inline-flex items-center gap-1"
        >
          <span>{part}</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      );
    }
    if (part === 'portal.sat.gob.gt/portal/') {
      return (
        <a
          key={idx}
          href="https://portal.sat.gob.gt/portal/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sat-azul font-semibold hover:underline inline-flex items-center gap-1"
        >
          <span>{part}</span>
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      );
    }
    if (part === 'Habilitarse como emisor FEL') {
      return (
        <button
          key={idx}
          type="button"
          onClick={() => onNavigateTab('emisor')}
          className="text-sat-azul font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded"
        >
          {part}
        </button>
      );
    }
    if (part === 'Certificadores autorizados de Factura Electrónica (FEL)') {
      return (
        <button
          key={idx}
          type="button"
          onClick={() => onNavigateTab('certificadores')}
          className="text-sat-azul font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul rounded"
        >
          {part}
        </button>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function formatContactInfo(raw: string): string {
  return raw
    .split('|')
    .map((part) => part.trim())
    .filter((part) => part && !/\[email/i.test(part) && !/^(correo|email):?$/i.test(part))
    .join(' • ')
    .replace(/:\s*•\s*/g, ': ');
}

function getTabLabel(tab: FelTabId): string {
  switch (tab) {
    case 'emisor': return 'Habilitación de Emisores';
    case 'certificadores': return 'Certificadores Autorizados';
    case 'tecnica': return 'Documentación Técnica';
    case 'auditor': return 'Auditor de Seguridad';
    case 'faq': return 'Preguntas Frecuentes';
    default: return 'Factura Electrónica (FEL)';
  }
}
