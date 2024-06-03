// ** React Imports
import React, { Ref, useState, forwardRef, ReactElement, Fragment } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Box, { BoxProps } from '@mui/material/Box'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import LinearProgress from '@mui/material/LinearProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import { DeviceType } from 'src/@core/utils/types'
import { ThemeColor } from 'src/@core/layouts/types'
import { formatTimestamp, getColorFromBatteryValue } from 'src/utils'

interface DialogViewDeviceProps {
  device: DeviceType
}

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}))

const statusObj: StatusObj = {
  true: { title: 'Active', color: 'success' },
  false: { title: 'Inactive', color: 'error' }
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const renderAvatar = (name: string) => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      variant='rounded'
      color={color as ThemeColor}
      sx={{ width: 110, height: 110, fontWeight: 600, mb: 6, fontSize: '3rem' }}
    >
      {getInitials(name ? name : 'Device default')}
    </CustomAvatar>
  )
}

const DialogViewDevice = ({ device }: DialogViewDeviceProps) => {
  // ** States
  const [show, setShow] = useState<boolean>(false)
  const status = statusObj[device.isActive.toString()]

  return (
    <Fragment>
      <IconButton size='small' onClick={() => setShow(true)}>
        <Icon icon='bx:show' fontSize={20} />
      </IconButton>
      <Dialog
        fullWidth
        open={show}
        maxWidth='md'
        scroll='body'
        onClose={() => setShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => setShow(false)}
      >
        <DialogContent
          sx={{
            position: 'relative',
            pb: theme => `${theme.spacing(5)} !important`,
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pt: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(12.5)} !important`]
          }}
        >
          <IconButton
            size='small'
            onClick={() => setShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='bx:x' />
          </IconButton>
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography variant='h4' sx={{ mb: 3 }}>
              {device.name}
            </Typography>
          </Box>
          <Card>
            <Grid container spacing={6}>
              <Grid item sm={5} xs={12} sx={{ pt: ['0 !important', '1.5rem !important'] }}>
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'action.hover'
                  }}
                >
                  {renderAvatar(device.name)}
                  <Typography variant='h5' sx={{ mb: 2.5, fontSize: '1.375rem !important' }}>
                    {device.name}
                  </Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={status.title}
                    sx={{ fontWeight: 500, mb: 5 }}
                    color={status.color}
                  />
                  <Typography variant='body2'>{device.batteryStatus}%</Typography>

                  <LinearProgress
                    variant='determinate'
                    value={device.batteryStatus}
                    color={getColorFromBatteryValue(device.batteryStatus)}
                    sx={{ height: 6, mt: 1, width: '80%' }}
                  />
                </CardContent>
              </Grid>
              <Grid item xs={12} sm={7}>
                <CardContent>
                  <Typography variant='h6' sx={{ mb: 3.5 }}>
                    Details
                  </Typography>
                  <Divider
                    sx={{
                      mb: theme => `${theme.spacing(6.75)} !important`
                    }}
                  />
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <StyledBox>
                        <Box
                          sx={{
                            mb: 6.75,
                            display: 'flex',
                            alignItems: 'center',
                            '& svg': { color: 'primary.main', mr: 2.75 }
                          }}
                        >
                          <Icon icon='bx:check' fontSize={30} />
                          <div>
                            <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                              1.23k
                            </Typography>
                            <Typography variant='body2'>Task Done</Typography>
                          </div>
                        </Box>
                        <Box
                          sx={{
                            mb: 6.75,
                            display: 'flex',
                            alignItems: 'center',
                            '& svg': { color: 'primary.main', mr: 2.75 }
                          }}
                        >
                          <Icon icon='bx:check' fontSize={30} />
                          <div>
                            <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                              1.23k
                            </Typography>
                            <Typography variant='body2'>Task Done</Typography>
                          </div>
                        </Box>
                      </StyledBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          mb: 6.75,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { color: 'primary.main', mr: 2.75 }
                        }}
                      >
                        <Icon icon='bx:check' fontSize={30} />
                        <div>
                          <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                            1.23k
                          </Typography>
                          <Typography variant='body2'>Task Done</Typography>
                        </div>
                      </Box>
                      <Box
                        sx={{
                          mb: 6.75,
                          display: 'flex',
                          alignItems: 'center',
                          '& svg': { color: 'primary.main', mr: 2.75 }
                        }}
                      >
                        <Icon icon='bx:check' fontSize={30} />
                        <div>
                          <Typography variant='h6' sx={{ fontSize: '1.125rem !important' }}>
                            1.23k
                          </Typography>
                          <Typography variant='body2'>Task Done</Typography>
                        </div>
                      </Box>
                    </Grid>
                  </Grid>

                  <Divider sx={{ mt: theme => `${theme.spacing(1)} !important` }} />
                  <Box sx={{ pt: 4, pb: 2 }}>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Device Name:</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>@{device.name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                      <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Physical ID:</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>#{device.deviceId}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                      <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Status:</Typography>
                      <CustomChip
                        rounded
                        skin='light'
                        size='small'
                        label={status.title}
                        sx={{ fontWeight: 500 }}
                        color={status.color}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', mb: 4 }}>
                      <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>
                        Remaining Battery Life:
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{device.batteryStatus}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex' }}>
                      <Typography sx={{ mr: 2, fontWeight: 700, color: 'text.secondary' }}>Last Updated:</Typography>
                      <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                        {formatTimestamp(device.lastUpdated)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'right',
            px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
            pb: theme => [`${theme.spacing(3)} !important`, `${theme.spacing(6.25)} !important`]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={() => setShow(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogViewDevice
