// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import TableFilter from 'src/views/table/TableFilter'

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const DataGrid = () => {
  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h3' color='primary.main'>
            Device List
          </Typography>
        }
        subtitle={<Typography variant='body1'>List of devices in the system.</Typography>}
      />
      <Grid item xs={12}>
        <TableFilter />
      </Grid>
    </Grid>
  )
}

export default DataGrid
