import { getStudentNoticeByToken } from '@/actions/student-notices';
import ComunicadoPublicoClient from './ComunicadoPublicoClient';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    token: string;
  };
}

export default async function ComunicadoPage({ params }: Props) {
  const { token } = params;
  const notice = await getStudentNoticeByToken(token);

  if (!notice) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-center">
            <SchoolLogo size="md" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Cédula No Encontrada</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            El enlace ingresado no existe, fue dado de baja o el código de verificación es inválido.
          </p>
          <p className="text-xs font-bold text-emerald-800">
            Teléfono del colegio: (0351) 4347871
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
            >
              Volver a la portada del IPEM 10
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <ComunicadoPublicoClient notice={notice} />;
}
