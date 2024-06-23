// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import { LogType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

import toast from 'react-hot-toast'
import axios from 'axios'
import { fetchLogs } from 'src/store/log'
import { API_LOGS_URL } from 'src/store/log'

interface DialogDeleteConfirmProps {
  open: boolean
  toggle: (id: string) => void
  log: LogType | null
}

const DialogDeleteLogConfirm = ({ open, toggle, log }: DialogDeleteConfirmProps) => {
  // ** State
  const dispatch = useDispatch<AppDispatch>()

  const handleDelete = async () => {
    if (log != null) {
      toggle(log._id)

      try {
        const response = await axios.delete(`${API_LOGS_URL}/${log._id}`)

        await dispatch(fetchLogs({ dates: [], action: '' }))
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
    } else {
      return
    }
  }

  return (
    log && (
      <Fragment>
        <Dialog
          open={open}
          disableEscapeKeyDown
          maxWidth='md'
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          onClose={toggle}
        >
          <DialogTitle id='alert-dialog-title' variant='h5'>
            You will delete this activity log, are you sure about this?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              If you agree, press the "Agree" button, otherwise press the cancel button.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' color='secondary' onClick={() => toggle(log._id)}>
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

export default DialogDeleteLogConfirm
