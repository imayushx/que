'use client'
import { store } from '@/lib/storage'
import { IMG_BASE } from '@/lib/tmdb'

export default function LockedScreen({ onViewSaved }: { onViewSaved: () => void }) {
  const movie = store('today_rec')
  const now = new Date()
  const reset = new Date(now)
  reset.setDate(reset.getDate() + (now.getHours() < 17 ? 0 : 1))
  reset.setHours(17, 0, 0, 0)
  const diff = Math.max(0, reset.getTime() - now.getTime())
  const h = Math.floor(diff / 3600000), mn = Math.floor((diff % 3600000) / 60000)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', fontFamily: 'var(--font-head)', fontSize: '10rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none' }}>0</div>
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%' }}>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>No more rerolls tonight.</h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>You've used all three.<br />The algorithm has spoken.<br />Come back tomorrow.</p>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '2rem' }}>Resets in {h}h {mn}m</div>
        {movie && (
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: '2rem' }}>
            <img src={IMG_BASE + movie.poster_path} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            <div style={{ padding: '0.75rem 1rem', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem' }}>{movie.title}</div>
          </div>
        )}
        <button style={{ display: 'block', width: '100%', padding: '1rem', background: 'var(--accent)', color: '#fff', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: 4, marginBottom: '0.75rem' }}>Watch It Now →</button>
        <button onClick={onViewSaved} style={{ display: 'block', width: '100%', padding: '1rem', background: 'transparent', color: 'var(--muted)', fontSize: '0.9rem', border: '1px solid var(--border)', borderRadius: 4 }}>View Saved Queue</button>
      </div>
    </div>
  )
}