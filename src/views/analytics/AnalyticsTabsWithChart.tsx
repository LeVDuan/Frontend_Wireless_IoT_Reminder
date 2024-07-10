// ** React Imports
import { ReactNode, SyntheticEvent, useState } from 'react'

// ** MUI Import
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { AnalyticsType } from 'src/@core/utils/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { getCategoriesLast7days, getSeries } from 'src/utils/index'

interface DataType {
  stats: number
  title: string
  avatarIcon: ReactNode
  avatarColor: ThemeColor
  series: { name: string; data: number[] }[]
}

interface AnalyticsTabsWithChartProps {
  dataAnalytics: AnalyticsType
}

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  minHeight: 40,
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .MuiTab-root': {
    minHeight: 40,
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main
    }
  }
}))

// const findMinMax = (logList: LogAnalyticsType[]) => {
//   if (logList.length === 0) {
//     return { min: 0, max: 0 }
//   }

//   let min = logList[0].count
//   let max = logList[0].count

//   for (const num of logList) {
//     if (num.count < min) {
//       min = num.count
//     }
//     if (num.count > max) {
//       max = num.count
//     }
//   }

//   return { min, max }
// }

const AnalyticsTabsWithChart = ({ dataAnalytics }: AnalyticsTabsWithChartProps) => {
  // ** State
  const [value, setValue] = useState<string>('Vibrate')

  const dateLastWeek = getCategoriesLast7days()

  const VBRSeries = [{ name: 'Vibrate', data: getSeries(dateLastWeek, dataAnalytics.VBRLastWeek) }]

  const LGTseries = [{ name: 'Light', data: getSeries(dateLastWeek, dataAnalytics.LGTLastWeek) }]

  const VLGseries = [{ name: 'Vibrate & light', data: getSeries(dateLastWeek, dataAnalytics.VLGLastWeek) }]

  // const VBRMinMax = findMinMax(dataAnalytics.VBRLastWeek)
  // const LGTMinMax = findMinMax(dataAnalytics.LGTLastWeek)
  // const VLGMinMax = findMinMax(dataAnalytics.VLGLastWeek)

  // let minCtrl = Math.min(VBRMinMax.min, LGTMinMax.min, VLGMinMax.min)
  // const maxCtrl = Math.max(VBRMinMax.max, LGTMinMax.max, VLGMinMax.max)
  // let tickAmountChart
  // if (minCtrl == 0) {
  //   tickAmountChart = 4
  // } else {
  //   tickAmountChart = (maxCtrl - minCtrl) / minCtrl
  //   minCtrl -= tickAmountChart
  //   if (minCtrl <= 0) minCtrl = 0
  //   if (tickAmountChart < 1 && tickAmountChart > 0) tickAmountChart = 1
  // }

  // ** Hook
  const theme = useTheme()

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const data: { [key: string]: DataType } = {
    Vibrate: {
      title: 'Vibrate',
      stats: dataAnalytics.VBR,
      avatarColor: 'primary',
      avatarIcon: <Icon icon='lucide:vibrate' />,
      series: VBRSeries
    },
    'Light Up': {
      stats: dataAnalytics.LGT,
      title: 'Light Up',
      avatarColor: 'success',
      avatarIcon: <Icon icon='heroicons-outline:light-bulb' />,
      series: LGTseries
    },
    'Vibrate & light up': {
      title: 'Vibrate & light up',
      stats: dataAnalytics.VLG,
      avatarColor: 'info',
      avatarIcon: <Icon icon='radix-icons:mix' />,
      series: VLGseries
    }
  }

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 3,
      curve: 'smooth'
    },
    grid: {
      strokeDashArray: 4.5,
      borderColor: theme.palette.divider,
      padding: {
        left: 40,
        top: 0,
        right: 32,
        bottom: 0
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityTo: 0.25,
        opacityFrom: 0.5,
        stops: [0, 95, 100],
        shadeIntensity: 0.6,
        colorStops: [
          [
            {
              offset: 0,
              opacity: 0.4,
              color: theme.palette.primary.main
            },
            {
              offset: 100,
              opacity: 0.2,
              color: theme.palette.background.paper
            }
          ]
        ]
      }
    },
    theme: {
      monochrome: {
        enabled: true,
        shadeTo: 'light',
        shadeIntensity: 1,
        color: theme.palette.primary.main
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: dateLastWeek,
      crosshairs: {
        stroke: { color: `rgba(${theme.palette.customColors.main}, 0.2)` }
      },
      labels: {
        style: {
          fontSize: '14px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      min: 0,
      max: 12.5,
      show: false,
      tickAmount: 2.5
    },
    markers: {
      size: 8,
      strokeWidth: 6,
      strokeOpacity: 1,
      hover: { size: 8 },
      colors: ['transparent'],
      strokeColors: 'transparent',
      discrete: [
        {
          size: 7,
          seriesIndex: 0,
          fillColor: theme.palette.common.white,
          strokeColor: theme.palette.primary.main,
          dataPointIndex: 6
        }
      ]
    }
  }

  return (
    <Card>
      <TabContext value={value}>
        <CardContent sx={{ p: `${theme.spacing(5)} !important`, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <TabList variant='scrollable' scrollButtons='auto' onChange={handleChange} aria-label='tab widget card'>
            <Tab value='Vibrate' label='Vibrate' />
            <Tab value='Light Up' label='Light Up' />
            <Tab value='Vibrate & light up' label='Vibrate & light up' />
          </TabList>
        </CardContent>
        <TabPanel value={value} sx={{ border: 0, boxShadow: 0, p: '0 !important', backgroundColor: 'transparent' }}>
          <Box sx={{ p: 5, display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              variant='rounded'
              color={data[value].avatarColor}
              sx={{ mr: 3.5, width: 50, height: 50 }}
            >
              {data[value].avatarIcon}
            </CustomAvatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ color: 'text.secondary' }}>{`Total ${data[value].title}`}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
                <Typography variant='h6' sx={{ mr: 0.5 }}>
                  {data[value].stats} controls
                </Typography>
              </Box>
            </Box>
          </Box>
          <ReactApexcharts type='area' height={260} options={options} series={data[value].series} />
          <Box sx={{ p: 5, pt: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              {data[value].avatarIcon}
              <Typography ml={2} sx={{ color: 'text.primary' }}>{`${data[value].title} this week`}</Typography>
            </Box>
          </Box>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default AnalyticsTabsWithChart
