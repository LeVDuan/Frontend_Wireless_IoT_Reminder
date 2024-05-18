// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'
import { DeviceStoreType } from 'src/@core/utils/types'
import { AppDispatch, RootState } from 'src/store'
import { fetchDevices } from 'src/store/device'

// ** Demo Components Imports
import DeviceListTable from 'src/views/table/DeviceListTable'

const DataGrid = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device)

  useEffect(() => {
    dispatch(fetchDevices())
  }, [dispatch])

  // console.log('store: ', store)

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h5' color='primary.main'>
            Device List
          </Typography>
        }
        subtitle={<Typography variant='body2'>List of devices in the system.</Typography>}
      />
      <Grid item xs={12}>
        <DeviceListTable store={store} />
      </Grid>
    </Grid>
  )
}

export default DataGrid
