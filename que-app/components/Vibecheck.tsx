'use client'
import { useEffect, useState, useRef } from 'react'
import { getVibeMovies, IMG_BASE } from '@/lib/tmdb'
import { store } from '@/lib/storage'

export default function VibeCheck({ onDone }: { onDone: (profile: Record<number, number>) => void }) {
  const [movies, setMovies] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [profile, setProfile] = useState<Record<number, number>>({})
  const [hint, setHint] = useState<'watch' | 'skip' | 'love' | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragStart = useRef<{ x: number; y: number } | null>(null)
  const isDragging = useRef(false)

  useEffect(() => { getVibeMovies().then(setMovies) }, [])

  const swipe = (dir: 'left' | 'right' | 'up', prof = profile) => {
    const movie = movies[index]
    if (!movie) return
    const score = dir === 'up' ? 3 : dir === 'right' ? 1 : -2
    const newProf = { ...prof }
    for (const g of movie.genre_ids || []) newProf[g] = (newProf[g] || 0) + score
    const swipes = store('swipes') || []
    swipes.push({ movie_id: movie.id, swipe: dir })
    store('swipes', swipes)
    setProfile(newProf)
    setHint(null)
    setOffset({ x: 0, y: 0 })
    if (index + 1 >= movies.length) { store('taste_profile', newProf); onDone(newProf) }
    else setIndex(i => i + 1)
  }

  const onMouseDown = (e: React.MouseEvent) => { dragStart.current = { x: e.clientX, y: e.clientY }; isDragging.current = true }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !dragStart.current) return
    const dx = e.clientX - dragStart.current.x, dy = e.clientY - dragStart.current.y
    setOffset({ x: dx, y: dy })
    if (dy < -60 && Math.abs(dx) < 60) setHint('love')
    else if (dx > 50) setHint('watch')
    else if (dx < -50) setHint('skip')
    else setHint(null)
  }
  const onMouseUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (offset.y < -80 && Math.abs(offset.x) < 80) swipe('up')
    else if (offset.x > 80) swipe('right')
    else if (offset.x < -80) swipe('left')
    else setOffset({ x: 0, y: 0 })
  }
  const onTouchStart = (e: React.TouchEvent) => { const t = e.touches[0]; dragStart.current = { x: t.clientX, y: t.clientY }; isDragging.current = true }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragStart.current) return
    const t = e.touches[0], dx = t.clientX - dragStart.current.x, dy = t.clientY - dragStart.current.y
    setOffset({ x: dx, y: dy })
    if (dy < -60 && Math.abs(dx) < 60) setHint('love')
    else if (dx > 50) setHint('watch')
    else if (dx < -50) setHint('skip')
    else setHint(null)
  }
  const onTouchEnd = () => {
    isDragging.current = false
    if (offset.y < -80 && Math.abs(offset.x) < 80) swipe('up')
    else if (offset.x > 80) swipe('right')
    else if (offset.x < -80) swipe('left')
    else setOffset({ x: 0, y: 0 })
  }

  if (!movies.length) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}><div className="spinner" /><div style={{ fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>LOADING PICKS</div></div>

  const curr = movies[index]
  const next = movies[index + 1]
  const rot = offset.x * 0.08

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ padding: '1rem 1.5rem 0.5rem' }}>
        <div style={{ height: 2, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{ height: '100%', background: 'var(--accent)', width: `${(index / 10) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{index + 1} / 10</div>
      </div>

      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', overflow: 'hidden' }}>
        {next && (
          <div style={{ position: 'absolute', width: 'calc(100% - 3rem)', borderRadius: 12, overflow: 'hidden', transform: 'scale(0.93) translateY(20px)', zIndex: 9 }}>
            <img src={IMG_BASE + next.poster_path} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} />
          </div>
        )}
        <div
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          style={{ position: 'relative', width: 'calc(100% - 3rem)', borderRadius: 12, overflow: 'hidden', zIndex: 10, cursor: 'grab', userSelect: 'none', transform: `translate(${offset.x}px,${offset.y}px) rotate(${rot}deg)`, transition: isDragging.current ? 'none' : 'transform 0.3s' }}
        >
          <img src={IMG_BASE + curr.poster_path} style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover' }} draggable={false} />
          {hint === 'watch' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,200,100,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 900, color: '#00c864' }}>WATCH</div>}
          {hint === 'skip' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(232,0,29,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>SKIP</div>}
          {hint === 'love' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(232,0,29,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>LOVE ★</div>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 1rem 1rem', background: 'linear-gradient(to top,rgba(0,0,0,0.9),transparent)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700 }}>{curr.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.2rem' }}>{(curr.release_date || '').slice(0, 4)}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '1.25rem 1.5rem 1.5rem', display: 'flex', gap: '0.75rem' }}>
        <button onClick={() => swipe('left')} style={{ flex: 1, padding: '0.85rem', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 8, fontSize: '1.2rem' }}>✕</button>
        <button onClick={() => swipe('up')} style={{ flex: 1, padding: '0.85rem', border: '1px solid var(--accent)', background: 'rgba(232,0,29,0.1)', borderRadius: 8, fontSize: '1.2rem' }}>★</button>
        <button onClick={() => swipe('right')} style={{ flex: 1, padding: '0.85rem', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 8, fontSize: '1.2rem' }}>✓</button>
      </div>
    </div>
  )
}