import axios from 'axios'

const URL = 'http://localhost:5000/logs/'

export const getLogs = async () => {
  try {
    const response = await axios.get(URL)

    return response.data
  } catch (error) {
    throw error
  }
}

export const addLogs = async () => {
  try {
    const response = await axios.post(URL)

    return response.data
  } catch (error) {
    throw error
  }
}
