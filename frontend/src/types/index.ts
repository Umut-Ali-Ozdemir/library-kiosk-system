export type UserRole = "STUDENT" | "ADMIN";

export interface AuthUser {
  id: number;
  fullName: string;
  role: UserRole;
  email: string | null;
  studentNo: string | null;
}

export type SeatStatus = "EMPTY" | "OCCUPIED" | "BREAK" | "DELAYED";

export interface Seat {
  id: number;
  floorId: number;
  zone: string;
  tableId: number;
  tableOrder: number;
  seatIndexInTable: number;
  isOccupied: boolean;
  occupiedByUserId: number | null;
  status: SeatStatus;
  breakEndsAt: number | null;
}

export interface FloorSummary {
  id: number;
  name: string;
  totalSeats: number;
  occupiedSeats: number;
  occupancy: number;
}

export type BreakType = "SHORT" | "MEDIUM" | "LONG";

export interface ApiNotification {
  type: "INFO";
  message: string;
}
