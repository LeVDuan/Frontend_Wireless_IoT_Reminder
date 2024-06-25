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
  const { selectPort, writeToPort } = usePort()
  const [hasPort, setHasPort] = useState<boolean>(false)
  const [response, setResponse] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchActiveDevices())
  }, [dispatch])

  useEffect(() => {
    console.log('res: ', response)

    if (response) {
      sendUpdateInfo(response, dispatch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  // console.log('store:', store)

  const handleOpenPort = async () => {
    const error = await selectPort()
    if (error) {
      toast.error(error)
    } else {
      toast.success('Connected successfully!')
      setHasPort(true)

      const brdCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Broadcast'
        })
      ).data.command

      console.log(brdCmd)

      // await writeToPort(brdCmd, setResponse)

      const reqCmd = (
        await axios.post(`${API_DEVICES_URL}/control`, {
          type: 'Request',
          deviceId: -1 // get all activeDevice info
        })
      ).data.command
      await writeToPort(reqCmd, setResponse)
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
      {hasPort && (
        <Grid item xs={12}>
          <DeviceControlListTable store={store} />
        </Grid>
      )}
    </Grid>
  )
}

export default DeviceControl
