export enum BookFormat {
  PDF = 'PDF',
  PHYSICAL = 'PHYSICAL',
}

export enum CommandStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethods {
  WAVE = 'WAVE',
  ORANGE_MONEY = 'ORANGE_MONEY',
  LIVRAISON = 'LIVRAISON',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
}

export enum UserRole {
  ADMIN,
  CLIENT,
}
