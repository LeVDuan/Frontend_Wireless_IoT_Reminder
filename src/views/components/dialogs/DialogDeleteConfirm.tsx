// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { DeviceType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchDevices } from 'src/store/device'
import { API_DEVICES_URL } from 'src/store/device'

import toast from 'react-hot-toast'
import axios from 'axios'

interface DialogDeleteConfirmProps {
  open: boolean
  toggle: (id: string) => void
  device: DeviceType | null
}

const DialogDeleteConfirm = ({ open, toggle, device }: DialogDeleteConfirmProps) => {
  // ** State
  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = async () => {
    toggle(device!._id)
    try {
      const response = await axios.delete(`${API_DEVICES_URL}/${device!._id}`)

      await dispatch(fetchDevices())
      console.log('deleted res: ', response.data)

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

  return (
    device && (
      <Fragment>
        <Dialog
          open={open}
          disableEscapeKeyDown
          maxWidth='md'
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          onClose={() => toggle(device._id)}
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
            <Button variant='outlined' color='secondary' onClick={() => toggle(device._id)}>
              Cancel
            </Button>
            <Button variant='contained' onClick={handleDelete}>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  )
}

export default DialogDeleteConfirm
