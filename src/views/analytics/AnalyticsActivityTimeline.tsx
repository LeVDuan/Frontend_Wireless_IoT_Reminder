// ** MUI Import
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline, { TimelineProps } from '@mui/lab/Timeline'
import Icon from 'src/@core/components/icon'

// ** Custom Components Import
import OptionsMenu from 'src/@core/components/option-menu'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { DetailsControl, DetailsEdit, LogType } from 'src/@core/utils/types'
import { ThemeColor } from 'src/@core/layouts/types'
import Link from 'next/link'
import { timeDifference } from 'src/utils'
import { API_LOGS_URL } from 'src/store/log'
import { useAuth } from 'src/hooks/useAuth'

interface ColorAction {
  [key: string]: {
    title: string
    color: ThemeColor
  }
}

const colorAction: ColorAction = {
  edit: { title: 'Rename', color: 'warning' },
  add: { title: 'Add', color: 'secondary' },
  delete: { title: 'Delete', color: 'error' },
  VBR: { title: 'Vibrate', color: 'primary' },
  LGT: { title: 'Light up', color: 'success' },
  VLG: { title: 'Vibrate & light up', color: 'info' }
}

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

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  mb: 2
}))

const AnalyticsActivityTimeline = () => {
  const [recentHistory, setRecentHistory] = useState<LogType[]>([])
  const { user } = useAuth()

  useEffect(() => {
    axios
      .get(`${API_LOGS_URL}/recentActivity`)
      .then(res => {
        setRecentHistory(res.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  // console.log('logs:', recentHistory)

  return (
    <Card>
      <CardHeader
        title='Recent activity'
        action={<OptionsMenu iconButtonProps={{ size: 'small' }} options={['Share timeline']} />}
      />
      <CardContent sx={{ pb: theme => `${theme.spacing(3.75)} !important` }}>
        <Timeline sx={{ my: 0, py: 0 }}>
          {recentHistory.map(log => {
            if (log.action === 'edit') {
              const logAction = colorAction[log.action]
              const editDetails = log.details as DetailsEdit

              return (
                <TimelineItem key={log._id} sx={{ minHeight: 0 }}>
                  <TimelineSeparator>
                    <TimelineDot color={logAction.color} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(0)} !important` }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>
                        {log.userName} {logAction.title.toLowerCase()} {log.deviceName}
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {timeDifference(log.timestamp)}
                      </Typography>
                    </Box>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                      <span>{editDetails.oldName}</span> <Icon icon='bx:right-arrow-alt' fontSize={20} />{' '}
                      <span>{editDetails.newName}</span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src='/images/avatars/DuanLV.jpg' sx={{ mr: 2.25, width: 38, height: 38 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500 }}>{log.userName}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              )
            } else if (log.action === 'add' || log.action === 'delete') {
              const logAction = colorAction[log.action]

              return (
                <TimelineItem key={log._id} sx={{ minHeight: 0 }}>
                  <TimelineSeparator>
                    <TimelineDot color={logAction.color} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(0)} !important` }}>
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>
                        {log.userName} {logAction.title.toLowerCase()} {log.deviceName}
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {timeDifference(log.timestamp)}
                      </Typography>
                    </Box>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                      <span>{logAction.title + 'ed'}: </span>
                      <span>{log.deviceName}</span> <span>(#{log.deviceId})</span>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src='/images/avatars/DuanLV.jpg' sx={{ mr: 2.25, width: 38, height: 38 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500 }}>{log.userName}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              )
            } else if (log.action === 'control') {
              const details = log.details as DetailsControl
              const logAction = colorAction[details.type]

              return (
                <TimelineItem key={log._id} sx={{ minHeight: 0 }}>
                  <TimelineSeparator>
                    <TimelineDot color={logAction.color} />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent sx={{ mt: 0, mb: theme => `${theme.spacing(0)} !important` }}>
                    <Box
                      sx={{
                        mb: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Typography sx={{ mr: 2, fontWeight: 500 }}>
                        {log.userName} {logAction.title.toLowerCase()} {log.deviceName}
                      </Typography>
                      <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                        {timeDifference(log.timestamp)}
                      </Typography>
                    </Box>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                      {logAction.title} in {details.controlTime} seconds.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src='/images/avatars/DuanLV.jpg' sx={{ mr: 2.25, width: 38, height: 38 }} />
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500 }}>{log.userName}</Typography>
                        <Typography sx={{ color: 'text.secondary' }}>{user?.email}</Typography>
                      </Box>
                    </Box>
                  </TimelineContent>
                </TimelineItem>
              )
            }
          })}
          <TimelineItem sx={{ minHeight: 0 }}>
            <TimelineContent sx={{ mt: 0 }}>
              <Box
                sx={{
                  mb: 1,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  ...
                </Typography>
                <LinkStyled href='/activity-history/'>All history</LinkStyled>
              </Box>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </CardContent>
    </Card>
  )
}

export default AnalyticsActivityTimeline
