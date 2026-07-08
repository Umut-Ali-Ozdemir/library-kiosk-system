import { Seat, SeatStatus } from "../models/seat.model";

/**
 * Seed seat data, modeled after the hand-drawn floor sketches.
 *
 * A "table" (masa) is just a visual grouping of chairs (sandalye) sharing a
 * `tableId` — students select/occupy individual CHAIRS, never the table
 * itself, so the Seat record below stays the single source of truth for
 * occupancy. `zone` + `tableOrder` let the frontend lay tables out in the
 * same order as the real floor plan (e.g. left wall, right wall, group room).
 */

let nextSeatId = 1;
let nextTableId = 1;

function buildTable(
  floorId: number,
  zone: string,
  tableOrder: number,
  capacity: number,
  occupiedSeatIndexes: number[] = []
): Seat[] {
  const tableId = nextTableId++;
  const seats: Seat[] = [];

  for (let seatIndexInTable = 1; seatIndexInTable <= capacity; seatIndexInTable++) {
    const occupied = occupiedSeatIndexes.includes(seatIndexInTable);
    seats.push({
      id: nextSeatId++,
      floorId,
      zone,
      tableId,
      tableOrder,
      seatIndexInTable,
      isOccupied: occupied,
      occupiedByUserId: null,
      status: occupied ? SeatStatus.OCCUPIED : SeatStatus.EMPTY,
      breakEndsAt: null,
    });
  }

  return seats;
}

function buildZone(
  floorId: number,
  zone: string,
  tableCount: number,
  capacityPerTable: number,
  occupiedByTableOrder: Partial<Record<number, number[]>> = {}
): Seat[] {
  const seats: Seat[] = [];
  for (let tableOrder = 1; tableOrder <= tableCount; tableOrder++) {
    seats.push(
      ...buildTable(
        floorId,
        zone,
        tableOrder,
        capacityPerTable,
        occupiedByTableOrder[tableOrder] ?? []
      )
    );
  }
  return seats;
}

/* -------------------------------------------------------------------- */
/* 1. KAT                                                                */
/* -------------------------------------------------------------------- */
/*
 * SOL_KISIM:  duvar boyunca 12 masa, masa başına 2 sandalye  -> 24 koltuk
 * SAG_KISIM:  SOL_KISIM ile simetrik, 12 masa x 2 sandalye   -> 24 koltuk
 *             (ortası boş, ek masa yok)
 * GRUP_ODASI: sol arkadaki grup çalışma odası, 3x3 = 9 masa,
 *             masa başına 4 sandalye                          -> 36 koltuk
 * Toplam: 84 koltuk / 33 masa
 */
const floor1Seats: Seat[] = [
  ...buildZone(1, "SOL_KISIM", 12, 2, {
    1: [1],
    3: [1, 2],
    5: [1],
    7: [1, 2],
    9: [1],
    11: [1, 2],
  }),
  ...buildZone(1, "SAG_KISIM", 12, 2, {
    2: [1],
    4: [1, 2],
    6: [1],
    8: [1, 2],
    10: [1],
  }),
  ...buildZone(1, "GRUP_ODASI", 9, 4, {
    1: [1, 2],
    4: [1, 2, 3],
    7: [1],
  }),
];

// Demo/test amaçlı: seed öğrenci hesabının (id 101) zaten bir koltukta
// oturuyor olması, occupy/break/release/return akışının login sonrası
// baştan test edilebilmesini sağlıyor.
const demoStudentSeat = floor1Seats.find(
  (s) => s.zone === "SOL_KISIM" && s.tableOrder === 1 && s.seatIndexInTable === 1
);
if (demoStudentSeat) {
  demoStudentSeat.occupiedByUserId = 101;
}

/* -------------------------------------------------------------------- */
/* 2. KAT / 3. KAT                                                       */
/* -------------------------------------------------------------------- */
/*
 * Bu katların el çizimi taslağı henüz paylaşılmadı; gerçek kroki gelene
 * kadar basit, tek bölgeli bir yer tutucu düzen kullanılıyor.
 * TODO: Gerçek taslak paylaşılınca 1. kat gibi zone/masa bazlı güncellenecek.
 */
const floor2Seats: Seat[] = buildZone(2, "GENEL", 9, 2, {
  1: [1, 2],
  2: [1, 2],
  3: [1, 2],
  4: [1, 2],
  5: [1, 2],
  6: [1, 2],
  7: [1, 2],
  8: [1, 2],
  9: [1, 2],
});

const floor3Seats: Seat[] = buildZone(3, "GENEL", 6, 2, {
  1: [1, 2],
  2: [1, 2],
  3: [1],
});

export const seats: Seat[] = [...floor1Seats, ...floor2Seats, ...floor3Seats];
