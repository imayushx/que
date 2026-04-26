'use client'
import { useState, useEffect } from 'react'
import Landing from '@/components/Landing'
import VibeCheck from '@/components/Vibecheck'
import TasteResult from '@/components/TasteResult'
import Recommendation from '@/components/Recommendation'
import StreamingScreen from '@/components/StreamingScreen'
import LockedScreen from '@/components/LockedScreen'
import PosterWall from '@/components/PosterWall'
import SavedQueue from '@/components/SavedQueue'
import Settings from '@/components/Settings'
import BottomNav from '@/components/BottomNav'
import { checkDailyReset } from '@/lib/storage'

export type Screen =
  | 'landing' | 'vibecheck' | 'tasteresult' | 'recommendation'
  | 'streaming' | 'locked' | 'posterwall' | 'saved' | 'settings'

export default function Home() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [tasteProfile, setTasteProfile] = useState<Record<number, number>>({})
  const [currentMovie, setCurrentMovie] = useState<any>(null)
  const [showNav, setShowNav] = useState(false)

  useEffect(() => { checkDailyReset() }, [])

  const go = (s: Screen) => { setScreen(s); if (!showNav && s !== 'landing' && s !== 'vibecheck' && s !== 'tasteresult') setShowNav(true) }

  return (
    <main style={{ maxWidth: 420, margin: '0 auto', height: '100vh', position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
      {screen === 'landing' && <Landing onStart={() => go('vibecheck')} onSkip={() => { setShowNav(true); go('recommendation') }} />}
      {screen === 'vibecheck' && <VibeCheck onDone={(profile: Record<number, number>) => { setTasteProfile(profile); go('tasteresult') }} />}
      {screen === 'tasteresult' && <TasteResult tasteProfile={tasteProfile} onContinue={() => { setShowNav(true); go('recommendation') }} />}
      {screen === 'recommendation' && <Recommendation tasteProfile={tasteProfile} onWatch={(movie: any) => { setCurrentMovie(movie); go('streaming') }} onLocked={() => go('locked')} />}
      {screen === 'streaming' && <StreamingScreen movie={currentMovie} onBack={() => go('recommendation')} />}
      {screen === 'locked' && <LockedScreen onViewSaved={() => go('saved')} />}
      {screen === 'posterwall' && <PosterWall />}
      {screen === 'saved' && <SavedQueue />}
      {screen === 'settings' && <Settings onReset={() => { setShowNav(false); setTasteProfile({}); go('landing') }} />}
      {showNav && <BottomNav active={screen} onNav={go} />}
    </main>
  )
}