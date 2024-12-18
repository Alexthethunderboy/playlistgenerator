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

    // Get global top tracks
    const tracksResult = await spotifyApi.getPlaylistTracks('37i9dQZEVXbMDoHDwVN2tF');  // This is Spotify's Global Top 50 playlist
    const tracks = tracksResult.body.items.slice(0, 10);  // Get top 10 tracks

    const formattedTracks = tracks.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      preview_url: item.track.preview_url,
      popularity: item.track.popularity,
    }));

    // Get global top albums (based on the tracks)
    const topAlbums = Array.from(new Set(tracks.map(item => item.track.album.id)))
      .slice(0, 5) // Limit to top 5 albums
      .map(albumId => {
        const track = tracks.find(item => item.track.album.id === albumId);
        return {
          id: track.track.album.id,
          name: track.track.album.name,
          artist: track.track.artists[0].name,
          image: track.track.album.images[0]?.url,
        };
      });

    return NextResponse.json({ 
      top_tracks: formattedTracks,
      top_albums: topAlbums,
    });
  } catch (error) {
    console.error('Error fetching global top tracks and albums:', error);
    return NextResponse.json({ error: 'Failed to fetch global top tracks and albums', details: error.message }, { status: 500 });
  }
}

