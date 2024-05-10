// ** React Imports
import { ChangeEvent, Fragment, useState } from 'react'

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
import { devices } from 'src/@fake-db/table/device-list'
import DialogEditDevice from '../components/dialogs/DialogEditDevice'
import DialogDeleteConfirm from '../components/dialogs/DialogDeleteConfirm'

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
    field: 'id',
    minWidth: 80,
    headerName: 'ID',
    renderCell: (params: GridRenderCellParams) => (
      <Typography variant='body2' sx={{ color: 'text.primary' }}>
        {params.row.id}
      </Typography>
    )
  },
  {
    flex: 0.175,
    minWidth: 100,
    field: 'name',
    headerName: 'Name',
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
    flex: 0.2,
    minWidth: 200,
    field: 'pin',
    headerName: 'Pin status',
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: 'inline-block' }}>
        <LinearProgress
          color={params.row.color}
          variant='determinate'
          value={params.row.pin}
          sx={{ mr: 4, height: 10, width: '250%', display: 'inline-flex' }}
        />
        <Typography variant='body2' sx={{ color: 'text.primary', display: 'inline-flex' }}>
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DialogEditDevice device={params.row} />
          <DialogDeleteConfirm deviceInfo={params.row} />
        </Box>
      )
    }
  }
]

const TableFilter = () => {
  // ** States
  const [data] = useState<DeviceGridRowType[]>(devices)
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
      <CardHeader title='Quick Filter' />
      <DataGrid
        autoHeight
        columns={columns}
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        slots={{ toolbar: QuickSearchToolbar }}
        onPaginationModelChange={setPaginationModel}
        rows={filteredData.length ? filteredData : data}
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