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

interface DialogDeleteConfirmProps {
  deviceInfo: DeviceGridRowType
}

const DialogDeleteConfirm: React.FC<DialogDeleteConfirmProps> = ({ deviceInfo }) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)

  const handleClickOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Button size='small' variant='outlined' color='error' onClick={handleClickOpen}>
        Delete
      </Button>
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
        <DialogTitle id='alert-dialog-title'>
          You will delete all information of device {}, are you sure about this?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Any information you have saved on your device will be deleted. If you agree, press the "Agree" button,
            otherwise press the cancel button.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleClose}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogDeleteConfirm
