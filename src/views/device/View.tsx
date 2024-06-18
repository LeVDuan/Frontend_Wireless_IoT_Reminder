import { Alert, Grid } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { DeviceType } from 'src/@core/utils/types'
import DeviceViewLeft from './DeviceViewLeft'
import DeviceViewRight from './DeviceViewRight'

interface DeviceViewProps {
  id: string | undefined
}

const DeviceView = ({ id }: DeviceViewProps) => {
  console.log(id)

  const [error, setError] = useState<boolean>(false)
  const [data, setData] = useState<null | DeviceType>(null)
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/devices/device`, { params: { deviceId: id } })
      .then(res => {
        setData(res.data.device[0])
        setError(false)
      })
      .catch(() => {
        setData(null)
        setError(true)
      })
  }, [data, id])
  console.log('res:', data)

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12} md={5} lg={4}>
          <DeviceViewLeft deviceData={data} />
        </Grid>
        <Grid item xs={12} md={7} lg={8}>
          <DeviceViewRight deviceData={data} />
        </Grid>
      </Grid>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Device with the id: {id} does not exist. Please check the list of device:{' '}
            <Link href='/device-list'>Device List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default DeviceView
