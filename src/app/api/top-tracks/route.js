import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || 'pop';

  try {
    // Get access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    // Get top tracks for the genre
    const result = await spotifyApi.searchTracks(`genre:${genre}`, { limit: 10 });
    const tracks = result.body.tracks.items;

    const formattedTracks = tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      image: track.album.images[0]?.url,
      preview_url: track.preview_url,
      popularity: track.popularity,
    }));

    // Get top albums (based on the tracks)
    const topAlbums = Array.from(new Set(tracks.map(track => track.album.id)))
      .slice(0, 5) // Limit to top 5 albums
      .map(albumId => {
        const track = tracks.find(t => t.album.id === albumId);
        return {
          id: track.album.id,
          name: track.album.name,
          artist: track.artists[0].name,
          image: track.album.images[0]?.url,
        };
      });

    return NextResponse.json({ 
      top_tracks: formattedTracks,
      top_albums: topAlbums,
    });
  } catch (error) {
    console.error('Error fetching top tracks and albums:', error);
    return NextResponse.json({ error: 'Failed to fetch top tracks and albums', details: error.message }, { status: 500 });
  }
}

