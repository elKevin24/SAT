# -*- coding: utf-8 -*-
import json

# Generador del bloque completo de las vistas certificadores, tecnica, auditor y faq
views_tsx = '''
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
                    Listado oficial autorizado y fiscalizado por la Intendencia de Recaudación de la SAT.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {/* Opción 1: SAT Pública Gratuita */}
                <div
                  onClick={() => setCurrentTab('emisor')}
                  className="group bg-sat-blanco border-2 border-sat-azul/40 rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
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
                </div>

                {/* 18 Certificadores Privados Oficiales */}
                {FEL_CERTIFICADORES.map((cert) => (
                  <div
                    key={cert.nombre}
                    onClick={() => {
                      if (cert.web) window.open(cert.web, '_blank', 'noopener,noreferrer');
                    }}
                    className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
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

                    <div className="pt-3 mt-3 border-t border-sat-gris/60 group-hover:border-white/20 text-[11px] text-sat-texto-suave group-hover:text-white/80 space-y-1">
                      <p className="truncate"><strong>Contacto:</strong> {cert.contacto.replace(/\\|/g, ' • ')}</p>
                      {cert.web && (
                        <p className="text-sat-azul group-hover:text-white font-semibold underline truncate">
                          {cert.web.replace('https://', '').replace('http://', '')}
                        </p>
                      )}
                    </div>
                  </div>
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
                  <div
                    key={aud.nombre}
                    onClick={() => {
                      if (aud.web) window.open(aud.web, '_blank', 'noopener,noreferrer');
                    }}
                    className="group bg-sat-blanco border border-sat-gris rounded-2xl p-5 hover:bg-[#14649B] hover:-translate-y-1 hover:shadow-sat-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-2">
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

                    <div className="pt-3 mt-3 border-t border-sat-gris/60 group-hover:border-white/20 text-[11px] text-sat-texto-suave group-hover:text-white/80 space-y-1">
                      <p className="truncate"><strong>Contacto:</strong> {aud.contacto.replace(/\\|/g, ' • ')}</p>
                      {aud.web && (
                        <p className="text-sat-azul group-hover:text-white font-semibold underline truncate">
                          {aud.web.replace('https://', '').replace('http://', '')}
                        </p>
                      )}
                    </div>
                  </div>
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
              {Object.entries(FEL_FAQS).map(([categoria, items]) => (
                <section key={categoria} aria-labelledby={cat-} className="bg-sat-blanco rounded-2xl border border-sat-gris p-6 sm:p-8 shadow-sat-sm space-y-4">
                  <h2 id={cat-} className="text-lg font-black text-sat-azul-oscuro border-b border-sat-gris pb-3">
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
'''

with open('src/pages/FelPage.tsx', 'r', encoding='utf-8') as f:
    orig = f.read()

# Marker 1: start of certificadores
m1 = '{/* ======================================================== */}\\n        {/* VISTA 3: CERTIFICADORES (/portal/certificador-de-dte/)   */}'
# Marker 2: start of base legal
m2 = '{/* ======================================================== */}\\n        {/* CAPA 3 ATO: CERTEZA JURÍDICA COMÚN AL PIE DE PÁGINA     */}'

part1 = orig.split(m1)[0]
part2 = orig.split(m2)[1]

# Ensure imports at the top include the data
new_import = "import { FEL_CERTIFICADORES, FEL_AUDITORES, FEL_TECNICA_DOCS, FEL_FAQS } from '../data/felEcosystemData';\\n"
if "felEcosystemData" not in part1:
    part1 = part1.replace("import { FelSubnav, FelTabId } from '../components/FelSubnav';", "import { FelSubnav, FelTabId } from '../components/FelSubnav';\\n" + new_import)

new_full_content = part1 + views_tsx.strip() + "\\n\\n        " + m2 + part2

with open('src/pages/FelPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_full_content)

print("FelPage.tsx actualizado exitosamente con todas las vistas!")
