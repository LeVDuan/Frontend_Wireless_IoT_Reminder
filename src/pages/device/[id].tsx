// ** Next Import
import { useRouter } from 'next/router'

// ** Demo Components Imports
import View from 'src/views/device/View'

const DeviceView = () => {
  const router = useRouter()
  const id = router.query.id

  if (!id) {
    return null
  }

  return <View id={id as string} />
}

export default DeviceView
