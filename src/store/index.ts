// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import device from 'src/store/device'
import log from 'src/store/log'

export const store = configureStore({
  reducer: {
    device,
    log
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
