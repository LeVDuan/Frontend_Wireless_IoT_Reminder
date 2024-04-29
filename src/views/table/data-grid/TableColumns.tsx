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
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Data Import
import { rows } from 'src/@fake-db/table/static-data'
import { usePort } from 'src/context/PortContext'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

// ** renders client column
const renderClient = (params: GridRenderCellParams) => {
  const { row } = params
  const stateNum = Math.floor(Math.random() * 6)
  const states = ['success', 'error', 'warning', 'info', 'primary', 'secondary']
  const color = states[stateNum]

  if (row.avatar.length) {
    return <CustomAvatar src={`/images/avatars/${row.avatar}`} sx={{ mr: 3, width: '1.875rem', height: '1.875rem' }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={color as ThemeColor}
        sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
      >
        {getInitials(row.full_name ? row.full_name : 'John Doe')}
      </CustomAvatar>
    )
  }
}

const statusObj: StatusObj = {
  1: { title: 'active', color: 'success' },
  2: { title: 'inactive', color: 'error' },
  3: { title: 'resigned', color: 'warning' },
  4: { title: 'current', color: 'primary' },
  5: { title: 'applied', color: 'info' }
}

// ** Send control command to device
// const controlCMD = (params: GridRenderCellParams) => {
//   const { sendMessage } = usePort()
//   const cmd = params.row.age + params.row.status + params.row.name
//   console.log(cmd)
//   sendMessage('1 3 duan')
// }

const TableColumns = () => {
  // ** States
  const [hideNameColumn, setHideNameColumn] = useState(true)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
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
      field: 'full_name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(params)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography noWrap variant='body2' sx={{ color: 'text.primary', fontWeight: 600 }}>
                {row.full_name}
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
          {params.row.age}
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
          <Button size='small' variant='outlined' color='secondary' onClick={() => controlCMD(params)}>
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
            <Button size='small' variant='contained' onClick={updateDevices}>
              Update device status
            </Button>
          </div>
        }
      />
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[7, 10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        initialState={{ columns: { columnVisibilityModel: { full_name: hideNameColumn } } }}
      />
    </Card>
  )
}

export default TableColumns
