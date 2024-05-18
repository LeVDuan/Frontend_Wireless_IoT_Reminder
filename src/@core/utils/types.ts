interface MonthYear {
  year: number
  month: number
}

interface Fns {
  cardType(cardNumber: string): string
  formatCardNumber(cardNumber: string): string
  validateCardNumber(cardNumber: string): boolean
  validateCardCVC(cvc: string, type?: string): boolean
  validateCardExpiry(monthYear: string, year?: string): boolean
  cardExpiryVal(monthYear: string | HTMLInputElement): MonthYear
}

export type PaymentTypes = {
  fns: Fns
  formatCardCVC(elem: HTMLInputElement): HTMLInputElement
  restrictNumeric(elem: HTMLInputElement): HTMLInputElement
  formatCardNumber(elem: HTMLInputElement): HTMLInputElement
  formatCardExpiry(elem: HTMLInputElement): HTMLInputElement
}

export type DeviceTypes = {
  _id: string
  deviceId: number
  name: string
  lastUpdated: string
  batteryStatus: number
  isActive: boolean
}

export type DeviceStoreType = {
  devices: DeviceTypes[]
  activeDevices: DeviceTypes[]
  totalDevices: number
  totalActiveDevices: number
}
