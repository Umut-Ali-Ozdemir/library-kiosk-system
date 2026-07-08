import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { users } from "../data/users";
import { UserRole } from "../models/user.model";

/* -------------------------------------------------- */
/* CONFIG */
/* -------------------------------------------------- */
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env file");
}

/* -------------------------------------------------- */
/* IDENTIFIER (studentNo OR email) + PASSWORD LOGIN */
/* (ADMIN & STUDENT) */
/* -------------------------------------------------- */
export const login = (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "identifier (studentNo or email) and password are required" });
  }

  const user = users.find(
    (u) => u.studentNo === identifier || u.email === identifier
  );
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      studentNo: user.studentNo ?? null,
    },
  });
};

/* -------------------------------------------------- */
/* QR LOGIN (STUDENT ONLY) */
/* -------------------------------------------------- */
export const qrLogin = (req: Request, res: Response) => {
  const { studentNo } = req.body;

  if (!studentNo) {
    return res.status(400).json({ message: "studentNo is required" });
  }

  const user = users.find(
    (u) => u.studentNo === studentNo && u.role === UserRole.STUDENT
  );

  if (!user) {
    return res.status(404).json({ message: "Student not found" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      studentNo: user.studentNo,
      role: user.role,
    },
  });
};
