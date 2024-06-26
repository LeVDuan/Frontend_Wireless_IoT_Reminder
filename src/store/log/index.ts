// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports

import axios from 'axios'
import { LogType } from 'src/@core/utils/types'

export const API_LOGS_URL = `${process.env.NEXT_PUBLIC_API_URL}/logs`

interface DataParams {
  dates?: Date[]
  action: string
}

// ** Fetch logs
export const fetchLogs = createAsyncThunk('log/fetchLogs', async (params: DataParams) => {
  try {
    const response = await axios.get(API_LOGS_URL, { params })

    // console.log('logs:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

export const logSlice = createSlice({
  name: 'log',
  initialState: {
    logs: [] as LogType[],
    total: 0
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchLogs.fulfilled, (state, action) => {
      state.logs = action.payload.data.logs
      state.total = action.payload.data.total
    })
  }
})

export default logSlice.reducer
