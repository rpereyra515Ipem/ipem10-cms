import bcrypt from 'bcryptjs';

export interface PasswordValidationResult {
  isValid: boolean;
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  noBlacklist: boolean;
  errorMessage?: string;
}

export function validatePasswordSecurity(password: string): PasswordValidationResult {
  const hasLength = password.length >= 10;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  // Lista negra de términos obvios de la escuela
  const blacklist = ['ipem', 'roma', 'alberdi', 'cordoba', 'escuela', 'colegio', '123456', 'admin'];
  const passLower = password.toLowerCase();
  const noBlacklist = !blacklist.some((term) => passLower.includes(term));

  const isValid = hasLength && hasUpper && hasLower && hasNumber && hasSymbol && noBlacklist;

  let errorMessage: string | undefined;
  if (!noBlacklist) {
    errorMessage = 'La contraseña no puede contener nombres obvios (como "ipem", "roma", "alberdi").';
  } else if (!isValid) {
    errorMessage = 'La contraseña debe cumplir todos los requisitos de seguridad obligatorios.';
  }

  return {
    isValid,
    hasLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSymbol,
    noBlacklist,
    errorMessage,
  };
}

export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plain, hash);
}
