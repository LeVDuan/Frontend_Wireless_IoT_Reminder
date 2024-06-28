// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports

import axios from 'axios'
import toast from 'react-hot-toast'
import { DeviceType } from 'src/@core/utils/types'

export const API_DEVICES_URL = `${process.env.NEXT_PUBLIC_API_URL}/devices`

// ** Fetch devices
export const fetchDevices = createAsyncThunk('device/fetchDevices', async () => {
  try {
    const response = await axios.get(API_DEVICES_URL)

    // console.log('Devices:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

export const fetchActiveDevices = createAsyncThunk('device/fetchActiveDevices', async () => {
  try {
    const response = await axios.get(`${API_DEVICES_URL}/activeDevices`)

    // console.log('ActiveDevices:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

export const fetchDevice = createAsyncThunk('device/fetchDevice', async (id: string) => {
  try {
    const response = await axios.get(`${API_DEVICES_URL}/${id}`)

    // console.log('Devices:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

export const addDevice = createAsyncThunk(
  'device/addDevice',
  async (device: { deviceId: number; name: string; userName: string }, { dispatch }: any) => {
    try {
      const response = await axios.post(`${API_DEVICES_URL}`, device)

      await dispatch(fetchDevices())

      // console.log('added res: ', response.data)
      toast.success('Successfully!')

      return response
    } catch (error: any) {
      toast.error(error.message as string)
    }
  }
)

export const renameDevice = createAsyncThunk(
  'device/renameDevice',
  async (
    device: { id: string; newInfo: { deviceId: number; oldName: string; newName: string; userName: string } },
    { dispatch }: any
  ) => {
    try {
      const response = await axios.patch(`${API_DEVICES_URL}/${device.id}`, device.newInfo)

      await dispatch(fetchDevices())
      await dispatch(fetchDevice(device.id))

      // console.log('added res: ', response.data)
      toast.success('Successfully!')

      return response
    } catch (error: any) {
      toast.error(error.message as string)
    }
  }
)

export const deleteDevice = createAsyncThunk(
  'device/deleteDevice',
  async (device: { id: string; userName: string }, { dispatch }: any) => {
    try {
      const response = await axios.delete(`${API_DEVICES_URL}/${device.id}`, { data: { userName: device.userName } })

      await dispatch(fetchDevices())

      // console.log('deleted res: ', response.data)
      toast.success('Successfully!')

      return response
    } catch (error: any) {
      toast.error(error.message as string)
    }
  }
)

export const updateStatusDevices = createAsyncThunk(
  'device/updateDevices',
  async (updateInfo: { update: string; many: boolean; id?: string }, { dispatch }: any) => {
    try {
      const response = await axios.patch(`${API_DEVICES_URL}?many=${updateInfo.many}`, { update: updateInfo.update })
      if (updateInfo.many) {
        // console.log('update many')
        await dispatch(fetchActiveDevices())
      } else {
        // console.log('update one')
        await dispatch(fetchDevice(updateInfo.id!))
      }

      // console.log('updated res: ', response.data.message)
      if (response.data.message.includes('success')) {
        return toast.success(response.data.message)
      } else {
        return toast.error(response.data.message)
      }
    } catch (error) {
      throw error
    }
  }
)

export const deviceSlice: any = createSlice({
  name: 'device',
  initialState: {
    devices: [] as DeviceType[],
    activeDevices: [] as DeviceType[],
    totalDevices: 0,
    totalActiveDevices: 0,
    device: {} as DeviceType
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
    builder.addCase(fetchDevice.fulfilled, (state, action) => {
      state.device = action.payload.data.device
    })
  }
})

export default deviceSlice.reducer
