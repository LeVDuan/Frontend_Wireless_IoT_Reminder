// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import TableColumns from 'src/views/table/data-grid/TableColumns'
import ButtonsContained from 'src/views/components/buttons/ButtonsContained'
import CardSnippet from 'src/@core/components/card-snippet'
import { Button } from '@mui/material'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const DeviceControl = () => {
  const openPort = async () => {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort()

    // // wait for the serial port to open.
    await port.open({ baudRate: 9600 })

    if (port.readable && port.writable) {
      console.log(`Tên cổng COM: ${port.getInfo().usbProductId}`)
      if (port.getInfo().usbProductId === 'undefined') {
        console.log('Invalid com port')
      }
    }
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={10} sx={{ order: -1 }}>
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
      <Grid item xs={12} md={2} sx={{ order: -1 }}>
        <Button variant='contained' className='demo-space-x' onClick={() => openPort()}>
          Open Port
        </Button>
        {/* <ButtonsContained /> */}
      </Grid>
      <Grid item xs={12}>
        <TableColumns />
      </Grid>
    </Grid>
  )
}

export default DeviceControl
