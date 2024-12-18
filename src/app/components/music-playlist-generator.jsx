'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Disc3 } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import PlaylistDisplay from './playlist-display'
import TopTracksAndAlbums from './top-tracks-and-albums'
import RecommendedPlaylists from './recommended-playlists'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BackgroundAnimation from './background-animation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export default function MusicPlaylistGenerator() {
  const [genre, setGenre] = useState('')
  const [playlist, setPlaylist] = useState([])
  const [recommendedPlaylists, setRecommendedPlaylists] = useState([])
  const [topTracksAndAlbums, setTopTracksAndAlbums] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const generatePlaylist = async (e) => {
    e.preventDefault()
    if (!genre) return

    setIsLoading(true)
    setError(null)
    try {
      const playlistResponse = await fetch(`${API_BASE_URL}/api/generate-playlist?genre=${encodeURIComponent(genre)}`)
      const recommendationsResponse = await fetch(`${API_BASE_URL}/api/recommend-playlists?genre=${encodeURIComponent(genre)}`)
      const topTracksResponse = await fetch(`${API_BASE_URL}/api/top-tracks?genre=${encodeURIComponent(genre)}`)
      
      if (!playlistResponse.ok || !recommendationsResponse.ok || !topTracksResponse.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const playlistData = await playlistResponse.json()
      const recommendationsData = await recommendationsResponse.json()
      const topTracksData = await topTracksResponse.json()
      
      setPlaylist(playlistData.playlist)
      setRecommendedPlaylists(recommendationsData.recommended_playlists)
      setTopTracksAndAlbums(topTracksData)
    } catch (error) {
      console.error('Error generating playlist:', error)
      setError('Failed to generate playlist. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white p-8 relative overflow-hidden">
      <BackgroundAnimation />
      <motion.div
        className="text-center mb-12"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Disc3 className="w-20 h-20 mx-auto mb-6 text-purple-400" />
        <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Spotify Playlist Generator</h1>
        <p className="text-xl sm:text-2xl text-purple-200">Discover your next favorite playlist</p>
      </motion.div>
      <motion.div 
        className="max-w-4xl mx-auto space-y-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <form onSubmit={generatePlaylist} className="flex gap-4">
          <Input
            type="text"
            placeholder="Enter a genre, mood, or artist..."
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="flex-grow bg-gray-700 text-white placeholder-gray-400 border-gray-600"
          />
          <Button 
            type="submit" 
            disabled={!genre || isLoading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isLoading ? <ClipLoader size={20} color="#ffffff" /> : <Search className="w-5 h-5 mr-2" />}
            Generate
          </Button>
        </form>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
        <PlaylistDisplay playlist={playlist} />
        <TopTracksAndAlbums data={topTracksAndAlbums} />
        <RecommendedPlaylists playlists={recommendedPlaylists} />
      </motion.div>
    </div>
  )
}

