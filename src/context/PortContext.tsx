// context/PortContext.tsx
import { createContext, useContext, ReactNode } from 'react'

interface PortContextProps {
  selectPort: () => Promise<null | string>
  writeToPort: (cmd: string, setResponse: React.Dispatch<React.SetStateAction<string | null>>) => Promise<void>
}

type Props = {
  children: ReactNode
}

// Create Context
export const PortContext = createContext<PortContextProps | undefined>(undefined)

// Create Provider
export const PortProvider = ({ children }: Props) => {
  let reader: ReadableStreamDefaultReader | ReadableStreamBYOBReader | undefined
  let port: SerialPort | undefined
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const options = { baudRate: 9600 }

  // USB\VID_1A86&PID_7523&REV_8133 -> DOIT ESP32 DEVKIT v1
  const filters = [{ usbVendorId: 0x1a86, usbProductId: 0x7523 }]

  const connectToPort = async () => {
    if (!port) {
      return
    }
    try {
      await port.open(options)
      console.log('Open success!')
    } catch (error: any) {
      console.log('Open error: ', error.message)
      port = undefined
    }
  }

  const selectPort = async () => {
    try {
      const slPort = await navigator.serial.requestPort({ filters })
      if (slPort != port) {
        port = slPort

        await connectToPort()
      }

      // console.log('port', port)

      return null
    } catch (error: any) {
      console.log('requestPort error: ', error.message)

      return error.message
    }
  }

  const writeToPort = async (cmd: string, setResponse: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (port?.writable == null) {
      console.log(`unable to find writable port`)

      return
    }
    const writer = port.writable.getWriter()

    writer.write(encoder.encode(cmd))

    writer.releaseLock()
    if (port && port.readable) {
      try {
        reader = port.readable.getReader()

        // console.log('reader:', reader)

        let receivedData = ''
        while (true) {
          try {
            const { value, done } = await reader.read()
            if (done) break

            receivedData += decoder.decode(value)
            if (receivedData.includes('\n')) {
              const lines = receivedData.split('\n')

              setResponse(lines[0])
              receivedData = lines[1]

              // console.log('response: ', lines[0])

              break
            }
          } catch (error: any) {
            console.log('Error while reading: ', error.message)
          }
        }
        reader.releaseLock()
        reader = undefined
      } catch (error: any) {
        console.log('Reader error: ', error.message)
      }
    }
  }

  const values = {
    selectPort,
    writeToPort
  }

  return <PortContext.Provider value={values}>{children}</PortContext.Provider>
}

export const usePort = () => {
  const context = useContext(PortContext)
  if (context === undefined) {
    throw new Error('usePort must be used within a PortProvider')
  }

  return context
}
