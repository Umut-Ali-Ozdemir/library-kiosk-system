import type { Request, Response } from "express";
import { floors } from "../data/floors";
import { seats } from "../data/seats";
import { SeatStatus } from "../models/seat.model";

/* -------------------------------------------------- */
/* GET ALL FLOORS (with computed occupancy) */
/* -------------------------------------------------- */
export const getAllFloors = (req: Request, res: Response) => {
  const result = floors.map((floor) => {
    const floorSeats = seats.filter((s) => s.floorId === floor.id);
    const totalSeats = floorSeats.length;
    const occupiedSeats = floorSeats.filter(
      (s) => s.status !== SeatStatus.EMPTY
    ).length;
    const occupancy =
      totalSeats === 0 ? 0 : Math.round((occupiedSeats / totalSeats) * 100);

    return {
      id: floor.id,
      name: floor.name,
      totalSeats,
      occupiedSeats,
      occupancy,
    };
  });

  return res.status(200).json(result);
};
