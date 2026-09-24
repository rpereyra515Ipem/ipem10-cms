import Link from 'next/link';

export default function EstudiantesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <nav className="mb-6">
        <Link href="/" className="text-blue-700 hover:underline text-sm font-medium">
          ← Volver a la portada de la escuela
        </Link>
      </nav>

      <header className="bg-white border rounded-xl p-8 mb-8 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full">
          Comunidad Estudiantil
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">
          Portal de Estudiantes y Familias
        </h1>
        <p className="text-gray-600">
          Acceso a materias, programas de examen, horarios de cursado y herramientas escolares.
        </p>

        {/* Cuadro explicativo para padres */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
          <strong>Aviso a las familias y tutores:</strong> Para consultar el seguimiento académico, pueden ingresar acompañando al estudiante con su cuenta de correo institucional <em>(@ipem10.edu.ar)</em>.
        </div>

        <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">Inicio de Sesión Escolar</p>
            <p className="text-xs text-gray-500">Usa tu usuario y contraseña de Google del IPEM 10</p>
          </div>
          <button
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.73h5.51c-.33 1.95-1.92 3.32-4.14 3.32a4.65 4.65 0 0 1 0-9.3c1.19 0 2.29.45 3.13 1.25l2.06-2.06A7.47 7.47 0 0 0 12.18 5C8.21 5 5 8.21 5 12.18s3.21 7.18 7.18 7.18c4.27 0 7.07-3 7.07-7.21 0-.35-.04-.7-.1-1.05z"
              />
            </svg>
            Ingresar como Estudiante
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl mb-2">📚</div>
          <h2 className="font-bold text-gray-800 text-lg mb-2">Programas de Materias Previas</h2>
          <p className="text-gray-600 text-sm mb-4">
            Descarga los contenidos prioritarios y ejes temáticos para preparar tus mesas de examen de 1° a 6° año.
          </p>
          <span className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline">
            Ver listado de programas por año →
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl mb-2">🕒</div>
          <h2 className="font-bold text-gray-800 text-lg mb-2">Horarios de Clases</h2>
          <p className="text-gray-600 text-sm mb-4">
            Grillas horarias vigentes para el Turno Mañana y Turno Tarde organizadas por división.
          </p>
          <span className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline">
            Consultar horarios de mi curso →
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl mb-2">💻</div>
          <h2 className="font-bold text-gray-800 text-lg mb-2">Google Classroom del Colegio</h2>
          <p className="text-gray-600 text-sm mb-4">
            Acceso directo a las aulas virtuales de tus materias con las tareas y materiales docentes.
          </p>
          <a
            href="https://classroom.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-700 text-sm font-semibold hover:underline"
          >
            Abrir Classroom en Google →
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl mb-2">📋</div>
          <h2 className="font-bold text-gray-800 text-lg mb-2">Secretaría y Constancias</h2>
          <p className="text-gray-600 text-sm mb-4">
            Información sobre cómo tramitar la constancia de alumno regular y horarios de atención de preceptoría.
          </p>
          <span className="text-blue-700 text-sm font-semibold cursor-pointer hover:underline">
            Requisitos y trámites →
          </span>
        </div>
      </section>
    </main>
  );
}
