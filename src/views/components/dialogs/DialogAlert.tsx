// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'

const DialogAlert = () => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const { requestOpenPort } = usePort()
  const [message, setMessage] = useState<string>('')

  const handleClickOpen = async () => {
    try {
      await requestOpenPort()
      toast.success('Connected successfully!')
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.indexOf('The port is already open.') != -1) {
          setMessage('The port is already open.')
        } else if (err.message.indexOf('No port selected by the user.') != -1) {
          setMessage('No port selected by the user.')
        }
        setOpen(true)
      }
    }
  }
  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Button size='medium' variant='contained' className='demo-space-x' onClick={handleClickOpen}>
        Open Port
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Operation error when Open Port!</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>{message}</DialogContentText>
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
