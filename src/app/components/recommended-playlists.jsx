'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image';
import { Loader2, Music } from 'lucide-react';
import { useState } from 'react';
import { getProxiedImageUrl } from '@/utils/image-utils';

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

export default function RecommendedPlaylists({ playlists = [], isLoading }) {
  const [imageErrors, setImageErrors] = useState({});

  if (!playlists || playlists.length === 0) return null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  return (
    <motion.div
      className="mt-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Recommended Playlists</h2>
      <AnimatePresence>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist, index) => (
            <motion.div
              key={index}
              className="bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 transition-colors duration-200"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="relative w-full h-40 bg-purple-900/50">
                {imageErrors[index] ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="h-12 w-12 text-purple-400" />
                  </div>
                ) : (
                  <Image
                    src={getProxiedImageUrl(playlist.image)}
                    alt={playlist.name}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{playlist.name}</h3>
                <p className="text-sm text-purple-200 line-clamp-2">{playlist.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

