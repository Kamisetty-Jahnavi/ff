'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export function useSocket() {
  return useContext(SocketContext)
}

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketIo = io('/api/socketio')

    setSocket(socketIo)

    return () => {
      socketIo.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

