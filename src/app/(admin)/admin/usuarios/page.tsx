import { getUsersList, createUserAction, toggleUserStatusAction } from '@/actions/users';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminUsuariosPage() {
  const session = await getSession();
  if (!session || !['MASTER', 'DIRECTIVO', 'ADMIN'].includes(session.role)) {
    redirect('/admin');
  }

  const userList = await getUsersList();
  const isMaster = session.role === 'MASTER';

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>👥</span> Gestión de Personal y Cuentas
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administración de cuentas autorizadas para docentes, preceptores, secretaría y dirección.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-full border border-emerald-300">
            {userList.length} cuentas registradas
          </span>
        </div>
      </div>

      {/* Formulario de Alta de Usuario */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span>➕</span> Dar de Alta Nueva Cuenta Escolar
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Si el docente o preceptor ingresará con <b>Google Workspace</b> (@ipem10.edu.ar), deja la contraseña vacía.
        </p>

        <form action={createUserAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo *</label>
              <input
                name="fullName"
                placeholder="Ej: Prof. Mariana López"
                className="w-full text-xs p-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Correo Institucional *</label>
              <input
                type="email"
                name="email"
                placeholder="mariana.lopez@ipem10.edu.ar"
                className="w-full text-xs p-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Correo Personal <span className="font-normal text-gray-400">(Para avisos)</span>
              </label>
              <input
                type="email"
                name="personalEmail"
                placeholder="ejemplo@gmail.com"
                className="w-full text-xs p-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Rol en la Escuela *</label>
              <select
                name="role"
                className="w-full text-xs p-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition font-semibold"
                required
              >
                <option value="DOCENTE">👨‍🏫 DOCENTE (Sala de Profesores)</option>
                <option value="PRECEPTOR">🧑‍🏫 PRECEPTOR (Cursos y Horas Libres)</option>
                <option value="SECRETARIA">📑 SECRETARIA (Trámites y Exámenes)</option>
                {isMaster && (
                  <option value="DIRECTIVO">🏛️ DIRECTIVO (Gestión Escolar Total)</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contraseña local <span className="font-normal text-gray-400">(Opcional)</span>
              </label>
              <input
                type="text"
                name="password"
                placeholder="Dejar vacía para Google SSO"
                className="w-full text-xs p-2.5 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition"
            >
              💾 Guardar y Habilitar Acceso
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Cuentas Existentes */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">Personal Escolar con Acceso Habilitado</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-slate-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b">
              <tr>
                <th className="p-3.5">Usuario / Personal</th>
                <th className="p-3.5">Correo Electrónico</th>
                <th className="p-3.5">Rol Asignado</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userList.map((u) => {
                const isSelf = u.id === session.userId;
                const roleBadge =
                  u.role === 'MASTER' ? 'bg-purple-100 text-purple-900 border-purple-300' :
                  u.role === 'DIRECTIVO' ? 'bg-blue-100 text-blue-900 border-blue-300' :
                  u.role === 'PRECEPTOR' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                  u.role === 'SECRETARIA' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                  'bg-emerald-100 text-emerald-900 border-emerald-300';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-black">
                        {u.fullName.charAt(0).toUpperCase()}
                      </span>
                      {u.fullName} {isSelf && <span className="text-[10px] text-emerald-600 font-semibold">(Tú)</span>}
                    </td>
                    <td className="p-3.5">
                      <span className="text-gray-900 font-mono text-[11px] font-semibold block">{u.email}</span>
                      {u.personalEmail && (
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          Personal: <span className="text-emerald-700 font-mono">{u.personalEmail}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${roleBadge}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-400">
                          <span className="w-2 h-2 rounded-full bg-gray-400"></span> Suspendido
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {!isSelf && (isMaster || (session.role === 'DIRECTIVO' && u.role !== 'MASTER' && u.role !== 'DIRECTIVO')) ? (
                        <form action={async () => {
                          'use server';
                          await toggleUserStatusAction(u.id, !!u.active);
                        }}>
                          <button
                            type="submit"
                            className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition ${
                              u.active
                                ? 'text-rose-700 border-rose-200 hover:bg-rose-50'
                                : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {u.active ? '🚫 Suspender' : '✅ Reactivar'}
                          </button>
                        </form>
                      ) : (
                        <span className="text-gray-400 text-[10px] italic">Protegido</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
