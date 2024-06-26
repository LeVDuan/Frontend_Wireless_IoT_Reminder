import { Grid } from '@mui/material'
import { useEffect } from 'react'

import { DeviceStoreType } from 'src/@core/utils/types'
import DeviceViewLeft from './DeviceViewLeft'
import DeviceViewRight from './DeviceViewRight'
import { fetchDevice } from 'src/store/device'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'

interface DeviceViewProps {
  id: string
}

const DeviceView = ({ id }: DeviceViewProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType

  useEffect(() => {
    dispatch(fetchDevice(id))
  }, [dispatch, id])

  console.log('store:', store)

  if (store.device && store.device._id) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <DeviceViewLeft deviceData={store.device} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <DeviceViewRight deviceData={store.device} />
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceView
