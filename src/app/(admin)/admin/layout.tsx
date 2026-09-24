import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';
import { logoutAction } from '@/actions/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Barra de Navegación del Panel de Control */}
      <header className="bg-emerald-950 text-white border-b border-emerald-900 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <SchoolLogo size="sm" className="w-8 h-8" />
              <div>
                <span className="font-extrabold text-sm block leading-tight text-white group-hover:text-amber-300 transition">
                  Panel IPEM N° 10
                </span>
                <span className="text-[10px] text-emerald-300 font-medium block">
                  Administración Escolar
                </span>
              </div>
            </Link>

            {/* Menú de Módulos */}
            <nav className="hidden md:flex items-center gap-1 text-xs">
              <Link
                href="/admin/publicaciones"
                className="px-3 py-1.5 rounded-md hover:bg-emerald-900 text-emerald-100 font-medium transition"
              >
                📢 Noticias
              </Link>
              <Link
                href="/admin/mesas"
                className="px-3 py-1.5 rounded-md hover:bg-emerald-900 text-emerald-100 font-medium transition"
              >
                📅 Mesas
              </Link>
              <Link
                href="/admin/descargas"
                className="px-3 py-1.5 rounded-md hover:bg-emerald-900 text-emerald-100 font-medium transition"
              >
                📁 Documentos
              </Link>
              <Link
                href="/admin/circulares"
                className="px-3 py-1.5 rounded-md hover:bg-emerald-900 text-emerald-100 font-medium transition"
              >
                📋 Circulares
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 px-3 py-1.5 rounded-md font-semibold transition flex items-center gap-1.5"
            >
              <span>🌐</span> Ver Sitio Web
            </Link>

            {/* Botón oficial de Cerrar Sesión */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1"
                title="Cerrar la sesión de forma segura"
              >
                <span>🚪</span> Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Contenido de cada módulo */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
