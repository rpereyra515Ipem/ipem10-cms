import { db } from '../src/db';
import { users } from '../src/db/schema';
import { hashPassword } from '../src/lib/password';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

async function main() {
  const email = 'rpereyra.ipem10@gmail.com';
  const password = 'MasterIPEM10Seguro!'; // Puedes cambiarla por la que desees
  const hash = await hashPassword(password);

  await db.delete(users).where(eq(users.email, email));

  await db.insert(users).values({
    id: randomUUID(),
    email,
    passwordHash: hash,
    fullName: 'Lic. Rafael Pereyra (Webmaster Master)',
    role: 'MASTER', // Rol con control total técnico y de seguridad
    mustChangePassword: false,
    active: true,
  });

  console.log('\n👑 Usuario MASTER creado con éxito:');
  console.log('--------------------------------------------------');
  console.log(`📧 Correo:     ${email}`);
  console.log(`🔑 Clave:      ${password}`);
  console.log(`🛡️  Rol:        MASTER (Seguridad y Control Total)`);
  console.log('--------------------------------------------------\n');
}

main().then(() => process.exit(0));
