
const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY!

export const IMG_BASE = 'https://image.tmdb.org/t/p/w500'

export const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 18: 'Drama', 27: 'Horror', 10749: 'Romance',
  878: 'Sci-Fi', 53: 'Thriller', 9648: 'Mystery', 14: 'Fantasy',
  37: 'Western',
}

export const GENRE_LABELS: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

export async function tmdb(path: string, extraParams: Record<string, string> = {}) {
  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    ...extraParams
  })

  const url = `${TMDB_BASE}${path}?${params.toString()}`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`TMDB error: ${res.status} on ${path}`)
  }

  return res.json()
}

export const getPopular = () => tmdb('/movie/popular')

export const getDiscover = (genres: string) =>
  tmdb('/discover/movie', {
    with_genres: genres,
    'vote_average.gte': '6.5',
    'vote_count.gte': '500',
    sort_by: 'popularity.desc'
  })

export const getMovieDetails = (id: number) => tmdb(`/movie/${id}`)

export const getWatchProviders = (id: number) =>
  tmdb(`/movie/${id}/watch/providers`)

export const getCredits = (id: number) => tmdb(`/movie/${id}/credits`)

export const getMovieCredits = (id: number) => tmdb(`/movie/${id}/credits`)

export const getGenres = () => tmdb('/genre/movie/list')

/**
 * Fetch 10 diverse popular movies for the vibe-check swipe flow.
 * Pulls from the first 2 pages of popular movies, shuffles, and picks 10.
 */
export async function getVibeMovies(): Promise<any[]> {
  const [p1, p2] = await Promise.all([
    tmdb('/movie/popular', { page: '1' }),
    tmdb('/movie/popular', { page: '2' }),
  ])
  const all = [...(p1.results || []), ...(p2.results || [])]
    .filter((m: any) => m.poster_path)
  // shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, 10)
}

/**
 * Build a recommendation pool from a taste profile.
 * @param tasteProfile  Record<genreId, score> from the vibe check
 * @param seenIds       Set of movie IDs the user has already seen
 * @returns             Array of movie objects, highest-relevance first
 */
export async function getRecPool(
  tasteProfile: Record<number, number>,
  seenIds: Set<number> = new Set(),
): Promise<any[]> {
  // Pick top 3 genres from the taste profile
  const topGenres = Object.entries(tasteProfile)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 3)
    .map(([id]) => id)

  const genreParam = topGenres.length > 0 ? topGenres.join(',') : ''

  const params: Record<string, string> = {
    'vote_average.gte': '6.5',
    'vote_count.gte': '500',
    sort_by: 'popularity.desc',
  }
  if (genreParam) params.with_genres = genreParam

  const data = await tmdb('/discover/movie', params)
  const results: any[] = data.results || []

  // Filter out already-seen movies
  return results.filter((m: any) => !seenIds.has(m.id))
}
