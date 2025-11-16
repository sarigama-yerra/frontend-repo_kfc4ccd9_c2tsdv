import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import SeasonExplorer from './components/SeasonExplorer'
import RaceInspector from './components/RaceInspector'
import TelemetryViewer from './components/TelemetryViewer'

function App() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onHash = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <SeasonExplorer />
      <RaceInspector />
      <TelemetryViewer />
      <footer className="py-10 text-center text-xs text-gray-500">Built with FastAPI + Fast-F1 • Demo</footer>
    </div>
  )
}

export default App
