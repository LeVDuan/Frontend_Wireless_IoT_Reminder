// context/PortContext.tsx
import { createContext, useContext, useState } from 'react'

interface PortContextProps {
  port: SerialPort | null
  setPort: React.Dispatch<React.SetStateAction<SerialPort | null>>
  connect: () => Promise<void>
  sendMessage: (message: string) => Promise<void>
}

// Tạo Context
export const PortContext = createContext<PortContextProps | undefined>(undefined)

// Tạo Provider
export const PortProvider: React.FC = ({ children }) => {
  const [port, setPort] = useState<SerialPort | null>(null)

  const connect = async () => {
    if (port) {
      console.log('Already connected!')
      return
    }

    try {
      const newPort = await navigator.serial.requestPort()
      await newPort.open({ baudRate: 9600 })
      setPort(newPort)
      console.log('COM infor: ', newPort.getInfo())
    } catch (err) {
      console.error('Có lỗi xảy ra:', err)
    }
  }
  const sendMessage = async (message: string) => {
    if (!port || !port.writable) {
      console.log('Can not send to COM port!')
      return
    }
    const writer = port.writable.getWriter()
    await writer.write(new TextEncoder().encode(message))
    writer.releaseLock()
  }
  return <PortContext.Provider value={{ port, setPort, connect, sendMessage }}>{children}</PortContext.Provider>
}

// Hook tùy chỉnh để sử dụng Context
export const usePort = () => {
  const context = useContext(PortContext)
  if (context === undefined) {
    throw new Error('usePort must be used within a PortProvider')
  }
  return context
}
