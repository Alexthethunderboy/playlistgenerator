'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RefreshCw } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { Button } from '@/components/ui/button'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export default function SpotifyCharts() {
  const [chartData, setChartData] = useState({ songs: [], artists: [], albums: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/api/spotify-charts`)
      if (!response.ok) {
        throw new Error('Failed to fetch chart data')
      }
      const data = await response.json()
      setChartData(data)
    } catch (error) {
      console.error('Error fetching chart data:', error)
      setError('Failed to fetch chart data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderChart = (items, type) => (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-[50px_1fr_150px] gap-4 items-center w-full hover:bg-gray-800/50 p-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold">{item.position}</span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src={item.imageUrl || '/placeholder.svg?height=48&width=48'}
              alt={item.name || item.title || 'Chart item'}
              className="w-12 h-12 rounded"
            />
            <div>
              <p className="font-medium">{item.name || item.title || 'Unknown'}</p>
              {type !== 'artists' && <p className="text-sm text-gray-400">{item.artist || 'Unknown Artist'}</p>}
            </div>
          </div>
          <span>
            {type === 'artists' 
              ? (item.followers?.toLocaleString() ?? 'N/A')
              : (item.streams?.toLocaleString() ?? 'N/A')}
          </span>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Spotify Charts</h2>
        <Button onClick={fetchChartData} className="bg-purple-600 hover:bg-purple-700">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <ClipLoader size={50} color="#ffffff" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchChartData} className="bg-purple-600 hover:bg-purple-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="songs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 rounded-lg p-1">
            <TabsTrigger value="songs">New Releases</TabsTrigger>
            <TabsTrigger value="artists">Top Artists</TabsTrigger>
            <TabsTrigger value="albums">Top Albums</TabsTrigger>
          </TabsList>
          <TabsContent value="songs">{renderChart(chartData.songs, 'songs')}</TabsContent>
          <TabsContent value="artists">{renderChart(chartData.artists, 'artists')}</TabsContent>
          <TabsContent value="albums">{renderChart(chartData.albums, 'albums')}</TabsContent>
        </Tabs>
      )}
    </div>
  )
}

