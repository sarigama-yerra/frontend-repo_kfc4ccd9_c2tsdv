import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function RaceInspector() {
  const params = new URLSearchParams(window.location.search)
  const initialYear = Number(params.get('year')) || 2023
  const initialRound = Number(params.get('round')) || 1

  const [year, setYear] = useState(initialYear)
  const [round, setRound] = useState(initialRound)
  const [drivers, setDrivers] = useState([])
  const [results, setResults] = useState([])
  const [laps, setLaps] = useState([])
  const [positions, setPositions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [dRes, rRes, lRes, pRes] = await Promise.all([
        fetch(`${API}/api/seasons/${year}/races/${round}/drivers`),
        fetch(`${API}/api/seasons/${year}/races/${round}/results`),
        fetch(`${API}/api/seasons/${year}/races/${round}/laps`),
        fetch(`${API}/api/seasons/${year}/races/${round}/position-chart`),
      ])
      if (!dRes.ok || !rRes.ok || !lRes.ok || !pRes.ok) throw new Error('Failed to fetch race data')
      const d = await dRes.json()
      const r = await rRes.json()
      const l = await lRes.json()
      const p = await pRes.json()
      setDrivers(d.drivers || [])
      setResults(r.results || [])
      setLaps(l.laps || [])
      setPositions(p.positions || null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const resultsTable = (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Pos</th>
            <th className="text-left p-2">Driver</th>
            <th className="text-left p-2">Team</th>
            <th className="text-left p-2">Pts</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={`${r.position}-${r.driver}`} className="border-b">
              <td className="p-2">{r.position}</td>
              <td className="p-2 font-medium">{r.driver}</td>
              <td className="p-2">{r.team}</td>
              <td className="p-2">{r.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const lapTimesByDriver = useMemo(() => {
    const map = {}
    laps.forEach((l) => {
      if (!map[l.driver]) map[l.driver] = []
      map[l.driver].push({ x: l.lap_number, y: l.lap_time_ms })
    })
    return map
  }, [laps])

  return (
    <section id="race" className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-3 items-end mb-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Year</label>
          <input type="number" value={year} onChange={(e)=>setYear(Number(e.target.value))} className="border rounded px-3 py-2 w-32" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Round</label>
          <input type="number" value={round} onChange={(e)=>setRound(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
        </div>
        <button onClick={fetchAll} className="h-10 px-4 rounded bg-black text-white hover:bg-gray-800 transition">Load Race</button>
      </div>

      {loading && <p className="text-gray-600">Loading race data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white shadow-sm">
          <h3 className="font-semibold mb-3">Classification</h3>
          {resultsTable}
        </div>

        <div className="p-4 border rounded bg-white shadow-sm">
          <h3 className="font-semibold mb-3">Lap Times (ms)</h3>
          <div className="text-xs text-gray-500 mb-2">Select a driver to fetch telemetry:</div>
          <div className="flex flex-wrap gap-2">
            {drivers.map((d) => (
              <a key={d} href={`/?year=${year}&round=${round}&driver=${d}#telemetry`} className="text-blue-600 text-sm underline">{d}</a>
            ))}
          </div>
          <div className="mt-3 text-xs text-gray-600">
            Showing raw lap time points per driver (for charting in future iterations).
          </div>
          <pre className="mt-3 max-h-48 overflow-auto bg-gray-50 p-2 rounded text-xs">{JSON.stringify(lapTimesByDriver, null, 2)}</pre>
        </div>
      </div>
    </section>
  )
}
