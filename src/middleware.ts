import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'clave-secreta-para-entorno-escolar-ipem10'
);
const COOKIE_NAME = 'ipem10_session';

interface SessionToken {
  userId: string;
  role: 'ADMIN' | 'SECRETARIA' | 'DOCENTE';
  fullName: string;
}

// -------------------------------------------------------------
// MOTOR ANTI-DDOS / RATE LIMITING (En memoria de alta velocidad)
// -------------------------------------------------------------
interface RateLimitTracker {
  count: number;
  expiresAt: number;
}

const rateLimitMap = new Map<string, RateLimitTracker>();

const WINDOW_MS = 60 * 1000; // Ventana de 1 minuto
const MAX_REQUESTS_GENERAL = 100; // Máximo 100 peticiones/minuto por IP para navegación
const MAX_REQUESTS_LOGIN = 15;    // Máximo 15 peticiones/minuto por IP en /login (anti-fuerza bruta)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. OBTENER IP DEL CLIENTE
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 2. APLICAR RATE LIMITING (Defensa L7 contra saturación)
  const isLoginRoute = pathname.startsWith('/login');
  const limit = isLoginRoute ? MAX_REQUESTS_LOGIN : MAX_REQUESTS_GENERAL;
  const key = `${ip}:${isLoginRoute ? 'login' : 'general'}`;
  const now = Date.now();

  const tracker = rateLimitMap.get(key);

  if (!tracker || now > tracker.expiresAt) {
    rateLimitMap.set(key, { count: 1, expiresAt: now + WINDOW_MS });
  } else {
    tracker.count++;
    if (tracker.count > limit) {
      console.warn(`🛑 [BLOQUEO RATE LIMIT / ANTI-DDOS] IP: ${ip} excedió límite en ${pathname}`);

      return new NextResponse(
        `<!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Demasiadas solicitudes - IPEM 10</title>
          <style>
            body { font-family: system-ui, sans-serif; text-align: center; padding: 60px 20px; color: #1e293b; background: #f8fafc; }
            .card { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
            h2 { color: #dc2626; margin-top: 0; }
            p { line-height: 1.6; color: #475569; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>⚠️ Demasiadas solicitudes (429)</h2>
            <p>Se ha detectado un volumen inusualmente alto de peticiones desde su red.</p>
            <p>Por motivos de seguridad, espere <b>1 minuto</b> antes de volver a intentar.</p>
          </div>
        </body>
        </html>`,
        {
          status: 429,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Retry-After': '60',
          },
        }
      );
    }
  }

  // Limpieza periódica de memoria compatible con todas las versiones de TypeScript
  if (rateLimitMap.size > 2000) {
    rateLimitMap.forEach((v, k) => {
      if (now > v.expiresAt) rateLimitMap.delete(k);
    });
  }

  // -------------------------------------------------------------
  // 3. CONTROL DE AUTENTICACIÓN Y ROLES (Tu lógica original intacta)
  // -------------------------------------------------------------
  const isProtectedAdmin = pathname.startsWith('/admin');
  const isProtectedDocentes = pathname.startsWith('/docentes');

  if (isProtectedAdmin || isProtectedDocentes) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // Si no hay sesión, va directo a login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      const session = payload as unknown as SessionToken;

      // Un DOCENTE no puede entrar a las configuraciones de /admin
      if (isProtectedAdmin && session.role === 'DOCENTE') {
        return NextResponse.redirect(new URL('/docentes', request.url));
      }

      return NextResponse.next();
    } catch {
      // Token inválido o manipulado
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Intercepta todas las rutas excepto archivos estáticos de Next.js
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
