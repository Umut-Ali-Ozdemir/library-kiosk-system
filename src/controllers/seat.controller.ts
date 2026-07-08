import type { Request, Response } from "express";
import { seats } from "../data/seats";
import { sessions } from "../data/sessions";
import { SeatStatus } from "../models/seat.model";

/* -------------------------------------------------- */
/* GET ALL SEATS */
/* -------------------------------------------------- */
export const getAllSeats = (req: Request, res: Response) => {
  return res.status(200).json(seats);
};

/* -------------------------------------------------- */
/* OCCUPY SEAT (TOKEN) */
/* -------------------------------------------------- */
export const occupySeat = (req: Request, res: Response) => {
  const seatId = Number(req.params.id);
  const userId = req.user!.userId;

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.isOccupied) {
    return res.status(409).json({ message: "Seat is already occupied" });
  }

  // Aynı kullanıcının aktif oturumu var mı?
  const activeSession = sessions.find(
    (x) => x.userId === userId && x.isActive
  );
  if (activeSession) {
    return res
      .status(409)
      .json({ message: "User already has an active session" });
  }

  /* 🔔 ÖNCEKİ OTURUMDAN BİLDİRİM VAR MI? */
  const previousSession = sessions.find(
    (s) =>
      s.userId === userId &&
      !s.isActive &&
      s.lastEndReason === "BREAK_TIME_EXPIRED" &&
      !s.notified
  );

  let notification = null;

  if (previousSession) {
    notification = {
      type: "INFO",
      message:
        "Mola süreniz dolduğu için koltuğunuz yönetici tarafından boşaltıldı.",
    };
    previousSession.notified = true;
  }

  // Koltuğu işaretle
  seat.isOccupied = true;
  seat.occupiedByUserId = userId;
  seat.status = SeatStatus.OCCUPIED;
  seat.breakEndsAt = null;

  // Yeni oturum oluştur
  const newSessionId =
    sessions.length > 0 ? sessions[sessions.length - 1].id + 1 : 1;

  sessions.push({
    id: newSessionId,
    userId,
    seatId,
    startedAt: Date.now(),
    isActive: true,
    breaksRemaining: 3,
  });

  return res.status(200).json({
    message: "Seat successfully occupied",
    seat,
    notification,
  });
};

/* -------------------------------------------------- */
/* RELEASE SEAT (TOKEN) */
/* -------------------------------------------------- */
export const releaseSeat = (req: Request, res: Response) => {
  const seatId = Number(req.params.id);
  const userId = req.user!.userId;

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (!seat.isOccupied) {
    return res.status(409).json({ message: "Seat is already empty" });
  }

  if (seat.occupiedByUserId !== userId) {
    return res
      .status(403)
      .json({ message: "You cannot release a seat you don't own" });
  }

  const session = sessions.find(
    (x) => x.seatId === seatId && x.isActive
  );
  if (session) {
    session.isActive = false;
  }

  seat.isOccupied = false;
  seat.occupiedByUserId = null;
  seat.status = SeatStatus.EMPTY;
  seat.breakEndsAt = null;

  return res.status(200).json({
    message: "Seat successfully released",
    seat,
  });
};

/* -------------------------------------------------- */
/* BREAK SEAT (TOKEN) */
/* -------------------------------------------------- */
export const breakSeat = (req: Request, res: Response) => {
  const seatId = Number(req.params.id);
  const userId = req.user!.userId;
  const type = req.body?.type as "SHORT" | "MEDIUM" | "LONG";

  if (!type) {
    return res.status(400).json({ message: "Break type is required" });
  }

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (!seat.isOccupied || seat.occupiedByUserId !== userId) {
    return res
      .status(403)
      .json({ message: "You cannot take a break on this seat" });
  }

  if (seat.status !== SeatStatus.OCCUPIED) {
    return res
      .status(409)
      .json({ message: "Seat is not in OCCUPIED state" });
  }

  const session = sessions.find(
    (x) => x.seatId === seatId && x.userId === userId && x.isActive
  );
  if (!session) {
    return res.status(404).json({ message: "Active session not found" });
  }

  if (session.breaksRemaining <= 0) {
    return res.status(409).json({ message: "No breaks remaining" });
  }

  let durationMs = 0;
  if (type === "SHORT") durationMs = 15 * 1000;
  if (type === "MEDIUM") durationMs = 30 * 60 * 1000;
  if (type === "LONG") durationMs = 60 * 60 * 1000;

  seat.status = SeatStatus.BREAK;
  seat.breakEndsAt = Date.now() + durationMs;
  session.breaksRemaining -= 1;

  return res.status(200).json({
    message: "Break started",
    seat,
    breaksRemaining: session.breaksRemaining,
  });
};

/* -------------------------------------------------- */
/* RETURN FROM BREAK (TOKEN) */
/* -------------------------------------------------- */
export const returnFromBreak = (req: Request, res: Response) => {
  const seatId = Number(req.params.id);
  const userId = req.user!.userId;

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status !== SeatStatus.BREAK && seat.status !== SeatStatus.DELAYED) {
    const ended = [...sessions]
      .reverse()
      .find(
        (s) =>
          s.userId === userId &&
          s.seatId === seatId &&
          !s.isActive &&
          s.lastEndReason === "BREAK_TIME_EXPIRED" &&
          !s.notified
      );

    if (ended) {
      ended.notified = true;
      return res.status(409).json({
        message: "Return denied",
        notification: {
          type: "INFO",
          message:
            "Mola süreniz dolduğu için koltuğunuz yönetici tarafından boşaltıldı.",
        },
      });
    }

    return res.status(409).json({ message: "Seat is not in break state" });
  }

  if (seat.occupiedByUserId !== userId) {
    return res.status(403).json({ message: "You cannot return to this seat" });
  }

  const session = sessions.find(
    (x) => x.seatId === seatId && x.userId === userId && x.isActive
  );

  if (!session) {
    const ended = [...sessions]
      .reverse()
      .find(
        (s) =>
          s.userId === userId &&
          s.seatId === seatId &&
          !s.isActive &&
          s.lastEndReason === "BREAK_TIME_EXPIRED" &&
          !s.notified
      );

    if (ended) {
      ended.notified = true;
      return res.status(409).json({
        message: "Return denied",
        notification: {
          type: "INFO",
          message:
            "Mola süreniz dolduğu için koltuğunuz yönetici tarafından boşaltıldı.",
        },
      });
    }

    return res.status(404).json({ message: "Active session not found" });
  }

  seat.status = SeatStatus.OCCUPIED;
  seat.breakEndsAt = null;

  return res.status(200).json({
    message: "Returned from break",
    seat,
    breaksRemaining: session.breaksRemaining,
  });
};

/* -------------------------------------------------- */
/* ADMIN FORCE RELEASE */
/* -------------------------------------------------- */
export const adminForceRelease = (req: Request, res: Response) => {
  const seatId = Number(req.params.id);

  const seat = seats.find((s) => s.id === seatId);
  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }

  if (seat.status === SeatStatus.EMPTY) {
    return res.status(409).json({ message: "Seat is already empty" });
  }

  const session = sessions.find(
    (x) => x.seatId === seatId && x.isActive
  );

  if (session) {
    session.isActive = false;
    session.lastEndReason = "BREAK_TIME_EXPIRED";
    session.notified = false;
  }

  seat.isOccupied = false;
  seat.occupiedByUserId = null;
  seat.status = SeatStatus.EMPTY;
  seat.breakEndsAt = null;

  return res.status(200).json({
    message: "Seat force released by admin",
    seat,
  });
};
