export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp)
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  const formattedDate = formatter.format(date)

  return formattedDate
}

export const getColorFromBatteryValue = (batteryValue: number) => {
  if (batteryValue >= 80) return 'success'
  if (batteryValue < 80 && batteryValue >= 40) return 'info'
  if (batteryValue < 40 && batteryValue >= 20) return 'warning'
  if (batteryValue < 40) return 'error'
}
