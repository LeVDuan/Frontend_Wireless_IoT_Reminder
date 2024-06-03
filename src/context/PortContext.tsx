// context/PortContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface PortContextProps {
  port: SerialPort | null
  setPort: React.Dispatch<React.SetStateAction<SerialPort | null>>
  writer: WritableStreamDefaultWriter | null
  setWriter: React.Dispatch<React.SetStateAction<WritableStreamDefaultWriter | null>>
  reader: ReadableStreamDefaultReader | null
  setReader: React.Dispatch<React.SetStateAction<ReadableStreamDefaultReader | null>>
  requestOpenPort: () => Promise<void>
  sendToPort: (message: string) => Promise<void>
  readFromPort: () => Promise<string>
}

type Props = {
  children: ReactNode
}

// Tạo Context
export const PortContext = createContext<PortContextProps | undefined>(undefined)

// Tạo Provider
export const PortProvider = ({ children }: Props) => {
  const [port, setPort] = useState<SerialPort | null>(null)
  const [writer, setWriter] = useState<WritableStreamDefaultWriter | null>(null)
  const [reader, setReader] = useState<ReadableStreamDefaultReader | null>(null)

  const requestOpenPort = async () => {
    // USB\VID_1A86&PID_7523&REV_8133
    const filters = [{ usbVendorId: 0x1a86, usbProductId: 0x7523 }]
    const newPort = await navigator.serial.requestPort({ filters })
    if (newPort != port) {
      await newPort.open({ baudRate: 9600 })
      setPort(newPort)
      const writer = newPort.writable.getWriter()
      const reader = newPort.readable.getReader()
      setWriter(writer)
      setReader(reader)
    }
    console.log('COM info: ', newPort.getInfo())
  }

  const sendToPort = async (message: string) => {
    await writer?.write(new TextEncoder().encode(message))
  }

  const readFromPort = async (): Promise<string> => {
    if (reader) {
      const { value } = await reader?.read()
      const data = new TextDecoder().decode(value)

      return data
    } else {
      return 'err: reader undefine'
    }
  }

  return (
    <PortContext.Provider
      value={{ port, setPort, writer, setWriter, reader, setReader, requestOpenPort, sendToPort, readFromPort }}
    >
      {children}
    </PortContext.Provider>
  )
}

export const usePort = () => {
  const context = useContext(PortContext)
  if (context === undefined) {
    throw new Error('usePort must be used within a PortProvider')
  }

  return context
}
