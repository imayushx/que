import { store } from './storage'

export const BADGE_DEFS = [
  { id: 'first_pick', icon: '🎬', name: 'First Pick', desc: 'Committed to your first recommendation' },
  { id: 'streak_3', icon: '🔥', name: '3-Night Streak', desc: 'Committed 3 nights in a row' },
  { id: 'genre_purist', icon: '🎭', name: 'Genre Purist', desc: '5 movies in the same genre' },
  { id: 'night_owl', icon: '🌙', name: 'Night Owl', desc: 'Watched something after midnight' },
  { id: 'no_rerolls', icon: '⚡', name: 'No Rerolls', desc: 'Accepted first recommendation 3 times' },
  { id: 'collector', icon: '🎨', name: 'Collector', desc: 'Saved 10 movies to your wall' },
  { id: 'committed', icon: '🤝', name: 'Committed', desc: 'Never rerolled for a full week' },
  { id: 'tastemaker', icon: '🎯', name: 'Tastemaker', desc: 'Loved 20 movies in vibe check' },
]

export function checkBadges() {
  const earned = new Set<string>(store('badges') || [])
  const wall = store('wall') || []
  const loves = (store('swipes') || []).filter((s: any) => s.swipe === 'up')
  const h = new Date().getHours()

  if (wall.length >= 1) earned.add('first_pick')
  if (wall.length >= 10) earned.add('collector')
  if (loves.length >= 20) earned.add('tastemaker')
  if (h >= 0 && h < 4) earned.add('night_owl')

  const noRerollCount = store('no_reroll_count') || 0
  const rerolls = store('rerolls') ?? 3
  if (rerolls === 3) {
    const c = noRerollCount + 1
    store('no_reroll_count', c)
    if (c >= 3) earned.add('no_rerolls')
  }

  store('badges', [...earned])
}