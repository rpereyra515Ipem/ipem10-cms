import { db } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import SchoolLogo from '@/components/SchoolLogo';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function formatDate(dateValue: any) {
  if (!dateValue) return 'Reciente';
  try {
    return new Date(dateValue).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Reciente';
  }
}

export default async function HomePage() {
  const latestPosts = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(7);
  const urgentPost = latestPosts.find((p) => p.isUrgent);

  const featuredPost = latestPosts[0];
  const secondaryPosts = latestPosts.slice(1, 7);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-800 selection:text-white">
      {/* 1. Aviso urgente */}
      {urgentPost && (
        <aside aria-label="Aviso urgente" className="bg-red-800 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-inner sticky top-0 z-50">
          <span className="animate-pulse bg-red-950 text-red-200 border border-red-700/60 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
            COMUNICADO URGENTE
          </span>
          <Link href={`/noticias/${urgentPost.slug}`} className="underline hover:text-red-100 font-bold tracking-tight">
            <span>{urgentPost.title} →</span>
          </Link>
        </aside>
      )}

      {/* 2. Barra de navegación */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <SchoolLogo size="md" className="group-hover:scale-105 transition-transform duration-300 drop-shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-emerald-950 text-lg sm:text-xl leading-none tracking-tight">
                  IPEM N° 10 Roma
                </span>
                <span className="hidden md:inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  CUE 1404728-00
                </span>
              </div>
              <span className="hidden sm:block text-xs text-slate-500 font-medium mt-0.5">
                Padre Lozano 375 • Alto Alberdi, Córdoba
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/institucional"
              className="text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl text-slate-700 hover:text-emerald-950 hover:bg-slate-100/90 transition-all flex items-center gap-1.5"
            >
              <span>🏛️</span>
              <span className="hidden sm:inline">Institucional</span>
            </Link>

            <Link
              href="/docentes"
              className="text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded-xl text-emerald-900 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/80 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>👨‍🏫</span>
              <span>Docentes</span>
            </Link>

            <Link
              href="/acceso-institucional"
              className="text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-xl text-white bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Gestión</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* 3. Hero Principal Refinado */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500 shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="flex justify-center mb-2">
            <div className="p-2.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 shadow-2xl backdrop-blur-sm">
              <SchoolLogo size="lg" className="drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-widest text-amber-300 bg-amber-400/10 border border-amber-400/30">
            <span>⭐</span>
            <span>Educación Secundaria Pública • Córdoba Capital</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            IPEM N° 10 <span className="text-amber-300 font-extrabold tracking-normal">"Roma"</span>
          </h1>

          <p className="text-xs sm:text-sm font-medium text-emerald-300/80 uppercase tracking-widest">
            Instituto Provincial de Educación Media • CUE 1404728-00
          </p>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed pt-1">
            Comunidad educativa de Barrio Alto Alberdi. Formando jóvenes con sentido crítico, valores democráticos y orientación en Informática.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-full text-emerald-200 font-medium">
              💻 Bachiller en Informática
            </span>
            <span className="text-xs bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-full text-emerald-200 font-medium">
              ⏰ Turno Mañana y Tarde
            </span>
            <span className="text-xs bg-emerald-900/80 border border-emerald-700/60 px-3 py-1 rounded-full text-emerald-200 font-medium">
              📍 Padre Lozano 375
            </span>
          </div>
        </div>
      </section>

      {/* 4. Las 7 Tarjetas Flotantes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-14 w-full relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <Link
            href="/preceptoria"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">🧑‍🏫</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-emerald-900 transition-colors">Preceptoría</h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              En vivo
            </span>
          </Link>

          <Link
            href="/mesas"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">📅</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-emerald-900 transition-colors">Mesas de Examen</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">Turnos y fechas</p>
          </Link>

          <Link
            href="/tutorias"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">🎯</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-emerald-900 transition-colors">Tutorías</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">Clases de apoyo</p>
          </Link>

          <Link
            href="/descargas?cat=PROGRAMA"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">📚</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-emerald-900 transition-colors">Programas</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">Materias previas</p>
          </Link>

          <Link
            href="/biblioteca"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">📖</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-emerald-900 transition-colors">Biblioteca</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">Libros y material</p>
          </Link>

          <Link
            href="/secretaria"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">🏢</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-emerald-900 transition-colors">Secretaría</h3>
            <span className="inline-flex items-center text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full mt-1 border border-amber-200">
              Trámites y CUS
            </span>
          </Link>

          <Link
            href="/cooperadora"
            className="group bg-white p-3.5 rounded-2xl border border-slate-200 shadow-md hover:shadow-xl hover:border-amber-500 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center"
          >
            <span className="text-2xl mb-1 transform group-hover:scale-110 transition-transform">🤝</span>
            <h3 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-amber-800 transition-colors">Cooperadora</h3>
            <p className="text-[10px] text-slate-500 mt-1 leading-tight">Comunidad activa</p>
          </Link>
        </div>
      </section>

      {/* 5. Noticias en Layout Editorial */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
                Prensa y Comunicados
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Novedades y Vida Institucional
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Publicaciones oficiales, proyectos pedagógicos y avisos del IPEM N° 10 Roma.
            </p>
          </div>

          <Link
            href="/acceso-institucional"
            className="text-xs font-bold text-slate-700 hover:text-emerald-900 bg-white hover:bg-slate-50 border border-slate-300 px-3.5 py-1.5 rounded-xl transition shadow-sm inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>🔒</span>
            <span>Panel de Gestión</span>
          </Link>
        </div>

        {latestPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <span className="text-4xl block mb-2">📰</span>
            <h3 className="text-base font-bold text-slate-700">Aún no hay publicaciones en el portal</h3>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Noticia Principal Destacada (Con Soporte de Foto Real + Escudo de Respaldo) */}
            {featuredPost && (
              <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
                <div className="lg:col-span-5 h-56 sm:h-72 lg:h-auto bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none">
                  {/* Escudo de respaldo institucional (visible si no hay foto) */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                    <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                      <SchoolLogo size="lg" className="drop-shadow-2xl" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-200 mt-3 relative z-10">
                      IPEM N° 10 Roma
                    </span>
                  </div>

                  {/* Foto real (si existe, se superpone y cubre el fondo) */}
                  {featuredPost.imageUrl && (
                    <img
                      src={featuredPost.imageUrl}
                      alt=""
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <span className="absolute top-4 left-4 text-[10px] font-black tracking-wider uppercase bg-amber-400 text-emerald-950 px-3 py-1 rounded-full shadow-md z-20">
                    Destacada • {featuredPost.type}
                  </span>
                </div>

                <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <span>🗓️</span>
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      <Link href={`/noticias/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt || 'Haz clic para leer el comunicado completo emitido por la institución.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">Lectura estimada: 2 min</span>
                    <Link
                      href={`/noticias/${featuredPost.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-800 group-hover:text-emerald-950 group-hover:underline"
                    >
                      <span>Leer comunicado completo →</span>
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Fila de Noticias Secundarias (Con Soporte de Foto Real + Escudo de Respaldo) */}
            {secondaryPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {secondaryPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="h-44 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none">
                        {/* Escudo de respaldo institucional */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                          <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                            <SchoolLogo size="md" className="drop-shadow-lg" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-2 relative z-10">
                            IPEM N° 10 Roma
                          </span>
                        </div>

                        {/* Foto real */}
                        {post.imageUrl && (
                          <img
                            src={post.imageUrl}
                            alt=""
                            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                          />
                        )}

                        <span className="absolute top-3 left-3 text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm z-20">
                          {post.type}
                        </span>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[11px] font-medium text-slate-400 block">
                          {formatDate(post.publishedAt)}
                        </span>
                        <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                          <Link href={`/noticias/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h4>
                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                          {post.excerpt || 'Consulta el comunicado institucional completo.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-3 flex justify-between items-center text-xs">
                      <span className="text-slate-400 text-[11px]">Comunidad IPEM</span>
                      <Link
                        href={`/noticias/${post.slug}`}
                        className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Leer más →</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Enlace al Archivo Histórico */}
            <div className="text-center pt-8">
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-slate-200 hover:border-emerald-300 font-bold text-xs transition shadow-sm hover:shadow"
              >
                <span>Ver archivo histórico de comunicados</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* 6. Pie Institucional */}
      <footer className="bg-emerald-950 text-emerald-200 py-12 border-t-4 border-amber-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
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
            <p className="text-emerald-300/80 text-xs mt-2 font-medium text-amber-300">
              Turno Mañana (07:30 a 13:00) | Turno Tarde (13:15 a 18:45)
            </p>
            <p className="text-emerald-300/70 text-xs mt-2 border-t border-emerald-900/80 pt-2">
              🚌 <strong>Colectivos:</strong> Líneas 40, 41, 42, 44, 70, 72 y 80.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-2">Comunidad Escolar</h4>
            <ul className="text-xs text-emerald-300/80 space-y-1.5">
              <li><Link href="/docentes" className="text-amber-300 hover:underline font-semibold">👨‍🏫 Sala de Docentes</Link></li>
              <li><Link href="/secretaria" className="hover:text-white">🏢 Secretaría y Trámites</Link></li>
              <li><Link href="/tutorias" className="hover:text-white">Clases de Tutorías</Link></li>
              <li><Link href="/biblioteca" className="hover:text-white">Biblioteca Escolar</Link></li>
              <li><Link href="/cooperadora" className="hover:text-white">Asociación Cooperadora</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-base mb-2">Acceso Administrativo</h4>
            <p className="text-emerald-300/80 text-xs leading-relaxed">
              Exclusivo para equipo directivo, secretaría y docentes:
            </p>
            <div className="mt-3">
              <Link
                href="/acceso-institucional"
                className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-300 px-4 py-2.5 rounded-xl font-bold transition inline-flex items-center gap-1.5 border border-slate-700 shadow-sm"
              >
                <span>🔒</span>
                <span>Ingreso Institucional →</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900 mt-10 pt-6 pb-24 sm:pb-8 flex flex-col lg:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <p className="text-center lg:text-left">© {new Date().getFullYear()} IPEM N° 10 Roma. Todos los derechos reservados.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 bg-emerald-900/60 px-4 py-2 rounded-full border border-emerald-700/70 shadow-lg">
            <span className="text-emerald-200">💻 Webmaster y Desarrollo:</span>
            <span className="font-bold text-white">Lic. Rafael Pereyra</span>
            <span className="text-emerald-600 hidden sm:inline">•</span>
            <a
              href="https://wa.me/5493516198503"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 hover:underline transition"
            >
              <span>📲 Contactar por WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
