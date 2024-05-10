// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
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
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
// ** Custom Components Imports
import { DeviceGridRowType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import toast from 'react-hot-toast'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  0: { title: 'free', color: 'success' },
  1: { title: 'queuing', color: 'warning' },
  2: { title: 'disconnected', color: 'error' }
}

interface DialogEditDevicelProps {
  device: DeviceGridRowType
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogEditDevice: React.FC<DialogEditDevicelProps> = ({ device }) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const status = statusObj[device.status]
  const handleAplly = () => {
    const promiseToast = new Promise((resolve, reject) => {
      setShow(false)
      setTimeout(() => {
        if (Math.random() < 0.5) {
          resolve('foo')
        } else {
          reject('fox')
        }
      }, 1000)
    })
    return toast.promise(promiseToast, {
      loading: 'Loading ...',
      success: 'Apply successfully!',
      error: 'Error!'
    })
  }
  return (
    <Fragment>
      <Button sx={{ mr: 4 }} size='small' variant='outlined' color='info' onClick={() => setShow(true)}>
        Edit
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
              Edit Device Information
            </Typography>
            <Typography variant='body2'>
              Edit device information, be careful not to sync with physical devices.
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item sm={3} xs={12}>
              <TextField fullWidth value={device.id} label='ID' />
            </Grid>
            <Grid item sm={9} xs={12}>
              <TextField fullWidth defaultValue={device.name} label='Name' placeholder='Device 0' />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField fullWidth value={device.last_update} label='Lastest Update' placeholder='/03/08/2001' />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='status-select'>Status</InputLabel>
                <Select fullWidth label='Status' defaultValue={status.title} labelId='status-select'>
                  <MenuItem value='free'>
                    <CustomChip rounded size='small' skin='light' color='success' label='Free' />
                  </MenuItem>
                  <MenuItem value='queuing'>
                    <CustomChip rounded size='small' skin='light' color='warning' label='Queuing' />
                  </MenuItem>
                  <MenuItem value='disconnected'>
                    <CustomChip rounded size='small' skin='light' color='error' label='Disconnected' />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleAplly}>
            Apply
          </Button>
          <Button variant='outlined' color='secondary' onClick={() => setShow(false)}>
            Discard
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogEditDevice
