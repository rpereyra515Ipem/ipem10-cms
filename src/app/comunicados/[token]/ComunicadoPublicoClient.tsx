'use client';

import { useState } from 'react';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';
import { acknowledgeStudentNoticeAction } from '@/actions/student-notices';

interface Notice {
  id: string;
  token: string;
  code: string;
  studentName: string;
  studentDni: string;
  yearLevel: string;
  division: string;
  shift: string;
  parentName: string | null;
  parentPhone: string | null;
  type: string;
  title: string;
  message: string;
  meetingDate: string | null;
  meetingTime: string | null;
  meetingPlace: string | null;
  status: string;
  acknowledgedAt: string | null;
  parentNote: string | null;
  authorName: string;
  createdAt: string | null;
}

export default function ComunicadoPublicoClient({ notice }: { notice: Notice }) {
  const [dniInput, setDniInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentNote, setParentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(notice.status);
  const [acknowledgedAt, setAcknowledgedAt] = useState(notice.acknowledgedAt);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanInput = dniInput.trim().replace(/\D/g, '');
    const cleanStored = notice.studentDni.trim().replace(/\D/g, '');

    if (cleanInput === cleanStored) {
      setIsUnlocked(true);
    } else {
      setError('El DNI ingresado no coincide con el registro del estudiante notificado. Verifique el número e intente nuevamente.');
    }
  }

  async function handleAcknowledge() {
    setIsSubmitting(true);
    setError(null);

    const res = await acknowledgeStudentNoticeAction(notice.token, dniInput, parentNote);

    if (res.success) {
      setCurrentStatus('CONFORMADO');
      setAcknowledgedAt(new Date().toISOString());
    } else {
      setError(res.error || 'Ocurrió un error al registrar la conformidad.');
    }
    setIsSubmitting(false);
  }

  // 1. PANTALLA DE DESBLOQUEO POR DNI (PRIVACIDAD)
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-green-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-900/30 text-center space-y-5">
          <div className="flex justify-center">
            <Link href="/" title="Volver a la portada principal del IPEM 10" className="p-2 bg-emerald-900/10 rounded-2xl border border-emerald-900/20 hover:scale-105 transition transform">
              <SchoolLogo size="md" className="drop-shadow-sm" />
            </Link>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-200">
              Protección de Datos (Ley N° 25.326)
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-2">
              Cédula de Notificación Oficial
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              IPEM N° 10 Roma • CUE 1404728-00
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed text-left space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <span>🔒</span> Verificación de Identidad del Adulto Responsable
            </p>
            <p>
              Para acceder a la comunicación institucional dirigida a su familia, ingrese a continuación el <b>DNI del estudiante</b> (sin puntos).
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl text-left">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 text-left mb-1">
                DNI del Alumno
              </label>
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="Ej: 48123456"
                value={dniInput}
                onChange={(e) => setDniInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-center text-lg font-black tracking-widest text-slate-900 focus:border-emerald-600 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
            >
              Desbloquear Notificación Oficial ➔
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Padre Lozano 375, Alto Alberdi • Tel: (0351) 4347871
          </p>
        </div>
      </div>
    );
  }

  // 2. CÉDULA OFICIAL DESBLOQUEADA
  const isCitacion = notice.type === 'CITACION_PRESENCIAL';
  const isConformado = currentStatus === 'CONFORMADO';

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-3 sm:px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        {/* Cabecera Oficial Membretada con Logo Clickeable hacia Inicio */}
        <div className="bg-emerald-950 text-white p-6 sm:p-8 border-b-4 border-amber-500">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 group" title="Volver a la portada principal del IPEM 10">
              <div className="p-1.5 bg-emerald-900 rounded-xl border border-emerald-800 group-hover:scale-105 transition transform">
                <SchoolLogo size="md" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight group-hover:text-amber-300 transition">
                  IPEM N° 10 Roma
                </h2>
                <p className="text-xs text-emerald-300 font-medium">
                  Educación Secundaria Pública • CUE: 1404728-00
                </p>
                <p className="text-[11px] text-emerald-400/80">
                  Padre Lozano 375 • Alto Alberdi, Córdoba
                </p>
              </div>
            </Link>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-amber-300 block">Cédula Oficial</span>
              <span className="text-xs sm:text-sm font-mono font-black text-white bg-emerald-900/90 border border-emerald-700 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                {notice.code}
              </span>
            </div>
          </div>
        </div>

        {/* Cuerpo de la Cédula */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
              isCitacion 
                ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {notice.type.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Emitido: {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('es-AR') : '—'}
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Estudiante</span>
              <span className="text-slate-900 font-black text-sm block">{notice.studentName}</span>
              <span className="text-slate-500 font-medium">DNI: {notice.studentDni}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold block uppercase text-[10px]">Curso y Orientación</span>
              <span className="text-slate-900 font-bold block">{notice.yearLevel} - División "{notice.division}"</span>
              <span className="text-emerald-800 font-semibold block">
                {notice.shift === 'MAÑANA' ? 'Turno Mañana: Bachiller en Informática' : 'Turno Tarde: Bachiller en Programación y Robótica'}
              </span>
            </div>
          </div>

          {isCitacion && (notice.meetingDate || notice.meetingTime) && (
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl p-5 border-2 border-rose-300 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 block">
                🚨 Convocatoria Presencial Obligatoria
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-900">
                <div>📅 Fecha: <span className="font-black text-rose-950">{notice.meetingDate || 'A coordinar'}</span></div>
                <div>⏰ Horario: <span className="font-black text-rose-950">{notice.meetingTime ? `${notice.meetingTime} hs` : 'Horario escolar'}</span></div>
                <div>📍 Lugar: <span className="font-black text-rose-950">{notice.meetingPlace || 'Preceptoría'}</span></div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {notice.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {notice.message}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              Emitido por: <strong className="text-slate-700">{notice.authorName}</strong> • Preceptoría IPEM 10 Roma
            </p>
          </div>

          {/* Estado de Firma */}
          {isConformado ? (
            <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 text-emerald-950 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <h4 className="font-black text-sm">Notificación Firmada Digitalmente</h4>
                  <p className="text-emerald-800">
                    Conformidad registrada el {acknowledgedAt ? new Date(acknowledgedAt).toLocaleString('es-AR') : '—'}.
                  </p>
                </div>
              </div>
              {notice.parentNote && (
                <div className="mt-2 pt-2 border-t border-emerald-200 text-xs">
                  <span className="font-bold">Observación de la familia:</span> "{notice.parentNote}"
                </div>
              )}
            </div>
          ) : (
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-5 space-y-4 print:hidden">
              <div>
                <h4 className="font-black text-sm text-amber-950 flex items-center gap-1.5">
                  <span>✍️</span> Acuse de Recibo y Conformidad Familiar
                </h4>
                <p className="text-xs text-amber-900 mt-1">
                  Al pulsar el botón inferior, usted confirma formalmente haber tomado conocimiento de esta comunicación oficial del IPEM N° 10 Roma.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-950 mb-1">
                  Respuesta u observación para Preceptoría (opcional):
                </label>
                <textarea
                  rows={2}
                  value={parentNote}
                  onChange={(e) => setParentNote(e.target.value)}
                  placeholder="Ej: Asistiré puntualmente el lunes a las 09:30 hs. Muchas gracias."
                  className="w-full text-xs p-3 border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {error && (
                <div className="p-2.5 bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleAcknowledge}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>{isSubmitting ? 'Registrando firma...' : 'Confirmar Notificación / Doy mi Conformidad'}</span>
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 text-xs text-slate-500 print:hidden">
            <span>📞 Guardia de Preceptoría: <b>(0351) 4347871</b></span>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition flex items-center gap-1.5"
            >
              <span>🖨️</span>
              <span>Imprimir Cédula</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
