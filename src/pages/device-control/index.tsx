// ** Next Import

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import DialogAlert from 'src/views/components/dialogs/DialogAlert'
import DeviceControlListTable from 'src/views/table/DeviceControlListTable'

const DeviceControl = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={10}>
        <PageHeader
          title={
            <Typography variant='h3' color='primary.main'>
              Select the device to control
            </Typography>
          }
          subtitle={
            <Typography variant='body1'>
              Select the com port corresponding to the transmitter and select the receiver to control
            </Typography>
          }
        />
      </Grid>
      <Grid item xs={12} md={2} container display='flex' alignItems='center' justifyContent='flex-end'>
        <DialogAlert />
      </Grid>
      <Grid item xs={12}>
        <DeviceControlListTable />
      </Grid>
    </Grid>
  )
}

export default DeviceControl
