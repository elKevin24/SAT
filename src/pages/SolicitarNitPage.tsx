import React from 'react';
import { ArrowLeft, ExternalLink, Search, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface SolicitarNitPageProps {
  onBackToHome: () => void;
  onOpenConsultasNIT?: () => void;
  onOpenProcesoGuiado?: () => void;
}

export const SolicitarNitPage: React.FC<SolicitarNitPageProps> = ({
  onBackToHome,
  onOpenConsultasNIT,
  onOpenProcesoGuiado
}) => {
  return (
    <div className="bg-sat-fondo-tenue min-h-screen pt-2 sm:pt-3 pb-8 text-sat-texto antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        
        {/* 1. Miga de pan y control de retorno con componentes oficiales */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-2 sm:pb-2.5 border-b border-sat-gris">
          <Breadcrumbs
            items={[
              { label: 'Gestiones', onClick: onBackToHome },
              { label: 'Solicitar mi primer NIT', isCurrent: true }
            ]}
            onHomeClick={onBackToHome}
          />

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sat-azul hover:text-sat-azul-oscuro transition-colors py-1 px-2.5 rounded-sat-sm hover:bg-sat-fondo-medio focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul min-h-[32px] self-start sm:self-auto"
            aria-label="Volver a la página principal"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </button>
        </div>

        {/* 2. Hero Principal con Tokens Normativos SAT */}
        <header className="bg-sat-blanco rounded-sat-lg border border-sat-gris p-5 sm:p-7 shadow-sat-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-2.5 sm:space-y-3 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-black text-sat-azul-oscuro tracking-tight leading-tight">
              Solicitar mi primer NIT
            </h1>
            <p className="text-sm sm:text-base text-sat-texto-suave leading-relaxed">
              Guía oficial para obtener tu Número de Identificación Tributaria (NIT) en línea. Necesario para tu primer empleo, apertura de cuentas bancarias, facturar o abrir tu negocio.
            </p>
          </div>
        </header>

        {/* 3. Los 3 Pasos Oficiales con Componente Card Oficial (Hover sólido, surface 100% clickeable, sin íconos decorativos) */}
        <section aria-labelledby="pasos-heading" className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Recorrido Oficial en 3 Pasos
            </span>
            <h2 id="pasos-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
              Pasos indispensables para obtener tu NIT
            </h2>
            <p className="text-xs sm:text-sm text-sat-texto-suave">
              Sigue la secuencia lógica: infórmate sobre los requisitos, ingresa la solicitud electrónica y asegura tu cita si corresponde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            {/* Paso 1: Requisitos de Inscripción */}
            <Card
              title="Requisitos de Inscripción"
              description="Verifica previamente la documentación exigida para personas individuales, profesionales o empresas según tu actividad económica."
              tone="azul"
              badges={<Badge tone="neutral" dot={false}>Paso 01 · Informativo</Badge>}
              footer={
                <span className="flex items-center justify-between w-full">
                  <span>Consultar requisitos oficiales</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://portal.sat.gob.gt/portal/requisitos-de-personas-empresas/#1615485066841-639e67c5-51e3', '_blank')}
            />

            {/* Paso 2: Solicitar NIT en Línea */}
            <Card
              title="Solicitar NIT en Línea"
              description="Ingresa al formulario electrónico oficial del RTU Digital para completar tus datos personales, validar tu DPI y emitir tu solicitud."
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
              title="Agendar mi Cita"
              description="Si tu personería requiere confirmación presencial o por videollamada, programa tu atención en la fecha y agencia de tu preferencia."
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

        {/* 4. Herramientas de Apoyo con Botones Oficiales */}
        <section aria-labelledby="apoyo-heading" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-sat-blanco rounded-sat-lg border border-sat-gris p-6 space-y-3">
            <h3 id="apoyo-heading" className="text-base font-bold text-sat-azul-oscuro flex items-center gap-2">
              <Search className="w-4 h-4 text-sat-azul" />
              <span>¿Ya tienes NIT y no lo recuerdas?</span>
            </h3>
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Si solicitaste tu NIT en el pasado o no estás seguro de tu número, consúltalo al instante ingresando tu número de DPI (CUI).
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

          <div className="bg-sat-blanco rounded-sat-lg border border-sat-gris p-6 space-y-3">
            <h3 className="text-base font-bold text-sat-azul-oscuro flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sat-azul" />
              <span>Recorrido Guiado Paso a Paso</span>
            </h3>
            <p className="text-xs text-sat-texto-suave leading-relaxed">
              Explora la guía oficial para obtener tu primer NIT con cada una de sus etapas detalladas para no cometer omisos.
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
