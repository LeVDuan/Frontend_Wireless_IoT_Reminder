// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import TableColumns from 'src/views/table/TableColumns'
import DialogAlert from 'src/views/components/dialogs/DialogAlert'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

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
        <TableColumns />
      </Grid>
    </Grid>
  )
}

export default DeviceControl
