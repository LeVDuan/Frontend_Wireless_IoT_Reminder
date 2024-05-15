// context/PortContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface PortContextProps {
  port: SerialPort | null
  setPort: React.Dispatch<React.SetStateAction<SerialPort | null>>
  requestOpenPort: () => Promise<void>
  sendToPort: (message: string) => Promise<void>
}

type Props = {
  children: ReactNode
}

// Tạo Context
export const PortContext = createContext<PortContextProps | undefined>(undefined)

// Tạo Provider
export const PortProvider = ({ children }: Props) => {
  const [port, setPort] = useState<SerialPort | null>(null)

  const requestOpenPort = async () => {
    const newPort = await navigator.serial.requestPort()
    await newPort.open({ baudRate: 9600 })
    setPort(newPort)
    console.log('COM info: ', newPort.getInfo())
  }
  const sendToPort = async (message: string) => {
    const writer = port.writable.getWriter()
    await writer.write(new TextEncoder().encode(message))
    writer.releaseLock()
  }

  return <PortContext.Provider value={{ port, setPort, requestOpenPort, sendToPort }}>{children}</PortContext.Provider>
}

export const usePort = () => {
  const context = useContext(PortContext)
  if (context === undefined) {
    throw new Error('usePort must be used within a PortProvider')
  }

  return context
}
