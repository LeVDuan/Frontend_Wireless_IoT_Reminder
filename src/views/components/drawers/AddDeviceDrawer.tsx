// ** React Imports

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Actions Imports
// import { addUser } from 'src/store/apps/user'
import { addDevice } from 'src/store/device'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// import { UsersType } from 'src/types/apps/userTypes'
import { DeviceStoreType, DeviceType } from 'src/@core/utils/types'
import { useAuth } from 'src/hooks/useAuth'

interface AddDeviceDrawerProps {
  open: boolean
  toggle: () => void
}

interface DeviceData {
  deviceId: number
  name: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const schema = yup.object().shape({
  deviceId: yup.number().required(),
  name: yup
    .string()
    .min(1, obj => showErrors('Username', obj.value.length, obj.min))
    .required()
})

const defaultValues = {
  deviceId: Number(''),
  name: ''
}

const AddDeviceDrawer = ({ open, toggle }: AddDeviceDrawerProps) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType
  const { user } = useAuth()
  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const onSubmit = (data: DeviceData) => {
    if (store.devices.some((d: DeviceType) => d.name === data.name || d.deviceId === data.deviceId)) {
      store.devices.forEach((d: DeviceType) => {
        if (d.name === data.name) {
          setError('name', {
            message: 'Device name already exists!'
          })
        }
        if (d.deviceId === data.deviceId) {
          setError('deviceId', {
            message: 'Device id already exists!'
          })
        }
      })
    } else {
      dispatch(addDevice({ deviceId: data.deviceId, name: data.name, userName: user!.fullName }))

      toggle()
      reset()
    }
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Device</Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='bx:x' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='deviceId'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  type='number'
                  label='Device id'
                  onChange={onChange}
                  placeholder='3'
                  error={Boolean(errors.deviceId)}
                />
              )}
            />
            {errors.deviceId && <FormHelperText sx={{ color: 'error.main' }}>{errors.deviceId.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='Device name'
                  onChange={onChange}
                  placeholder='myDevice'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default AddDeviceDrawer
