// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'axios'

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
import { devices } from 'src/@fake-db/table/device-active-list'
import { usePort } from 'src/context/PortContext'
import Icon from 'src/@core/components/icon'
import DialogSendControlSignal from '../components/dialogs/DialogSendControlSignal'
import LinearProgress from '@mui/material/LinearProgress'

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
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })
  const { port, sendToPort } = usePort()
  const updateDevices = async () => {
    // const res = await axios.get('http://localhost:5000/posts')
    // console.log(res.data)
    // res.data.map((obj: any) => {
    //   console.log(obj)
    // })

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
      flex: 0.25,
      minWidth: 290,
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
      flex: 0.2,
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
      minWidth: 110,
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
        return <DialogSendControlSignal id={params.row.id} name={params.row.name} />
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
