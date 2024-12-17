'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const defaultGenres = [
  'Pop', 'Rock', 'Hip Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical', 'Afrobeats'
];

export default function GenreSelector({ onGenreSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState(defaultGenres);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setGenres([...new Set([searchTerm, ...genres])]);
      onGenreSelect(searchTerm);
      setSearchTerm('');
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="space-y-4"
    >
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search or enter a genre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant="outline"
            onClick={() => onGenreSelect(genre)}
            className="bg-white/10 hover:bg-white/20"
          >
            {genre}
          </Button>
        ))}
      </div>
    </motion.div>
  )
}

