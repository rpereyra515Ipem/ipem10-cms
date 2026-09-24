import Link from 'next/link';

export default function TutoriasPage() {
  const tutorias = [
    {
      materia: 'Matemática',
      area: 'Exactas',
      icono: '📐',
      color: 'border-blue-500',
      dias: 'Martes y Jueves',
      horario: 'TM: 11:30 a 12:50 hs | TT: 13:30 a 14:50 hs',
      espacio: 'Aula 3 / Taller',
      objetivo: 'Apoyo en álgebra, funciones, geometría y preparación de previas.',
    },
    {
      materia: 'Lengua y Literatura',
      area: 'Comunicación',
      icono: '📖',
      color: 'border-amber-500',
      dias: 'Lunes y Miércoles',
      horario: 'TM: 10:45 a 12:05 hs | TT: 14:00 a 15:20 hs',
      espacio: 'Biblioteca',
      objetivo: 'Comprensión lectora, redacción de textos, análisis sintáctico y géneros literarios.',
    },
    {
      materia: 'Educación Tecnológica e Informática',
      area: 'Técnica / Especialidad',
      icono: '💻',
      color: 'border-emerald-500',
      dias: 'Miércoles y Viernes',
      horario: 'TM: 09:15 a 10:35 hs | TT: 15:30 a 16:50 hs',
      espacio: 'Laboratorio de Informática',
      objetivo: 'Lógica computacional, programación básica, robótica y proyectos tecnológicos.',
    },
    {
      materia: 'Idioma Extranjero: Inglés',
      area: 'Lenguas Extranjeras',
      icono: '🌍',
      color: 'border-purple-500',
      dias: 'Martes',
      horario: 'TM: 08:30 a 10:30 hs | TT: 14:00 a 16:00 hs',
      espacio: 'Aula 5',
      objetivo: 'Gramática, vocabulario técnico y preparación de coloquios y mesas.',
    },
    {
      materia: 'Ciencias Naturales (Biología / Físico-Química)',
      area: 'Científica',
      icono: '🔬',
      color: 'border-teal-500',
      dias: 'Jueves',
      horario: 'TM: 09:15 a 11:15 hs | TT: 15:00 a 17:00 hs',
      espacio: 'Laboratorio de Ciencias',
      objetivo: 'El método científico, la célula, química general, física y trabajos de laboratorio.',
    },
    {
      materia: 'Ciencias Sociales (Historia / Geografía)',
      area: 'Sociales',
      icono: '🗺️',
      color: 'border-orange-500',
      dias: 'Viernes',
      horario: 'TM: 10:45 a 12:50 hs | TT: 13:30 a 15:30 hs',
      espacio: 'Aula 2',
      objetivo: 'Lectura crítica, mapas históricos, procesos latinoamericanos y ciudadanía.',
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
        <span className="text-xs uppercase font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
          Acompañamiento a las Trayectorias
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-2 tracking-tight">
          Espacios de Tutorías Escolares
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Clases de apoyo pedagógico gratuitas brindadas por docentes del IPEM 10 Roma para reforzar contenidos, evacuar dudas y preparar mesas de exámenes pendientes.
        </p>
      </header>

      {/* Tarjeta de Motivación al Estudiante */}
      <section className="bg-gradient-to-r from-emerald-900 to-green-950 text-white rounded-2xl p-6 sm:p-8 mb-10 shadow-md">
        <h2 className="text-xl font-bold mb-2">¿Por qué asistir a las tutorías?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-emerald-100 mt-4">
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="font-bold text-white mb-1">🎯 Apoyo Personalizado</p>
            <p>Grupos reducidos donde el profesor te explica a tu ritmo y con ejemplos prácticos.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="font-bold text-white mb-1">📚 Preparar Previas</p>
            <p>Revisión guiada del programa de examen oficial para presentarte seguro al tribunal.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <p className="font-bold text-white mb-1">💡 Sin Costo Alguno</p>
            <p>Servicio pedagógico público garantizado por la escuela en ambos turnos.</p>
          </div>
        </div>
      </section>

      {/* Grilla de Materias con Tutorías */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {tutorias.map((t, idx) => (
          <div
            key={idx}
            className={`bg-white border-2 ${t.color} rounded-2xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between`}
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className="text-2xl">{t.icono}</span>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {t.area}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-1">{t.materia}</h3>
              <p className="text-xs text-gray-600 mb-4">{t.objetivo}</p>
            </div>

            <div className="border-t pt-3 space-y-1.5 text-xs text-gray-700 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">📅 Días:</span>
                <span>{t.dias}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">🕒 Horarios:</span>
                <span className="font-semibold text-emerald-800">{t.horario}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">📍 Espacio:</span>
                <span>{t.espacio}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Cómo inscribirse */}
      <footer className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-xs text-amber-900">
        <h3 className="font-bold text-sm text-amber-950 mb-1">¿Cómo participo de las tutorías?</h3>
        <p className="leading-relaxed">
          No necesitas inscripción previa compleja: acércate a preceptoría de tu turno o directamente al docente tutor en el horario indicado. Trae tu carpeta y el programa de la materia para optimizar el tiempo de consulta.
        </p>
      </footer>
    </main>
  );
}
