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

export type DeviceType = {
  _id: string
  deviceId: number
  name: string
  lastUpdated: string
  batteryStatus: number
  isActive: boolean
  VBRCount: number
  LGTCount: number
  VLGCount: number
}

export type DeviceStoreType = {
  devices: DeviceType[]
  activeDevices: DeviceType[]
  totalDevices: number
  totalActiveDevices: number
  device: DeviceType
}

export type LogStoreType = {
  logs: LogType[]
  total: number
}

export type DetailsEdit = {
  objId: string
  oldName: string
  newName: string
}

export type DetailsAddDelete = {
  objId: string
}

export type DetailsControl = {
  objId: string
  type: string
  controlTime: number
  periodTime: number
  pauseTime: number
}

export type LogType = {
  _id: string
  userName: string
  deviceId: number
  deviceName: string
  action: string
  details: DetailsEdit | DetailsAddDelete | DetailsControl
  result: string
  timestamp: string
}

export type LogAnalyticsType = {
  _id: {
    year: number
    month: number
    day: number
  }
  count: number
}

export type AnalyticsType = {
  VBR: number
  LGT: number
  VLG: number
  deviceCount: number
  deviceActiveCount: number
  controlLastWeek: LogAnalyticsType[]
  VBRLastWeek: LogAnalyticsType[]
  LGTLastWeek: LogAnalyticsType[]
  VLGLastWeek: LogAnalyticsType[]
}

export type DateType = Date | null | undefined
