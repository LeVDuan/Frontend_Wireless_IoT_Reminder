// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CustomTimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import { logs } from 'src/@fake-db/table/logs'
import CustomChip from 'src/@core/components/mui/chip'
import Divider from '@mui/material/Divider'
import { getDateFromTimestamp, getTimeFromTimestamp, getDayOfWeekFromTimestamp } from 'src/utils/format'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})

const getControlType = (opcode: string) => {
  if (opcode === 'VBR') return 'Vibration'
  if (opcode === 'LGT') return 'Light up'
  if (opcode === 'VLG') return 'Vibration and light up'
}

const sortedLogs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

const LogsTimeline = () => {
  return (
    <Timeline>
      {sortedLogs.map(log => {
        const getActivities = () => {
          if (log.update) return 'Upate '
          if (log.create) return 'Create '
          if (log.delete) return 'Delete '
        }

        if (log.create || log.delete || log.update) {
          return (
            <TimelineItem key={log.logs_id}>
              <TimelineSeparator>
                <CustomTimelineDot color={log.status as ThemeColor}>
                  {log.update && <Icon icon='dashicons:update-alt' fontSize={20} />}
                  {log.create && <Icon icon='oui:ml-create-single-metric-job' fontSize={20} />}
                  {log.delete && <Icon icon='fluent:delete-32-regular' fontSize={20} />}
                </CustomTimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <CustomChip
                rounded
                size='small'
                label={getActivities() + log.status}
                skin='light'
                sx={{ minWidth: 150 }}
                color={log.status as ThemeColor}
              />

              <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='h6' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    {log.user_name} {getActivities()} device ID {log.des_device_id}
                  </Typography>

                  <Typography variant='body1' sx={{ color: 'text.primary' }}>
                    {getDayOfWeekFromTimestamp(log.time_stamp)}
                  </Typography>
                </Box>
                <Typography variant='body1' sx={{ color: 'text.primary' }}>
                  <span>{getActivities()}</span> <Icon icon='bx:right-arrow-alt' fontSize={20} />{' '}
                  <span>
                    {getActivities()} device ID {log.des_device_id} information in system.
                  </span>
                </Typography>

                <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
                <Box
                  sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {log.update && <Icon icon='dashicons:update-alt' fontSize={20} />}
                    {log.create && <Icon icon='oui:ml-create-single-metric-job' fontSize={20} />}
                    {log.delete && <Icon icon='fluent:delete-32-regular' fontSize={20} />}
                  </Box>
                  <Typography variant='inherit' sx={{ fontWeight: 400 }}>
                    Time stamped:
                    <span> {getDateFromTimestamp(log.time_stamp)}</span>{' '}
                    <span>{getTimeFromTimestamp(log.time_stamp)}</span>
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          )
        } else if (log.control) {
          return (
            <TimelineItem key={log.logs_id}>
              <TimelineSeparator>
                <CustomTimelineDot color={log.status as ThemeColor}>
                  <Icon icon='ri:remote-control-line' fontSize={20} />
                </CustomTimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <CustomChip
                rounded
                size='small'
                label={'Control ' + log.status}
                skin='light'
                sx={{ minWidth: 150 }}
                color={log.status as ThemeColor}
              />

              <TimelineContent sx={{ '& svg': { verticalAlign: 'bottom', mx: 4 } }}>
                <Box
                  sx={{
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant='h6' sx={{ mr: 2, fontWeight: 600, color: 'text.primary' }}>
                    {log.user_name} Control device ID {log.des_device_id}
                  </Typography>

                  <Typography variant='body1' sx={{ color: 'text.primary' }}>
                    {getDayOfWeekFromTimestamp(log.time_stamp)}
                  </Typography>
                </Box>
                <Typography variant='body1' sx={{ color: 'text.primary' }}>
                  <span>Control {getControlType(log.control_type)} device</span>{' '}
                  <Icon icon='bx:right-arrow-alt' fontSize={20} /> <span>In {log.control_time}s </span>
                </Typography>

                <Typography variant='body2' sx={{ color: 'text.primary' }}></Typography>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  {(log.control_type === 'VBR' || log.control_type === 'VLG') && <Icon icon='lucide:vibrate' />}
                  {log.control_type === 'VLG' && <span>&</span>}
                  {(log.control_type === 'LGT' || log.control_type === 'VLG') && <Icon icon='mage:light-bulb' />}
                  <Typography variant='subtitle1' sx={{ ml: 2, fontWeight: 600 }}>
                    <span>{log.period_time}s</span>
                  </Typography>
                  <Icon icon='ph:pause-light' />
                  <Typography variant='subtitle1' sx={{ ml: 2, fontWeight: 600 }}>
                    <span>{log.pause_time}s</span>
                  </Typography>
                </Box>

                <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
                <Box
                  sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between' }}
                >
                  <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                    {(log.control_type === 'VBR' || log.control_type === 'VLG') && <Icon icon='lucide:vibrate' />}
                    {log.control_type === 'VLG' && <span>&</span>}
                    {(log.control_type === 'LGT' || log.control_type === 'VLG') && <Icon icon='mage:light-bulb' />}
                  </Box>
                  <Typography variant='inherit' sx={{ fontWeight: 400 }}>
                    Time stamped:
                    <span> {getDateFromTimestamp(log.time_stamp)}</span>{' '}
                    <span>{getTimeFromTimestamp(log.time_stamp)}</span>
                  </Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          )
        }
      })}
    </Timeline>
  )
}

export default LogsTimeline
