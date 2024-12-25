'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/components/SocketProvider'

export default function StudentDashboard() {
  const [tasks, setTasks] = useState([])
  const [videos, setVideos] = useState([])
  const [csrfToken, setCsrfToken] = useState('')
  const [username, setUsername] = useState('')
  const socket = useSocket()
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUsername(data.username)
      } else {
        router.push('/login')
      }
    }

    fetchUserData()
    fetchCSRFToken()
    fetchTasks()
    fetchVideos()

    if (socket) {
      socket.emit('join-room', `user_${getUserId()}`)

      socket.on('new-task', (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks])
      })

      socket.on('update-task', (updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        )
      })

      return () => {
        socket.off('new-task')
        socket.off('update-task')
      }
    }
  }, [router, socket])

  const fetchCSRFToken = async () => {
    const response = await fetch('/api/csrf')
    if (response.ok) {
      const data = await response.json()
      setCsrfToken(data.csrfToken)
    }
  }

  const fetchTasks = async () => {
    const response = await fetch('/api/tasks')
    if (response.ok) {
      const data = await response.json()
      setTasks(data)
    }
  }

  const fetchVideos = async () => {
    const response = await fetch('/api/videos')
    if (response.ok) {
      const data = await response.json()
      setVideos(data)
    }
  }

  const toggleTaskCompletion = async (taskId, completed) => {
    const response = await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ id: taskId, completed: !completed }),
    })

    if (response.ok) {
      const updatedTask = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
    }
  }

  const markVideoAsWatched = async (videoId) => {
    const response = await fetch('/api/video-watches', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ videoId }),
    })

    if (response.ok) {
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, watched: true } : video
        )
      )
    }
  }

  const getUserId = () => {
    // This should be implemented to get the current user's ID from the authentication context
    // For now, we'll return a placeholder value
    return 1
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <p>Welcome, {username}!</p>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">To-Do List</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id, task.completed)}
                className="mr-2"
              />
              <span className={task.completed ? 'line-through' : ''}>{task.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Video Content</h2>
        <ul>
          {videos.map((video) => (
            <li key={video.id} className="mb-2">
              <span>{video.title} - Chapter: {video.chapter}</span>
              {!video.watched && (
                <button
                  onClick={() => markVideoAsWatched(video.id)}
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm"
                >
                  Mark as Watched
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

