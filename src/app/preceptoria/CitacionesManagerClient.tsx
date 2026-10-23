'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createStudentNoticeAction, deleteStudentNoticeAction } from '@/actions/student-notices';

interface StudentNoticeItem {
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
  parentEmail?: string | null;
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

export default function CitacionesManagerClient({
  initialNotices,
  authorName,
}: {
  initialNotices: StudentNoticeItem[];
  authorName: string;
}) {
  const [notices, setNotices] = useState<StudentNoticeItem[]>(initialNotices);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState('CITACION_PRESENCIAL');
  const [filterShift, setFilterShift] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');
  const [successNotice, setSuccessNotice] = useState<{ code: string; token: string } | null>(null);

  const filteredNotices = notices.filter((n) => {
    const matchShift = filterShift === 'TODOS' || n.shift === filterShift;
    const matchSearch =
      n.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.studentDni.includes(searchTerm) ||
      n.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchShift && matchSearch;
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessNotice(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await createStudentNoticeAction(formData);

    if (res.success && res.code && res.token) {
      setSuccessNotice({ code: res.code, token: res.token });
      setShowForm(false);

      const newNotice: StudentNoticeItem = {
        id: crypto.randomUUID(),
        token: res.token,
        code: res.code,
        studentName: (formData.get('studentName') as string).trim(),
        studentDni: (formData.get('studentDni') as string).trim(),
        yearLevel: formData.get('yearLevel') as string,
        division: formData.get('division') as string,
        shift: formData.get('shift') as string,
        parentName: (formData.get('parentName') as string) || null,
        parentPhone: (formData.get('parentPhone') as string) || null,
        parentEmail: (formData.get('parentEmail') as string) || null,
        type: formData.get('type') as string,
        title: (formData.get('title') as string).trim(),
        message: (formData.get('message') as string).trim(),
        meetingDate: (formData.get('meetingDate') as string) || null,
        meetingTime: (formData.get('meetingTime') as string) || null,
        meetingPlace: (formData.get('meetingPlace') as string) || null,
        status: 'ENVIADO',
        acknowledgedAt: null,
        parentNote: null,
        authorName: authorName || 'Preceptoría Escolar',
        createdAt: new Date().toISOString(),
      };
      setNotices([newNotice, ...notices]);
      form.reset();
    } else {
      alert(res.error || 'Error al emitir la notificación.');
    }

    setIsSubmitting(false);
  }

  // Generador de enlace de WhatsApp
  function generateWhatsAppUrl(notice: StudentNoticeItem) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ipem10.edu.ar';
    const link = `${origin}/comunicados/${notice.token}`;

    const text = `*IPEM N° 10 ROMA - Notificación Oficial*\n\nEstimada familia de *${notice.studentName}* (${notice.yearLevel} "${notice.division}"):\nSe ha emitido una Cédula de Notificación Oficial (*${notice.code}*).\n\nPara acceder y registrar su conformidad de lectura, ingrese con el DNI del alumno al siguiente enlace oficial:\n${link}\n\n_Preceptoría IPEM N° 10 Roma • Tel: (0351) 4347871_`;

    const phoneParam = notice.parentPhone ? notice.parentPhone.replace(/\D/g, '') : '';
    const cleanPhone = phoneParam.startsWith('549') ? phoneParam : phoneParam ? `549${phoneParam}` : '';

    return `https://api.whatsapp.com/send?${cleanPhone ? `phone=${cleanPhone}&` : ''}text=${encodeURIComponent(text)}`;
  }

  // Generador de enlace de Email formal (mailto:)
  function generateEmailUrl(notice: StudentNoticeItem) {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ipem10.edu.ar';
    const link = `${origin}/comunicados/${notice.token}`;

    const subject = `IPEM N° 10 Roma - Cédula de Notificación Oficial ${notice.code} - ${notice.studentName}`;
    const body = `Estimada familia de ${notice.studentName} (${notice.yearLevel} "${notice.division}"):

Le informamos que desde la Preceptoría del IPEM N° 10 Roma se ha emitido una Cédula de Notificación Institucional Oficial con código ${notice.code}.

Asunto: ${notice.title}

Para tomar conocimiento del comunicado oficial y firmar su conformidad digital de lectura, por favor ingrese al siguiente enlace institucional con el DNI del estudiante:
${link}

Atentamente,
Preceptoría IPEM N° 10 Roma
Padre Lozano 375, Barrio Alto Alberdi, Córdoba
Teléfono de Guardia: (0351) 4347871`;

    const recipient = notice.parentEmail ? encodeURIComponent(notice.parentEmail) : '';
    return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="space-y-6">
      {/* Banner de Éxito al Generar Cédula */}
      {successNotice && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-5 text-emerald-950 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
              ✓ Cédula Individual Emitida
            </span>
            <h4 className="text-base font-black mt-1">
              Cédula {successNotice.code} lista para enviar
            </h4>
            <p className="text-xs text-emerald-800">
              La familia ya puede recibirla por WhatsApp o Correo Electrónico para firmar su conformidad digital.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/comunicados/${successNotice.token}`}
              target="_blank"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-xs"
            >
              👁️ Ver Cédula Oficial
            </Link>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Encabezado del Módulo Individual con Botón Principal */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-emerald-800/60">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
            Notificaciones Particulares a Familias
          </span>
          <h3 className="text-xl sm:text-2xl font-black mt-2 text-white">
            Cuaderno Digital de Citaciones y Avisos Individuales
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-xl">
            Emití una cédula dirigida a un alumno particular, compartila por <b>WhatsApp</b> o <b>Email</b> y auditá el acuse de recibo firmado digitalmente con DNI.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs sm:text-sm rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          {showForm ? '✕ Cerrar Formulario' : '➕ Nueva Citación a una Familia'}
        </button>
      </div>

      {/* FORMULARIO DE CITACIÓN INDIVIDUAL POR ALUMNO */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Paso 1: Datos del Alumno y Familia Convocada
            </span>
            <h4 className="text-lg font-black text-slate-900 mt-1">
              Emitir Cédula Oficial Personalizada
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Nombre y Apellido del Alumno *
              </label>
              <input
                name="studentName"
                required
                placeholder="Ej: Gómez, Lucas Agustín"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                DNI del Alumno (sin puntos) *
              </label>
              <input
                name="studentDni"
                required
                inputMode="numeric"
                placeholder="Ej: 48123456"
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Motivo de la Notificación *
              </label>
              <select
                name="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
                required
              >
                <option value="CITACION_PRESENCIAL">🔴 Citación Presencial Urgente</option>
                <option value="ALERTA_INASISTENCIAS">🟡 Alerta de Inasistencias Reiteradas</option>
                <option value="INFORME_PEDAGOGICO">🔵 Informe de Rendimiento Escolar</option>
                <option value="DOCUMENTACION_PENDIENTE">📄 Solicitud de Ficha CUS / ISA</option>
                <option value="COMUNICADO_INDIVIDUAL">📢 Notificación Particular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Curso *</label>
              <select name="yearLevel" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-bold" required>
                <option value="1° Año">1° Año</option>
                <option value="2° Año">2° Año</option>
                <option value="3° Año">3° Año</option>
                <option value="4° Año">4° Año</option>
                <option value="5° Año">5° Año</option>
                <option value="6° Año">6° Año</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">División *</label>
              <select name="division" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-bold" required>
                <option value="A">División A</option>
                <option value="B">División B</option>
                <option value="C">División C</option>
                <option value="D">División D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Turno y Orientación *</label>
              <select name="shift" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white font-bold" required>
                <option value="MAÑANA">💻 Turno Mañana: Bachiller en Informática</option>
                <option value="TARDE">🤖 Turno Tarde: Bachiller en Programación y Robótica</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Adulto Responsable (Tutor)
              </label>
              <input
                name="parentName"
                placeholder="Ej: Sra. Claudia Gómez"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Celular Familiar (WhatsApp)
              </label>
              <input
                name="parentPhone"
                type="tel"
                placeholder="Ej: 3515123456 (sin 0 ni 15)"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Correo Electrónico Familiar (Email)
              </label>
              <input
                name="parentEmail"
                type="email"
                placeholder="Ej: familia.gomez@gmail.com"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Si es Citación Presencial: Fecha, Hora y Lugar */}
          {selectedType === 'CITACION_PRESENCIAL' && (
            <div className="bg-rose-50/80 p-4 rounded-2xl border-2 border-rose-300 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase text-rose-900 mb-1">Día de la Convocatoria</label>
                <input
                  type="date"
                  name="meetingDate"
                  defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                  className="w-full text-xs p-2.5 border border-rose-300 rounded-xl bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-rose-900 mb-1">Horario Exacto</label>
                <input
                  type="time"
                  name="meetingTime"
                  defaultValue="09:30"
                  className="w-full text-xs p-2.5 border border-rose-300 rounded-xl bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-rose-900 mb-1">Lugar de Entrevista</label>
                <input
                  name="meetingPlace"
                  defaultValue="Preceptoría Planta Baja"
                  className="w-full text-xs p-2.5 border border-rose-300 rounded-xl bg-white font-bold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Asunto Oficial *
            </label>
            <input
              name="title"
              required
              placeholder="Ej: Convocatoria presencial a entrevista pedagógica por situación de asistencia"
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Mensaje Institucional a la Familia *
            </label>
            <textarea
              name="message"
              required
              rows={3}
              placeholder="Estimada familia: nos comunicamos desde la Preceptoría del IPEM N° 10 Roma para solicitar su presencia a fin de dialogar sobre la regularidad del estudiante..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Emitiendo Cédula...' : '🚀 Emitir Cédula Oficial y Generar Enlaces'}
            </button>
          </div>
        </form>
      )}

      {/* TABLA DE CITACIONES EMITIDAS CON SEGUIMIENTO EN VIVO */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Turno:</span>
            <select
              value={filterShift}
              onChange={(e) => setFilterShift(e.target.value)}
              className="text-xs font-bold p-1.5 border border-slate-300 rounded-lg bg-slate-50"
            >
              <option value="TODOS">Todos los Turnos</option>
              <option value="MAÑANA">💻 Mañana (Informática)</option>
              <option value="TARDE">🤖 Tarde (Robótica)</option>
            </select>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por alumno, DNI o código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {filteredNotices.length === 0 ? (
          <div className="text-center py-12 p-6 text-slate-400 text-xs">
            No hay citaciones individuales emitidas todavía. Hacé clic en "➕ Nueva Citación a una Familia" para emitir la primera.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Código</th>
                  <th className="px-5 py-3.5">Estudiante y Curso</th>
                  <th className="px-5 py-3.5">Motivo</th>
                  <th className="px-5 py-3.5">Estado de Firma</th>
                  <th className="px-5 py-3.5 text-right">Enviar / Ver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotices.map((n) => {
                  const isConformado = n.status === 'CONFORMADO';

                  return (
                    <tr key={n.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-slate-900">
                        {n.code}
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-black text-slate-900 text-sm block">{n.studentName}</span>
                        <span className="text-slate-500 text-[11px]">
                          DNI: {n.studentDni} • <b>{n.yearLevel} "{n.division}"</b> ({n.shift === 'MAÑANA' ? 'Informática' : 'Robótica'})
                        </span>
                      </td>

                      <td className="px-5 py-4 max-w-xs">
                        <span className="font-semibold text-slate-800 block truncate">{n.title}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {n.type.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap">
                        {isConformado ? (
                          <div className="text-emerald-800">
                            <span className="font-bold inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full text-[10px]">
                              <span>✓</span> Firmado por la Familia
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              {n.acknowledgedAt ? new Date(n.acknowledgedAt).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-[10px]">
                            <span>⏳</span> Pendiente de Lectura
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Botón WhatsApp */}
                          <a
                            href={generateWhatsAppUrl(n)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                            title="Abrir mensaje en WhatsApp"
                          >
                            <span>📲</span>
                            <span>WhatsApp</span>
                          </a>

                          {/* Botón Email */}
                          <a
                            href={generateEmailUrl(n)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl text-xs shadow-xs transition"
                            title="Abrir mensaje preparado en Correo Electrónico"
                          >
                            <span>✉️</span>
                            <span>Email</span>
                          </a>

                          {/* Ver Cédula */}
                          <Link
                            href={`/comunicados/${n.token}`}
                            target="_blank"
                            className="p-1.5 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition text-sm"
                            title="Ver Cédula Oficial"
                          >
                            👁️
                          </Link>

                          {/* Eliminar */}
                          <button
                            onClick={async () => {
                              if (confirm(`¿Eliminar la cédula ${n.code}?`)) {
                                await deleteStudentNoticeAction(n.id);
                                setNotices(notices.filter((item) => item.id !== n.id));
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition text-sm"
                            title="Eliminar citación"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
