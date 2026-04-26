'use client'
import { Screen } from '@/app/page'

const tabs = [
  { id: 'recommendation', icon: '◈', label: 'Tonight' },
  { id: 'saved', icon: '⊕', label: 'Saved' },
  { id: 'posterwall', icon: '◻', label: 'Profile' },
  { id: 'settings', icon: '⚙', label: 'Settings' },
] as const

export default function BottomNav({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(10,10,10,0.95)', borderTop: '1px solid var(--border)', display: 'flex', zIndex: 200, backdropFilter: 'blur(12px)' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav(t.id as Screen)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.65rem 0 0.5rem', gap: '0.25rem', border: 'none', background: 'none', color: active === t.id ? 'var(--accent)' : 'var(--muted)', fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer' }}>
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{t.icon}</span>
          {t.label}
        </button>
      ))}
    </div>
  )
}