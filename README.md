# Music Playlist Generator

## Description
The Music Playlist Generator is a web application that allows users to create personalized playlists based on their musical preferences. By leveraging the Spotify API, users can generate playlists tailored to their favorite genres, artists, and moods.

## Features
- Generate playlists based on user-selected genres and preferences.
- Display recommended playlists based on user input.
- Background animations for an engaging user experience.
- Responsive design using Tailwind CSS.

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/music-playlist-generator.git
   ```
2. Navigate to the project directory:
   ```bash
   cd music-playlist-generator
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env.local` file in the root directory and add your Spotify API credentials:
   ```
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```

## Usage
To start the development server, run:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to access the application.

## API Endpoints
- **Generate Playlist**: `POST /api/generate-playlist`
  - Request body: `{ "genres": ["genre1", "genre2"], "mood": "happy" }`
  - Response: Returns a generated playlist based on the input.

- **Recommend Playlists**: `GET /api/recommend-playlists`
  - Query parameters: `?genre=genre_name`
  - Response: Returns a list of recommended playlists for the specified genre.

## Technologies Used
- Next.js
- React
- Tailwind CSS
- Spotify API

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch: `git checkout -b feature/YourFeature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/YourFeature`.
5. Open a pull request.


