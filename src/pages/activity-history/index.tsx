// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TimelineFilled from 'src/views/components/timeline/TimelineFilled'

const ActivityHistory = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item xs={12}>
        <TimelineFilled />
      </Grid>
    </Grid>
  )
}

export default ActivityHistory
