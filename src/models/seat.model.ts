// Koltuğun durumları (renk / anlam eşleşmesi için)
export enum SeatStatus {
  EMPTY = "EMPTY",       // boş (yeşil)
  OCCUPIED = "OCCUPIED", // dolu (kırmızı)
  BREAK = "BREAK",       // molada (mavi)
  DELAYED = "DELAYED",   // gecikmiş (sarı)
}

export interface Seat {
  id: number;
  row: number;
  number: number;

  // Temel doluluk bilgisi
  isOccupied: boolean;

  // Doluysa hangi kullanıcı oturuyor?
  occupiedByUserId: number | null;

  // Koltuğun anlık durumu
  status: SeatStatus;

  // Moladaysa mola bitiş zamanı (timestamp), değilse null
  breakEndsAt: number | null;
}
