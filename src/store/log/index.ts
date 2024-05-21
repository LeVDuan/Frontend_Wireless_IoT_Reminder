// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports

import axios from 'axios'
import { LogType } from 'src/@core/utils/types'

const URL = 'http://localhost:5000/logs'

// ** Fetch logs
export const fetchLogs = createAsyncThunk('log/fetchLogs', async () => {
  try {
    const response = await axios.get(URL)

    // console.log('logs:', response.data)

    return response
  } catch (error) {
    throw error
  }
})

//* Add logs
export const addLogs = createAsyncThunk('log/addLogs', async (newLogs: any, { dispatch }: any) => {
  try {
    const response = await axios.post(URL, newLogs)

    dispatch(fetchLogs())

    // console.log('added res: ', response.data)

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
