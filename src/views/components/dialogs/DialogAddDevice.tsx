// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Card from '@mui/material/Card'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import toast from 'react-hot-toast'
import { DeviceStoreType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchDevices } from 'src/store/device'
import axios from 'axios'

interface DialogAddDeviceProps {
  store: DeviceStoreType
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogAddDevice = ({ store }: DialogAddDeviceProps) => {
  // ** States
  const [name, setName] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [deviceId, setDeviceId] = useState<number>()
  const dispatch = useDispatch<AppDispatch>()

  const handleSubmit = async () => {
    setShow(false)

    if (name === '' || deviceId === undefined) {
      return toast.error('Please fill in all fields in the form.')
    }
    const isInvalidDeviceId = store.devices.find(device => device.deviceId === deviceId)
    if (isInvalidDeviceId) {
      setName('')
      setDeviceId(undefined)

      return toast.error(`Device ID ${deviceId} already exists!`)
    }
    const isInvalidName = store.devices.find(device => device.name === name)
    if (isInvalidName) {
      setName('')
      setDeviceId(undefined)

      return toast.error(`Device name ${name} already exists!`)
    } else {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/devices`, { deviceId, name })

        await dispatch(fetchDevices())

        setName('')
        setDeviceId(undefined)

        const promiseToast = new Promise((resolve, reject) => {
          if (response.data.result == 'Success!') {
            resolve('OK')
          } else {
            reject('failed!')
          }
        })

        return toast.promise(promiseToast, {
          loading: 'Loading ...',
          success: 'Successfully!',
          error: 'Failed!'
        })
      } catch (error) {
        throw error
      }
    }
  }

  const handleCancel = () => {
    setName('')
    setDeviceId(undefined)
    setShow(false)
  }

  return (
    <Card>
      <Button size='medium' variant='contained' className='demo-space-x' onClick={() => setShow(true)}>
        Add Device
      </Button>
      <Dialog
        fullWidth
        open={show}
        maxWidth='sm'
        scroll='body'
        onClose={handleCancel}
        onBackdropClick={handleCancel}
        TransitionComponent={Transition}
      >
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton size='small' onClick={handleCancel} sx={{ position: 'absolute', right: '1rem', top: '1rem' }}>
            <Icon icon='bx:x' />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3 }}>
              Add New Device
            </Typography>
            <Typography variant='body2'>
              Enter the physical id of the device you want to add and a name for device.
            </Typography>
          </Box>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='deviceId'
                    type='number'
                    autoComplete='off'
                    label='Device Id'
                    onChange={e => setDeviceId(Number(e.target.value))}
                    placeholder='17'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='name'
                    autoComplete='off'
                    label='Device Name'
                    placeholder='Duan Le'
                    onChange={e => setName(e.target.value)}
                  />
                </Grid>
              </Grid>
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
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant='outlined' color='secondary' onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogAddDevice
