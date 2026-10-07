import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ExternalLink,
  HelpCircle,
  Phone
} from 'lucide-react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  options?: { label: string; action: string }[];
}

export const VirtualAssistantModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: '¡Hola! Soy RITA, tu asistente virtual de SAT Guatemala. ¿En qué trámite o consulta tributaria te puedo orientar hoy?',
      options: [
        { label: '¿Cómo solicitar mi primer NIT?', action: 'primer_nit' },
        { label: 'Imprimir o actualizar mi RTU', action: 'rtu' },
        { label: 'Facturación Electrónica FEL', action: 'fel' },
        { label: 'Consultar estado de mi gestión', action: 'gestion' }
      ]
    }
  ]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    // Add user message
    const newMessages: Message[] = [...messages, { sender: 'user', text }];
    setMessages(newMessages);
    if (!textToSend) setInputVal('');

    // Instant smart response based on keywords
    setTimeout(() => {
      let botReply: Message;
      const lower = text.toLowerCase();

      if (lower.includes('nit') || lower.includes('primer')) {
        botReply = {
          sender: 'bot',
          text: 'Para solicitar tu NIT por primera vez sin negocio (o con negocio), necesitas tu DPI o partida de nacimiento si eres menor, y un correo electrónico válido. Puedes realizarlo 100% digital desde la sección de RTU Digital.',
          options: [
            { label: 'Abrir trámite de Solicitud de NIT', action: 'open_nit' },
            { label: '¿Cuál es mi NIT con CUI?', action: 'cui_nit' }
          ]
        };
      } else if (lower.includes('rtu') || lower.includes('actualiz')) {
        botReply = {
          sender: 'bot',
          text: 'La actualización en RTU Digital es obligatoria una vez al año o al cambiar de domicilio/actividad. Solo debes ingresar a tu Agencia Virtual > Servicios al Contribuyente > Actualización de RTU.',
          options: [
            { label: 'Ir a Agencia Virtual', action: 'open_av' }
          ]
        };
      } else if (lower.includes('fel') || lower.includes('factura')) {
        botReply = {
          sender: 'bot',
          text: 'Puedes emitir tus facturas electrónicas FEL de forma gratuita desde la Agencia Virtual web o descargando la App SAT FEL en tu teléfono.',
          options: [
            { label: 'Conoce más de SAT FEL', action: 'fel_info' }
          ]
        };
      } else {
        botReply = {
          sender: 'bot',
          text: `Entendido. Para "${text}", te recomiendo explorar el catálogo de trámites según tu tipo de contribuyente o comunicarte al Contact Center 1550 para asistencia personalizada.`,
          options: [
            { label: 'Llamar al 1550', action: 'call_1550' }
          ]
        };
      }

      setMessages((prev) => [...prev, botReply]);
    }, 500);
  };

  const handleOptionClick = (opt: { label: string; action: string }) => {
    if (opt.action === 'call_1550') {
      window.open('tel:1550', '_self');
    } else if (opt.action === 'open_av') {
      window.open('https://farm3.sat.gob.gt/menu/login.jsf', '_blank');
    } else if (opt.action === 'open_nit') {
      window.open('https://portal.sat.gob.gt/portal/rtu-digital/inscripcion-solicitud-de-nit/', '_blank');
    } else {
      handleSend(opt.label);
    }
  };

  return (
    <>
      {/* Botón Flotante Asistente Virtual (Slide 5) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 p-3.5 bg-gradient-to-r from-[#14649B] to-[#0284C7] text-white rounded-full shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group border-2 border-white"
        aria-label="Abrir asistente virtual RITA"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
        </div>
        <span className="text-xs font-bold hidden sm:inline pr-1">Asistente SAT</span>
      </button>

      {/* Modal / Ventana de Chat */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[550px] animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="bg-[#19324B] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#14649B] flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold leading-tight flex items-center gap-1">
                  RITA · Asistente Virtual <Sparkles className="w-3 h-3 text-sky-300" />
                </h3>
                <span className="text-[10px] text-emerald-400 font-medium">● En línea · SAT Guatemala</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
              aria-label="Cerrar chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#14649B] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    R
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#14649B] text-white rounded-br-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {msg.text}

                  {/* Quick option buttons */}
                  {msg.options && (
                    <div className="mt-2.5 space-y-1.5 pt-2 border-t border-slate-100">
                      {msg.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionClick(opt)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 text-[#14649B] font-bold text-[11px] transition-colors flex items-center justify-between"
                        >
                          <span>{opt.label}</span>
                          <span className="text-xs">›</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <label htmlFor="rita-message" className="sr-only">
              Escribe tu consulta tributaria
            </label>
            <input
              id="rita-message"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Escribe tu consulta tributaria..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#14649B] focus:ring-1 focus:ring-[#14649B] outline-none"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2 bg-[#14649B] text-white rounded-xl hover:bg-[#11507C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
