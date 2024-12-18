'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

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

export default function RecommendedPlaylists({ playlists }) {
  if (playlists.length === 0) return null

  return (
    <motion.div
      className="mt-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">Recommended Playlists</h2>
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist, index) => (
          <motion.div
            key={index}
            className="bg-gray-700/50 rounded-lg overflow-hidden hover:bg-gray-600/50 transition-colors duration-200"
            variants={itemVariants}
          >
            <img src={playlist.image_url} alt={playlist.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2 text-white">{playlist.name}</h3>
              <p className="text-sm text-gray-300 line-clamp-2 mb-4">{playlist.description}</p>
              <a 
                href={playlist.spotify_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300"
              >
                Open in Spotify
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

