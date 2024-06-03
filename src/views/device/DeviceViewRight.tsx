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
import { DetailsControl, DetailsEdit, DeviceType, LogType } from 'src/@core/utils/types'
import { ApexOptions } from 'apexcharts'
import { ReactNode, useEffect, useState } from 'react'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { Avatar } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import { getColorFromBatteryValue, timeDifference } from 'src/utils'
import axios from 'axios'
import Link from 'next/link'

interface DeviceViewLeftProps {
  deviceData: DeviceType
}

interface DataType {
  title: string
  avatarIcon: ReactNode
  amount: number
  avatarColor: ThemeColor
}

interface ColorAction {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const colorAction: ColorAction = {
  edit: { title: 'Rename', color: 'warning' },
  add: { title: 'Add', color: 'secondary' },
  VBR: { title: 'Vibrate', color: 'primary' },
  LGT: { title: 'Light up', color: 'success' },
  VLG: { title: 'Vibrate & light up', color: 'info' }
}

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

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  mb: 2
}))

const DeviceViewRight = ({ deviceData }: DeviceViewLeftProps) => {
  const theme = useTheme()
  const [recentHistory, setRecentHistory] = useState<LogType[]>([])
  const totalControl = deviceData.VBRCount + deviceData.LGTCount + deviceData.VLGCount
  let VBRRatio = 0,
    LGTRatio = 0,
    VLGRatio = 0
  if (totalControl != 0) {
    VBRRatio = (deviceData.VBRCount * 100) / totalControl
    LGTRatio = (deviceData.LGTCount * 100) / totalControl
    VLGRatio = (deviceData.VLGCount * 100) / totalControl
  }
  const data: DataType[] = [
    {
      amount: deviceData.VBRCount,
      title: 'Vibrate',
      avatarColor: 'primary',
      avatarIcon: <Icon icon='lucide:vibrate' />
    },
    {
      amount: deviceData.LGTCount,
      title: 'Light Up',
      avatarColor: 'success',
      avatarIcon: <Icon icon='heroicons-outline:light-bulb' />
    },
    {
      amount: deviceData.VLGCount,
      title: 'Vibrate & Light Up',
      avatarColor: 'info',
      avatarIcon: <Icon icon='radix-icons:mix' />
    }
  ]
  const optionsDonut: ApexOptions = {
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
    labels: ['Vibrate', 'Light Up', 'Vibrate & Light Up'],
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.info.main],
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
              label: 'Total',
              fontSize: '14px',
              formatter: () => '100%',
              color: theme.palette.text.disabled,
              fontFamily: theme.typography.fontFamily
            }
          }
        }
      }
    }
  }
  const optionsRadial: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    labels: [''],
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

  useEffect(() => {
    axios
      .get('http://localhost:5000/logs/recentActivity', { params: { deviceId: deviceData.deviceId } })
      .then(res => {
        setRecentHistory(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [deviceData.deviceId])

  // console.log('Logs: ', recentHistory)

  if (deviceData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Card>
            <CardHeader
              sx={{ pb: 2.5 }}
              title='Control statistics'
              subheaderTypographyProps={{ sx: { color: 'text.disabled' } }}
              action={<OptionsMenu iconButtonProps={{ size: 'small' }} options={['Share', 'Refresh']} />}
            />
            <CardContent>
              <Box sx={{ mb: 7.5, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Box sx={{ mt: 7, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='h4' sx={{ mb: 0.5 }}>
                    {totalControl}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Total Controls</Typography>
                </Box>
                <ReactApexcharts
                  type='donut'
                  width={110}
                  height={125}
                  options={optionsDonut}
                  series={[VBRRatio, LGTRatio, VLGRatio]}
                />
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
              <ReactApexcharts
                type='radialBar'
                height={260}
                options={optionsRadial}
                series={[deviceData.batteryStatus]}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-around' }}>
                <Box
                  sx={{
                    mr: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    '& svg': { mr: 1.5, color: `${getColorFromBatteryValue(deviceData.batteryStatus)}.main` }
                  }}
                >
                  <Icon icon='bxs:circle' fontSize={14} />
                  <Typography sx={{ color: 'text.secondary' }}>The remaining battery percentage</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Recent activity history'
              action={<OptionsMenu iconButtonProps={{ size: 'small' }} options={['Share', 'Refresh']} />}
            />
            <CardContent sx={{ pb: theme => `${theme.spacing(3.75)} !important` }}>
              <Timeline sx={{ my: 0, py: 0 }}>
                {recentHistory.map(log => {
                  if (log.action == 'edit') {
                    const logAction = colorAction[log.action]
                    const editDetails = log.details as DetailsEdit

                    return (
                      <TimelineItem key={log._id} sx={{ minHeight: 0 }}>
                        <TimelineSeparator>
                          <TimelineDot color={logAction.color} />
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
                            <Typography sx={{ mr: 2, fontWeight: 500 }}>
                              {log.userName} {logAction.title} this device
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                              {timeDifference(log.timestamp)}
                            </Typography>
                          </Box>
                          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                            <span>{editDetails.oldName}</span> <Icon icon='bx:right-arrow-alt' fontSize={20} />{' '}
                            <span>{editDetails.newName}</span>
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src='/images/avatars/DuanLV.jpg' sx={{ mr: 2.25, width: 38, height: 38 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography sx={{ fontWeight: 500 }}>{log.userName}</Typography>
                              <Typography sx={{ color: 'text.secondary' }}>Admin</Typography>
                            </Box>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    )
                  } else if (log.action == 'add') {
                    const logAction = colorAction[log.action]

                    return (
                      <TimelineItem key={log._id} sx={{ minHeight: 0 }}>
                        <TimelineSeparator>
                          <TimelineDot color={logAction.color} />
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
                            <Typography sx={{ mr: 2, fontWeight: 500 }}>
                              {log.userName} {logAction.title}
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                              {timeDifference(log.timestamp)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src='/images/avatars/DuanLV.jpg' sx={{ mr: 2.25, width: 38, height: 38 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography sx={{ fontWeight: 500 }}>{log.userName}</Typography>
                              <Typography sx={{ color: 'text.secondary' }}>Admin</Typography>
                            </Box>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    )
                  } else if (log.action == 'control') {
                    const details = log.details as DetailsControl
                    const logAction = colorAction[details.type]

                    return (
                      <TimelineItem key={log._id} sx={{ minHeight: 0 }}>
                        <TimelineSeparator>
                          <TimelineDot color={logAction.color} />
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
                            <Typography sx={{ mr: 2, fontWeight: 500 }}>
                              {log.userName} {logAction.title} this device
                            </Typography>
                            <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                              {timeDifference(log.timestamp)}
                            </Typography>
                          </Box>
                          <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                            {logAction.title} in {details.controlTime} seconds.
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src='/images/avatars/DuanLV.jpg' sx={{ mr: 2.25, width: 38, height: 38 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography sx={{ fontWeight: 500 }}>{log.userName}</Typography>
                              <Typography sx={{ color: 'text.secondary' }}>Admin</Typography>
                            </Box>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    )
                  }
                })}
                <TimelineItem sx={{ minHeight: 0 }}>
                  <TimelineSeparator>
                    <TimelineDot color='success' />
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
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>Most recent activities.</Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        ...
                      </Typography>
                    </Box>
                    <LinkStyled href='/activity-history/'>Read more</LinkStyled>
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
