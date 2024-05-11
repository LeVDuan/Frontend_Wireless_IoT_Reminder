// ** React Imports
import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import LinearProgress from '@mui/material/LinearProgress'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/QuickSearchToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { DeviceGridRowType } from 'src/@fake-db/types'

// ** Data Import
import DialogEditDevice from '../components/dialogs/DialogEditDevice'
import DialogDeleteConfirm from '../components/dialogs/DialogDeleteConfirm'
import { getDevices } from 'src/api/devices'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  0: { title: 'free', color: 'success' },
  1: { title: 'queuing', color: 'warning' },
  2: { title: 'disconnected', color: 'error' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const columns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'device_id',
    minWidth: 80,
    headerName: 'Device ID',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.device_id}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 100,
    field: 'name',
    headerName: 'Device Name',
    renderCell: (params: GridRenderCellParams) => {
      const { row } = params

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography noWrap variant='body2' sx={{ color: 'text.primary' }}>
              {row.name}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.175,
    type: 'date',
    minWidth: 100,
    headerName: 'Date',
    field: 'last_update',
    valueGetter: params => new Date(params.value),
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.last_update}
      </Typography>
    )
  },
  {
    flex: 0.3,
    minWidth: 200,
    field: 'pin',
    headerName: 'Pin status',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'block' }}>
        <LinearProgress
          color={params.row.color}
          variant='determinate'
          value={params.row.pin}
          sx={{ mr: 3, height: 10, minWidth: 150, width: '100%', display: 'inline-block' }}
        />
        <Typography variant='body2' sx={{ width: '100%', color: 'text.primary', display: 'inline-block' }}>
          {`${params.row.pin}%`}
        </Typography>
      </Box>
    )
  },
  {
    flex: 0.2,
    minWidth: 180,
    field: 'status',
    headerName: 'Status',
    renderCell: (params: GridRenderCellParams) => {
      const status = statusObj[params.row.status]

      return <CustomChip rounded size='small' skin='light' color={status.color} label={status.title} />
    }
  },
  {
    flex: 0.25,
    minWidth: 250,
    field: 'actions',
    headerName: 'Actions',
    renderCell: (params: GridRenderCellParams) => {
      return (
        <Box sx={{ display: 'flex' }}>
          <DialogEditDevice device={params.row} />
          <DialogDeleteConfirm device={params.row} />
        </Box>
      )
    }
  }
]

const TableFilter = () => {
  // ** States
  const [data, setData] = useState<DeviceGridRowType[]>([])

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await getDevices()
        setData(data)
        // console.log(data)
      } catch (error) {
        console.error('Error fetching devices', error)
      }
    }

    fetchDevices()
  }, [])

  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<DeviceGridRowType[]>([])
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

  return (
    <Card>
      <CardHeader title='List of devices in the system' />
      <DataGrid
        autoHeight
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: QuickSearchToolbar }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData.length ? filteredData : data}
        getRowId={row => row.device_id}
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

export default TableFilter
