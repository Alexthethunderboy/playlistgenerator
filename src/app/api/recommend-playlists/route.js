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

    // Search for playlists
    const result = await spotifyApi.searchPlaylists(genre, { limit: 5 });
    const playlists = result.body.playlists.items;

    if (!playlists || playlists.length === 0) {
      return NextResponse.json({ recommended_playlists: [] });
    }

    const recommended_playlists = playlists.map(playlist => {
      if (!playlist) return null;

      return {
        name: playlist.name || 'Untitled Playlist',
        description: playlist.description || 'No description available',
        image_url: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : null,
        spotify_url: playlist.external_urls && playlist.external_urls.spotify ? playlist.external_urls.spotify : null,
      };
    }).filter(Boolean); // Remove any null entries

    return NextResponse.json({ recommended_playlists });
  } catch (error) {
    console.error('Error recommending playlists:', error);
    return NextResponse.json({ error: 'Failed to recommend playlists', details: error.message }, { status: 500 });
  }
}

