// ** React Imports
import React, { Ref, useState, useEffect, forwardRef, ReactElement, Fragment } from 'react'

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
import CustomChip from 'src/@core/components/mui/chip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { DeviceGridRowType } from 'src/@fake-db/types'
import { ThemeColor } from 'src/@core/layouts/types'
import toast from 'react-hot-toast'

interface DialogViewDeviceProps {
  device: DeviceGridRowType
}

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

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogViewDevice = ({ device }: DialogViewDeviceProps) => {
  // ** States
  const [response, setResponse] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [name, setName] = useState<string>(device.name)
  const [status, setStatus] = useState<number>(device.status)
  const updatedDevice = { name, status }

  const handleAplly = () => {
    setShow(false)
    if (name != device.name || status != device.status) {
      const update = async () => {
        try {
          const res = await updateDevice(device._id, updatedDevice)
          setResponse(res)
        } catch (error) {
          console.error('Error fetching devices', error)
        }
      }
      update()
    } else {
      setResponse('success')
    }
    const promiseToast = new Promise((resolve, reject) => {
      setShow(false)
      if (response === 'success') {
        reject('fox')
      } else {
        resolve('foo')
      }
    })

    return toast.promise(promiseToast, {
      loading: 'Loading ...',
      success: 'Apply successfully!',
      error: 'Failed!'
    })
  }

  return (
    <Fragment>
      <IconButton size='small' onClick={() => setShow(true)}>
        <Icon icon='bx:show' fontSize={20} />
      </IconButton>
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
            <Grid item sm={6} xs={12}>
              <TextField fullWidth value={device.device_id} label='Device ID' />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField
                fullWidth
                defaultValue={device.name}
                label='Name'
                placeholder='Device 0'
                onChange={e => setName(e.target.value)}
              />
            </Grid>
            <Grid item sm={6} xs={12}>
              <TextField fullWidth value={device.last_update} label='Lastest Update' placeholder='/03/08/2001' />
            </Grid>
            <Grid item sm={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel id='status-select'>Status</InputLabel>
                <Select
                  fullWidth
                  label='Status'
                  defaultValue={device.status}
                  labelId='status-select'
                  onChange={e => setStatus(Number(e.target.value))}
                >
                  <MenuItem value={0}>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color={statusObj[0].color}
                      label={statusObj[0].title}
                    />
                  </MenuItem>
                  <MenuItem value={1}>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color={statusObj[1].color}
                      label={statusObj[1].title}
                    />
                  </MenuItem>
                  <MenuItem value={2}>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      color={statusObj[2].color}
                      label={statusObj[2].title}
                    />
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'right',
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

export default DialogViewDevice
