// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, Fragment } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { DeviceType } from 'src/@core/utils/types'
import { ThemeColor } from 'src/@core/layouts/types'
import toast from 'react-hot-toast'

// import { renameDevice } from 'src/api/devices'

interface DialogRenameDeviceProps {
  device: DeviceType
}

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  true: { title: 'Active', color: 'success' },
  false: { title: 'Inactive', color: 'error' }
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogRenameDevice = ({ device }: DialogRenameDeviceProps) => {
  // ** States
  const [response, setResponse] = useState<string>('')
  const [show, setShow] = useState<boolean>(false)
  const [name, setName] = useState<string>(device.name)
  const status = statusObj[device.isActive.toString()]

  const updatedDevice = { name, status }

  const handleApply = () => {
    setShow(false)

    // if (name != device.name) {
    //   const update = async () => {
    //     try {
    //       const res = await renameDevice(device._id, updatedDevice)
    //       setResponse(res)
    //     } catch (error) {
    //       console.error('Error fetching devices', error)
    //     }
    //   }
    //   update()
    // } else {
    //   setResponse('success')
    // }
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
        <Icon icon='bx:pencil' fontSize={20} />
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
              Change the device's memorable name
            </Typography>
            <Typography variant='body2'>Rename this device, be careful not to sync with physical devices.</Typography>
          </Box>
          <Grid container spacing={6} mt={10}>
            <Grid item sm={5} xs={12}>
              <TextField
                fullWidth
                defaultValue={device.name}
                label='Current Name'
                InputProps={{ readOnly: true }}
                onChange={e => setName(e.target.value)}
              />
            </Grid>
            <Grid item sm={2} xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                <Icon icon='material-symbols:play-arrow' fontSize={30} />
                <Icon icon='material-symbols:play-arrow' fontSize={30} />
                <Icon icon='material-symbols:play-arrow' fontSize={30} />
              </Box>
            </Grid>
            <Grid item sm={5} xs={12}>
              <TextField fullWidth label='New Name' placeholder='Duan LV' onChange={e => setName(e.target.value)} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'right',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(10)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleApply}>
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

export default DialogRenameDevice
