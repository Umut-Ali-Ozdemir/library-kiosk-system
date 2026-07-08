export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;

  // QR / öğrenci kartı
  studentNo?: string;

  // Mail + şifre ile giriş
  email?: string;

  fullName: string;
  role: UserRole;

  // bcrypt hash
  passwordHash?: string;
}
