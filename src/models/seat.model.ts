// Koltuğun durumları (renk / anlam eşleşmesi için)
export enum SeatStatus {
  EMPTY = "EMPTY",       // boş (yeşil)
  OCCUPIED = "OCCUPIED", // dolu (kırmızı)
  BREAK = "BREAK",       // molada (mavi)
  DELAYED = "DELAYED",   // gecikmiş (sarı)
}

// Kattaki bölüm (el çizimi taslağa göre, örn. "SOL_KISIM", "GRUP_ODASI").
// Her kat kendi zone isimlerini tanımlar; sabit bir enum değil.
export type SeatZone = string;

// Seçilebilir/işgal edilebilir birim SANDALYE'dir, masa değil.
// tableId aynı masaya ait sandalyeleri gruplamak için kullanılır (sadece
// kroki görselleştirmesi için; iş mantığı hep tekil koltuk üzerinden yürür).
export interface Seat {
  id: number;
  floorId: number;

  zone: SeatZone;
  tableId: number;
  tableOrder: number;       // masanın kendi zone'u içindeki sırası (1, 2, 3, ...)
  seatIndexInTable: number; // sandalyenin masadaki sırası (1..kapasite)

  // Temel doluluk bilgisi
  isOccupied: boolean;

  // Doluysa hangi kullanıcı oturuyor?
  occupiedByUserId: number | null;

  // Koltuğun anlık durumu
  status: SeatStatus;

  // Moladaysa mola bitiş zamanı (timestamp), değilse null
  breakEndsAt: number | null;
}
