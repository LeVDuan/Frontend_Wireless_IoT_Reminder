// ** React Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import { DeviceType } from 'src/@core/utils/types'

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

interface DeviceViewLeftProps {
  deviceData: DeviceType
}

const statusObj: StatusObj = {
  false: { title: 'Inactive', color: 'error' },
  true: { title: 'Active', color: 'success' }
}

const renderAvatar = (name: string) => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      color={color as ThemeColor}
      variant='rounded'
      sx={{ width: 110, height: 110, fontWeight: 600, mb: 6, fontSize: '3rem' }}
    >
      {getInitials(name ? name : 'Device default')}
    </CustomAvatar>
  )
}

const DeviceViewLeft = ({ deviceData }: DeviceViewLeftProps) => {
  // const isActive = deviceData.isActive.toString()
  const status = statusObj['true']
  if (deviceData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 12, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {renderAvatar(deviceData.name)}

              <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.375rem !important' }}>
                {deviceData.name}
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={status.title}
                sx={{ fontWeight: 500 }}
                color={status.color}
              />
            </CardContent>

            <CardContent sx={{ mt: 6, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4 }}>
                    <Icon icon='bx:check' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                      1.23k
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Task Done</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4 }}>
                    <Icon icon='bx:customize' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                      568
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Project Done</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <Divider sx={{ mt: theme => `${theme.spacing(1)} !important` }} />
              <Box sx={{ pt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Username:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>@{deviceData.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Billing Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{deviceData._id}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={status.title}
                    sx={{ fontWeight: 500 }}
                    color={status.color}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Role:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {deviceData.batteryStatus}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Tax ID:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>Tax-8894</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Contact:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+1 {deviceData.lastUpdated}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Language:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>English</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Country:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{deviceData.deviceId}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceViewLeft
