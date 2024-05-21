// ** MUI Imports
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import PageHeader from 'src/@core/components/page-header'
import { LogStoreType } from 'src/@core/utils/types'
import { AppDispatch, RootState } from 'src/store'
import { fetchLogs } from 'src/store/log'

// ** Demo Components Imports
// import LogsTimeline from 'src/views/components/timeline/LogsTimeline'
import LogsTable from 'src/views/table/LogsTable'

const ActivityHistory = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: LogStoreType = useSelector((state: RootState) => state.log)

  useEffect(() => {
    dispatch(fetchLogs())
  }, [dispatch])

  console.log('Logs store: ', store)

  return (
    <Grid container spacing={6} className='match-height' justifyItems='center'>
      <PageHeader
        title={
          <Typography variant='h5' color='primary.main'>
            Activity History
          </Typography>
        }
        subtitle={<Typography variant='body2'>List of devices in the system.</Typography>}
      />
      <Grid item xs={12}>
        <LogsTable store={store} />
      </Grid>
    </Grid>
  )
}

export default ActivityHistory
