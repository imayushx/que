'use client'
import { useState } from 'react'
import { store } from '@/lib/storage'
import { IMG_BASE } from '@/lib/tmdb'

export default function SavedQueue() {
  const [saved, setSaved] = useState<any[]>(store('saved') || [])

  const remove = (id: number) => {
    const updated = saved.filter(m => m.id !== id)
    store('saved', updated)
    setSaved(updated)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.05em' }}>SAVED.</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem 5rem' }}>
        {!saved.length ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--muted)' }}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Nothing saved yet.</div>
            Save movies to watch later.
          </div>
        ) : saved.map(m => (
          <div key={m.id} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 52, height: 78, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
              <img src={IMG_BASE + m.poster_path} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>{m.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{(m.release_date || '').slice(0, 4)} · ★ {(m.vote_average || 0).toFixed(1)}</div>
            </div>
            <button onClick={() => remove(m.id)} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '0.8rem', alignSelf: 'center', padding: '0.25rem' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}