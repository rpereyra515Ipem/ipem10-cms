import { db } from '../src/db';
import { users } from '../src/db/schema';
import { hashPassword } from '../src/lib/password';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const email = 'docente@ipem10.edu.ar';
  const tempPassword = 'ProfesorSeguro2026!';
  const hash = await hashPassword(tempPassword);

  await db.delete(users).where(eq(users.email, email));

  await db.insert(users).values({
    id: randomUUID(),
    email,
    passwordHash: hash,
    fullName: 'Prof. Carlos Gómez (Robótica)',
    role: 'DOCENTE',
    mustChangePassword: false, // Ya activa para prueba directa
    active: true,
  });

  console.log('\n✅ Cuenta de profesor creada para prueba:');
  console.log('--------------------------------------------------');
  console.log(`📧 Correo:     ${email}`);
  console.log(`🔑 Contraseña: ${tempPassword}`);
  console.log('--------------------------------------------------');
  console.log('👉 Al ingresar con esta cuenta, irá directo a /docentes.');
}

main();
