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
import { usePort } from 'src/context/PortContext'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const DeviceControl = () => {
  const { connect, sendMessage } = usePort()
  const handleClick = async () => {
    await connect()
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
        <Button variant='contained' className='demo-space-x' onClick={handleClick}>
          Open Port
        </Button>
      </Grid>
      <Grid item xs={12}>
        <TableColumns />
      </Grid>
    </Grid>
  )
}

export default DeviceControl
