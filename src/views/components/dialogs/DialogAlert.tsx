// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Icon from 'src/@core/components/icon'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'

const DialogAlert = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const { port, requestOpenPort } = usePort()

  const handleClickOpen = async () => {
    try {
      await requestOpenPort()
      toast.success('Connected successfully!')
    } catch (err) {
      if (port) {
        toast.success('Update COM port successfully!')
      } else {
        setOpen(true)
      }
    }
  }
  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Button
        size='large'
        variant='contained'
        className='demo-space-x'
        onClick={handleClickOpen}
        startIcon={<Icon icon='ic:sharp-usb' style={{ fontSize: 25, verticalAlign: 'center', marginBottom: '13px' }} />}
      >
        Open Port
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>You haven't selected a COM port to connect to?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Please select the correct COM port.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClose}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogAlert
