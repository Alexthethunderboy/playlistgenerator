import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let tokenExpirationTime = 0;

async function getAccessToken() {
  if (Date.now() > tokenExpirationTime) {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    tokenExpirationTime = Date.now() + data.body['expires_in'] * 1000;
  }
  return spotifyApi.getAccessToken();
}

async function searchPlaylists(genre) {
  await getAccessToken();
  const result = await spotifyApi.searchPlaylists(genre, { limit: 5 });
  return result.body.playlists.items
    .filter(playlist => playlist && playlist.id) // Filter out null or undefined playlists
    .map(playlist => ({
      id: playlist.id,
      name: playlist.name || 'Untitled Playlist',
      description: playlist.description || `A great ${genre} playlist`,
      image: playlist.images && playlist.images[0] ? playlist.images[0].url : '/placeholder.svg',
      spotifyUrl: playlist.external_urls ? playlist.external_urls.spotify : '#',
    }));
}

async function getPlaylistTracks(playlistId) {
  await getAccessToken();
  const result = await spotifyApi.getPlaylistTracks(playlistId, { limit: 10 });
  return result.body.items.map(item => ({
    id: item.track.id,
    title: item.track.name,
    artist: item.track.artists[0].name,
    albumArt: item.track.album.images[0]?.url,
    previewUrl: item.track.preview_url,
    spotifyUrl: item.track.external_urls.spotify,
  }));
}

export { searchPlaylists, getPlaylistTracks };

