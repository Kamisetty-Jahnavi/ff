import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@/types/next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any
    const io = new SocketIOServer(httpServer, {
      path: '/api/socketio',
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('A user connected')

      socket.on('join-room', (room) => {
        socket.join(room)
      })

      socket.on('leave-room', (room) => {
        socket.leave(room)
      })

      socket.on('disconnect', () => {
        console.log('A user disconnected')
      })
    })
  }
  res.end()
}

