import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import SchoolLogo from '@/components/SchoolLogo';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const latestPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(4);
  const urgentPost = latestPosts.find((p) => p.isUrgent);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Banner de Aviso Urgente */}
      {urgentPost && (
        <aside aria-label="Aviso urgente" className="bg-red-800 text-white px-4 py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-2 shadow-inner">
          <span className="animate-pulse bg-red-900 px-2 py-0.5 rounded text-xs font-bold">COMUNICADO URGENTE</span>
          <Link href={`/noticias/${urgentPost.slug}`} className="underline hover:text-red-100 font-bold">
            {urgentPost.title}
          </Link>
        </aside>
      )}

      {/* Barra de Navegación Institucional Limpia */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <SchoolLogo size="md" className="group-hover:scale-105 transition transform" />
            <div className="hidden sm:block">
              <span className="font-black text-emerald-950 text-lg sm:text-xl block leading-tight tracking-tight whitespace-nowrap">
                IPEM N° 10 Roma
              </span>
              <span className="hidden sm:block text-xs text-gray-500 font-medium">
                Padre Lozano 375 • Alto Alberdi, Córdoba
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link
              href="/institucional"
              className="text-[11px] sm:text-sm font-semibold whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Institucional
            </Link>

            <Link
              href="/docentes"
              className="text-[11px] sm:text-sm font-bold whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-emerald-950 bg-emerald-100/70 hover:bg-emerald-200/80 border border-emerald-300/80 transition flex items-center gap-1"
              title="Sala de Profesores Digital"
            >
              <span>👨‍🏫</span>
              <span>Docentes</span>
            </Link>

            <Link
              href="/login"
              className="text-[11px] sm:text-sm font-bold whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-white bg-slate-900 hover:bg-emerald-900 transition flex items-center gap-1 shadow-sm"
              title="Panel Administrativo"
            >
              <span>🔒</span>
              <span>Gestión</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Institucional */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 text-white py-16 px-4 border-b border-emerald-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-4">
            <SchoolLogo size="lg" className="drop-shadow-2xl hover:scale-105 transition transform" />
          </div>

          <span className="inline-block text-xs uppercase tracking-widest font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full mb-3">
            Educación Secundaria Pública • Córdoba Capital
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-white">
            Instituto Provincial de Educación Media N° 10
          </h1>
          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            Comunidad educativa de Barrio Alto Alberdi. Formando jóvenes con sentido crítico, valores y compromiso con el futuro.
          </p>
        </div>
      </section>

      {/* Accesos Rápidos Principales (Orientados a Tareas Concretas) */}
      <section className="max-w-6xl mx-auto px-4 -mt-8 mb-12 w-full relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/mesas"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md hover:border-emerald-600 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center block"
          >
            <div className="text-2xl mb-1">📅</div>
            <p className="font-extrabold text-gray-900 text-xs">Mesas de Examen</p>
            <p className="text-[10px] text-emerald-700 font-medium">Cronograma de turnos</p>
          </Link>

          <Link
            href="/tutorias"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md hover:border-emerald-600 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center block"
          >
            <div className="text-2xl mb-1">🎯</div>
            <p className="font-extrabold text-gray-900 text-xs">Tutorías</p>
            <p className="text-[10px] text-emerald-700 font-medium">Clases de apoyo</p>
          </Link>

          <Link
            href="/descargas?cat=PROGRAMA"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md hover:border-emerald-600 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center block"
          >
            <div className="text-2xl mb-1">📚</div>
            <p className="font-extrabold text-gray-900 text-xs">Programas</p>
            <p className="text-[10px] text-emerald-700 font-medium">Materias previas</p>
          </Link>

          <Link
            href="/biblioteca"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md hover:border-emerald-600 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center block"
          >
            <div className="text-2xl mb-1">📖</div>
            <p className="font-extrabold text-gray-900 text-xs">Biblioteca</p>
            <p className="text-[10px] text-emerald-700 font-medium">Libros y recursos</p>
          </Link>

          {/* Tarjeta corregida: Ventanilla pública de trámites */}
          <Link
            href="/descargas?cat=FORMULARIO"
            className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md hover:border-emerald-600 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center block"
          >
            <div className="text-2xl mb-1">📄</div>
            <p className="font-extrabold text-gray-900 text-xs">Trámites y Formularios</p>
            <p className="text-[10px] text-emerald-700 font-medium">Constancias, CUS y pases</p>
          </Link>

          
          <Link
            href="/preceptoria"
            className="group bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition block"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition transform">
              🧑‍🏫
            </div>
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-800 transition">
              Preceptoría y Cursos
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Horas libres, cambios de horario y avisos
            </p>
          </Link>

          <Link
            href="/cooperadora"
            className="bg-white p-4 rounded-2xl border border-amber-200 shadow-md hover:border-amber-500 hover:shadow-xl transition transform hover:-translate-y-0.5 text-center block"
          >
            <div className="text-2xl mb-1">🤝</div>
            <p className="font-extrabold text-amber-900 text-xs">Cooperadora</p>
            <p className="text-[10px] text-amber-700 font-medium">Cómo colaborar</p>
          </Link>
        </div>
      </section>

      {/* Tablón de Novedades */}
      <main className="max-w-6xl mx-auto px-4 mb-16 w-full flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Novedades y Comunicados</h2>
            <p className="text-xs sm:text-sm text-gray-500">Publicaciones oficiales del IPEM 10 Roma</p>
          </div>
          <Link href="/login" className="text-[11px] sm:text-sm font-bold whitespace-nowrap text-emerald-700 hover:underline flex items-center gap-1">
            <span>🔒</span> Acceso Panel de Gestión →
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border">
            <p className="text-gray-500">Aún no hay publicaciones en el sitio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col">
                {post.imageUrl && (
                  <div className="h-48 bg-gray-100 overflow-hidden border-b">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black tracking-wider text-emerald-800 uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      {post.type}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg mt-3 mb-2 leading-snug">
                      <Link href={`/noticias/${post.slug}`} className="hover:text-emerald-700 transition">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {post.excerpt || 'Haz clic para leer el comunicado institucional completo.'}
                    </p>
                  </div>
                  <div className="border-t pt-4 flex justify-between items-center text-xs text-gray-500 font-medium">
                    <span>
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Reciente'}
                    </span>
                    <Link href={`/noticias/${post.slug}`} className="font-bold text-emerald-700 hover:underline">
                      Leer comunicado →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Pie Institucional */}
      <footer className="bg-emerald-950 text-emerald-200 py-12 border-t border-emerald-900 mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <SchoolLogo size="sm" />
              <h4 className="text-white font-extrabold text-base">IPEM N° 10 Roma</h4>
            </div>
            <p className="text-emerald-300/80 text-xs leading-relaxed">
              Escuela de Educación Secundaria de Gestión Estatal. Ministerio de Educación de la Provincia de Córdoba.
            </p>
            <p className="text-emerald-300/80 text-xs mt-2">CUE Oficial: <strong className="text-white">1404728-00</strong></p>
          </div>
          <div>
            <h4 className="text-white font-bold text-base mb-2">Ubicación y Turnos</h4>
            <p className="text-emerald-300/80 text-xs leading-relaxed">Padre Lozano 375, Barrio Alto Alberdi</p>
            <p className="text-emerald-300/80 text-xs">Córdoba Capital, CP X5003</p>
            <p className="text-emerald-300/80 text-xs mt-2 font-medium text-amber-300">Turno Mañana | Turno Tarde</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-base mb-2">Comunidad Escolar</h4>
            <ul className="text-xs text-emerald-300/80 space-y-1.5">
              <li><Link href="/docentes" className="text-amber-300 hover:underline font-semibold">👨‍🏫 Sala de Docentes</Link></li>
              <li><Link href="/tutorias" className="hover:text-white">Clases de Tutorías</Link></li>
              <li><Link href="/biblioteca" className="hover:text-white">Biblioteca Escolar</Link></li>
              <li><Link href="/cooperadora" className="hover:text-white">Asociación Cooperadora</Link></li>
              <li><Link href="/institucional" className="hover:text-white">Identidad Institucional</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-base mb-2">Acceso Administrativo</h4>
            <p className="text-emerald-300/80 text-xs leading-relaxed">
              Exclusivo para directivos y secretaría:
            </p>
            <div className="mt-3">
              <Link href="/login" className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2.5 rounded-lg font-bold transition inline-flex items-center gap-1 border border-slate-700 shadow-sm">
                <span>🔒</span> Iniciar Sesión de Gestión →
              </Link>
            </div>
          </div>
        </div>

                {/* Firma del Webmaster y Contacto Comercial */}
        <div className="max-w-6xl mx-auto px-4 border-t border-emerald-900/80 mt-10 pt-6 pb-24 sm:pb-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80 lg:pr-72">
          <p className="text-center lg:text-left">© {new Date().getFullYear()} IPEM N° 10 Roma. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 bg-emerald-900/60 px-4 py-2 rounded-full border border-emerald-700/70 shadow-lg">
            <span className="text-emerald-200">💻 Webmaster y Desarrollo:</span>
            <span className="font-bold text-white">Lic. Rafael Pereyra</span>
            <span className="text-emerald-600 hidden sm:inline">•</span>
            <a
              href="https://wa.me/5493516198503?text=Hola%20Lic.%20Rafael,%20vi%20la%20plataforma%20del%20IPEM%2010%20y%20quisiera%20consultar%20por%20este%20sistema%20para%20mi%20colegio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 hover:underline transition"
              title="Consultar por este CMS para otra institución"
            >
              <span>📲 Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
