// ** MUI Imports
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
// import LogsTimeline from 'src/views/components/timeline/LogsTimeline'
import TableCollapsible from 'src/views/table/TableSortSelect'

const ActivityHistory = () => {
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
        <TableCollapsible />
      </Grid>
    </Grid>
  )
}

export default ActivityHistory
