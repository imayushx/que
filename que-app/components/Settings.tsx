'use client'
import { clearAll } from '@/lib/storage'

export default function Settings({ onReset }: { onReset: () => void }) {
  const handleReset = () => {
    if (confirm('Reset your taste profile? This will restart onboarding.')) { clearAll(); onReset() }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.05em' }}>SETTINGS.</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.25rem 5rem' }}>
        {[['Region', 'IN'], ['Notifications', '—'], ['Reset Time', '5:00 PM']].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
            <span>{label}</span><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{val}</span>
          </div>
        ))}
        {[['Version', 'que. v1.0'], ['Privacy Policy', '→']].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', marginTop: '1rem' }}>
            <span>{label}</span><span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{val}</span>
          </div>
        ))}
        <button onClick={handleReset} style={{ width: '100%', padding: '0.85rem', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: '0.9rem', fontWeight: 600, borderRadius: 4, marginTop: '2rem' }}>Reset Taste Profile</button>
        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.7rem', marginTop: '2rem' }}>Powered by <a href="https://www.themoviedb.org" target="_blank" style={{ color: '#01b4e4' }}>TMDB</a></div>
      </div>
    </div>
  )
}