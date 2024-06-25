// ** React Imports
import { ElementType, useState, ChangeEvent, useEffect } from 'react'

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
import { DeviceType } from 'src/@core/utils/types'
import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { CardActions } from '@mui/material'
import { formatDate } from 'src/@core/utils/format'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'
import { sendUpdateInfo } from 'src/utils'
import axios from 'axios'
import { API_DEVICES_URL } from 'src/store/device'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

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

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const DeviceViewLeft = ({ deviceData }: DeviceViewLeftProps) => {
  // const isActive = deviceData.isActive.toString()
  const status = statusObj[deviceData.isActive?.toString()]
  const [imgSrc, setImgSrc] = useState<string>(`/images/avatars/${deviceData.deviceId}.png`)
  const [inputValue, setInputValue] = useState<string>('')
  const { selectPort, writeToPort } = usePort()

  const [response, setResponse] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (response) {
      sendUpdateInfo(response, dispatch)
    }
  }, [response, dispatch])
  const handleInputImageChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)
      reader.readAsDataURL(files[0])

      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const handleInputImageReset = () => {
    setInputValue('')
    setImgSrc(`/images/avatars/${deviceData.deviceId}.png`)
  }

  const handleUpdateStatus = async () => {
    const error = await selectPort()
    if (error) {
      toast.error(`${error}`)
    } else {
      toast.success('Connected successfully!')

      const brdCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Broadcast'
        })
      ).data.command

      console.log(brdCmd)

      // await writeToPort(brdCmd, setResponse)

      const reqCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Request',
          deviceId: -1
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
              <CustomAvatar
                src={imgSrc}
                skin='light'
                variant='rounded'
                sx={{ width: 110, height: 110, fontWeight: 600, mb: 6, fontSize: '3rem' }}
              />

              <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.375rem !important' }}>
                {deviceData.name}
                {/* <DialogRenameDevice device={deviceData} /> */}
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
            <CardContent sx={{ pt: 12, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              <div>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    value={inputValue}
                    accept='image/png, image/jpeg'
                    onChange={handleInputImageChange}
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputImageReset}>
                  Reset
                </ResetButtonStyled>
              </div>
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
                  <Typography sx={{ color: 'text.secondary' }}>{formatDate(deviceData.lastUpdated)}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' disabled={!deviceData.isActive} sx={{ mr: 2 }} onClick={handleUpdateStatus}>
                Update status
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceViewLeft
