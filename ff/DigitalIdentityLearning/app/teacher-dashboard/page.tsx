'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/components/SocketProvider'

export default function TeacherDashboard() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [students, setStudents] = useState([])
  const [videos, setVideos] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [csrfToken, setCsrfToken] = useState('')
  const [username, setUsername] = useState('') // Added username state
  const router = useRouter()
  const socket = useSocket()

  useEffect(() => {
    fetchCSRFToken()
    fetchTasks()
    fetchStudents()
    fetchVideos()
    fetchAnalytics()
    const fetchUserData = async () => {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setUsername(data.username)
      } else {
        router.push('/login')
      }
    }
    fetchUserData() // Fetch user data on component mount

    if (socket) {
      socket.on('task-completed', (taskId) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task))
        )
      })

      return () => {
        socket.off('task-completed')
      }
    }
  }, [socket, router]) // Added router to the dependency array

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

  const fetchStudents = async () => {
    const response = await fetch('/api/students')
    if (response.ok) {
      const data = await response.json()
      setStudents(data)
    }
  }

  const fetchVideos = async () => {
    const response = await fetch('/api/videos')
    if (response.ok) {
      const data = await response.json()
      setVideos(data)
    }
  }

  const fetchAnalytics = async () => {
    const response = await fetch('/api/analytics')
    if (response.ok) {
      const data = await response.json()
      setAnalytics(data)
    }
  }

  const addTask = async () => {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ title: newTask, assignedTo: null }),
    })

    if (response.ok) {
      setNewTask('')
      fetchTasks()
    }
  }

  const addStudent = () => {
    router.push('/add-student')
  }

  const addVideo = () => {
    router.push('/add-video')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <p>Welcome, {username}!</p> {/* Added welcome message */}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">To-Do List</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
        <div className="mt-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-1 rounded">
            Add Task
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Students</h2>
        <ul>
          {students.map((student) => (
            <li key={student.id}>{student.username}</li>
          ))}
        </ul>
        <button onClick={addStudent} className="bg-green-500 text-white px-4 py-1 rounded mt-2">
          Add Student
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Video Content</h2>
        <ul>
          {videos.map((video) => (
            <li key={video.id}>{video.title} - Chapter: {video.chapter}</li>
          ))}
        </ul>
        <button onClick={addVideo} className="bg-purple-500 text-white px-4 py-1 rounded mt-2">
          Add Video
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Analytics</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Student</th>
              <th className="border p-2">Total Tasks</th>
              <th className="border p-2">Completed Tasks</th>
              <th className="border p-2">Total Videos</th>
              <th className="border p-2">Watched Videos</th>
            </tr>
          </thead>
          <tbody>
            {analytics.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.username}</td>
                <td className="border p-2">{student.total_tasks}</td>
                <td className="border p-2">{student.completed_tasks}</td>
                <td className="border p-2">{student.total_videos}</td>
                <td className="border p-2">{student.watched_videos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

