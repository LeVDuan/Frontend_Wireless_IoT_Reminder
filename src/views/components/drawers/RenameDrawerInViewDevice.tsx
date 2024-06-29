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
import { renameDevice } from 'src/store/device'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// import { UsersType } from 'src/types/apps/userTypes'
import { DeviceStoreType, DeviceType } from 'src/@core/utils/types'
import { useAuth } from 'src/hooks/useAuth'

interface RenameDrawerProps {
  open: boolean
  toggle: () => void
}

interface renameData {
  currentName: string
  newName: string
}

const showErrors = (field: string, valueLen: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
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
  newName: yup
    .string()
    .min(1, obj => showErrors('New Name', obj.value.length))
    .required()
})

const RenameDrawer = ({ open, toggle }: RenameDrawerProps) => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType
  const { user } = useAuth()

  const defaultValues = {
    currentName: '',
    newName: ''
  }
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
  const onSubmit = ({ newName, currentName }: renameData) => {
    if (store.devices.some((d: DeviceType) => d.name === newName)) {
      if (newName === currentName) {
        setError('newName', {
          message: 'The new name is the same as the current name!'
        })
      } else {
        setError('newName', {
          message: 'This name already exists!'
        })
      }
    } else {
      const device = store.device
      dispatch(
        renameDevice({
          id: device!._id,
          newInfo: { deviceId: device!.deviceId, oldName: device!.name, newName, userName: user!.fullName }
        })
      )
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
        <Typography variant='h6'>
          Rename Device: {store.device.name}(#{store.device.deviceId})
        </Typography>
        <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
          <Icon icon='bx:x' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='currentName'
              control={control}
              rules={{ required: true }}
              render={({ field: {} }) => (
                <TextField value={store.device.name} label='Current Name' InputProps={{ readOnly: true }} />
              )}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='newName'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                  value={value}
                  label='New name'
                  onChange={onChange}
                  placeholder='newName'
                  error={Boolean(errors.newName)}
                />
              )}
            />
            {errors.newName && <FormHelperText sx={{ color: 'error.main' }}>{errors.newName.message}</FormHelperText>}
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

export default RenameDrawer
