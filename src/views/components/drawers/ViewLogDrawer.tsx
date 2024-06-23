// ** React Imports

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import CustomChip from 'src/@core/components/mui/chip'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Button from '@mui/material/Button'
import { ThemeColor } from 'src/@core/layouts/types'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { DetailsControl, DetailsEdit, LogType } from 'src/@core/utils/types'

interface Props {
  open: boolean
  toggle: (id: string) => void
  log: LogType | null
}

interface LogActionObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

interface LogControlObj {
  [key: string]: {
    title: string
    color: ThemeColor
    icon: string
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
  paddingBottom: theme.spacing(2.25)
}))

const logActionObj: LogActionObj = {
  edit: { title: 'Edit', color: 'info' },
  add: { title: 'Add', color: 'warning' },
  delete: { title: 'Delete', color: 'error' },
  control: { title: 'Control', color: 'primary' }
}

const logControlObj: LogControlObj = {
  VBR: { title: 'Vibrate', color: 'primary', icon: 'lucide:vibrate' },
  LGT: { title: 'Light up', color: 'secondary', icon: 'heroicons-outline:light-bulb' },
  VLG: { title: 'Vibrate & Light up', color: 'info', icon: 'radix-icons:mix' }
}

const renderLogDetails = (row: LogType) => {
  console.log(row.action)
  switch (row.action) {
    case 'edit':
      const detailsEdit = row.details as DetailsEdit

      return (
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Icon icon='fluent-mdl2:rename' />
            </ListItemIcon>
            <ListItemText primary='New name' />
            <span>{detailsEdit.newName}</span>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon icon='fluent-mdl2:rename' />
            </ListItemIcon>
            <ListItemText primary='Old name' />
            <span>{detailsEdit.oldName}</span>
          </ListItem>
        </List>
      )
    case 'add':
      return (
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Icon icon='material-symbols:bookmark-added-outline' />
            </ListItemIcon>
            <ListItemText primary='Added device name' />
            <span>@{row.deviceName}</span>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon icon='material-symbols:bookmark-added-outline' />
            </ListItemIcon>
            <ListItemText primary='Added device Id' />
            <span>#{row.deviceId}</span>
          </ListItem>
        </List>
      )
    case 'delete':
      return (
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Icon icon='octicon:repo-deleted-16' />
            </ListItemIcon>
            <ListItemText primary='Deleted device name' />
            <span>@{row.deviceName}</span>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon icon='octicon:repo-deleted-16' />
            </ListItemIcon>
            <ListItemText primary='Deleted device Id' />
            <span>#{row.deviceId}</span>
          </ListItem>
        </List>
      )
    case 'control':
      const detailsControl = row.details as DetailsControl

      return (
        <List dense>
          <ListItem>
            <ListItemIcon>
              <Icon icon={logControlObj[detailsControl.type].icon} />
            </ListItemIcon>
            <ListItemText primary='Control type' />
            <CustomChip
              rounded
              size='small'
              skin='light'
              color={logControlObj[detailsControl.type].color}
              label={logControlObj[detailsControl.type].title}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Icon icon='ic:outline-share-arrival-time' />
            </ListItemIcon>

            <ListItemText primary='Control time' />
            <span>{detailsControl.controlTime}s</span>
          </ListItem>
        </List>
      )
    default:
      break
  }
}

const ViewLogDrawer = ({ open, toggle, log }: Props) => {
  // ** State

  return (
    log && (
      <Drawer
        open={open}
        anchor='right'
        onClose={toggle}
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      >
        <Header>
          <Typography variant='h6'>Activity log</Typography>
          <IconButton onClick={() => toggle(log._id)} sx={{ color: 'text.primary' }}>
            <Icon icon='bx:x' fontSize={20} />
          </IconButton>
        </Header>
        <Box>
          <Box sx={{ p: 6 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='body1' sx={{ mr: 2, mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Information
              </Typography>
            </Box>
            <Divider />
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Icon icon='simple-line-icons:user' />
                </ListItemIcon>
                <ListItemText primary='Action by' />
                <span>{log.userName}</span>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Icon icon='bi:device-ssd' />
                </ListItemIcon>
                <ListItemText primary='Device' />
                <span>{log.deviceName}</span>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Icon icon='mdi:call-to-action' />
                </ListItemIcon>
                <ListItemText primary='Action' />
                <CustomChip
                  rounded
                  size='small'
                  skin='light'
                  color={logActionObj[log.action].color}
                  label={logActionObj[log.action].title}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Icon icon='mdi:list-status' />
                </ListItemIcon>
                <ListItemText primary='Result' />
                <CustomChip
                  rounded
                  size='small'
                  skin='light'
                  color={log.result === 'success' ? 'success' : 'error'}
                  label={log.result}
                />
              </ListItem>
            </List>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant='body1' sx={{ mr: 2, mb: 2, fontWeight: 600, color: 'text.primary' }}>
                Details
              </Typography>
            </Box>
            <Divider />
            {renderLogDetails(log)}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={() => toggle(log._id)}>
                Close
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    )
  )
}

export default ViewLogDrawer
