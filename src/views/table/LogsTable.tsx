// ** React Imports
import { useState, Fragment, ChangeEvent } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import Collapse from '@mui/material/Collapse'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import { DetailsAdd, DetailsControl, DetailsDelete, DetailsEdit, LogStoreType, LogType } from 'src/@core/utils/types'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Card, Divider, TablePagination } from '@mui/material'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { ThemeColor } from 'src/@core/layouts/types'
import CustomTimelineDot from 'src/@core/components/mui/timeline-dot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import CustomChip from 'src/@core/components/mui/chip'
import TimelineContent from '@mui/lab/TimelineContent'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import { styled } from '@mui/material/styles'
import CustomAvatar from 'src/@core/components/mui/avatar'

import { getInitials } from 'src/@core/utils/get-initials'

interface RowProps {
  row: LogType
}

interface LogActionTypeObj {
  [key: string]: {
    title: string
    color: ThemeColor
    icon: string
  }
}

interface LogsTableProps {
  store: LogStoreType
}
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const logActionTypeObj: LogActionTypeObj = {
  edit: { title: 'Edit', color: 'info', icon: 'bx:edit' },
  add: { title: 'Add', color: 'success', icon: 'gg:add-r' },
  delete: { title: 'Delete', color: 'error', icon: 'bx:trash-alt' },
  control: { title: 'Control', color: 'primary', icon: 'ri:remote-control-line' }
}

const renderLogDetails = (row: LogType) => {
  const logActionType = logActionTypeObj[row.action]

  // console.log(logActionType.color)
  switch (row.action) {
    case 'edit':
      const detailsEdit = row.details as DetailsEdit

      return (
        <TimelineItem>
          <TimelineSeparator>
            <CustomTimelineDot skin='light' color={logActionType.color}>
              <Icon icon={logActionType.icon} fontSize={20} />
            </CustomTimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
            <Box
              sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                Update the name of the device
              </Typography>
              <Typography variant='caption'>Wednesday</Typography>
            </Box>
            <Typography variant='body2' sx={{ color: 'text.primary' }}>
              <span>{detailsEdit.oldName}</span> <Icon icon='bx:right-arrow-alt' fontSize={20} />{' '}
              <span>{detailsEdit.newName}</span>
            </Typography>
            <Box sx={{ pt: 4, pb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Time stamp:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {row.timestamp}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  User:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  @{row.userName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Device ID:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  #{row.deviceId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Action:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={logActionType.title}
                  sx={{ fontWeight: 500 }}
                  color={logActionType.color}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Result:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={row.result}
                  sx={{ fontWeight: 500 }}
                  color={row.result as ThemeColor}
                />
              </Box>
            </Box>
            <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}></Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                Due Date: 15th Jan
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      )
    case 'add':
      const addDetails = row.details as DetailsAdd

      return (
        <TimelineItem>
          <TimelineSeparator>
            <CustomTimelineDot skin='light' color={logActionType.color}>
              <Icon icon={logActionType.icon} fontSize={20} />
            </CustomTimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
            <Box
              sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                Added a device to the system
              </Typography>
              <Typography variant='caption'>Wednesday</Typography>
            </Box>

            <Box sx={{ m: 2 }}>
              <Typography variant='subtitle1' gutterBottom component='div'>
                Added device:
              </Typography>
              <Table size='small' aria-label='add device'>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row._id}>
                    <TableCell component='th' scope='row'>
                      #{row.deviceId}
                    </TableCell>
                    <TableCell>{row.deviceName}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ pt: 4, pb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Time stamp:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {row.timestamp}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  User:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  @{row.userName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Device ID:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  #{addDetails.objId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Action:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={logActionType.title}
                  sx={{ fontWeight: 500 }}
                  color={logActionType.color}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Result:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={row.result}
                  sx={{ fontWeight: 500 }}
                  color={row.result as ThemeColor}
                />
              </Box>
            </Box>
            <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}></Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                Due Date: 15th Jan
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      )
    case 'delete':
      const deleteDetails = row.details as DetailsDelete

      return (
        <TimelineItem>
          <TimelineSeparator>
            <CustomTimelineDot skin='light' color={logActionType.color}>
              <Icon icon={logActionType.icon} fontSize={20} />
            </CustomTimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
            <Box
              sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                Delete the device from the system
              </Typography>
              <Typography variant='caption'>Wednesday</Typography>
            </Box>
            <Box sx={{ m: 2 }}>
              <Typography variant='subtitle1' gutterBottom component='div'>
                Deleted device:
              </Typography>
              <Table size='small' aria-label='delete device'>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row._id}>
                    <TableCell component='th' scope='row'>
                      #{row.deviceId}
                    </TableCell>
                    <TableCell>{row.deviceName}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ pt: 4, pb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Time stamp:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {row.timestamp}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  User:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  @{row.userName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Device ID:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  #{deleteDetails.objId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Action:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={logActionType.title}
                  sx={{ fontWeight: 500 }}
                  color={logActionType.color}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Result:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={row.result}
                  sx={{ fontWeight: 500 }}
                  color={row.result as ThemeColor}
                />
              </Box>
            </Box>
            <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}></Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                Due Date: 15th Jan
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      )
    case 'control':
      const controlDetails = row.details as DetailsControl

      return (
        <TimelineItem>
          <TimelineSeparator>
            <CustomTimelineDot skin='light' color={logActionType.color}>
              <Icon icon={logActionType.icon} fontSize={20} />
            </CustomTimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
            <Box
              sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                Control device
              </Typography>
              <Typography variant='caption'>Wednesday</Typography>
            </Box>

            <Box sx={{ m: 2 }}>
              <Typography variant='subtitle1' gutterBottom component='div'>
                Added device:
              </Typography>
              <Table size='small' aria-label='control device'>
                <TableHead>
                  <TableRow>
                    <TableCell>Device ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Control Time (s)</TableCell>
                    <TableCell>Period Time (s)</TableCell>
                    <TableCell>Pause Time (s)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row._id}>
                    <TableCell component='th' scope='row'>
                      #{row.deviceId}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {controlDetails.type}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {controlDetails.controlTime}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      {controlDetails.periodTime}
                    </TableCell>
                    <TableCell>{controlDetails.pauseTime}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ pt: 4, pb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Time stamp:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {row.timestamp}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  User:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  @{row.userName}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Device ID:
                </Typography>
                <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                  #{controlDetails.objId}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Action:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={logActionType.title}
                  sx={{ fontWeight: 500 }}
                  color={logActionType.color}
                />
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Typography variant='inherit' sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>
                  Result:
                </Typography>
                <CustomChip
                  rounded
                  skin='light'
                  size='small'
                  label={row.result}
                  sx={{ fontWeight: 500 }}
                  color={row.result as ThemeColor}
                />
              </Box>
            </Box>
            <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}></Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>
                Due Date: 15th Jan
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      )
    default:
      break
  }
}

