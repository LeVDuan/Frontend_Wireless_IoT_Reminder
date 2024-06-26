// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { AnalyticsType } from 'src/@core/utils/types'

interface AnalyticsControlsProps {
  data: AnalyticsType
}

const AnalyticsControls = ({ data }: AnalyticsControlsProps) => {
  const sum = data.LGT + data.VBR + data.VLG

  return (
    <CardStatisticsVertical
      title='Total controls'
      stats={`${sum}`}
      avatarSrc='/images/cards/ri--remote-control-line.png'
    />
  )
}

export default AnalyticsControls
