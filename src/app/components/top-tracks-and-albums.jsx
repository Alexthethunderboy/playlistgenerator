'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function TopTracksAndAlbums({ data }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)

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

  if (!data) return null

  return (
    <motion.div
      className="mt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">Top Tracks and Albums</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-4">Top Tracks</h3>
          <ul className="space-y-4">
            {data.top_tracks.map((track) => (
              <li key={track.id} className="flex items-center space-x-4 bg-gray-700/50 p-4 rounded-lg">
                <img src={track.image} alt={track.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-grow">
                  <h4 className="font-medium">{track.name}</h4>
                  <p className="text-sm text-gray-300">{track.artist}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => togglePlay(track)}
                  disabled={!track.preview_url}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {currentlyPlaying && currentlyPlaying.id === track.id ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <span className="text-sm text-gray-400">{track.popularity} popularity</span>
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h3 className="text-2xl font-semibold mb-4">Top Albums</h3>
          <ul className="space-y-4">
            {data.top_albums.map((album) => (
              <li key={album.id} className="flex items-center space-x-4 bg-gray-700/50 p-4 rounded-lg">
                <img src={album.image} alt={album.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h4 className="font-medium">{album.name}</h4>
                  <p className="text-sm text-gray-300">{album.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}

