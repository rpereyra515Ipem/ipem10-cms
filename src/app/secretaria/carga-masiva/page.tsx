import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CargaMasivaClient from './CargaMasivaClient';

export default async function CargaMasivaPage() {
  const cookieStore = await cookies();
  
  // Buscar token o cookie de sesión
  const sessionCookie = cookieStore.get('session')?.value || cookieStore.get('auth_token')?.value;

  // Si no hay sesión iniciada, expulsar al login
  if (!sessionCookie) {
    redirect('/acceso-institucional?error=unauthorized');
  }

  // Parsear datos de sesión si están en JSON o validar permisos
  try {
    let role = '';
    if (sessionCookie.startsWith('{')) {
      const parsed = JSON.parse(sessionCookie);
      role = parsed.role;
    } else {
      // Si la cookie es un rol directo o token
      role = sessionCookie;
    }

    const rolesAutorizados = ['SECRETARIA', 'DIRECTIVO', 'MASTER'];
    
    // Si tiene sesión pero es DOCENTE o PRECEPTOR, denegar acceso
    if (role && !rolesAutorizados.includes(role.toUpperCase())) {
      redirect('/secretaria?error=forbidden');
    }
  } catch {
    // Si la cookie está corrupta o no es válida
    // Permitir si existe sesión válida controlada por middleware
  }

  return <CargaMasivaClient />;
}
