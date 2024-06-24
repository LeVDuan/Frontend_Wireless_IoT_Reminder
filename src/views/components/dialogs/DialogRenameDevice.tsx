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
import { DeviceStoreType, DeviceType } from 'src/@core/utils/types'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { renameDevice } from 'src/store/device'
import { useAuth } from 'src/hooks/useAuth'

// import { renameDevice } from 'src/api/devices'

interface DialogRenameDeviceProps {
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

const DialogRenameDevice = ({ open, toggle, device }: DialogRenameDeviceProps) => {
  // ** States
  const [newName, setNewName] = useState<string>('')
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType
  const { user } = useAuth()

  const handleApply = async () => {
    toggle(device!._id)
    if (newName === device!.name) {
      setNewName('')

      return toast.error('The new name is the same as the current name!')
    } else if (newName === '') {
      return
    }

    const isInvalidName = store.devices.find(device => device.name === newName)
    if (isInvalidName) {
      setNewName('')

      return toast.error(`Device name ${newName} already exists!`)
    } else {
      dispatch(
        renameDevice({
          id: device!._id,
          newInfo: { deviceId: device!.deviceId, oldName: device!.name, newName, userName: user!.fullName }
        })
      )
      setNewName('')
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
                Change the device's memorable name
              </Typography>
              <Typography variant='body2'>Rename this device, be careful not to sync with physical devices.</Typography>
            </Box>
            <Grid container spacing={6} mt={10}>
              <Grid item sm={5} xs={12}>
                <TextField fullWidth defaultValue={device.name} label='Current Name' InputProps={{ readOnly: true }} />
              </Grid>
              <Grid item sm={2} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
                  <Icon icon='material-symbols:play-arrow' fontSize={30} />
                  <Icon icon='material-symbols:play-arrow' fontSize={30} />
                  <Icon icon='material-symbols:play-arrow' fontSize={30} />
                </Box>
              </Grid>
              <Grid item sm={5} xs={12}>
                <TextField
                  fullWidth
                  label='New Name'
                  placeholder='Duan LV'
                  onChange={e => setNewName(e.target.value)}
                />
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
            <Button
              variant='outlined'
              color='secondary'
              onClick={() => {
                setNewName('')
                toggle(device._id)
              }}
            >
              Discard
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  )
}

export default DialogRenameDevice
