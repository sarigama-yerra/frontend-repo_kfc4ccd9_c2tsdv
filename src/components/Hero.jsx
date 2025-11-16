import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4Tf9WOIaWs6LOezG/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center bg-gradient-to-b from-black/40 to-black/10 pointer-events-none">
        <div className="text-center text-white px-6 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-md">F1 Data Analytics</h1>
          <p className="mt-4 text-base sm:text-lg opacity-90">Visualize races, lap times, telemetry, tire strategies, and compare drivers in a modern dashboard.</p>
        </div>
      </div>
    </section>
  )
}
