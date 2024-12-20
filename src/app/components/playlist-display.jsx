'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PlaylistDisplay({ playlist }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)

  useEffect(() => {
    return () => {
      if (currentlyPlaying) {
        currentlyPlaying.audio.pause()
      }
    }
  }, [])

  if (playlist.length === 0) return null

  const togglePlay = (track) => {
    if (currentlyPlaying && currentlyPlaying.id === track.id) {
      currentlyPlaying.audio.pause()
      setCurrentlyPlaying(null)
    } else {
      if (currentlyPlaying) {
        currentlyPlaying.audio.pause()
      }
      const audio = new Audio(track.preview_url)
      audio.play()
      setCurrentlyPlaying({ id: track.id, audio })
    }
  }

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">Your Curated Playlist</h2>
      <ul className="space-y-4">
        {playlist.map((song) => (
          <motion.li
            key={song.id}
            className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-600/50 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img src={song.album.images[0]?.url} alt={song.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-grow">
              <h3 className="font-medium text-lg text-white">{song.name}</h3>
              <p className="text-sm text-gray-300">{song.artists[0].name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePlay(song)}
              disabled={!song.preview_url}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-800/50"
            >
              {currentlyPlaying && currentlyPlaying.id === song.id ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

