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
import DialogDeleteConfirm from '../components/dialogs/DialogDeleteConfirm'

// import DialogViewDevice from '../components/dialogs/DialogViewDevice'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { formatTimestamp, getColorFromBatteryValue } from 'src/utils'
import { Grid, IconButton } from '@mui/material'

// import AddDeviceDrawer from 'src/views/components/drawer/AddDeviceDrawer'
import Tooltip from '@mui/material/Tooltip'
import { DeviceStoreType } from 'src/@core/utils/types'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import AddDeviceDrawer from '../components/drawers/AddDeviceDrawer'
import { getInitials } from 'src/@core/utils/get-initials'
import RenameDrawer from '../components/drawers/RenameDrawerInList'
import Button from '@mui/material/Button'

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

const renderDeviceAvatar = (row: DeviceType) => {
  if (row.deviceId === 14 || row.deviceId === 0 || row.deviceId === 1) {
    return <CustomAvatar src={`/images/avatars/${row.deviceId}.jpg`} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar skin='light' color='info' sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}>
        {getInitials(row.name)}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.3,
    minWidth: 250,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box
          component={Link}
          href={`/device/${row._id}`}
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
        >
          {renderDeviceAvatar(row)}
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
  }
]

const DeviceListTable = ({ store }: DeviceListTableProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<DeviceType[]>(store.devices ? store.devices : [])

  // const [value, setValue] = useState<DeviceGridRowType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null)
  const [renameDrawerOpen, setRenameDrawerOpen] = useState<boolean>(false)
  const [dialogDelCfOpen, setDialogDelCfOpen] = useState<boolean>(false)
  const [addDeviceDrawerOpen, setAddDeviceDrawerOpen] = useState<boolean>(false)
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

  const toggleRenameDrawer = (id: string) => {
    const device = store.devices.find(device => device._id === id)
    if (device) {
      setSelectedDevice(device)
    }

    setRenameDrawerOpen(!renameDrawerOpen)
  }

  const toggleDialogDelCf = (id: string) => {
    const device = store.devices.find(device => device._id === id)
    if (device) {
      setSelectedDevice(device)
    }

    setDialogDelCfOpen(!dialogDelCfOpen)
  }

  const toggleAddDeviceDrawer = () => {
    setAddDeviceDrawerOpen(!addDeviceDrawerOpen)
  }
  const columns: GridColDef[] = [
    ...defaultColumns,
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
              <IconButton size='small' component={Link} href={`/device/${row._id}`}>
                <Icon icon='bx:show' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Rename'>
              <IconButton size='small' onClick={() => toggleRenameDrawer(row._id)}>
                <Icon icon='bx:pencil' fontSize={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton size='small' onClick={() => toggleDialogDelCf(row._id)}>
                <Icon icon='bx:trash-alt' fontSize={20} />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title={`Number of devices in the system: ${store.totalDevices} devices.`}
            action={
              <Button size='medium' variant='contained' className='demo-space-x' onClick={toggleAddDeviceDrawer}>
                Add Device
              </Button>
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
      <RenameDrawer open={renameDrawerOpen} toggle={toggleRenameDrawer} device={selectedDevice} />
      <DialogDeleteConfirm open={dialogDelCfOpen} toggle={toggleDialogDelCf} device={selectedDevice} />
      <AddDeviceDrawer open={addDeviceDrawerOpen} toggle={toggleAddDeviceDrawer} />
    </Grid>
  )
}

export default DeviceListTable
