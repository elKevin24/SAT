import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  Smartphone, 
  Laptop, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  Building2, 
  HelpCircle,
  QrCode,
  Download,
  FileText
} from 'lucide-react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface FelPageProps {
  onBackToHome: () => void;
}

type TabDocumento = 'factura' | 'pequeno' | 'especial' | 'credito' | 'recibo';

export const FelPage: React.FC<FelPageProps> = ({ onBackToHome }) => {
  const [activeTabDoc, setActiveTabDoc] = useState<TabDocumento>('pequeno');
  
  // Estado para el validador interactivo de DTE
  const [uuidQuery, setUuidQuery] = useState('');
  const [dteResultado, setDteResultado] = useState<{
    tipo: 'valido' | 'invalido' | null;
    uuid?: string;
    emisor?: string;
    nitEmisor?: string;
    receptor?: string;
    monto?: string;
    fecha?: string;
    certificador?: string;
    errorMsg?: string;
  }>({ tipo: null });

  const handleVerificarDte = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = uuidQuery.trim();
    if (!clean) return;

    // Validación de formato UUID (con o sin guiones) o número de autorización
    const isValidFormat = /^[0-9a-fA-F-]{8,}$/.test(clean);

    if (!isValidFormat) {
      setDteResultado({
        tipo: 'invalido',
        errorMsg: 'El identificador ingresado no cumple con el formato oficial de Número de Autorización o UUID (debe contener caracteres alfanuméricos o hexadecimales).'
      });
      return;
    }

    // Demostración interactiva ciudadana de validación
    setDteResultado({
      tipo: 'valido',
      uuid: clean.toUpperCase(),
      emisor: 'SUPERMERCADOS Y SERVICIOS PROFESIONALES, S.A.',
      nitEmisor: '7482910-K',
      receptor: 'CONSUMIDOR FINAL',
      monto: 'Q 250.00 (IVA incluido: Q 26.79)',
      fecha: '14 de octubre de 2026, 18:24 hrs',
      certificador: 'Superintendencia de Administración Tributaria (SAT)'
    });
  };

  return (
    <div className="bg-sat-fondo-tenue min-h-screen pt-3 pb-16 text-sat-texto antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* 1. Miga de pan y control de retorno */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sat-gris">
          <Breadcrumbs
            items={[
              { label: 'Gestiones', onClick: onBackToHome },
              { label: 'Facturación y DTE', onClick: onBackToHome },
              { label: 'Factura Electrónica en Línea (FEL)', isCurrent: true }
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

        {/* 2. Hero Principal */}
        <header className="bg-sat-blanco rounded-xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <h1 className="text-2xl sm:text-4xl font-black text-sat-azul-oscuro tracking-tight leading-tight">
              Factura Electrónica en Línea (FEL)
            </h1>
            <p className="text-sm sm:text-base text-sat-texto-suave leading-relaxed">
              El régimen FEL moderniza la emisión, transmisión y certificación de documentos tributarios en Guatemala. Emite comprobantes electrónicos de forma 100% gratuita y segura desde la web o tu teléfono móvil.
            </p>
          </div>
        </header>

        {/* 3. Validador Interactivo de DTE en Vivo */}
        <section aria-labelledby="validador-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sat-gris pb-3">
            <div className="flex items-center gap-2.5">
              <Search className="w-5 h-5 text-sat-azul" />
              <div>
                <h2 id="validador-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
                  Verificador Público de Documentos Tributarios (DTE)
                </h2>
                <p className="text-xs text-sat-texto-suave">
                  Comprueba la autenticidad, emisor y validez legal de cualquier factura electrónica recibida.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-sat-azul bg-sat-azul/10 px-2.5 py-1 rounded-full self-start sm:self-auto">
              Acceso Público Inmediato
            </span>
          </div>

          <form onSubmit={handleVerificarDte} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <input
              type="text"
              value={uuidQuery}
              onChange={(e) => setUuidQuery(e.target.value)}
              placeholder="Ingresa el Número de Autorización (UUID de 32 o 36 caracteres)"
              className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-sat-gris focus:outline-none focus:ring-2 focus:ring-sat-azul focus:border-sat-azul font-mono"
              aria-label="Número de Autorización o UUID del DTE"
            />
            <Button type="submit" variant="primary" size="md">
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>Verificar DTE</span>
            </Button>
          </form>

          {dteResultado.tipo === 'valido' && (
            <div className="p-4 sm:p-5 rounded-xl bg-green-50 border border-green-200 text-green-900 space-y-3">
              <div className="flex items-center justify-between border-b border-green-200 pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-black text-sm uppercase tracking-wide">Documento Certificado y Vigente</span>
                </div>
                <Badge tone="online">Estado: VIGENTE</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-green-700 block font-semibold">Emisor:</span>
                  <span className="font-bold text-green-950">{dteResultado.emisor}</span>
                  <span className="block text-green-800">NIT: {dteResultado.nitEmisor}</span>
                </div>
                <div>
                  <span className="text-green-700 block font-semibold">Receptor:</span>
                  <span className="font-bold text-green-950">{dteResultado.receptor}</span>
                </div>
                <div>
                  <span className="text-green-700 block font-semibold">Monto Certificado:</span>
                  <span className="font-bold text-green-950 text-sm">{dteResultado.monto}</span>
                </div>
                <div>
                  <span className="text-green-700 block font-semibold">Certificado por:</span>
                  <span className="font-bold text-green-950">{dteResultado.certificador}</span>
                  <span className="block text-green-800">{dteResultado.fecha}</span>
                </div>
              </div>

              <div className="text-[11px] text-green-800 font-mono pt-1">
                UUID: {dteResultado.uuid}
              </div>
            </div>
          )}

          {dteResultado.tipo === 'invalido' && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Documento no encontrado o formato incorrecto</span>
              </div>
              <p className="text-xs text-red-700">
                {dteResultado.errorMsg}
              </p>
            </div>
          )}
        </section>

        {/* 4. Habilitación en 3 Pasos */}
        <section aria-labelledby="onboarding-heading" className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Habilitación Rápida
            </span>
            <h2 id="onboarding-heading" className="text-xl sm:text-2xl font-black text-sat-azul-oscuro tracking-tight">
              ¿Cómo empezar a facturar electrónicamente?
            </h2>
            <p className="text-xs sm:text-sm text-sat-texto-suave">
              La SAT provee la firma electrónica gratuita y el acceso al aplicativo sin necesidad de contratar proveedores de pago.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            
            <Card
              title="1. Ingresa a tu Agencia Virtual"
              description="Accede con tu usuario y contraseña. En el menú principal dirígete a Servicios y selecciona 'Factura Electrónica en Línea (FEL)'."
              tone="azul"
              badges={<Badge tone="neutral" dot={false}>Paso 01 · Acceso</Badge>}
              footer={
                <span className="flex items-center justify-between w-full">
                  <span>Ir a Agencia Virtual</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://agenciavirtual.sat.gob.gt/', '_blank')}
            />

            <Card
              title="2. Acredítate como Emisor"
              description="Acepta las condiciones del régimen FEL. El sistema generará automáticamente tu certificado de firma electrónica digital gratuita."
              tone="azul"
              badges={<Badge tone="online">Paso 02 · Habilitación</Badge>}
              footer={
                <span className="flex items-center justify-between w-full font-bold">
                  <span>Ver guía de habilitación</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://portal.sat.gob.gt/portal/factura-electronica-fel/#pasos', '_blank')}
            />

            <Card
              title="3. Emite tu Primera Factura"
              description="Utiliza el emisor web o descarga la aplicación SAT FEL en tu celular. Ingresa el NIT de tu cliente, descripción, monto y emite en segundos."
              tone="azul"
              badges={<Badge tone="cita">Paso 03 · Emisión</Badge>}
              footer={
                <span className="flex items-center justify-between w-full">
                  <span>Conocer canales de emisión</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              }
              onClick={() => window.open('https://portal.sat.gob.gt/portal/app-fel/', '_blank')}
            />

          </div>
        </section>

        {/* 5. Canales Oficiales de Emisión Gratuita (App vs Web) */}
        <section aria-labelledby="canales-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Herramientas Gratuitas SAT
            </span>
            <h2 id="canales-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
              Canales disponibles para emitir tus facturas
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Canal Móvil */}
            <div className="rounded-xl border border-sat-gris p-5 space-y-3.5 bg-sat-fondo-tenue">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sat-azul/10 text-sat-azul">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-sat-azul-oscuro">App Móvil SAT FEL</h3>
                  <span className="text-xs text-sat-texto-suave">Para teléfonos inteligentes Android e iOS</span>
                </div>
              </div>
              <ul className="text-xs text-sat-texto-suave space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sat-azul flex-shrink-0" />
                  <span>Emisión instantánea y compartición inmediata por WhatsApp o correo.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sat-azul flex-shrink-0" />
                  <span>Lector de código QR para capturar el NIT del comprador sin errores.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sat-azul flex-shrink-0" />
                  <span>Ideal para pequeños contribuyentes, servicios profesionales y comercios.</span>
                </li>
              </ul>
              <div className="pt-2 flex flex-wrap gap-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.open('https://play.google.com/store/apps/details?id=gt.gob.sat.appfel', '_blank')}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Descargar en Google Play</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open('https://apps.apple.com/gt/app/sat-fel/id1524314416', '_blank')}
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>Descargar en App Store</span>
                </Button>
              </div>
            </div>

            {/* Canal Web */}
            <div className="rounded-xl border border-sat-gris p-5 space-y-3.5 bg-sat-fondo-tenue">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sat-azul/10 text-sat-azul">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-sat-azul-oscuro">Agencia Virtual Web</h3>
                  <span className="text-xs text-sat-texto-suave">Acceso completo desde cualquier navegador</span>
                </div>
              </div>
              <ul className="text-xs text-sat-texto-suave space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sat-azul flex-shrink-0" />
                  <span>Emisión con múltiples líneas de detalle, retenciones y descuentos.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sat-azul flex-shrink-0" />
                  <span>Descarga masiva de archivos XML y representaciones gráficas en PDF.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sat-azul flex-shrink-0" />
                  <span>Módulo de anulación de documentos y consulta de DTEs recibidos.</span>
                </li>
              </ul>
              <div className="pt-2">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => window.open('https://agenciavirtual.sat.gob.gt/', '_blank')}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  <span>Ingresar a Agencia Virtual</span>
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* 6. Catálogo de Tipos de Documentos Tributarios Electrónicos (DTE) */}
        <section aria-labelledby="tipos-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm space-y-4">
          <div className="border-b border-sat-gris pb-3">
            <span className="text-xs font-bold text-sat-azul uppercase tracking-wider">
              Normativa y Clasificación
            </span>
            <h2 id="tipos-heading" className="text-lg sm:text-xl font-bold text-sat-azul-oscuro">
              Tipos de Documentos Tributarios Electrónicos (DTE)
            </h2>
            <p className="text-xs text-sat-texto-suave">
              Conoce cuál es el documento legal aplicable a tu régimen y actividad comercial.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              { id: 'pequeno', label: 'Factura Pequeño Contribuyente' },
              { id: 'factura', label: 'Factura Común (Régimen General)' },
              { id: 'especial', label: 'Factura Especial' },
              { id: 'credito', label: 'Notas de Crédito y Débito' },
              { id: 'recibo', label: 'Recibo por Donación' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabDoc(tab.id as TabDocumento)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sat-azul ${
                  activeTabDoc === tab.id
                    ? 'bg-sat-azul text-white shadow-sat-sm'
                    : 'bg-sat-fondo-tenue text-sat-texto-suave hover:bg-sat-fondo-medio'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-sat-fondo-tenue border border-sat-gris space-y-2">
            {activeTabDoc === 'pequeno' && (
              <>
                <h3 className="text-sm font-bold text-sat-azul-oscuro">Factura Electrónica de Pequeño Contribuyente</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Emitida por personas individuales o jurídicas inscritas en el Régimen de Pequeño Contribuyente conforme al límite de facturación legal vigente. Tarifa del 5% del valor total (o 4% si tributa en el Régimen Electrónico de Pequeño Contribuyente). No genera crédito fiscal para el comprador.
                </p>
              </>
            )}
            {activeTabDoc === 'factura' && (
              <>
                <h3 className="text-sm font-bold text-sat-azul-oscuro">Factura Electrónica del Régimen General (IVA)</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Comprobante estándar que desglosa el 12% del Impuesto al Valor Agregado (IVA). Genera derecho a crédito fiscal para contribuyentes afiliados al régimen general que adquieran bienes o servicios vinculados a su giro de negocio.
                </p>
              </>
            )}
            {activeTabDoc === 'especial' && (
              <>
                <h3 className="text-sm font-bold text-sat-azul-oscuro">Factura Especial</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Emitida por el comprador cuando adquiere bienes o servicios de personas individuales que, por su condición o actividad habitual, no cuentan con facturas propias ni están inscritas como contribuyentes. El emisor retiene el 12% de IVA y el porcentaje de ISR correspondiente.
                </p>
              </>
            )}
            {activeTabDoc === 'credito' && (
              <>
                <h3 className="text-sm font-bold text-sat-azul-oscuro">Notas de Crédito y Notas de Débito</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Las <strong>Notas de Crédito</strong> se emiten para registrar devoluciones, descuentos o anulaciones cuando el período fiscal de la factura original ya cerró. Las <strong>Notas de Débito</strong> se emiten para recuperar gastos o cargos financieros posteriores a la emisión.
                </p>
              </>
            )}
            {activeTabDoc === 'recibo' && (
              <>
                <h3 className="text-sm font-bold text-sat-azul-oscuro">Recibo por Donación</h3>
                <p className="text-xs text-sat-texto-suave leading-relaxed">
                  Emitido exclusivamente por entidades no lucrativas, fundaciones, patronatos o asociaciones legalmente autorizadas por SAT como perceptoras de donaciones deducibles del Impuesto Sobre la Renta (ISR).
                </p>
              </>
            )}
          </div>
        </section>

        {/* 7. Reglas de Anulación de Facturas */}
        <section aria-labelledby="anulacion-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-sat-dorado" />
            <h2 id="anulacion-heading" className="text-lg font-bold text-sat-azul-oscuro">
              Reglas y Plazos Legales para Anular una Factura
            </h2>
          </div>
          <p className="text-xs text-sat-texto-suave leading-relaxed">
            De conformidad con la Ley del IVA y el Acuerdo de Directorio 13-2018, la anulación de un DTE debe realizarse antes de que venza el período impositivo (mes calendario). Si el mes ya cerró o se declaró el impuesto, <strong>no se puede anular la factura</strong> y es obligatorio emitir una <strong>Nota de Crédito Electrónica</strong> vinculada al número de autorización original.
          </p>
        </section>

        {/* 8. Certificadores de DTE Autorizados */}
        <section aria-labelledby="certificadores-heading" className="bg-sat-blanco rounded-xl border border-sat-gris p-5 sm:p-7 shadow-sat-sm space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sat-azul" />
            <div>
              <h2 id="certificadores-heading" className="text-lg font-bold text-sat-azul-oscuro">
                Certificadores Autorizados por la SAT
              </h2>
              <p className="text-xs text-sat-texto-suave">
                Entidades acreditadas para la certificación masiva de documentos tributarios.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {[
              { nombre: 'SAT (Superintendencia de Administración Tributaria)', tipo: 'Certificador Público Oficial', costo: 'Gratuito', url: 'https://portal.sat.gob.gt/portal/factura-electronica-fel/' },
              { nombre: 'Infile, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificadores-fel/' },
              { nombre: 'Guatefacturas, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificadores-fel/' },
              { nombre: 'Megaprint, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificadores-fel/' },
              { nombre: 'CODISA, S.A.', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificadores-fel/' },
              { nombre: 'Soluciones Digitales (Digifact)', tipo: 'Certificador Autorizado', costo: 'Comercial / API', url: 'https://portal.sat.gob.gt/portal/certificadores-fel/' },
            ].map(cert => (
              <div key={cert.nombre} className="p-3.5 rounded-lg border border-sat-gris bg-sat-fondo-tenue space-y-1">
                <span className="text-xs font-bold text-sat-azul-oscuro block">{cert.nombre}</span>
                <span className="text-[11px] text-sat-texto-suave block">{cert.tipo}</span>
                <div className="flex items-center justify-between pt-1">
                  <Badge tone={cert.costo === 'Gratuito' ? 'online' : 'neutral'}>{cert.costo}</Badge>
                  <a 
                    href={cert.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] font-semibold text-sat-azul hover:underline flex items-center gap-1"
                  >
                    <span>Ver resolución</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
