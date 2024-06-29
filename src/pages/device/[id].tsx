// ** Next Import
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { DeviceStoreType } from 'src/@core/utils/types'
import { AppDispatch, RootState } from 'src/store'
import { fetchDevice } from 'src/store/device'

// ** Demo Components Imports
import View from 'src/views/device/View'

const DeviceView = () => {
  const router = useRouter()
  const id = router.query.id
  const dispatch = useDispatch<AppDispatch>()
  const store: DeviceStoreType = useSelector((state: RootState) => state.device) as DeviceStoreType
  useEffect(() => {
    if (id !== undefined) {
      dispatch(fetchDevice(id as string))
    }
  }, [dispatch, id])

  if (id === undefined) {
    return null
  }
  if (store.device._id) {
    return <View store={store} />
  } else {
    return null
  }
}

export default DeviceView
