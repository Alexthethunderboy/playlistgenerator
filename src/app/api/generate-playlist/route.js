import { NextResponse } from 'next/server';
import { searchPlaylists, getPlaylistTracks } from '@/utils/spotify';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');

  if (!genre) {
    return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
  }

  try {
    const playlists = await searchPlaylists(genre);
    if (playlists.length === 0) {
      return NextResponse.json({ error: 'No playlists found for this genre' }, { status: 404 });
    }
    const playlist = playlists[0];
    const tracks = await getPlaylistTracks(playlist.id);

    return NextResponse.json({ playlist: tracks, playlistInfo: playlist });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ error: 'Failed to generate playlist' }, { status: 500 });
  }
}

