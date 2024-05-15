// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { DeviceGridRowType } from 'src/@fake-db/types'
import { deleteDevice } from 'src/api/devices'
import toast from 'react-hot-toast'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'

interface DialogDeleteConfirmProps {
  device: DeviceGridRowType
}

const DialogDeleteConfirm: React.FC<DialogDeleteConfirmProps> = ({ device }) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [response, setResponse] = useState<string>('')

  const handleDelete = () => {
    const deletedDevice = async () => {
      try {
        const res = await deleteDevice(device._id)
        setResponse(res)
      } catch (error) {
        console.error('Error fetching devices', error)
      }
    }
    deletedDevice()
    const promiseToast = new Promise((resolve, reject) => {
      setOpen(false)
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
