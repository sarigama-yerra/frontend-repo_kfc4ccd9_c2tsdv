import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SeasonExplorer() {
  const [year, setYear] = useState(2023)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/api/seasons/${year}/events`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setEvents(data.events || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex items-end gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Season</label>
          <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} className="border rounded px-3 py-2 w-32" />
        </div>
        <button onClick={fetchEvents} className="h-10 px-4 rounded bg-black text-white hover:bg-gray-800 transition">Load Events</button>
      </div>

      {loading && <p className="text-gray-600">Loading events...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((ev) => (
          <div key={`${ev.round}-${ev.event_name}`} className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="text-xs text-gray-500">Round {ev.round}</div>
            <div className="font-semibold text-gray-900">{ev.event_name}</div>
            <div className="text-sm text-gray-600">{ev.location} {ev.country ? `• ${ev.country}` : ''}</div>
            <div className="text-xs text-gray-500 mt-1">{ev.event_date}</div>
            <a href={`/?year=${year}&round=${ev.round}#race`} className="inline-block mt-3 text-blue-600 hover:underline">View race</a>
          </div>
        ))}
      </div>
    </section>
  )
}
