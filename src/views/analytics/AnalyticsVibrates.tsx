// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { AnalyticsType } from 'src/@core/utils/types'

interface AnalyticsVibratesProps {
  data: AnalyticsType
}
const AnalyticsVibrates = ({ data }: AnalyticsVibratesProps) => {
  return (
    <CardStatisticsVertical
      stats={`${data.VBR}`}
      trend='negative'
      title='Total vibration'
      trendNumber={14.82}
      avatarSrc='/images/cards/lucide--vibrate.png'
    />
  )
}

export default AnalyticsVibrates
