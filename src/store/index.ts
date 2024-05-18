// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import device from 'src/store/device'

export const store = configureStore({
  reducer: {
    device
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
