import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';

export default function InstitucionalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Barra de Navegación Institucional */}
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

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Inicio
            </Link>
            <Link
              href="/tutorias"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition hidden sm:inline-block"
            >
              📖 Tutorías
            </Link>
            <Link
              href="/biblioteca"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-blue-900 bg-blue-50 hover:bg-blue-100 transition hidden sm:inline-block"
            >
              📚 Biblioteca
            </Link>
            <Link
              href="/cooperadora"
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-amber-900 bg-amber-50 hover:bg-amber-100 transition hidden sm:inline-block"
            >
              🤝 Cooperadora
            </Link>
            <Link
              href="/login"
              className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg text-white bg-slate-900 hover:bg-emerald-900 transition flex items-center gap-1 shadow-sm"
            >
              <span>🔒</span>
              <span>Gestión</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. Hero Institucional */}
      <section className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-green-950 text-white py-14 px-4 border-b border-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-3">
            <SchoolLogo size="lg" className="drop-shadow-2xl" />
          </div>
          <span className="inline-block text-xs uppercase tracking-widest font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full mb-3">
            Identidad • Historia • Comunidad
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            Instituto Provincial de Educación Media N° 10 Roma
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Una escuela secundaria pública con arraigo histórico en Barrio Alto Alberdi, comprometida con la inclusión social y la formación técnica y humana de los jóvenes de Córdoba.
          </p>
        </div>
      </section>

      {/* 3. Ficha Técnica */}
      <section className="max-w-5xl mx-auto px-4 -mt-6 mb-12 w-full relative z-20">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="border-r last:border-none border-gray-100 p-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">CUE Oficial</p>
            <p className="text-xl font-black text-emerald-950 mt-1">1404728-00</p>
            <span className="text-[10px] text-emerald-700 font-semibold">Min. de Educación Cba</span>
          </div>
          <div className="border-r last:border-none border-gray-100 p-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Turnos</p>
            <p className="text-xl font-black text-emerald-950 mt-1">Mañana y Tarde</p>
            <span className="text-[10px] text-gray-500 font-medium">1° a 6° Año</span>
          </div>
          <div className="border-r last:border-none border-gray-100 p-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Barrio</p>
            <p className="text-xl font-black text-emerald-950 mt-1">Alto Alberdi</p>
            <span className="text-[10px] text-gray-500 font-medium">Córdoba Capital</span>
          </div>
          <div className="p-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Especialidad</p>
            <p className="text-xl font-black text-amber-600 mt-1">Web y Robótica</p>
            <span className="text-[10px] text-emerald-700 font-semibold">Ciclo Orientado</span>
          </div>
        </div>
      </section>

      {/* 4. Estructura Curricular */}
      <main className="max-w-5xl mx-auto px-4 mb-14 w-full space-y-12">
        <section>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Trayectoria Pedagógica
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              Estructura Curricular del IPEM 10
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Formación integral desde el ingreso hasta la inserción terciaria, universitaria o laboral.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md inline-block mb-3">
                  1°, 2° y 3° Año
                </span>
                <h3 className="text-xl font-black text-gray-900 mb-2">Ciclo Básico Común</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  Fortalecimiento de aprendizajes fundamentales: lengua, matemática, ciencias sociales y naturales, inglés, artes y educación física.
                </p>
                <ul className="text-xs text-gray-700 space-y-2 border-t pt-3">
                  <li className="flex items-center gap-2">✓ Acompañamiento pedagógico personalizado</li>
                  <li className="flex items-center gap-2">✓ Clases de tutorías semanales sin costo</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Link href="/descargas?cat=PROGRAMA" className="text-xs font-bold text-emerald-800 hover:underline">
                  Ver programas del Ciclo Básico →
                </Link>
              </div>
            </div>

            <div className="bg-white border-2 border-amber-300 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                Orientación Técnica
              </div>
              <div>
                <span className="text-xs font-black uppercase text-amber-900 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md inline-block mb-3">
                  4°, 5° y 6° Año
                </span>
                <h3 className="text-xl font-black text-gray-900 mb-2">
                  Desarrollo de Software y Robótica
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  Formación técnica de vanguardia para responder a las demandas tecnológicas de Córdoba. Proyectos reales en programación web, bases de datos y robótica.
                </p>
                <ul className="text-xs text-gray-700 space-y-2 border-t pt-3">
                  <li className="flex items-center gap-2">💻 Laboratorio de informática y programación</li>
                  <li className="flex items-center gap-2">🤖 Proyectos prácticos de robótica y automatización</li>
                </ul>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Link href="/tutorias" className="text-xs font-bold text-emerald-800 hover:underline">
                  Tutorías técnicas de la especialidad →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Redes Sociales Oficiales con Logotipos Vectoriales Oficiales */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-xs uppercase font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              Comunidad Digital
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">Canales Oficiales del IPEM 10</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Sigue las actividades de los estudiantes, muestras anuales y proyectos en nuestras redes institucionales:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Facebook */}
            <a
              href="https://facebook.com/ipem10roma"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-[#1877F2] bg-white flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-[#1877F2]/10 transition">
                  <svg className="w-6 h-6 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-base text-gray-900">Facebook</h3>
                <p className="font-bold text-xs text-[#1877F2] mt-0.5 mb-2">IPEM 10 Roma</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Actos escolares, festejos de aniversario y comunicados a la comunidad de Alto Alberdi.
                </p>
              </div>
              <span className="text-xs font-bold text-[#1877F2] mt-4 inline-flex items-center gap-1 group-hover:underline">
                Visitar página oficial ↗
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/ipem10roma"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-[#E4405F] bg-white flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center mb-3 group-hover:bg-[#E4405F]/10 transition">
                  <svg className="w-6 h-6 fill-[#E4405F]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-base text-gray-900">Instagram</h3>
                <p className="font-bold text-xs text-[#E4405F] mt-0.5 mb-2">@ipem10roma</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Galería visual de proyectos, talleres de robótica, buzos de 6° año y vida estudiantil.
                </p>
              </div>
              <span className="text-xs font-bold text-[#E4405F] mt-4 inline-flex items-center gap-1 group-hover:underline">
                Seguir en Instagram ↗
              </span>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-[#FF0000] bg-white flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-3 group-hover:bg-[#FF0000]/10 transition">
                  <svg className="w-6 h-6 fill-[#FF0000]" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-base text-gray-900">YouTube</h3>
                <p className="font-bold text-xs text-[#FF0000] mt-0.5 mb-2">Canal IPEM 10</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Registro audiovisual de muestras anuales, conferencias, actos y presentaciones técnicas.
                </p>
              </div>
              <span className="text-xs font-bold text-[#FF0000] mt-4 inline-flex items-center gap-1 group-hover:underline">
                Ver canal de videos ↗
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5493514347871"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md hover:border-[#25D366] bg-white flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-3 group-hover:bg-[#25D366]/10 transition">
                  <svg className="w-6 h-6 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.676.15-.2.3-.776.978-.952 1.179-.176.2-.352.225-.653.075-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.496-1.78-1.672-2.08-.176-.3-.019-.462.13-.612.136-.134.301-.35.452-.525.15-.176.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-1.026-2.23-.341-.58-.686-.5-1.036-.514-.27-.01-.577-.014-.884-.014-.307 0-.806.115-1.228.575-.422.46-1.611 1.574-1.611 3.838 0 2.264 1.651 4.453 1.882 4.754.23.3 3.25 4.962 7.873 6.962 1.1.476 1.958.761 2.628.974 1.104.35 2.11.3 2.905.182.886-.132 2.723-1.113 3.104-2.188.381-1.075.381-1.996.267-2.188-.114-.192-.315-.3-.616-.45zM12.04 21.845c-1.77 0-3.5-.47-5.02-1.36l-.36-.21-3.73.98.99-3.64-.23-.37a9.78 9.78 0 0 1-1.5-5.24c0-5.41 4.41-9.82 9.85-9.82 2.63 0 5.1 1.03 6.96 2.89a9.79 9.79 0 0 1 2.88 6.94c0 5.42-4.42 9.83-9.84 9.83zm8.38-18.23C18.19 1.4 15.22.45 12.04.45 5.67.45.49 5.63.49 12c0 2.03.53 4.02 1.54 5.77L0 24l6.41-1.68c1.68.92 3.58 1.4 5.63 1.4 6.37 0 11.55-5.18 11.55-11.55 0-3.08-1.2-5.98-3.17-8.15z"/>
                  </svg>
                </div>
                <h3 className="font-extrabold text-base text-gray-900">WhatsApp</h3>
                <p className="font-bold text-xs text-[#25D366] mt-0.5 mb-2">Secretaría Escolar</p>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Canal de consultas rápidas para familias y tutores en horarios de preceptoría.
                </p>
              </div>
              <span className="text-xs font-bold text-[#25D366] mt-4 inline-flex items-center gap-1 group-hover:underline">
                Enviar mensaje ↗
              </span>
            </a>
          </div>
        </section>

        {/* 6. Ubicación con Mapa Interactivo de Google Maps */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <span className="text-xs uppercase font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Geolocalización
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">Cómo llegar a la Escuela</h2>
            </div>
            <a
              href="https://maps.google.com/?q=Padre+Lozano+375,+Alto+Alberdi,+Cordoba,+Argentina"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1"
            >
              <span>🗺️</span> Abrir en Google Maps / GPS ↗
            </a>
          </div>

          {/* Mapa Interactivo Incrustado */}
          <div className="w-full h-80 rounded-2xl overflow-hidden border border-gray-200 shadow-inner mb-6 bg-slate-100">
            <iframe
              title="Ubicación IPEM N° 10 Roma"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src="https://maps.google.com/maps?q=Padre+Lozano+375,+Alto+Alberdi,+C%C3%B3rdoba,+Argentina&t=&z=16&ie=UTF8&iwloc=&output=embed"
            />
          </div>

          {/* Datos de Transporte y Secretaría */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700 pt-2 border-t">
            <div className="space-y-2">
              <p className="font-bold text-sm text-gray-900">📍 Dirección y Contacto Oficial:</p>
              <p>• Domicilio: <strong>Padre Lozano 375, Barrio Alto Alberdi</strong> (Córdoba Capital)</p>
              <p>• Teléfono de atención: <strong>0351-4347871</strong></p>
              <p>• Correo electrónico: <strong className="text-emerald-800">direccion@ipem10.edu.ar</strong></p>
              <p>• Horarios de Secretaría: TM: 08:00 a 12:00 hs | TT: 13:30 a 17:30 hs</p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border">
              <p className="font-bold text-sm text-gray-900">🚌 Transporte Urbano Cercano:</p>
              <p>• <strong>Corredor 4 (Av. Colón):</strong> Líneas 40, 41, 42, 44 y trolebús.</p>
              <p>• <strong>Corredor 7 y 8:</strong> Líneas 70, 72, 75, 80 y 82.</p>
              <p className="text-[11px] text-gray-500 pt-1">A pocas cuadras de Plaza Jerónimo del Barco y Av. Santa Fe.</p>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Pie Institucional Oficial */}
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
              <li><Link href="/tutorias" className="hover:text-white">Clases de Tutorías</Link></li>
              <li><Link href="/biblioteca" className="hover:text-white">Biblioteca Escolar</Link></li>
              <li><Link href="/cooperadora" className="hover:text-white">Asociación Cooperadora</Link></li>
              <li><Link href="/mesas" className="hover:text-white">Cronograma de Exámenes</Link></li>
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
      </footer>
    </div>
  );
}