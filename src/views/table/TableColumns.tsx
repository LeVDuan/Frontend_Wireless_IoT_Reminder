// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

// ** Third Party Components
import toast from 'react-hot-toast'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Data Import
import { devices } from 'src/@fake-db/table/device-list'
import { usePort } from 'src/context/PortContext'
import Icon from 'src/@core/components/icon'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  0: { title: 'ready', color: 'success' },
  1: { title: 'charging', color: 'error' },
  2: { title: 'using', color: 'warning' }
}

const TableColumns = () => {
  // ** States
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const { sendMessage } = usePort()
  const updateDevices = async () => {
    await sendMessage('1 3 Duan')
  }
  const controlCMD = async (params: GridRenderCellParams) => {
    const cmd = params.row.age + params.row.status + params.row.full_name
    console.log(cmd)
    sendMessage('1 3 duan')
  }

  const columns: GridColDef[] = [
    {
      flex: 0.25,
      minWidth: 290,
      field: 'name',
      headerName: 'Device name',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.name}
              </Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
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
      flex: 0.2,
      type: 'date',
      minWidth: 120,
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
      minWidth: 110,
      field: 'pin',
      headerName: 'Pin status',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.pin}
        </Typography>
      )
    },
    {
      flex: 0.2,
      minWidth: 140,
      field: 'status',
      headerName: 'Status',
      renderCell: (params: GridRenderCellParams) => {
        const status = statusObj[params.row.status]

        return <CustomChip rounded size='small' skin='light' color={status.color} label={status.title} />
      }
    },
    {
      flex: 0.125,
      minWidth: 140,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Button
            size='small'
            variant='outlined'
            color='secondary'
            endIcon={<Icon icon='bx:send' />}
            onClick={() => controlCMD(params)}
          >
            Control
          </Button>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Latest Update Device:'
        action={
          <div>
            <Button size='small' variant='contained' endIcon={<Icon icon='bx:refresh' />} onClick={updateDevices}>
              Update
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={devices}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default TableColumns
