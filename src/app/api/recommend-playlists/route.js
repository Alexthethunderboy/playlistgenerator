import { NextResponse } from 'next/server';
import { searchPlaylists } from '@/utils/spotify';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');

  if (!genre) {
    return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
  }

  try {
    const playlists = await searchPlaylists(genre);
    return NextResponse.json({ recommended_playlists: playlists });
  } catch (error) {
    console.error('Error recommending playlists:', error);
    return NextResponse.json({ error: 'Failed to recommend playlists' }, { status: 500 });
  }
}

