// ** React Imports
import { ChangeEvent, useState } from 'react'

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
import { DeviceType } from 'src/@core/utils/types'
import { delay, formatTimestamp, getColorFromBatteryValue, parseToJSON } from 'src/utils'
import CustomAvatar from 'src/@core/components/mui/avatar'
import QuickSearchToolbar from './QuickSearchToolbar'
import { DeviceStoreType } from 'src/@core/utils/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { updateStatusDevices } from 'src/store/device'

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

const columns: GridColDef[] = [
  {
    flex: 0.3,
    minWidth: 200,
    field: 'name',
    headerName: 'Name',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            src={`/images/avatars/${row.deviceId}.png`}
            sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }}
          />
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
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => {
      return <DialogSendControlSignal device={row} />
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

  const { port, sendToPort, readFromPort } = usePort()
  const updateDevices = async () => {
    if (port) {
      if (!port.writable) {
        toast.error("Can't not write to COM port!")
      } else {
        await sendToPort('BRD\n')
        setIsDisable(true)
        await delay(3000)
        await sendToPort('REQ\n')
        setIsDisable(false)

        const responseFromPort = await readFromPort()

        console.log('REQ res:', responseFromPort)
        if (responseFromPort.startsWith('REQ:') && responseFromPort.endsWith('\r\n')) {
          if (responseFromPort.startsWith('REQ:Failed')) {
            toast.error('Update failed!')
          } else if (responseFromPort.startsWith('REQ:-1')) {
            console.log('Has no device active')
          } else {
            const update = parseToJSON(responseFromPort)
            console.log({ update })
            try {
              dispatch(updateStatusDevices({ update }))
              toast.success('Update successfully!')
            } catch (error) {
              toast.error('Update failed!')
            }
          }
        } else {
          toast.error('Error receiving data from transmitter, please try again!')
        }
      }
    } else {
      toast.error('Please connect the COM port first')
    }
  }

  return (
    <Card>
      <CardHeader
        title={`List of active devices: ${store.totalActiveDevices}`}
        action={
          <>
            <Button
              disabled={isDisable}
              size='small'
              variant='contained'
              startIcon={<Icon icon='bx:refresh' />}
              onClick={updateDevices}
            >
              Update status
            </Button>
          </>
        }
      />
      <DataGrid
        autoHeight
        rows={filteredData.length ? filteredData : store.activeDevices}
        getRowId={row => row.deviceId}
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
    </Card>
  )
}

export default DeviceControlListTable
