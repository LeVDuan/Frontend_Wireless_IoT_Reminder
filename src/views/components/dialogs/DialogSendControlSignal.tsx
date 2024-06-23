// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, Fragment } from 'react'

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
import Select from '@mui/material/Select'
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
import { API_LOGS_URL } from 'src/store/log'

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
  const [type, setType] = useState<string>('VBR')
  const [controlTime, setControlTime] = useState<number>()
  const [periodTime, setPeriodTime] = useState<number>()
  const [pauseTime, setPauseTime] = useState<number>()
  const { port, sendToPort } = usePort()
  const { user } = useAuth()

  const handleSend = async () => {
    if (!port.writable) {
      toast.error("Can't write to COM port!")
    } else {
      if (device != null) {
        const ctrlSignal = type + ' ' + device.deviceId + ' ' + controlTime + ' ' + periodTime + ' ' + pauseTime
        console.log(ctrlSignal)
        sendToPort(ctrlSignal)
        toast.success('Send control signal successfully!')

        // "objId": "66421d39472d7402c217b87f",
        // "controlTime": 10,
        // "pauseTime": 1,
        // "periodTime": 1,
        // "type": "VBR"
        const details = { objId: device._id, controlTime, pauseTime, periodTime, type }
        const log = {
          userName: user?.fullName,
          deviceId: device.deviceId,
          deviceName: device.name,
          action: 'control',
          details,
          result: 'success'
        }
        const res = await axios.post(`${API_LOGS_URL}`, { log })

        console.log('create log: ', res.data)
        setControlTime(undefined)
        setPeriodTime(undefined)
        setPauseTime(undefined)
        toggle(device._id)
      }
    }
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
              onClick={() => toggle(device._id)}
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
                  <Select
                    defaultValue='VBR'
                    fullWidth
                    labelId='type-select'
                    label='VBR'
                    onChange={e => setType(e.target.value)}
                  >
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
                  onChange={e => setControlTime(Number(e.target.value))}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField fullWidth label='Period time(s)' onChange={e => setPeriodTime(Number(e.target.value))} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <TextField fullWidth label='Pause time(s)' onChange={e => setPauseTime(Number(e.target.value))} />
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
            <Button variant='contained' sx={{ mr: 1 }} endIcon={<Icon icon='bx:send' />} onClick={handleSend}>
              Send
            </Button>
            <Button variant='outlined' color='secondary' onClick={() => toggle(device._id)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  )
}

export default DialogSendControlSignal
