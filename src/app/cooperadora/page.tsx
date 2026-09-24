import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';

export default function CooperadoraPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <nav className="mb-6">
        <Link href="/" className="text-emerald-800 hover:underline text-sm font-semibold">
          ← Volver a la portada de la escuela
        </Link>
      </nav>

      {/* Encabezado */}
      <header className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <SchoolLogo size="md" />
        </div>
        <span className="text-xs uppercase font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full">
          Comunidad y Participación Familiar
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 mb-2 tracking-tight">
          Asociación Cooperadora Escolar
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          IPEM N° 10 Roma • Familias, docentes y directivos trabajando juntos para brindar mejores condiciones de aprendizaje a nuestros jóvenes.
        </p>
      </header>

      {/* El Rol Fundamental de la Cooperadora */}
      <section className="bg-white border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-gray-900">¿Por qué es vital la Cooperadora en el IPEM 10?</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          La Asociación Cooperadora es una entidad civil sin fines de lucro conformada por padres, madres, tutores y docentes. En una escuela pública con especialidades técnicas como <strong>Programación y Robótica</strong>, su aporte hace posible:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-emerald-950 text-sm mb-1">🛠️ Insumos y Equipamiento</p>
            <p className="text-xs text-gray-600">Componentes electrónicos, placas de robótica, filamento 3D, cables e insumos de computación para las clases prácticas.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-emerald-950 text-sm mb-1">🏢 Mantenimiento Edilicio</p>
            <p className="text-xs text-gray-600">Reparación de luminarias, ventiladores, cerraduras, pintura de aulas y mantenimiento de sanitarios en Padre Lozano 375.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-emerald-950 text-sm mb-1">📄 Materiales Didácticos</p>
            <p className="text-xs text-gray-600">Resmas de papel para exámenes de secretaría, tóner de impresoras y bibliografía escolar para los estudiantes.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-100">
            <p className="font-bold text-emerald-950 text-sm mb-1">🤝 Bienestar Estudiantil</p>
            <p className="text-xs text-gray-600">Acompañamiento a viajes educativos, participación en olimpíadas provinciales y jornadas recreativas escolares.</p>
          </div>
        </div>
      </section>

      {/* Cómo Colaborar (Canales Oficiales) */}
      <section className="bg-emerald-950 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
        <h2 className="text-xl font-extrabold text-amber-300 mb-2">Canales Oficiales de Colaboración</h2>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed mb-6">
          El aporte o cuota societaria es de carácter voluntario pero indispensable para el funcionamiento diario. Se puede abonar presencialmente o mediante transferencia bancaria institucional:
        </p>

        <div className="bg-white/10 p-5 rounded-xl border border-emerald-700/50 space-y-3 text-xs sm:text-sm">
          <div>
            <span className="text-emerald-300 block text-[11px] uppercase font-bold">Titular de la cuenta:</span>
            <span className="font-bold text-white text-base">Asociación Cooperadora IPEM N° 10 Roma</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-800">
            <div>
              <span className="text-emerald-300 block text-[11px] uppercase font-bold">Alias Oficial de Transferencia:</span>
              <span className="font-mono font-bold text-amber-300 text-sm sm:text-base">COOPERADORA.IPEM10</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[11px] uppercase font-bold">Pago Presencial:</span>
              <span className="font-medium text-white">En preceptoría escolar (Turno Mañana y Tarde)</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-emerald-300 mt-4">
          * Tras realizar una transferencia, por favor enviar el comprobante indicando nombre, apellido y curso del estudiante al correo de contacto escolar para la emisión del recibo oficial.
        </p>
      </section>

      {/* Sumate a la Comisión de Padres */}
      <section className="bg-white border rounded-2xl p-6 shadow-sm text-center space-y-3">
        <h3 className="font-bold text-gray-900 text-base">¿Querés sumarte a participar de la Cooperadora?</h3>
        <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
          Las reuniones y asambleas ordinarias se realizan periódicamente en la escuela. La participación activa de las familias es el mayor motor para el futuro de los chicos.
        </p>
        <div className="pt-2">
          <Link href="/institucional" className="text-xs text-emerald-800 font-bold hover:underline">
            Consultar vías de contacto con la escuela →
          </Link>
        </div>
      </section>
    </main>
  );
}
