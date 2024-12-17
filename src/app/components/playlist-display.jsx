'use client'

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2, Music, Play, Pause, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getProxiedImageUrl } from '@/utils/image-utils';
import { Button } from "@/components/ui/button"

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

export default function PlaylistDisplay({ playlist = [], playlistInfo, isLoading }) {
  const [imageErrors, setImageErrors] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = typeof Audio !== 'undefined' ? new Audio() : null;
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!playlist || playlist.length === 0) return null;

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const togglePlay = (previewUrl, index) => {
    if (currentlyPlaying === index) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setCurrentlyPlaying(index);
    }
  };

  return (
    <motion.div
      className="mt-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Generated Playlist</h2>
      {playlistInfo && (
        <div className="mb-4 text-center">
          <h3 className="text-xl font-medium">{playlistInfo.name}</h3>
          <p className="text-sm text-gray-300">{playlistInfo.description}</p>
          <Button
            variant="link"
            onClick={() => window.open(playlistInfo.spotifyUrl, '_blank')}
            className="mt-2 text-green-400 hover:text-green-300"
          >
            Open in Spotify <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
      <AnimatePresence>
        <ul className="space-y-4">
          {playlist.map((song, index) => (
            <motion.li
              key={index}
              className="bg-white/10 p-4 rounded-lg flex items-center space-x-4"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3 }}
            >
              <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden bg-purple-900/50">
                {imageErrors[index] ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="h-8 w-8 text-purple-400" />
                  </div>
                ) : (
                  <Image
                    src={getProxiedImageUrl(song.albumArt)}
                    alt={`${song.title} album art`}
                    fill
                    className="object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-lg">{song.title}</h3>
                <p className="text-sm text-gray-300">{song.artist}</p>
              </div>
              <div className="flex items-center space-x-2">
                {song.previewUrl && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => togglePlay(song.previewUrl, index)}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    {currentlyPlaying === index ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => window.open(song.spotifyUrl, '_blank')}
                  className="text-green-400 hover:text-green-300"
                >
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </div>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
    </motion.div>
  );
}

