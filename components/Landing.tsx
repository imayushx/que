'use client'
import { useEffect, useState } from 'react'
import { getPopular, IMG_BASE } from '@/lib/tmdb'

export default function Landing({ onStart, onSkip }: { onStart: () => void; onSkip: () => void }) {
  const [posters, setPosters] = useState<string[]>([])

  useEffect(() => {
    getPopular().then(d => setPosters((d.results || []).slice(0, 12).filter((m: any) => m.poster_path).map((m: any) => IMG_BASE + m.poster_path)))
  }, [])

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(4,1fr)', gap: 2, opacity: 0.25, filter: 'blur(2px)' }}>
        {posters.map((src, i) => <img key={i} src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)}
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.98) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '2rem 1.5rem 3rem' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.3em', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '2rem' }}>que.</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '1rem', letterSpacing: '-0.02em' }}>One movie.<br />Every night.<br />No excuses.</h1>
        <p style={{ fontSize: '0.95rem', color: '#888', marginBottom: '2.5rem' }}>Stop scrolling. que. picks for you.</p>
        <button onClick={onStart} style={{ display: 'block', width: '100%', padding: '1rem', background: 'var(--accent)', color: '#fff', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: 4, marginBottom: '0.75rem' }}>Start Vibe Check →</button>
        <button onClick={onSkip} style={{ display: 'block', width: '100%', padding: '1rem', background: 'transparent', color: 'var(--muted)', fontSize: '0.9rem', border: '1px solid var(--border)', borderRadius: 4 }}>Skip — just show me something</button>
      </div>
    </div>
  )
}