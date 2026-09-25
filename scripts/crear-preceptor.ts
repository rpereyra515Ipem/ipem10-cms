import { db } from '../src/db';
import { users } from '../src/db/schema';
import { hashPassword } from '../src/lib/password';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const email = 'preceptoria.manana@ipem10.edu.ar';
  const password = 'PreceptorIPEM10!';
  const hash = await hashPassword(password);

  await db.delete(users).where(eq(users.email, email));

  await db.insert(users).values({
    id: randomUUID(),
    email,
    passwordHash: hash,
    fullName: 'Preceptoría Turno Mañana',
    role: 'PRECEPTOR', // Rol con permisos exclusivos de cursos y división
    mustChangePassword: false,
    active: true,
  });

  console.log('\n🧑‍🏫 Usuario PRECEPTOR creado con éxito:');
  console.log('--------------------------------------------------');
  console.log(`📧 Correo:     ${email}`);
  console.log(`🔑 Clave:      ${password}`);
  console.log(`🛡️  Rol:        PRECEPTOR (Gestión de Cursos y Avisos)`);
  console.log('--------------------------------------------------\n');
}

main().then(() => process.exit(0));
