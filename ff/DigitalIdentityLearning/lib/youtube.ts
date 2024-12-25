import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

export async function getVideoDetails(videoId: string) {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      id: [videoId],
    })

    if (response.data.items && response.data.items.length > 0) {
      const video = response.data.items[0]
      return {
        title: video.snippet?.title,
        description: video.snippet?.description,
        duration: video.contentDetails?.duration,
        thumbnailUrl: video.snippet?.thumbnails?.default?.url,
      }
    } else {
      throw new Error('Video not found')
    }
  } catch (error) {
    console.error('Error fetching video details:', error)
    throw error
  }
}

