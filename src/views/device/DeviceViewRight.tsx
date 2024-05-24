// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Icon from 'src/@core/components/icon'

// ** Icon Imports

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { DeviceType } from 'src/@core/utils/types'
import { useTheme } from '@emotion/react'
import { ApexOptions } from 'apexcharts'
import { ReactNode } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Avatar, AvatarGroup, Tooltip } from '@mui/material'
import { styled } from '@mui/material/styles'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'

interface DeviceViewLeftProps {
  deviceData: DeviceType
}

interface DataType {
  title: string
  subtitle: string
  avatarIcon: ReactNode
  amount: string | number
  avatarColor: ThemeColor
}

const data: DataType[] = [
  {
    amount: '82.5k',
    title: 'Electronic',
    avatarColor: 'primary',
    subtitle: 'Mobile, Earbuds, TV',
    avatarIcon: <Icon icon='bx:mobile-alt' />
  },
  {
    amount: '23.8k',
    title: 'Fashion',
    avatarColor: 'success',
    subtitle: 'Tshirt, Jeans, Shoes',
    avatarIcon: <Icon icon='bx:closet' />
  },
  {
    amount: 849,
    title: 'Decor',
    avatarColor: 'info',
    subtitle: 'Fine Art, Dining',
    avatarIcon: <Icon icon='bx:home' />
  }
]

const Timeline = styled(MuiTimeline)<TimelineProps>(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const DeviceViewRight = ({ deviceData }: DeviceViewLeftProps) => {
  // const status = statusObj['true']
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
      animations: { enabled: false }
    },
    stroke: {
      width: 6,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    labels: ['Fashion', 'Electronic', 'Sports', 'Decor'],
    colors: [
      theme.palette.success.main,
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.info.main
    ],
    grid: {
      padding: {
        top: -7,
        bottom: 5
      }
    },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: {
              offsetY: 17,
              fontSize: '14px',
              color: theme.palette.text.disabled,
              fontFamily: theme.typography.fontFamily
            },
            value: {
              offsetY: -17,
              fontSize: '24px',
              color: theme.palette.text.primary,
              fontFamily: theme.typography.fontFamily
            },
            total: {
              show: true,
              label: 'Weekly',
              fontSize: '14px',
              formatter: () => '38%',
              color: theme.palette.text.disabled,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      }
    }
  }
  const options1: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    labels: ['Sales'],
    stroke: { lineCap: 'round' },
    colors: [hexToRGBA(theme.palette.success.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      padding: {
        top: 20,
        bottom: 30
      }
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '73%',
          imageWidth: 72,
          imageHeight: 53,
          imageOffsetY: -40,
          imageClipped: false,
          image: '/images/cards/arrow-star.png'
        },
        track: {
          strokeWidth: '45px',
          background: hexToRGBA(theme.palette.customColors.trackBg, 1)
        },
        dataLabels: {
          name: {
            offsetY: 50,
            color: theme.palette.text.disabled
          },
          value: {
            offsetY: 10,
            fontWeight: 500,
            fontSize: '32px',
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily
          }
        }
      }
    }
  }
  if (deviceData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{ pb: 2.5 }}
              title='Order Statistics'
              subheader='42.82k Total Sales'
              subheaderTypographyProps={{ sx: { color: 'text.disabled' } }}
              action={<OptionsMenu iconButtonProps={{ size: 'small' }} options={['Share', 'Refresh', 'Edit']} />}
            />
            <CardContent>
              <Box sx={{ mb: 7.5, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Box sx={{ mt: 7, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h4' sx={{ mb: 0.5 }}>
                    8,258
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Total Orders</Typography>
                </Box>
                <ReactApexcharts type='donut' width={110} height={125} options={options} series={[45, 80, 20, 40]} />
              </Box>
              {data.map((item: DataType, index: number) => {
                return (
                  <Box
                    key={item.title}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: index !== data.length - 1 ? 5.5 : undefined
                    }}
                  >
                    <CustomAvatar
                      skin='light'
                      variant='rounded'
                      color={item.avatarColor}
                      sx={{ mr: 3, width: 38, height: 38 }}
                    >
                      {item.avatarIcon}
                    </CustomAvatar>
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                        <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                          {item.subtitle}
                        </Typography>
                      </Box>
                      <Typography variant='body2' sx={{ fontWeight: 500 }}>
                        {item.amount}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              title='Battery'
              action={<OptionsMenu iconButtonProps={{ size: 'small' }} options={['refresh']} />}
            />
            <CardContent>
              <ReactApexcharts type='radialBar' height={302} options={options1} series={[deviceData.batteryStatus]} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around' }}>
                <Box
                  sx={{ mr: 2.5, display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'success.main' } }}
                >
                  <Icon icon='bxs:circle' fontSize={14} />
                  <Typography sx={{ color: 'text.secondary' }}>Conversion Ratio</Typography>
                </Box>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 1.5, color: 'customColors.trackBg' } }}
                >
                  <Icon icon='bxs:circle' fontSize={14} />
                  <Typography sx={{ color: 'text.secondary' }}>Total requirements</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Activity Timeline'
              action={
                <OptionsMenu
                  iconButtonProps={{ size: 'small' }}
                  options={['Share timeline', 'Suggest edits', 'Report bug']}
                />
              }
            />
            <CardContent sx={{ alignContent: 'left', pb: theme => `${theme.spacing(3.75)} !important` }}>
              <Timeline sx={{ my: 0, py: 0, textAlign: 'left' }}>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color='primary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(6)} !important` }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>12 Invoices have been paid</Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        12 min ago
                      </Typography>
                    </Box>
                    <Typography sx={{ mb: 2.5, color: 'text.secondary' }}>
                      Invoices have been paid to the company
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <img width={24} height={24} alt='invoice.pdf' src='/images/icons/file-icons/pdf.png' />
                      <Typography sx={{ ml: 3, fontWeight: 500 }}>Invoices.pdf</Typography>
                    </Box>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color='warning' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(6)} !important` }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>Client Meeting</Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        45 min ago
                      </Typography>
                    </Box>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>Project meeting with john @10:15am</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src='/images/avatars/3.png' sx={{ mr: 2.25, width: 38, height: 38 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500 }}>Steven Nash (Client)</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>CEO of ThemeSelection</Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem sx={{ minHeight: 0 }}>
                  <TimelineSeparator>
                    <TimelineDot color='info' />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0 }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>Create a new project for client</Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        2 days ago
                      </Typography>
                    </Box>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>5 team members in a project</Typography>
                    <AvatarGroup className='pull-up'>
                      <Tooltip title='Howard Lloyd'>
                        <Avatar alt='Howard Lloyd' src='/images/avatars/5.png' sx={{ width: 34, height: 34 }} />
                      </Tooltip>
                      <Tooltip title='Katie Lane'>
                        <Avatar alt='Katie Lane' src='/images/avatars/12.png' sx={{ width: 34, height: 34 }} />
                      </Tooltip>
                      <Tooltip title='George Allen'>
                        <Avatar alt='George Allen' src='/images/avatars/9.png' sx={{ width: 34, height: 34 }} />
                      </Tooltip>
                      <Tooltip title='Alice Cobb'>
                        <Avatar alt='Alice Cobb' src='/images/avatars/6.png' sx={{ width: 34, height: 34 }} />
                      </Tooltip>
                      <Tooltip title='Jeffery Warner'>
                        <Avatar alt='Jeffery Warner' src='/images/avatars/14.png' sx={{ width: 34, height: 34 }} />
                      </Tooltip>
                    </AvatarGroup>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceViewRight
