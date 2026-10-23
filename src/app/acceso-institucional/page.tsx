'use client';

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/actions/auth";
import SchoolLogo from "@/components/SchoolLogo";
import Link from "next/link";

function AccesoInstitucionalForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const errorMessage =
    error ||
    (errorParam === "sin_permisos"
      ? "Tu cuenta oficial de Google no tiene permisos asignados en el CMS. Contacta a Dirección."
      : errorParam === "dominio_no_autorizado"
        ? "Acceso denegado: Solo se permiten cuentas oficiales del colegio (@ipem10.edu.ar)."
        : errorParam === "cuenta_suspendida"
          ? "Tu cuenta institucional se encuentra suspendida."
          : errorParam === "falla_google"
            ? "No se pudo validar la sesión con Google. Asegúrate de ingresar desde http://localhost:3000."
            : null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-green-950 flex flex-col justify-center py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Encabezado Institucional con Escudo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 mb-5">
        <Link href="/" className="inline-block group" title="Volver a la portada principal del IPEM 10">
          <div className="flex justify-center mb-2">
            <div className="p-2 bg-emerald-900/60 rounded-2xl border border-emerald-400/30 shadow-2xl backdrop-blur-sm group-hover:scale-105 transition transform">
              <SchoolLogo size="md" className="drop-shadow-2xl" />
            </div>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
            Educación Secundaria Pública • Córdoba
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 group-hover:text-amber-300 transition-colors">
            IPEM N° 10 Roma
          </h1>
        </Link>
        <p className="text-xs text-emerald-200/80 font-medium">
          Portal Oficial de Acceso Institucional y Gestión
        </p>
      </div>

      {/* Tarjeta de Acceso */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-7 px-6 shadow-2xl rounded-3xl sm:px-9 border-2 border-emerald-900/20 space-y-5">
          <div className="text-center border-b border-gray-100 pb-2.5">
            <h2 className="text-lg font-bold text-gray-900">Ingreso de Personal</h2>
            <p className="text-xs text-gray-500">Directivos, Docentes y Preceptores</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Bloque Destacado de Google Workspace SSO */}
          <div className="bg-gradient-to-b from-emerald-50 to-teal-50/40 p-4 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-2 text-center">
            <div className="flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                ⭐ Acceso Oficial Recomendado
              </span>
            </div>

            <a
              href="/api/auth/google"
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-emerald-50/80 text-emerald-950 font-black py-3 px-4 rounded-xl border-2 border-emerald-700 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-xs sm:text-sm group"
            >
              <svg className="w-5 h-5 shrink-0 group-hover:scale-110 transition transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continuar con Google Workspace</span>
            </a>

            <span className="text-[11px] text-emerald-900/80 font-medium block">
              Ingreso directo con tu cuenta <b>@ipem10.edu.ar</b>
            </span>
          </div>

          {/* Divisor */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase tracking-wider font-extrabold text-gray-400 shrink-0">
              o acceso con clave local
            </span>
            <div className="border-t border-gray-200 w-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="ejemplo@ipem10.edu.ar"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-11 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:outline-none transition"
                />
                <button
                  type="button"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                  onTouchCancel={() => setShowPassword(false)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-800 transition focus:outline-none text-base select-none cursor-pointer"
                  title="Mantén presionado para ver la contraseña"
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl shadow transition disabled:opacity-50 text-xs sm:text-sm"
            >
              {loading ? "Verificando..." : "Ingresar con Clave Local"}
            </button>
          </form>

          <div className="pt-2 border-t border-gray-100 text-center">
            <Link href="/" className="text-xs text-emerald-800 hover:text-emerald-950 font-bold hover:underline">
              ← Volver a la portada principal del IPEM 10
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccesoInstitucionalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-slate-950 to-green-950 flex flex-col items-center justify-center text-slate-300">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-emerald-400 mb-3"></div>
          <p className="text-xs text-emerald-300/80 font-medium">Iniciando portal de acceso institucional...</p>
        </div>
      }
    >
      <AccesoInstitucionalForm />
    </Suspense>
  );
}