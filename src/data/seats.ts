import { Seat, SeatStatus } from "../models/seat.model";

export const seats: Seat[] = [
  {
    id: 1,
    row: 1,
    number: 1,
    isOccupied: false,
    occupiedByUserId: null,
    status: SeatStatus.EMPTY,
    breakEndsAt: null,
  },
  {
    id: 2,
    row: 1,
    number: 2,
    isOccupied: false,
    occupiedByUserId: null,
    status: SeatStatus.EMPTY,
    breakEndsAt: null,
  },
  {
    id: 3,
    row: 1,
    number: 3,
    isOccupied: true,
    occupiedByUserId: 101,
    status: SeatStatus.OCCUPIED,
    breakEndsAt: null,
  },
  {
    id: 4,
    row: 2,
    number: 1,
    isOccupied: false,
    occupiedByUserId: null,
    status: SeatStatus.EMPTY,
    breakEndsAt: null,
  },
  {
    id: 5,
    row: 2,
    number: 2,
    isOccupied: true,
    occupiedByUserId: 102,
    status: SeatStatus.OCCUPIED,
    breakEndsAt: null,
  },
];
