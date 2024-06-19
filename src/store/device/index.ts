// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports

import axios from 'axios'
import { DeviceType } from 'src/@core/utils/types'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/devices`

// ** Fetch devices
export const fetchDevices = createAsyncThunk('device/fetchDevices', async () => {
  try {
    const response = await axios.get(URL)

    // console.log('Devices:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

export const fetchActiveDevices = createAsyncThunk('device/fetchActiveDevices', async () => {
  try {
    const response = await axios.get(`${URL}/activeDevices`)

    console.log('ActiveDevices:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

// export const addDevice = createAsyncThunk(
//   'device/addDevice',
//   async (device: { deviceId: number; name: string }, { dispatch }: any) => {
//     try {
//       const response = await axios.post(`${URL}`, device)

//       await dispatch(fetchDevices())
//       console.log('added res: ', response.data)

//       return response
//     } catch (error) {
//       throw error
//     }
//   }
// )

// export const deleteDevice = createAsyncThunk('device/deleteDevice', async (id: string, { dispatch }: any) => {
//   try {
//     const response = await axios.delete(`${URL}/${id}`)

//     await dispatch(fetchDevices())
//     console.log('deleted res: ', response.data)

//     return response
//   } catch (error) {
//     throw error
//   }
// })

export const updateStatusDevices = createAsyncThunk('device/updateDevices', async (update: any, { dispatch }: any) => {
  try {
    const response = await axios.patch(`${URL}/updateStatus/all`, update)

    await dispatch(fetchActiveDevices())
    console.log('updated res: ', response.data)

    return response
  } catch (error) {
    throw error
  }
})

export const deviceSlice: any = createSlice({
  name: 'device',
  initialState: {
    devices: [] as DeviceType[],
    activeDevices: [] as DeviceType[],
    totalDevices: 0,
    totalActiveDevices: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDevices.fulfilled, (state, action) => {
      state.devices = action.payload.data.devices
      state.totalDevices = action.payload.data.total
    })
    builder.addCase(fetchActiveDevices.fulfilled, (state, action) => {
      state.activeDevices = action.payload.data.devices
      state.totalActiveDevices = action.payload.data.total
    })
  }
})

export default deviceSlice.reducer
