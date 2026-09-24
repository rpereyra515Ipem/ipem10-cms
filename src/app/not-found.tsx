import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Página no encontrada</h2>
      <p className="text-gray-600 mb-4 text-sm">El contenido solicitado no existe o fue movido.</p>
      <Link href="/" className="text-emerald-700 font-semibold underline text-sm">
        Volver a la portada del IPEM 10
      </Link>
    </div>
  );
}
