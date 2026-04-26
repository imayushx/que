'use client'
import { GENRE_LABELS } from '@/lib/tmdb'

export default function TasteResult({ tasteProfile, onContinue }: { tasteProfile: Record<number, number>; onContinue: () => void }) {
  const sorted = Object.entries(tasteProfile).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5)

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 1.5rem 2rem', background: 'var(--bg)' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '1.5rem' }}>ANALYSIS COMPLETE</div>
      <h1 style={{ fontFamily: 'var(--font-head)', fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.05, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Your taste.<br />Mapped.</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '3rem' }}>
        {sorted.map(([gid], i) => (
          <span key={gid} style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.85rem', fontWeight: 500, background: i === 0 ? 'var(--accent)' : 'transparent', borderColor: i === 0 ? 'var(--accent)' : 'var(--border)', color: i === 0 ? '#fff' : 'var(--text)' }}>
            {GENRE_LABELS[Number(gid)] || 'Cinema'}
          </span>
        ))}
        <span style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', borderRadius: 100, fontSize: '0.85rem', fontWeight: 500 }}>Film Lover</span>
      </div>
      <button onClick={onContinue} style={{ width: '100%', padding: '1rem', background: 'var(--accent)', color: '#fff', fontSize: '1rem', fontWeight: 600, border: 'none', borderRadius: 4 }}>See Tonight's Pick →</button>
    </div>
  )
}