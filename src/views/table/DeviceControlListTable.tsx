// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Third Party Components

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Data Import
import { usePort } from 'src/context/PortContext'
import Icon from 'src/@core/components/icon'
import DialogSendControlSignal from '../components/dialogs/DialogSendControlSignal'
import LinearProgress from '@mui/material/LinearProgress'
import { DeviceType } from 'src/@core/utils/types'
import { formatTimestamp, getColorFromBatteryValue, sendUpdateInfo } from 'src/utils'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from './QuickSearchToolbar'
import { DeviceStoreType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import Link from 'next/link'
import { getInitials } from 'src/@core/utils/get-initials'
import axios from 'axios'
import { API_DEVICES_URL, fetchActiveDevices } from 'src/store/device'

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

interface DeviceControlListTableProps {
  store: DeviceStoreType
}
const renderDeviceAvatar = (row: DeviceType) => {
  if (row.deviceId === 14 || row.deviceId === 0 || row.deviceId === 1) {
    return (
      <CustomAvatar src={`/images/avatars/${row.deviceId}.jpg`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
    )
  } else {
    return (
      <CustomAvatar skin='light' color='info' sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}>
        {getInitials(row.name)}
      </CustomAvatar>
    )
  }
}
const defaultColumns: GridColDef[] = [
  {
    flex: 0.3,
    minWidth: 200,
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
    headerName: 'Last updated',
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

const DeviceControlListTable = ({ store }: DeviceControlListTableProps) => {
  // ** State
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<DeviceType[]>(store.activeDevices ? store.activeDevices : [])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const [isDisable, setIsDisable] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const { writeToPort } = usePort()
  const [response, setResponse] = useState<string | null>(null)

  useEffect(() => {
    // console.log('res: ', response)

    if (response && response.includes('REQ:')) {
      // console.log('update')
      sendUpdateInfo(response, dispatch, true)
      dispatch(fetchActiveDevices())
    }
    setResponse(null)
  }, [response, dispatch])
  const toggleDialogSendSignal = (id: string) => {
    const device = store.activeDevices.find(device => device._id === id)

    // console.log(device)

    if (device) {
      setSelectedDevice(device)
    }
    setDialogOpen(!dialogOpen)
  }

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = store.activeDevices.filter(row => {
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

  const updateDevices = async () => {
    setIsDisable(true)

    // await writeToPort('BRD\n', setResponse)
    // await writeToPort('REQ 100\n', setResponse)

    const brdCmd = (
      await axios.post(`${API_DEVICES_URL}/control`, {
        type: 'Broadcast'
      })
    ).data.command

    // console.log(brdCmd)
    await writeToPort(brdCmd, setResponse)

    const reqCmd = (
      await axios.post(`${API_DEVICES_URL}/control`, {
        type: 'Request',
        deviceId: -1 // get all activeDevice info
      })
    ).data.command

    // console.log(reqCmd)

    await writeToPort(reqCmd, setResponse)

    setIsDisable(false)
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.2,
      minWidth: 200,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Button
          size='small'
          variant='outlined'
          color='inherit'
          endIcon={<Icon icon='bx:send' />}
          onClick={() => toggleDialogSendSignal(row._id)}
        >
          Control
        </Button>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title={`List of active devices: ${store.totalActiveDevices ? store.totalActiveDevices : 0}`}
        action={
          <Button
            disabled={isDisable}
            size='small'
            variant='contained'
            startIcon={<Icon icon='bx:refresh' />}
            onClick={updateDevices}
          >
            Update status
          </Button>
        }
      />
      <DataGrid
        autoHeight
        rows={filteredData.length ? filteredData : store.activeDevices}
        getRowId={row => row._id}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50]}
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
      <DialogSendControlSignal open={dialogOpen} toggle={toggleDialogSendSignal} device={selectedDevice} />
    </Card>
  )
}

export default DeviceControlListTable
