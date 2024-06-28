// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import DeviceControlListTable from 'src/views/table/DeviceControlListTable'
import { DeviceStoreType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { API_DEVICES_URL, fetchActiveDevices } from 'src/store/device'
import Button from '@mui/material/Button'
import { usePort } from 'src/context/PortContext'
import toast from 'react-hot-toast'
import axios from 'axios'
import { sendUpdateInfo } from 'src/utils'

const DeviceControl = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType
  const { port, selectPort, writeToPort } = usePort()
  const [response, setResponse] = useState<string | null>(null)

  useEffect(() => {
    // console.log('port: ', port)
    const updateActiveDeviceFromTransmitter = async () => {
      // await writeToPort('BRD\n', setResponse)
      // await writeToPort('REQ 100\n', setResponse)

      const brdCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Broadcast'
        })
      ).data.command

      // console.log(brdCmd)
      await writeToPort(brdCmd, setResponse)

      const reqCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Request',
          deviceId: -1 // get all activeDevice info
        })
      ).data.command

      // console.log(reqCmd)

      await writeToPort(reqCmd, setResponse)
    }
    if (port !== undefined) {
      updateActiveDeviceFromTransmitter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [port])

  useEffect(() => {
    // console.log('res: ', response)

    if (response && response.includes('REQ:')) {
      // console.log('update')
      sendUpdateInfo(response, dispatch, true)
      dispatch(fetchActiveDevices())
    }
  }, [response, dispatch])

  // console.log('store:', store)

  const handleOpenPort = async () => {
    const error = await selectPort()
    if (error) {
      toast.error(error)
    } else {
      toast.success('Connected successfully!')
    }
  }

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
      {port !== undefined && (
        <Grid item xs={12}>
          <DeviceControlListTable store={store} />
        </Grid>
      )}
    </Grid>
  )
}

export default DeviceControl
