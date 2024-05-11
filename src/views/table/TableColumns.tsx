// ** React Imports
import { useState, useEffect } from 'react'

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
import { usePort } from 'src/context/PortContext'
import Icon from 'src/@core/components/icon'
import DialogSendControlSignal from '../components/dialogs/DialogSendControlSignal'
import LinearProgress from '@mui/material/LinearProgress'
import { getActiveDevices } from 'src/api/devices'
import { DeviceGridRowType } from 'src/@fake-db/types'

interface StatusObj {
  [key: number]: {
    title: string
    color: ThemeColor
  }
}

const statusObj: StatusObj = {
  0: { title: 'free', color: 'success' },
  1: { title: 'queuing', color: 'warning' }
}

const TableColumns = () => {
  // ** States
  const [data, setData] = useState<DeviceGridRowType[]>([])

  useEffect(() => {
    const fetchActiveDevices = async () => {
      try {
        const data = await getActiveDevices()
        setData(data)
        // console.log(data)
      } catch (error) {
        console.error('Error fetching devices', error)
      }
    }

    fetchActiveDevices()
  }, [])

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
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

  const columns: GridColDef[] = [
    {
      flex: 0.1,
      field: 'device_id',
      minWidth: 80,
      headerName: 'Device ID',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary', textAlign: 'center' }}>
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
          <Typography noWrap variant='body2' sx={{ color: 'text.primary' }}>
            {row.name}
          </Typography>
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
          <Typography variant='body2' sx={{ color: 'text.primary', display: 'inline-block' }}>
            {`${params.row.pin}%`}
          </Typography>
        </Box>
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
      flex: 0.2,
      minWidth: 200,
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params: GridRenderCellParams) => {
        return <DialogSendControlSignal id={params.row.id} name={params.row.name} />
      }
    }
  ]

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
        rows={data}
        getRowId={row => row.device_id}
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
