import axios from 'axios'

const URL = 'http://localhost:5000/devices'

export const getDevices = async () => {
  try {
    const response = await axios.get(URL)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getActiveDevices = async () => {
  try {
    const response = await axios.get(`${URL}/activeDevices`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateDevice = async (id: string, updatedDevice: any) => {
  try {
    const response = await axios.patch(`${URL}/${id}`, updatedDevice)
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteDevice = async (id: string) => {
  try {
    const response = await axios.delete(`${URL}/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
