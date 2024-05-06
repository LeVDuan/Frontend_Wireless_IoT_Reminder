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

interface DialogSendControlSignalProps {
  id: number
  name: string
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogSendControlSignal: React.FC<DialogSendControlSignalProps> = ({ id, name }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const [type, setType] = useState<string>('VBR')
  const [timeControl, setTimeControl] = useState<string>('')
  const [periodTime, setPeriodTime] = useState<string>('')
  const [pauseTime, setPauseTime] = useState<string>('')
  const { port, sendToPort } = usePort()

  const handleControl = async () => {
    if (port) {
      setShow(true)
    } else {
      toast.error('Please connect the COM port first')
    }
  }

  const handleSend = async () => {
    if (!port.writable) {
      toast.error("Can't write to COM port!")
    } else {
      const cmd = type + ' ' + id + ' ' + timeControl + ' ' + periodTime + ' ' + pauseTime
      console.log(cmd)
      sendToPort(cmd)
      toast.success('Send control signal successfully!')
    }
    setShow(false)
  }

  return (
    <Fragment>
      <Button variant='outlined' color='inherit' endIcon={<Icon icon='bx:send' />} onClick={handleControl}>
        Control
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
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
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='bx:x' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Device control options for {name}
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
                  <MenuItem value='VLG'>Vibrate and light</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextField fullWidth label='Control time(s)' onChange={e => setTimeControl(e.target.value)} />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextField fullWidth label='Period time(s)' onChange={e => setPeriodTime(e.target.value)} />
            </Grid>
            <Grid item sm={3} xs={12}>
              <TextField fullWidth label='Pause time(s)' onChange={e => setPauseTime(e.target.value)} />
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
          <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogSendControlSignal
