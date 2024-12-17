import MusicPlaylistGenerator from './components/music-playlist-generator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-700 to-indigo-900 text-white">
      <MusicPlaylistGenerator />
    </main>
  )
}

