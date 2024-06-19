// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// // ** Third Party Imports
// import axios from 'axios'

// // ** Types
// import { DeviceType } from 'src/@core/utils/types'

// ** Demo Components Imports
import View from 'src/views/device/View'

const DeviceView = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <View id={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/devices`)
  // const data: DeviceType[] = await res.data.devices

  // const paths = data.map((item: DeviceType) => ({
  //   params: { id: `${item.deviceId}` }
  // }))
  const paths = Array.from({ length: 16 }, (_, index) => ({ params: { id: String(index) } }))
  console.log(paths)
  console.log('path', paths)

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id
    }
  }
}

export default DeviceView
