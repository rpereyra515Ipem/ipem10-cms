import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import SchoolLogo from '@/components/SchoolLogo';
import Link from 'next/link';
import NoticiasListClient from './NoticiasListClient';

export const dynamic = 'force-dynamic';

export default async function NoticiasArchivoPage() {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header Institucional con Escudo Oficial y Botón Inicio */}
      <header className="bg-emerald-900 border-b-4 border-amber-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="shrink-0">
                <SchoolLogo size="md" className="group-hover:scale-105 transition-transform drop-shadow-md" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 block">
                  IPEM N° 10 Roma
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>📰</span>
                  <span>Archivo de Novedades y Comunicados</span>
                </h1>
              </div>
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 hover:text-white font-semibold text-sm transition-all border border-emerald-700 shadow-sm hover:shadow"
            title="Volver a la página principal"
          >
            <span>🏠</span>
            <span>Inicio</span>
          </Link>
        </div>
      </header>

      {/* Banner de Presentación */}
      <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800 shadow-inner">
        <div className="max-w-7xl mx-auto space-y-2 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full inline-block">
            Historial de Prensa Escolar
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Todas las Publicaciones Institucionales
          </h2>
          <p className="text-sm text-emerald-100/90 max-w-2xl font-light">
            Registro cronológico de comunicados oficiales, proyectos pedagógicos, mesas de examen y efemérides del IPEM 10.
          </p>
        </div>
      </section>

      {/* Listador Interactivo con Filtros, Orden y Búsqueda */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <NoticiasListClient initialPosts={allPosts} />
      </main>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-200 py-8 border-t-4 border-amber-500 text-center text-xs">
        <p>© {new Date().getFullYear()} IPEM N° 10 Roma — Barrio Alto Alberdi, Córdoba Capital.</p>
        <p className="mt-1 text-slate-400">Archivo General de Novedades y Comunicados Oficiales</p>
      </footer>
    </div>
  );
}
