import { Grid } from '@mui/material'

import { DeviceStoreType } from 'src/@core/utils/types'
import DeviceViewLeft from './DeviceViewLeft'
import DeviceViewRight from './DeviceViewRight'

interface DeviceViewProps {
  store: DeviceStoreType
}

const DeviceView = ({ store }: DeviceViewProps) => {
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
}

export default DeviceView
