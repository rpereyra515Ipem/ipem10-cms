'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  link?: {
    href: string;
    label: string;
  };
  isWelcome?: boolean;
}

// Avatar con zoom y centrado exclusivo en el rostro y casco de RomaBot
function RomaBotAvatar({ className = 'w-9 h-9' }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className="text-xl">🤖</span>;
  }

  return (
    <div className={`${className} rounded-full overflow-hidden bg-emerald-950 border border-amber-400/80 shrink-0 flex items-center justify-center relative shadow-inner`}>
      <img
        src="/romabot.png"
        alt="Rostro de RomaBot"
        className="w-full h-full object-contain drop-shadow"
        style={{
          transform: 'scale(3.6)',
          transformOrigin: '50% 18%',
        }}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function SchoolBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '¡Hola! Soy RomaBot, el asistente escolar oficial del IPEM N° 10 Roma. ¿En qué puedo ayudarte hoy?',
      isWelcome: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Base de conocimiento escolar
  function getBotResponse(query: string): { text: string; link?: { href: string; label: string } } {
    const q = query.toLowerCase();

    // Detección de horas libres, ausencias de profesores y novedades de preceptoría
    if (
      q.includes("profe") ||
      q.includes("profesor") ||
      q.includes("profesora") ||
      q.includes("falto") ||
      q.includes("faltó") ||
      q.includes("falta") ||
      q.includes("faltan") ||
      q.includes("ausen") ||
      q.includes("hora libre") ||
      q.includes("horas libres") ||
      q.includes("precept") ||
      q.includes("entro tarde") ||
      q.includes("salgo temprano") ||
      q.includes("cambio de horario")
    ) {
      return {
        text: "Los avisos de horas libres, ausencias de profesores y modificaciones de horario de ingreso o salida se publican en tiempo real en el Portal de Preceptoría por curso y división.",
        link: { href: "/preceptoria", label: "Ver Horas Libres y Avisos de Cursos →" },
      };
    }


    if (q.includes('mesa') || q.includes('examen') || q.includes('rendir') || q.includes('previa') || q.includes('equivalencia')) {
      return {
        text: 'En la sección de Mesas de Examen puedes consultar el cronograma oficial con fechas, horarios, turnos y tribunales docentes para materias previas y libres.',
        link: { href: '/mesas', label: 'Consultar Mesas de Examen →' },
      };
    }

    if (q.includes('tutoria') || q.includes('apoyo') || q.includes('clase') || q.includes('reforzar')) {
      return {
        text: 'El IPEM 10 ofrece tutorías pedagógicas gratuitas en Matemática, Lengua, Inglés, Informática, Ciencias Naturales y Sociales en ambos turnos.',
        link: { href: '/tutorias', label: 'Ver Horarios de Tutorías →' },
      };
    }

    // --- Módulo de Preceptoría y Vida Escolar ---
    if (q.includes("hora libre") || q.includes("horas libres") || q.includes("entro tarde") || q.includes("salgo temprano") || q.includes("entra tarde") || q.includes("sale temprano") || q.includes("falta profesor") || q.includes("cambio de horario")) {
      return {
        text: "Los avisos de horas libres, cambios de horario de ingreso o salida por ausencia de profesores se publican en tiempo real en el Portal de Preceptoría por curso y división.",
        link: { href: "/preceptoria", label: "Ver Horas Libres y Novedades de Cursos →" },
      };
    }

    if (q.includes("preceptoria") || q.includes("preceptor") || q.includes("preceptora")) {
      return {
        text: "Preceptoría gestiona la vida diaria de los cursos, justificación de inasistencias, citaciones a familias y novedades de 1° a 6° año en ambos turnos.",
        link: { href: "/preceptoria", label: "Ingresar al Portal de Preceptoría →" },
      };
    }

    if (q.includes("falta") || q.includes("inasistencia") || q.includes("justificativo") || q.includes("justificar")) {
      return {
        text: "Para justificar inasistencias por enfermedad, se debe presentar el certificado médico en Preceptoría dentro de las 48 hs hábiles posteriores al reintegro escolar.",
        link: { href: "/preceptoria", label: "Consultar información de Preceptoría →" },
      };
    }

    if (q.includes("retirar") || q.includes("retiro anticipado")) {
      return {
        text: "El retiro anticipado de un estudiante solo puede ser realizado personalmente en Preceptoría por el padre, madre o tutor legal acreditado con DNI original.",
        link: { href: "/preceptoria", label: "Ver Portal de Preceptoría →" },
      };
    }


    if (q.includes('constancia') || q.includes('alumno regular') || q.includes('pase') || q.includes('tramite') || q.includes('formulario') || q.includes('cus') || q.includes('salud')) {
      return {
        text: 'Los formularios oficiales de secretaría (Certificado Único de Salud CUS, solicitud de constancia de alumno regular y autorizaciones) están disponibles para descarga directa.',
        link: { href: '/descargas', label: 'Ir a Descargas y Formularios →' },
      };
    }

    if (q.includes('programa') || q.includes('contenido') || q.includes('materia')) {
      return {
        text: 'Puedes descargar los programas de contenidos de las materias de 1° a 6° año para preparar tus exámenes con tiempo.',
        link: { href: '/descargas?cat=PROGRAMA', label: 'Descargar Programas de Estudio →' },
      };
    }

    if (q.includes('cooperadora') || q.includes('alias') || q.includes('cbu') || q.includes('aporte') || q.includes('pagar') || q.includes('donar') || q.includes('transferir')) {
      return {
        text: 'El aporte a la Cooperadora Escolar es voluntario e indispensable para insumos de robótica, informática y mantenimiento. El Alias oficial de transferencia es COOPERADORA.IPEM10.',
        link: { href: '/cooperadora', label: 'Ver datos de la Cooperadora →' },
      };
    }

    if (q.includes('horario') || q.includes('turno') || q.includes('atencion') || q.includes('secretaria')) {
      return {
        text: 'Horarios de atención en Padre Lozano 375:\n• Turno Mañana: 08:00 a 12:00 hs\n• Turno Tarde: 13:30 a 17:30 hs\nTeléfono oficial: 0351-4347871.',
        link: { href: '/institucional', label: 'Ver ficha de la escuela →' },
      };
    }

    if (q.includes('donde') || q.includes('direccion') || q.includes('queda') || q.includes('llegar') || q.includes('colectivo') || q.includes('ubicacion')) {
      return {
        text: 'El colegio está ubicado en Padre Lozano 375, Barrio Alto Alberdi (Córdoba). Colectivos cercanos: Líneas 40, 41, 42, 44 por Av. Colón; y líneas 70, 72 y 80.',
        link: { href: '/institucional', label: 'Ver mapa y transporte →' },
      };
    }

    if (q.includes('biblioteca') || q.includes('libro')) {
      return {
        text: 'La Biblioteca del IPEM 10 funciona en ambos turnos con préstamos en sala y domicilio, y cuenta con acceso a colecciones digitales abiertas de Educ.ar.',
        link: { href: '/biblioteca', label: 'Visitar la Biblioteca Escolar →' },
      };
    }

    if (q.includes('inscripci') || q.includes('ingresante') || q.includes('cidi') || q.includes('1er')) {
      return {
        text: 'Las preinscripciones para ingresantes a 1° año se realizan a través del portal Ciudadano Digital (CiDi). Las confirmaciones de matrícula se gestionan en secretaría escolar.',
        link: { href: '/institucional', label: 'Más información de contacto →' },
      };
    }

    if (q.includes('robotica') || q.includes('programacion') || q.includes('orientacion') || q.includes('especialidad')) {
      return {
        text: '¡Yo nací gracias a la especialidad técnica del IPEM 10! Nuestra escuela forma a los estudiantes en Desarrollo Web, Lógica de Programación y Robótica con proyectos aplicados a la comunidad.',
        link: { href: '/institucional', label: 'Ver propuesta pedagógica →' },
      };
    }

    return {
      text: 'No tengo la respuesta exacta a esa consulta, pero puedes comunicarte con secretaría escolar al 0351-4347871 o acercarte a Padre Lozano 375 en los horarios de atención.',
      link: { href: '/institucional', label: 'Ver vías de contacto del IPEM 10 →' },
    };
  }

  function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const response = getBotResponse(query);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.text,
        link: response.link,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Botón flotante estilizado */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-900 to-green-900 hover:from-emerald-800 hover:to-green-800 text-white rounded-full p-2 sm:p-2.5 shadow-2xl flex items-center gap-3 border-2 border-amber-400 transition transform hover:scale-105 active:scale-95 group"
          aria-label="Consultar a RomaBot"
        >
          <RomaBotAvatar className="w-11 h-11 border-2 border-amber-300 shadow-md" />
          <div className="text-left hidden sm:block pr-2.5">
            <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-wider block leading-tight">
              Asistente Virtual
            </span>
            <span className="text-xs font-black text-white block leading-tight">
              ¿Dudas? Consulta a RomaBot
            </span>
          </div>
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-[90vw] sm:w-96 flex flex-col h-[550px] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Cabecera del Bot con rostro centrado */}
          <header className="bg-gradient-to-r from-emerald-950 to-green-950 text-white p-3.5 flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-3">
              <RomaBotAvatar className="w-11 h-11 border-2 border-amber-400 shadow-md" />
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5 text-white">
                  RomaBot <span className="bg-emerald-800 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-black border border-amber-400/30">IPEM 10</span>
                </h3>
                <p className="text-[10px] text-emerald-300">Asistente escolar para familias y alumnos</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-900 text-lg leading-none transition"
              aria-label="Cerrar asistente"
            >
              ✕
            </button>
          </header>

          {/* Área de Mensajes */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <RomaBotAvatar className="w-6 h-6 mt-1 shrink-0" />
                )}

                <div className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                  {/* Tarjeta de Bienvenida con el Robot Completo */}
                  {m.isWelcome && (
                    <div className="mb-2 bg-gradient-to-br from-emerald-900 to-green-950 text-white p-3.5 rounded-2xl border border-amber-400/40 shadow-sm flex items-center gap-3">
                      <img
                        src="/romabot.png"
                        alt="RomaBot cuerpo entero"
                        className="w-14 h-auto object-contain drop-shadow-md shrink-0"
                      />
                      <div className="text-[11px] leading-relaxed">
                        <p className="font-bold text-amber-300 mb-0.5">¡Bienvenido al IPEM 10 Roma!</p>
                        <p className="text-emerald-100 text-[10px]">
                          Especialidad en Programación y Robótica. Estoy aquí para responder tus consultas las 24 hs.
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                      m.sender === 'user'
                        ? 'bg-emerald-800 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    {m.text}
                  </div>

                  {m.link && (
                    <Link
                      href={m.link.href}
                      onClick={() => setIsOpen(false)}
                      className="mt-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs inline-block transition"
                    >
                      {m.link.label}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Botones de Preguntas Rápidas */}
          <div className="p-2 bg-white border-t border-gray-100 flex gap-1.5 overflow-x-auto text-[11px] shrink-0">
                        <button
              onClick={() => handleSend("¿Hay horas libres o faltó algún profe hoy?")}
              className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full whitespace-nowrap font-bold transition"
            >
              🧑‍🏫 Horas libres / Preceptoría
            </button>
            <button
              onClick={() => handleSend('¿Cuándo son las mesas de examen?')}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition"
            >
              📅 Mesas de examen
            </button>
            <button
              onClick={() => handleSend('¿Cómo es el tema de las tutorías?')}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition"
            >
              🎯 Tutorías
            </button>
            <button
              onClick={() => handleSend('¿Cómo colaborar con la cooperadora?')}
              className="bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition"
            >
              🤝 Cooperadora
            </button>
            <button
              onClick={() => handleSend('¿Dónde descargo formularios y constancias?')}
              className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition"
            >
              📄 Constancias y CUS
            </button>
          </div>

          {/* Formulario de Entrada de Texto */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a RomaBot..."
              className="flex-1 px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50"
            />
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition shadow-sm"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
