export interface Session {
  id: number;
  userId: number;
  seatId: number;

  // Oturum başlangıç zamanı
  startedAt: number;

  // Aktif mi?
  isActive: boolean;

  // Kalan mola hakkı (başlangıç: 3)
  breaksRemaining: number;

  // Oturum neden sona erdi?
  lastEndReason?: "BREAK_TIME_EXPIRED" | "ADMIN_FORCE" | null;

  // Kullanıcıya bildirildi mi? (return denemesinde 1 kere göstermek için)
  notified?: boolean;
}
