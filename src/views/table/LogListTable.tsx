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
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import { styled } from '@mui/material/styles'
import { getInitials } from 'src/@core/utils/get-initials'
import format from 'date-fns/format'
import TextField from '@mui/material/TextField'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { DateType } from 'src/types/forms/reactDatepickerTypes'
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

// ** Styled components
const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const logActionObj: LogActionObj = {
  edit: { title: 'Edit', color: 'info', icon: 'bx:edit' },
  add: { title: 'Add', color: 'success', icon: 'gg:add-r' },
  delete: { title: 'Delete', color: 'error', icon: 'bx:trash-alt' },
  control: { title: 'Control', color: 'primary', icon: 'ri:remote-control-line' }
}

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const renderClient = (row: LogType) => {
  if (row.deviceId < 16 && row.deviceId > 0) {
    return <CustomAvatar src={`/images/avatars/${row.deviceId}.png`} sx={{ mr: 3, width: 30, height: 30 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 30, height: 30, fontSize: '.8rem', lineHeight: 1.5 }}
      >
        {getInitials(row.userName)}
      </CustomAvatar>
    )
  }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    field: 'id',
    minWidth: 80,
    headerName: '#ID',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`//activity-history/log/view/${row._id}`}>{`#${row._id}`}</LinkStyled>
    )
  },
  {
    flex: 0.07,
    minWidth: 80,
    field: 'action',
    renderHeader: () => <Icon icon='bx:trending-up' fontSize={20} />,
    renderCell: ({ row }: CellType) => {
      const color = logActionObj[row.action] ? logActionObj[row.action].color : 'primary'
      const icon = logActionObj[row.action].icon

      return (
        <Tooltip
          title={
            <div>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {logActionObj[row.action].title}
              </Typography>
            </div>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: 30, height: 30 }}>
            <Icon fontSize='1rem' icon={icon} />
          </CustomAvatar>
        </Tooltip>
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
          {renderClient(row)}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, color: 'text.secondary' }}>{row.userName}</Typography>
            <Typography noWrap variant='caption' sx={{ color: 'text.disabled' }}>
              {'duan.lv0308@gmail.com'}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'device',
    headerName: 'Device',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
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
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }: CellType) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title='Preview'>
          <IconButton size='small' component={Link} href={`/activity-history/log/view/${row._id}`}>
            <Icon icon='bx:show' fontSize={20} />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete Invoice'>
          <IconButton
            size='small'
            onClick={() => {
              return
            }}
          >
            <Icon icon='bx:trash-alt' fontSize={20} />
          </IconButton>
        </Tooltip>
      </Box>
    )
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
  const [actionValue, setActionValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(fetchLogs({ dates: dates, action: actionValue }))
    console.log('date:', dates)
    console.log('action Value:', actionValue)
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
    console.log('start:', new Date(start), 'end:', new Date(end))
  }

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
                      <MenuItem value='edit'>Edit</MenuItem>
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
            <CardHeader title={`Number of devices in the system: ${store.total} logs.`} />
            <DataGrid
              autoHeight
              columns={defaultColumns}
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              slots={{ toolbar: QuickSearchToolbar }}
              onPaginationModelChange={setPaginationModel}
              rows={filteredData.length ? filteredData : store.logs}
              getRowId={row => row.deviceId}
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
    </DatePickerWrapper>
  )
}

export default LogListTable
