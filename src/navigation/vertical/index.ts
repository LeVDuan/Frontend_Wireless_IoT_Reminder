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
      icon: 'bx:devices'
    },
    {
      title: 'Device List',
      path: '/device-list',
      icon: 'bx:align-justify'
    },
    {
      title: 'Activity History',
      path: '/activity-history',
      icon: 'bx:history'
    }
  ]
}

export default navigation
