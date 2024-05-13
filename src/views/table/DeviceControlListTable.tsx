// ** React Imports
import { ChangeEvent, useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Data Import
import { usePort } from 'src/context/PortContext'
import Icon from 'src/@core/components/icon'
import DialogSendControlSignal from '../components/dialogs/DialogSendControlSignal'
import LinearProgress from '@mui/material/LinearProgress'
import { getActiveDevices } from 'src/api/devices'
import { DeviceGridRowType } from 'src/@fake-db/types'
import { formatTimestamp, getColorFromBatteryValue } from 'src/utils/format'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from './QuickSearchToolbar'

interface CellType {
  row: DeviceGridRowType
}

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  0: { title: 'Inactive', color: 'error' },
  1: { title: 'Active', color: 'success' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
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

const columns: GridColDef[] = [
  {
    flex: 0.25,
    minWidth: 250,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderAvatar(row.name)}
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
    flex: 0.2,
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
    flex: 0.25,
    minWidth: 250,
    headerName: 'Battery status',
    field: 'batteryValue',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ width: '100%' }}>
        <Typography variant='body2'>{row.batteryStatus}%</Typography>
        <LinearProgress
          variant='determinate'
          value={row.batteryStatus}
          color={getColorFromBatteryValue(row.batteryStatus)}
          sx={{ height: 6, mt: 1 }}
        />
      </Box>
    )
  },
  {
    flex: 0.15,
    minWidth: 100,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => {
      let status: any
      if (row.isActive) {
        status = statusObj[1]
      } else {
        status = statusObj[0]
      }

      return <CustomChip rounded size='small' skin='light' color={status.color} label={status.title} />
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => {
      return <DialogSendControlSignal id={row.deviceId} name={row.name} />
    }
  }
]

const DeviceControlListTable = () => {
  // ** State
  const [data, setData] = useState<DeviceGridRowType[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<DeviceGridRowType[]>([])

  // const [value, setValue] = useState<DeviceGridRowType[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter(row => {
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

  useEffect(() => {
    const fetchActiveDevices = async () => {
      try {
        const data = await getActiveDevices()
        setData(data)

        console.log(data)
      } catch (error) {
        console.error('Error fetching devices', error)
      }
    }

    fetchActiveDevices()
  }, [])

  const { port, sendToPort } = usePort()
  const updateDevices = async () => {
    if (port) {
      if (!port || !port.writable) {
        toast.error('Update failed!')
      } else {
        await sendToPort('BRD')
        toast.success('Update successfully!')
      }
    } else {
      toast.error('Please connect the COM port first')
    }
  }

  return (
    <Card>
      <CardHeader
        title='List of active devices: '
        action={
          <Button size='small' variant='contained' endIcon={<Icon icon='bx:refresh' />} onClick={updateDevices}>
            Update
          </Button>
        }
      />
      <DataGrid
        autoHeight
        rows={filteredData.length ? filteredData : data}
        getRowId={row => row.deviceId}
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        slots={{ toolbar: QuickSearchToolbar }}
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
  )
}

export default DeviceControlListTable
