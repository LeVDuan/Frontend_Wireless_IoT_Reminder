// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Component Imports

import AnalyticsVibrates from 'src/views/analytics/AnalyticsVibrates'
import AnalyticsTotalControlLastWeek from 'src/views/analytics/AnalyticsTotalControlLastWeek'
import AnalyticsStatistics from 'src/views/analytics/AnalyticsStatistics'
import AnalyticsTabsWithChart from 'src/views/analytics/AnalyticsTabsWithChart'
import AnalyticsCongratulations from 'src/views/analytics/AnalyticsCongratulations'
import AnalyticsActivityTimeline from 'src/views/analytics/AnalyticsActivityTimeline'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { AnalyticsType } from 'src/@core/utils/types'
import AnalyticsControls from 'src/views/analytics/AnalyticsControls'
import { API_LOGS_URL } from 'src/store/log'

const AnalyticsDashboard = () => {
  const [data, setData] = useState<AnalyticsType | null>(null)

  useEffect(() => {
    const getAnalytics = async () => {
      const res = await axios.get(`${API_LOGS_URL}/analytics`)
      setData(res.data)
    }
    getAnalytics()
  }, [])

  console.log('analytics', data)
  if (data) {
    return (
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={8} sx={{ order: -1 }}>
            <AnalyticsCongratulations />
          </Grid>
          <Grid item xs={12} md={4} sx={{ order: -1 }}>
            <Grid container spacing={6}>
              <Grid item xs={6} md={12} lg={6}>
                <AnalyticsControls data={data} />
              </Grid>
              <Grid item xs={6} md={12} lg={6}>
                <AnalyticsVibrates data={data} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={8}>
            <AnalyticsTotalControlLastWeek data={data} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AnalyticsStatistics data={data} />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <AnalyticsTabsWithChart dataAnalytics={data} />
          </Grid>
          <Grid item xs={12} sm={6} md={6} sx={{ order: [1, 1, 0] }}>
            <AnalyticsActivityTimeline />
          </Grid>
        </Grid>
      </ApexChartWrapper>
    )
  } else {
    return null
  }
}

export default AnalyticsDashboard
