'use client';

import { useState } from 'react';
import { crearSolicitudTramiteAction, consultarEstadoTramiteAction } from '@/actions/tramites';

export default function TramitePublicoClient() {
    const [tab, setTab] = useState<'SOLICITAR' | 'CONSULTAR'>('SOLICITAR');

    const [loadingSolicitud, setLoadingSolicitud] = useState(false);
    const [solicitudResult, setSolicitudResult] = useState<any>(null);
    const [solicitudError, setSolicitudError] = useState('');

    const [busqueda, setBusqueda] = useState('');
    const [loadingConsulta, setLoadingConsulta] = useState(false);
    const [consultaResultados, setConsultaResultados] = useState<any[] | null>(null);
    const [consultaError, setConsultaError] = useState('');

    const handleCrearSolicitud = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingSolicitud(true);
        setSolicitudError('');
        setSolicitudResult(null);

        const formData = new FormData(e.currentTarget);
        const res = await crearSolicitudTramiteAction(formData);
        setLoadingSolicitud(false);

        if (res.success) {
            setSolicitudResult(res);
            (e.target as HTMLFormElement).reset();
        } else {
            setSolicitudError(res.error || 'Ocurrió un error al enviar la solicitud.');
        }
    };

    const handleConsultar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!busqueda.trim()) return;
        setLoadingConsulta(true);
        setConsultaError('');
        setConsultaResultados(null);

        const res = await consultarEstadoTramiteAction(busqueda);
        setLoadingConsulta(false);

        if (res.success) {
            setConsultaResultados(res.tramites || []);
        } else {
            setConsultaError(res.error || 'No se encontraron resultados.');
        }
    };

    const getEstadoVisual = (status: string) => {
        switch (status) {
            case 'PENDIENTE':
                return {
                    titulo: 'Solicitud Recibida (Pendiente)',
                    color: 'bg-amber-100 text-amber-900 border-amber-300',
                    desc: 'Tu pedido ingresó a la mesa de entradas de Secretaría.',
                    paso: 1,
                };
            case 'EN_COTEJO':
                return {
                    titulo: 'En Cotejo con Libro Matriz / SGE',
                    color: 'bg-blue-100 text-blue-900 border-blue-300',
                    desc: 'Secretaría está verificando tu regularidad o egreso en los registros oficiales.',
                    paso: 2,
                };
            case 'PARA_FIRMA':
                return {
                    titulo: 'En Carpeta para Firma',
                    color: 'bg-purple-100 text-purple-900 border-purple-300',
                    desc: 'Constancia impresa en espera del refrendo de Dirección y Secretaría.',
                    paso: 3,
                };
            case 'LISTA_PARA_RETIRAR':
                return {
                    titulo: '¡Lista para Retirar en Ventanilla!',
                    color: 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black',
                    desc: 'Ya puedes pasar a retirarla por Secretaría (Planta Baja) en horario de atención.',
                    paso: 4,
                };
            case 'ENTREGADA':
                return {
                    titulo: 'Trámite Entregado',
                    color: 'bg-slate-100 text-slate-700 border-slate-300',
                    desc: 'Documento retirado por el titular o tutor legal.',
                    paso: 4,
                };
            default:
                return {
                    titulo: status,
                    color: 'bg-gray-100 text-gray-800 border-gray-300',
                    desc: 'Estado en procesamiento.',
                    paso: 1,
                };
        }
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md overflow-hidden">
            <div className="flex border-b border-slate-200 bg-slate-50">
                <button
                    type="button"
                    onClick={() => setTab('SOLICITAR')}
                    className={`flex-1 py-3.5 px-4 text-center font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${tab === 'SOLICITAR'
                            ? 'bg-white text-emerald-950 border-b-2 border-emerald-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                >
                    <span>✍️</span>
                    <span>1. Solicitar Constancia Online</span>
                </button>

                <button
                    type="button"
                    onClick={() => setTab('CONSULTAR')}
                    className={`flex-1 py-3.5 px-4 text-center font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 ${tab === 'CONSULTAR'
                            ? 'bg-white text-emerald-950 border-b-2 border-emerald-700 shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                >
                    <span>🔍</span>
                    <span>2. Consultar Estado de mi Trámite</span>
                </button>
            </div>

            <div className="p-6 sm:p-8">
                {tab === 'SOLICITAR' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                Solicitud Digital de Constancias Escolares
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Completa tus datos. Plazo estimado de confección y firma: <strong>48 a 72 hs hábiles</strong>.
                            </p>
                        </div>

                        {solicitudResult && (
                            <div className="p-5 bg-emerald-50 border-2 border-emerald-500 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2 text-emerald-950 font-black text-base">
                                    <span>✅</span> ¡Solicitud registrada con éxito!
                                </div>
                                <p className="text-xs text-emerald-900 leading-relaxed">
                                    Guardá tu <strong>Código de Seguimiento</strong>:
                                </p>
                                <div className="bg-white p-3 rounded-xl border border-emerald-300 text-center">
                                    <span className="text-[11px] uppercase font-bold text-slate-500 block">Tu Código:</span>
                                    <span className="text-2xl font-black font-mono text-emerald-900 block tracking-wider">
                                        {solicitudResult.trackingCode}
                                    </span>
                                </div>
                                <p className="text-[11px] text-emerald-800">
                                    Podés consultar el avance en la pestaña <strong>"Consultar Estado"</strong> con este código o tu DNI.
                                </p>
                            </div>
                        )}

                        {solicitudError && (
                            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                                ⚠️ {solicitudError}
                            </div>
                        )}

                        <form onSubmit={handleCrearSolicitud} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Nombre y Apellido del Alumno *
                                    </label>
                                    <input
                                        name="studentName"
                                        required
                                        placeholder="Ej. Lucas Agustín Gómez"
                                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        DNI del Alumno (sin puntos) *
                                    </label>
                                    <input
                                        name="studentDni"
                                        required
                                        placeholder="Ej. 48123456"
                                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Curso y División (o Año de Egreso) *
                                    </label>
                                    <input
                                        name="course"
                                        required
                                        placeholder="Ej. 4° B - Turno Mañana o Egresado 2024"
                                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Tipo de Trámite Requerido *
                                    </label>
                                    <select
                                        name="requestType"
                                        required
                                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                    >
                                        <option value="Constancia de Alumno Regular">Constancia de Alumno Regular</option>
                                        <option value="Constancia para Boleto Educativo (BEG)">Boleto Educativo Gratuito (BEG)</option>
                                        <option value="Título / Analítico en Trámite">Certificado de Título en Trámite</option>
                                        <option value="Constancia de Vacante / Pase">Constancia de Vacante / Pase</option>
                                        <option value="Constancia de Examen Rendido">Constancia de Examen Rendido</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Motivo / Presentar ante:
                                    </label>
                                    <input
                                        name="purpose"
                                        placeholder="Ej. ANSES, Obra Social, etc."
                                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Teléfono / WhatsApp de Contacto
                                    </label>
                                    <input
                                        name="contactPhone"
                                        placeholder="Ej. 351 6123456"
                                        className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loadingSolicitud}
                                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-black text-xs sm:text-sm transition shadow-md mt-2"
                            >
                                {loadingSolicitud ? 'Enviando Solicitud...' : 'Enviar Solicitud a Secretaría →'}
                            </button>
                        </form>
                    </div>
                )}

                {tab === 'CONSULTAR' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">
                                Consulta el Estado de tu Trámite
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Ingresa el DNI del alumno o el código asignado (ej: <code>TR-10-8421</code>).
                            </p>
                        </div>

                        <form onSubmit={handleConsultar} className="flex gap-2">
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Ingresá DNI o Código (ej. 48123456 o TR-10-1234)"
                                className="flex-1 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                            />
                            <button
                                type="submit"
                                disabled={loadingConsulta || !busqueda.trim()}
                                className="py-3 px-5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:bg-slate-300 text-white font-bold text-xs transition"
                            >
                                {loadingConsulta ? 'Buscando...' : 'Consultar'}
                            </button>
                        </form>

                        {consultaError && (
                            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium">
                                ℹ️ {consultaError}
                            </div>
                        )}

                        {consultaResultados && (
                            <div className="space-y-4 pt-2">
                                <span className="text-xs font-bold text-slate-600 block">
                                    Trámites encontrados ({consultaResultados.length}):
                                </span>

                                {consultaResultados.map((item) => {
                                    const estado = getEstadoVisual(item.status);
                                    return (
                                        <div
                                            key={item.id}
                                            className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                                                <div>
                                                    <span className="font-mono text-xs font-black text-emerald-900 block">
                                                        {item.trackingCode}
                                                    </span>
                                                    <span className="text-sm font-bold text-slate-900">
                                                        {item.studentName} ({item.course})
                                                    </span>
                                                </div>
                                                <span className={`text-xs px-3 py-1 rounded-full border ${estado.color} self-start sm:self-auto`}>
                                                    {estado.titulo}
                                                </span>
                                            </div>

                                            <div className="text-xs text-slate-600 space-y-1">
                                                <div>
                                                    <strong>Trámite:</strong> {item.requestType} — <em>{item.purpose}</em>
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    {estado.desc}
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                                                    <div
                                                        className={`h-full transition-all duration-500 ${item.status === 'LISTA_PARA_RETIRAR' || item.status === 'ENTREGADA'
                                                                ? 'bg-emerald-600'
                                                                : item.status === 'PARA_FIRMA'
                                                                    ? 'bg-purple-600'
                                                                    : 'bg-amber-500'
                                                            }`}
                                                        style={{ width: `${(estado.paso / 4) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                                                    <span>1. Solicitado</span>
                                                    <span>2. Cotejo</span>
                                                    <span>3. Firma</span>
                                                    <span>4. En Ventanilla</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}