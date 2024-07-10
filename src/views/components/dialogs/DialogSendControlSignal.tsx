// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, Fragment, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Divider from '@mui/material/Divider'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import { DeviceType } from 'src/@core/utils/types'
import axios from 'axios'
import { API_DEVICES_URL, controlDevice } from 'src/store/device'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

interface DialogSendControlSignalProps {
  open: boolean
  toggle: (id: string) => void
  device: DeviceType | null
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogSendControlSignal = ({ open, toggle, device }: DialogSendControlSignalProps) => {
  // ** States
  const [type, setType] = useState<string>('')
  const [controlTime, setControlTime] = useState<number>(0)
  const [periodTime, setPeriodTime] = useState<number>(0)
  const [pauseTime, setPauseTime] = useState<number>(0)
  const { writeToPort } = usePort()
  const { user } = useAuth()
  const [response, setResponse] = useState<string | null>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // console.log(response)

    const updateCountControls = async (result: string) => {
      const log = {
        userName: user!.fullName,
        deviceName: device!.name,
        type,
        deviceId: device!.deviceId,
        controlTime,
        periodTime,
        pauseTime,
        result
      }
      dispatch(controlDevice({ _id: device!._id, controlLogs: log }))
    }
    if (response && response.includes(':-1')) {
      toast.error('Send control signal failed!')
      updateCountControls('error')
    } else if (response && response.includes(':1')) {
      toast.success('Send control signal successfully!')

      updateCountControls('success')
    }

    setControlTime(0)
    setPeriodTime(0)
    setPauseTime(0)
    setType('')
    setResponse(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  const handleSend = async () => {
    if (!type) return

    if (device !== null) {
      // get command from backend
      const res = await axios.post(`${API_DEVICES_URL}/control`, {
        userName: user?.fullName,
        deviceName: device.name,
        objId: device._id,
        type,
        deviceId: device.deviceId,
        controlTime,
        periodTime,
        pauseTime
      })
      const ctrlSignal = res.data.command

      // console.log(ctrlSignal)
      await writeToPort(ctrlSignal, setResponse)
      toggle(device._id)
    }
  }
  const handleTypeValue = (e: SelectChangeEvent) => {
    setType(e.target.value)
  }

  return (
    device && (
      <Fragment>
        <Dialog fullWidth open={open} maxWidth='md' scroll='body' onClose={toggle} TransitionComponent={Transition}>
          <DialogContent
            sx={{
              position: 'relative',
              pb: theme => `${theme.spacing(8)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
            }}
          >
            <IconButton
              size='small'
              onClick={() => {
                toggle(device._id)
                setType('')
              }}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='bx:x' />
            </IconButton>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 3 }}>
                Device control options for {device.name}
              </Typography>
              <Typography variant='body2'>Select the options you want to control on the device.</Typography>
            </Box>
            <Grid container spacing={6} sx={{ mt: 4, textAlign: 'center' }}>
              <Grid item md={3} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CustomAvatar
                    skin='light'
                    color='primary'
                    sx={{ mb: 3, width: [35, 70], height: [35, 70], '& svg': { fontSize: ['2.2rem', '2.5rem'] } }}
                  >
                    <Icon icon='lucide:vibrate' />
                  </CustomAvatar>
                  <Typography sx={{ mb: 3, fontWeight: '600' }}>Control type</Typography>
                  <Typography>The type you want the device to react to</Typography>
                </Box>
              </Grid>
              <Grid item md={3} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CustomAvatar
                    skin='light'
                    color='primary'
                    sx={{ mb: 3, width: [35, 70], height: [35, 70], '& svg': { fontSize: ['2.2rem', '2.5rem'] } }}
                  >
                    <Icon icon='ic:outline-share-arrival-time' />
                  </CustomAvatar>
                  <Typography sx={{ mb: 3, fontWeight: '600' }}>Control time</Typography>
                  <Typography>The time the device responds to vibration/light</Typography>
                </Box>
              </Grid>
              <Grid item md={3} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CustomAvatar
                    skin='light'
                    color='primary'
                    sx={{ mb: 3, width: [35, 70], height: [35, 70], '& svg': { fontSize: ['2.2rem', '2.5rem'] } }}
                  >
                    <Icon icon='material-symbols:avg-time-outline-sharp' />
                  </CustomAvatar>
                  <Typography sx={{ mb: 3, fontWeight: '600' }}>Period time</Typography>
                  <Typography>The amount of time the device vibrates/lights up</Typography>
                </Box>
              </Grid>
              <Grid item md={3} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  <CustomAvatar
                    skin='light'
                    color='primary'
                    sx={{ mb: 3, width: [35, 70], height: [35, 70], '& svg': { fontSize: ['2.2rem', '2.5rem'] } }}
                  >
                    <Icon icon='mdi:timer-pause-outline' />
                  </CustomAvatar>
                  <Typography sx={{ mb: 3, fontWeight: '600' }}>Pause time</Typography>
                  <Typography>The amount of time the device stops between two vibrations/light ups</Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider sx={{ my: '0 !important' }} />
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='type-select'>Type</InputLabel>
                  <Select fullWidth labelId='type-select' label='Type' value={type} onChange={handleTypeValue}>
                    <MenuItem value='VBR'>Vibrate</MenuItem>
                    <MenuItem value='LGT'>Light</MenuItem>
                    <MenuItem value='VLG'>Vibrate & light</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  label='Control time(s)'
                  type='number'
                  inputProps={{ min: 0, max: 100 }}
                  onChange={e => setControlTime(Number(e.target.value))}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  label='Period time(s)'
                  type='number'
                  inputProps={{ min: 0, max: controlTime ?? 100 }}
                  onChange={e => setPeriodTime(Number(e.target.value))}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField
                  fullWidth
                  label='Pause time(s)'
                  type='number'
                  inputProps={{ min: 0, max: controlTime }}
                  onChange={e => setPauseTime(Number(e.target.value))}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{
              position: 'relative',
              justifyContent: 'right',
              pt: theme => `${theme.spacing(10)} !important`,
              px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
              pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`]
            }}
          >
            <Button
              variant='contained'
              sx={{ mr: 1 }}
              endIcon={<Icon icon='bx:send' />}
              onClick={handleSend}
              disabled={!type || !controlTime}
            >
              Send
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                toggle(device._id)
                setType('')
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  )
}

export default DialogSendControlSignal
