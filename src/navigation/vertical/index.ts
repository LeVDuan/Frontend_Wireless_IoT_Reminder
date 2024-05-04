// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboards',
      path: '/dashboards',
      icon: 'bx:home-circle'
    },
    {
      title: 'Device Control',
      path: '/device-control',
      icon: 'ri:remote-control-line'
    },
    {
      title: 'Device List',
      path: '/device-list',
      icon: 'bi:device-ssd'
    },
    {
      title: 'Activity History',
      path: '/activity-history',
      icon: 'bx:history'
    }
  ]
}

export default navigation