const renderAvatar = (name: string) => {
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  return (
    <CustomAvatar
      skin='light'
      color={color as ThemeColor}
      sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
    >
      {getInitials(name ? name : 'Device default')}
    </CustomAvatar>
  )
}
const Row = ({ row }: RowProps) => {
  // ** Props

  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const logActionType = logActionTypeObj[row.action]

  return (
    <Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            <Icon icon={open ? 'bx:chevron-up' : 'bx:chevron-down'} />
          </IconButton>
        </TableCell>
        <TableCell component='th' scope='row'>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderAvatar(row.userName)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 500 }}>
                {row.userName}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 500 }}>
              {row.deviceName}
            </Typography>
            <Typography noWrap variant='subtitle2' sx={{ color: 'text.disable' }}>
              #{row.deviceId}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomAvatar
              skin='light'
              color={logActionType.color}
              sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
            >
              <Icon icon={logActionType.icon} fontSize={20} />
            </CustomAvatar>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 500 }}>
              {logActionType.title}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>{row.timestamp}</TableCell>
        <TableCell>
          <CustomChip rounded size='small' skin='light' color={row.result as ThemeColor} label={row.result} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} sx={{ py: '0 !important' }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Details
              </Typography>
              <Timeline>{renderLogDetails(row)}</Timeline>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

const LogsTable = ({ store }: LogsTableProps) => {
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Card>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>User</TableCell>
              <TableCell>Device</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Time stamp</TableCell>
              <TableCell>Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {store.logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
              <Row key={row._id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={store.total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  )
}

export default LogsTable
