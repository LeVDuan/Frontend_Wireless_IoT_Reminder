// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Grid, IconButton } from '@mui/material'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { DeviceType } from 'src/@core/utils/types'
import Button from '@mui/material/Button'
import { CardActions } from '@mui/material'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'
import { formatTimestamp, sendUpdateInfo } from 'src/utils'
import axios from 'axios'
import { API_DEVICES_URL } from 'src/store/device'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import RenameDrawer from 'src/views/components/drawers/RenameDrawerInViewDevice'
import { getInitials } from 'src/@core/utils/get-initials'

// import DialogRenameDevice from '../components/dialogs/DialogRenameDevice'

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

const renderDeviceAvatar = (device: DeviceType) => {
  if (device.deviceId === 14 || device.deviceId === 0 || device.deviceId === 1 || device.deviceId === 15) {
    return (
      <CustomAvatar
        skin='light'
        variant='rounded'
        src={`/images/avatars/${device.deviceId}.jpg`}
        sx={{ width: 110, height: 110, fontWeight: 600, mb: 6, fontSize: '3rem' }}
      />
    )
  } else {
    return (
      <CustomAvatar
        skin='light'
        variant='rounded'
        color='info'
        sx={{ width: 110, height: 110, fontWeight: 600, mb: 6, fontSize: '3rem' }}
      >
        {getInitials(device.name)}
      </CustomAvatar>
    )
  }
}

const DeviceViewLeft = ({ deviceData }: DeviceViewLeftProps) => {
  // console.log('deviceData', deviceData)

  const status = statusObj[deviceData.isActive?.toString()]
  const { port, selectPort, writeToPort } = usePort()
  const [firstTime, setFirstTime] = useState<boolean>(true)
  const [response, setResponse] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  const [renameDrawerOpen, setRenameDrawerOpen] = useState<boolean>(false)
  const toggleRenameDrawer = () => {
    setRenameDrawerOpen(!renameDrawerOpen)
  }
  useEffect(() => {
    // console.log('port: ', port)
    const updateFromTransmitter = async () => {
      const brdCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Broadcast'
        })
      ).data.command

      // console.log(brdCmd)

      await writeToPort(brdCmd, setResponse)

      const reqCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Request',
          deviceId: deviceData.deviceId
        })
      ).data.command
      await writeToPort(reqCmd, setResponse)

      // console.log(reqCmd)
    }
    if (port !== undefined && !firstTime) {
      updateFromTransmitter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [port])
  useEffect(() => {
    if (response && response.includes('REQ:')) {
      sendUpdateInfo(response, dispatch, false, deviceData._id)
    }
    setResponse(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response, dispatch])

  const handleUpdateStatus = async () => {
    if (port === undefined) {
      const error = await selectPort()
      setFirstTime(false)
      if (error) {
        toast.error(`${error}`)
      } else {
        toast.success('Connected successfully!')
      }
    } else {
      const brdCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Broadcast'
        })
      ).data.command
      await writeToPort(brdCmd, setResponse)

      const reqCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Request',
          deviceId: deviceData.deviceId
        })
      ).data.command
      await writeToPort(reqCmd, setResponse)
    }
  }

  if (deviceData) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 12, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {renderDeviceAvatar(deviceData)}
              <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.375rem !important' }}>
                {deviceData.name}
                <IconButton sx={{ ml: '2px' }} size='small' onClick={() => toggleRenameDrawer()}>
                  <Icon icon='bx:pencil' fontSize={20} />
                </IconButton>
              </Typography>
              <CustomChip
                rounded
                skin='light'
                size='small'
                label={status?.title}
                sx={{ fontWeight: 500 }}
                color={status?.color}
              />
            </CardContent>
            <CardContent sx={{ mt: 6, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ mr: 8, display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4 }}>
                    <Icon icon='lucide:vibrate' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                      {deviceData.VBRCount + deviceData.VLGCount}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Vibrations</Typography>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomAvatar skin='light' variant='rounded' sx={{ mr: 4 }}>
                    <Icon icon='heroicons-outline:light-bulb' />
                  </CustomAvatar>
                  <div>
                    <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                      {deviceData.LGTCount + deviceData.VLGCount}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }}>Light up</Typography>
                  </div>
                </Box>
              </Box>
            </CardContent>

            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <Divider sx={{ mt: theme => `${theme.spacing(1)} !important` }} />
              <Box sx={{ pt: 4, pb: 2 }}>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Device Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>@{deviceData.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Physical ID:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>#{deviceData.deviceId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={status?.title}
                    sx={{ fontWeight: 500 }}
                    color={status?.color}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Battery:</Typography>
                  <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {deviceData.batteryStatus}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 4 }}>
                  <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Last updated:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{formatTimestamp(deviceData.lastUpdated)}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleUpdateStatus}>
                Update status
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <RenameDrawer open={renameDrawerOpen} toggle={toggleRenameDrawer} />
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceViewLeft
