const PREFIX = 'que_'

export function store(key: string, val?: any) {
  try {
    if (val === undefined) {
      const v = localStorage.getItem(PREFIX + key)
      return v ? JSON.parse(v) : null
    }
    localStorage.setItem(PREFIX + key, JSON.stringify(val))
  } catch (e) {}
}

export function clearAll() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(PREFIX))
    .forEach(k => localStorage.removeItem(k))
}

export function checkDailyReset() {
  const last = store('last_reset')
  const now = new Date()
  const resetHour = 17
  let shouldReset = false
  if (!last) {
    shouldReset = true
  } else {
    const lastD = new Date(last)
    const resetToday = new Date(now)
    resetToday.setHours(resetHour, 0, 0, 0)
    const resetYesterday = new Date(resetToday)
    resetYesterday.setDate(resetYesterday.getDate() - 1)
    if (now >= resetToday && lastD < resetToday) shouldReset = true
    else if (lastD < resetYesterday) shouldReset = true
  }
  if (shouldReset) {
    store('last_reset', now.toISOString())
    store('rerolls', 3)
    store('locked', false)
    store('today_rec', null)
  }
  return {
    rerolls: store('rerolls') ?? 3,
    locked: store('locked') || false,
  }
}