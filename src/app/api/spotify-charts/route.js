import { NextResponse } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function GET(request) {
  try {
    // Get access token
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    // Fetch chart data
    const chartsData = await fetchSpotifyCharts();

    return NextResponse.json(chartsData);
  } catch (error) {
    console.error('Error fetching Spotify charts:', error);
    return NextResponse.json({ error: 'Failed to fetch Spotify charts', details: error.message }, { status: 500 });
  }
}

async function fetchSpotifyCharts() {
  try {
    // Fetch new releases as a proxy for top tracks and albums
    const newReleasesResponse = await spotifyApi.getNewReleases({ limit: 20, country: 'US' });
    const newReleases = newReleasesResponse.body.albums.items;

    // Extract unique artists from new releases
    const artistIds = [...new Set(newReleases.flatMap(release => release.artists.map(artist => artist.id)))].slice(0, 10);
    const artistsResponse = await spotifyApi.getArtists(artistIds);
    const artists = artistsResponse.body.artists;

    return {
      songs: newReleases.slice(0, 10).map((release, index) => ({
        position: index + 1,
        title: release.name,
        artist: release.artists.map(artist => artist.name).join(', '),
        imageUrl: release.images[0]?.url,
        streams: release.popularity * 10000
      })),
      artists: artists.map((artist, index) => ({
        position: index + 1,
        name: artist.name,
        imageUrl: artist.images[0]?.url,
        followers: artist.followers.total
      })),
      albums: newReleases.slice(10, 20).map((release, index) => ({
        position: index + 1,
        title: release.name,
        artist: release.artists.map(artist => artist.name).join(', '),
        imageUrl: release.images[0]?.url,
        streams: release.popularity * 10000
      }))
    };
  } catch (error) {
    console.error('Error in fetchSpotifyCharts:', error);
    throw new Error(`Failed to fetch Spotify charts: ${error.message}`);
  }
}

