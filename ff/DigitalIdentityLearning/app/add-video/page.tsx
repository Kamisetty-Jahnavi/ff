'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddVideo() {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [chapter, setChapter] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, url, chapter }),
    })

    if (response.ok) {
      router.push('/teacher-dashboard')
    } else {
      alert('Failed to add video. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="url" className="block mb-1">YouTube URL:</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="chapter" className="block mb-1">Chapter:</label>
          <input
            type="text"
            id="chapter"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Video
        </button>
      </form>
    </div>
  )
}

