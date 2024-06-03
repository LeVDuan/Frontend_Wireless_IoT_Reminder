// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import { useAuth } from 'src/hooks/useAuth'

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 60,
  bottom: -1,
  height: 170,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    position: 'static'
  }
}))

const AnalyticsCongratulations = () => {
  // ** Hook
  const theme = useTheme()
  const { user } = useAuth()

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ py: theme => `${theme.spacing(5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} sx={{ textAlign: ['center', 'start'], minHeight: 162 }}>
            <Typography variant='h5' sx={{ mb: 4, color: 'primary.main' }}>
              Welcome back {user?.fullName}! 🐱‍🏍
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Have a great day.</Typography>
            <Typography sx={{ mb: 3, color: 'text.secondary' }}>
              Check your system's analysis and statistics.
            </Typography>
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img alt='Congratulations John' src={`/images/cards/illustration-john-${theme.palette.mode}.png`} />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default AnalyticsCongratulations
