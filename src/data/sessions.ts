import { Session } from "../models/session.model";
import { seats } from "./seats";
import { SeatStatus } from "../models/seat.model";

/**
 * Seed an active session for every seed seat that already has a real owner
 * (occupiedByUserId set), so seed data stays internally consistent — every
 * "occupied by user X" seat has a matching session, exactly like occupySeat()
 * creates one at runtime. Demo-occupied seats with no real owner (null)
 * intentionally get no session; they exist purely to visualize occupancy.
 */
export const sessions: Session[] = seats
  .filter((s) => s.status === SeatStatus.OCCUPIED && s.occupiedByUserId !== null)
  .map((s, index) => ({
    id: index + 1,
    userId: s.occupiedByUserId as number,
    seatId: s.id,
    startedAt: Date.now(),
    isActive: true,
    breaksRemaining: 3,
  }));
