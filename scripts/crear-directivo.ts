import { db } from '../src/db';
import { users } from '../src/db/schema';
import { hashPassword } from '../src/lib/password';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const email = 'vicedireccion@ipem10.edu.ar';
  const tempPassword = 'ClaveTemporal123!';
  const hash = await hashPassword(tempPassword);

  // Elimina si existía para prueba limpia
  await db.delete(users).where(eq(users.email, email));

  await db.insert(users).values({
    id: randomUUID(),
    email,
    passwordHash: hash,
    fullName: 'Prof. Vicedirección IPEM 10',
    role: 'ADMIN',
    mustChangePassword: true, // Forzar cambio en primer login
    active: true,
  });

  console.log('\n✅ Usuario directivo de prueba creado con éxito:');
  console.log('--------------------------------------------------');
  console.log(`📧 Correo:     ${email}`);
  console.log(`🔑 Clave temp: ${tempPassword}`);
  console.log('--------------------------------------------------');
  console.log('👉 Ve a http://localhost:3000/login para probar el flujo.');
}

main();
