'use client'
import { useState } from 'react'
import { store } from '@/lib/storage'
import { IMG_BASE } from '@/lib/tmdb'
import { BADGE_DEFS } from '@/lib/badges'

export default function PosterWall() {
  const [tab, setTab] = useState<'wall' | 'badges'>('wall')
  const wall = store('wall') || []
  const earned = new Set<string>(store('badges') || [])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.05em' }}>YOUR WALL.</div>
      </div>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {(['wall', 'badges'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.85rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', color: tab === t ? 'var(--text)' : 'var(--muted)', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, background: 'transparent' }}>
            {t === 'wall' ? 'Poster Wall' : 'Badges'}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '5rem' }}>
        {tab === 'wall' ? (
          wall.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
              {wall.map((m: any) => (
                <div key={m.id} style={{ aspectRatio: '2/3', overflow: 'hidden', position: 'relative' }}>
                  <img src={IMG_BASE + m.poster_path} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', color: 'var(--muted)' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.5rem' }}>Your wall is empty.</div>
              Commit to a movie tonight.
            </div>
          )
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem', padding: '1.25rem' }}>
            {BADGE_DEFS.map(b => (
              <div key={b.id} style={{ background: 'var(--surface)', border: `1px solid ${earned.has(b.id) ? '#2a1a00' : 'var(--border)'}`, borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', opacity: earned.has(b.id) ? 1 : 0.4 }}>
                <div style={{ fontSize: '2rem', lineHeight: 1 }}>{b.icon}</div>
                <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.85rem', fontWeight: 700 }}>{b.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.4 }}>{b.desc}</div>
                {!earned.has(b.id) && <div style={{ fontSize: '0.8rem' }}>🔒</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}