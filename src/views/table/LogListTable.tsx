// ** React Imports
import { ChangeEvent, forwardRef, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import QuickSearchToolbar from 'src/views/table/QuickSearchToolbar'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import { LogStoreType, LogType } from 'src/@core/utils/types'

// import DialogViewDevice from '../components/dialogs/DialogViewDevice'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { Grid, IconButton } from '@mui/material'

// import AddDeviceDrawer from 'src/views/components/drawer/AddDeviceDrawer'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'src/@core/components/icon'
import { getInitials } from 'src/@core/utils/get-initials'
import format from 'date-fns/format'
import TextField from '@mui/material/TextField'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from 'src/@core/utils/types'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import DatePicker from 'react-datepicker'

import Select, { SelectChangeEvent } from '@mui/material/Select'
import { AppDispatch } from 'src/store'
import { useDispatch } from 'react-redux'
import { fetchLogs } from 'src/store/log'
import { formatTimestamp } from 'src/utils'
import DialogDeleteLogConfirm from '../components/dialogs/DialogDeleteLogConfirm'
import ViewLogDrawer from '../components/drawers/ViewLogDrawer'

interface LogListTableProps {
  store: LogStoreType
}

interface LogActionObj {
  [key: string]: {
    title: string
    icon: string
    color: ThemeColor
  }
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
}

interface CellType {
  row: LogType
}

const logActionObj: LogActionObj = {
  edit: { title: 'Rename', color: 'info', icon: 'bx:edit' },
  add: { title: 'Add', color: 'warning', icon: 'gg:add-r' },
  delete: { title: 'Delete', color: 'error', icon: 'bx:trash-alt' },
  control: { title: 'Control', color: 'primary', icon: 'ri:remote-control-line' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const renderDeviceAvatar = (row: LogType) => {
  if (row.deviceId === 14 || row.deviceId === 0 || row.deviceId === 1 || row.deviceId === 15) {
    return <CustomAvatar src={`/images/avatars/${row.deviceId}.jpg`} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar skin='light' color='info' sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}>
        {getInitials(row.deviceName)}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.18,
    minWidth: 100,
    field: 'device',
    headerName: 'Device',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderDeviceAvatar(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{row.deviceName}</Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
              #{row.deviceId}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.1,
    minWidth: 180,
    field: 'action',
    headerName: 'Action type',
    renderCell: ({ row }: CellType) => {
      return (
        <>
          <Tooltip
            title={
              <div>
                <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                  {logActionObj[row.action].title}
                </Typography>
              </div>
            }
          >
            <CustomAvatar skin='light' color={logActionObj[row.action].color} sx={{ width: 30, height: 30 }}>
              <Icon fontSize='1rem' icon={logActionObj[row.action].icon} />
            </CustomAvatar>
          </Tooltip>
          <Typography variant='inherit' sx={{ ml: 2, fontWeight: 500, color: 'text.secondary' }}>
            {logActionObj[row.action].title}
          </Typography>
        </>
      )
    }
  },
  {
    flex: 0.2,
    field: 'name',
    minWidth: 120,
    headerName: 'Action by',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar src={'/images/avatars/DuanLV.jpg'} sx={{ mr: 3, width: 30, height: 30 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{row.userName}</Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
              {'duan.lv194508@sis.hust.edu.vn'}
            </Typography>
          </Box>
        </Box>
      )
    }
  },

  {
    flex: 0.2,
    minWidth: 100,
    field: 'timestamp',
    headerName: 'Timestamp',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{formatTimestamp(row.timestamp)}</Typography>
    )
  },
  {
    flex: 0.12,
    minWidth: 100,
    field: 'result',
    headerName: 'Result',
    renderCell: ({ row }: CellType) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.result}
          sx={{ fontWeight: 500 }}
          color={row.result as ThemeColor}
        />
      )
    }
  }
]
/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})

/* eslint-enable */
const LogListTable = ({ store }: LogListTableProps) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<LogType[]>(store.logs ? store.logs : [])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [dates, setDates] = useState<Date[]>([])
  const [selectedLog, setSelectedLog] = useState<LogType | null>(null)
  const [actionValue, setActionValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)

  const [viewLogOpen, setViewLogOpen] = useState<boolean>(false)
  const [dialogCfOpen, setDialogCfOpen] = useState<boolean>(false)

  const toggleViewLogDrawer = (id: string) => {
    const log = store.logs.find(log => log._id === id)
    if (log) {
      setSelectedLog(log)
    }

    setViewLogOpen(!viewLogOpen)
  }
  const toggleDialogCfDrawer = (id: string) => {
    const log = store.logs.find(log => log._id === id)
    if (log) {
      setSelectedLog(log)
    }

    setDialogCfOpen(!dialogCfOpen)
  }

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchLogs({ dates: dates, action: actionValue }))

    // console.log('date:', dates)
    // console.log('action Value:', actionValue)
  }, [dispatch, dates, actionValue])

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = store.logs.filter(row => {
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

  const handleActionValue = (e: SelectChangeEvent) => {
    setActionValue(e.target.value)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)

    // console.log('start:', new Date(start), 'end:', new Date(end))
  }

  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size='small' onClick={() => toggleViewLogDrawer(row._id)}>
            <Icon icon='bx:show' fontSize={20} />
          </IconButton>
          <Tooltip title='Delete Log'>
            <IconButton size='small' onClick={() => toggleDialogCfDrawer(row._id)}>
              <Icon icon='bx:trash-alt' fontSize={20} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='log-action-select'>Action</InputLabel>
                    <Select
                      fullWidth
                      value={actionValue}
                      sx={{ mr: 4, mb: 2 }}
                      label='Action'
                      onChange={handleActionValue}
                      labelId='log-action-select'
                    >
                      <MenuItem value=''>None</MenuItem>
                      <MenuItem value='edit'>Rename</MenuItem>
                      <MenuItem value='control'>Control</MenuItem>
                      <MenuItem value='add'>Add</MenuItem>
                      <MenuItem value='delete'>Delete</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Log Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={``} />
            <DataGrid
              autoHeight
              columns={columns}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              slots={{ toolbar: QuickSearchToolbar }}
              onPaginationModelChange={setPaginationModel}
              rows={filteredData.length ? filteredData : store.logs}
              getRowId={row => row._id}
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
      </Grid>
      <ViewLogDrawer open={viewLogOpen} toggle={toggleViewLogDrawer} log={selectedLog} />
      <DialogDeleteLogConfirm open={dialogCfOpen} toggle={toggleDialogCfDrawer} log={selectedLog} />
    </DatePickerWrapper>
  )
}

export default LogListTable
