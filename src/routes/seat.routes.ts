import { Router } from "express";
import {
  getAllSeats,
  occupySeat,
  releaseSeat,
  breakSeat,
  returnFromBreak,
  adminForceRelease,
} from "../controllers/seat.controller";
import { requireAuth, requireAdmin } from "../middlewares/auth";

const router = Router();

// herkes görebilir
router.get("/seats", getAllSeats);

// öğrenci işlemleri (TOKEN ŞART)
router.post("/seats/:id/occupy", requireAuth, occupySeat);
router.post("/seats/:id/release", requireAuth, releaseSeat);
router.post("/seats/:id/break", requireAuth, breakSeat);
router.post("/seats/:id/return", requireAuth, returnFromBreak);

// admin işlemi
router.post(
  "/admin/seats/:id/force-release",
  requireAuth,
  requireAdmin,
  adminForceRelease
);

export default router;
