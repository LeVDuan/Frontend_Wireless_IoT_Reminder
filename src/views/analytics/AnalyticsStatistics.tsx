// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CustomAvatar from 'src/@core/components/mui/avatar'

import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { ReactNode } from 'react'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Import
import OptionsMenu from 'src/@core/components/option-menu'
import { AnalyticsType } from 'src/@core/utils/types'

interface AnalyticsTransactionsProps {
  data: AnalyticsType
}

interface DataType {
  title: string
  avatarIcon: ReactNode
  amount: number
  avatarColor: ThemeColor
}

const AnalyticsStatistics = ({ data }: AnalyticsTransactionsProps) => {
  const dataType: DataType[] = [
    {
      amount: data.VBR,
      title: 'Vibrate',
      avatarColor: 'primary',
      avatarIcon: <Icon icon='lucide:vibrate' />
    },
    {
      amount: data.LGT,
      title: 'Light Up',
      avatarColor: 'secondary',
      avatarIcon: <Icon icon='heroicons-outline:light-bulb' />
    },
    {
      amount: data.VLG,
      title: 'Vibrate & Light Up',
      avatarColor: 'info',
      avatarIcon: <Icon icon='radix-icons:mix' />
    },
    {
      amount: data.deviceActiveCount,
      title: 'Active device',
      avatarColor: 'success',
      avatarIcon: <Icon icon='bi:device-ssd' />
    },
    {
      amount: data.deviceCount,
      title: 'All Device',
      avatarColor: 'primary',
      avatarIcon: <Icon icon='bi:device-ssd' />
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Statistics'
        action={<OptionsMenu iconButtonProps={{ size: 'small' }} options={['Share', 'Refresh', 'Edit']} />}
      />
      <CardContent>
        {dataType.map((item: DataType, index: number) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== dataType.length - 1 ? 6 : undefined
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
                  <Typography sx={{ mb: 0.5, fontWeight: 500 }}>{item.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 3, fontWeight: 500 }}>{item.amount}</Typography>
                </Box>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AnalyticsStatistics
