import { getUsersList, createUserAction, toggleUserStatusAction } from '@/actions/users';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
  const session = await getSession();
  if (!session || !['MASTER', 'DIRECTIVO', 'ADMIN', 'SECRETARIA'].includes(session.role)) {
    redirect('/admin');
  }

  const userList = await getUsersList();
  const isMaster = session.role === 'MASTER';
  const isDirectivo = session.role === 'DIRECTIVO';

  return (
    <div className="space-y-6">
      {/* Botón de Retorno Prominente y Visible */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-xs sm:text-sm rounded-xl border-2 border-emerald-400 shadow-sm hover:shadow transition transform hover:-translate-y-0.5"
        >
          <span className="text-base">⬅️</span>
          <span>Volver al Panel de Gestión</span>
        </Link>
      </div>

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

      {/* Formulario de Alta de Personal */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <span>➕</span> Dar de Alta Nueva Cuenta Escolar
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Si el docente o preceptor ingresará con Google Workspace (@ipem10.edu.ar), deja la contraseña vacía.
          </p>
        </div>

        <form action={createUserAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nombre Completo *
              </label>
              <input
                name="fullName"
                type="text"
                required
                placeholder="Ej: Prof. Mariana López"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Correo Institucional *
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="mariana.lopez@ipem10.edu.ar"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Correo Personal <span className="font-normal text-gray-400">(Para avisos)</span>
              </label>
              <input
                name="personalEmail"
                type="email"
                placeholder="ejemplo@gmail.com"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Rol en la Escuela *
              </label>
              <select
                name="role"
                defaultValue="DOCENTE"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none font-medium"
                required
              >
                <option value="DOCENTE">👨‍🏫 DOCENTE (Sala de Profesores)</option>
                <option value="PRECEPTOR">🧑‍🏫 PRECEPTOR (Preceptoría)</option>
                {(isMaster || isDirectivo) && (
                  <option value="SECRETARIA">🏢 SECRETARIA (Secretaría y Despacho)</option>
                )}
                {isMaster && (
                  <option value="DIRECTIVO">🏛️ DIRECTIVO (Equipo Directivo)</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Contraseña local <span className="font-normal text-gray-400">(Opcional)</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="Dejar vacía para Google SSO"
                className="w-full text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>💾</span>
              <span>Guardar y Habilitar Acceso</span>
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Usuarios Registrados */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-900">
            Personal Escolar con Acceso Habilitado
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-slate-50 text-gray-500 uppercase tracking-wider font-extrabold text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Usuario / Personal</th>
                <th className="px-6 py-3.5">Correo Electrónico</th>
                <th className="px-6 py-3.5">Rol Asignado</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userList.map((user) => {
                const isCurrentUser = session.userId === user.id || session.email === user.email;
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-black text-slate-700 uppercase">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-sm block">
                            {user.fullName} {isCurrentUser && <span className="text-emerald-700 font-bold text-xs">(Tú)</span>}
                          </span>
                          {user.personalEmail && (
                            <span className="text-gray-400 text-[11px] block">
                              Personal: {user.personalEmail}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-gray-700">
                      {user.email}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          user.role === 'MASTER'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'DIRECTIVO'
                            ? 'bg-amber-100 text-amber-800'
                            : user.role === 'SECRETARIA'
                            ? 'bg-yellow-100 text-yellow-800'
                            : user.role === 'PRECEPTOR'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 font-bold ${
                          user.active ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.active ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        {user.active ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {isCurrentUser ? (
                        <span className="text-gray-400 text-[11px] italic">Protegido</span>
                      ) : (
                        <form action={toggleUserStatusAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="currentStatus" value={String(user.active)} />
                          <button
                            type="submit"
                            className={`font-bold hover:underline ${
                              user.active ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {user.active ? 'Suspender' : 'Activar'}
                          </button>
                        </form>
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
