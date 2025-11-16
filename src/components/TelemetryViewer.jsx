import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function TelemetryViewer() {
  const params = new URLSearchParams(window.location.search)
  const initialYear = Number(params.get('year')) || 2023
  const initialRound = Number(params.get('round')) || 1
  const initialDriver = params.get('driver') || 'VER'

  const [year, setYear] = useState(initialYear)
  const [round, setRound] = useState(initialRound)
  const [driver, setDriver] = useState(initialDriver)
  const [lap, setLap] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchTelemetry = async () => {
    setLoading(true)
    setError('')
    try {
      const url = new URL(`${API}/api/seasons/${year}/races/${round}/telemetry`)
      url.searchParams.set('driver', driver)
      if (lap) url.searchParams.set('lap', String(lap))
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const d = await res.json()
      setData(d)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTelemetry() }, [])

  return (
    <section id="telemetry" className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-3 items-end mb-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Year</label>
          <input type="number" value={year} onChange={(e)=>setYear(Number(e.target.value))} className="border rounded px-3 py-2 w-32" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Round</label>
          <input type="number" value={round} onChange={(e)=>setRound(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Driver</label>
          <input value={driver} onChange={(e)=>setDriver(e.target.value.toUpperCase())} className="border rounded px-3 py-2 w-24 uppercase" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Lap (optional)</label>
          <input type="number" value={lap} onChange={(e)=>setLap(e.target.value)} className="border rounded px-3 py-2 w-28" />
        </div>
        <button onClick={fetchTelemetry} className="h-10 px-4 rounded bg-black text-white hover:bg-gray-800 transition">Load Telemetry</button>
        <a href={`/?year=${year}&round=${round}#race`} className="text-blue-600 underline">Back to race</a>
      </div>

      {loading && <p className="text-gray-600">Loading telemetry...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="p-4 border rounded bg-white shadow-sm">
          <h3 className="font-semibold mb-3">{data.driver} • Lap {data.lap}</h3>
          <div className="text-xs text-gray-600 mb-2">Raw telemetry points (for charting in future iterations).</div>
          <pre className="max-h-72 overflow-auto bg-gray-50 p-2 rounded text-xs">{JSON.stringify(data.telemetry?.slice(0, 100), null, 2)}\n... ({data.telemetry?.length} points)</pre>
        </div>
      )}
    </section>
  )
}
