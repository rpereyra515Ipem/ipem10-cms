import { db } from '../src/db';
import { users } from '../src/db/schema';
import { eq } from 'drizzle-orm';

let bcrypt: any;
try {
  bcrypt = require('bcryptjs');
} catch {
  bcrypt = require('bcrypt');
}

async function run() {
  const email = 'secretaria@ipem10.edu.ar';
  const rawPassword = 'Secretaria2026!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // Verificar si ya existe
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length > 0) {
    await db.update(users).set({
      name: 'Secretaría IPEM 10',
      role: 'SECRETARIA',
      password: hashedPassword,
      isActive: true,
    }).where(eq(users.email, email));
    console.log('✅ Usuario secretaria@ipem10.edu.ar actualizado con rol SECRETARIA.');
  } else {
    await db.insert(users).values({
      name: 'Secretaría IPEM 10',
      email: email,
      personalEmail: 'secretaria.ipem10@gmail.com',
      role: 'SECRETARIA',
      password: hashedPassword,
      isActive: true,
    });
    console.log('✅ Usuario secretaria@ipem10.edu.ar creado con éxito.');
  }

  console.log('\n--- DATOS DE ACCESO PARA PRUEBA ---');
  console.log('URL de Login: http://localhost:3000/acceso-institucional');
  console.log('Usuario:      secretaria@ipem10.edu.ar');
  console.log('Contraseña:   Secretaria2026!');
  console.log('Rol asignado: SECRETARIA\n');
}

run().catch((err) => {
  console.error('Error al crear usuario:', err);
  process.exit(1);
});
