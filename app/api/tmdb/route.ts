import { NextRequest, NextResponse } from 'next/server'

const TMDB_KEY = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY || ''

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || ''

  if (!path) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  const tmdbParams = new URLSearchParams(searchParams)
  tmdbParams.delete('path')
  tmdbParams.set('api_key', TMDB_KEY)

  const url = `https://api.themoviedb.org/3${path}?${tmdbParams.toString()}`
  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json(data)
}
