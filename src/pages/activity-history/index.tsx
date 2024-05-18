// ** MUI Imports
import { Card } from '@mui/material'
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
// import LogsTimeline from 'src/views/components/timeline/LogsTimeline'
import TableCollapsible from 'src/views/table/TableSortSelect'

const ActivityHistory = () => {
  return (
    <Grid container spacing={6} className='match-height' justifyItems='center'>
      <Grid item xs={12}>
        <Card title='Timeline Outlined'>
          <TableCollapsible />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ActivityHistory
