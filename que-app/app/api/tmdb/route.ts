import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || ''
  const key = '0d8e6c85e6d71190211020c1973c98c2'

  const tmdbParams = new URLSearchParams(searchParams)
  tmdbParams.delete('path')
  tmdbParams.set('api_key', key)

  const url = `https://api.themoviedb.org/3${path}?${tmdbParams.toString()}`
  const res = await fetch(url)
  const data = await res.json()

  return NextResponse.json(data)
}
