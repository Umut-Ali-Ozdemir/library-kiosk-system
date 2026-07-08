import { Router } from "express";
import { login, qrLogin } from "../controllers/auth.controller";

const router = Router();

// normal login (email + password)
router.post("/login", login);

// QR login (student)
router.post("/qr", qrLogin);

export default router;
