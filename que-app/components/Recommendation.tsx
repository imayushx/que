'use client'
import { useEffect, useState } from 'react'
import { getRecPool, IMG_BASE, GENRE_MAP } from '@/lib/tmdb'
import { store, checkDailyReset } from '@/lib/storage'
import { getVibeSentence } from '@/lib/vibe'
import { checkBadges } from '@/lib/badges'

export default function Recommendation({ tasteProfile, onWatch, onLocked }: { tasteProfile: Record<number, number>; onWatch: (m: any) => void; onLocked: () => void }) {
  const [movie, setMovie] = useState<any>(null)
  const [pool, setPool] = useState<any[]>([])
  const [rerolls, setRerolls] = useState(3)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { rerolls: r, locked } = checkDailyReset()
    setRerolls(r)
    if (locked) { onLocked(); return }
    const saved = store('today_rec')
    if (saved) { setMovie(saved); setLoading(false); return }
    const profile = store('taste_profile') || tasteProfile
    const wall: any[] = store('wall') || []
    const seenIds = new Set<number>(wall.map((m: any) => m.id))
    getRecPool(profile, seenIds).then(p => {
      setPool(p.slice(1))
      const top = p[0]
      setMovie(top)
      store('today_rec', top)
      setLoading(false)
    })
  }, [])

  const doReroll = async () => {
    if (rerolls <= 0) return
    const newR = rerolls - 1
    setRerolls(newR)
    store('rerolls', newR)
    setLoading(true)
    let nextPool = pool
    if (!nextPool.length) {
      const profile = store('taste_profile') || tasteProfile
      const wall: any[] = store('wall') || []
      nextPool = await getRecPool(profile, new Set(wall.map((m: any) => m.id)))
    }
    const next = nextPool[0]
    setPool(nextPool.slice(1))
    setMovie(next)
    store('today_rec', next)
    setLoading(false)
    if (newR === 0) { store('locked', true); onLocked() }
  }

  const saveMovie = () => {
    if (!movie) return
    const saved = store('saved') || []
    if (!saved.find((m: any) => m.id === movie.id)) { store('saved', [...saved, movie]) }
  }

  const commitMovie = () => {
    if (!movie) return
    const wall = store('wall') || []
    if (!wall.find((m: any) => m.id === movie.id)) { store('wall', [...wall, movie]); checkBadges() }
    onWatch(movie)
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner" />
      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>FINDING YOUR MOVIE</div>
    </div>
  )

  if (!movie) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>Couldn't load a recommendation.</div>

  const hour = new Date().getHours()
  const vibe = getVibeSentence(movie.genre_ids || [], hour)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '55vh', flexShrink: 0, overflow: 'hidden' }}>
        <img src={IMG_BASE + movie.poster_path} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%', background: 'linear-gradient(to top,var(--bg),transparent)' }} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', padding: '0.3rem 0.6rem', background: 'var(--accent)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', borderRadius: 3 }}>TONIGHT'S PICK</div>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.3rem 0.6rem', background: 'rgba(0,0,0,0.7)', border: `1px solid ${rerolls === 0 ? 'var(--accent)' : 'var(--border)'}`, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', borderRadius: 3, color: rerolls === 0 ? 'var(--accent)' : 'var(--text)' }}>{rerolls} REROLLS LEFT</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.25rem 5rem', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '2rem', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>{movie.title}</h2>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
          {(movie.release_date || '').slice(0, 4)} &nbsp;·&nbsp; <span style={{ color: 'var(--accent)', fontWeight: 700 }}>★ {(movie.vote_average || 0).toFixed(1)}</span>
        </div>
        <div style={{ fontStyle: 'italic', color: '#888', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>{vibe}</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {(movie.genre_ids || []).slice(0, 4).map((g: number) => (
            <span key={g} style={{ padding: '0.25rem 0.6rem', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.7rem', color: 'var(--muted)' }}>{GENRE_MAP[g]}</span>
          ))}
        </div>
        <button onClick={commitMovie} style={{ display: 'block', width: '100%', padding: '1rem', background: 'var(--accent)', color: '#fff', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: 4, marginBottom: '0.75rem' }}>Watch Tonight →</button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button onClick={doReroll} disabled={rerolls === 0} style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 500, borderRadius: 4, opacity: rerolls === 0 ? 0.3 : 1 }}>↻ Reroll ({rerolls})</button>
          <button onClick={saveMovie} style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 500, borderRadius: 4 }}>⊕ Save</button>
          <button onClick={commitMovie} style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 500, borderRadius: 4 }}>✓ Seen It</button>
          <button onClick={doReroll} style={{ padding: '0.75rem', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: '0.8rem', fontWeight: 500, borderRadius: 4 }}>✕ Not For Me</button>
        </div>
      </div>
    </div>
  )
}