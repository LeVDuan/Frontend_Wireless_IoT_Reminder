// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import LogsTimeline from 'src/views/components/timeline/LogsTimeline'

const ActivityHistory = () => {
  return (
    <Grid container spacing={6} className='match-height' justifyItems='center'>
      <Grid item xs={1}></Grid>
      <Grid item xs={10}>
        <LogsTimeline />
      </Grid>
    </Grid>
  )
}

export default ActivityHistory
