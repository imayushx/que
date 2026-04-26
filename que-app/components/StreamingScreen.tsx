'use client'
import { useEffect, useState } from 'react'
import { getWatchProviders, getMovieDetails, getMovieCredits, IMG_BASE } from '@/lib/tmdb'

const PROVIDER_COLORS: Record<string, string> = {
  'Netflix': '#e50914', 'Amazon Prime Video': '#00a8e1', 'Disney+ Hotstar': '#113ccf',
  'Apple TV+': '#555', 'Zee5': '#8c00e1', 'JioCinema': '#7b2fff', 'SonyLIV': '#2175d9', 'Mubi': '#c0392b',
}

export default function StreamingScreen({ movie, onBack }: { movie: any; onBack: () => void }) {
  const [providers, setProviders] = useState<any[]>([])
  const [rent, setRent] = useState<any[]>([])
  const [details, setDetails] = useState<any>(null)
  const [cast, setCast] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!movie) return
    Promise.all([getWatchProviders(movie.id), getMovieDetails(movie.id), getMovieCredits(movie.id)]).then(([p, d, c]) => {
      setProviders(p.results?.IN?.flatrate || p.results?.IN?.free || [])
      setRent(p.results?.IN?.rent || [])
      setDetails(d)
      setCast((c.cast || []).slice(0, 8))
      setLoading(false)
    })
  }, [movie])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.2rem', padding: '0.25rem' }}>←</button>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1rem', fontWeight: 700 }}>{movie?.title}</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.25rem 5rem' }}>
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner" /></div> : <>
          {providers.length > 0 ? <>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>STREAMING NOW</div>
            {providers.map((p: any) => (
              <div key={p.provider_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem', background: 'var(--surface)', borderRadius: 8, marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: PROVIDER_COLORS[p.provider_name] || 'var(--accent)', flexShrink: 0 }} />
                <div style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{p.provider_name}</div>
                <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>Open →</div>
              </div>
            ))}
          </> : <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)', fontSize: '0.9rem' }}>Not available for streaming in India right now.</div>}
          {rent.length > 0 && <>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', margin: '1.25rem 0 0.75rem' }}>RENT / BUY</div>
            {rent.map((p: any) => (
              <div key={p.provider_id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem', background: 'var(--surface)', borderRadius: 8, marginBottom: '0.5rem', border: '1px solid var(--border)' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#888', flexShrink: 0 }} />
                <div style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem' }}>{p.provider_name}</div>
                <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>₹ →</div>
              </div>
            ))}
          </>}
          {details?.overview && <>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', margin: '1.5rem 0 0.5rem' }}>ABOUT</div>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#bbb' }}>{details.overview}</div>
          </>}
          {cast.length > 0 && <>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', margin: '1.5rem 0 0.5rem' }}>CAST</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {cast.map((a: any) => <span key={a.id} style={{ padding: '0.3rem 0.75rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.75rem' }}>{a.name}</span>)}
            </div>
          </>}
        </>}
      </div>
    </div>
  )
}