import Link from 'next/link';

export default function BibliotecaPage() {
  const recursos = [
    {
      titulo: 'Portal Educ.ar - Colecciones Digitales',
      categoria: 'Recurso Oficial',
      descripcion: 'Miles de recursos educativos abiertos, secuencias didácticas y contenidos multimedia del Ministerio de Educación.',
      enlace: 'https://www.educ.ar',
      icono: '🇦🇷',
    },
    {
      titulo: 'Biblioteca Nacional de Maestros (BNM)',
      categoria: 'Lecturas y Archivo',
      descripcion: 'Acceso a colecciones pedagógicas, literatura clásica y libros de texto históricos y contemporáneos.',
      enlace: 'http://www.bnm.me.gov.ar',
      icono: '🏛️',
    },
    {
      titulo: 'Conectar Igualdad - Recursos y Software',
      categoria: 'Tecnología y Web',
      descripcion: 'Manuales de software libre, guías de programación, robótica y entornos de desarrollo estudiantil.',
      enlace: 'https://conectarigualdad.edu.ar',
      icono: '💻',
    },
    {
      titulo: 'Biblioteca Digital Ciudadana (Córdoba)',
      categoria: 'Literatura Provincial',
      descripcion: 'Textos, narraciones y autores cordobeses para los proyectos de lectura del Ciclo Básico y Orientado.',
      enlace: 'https://cidi.cba.gov.ar',
      icono: '📚',
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <nav className="mb-6">
        <Link href="/" className="text-emerald-800 hover:underline text-sm font-semibold">
          ← Volver a la portada de la escuela
        </Link>
      </nav>

      <header className="text-center mb-10">
        <span className="text-xs uppercase font-extrabold text-blue-800 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full">
          Centro de Recursos para el Aprendizaje
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-2 tracking-tight">
          Biblioteca Escolar Digital
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Espacio de lectura, investigación y apoyo pedagógico para estudiantes y docentes del IPEM N° 10 Roma.
        </p>
      </header>

      {/* Ficha de la Biblioteca Física */}
      <section className="bg-white border rounded-2xl p-6 sm:p-8 mb-10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h2 className="text-xl font-bold text-gray-900">Biblioteca Física en la Escuela</h2>
          </div>
          <p className="text-sm text-gray-600 max-w-xl">
            Contamos con más de 3.500 ejemplares disponibles para préstamo en sala y a domicilio: novelas, enciclopedias, textos de robótica, informática y ciencias sociales.
          </p>
          <div className="text-xs text-emerald-800 font-semibold pt-1">
            🕒 Atención presencial: Lunes a Viernes en ambos turnos.
          </div>
        </div>

        <Link
          href="/descargas?cat=PROGRAMA"
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition whitespace-nowrap"
        >
          Descargar Programas de Estudio →
        </Link>
      </section>

      {/* Portales Digitales Recomendados */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Bibliotecas y Portales Abiertos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {recursos.map((rec, idx) => (
          <a
            key={idx}
            href={rec.enlace}
            target="_blank"
            rel="noreferrer"
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-emerald-600 hover:shadow-md transition flex items-start gap-4 group"
          >
            <div className="text-3xl shrink-0 p-2 bg-slate-50 rounded-xl">{rec.icono}</div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {rec.categoria}
              </span>
              <h3 className="font-bold text-gray-900 text-base mt-1 group-hover:text-emerald-800 transition">
                {rec.titulo} ↗
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{rec.descripcion}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
