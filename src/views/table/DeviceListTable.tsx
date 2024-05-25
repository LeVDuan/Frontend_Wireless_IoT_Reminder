// ** React Imports
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/QuickSearchToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { DeviceType } from 'src/@core/utils/types'

// ** Data Import
import DialogRenameDevice from '../components/dialogs/DialogRenameDevice'
import DialogDeleteConfirm from '../components/dialogs/DialogDeleteConfirm'

// import DialogViewDevice from '../components/dialogs/DialogViewDevice'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { formatTimestamp, getColorFromBatteryValue } from 'src/utils/format'
import { Grid, IconButton } from '@mui/material'

// import AddDeviceDrawer from 'src/views/components/drawer/AddDeviceDrawer'
import Tooltip from '@mui/material/Tooltip'
import { DeviceStoreType } from 'src/@core/utils/types'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import DialogAddDevice from '../components/dialogs/DialogAddDevice'

interface DeviceListTableProps {
  store: DeviceStoreType
}

interface CellType {
  row: DeviceType
}

interface StatusObj {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  false: { title: 'Inactive', color: 'error' },
  true: { title: 'Active', color: 'success' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const renderAvatar = (deviceId: number) => {
  // const stateNum = Math.floor(Math.random() * 6)
  // const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  // const color = states[stateNum]

  // if (row.avatar.length) {
  //   return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  // } else
  // return (
  // <CustomAvatar
  //   skin='light'
  //   color={color as ThemeColor}
  //   sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
  // >
  //   {getInitials(name ? name : 'Device default')}
  // </CustomAvatar>
  return <CustomAvatar src={`/images/avatars/${deviceId}.png`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />

  // )
}

const columns: GridColDef[] = [
  {
    flex: 0.3,
    minWidth: 250,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAvatar(row.deviceId)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 500 }}>
              {row.name}
            </Typography>
            <Typography noWrap variant='subtitle2' sx={{ color: 'text.disable' }}>
              #{row.deviceId}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.3,
    minWidth: 180,
    field: 'date',
    headerName: 'Last status update',
    renderCell: ({ row }: CellType) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {formatTimestamp(row.lastUpdated)}
      </Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 250,
    headerName: 'Battery status',
    field: 'batteryValue',
    renderCell: ({ row }: CellType) => (
      <>
        <LinearProgress
          variant='determinate'
          value={row.batteryStatus}
          color={getColorFromBatteryValue(row.batteryStatus)}
          sx={{ mr: 4, height: 6, width: '100%', borderRadius: 8, '& .MuiLinearProgress-bar': { borderRadius: 8 } }}
        />
        <Typography variant='body2'>{row.batteryStatus}%</Typography>
      </>
    )
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      const status = statusObj[row.isActive.toString()]

      return <CustomChip rounded size='small' skin='light' color={status.color} label={status.title} />
    }
  },
  {
    flex: 0.2,
    minWidth: 130,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title='View'>
            {/* <DialogViewDevice device={row} /> */}
            <IconButton size='small' component={Link} href={`/device/${row.deviceId}`}>
              <Icon icon='bx:show' fontSize={20} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Rename'>
            <DialogRenameDevice device={row} />
          </Tooltip>
          <Tooltip title='Delete'>
            <DialogDeleteConfirm device={row} />
          </Tooltip>
        </Box>
      )
    }
  }
]

const DeviceListTable = ({ store }: DeviceListTableProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<DeviceType[]>(store.devices ? store.devices : [])

  // const [value, setValue] = useState<DeviceGridRowType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = store.devices.filter(row => {
      return Object.keys(row).some(field => {
        // @ts-ignore
        return searchRegex.test(row[field].toString())
      })
    })
    if (searchValue.length) {
      setFilteredData(filteredRows)
    } else {
      setFilteredData([])
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={`Number of devices in the system: ${store.totalDevices} devices.`}
            action={
              <div>
                <DialogAddDevice store={store} />
              </div>
            }
          />

          <DataGrid
            autoHeight
            columns={columns}
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={paginationModel}
            slots={{ toolbar: QuickSearchToolbar }}
            onPaginationModelChange={setPaginationModel}
            rows={filteredData.length ? filteredData : store.devices}
            getRowId={row => row.deviceId}
            slotProps={{
              baseButton: {
                variant: 'outlined'
              },
              toolbar: {
                value: searchText,
                clearSearch: () => handleSearch(''),
                onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value)
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default DeviceListTable
