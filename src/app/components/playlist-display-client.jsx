'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Music } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PlaylistDisplayClient({ playlist }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  if (playlist.length === 0) return null

  const togglePlay = (index) => {
    if (currentlyPlaying === index) {
      audioRef.current.pause()
      setCurrentlyPlaying(null)
    } else {
      if (currentlyPlaying !== null) {
        audioRef.current.pause()
      }
      audioRef.current.src = playlist[index].preview_url
      audioRef.current.play()
      setCurrentlyPlaying(index)
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
        {playlist.map((song, index) => (
          <motion.li
            key={index}
            className="bg-gray-700/50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-600/50 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div className="flex-grow">
              <h3 className="font-medium text-lg text-white">{song.name}</h3>
              <p className="text-sm text-gray-300">{song.artists[0].name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => togglePlay(index)}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-800/50"
              disabled={!song.preview_url}
            >
              {currentlyPlaying === index ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

