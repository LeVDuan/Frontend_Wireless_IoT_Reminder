// ** React Imports

// ** MUI Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'

// ** Icons Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Hook Import

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { AnalyticsType } from 'src/@core/utils/types'
import { getCategoriesLast7days } from 'src/utils/format'

interface AnalyticsTotalRevenueProps {
  data: AnalyticsType
}

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const AnalyticsTotalControlLastWeek = ({ data }: AnalyticsTotalRevenueProps) => {
  // ** State
  const operatingRatio = Math.round((data.deviceActiveCount / data.deviceCount) * 100)
  const dateLastWeek = getCategoriesLast7days()

  const value = data ? data.controlLastWeek.map((item: any) => item.count) : []
  const series = [{ name: 'Last week', data: value }]

  console.log('data: ', data)

  const sum = value.reduce((sum, index) => sum + index, 0)

  // console.log('sum: ', sum)

  // ** Hooks & Var
  const theme = useTheme()

  const barOptions: ApexOptions = {
    chart: {
      stacked: true,
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 6,
      lineCap: 'round',
      colors: [theme.palette.background.paper]
    },
    colors: [hexToRGBA(theme.palette.primary.main, 1), hexToRGBA(theme.palette.info.main, 1)],
    legend: {
      offsetX: -10,
      position: 'top',
      fontSize: '14px',
      horizontalAlign: 'left',
      fontFamily: theme.typography.fontFamily,
      labels: {
        colors: theme.palette.text.secondary
      },
      itemMargin: {
        vertical: 4,
        horizontal: 10
      },
      markers: {
        width: 8,
        height: 8,
        radius: 10,
        offsetX: -4
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
    grid: {
      borderColor: theme.palette.divider,
      padding: {
        bottom: 5
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '30%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    xaxis: {
      axisTicks: { show: false },
      crosshairs: { opacity: 0 },
      axisBorder: { show: false },
      categories: dateLastWeek,
      labels: {
        style: {
          fontSize: '14px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '14px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.xl,
        options: {
          plotOptions: {
            bar: { columnWidth: '43%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          plotOptions: {
            bar: { columnWidth: '30%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          plotOptions: {
            bar: { columnWidth: '42%' }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      }
    ]
  }

  const radialBarOptions: ApexOptions = {
    chart: {
      sparkline: { enabled: true }
    },
    labels: ['Active'],
    stroke: { dashArray: 5 },
    colors: [hexToRGBA(theme.palette.primary.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.6,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme.palette.primary.main]
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 150,
        startAngle: -140,
        hollow: { size: '55%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: 25,
            fontWeight: 600,
            fontSize: '16px',
            color: theme.palette.text.secondary,
            fontFamily: theme.typography.fontFamily
          },
          value: {
            offsetY: -15,
            fontWeight: 500,
            fontSize: '24px',
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 900,
        options: {
          chart: { height: 200 }
        }
      },
      {
        breakpoint: 735,
        options: {
          chart: { height: 200 }
        }
      },
      {
        breakpoint: 660,
        options: {
          chart: { height: 200 }
        }
      },
      {
        breakpoint: 600,
        options: {
          chart: { height: 280 }
        }
      }
    ]
  }

  return (
    <Card>
      <Grid container>
        <StyledGrid
          item
          sm={7}
          xl={8}
          xs={12}
          sx={{ '& .apexcharts-series[rel="2"]': { transform: 'translateY(-10px)' } }}
        >
          <CardContent sx={{ p: `${theme.spacing(5, 6, 0)} !important` }}>
            <Typography variant='h6'>Controls in the last 7 days</Typography>
          </CardContent>
          <ReactApexcharts type='bar' height={340} options={barOptions} series={series} />
        </StyledGrid>
        <Grid item xs={12} sm={5} xl={4}>
          <CardContent sx={{ p: `${theme.spacing(8, 6, 7.5)} !important` }}>
            <Box sx={{ textAlign: 'center' }}>
              <Button size='medium' variant='outlined' aria-haspopup='true' sx={{ '& svg': { ml: 0.5 } }}>
                {new Date().getFullYear()}
              </Button>

              <ReactApexcharts type='radialBar' height={200} series={[operatingRatio]} options={radialBarOptions} />
              <Typography sx={{ mb: 7.5, fontWeight: 600, color: 'text.secondary' }}>
                {data.deviceActiveCount}/{data.deviceCount} devices active now
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ mr: 4, display: 'flex', alignItems: 'center' }}>
                <CustomAvatar skin='light' variant='rounded' sx={{ mr: 2.5, width: 38, height: 38 }}>
                  <Icon icon='ri:remote-control-line' />
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='body2'>Last week</Typography>
                  <Typography sx={{ fontWeight: 500 }}>{sum} controls</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}

export default AnalyticsTotalControlLastWeek
