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
import LogListTable from 'src/views/table/LogListTable'

const ActivityHistory = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: LogStoreType = useSelector((state: RootState) => state.log)

  useEffect(() => {
    dispatch(fetchLogs({ dates: [], action: '' }))
  }, [dispatch])

  // console.log('Logs store: ', store)

  return (
    <Grid container spacing={6} className='match-height' justifyItems='center'>
      <PageHeader
        title={
          <Typography variant='h5' color='primary.main'>
            Activity History
          </Typography>
        }
        subtitle={<Typography variant='body2'>List of system operation history.</Typography>}
      />
      <Grid item xs={12}>
        <LogListTable store={store} />
      </Grid>
    </Grid>
  )
}

export default ActivityHistory
