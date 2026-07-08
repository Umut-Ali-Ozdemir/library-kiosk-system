import bcrypt from "bcryptjs";
import { User, UserRole } from "../models/user.model";

export const users: User[] = [
  // ADMIN
  {
    id: 1,
    fullName: "Library Admin",
    role: UserRole.ADMIN,
    email: "admin@uni.edu.tr",
    passwordHash: bcrypt.hashSync("Admin1234!", 10),
  },

  // STUDENT (QR + mail)
  {
    id: 101,
    studentNo: "20230001",
    fullName: "Umut Ali Özdemir",
    role: UserRole.STUDENT,
    email: "umut.ali@uni.edu.tr",
    passwordHash: bcrypt.hashSync("Student1234!", 10),
  },
];
