import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre');

  if (!genre) {
    return NextResponse.json({ error: 'Genre is required' }, { status: 400 });
  }

  try {
    // Get access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    // Search for tracks
    const result = await spotifyApi.searchTracks(`genre:${genre}`, { limit: 10 });
    const tracks = result.body.tracks.items;

    const playlist = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(artist => ({ name: artist.name })),
      preview_url: track.preview_url,
      album: {
        name: track.album.name,
        images: track.album.images,
      },
    }));

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ error: 'Failed to generate playlist', details: error.message }, { status: 500 });
  }
}

