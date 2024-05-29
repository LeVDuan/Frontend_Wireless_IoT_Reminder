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

export const timeDifference = (timestamp: string) => {
  const timestampDate = new Date(timestamp)
  const currentTime = new Date()

  const timeDifference = currentTime.valueOf() - timestampDate.valueOf()

  const minutes = Math.floor(timeDifference / (1000 * 60))

  if (minutes < 60) {
    return `${minutes} min ago`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)

    return `${hours} hour ago`
  } else if (minutes < 43200) {
    const days = Math.floor(minutes / 1440)

    return `${days} day ago`
  } else if (minutes < 525600) {
    const months = Math.floor(minutes / 43200)

    return `${months} month ago`
  } else {
    const years = Math.floor(minutes / 525600)

    return `${years} year ago`
  }
}

export const getColorFromBatteryValue = (batteryValue: number) => {
  if (batteryValue >= 80) return 'success'
  if (batteryValue < 80 && batteryValue >= 40) return 'info'
  if (batteryValue < 40 && batteryValue >= 20) return 'warning'
  if (batteryValue < 40) return 'error'
}
