export function getVibeSentence(genreIds: number[], hour: number): string {
  const late = hour >= 23 || hour < 4
  const eve = hour >= 18 && hour < 23
  const aft = hour >= 12 && hour < 18
  const g = genreIds?.[0]

  if (late && g === 27) return "Everyone else is asleep. Perfect."
  if (late && g === 53) return "It's late. Your brain wants chaos. Commit."
  if (late) return "It's late. This is the move."
  if (eve && g === 18) return "Tonight is for something that stays with you."
  if (eve && g === 80) return "Sharp dialogue. No mercy. You're ready."
  if (eve && g === 10749) return "Something warm. You deserve it tonight."
  if (eve) return "The night is yours. Make it count."
  if (aft && g === 35) return "You need to laugh. Don't overthink it."
  if (aft && g === 28) return "Afternoon adrenaline. No apologies."
  if (aft) return "A good film is always the right choice."
  return "Stop scrolling. This is your movie tonight."
}