import toast from 'react-hot-toast'
import { LogAnalyticsType } from 'src/@core/utils/types'
import { updateStatusDevices } from 'src/store/device'

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
export const getCategoriesLast7days = () => {
  const today = new Date()
  const dateLastWeek: string[] = []

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today)
    day.setDate(today.getDate() - i)
    const formattedDate = day.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    dateLastWeek.push(formattedDate)
  }

  return dateLastWeek
}

export const getSeries = (catagories: string[], value: LogAnalyticsType[]) => {
  if (value.length === 0) {
    return Array(catagories.length).fill(0)
  } else {
    const resultArray = catagories.map(date => {
      const matchingItem = value.find(item => {
        const { year, month, day } = item._id
        const formattedDate = new Date(year, month - 1, day)

        return date === formattedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })

      return matchingItem ? matchingItem.count : 0
    })

    return resultArray
  }
}

export const delay = async (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const parseToJSON = (res: string): any[] => {
  const parts = res.replace(/-\r\n/g, '').substring(4).split('-')
  const result = []

  for (const part of parts) {
    const [deviceId, batteryStatus] = part.split(':')
    result.push({
      deviceId: parseInt(deviceId),
      batteryStatus: parseInt(batteryStatus)
    })
  }

  return result
}

export const sendUpdateInfo = async (response: string | null, dispatch: any, firstTime?: boolean) => {
  if (response?.startsWith('REQ:') && response?.endsWith('\r')) {
    if (response.startsWith('REQ:Failed')) {
      toast.error('Update failed!')
    } else if (response.startsWith('REQ:-1')) {
      toast.error('Has no device active!')
    } else {
      const update = parseToJSON(response)
      console.log({ update })
      try {
        dispatch(updateStatusDevices({ update }))
        if (!firstTime) {
          toast.success('Update successfully!')
        }
      } catch (error) {
        toast.error('Update failed!')
      }
    }
  } else {
    toast.error('Error receiving data from transmitter, please try again!')
  }
}
