// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import DialogAlert from 'src/views/components/dialogs/DialogAlert'
import DeviceControlListTable from 'src/views/table/DeviceControlListTable'
import { DeviceStoreType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchActiveDevices } from 'src/store/device'
import Button from '@mui/material/Button'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'

const DeviceControl = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType

  const [dialogAlertOpen, setDialogAlertOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const { requestOpenPort } = usePort()

  const handleOpenPort = async () => {
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
        toggleDialogAlert()
      }
    }
  }
  const toggleDialogAlert = async () => {
    setDialogAlertOpen(!dialogAlertOpen)
  }

  useEffect(() => {
    dispatch(fetchActiveDevices())
  }, [dispatch])

  console.log('store:', store)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={10}>
        <PageHeader
          title={
            <Typography variant='h5' color='primary.main'>
              Select the device to control
            </Typography>
          }
          subtitle={
            <Typography variant='body2'>
              Select the com port corresponding to the transmitter and select the receiver to control
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12} md={2} container display='flex' alignItems='center' justifyContent='flex-end'>
        <Button size='medium' variant='contained' className='demo-space-x' onClick={handleOpenPort}>
          Open Port
        </Button>
      </Grid>
      <Grid item xs={12}>
        <DeviceControlListTable store={store} />
      </Grid>
      <DialogAlert open={dialogAlertOpen} toggle={toggleDialogAlert} message={message} />
    </Grid>
  )
}

export default DeviceControl
