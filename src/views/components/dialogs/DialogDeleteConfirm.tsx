// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { DeviceTypes } from 'src/@core/utils/types'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { deleteDevice } from 'src/store/device'

import toast from 'react-hot-toast'

interface DialogDeleteConfirmProps {
  device: DeviceTypes
}

const DialogDeleteConfirm = ({ device }: DialogDeleteConfirmProps) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = () => {
    setOpen(false)
    dispatch(deleteDevice(device._id))

    return toast.success('Successfully!')
  }
  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <IconButton size='small' onClick={handleClickOpen}>
        <Icon icon='bx:trash-alt' fontSize={20} />
      </IconButton>
      <Dialog
        open={open}
        disableEscapeKeyDown
        maxWidth='md'
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
      >
        <DialogTitle id='alert-dialog-title' variant='h5'>
          You will delete device, are you sure about this?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Any information you have saved on your device will be deleted.
            <br /> If you agree, press the "Agree" button, otherwise press the cancel button.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleDelete}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogDeleteConfirm
