import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function GET() {
  try {
    // Get access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    // Search for popular tracks
    const tracksResult = await spotifyApi.searchTracks('year:2023', {
      limit: 10,
      market: 'US'
    });

    const formattedTracks = tracksResult.body.tracks.items.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url,
      preview_url: track.preview_url,
      popularity: track.popularity,
    }));

    // Search for popular albums
    const albumsResult = await spotifyApi.searchAlbums('year:2023', {
      limit: 5,
      market: 'US'
    });

    const formattedAlbums = albumsResult.body.albums.items.map(album => ({
      id: album.id,
      name: album.name,
      artist: album.artists[0].name,
      image: album.images[0]?.url,
    }));

    return NextResponse.json({ 
      top_tracks: formattedTracks,
      top_albums: formattedAlbums,
    });
  } catch (error) {
    console.error('Error fetching global top tracks and albums:', error);
    return NextResponse.json({ error: 'Failed to fetch global top tracks and albums', details: error.message }, { status: 500 });
  }
}

