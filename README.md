# MP3 Player

A web app that lets you search for YouTube videos, save them as songs, organize them into playlists, and stream the audio — all from your browser.

## Features

- **User accounts** — Sign up, log in, and log out securely. Your library is private to you.
- **Add songs** — Paste a YouTube link and the app saves the song to your library.
- **Stream audio** — Listen to any saved song directly in the browser.
- **Playlists** — Create playlists and add or remove songs from them.
- **Search** — Find songs in your library quickly.

## Tech Stack

| Layer | Tools |
|---|---|
| Frontend | React 19, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB (via Mongoose) |
| Auth | JWT stored in HTTP-only cookies |
| Audio | yt-dlp (streams audio from YouTube) |

## Project Structure

```
mp3Player/
├── backend/
│   ├── controllers/   # Request handlers (auth, songs, playlists)
│   ├── database/      # MongoDB connection
│   ├── middleware/     # Auth guard (protectRoute)
│   ├── models/        # Mongoose schemas (User, Song, Playlist)
│   ├── routes/        # API route definitions
│   ├── utils/
│   └── server.js      # Entry point
└── frontend/
    └── src/
        ├── components/ # Shared UI components
        ├── context/    # React context (auth, player state)
        ├── hooks/      # Custom hooks
        └── pages/      # Page components (Home, Search, Playlist, etc.)
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/songs` | List all songs in your library |
| POST | `/api/songs` | Add a song (provide YouTube URL) |
| GET | `/api/songs/:id` | Get a single song |
| GET | `/api/songs/:id/stream` | Stream the audio |
| DELETE | `/api/songs/:id` | Remove a song |
| GET | `/api/playlists` | List all playlists |
| POST | `/api/playlists` | Create a playlist |
| GET | `/api/playlists/:id` | Get playlist details |
| PUT | `/api/playlists/:id` | Update a playlist |
| DELETE | `/api/playlists/:id` | Delete a playlist |

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed and available in your system PATH

### 1. Clone the repo

```bash
git clone <repo-url>
cd mp3Player
```

### 2. Set up environment variables

Create a `.env` file in the project root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development

# Optional — only needed for the Render.com keep-alive ping in production
RENDER_URL=https://your-app.onrender.com
```

### 3. Install dependencies and build the frontend

```bash
npm run build
```

This installs all dependencies for both the backend and frontend, and builds the React app.

### 4. Start the server

```bash
npm start
```

The app will be available at `http://localhost:8000`.

### Development mode

To run the backend with auto-reload:

```bash
npm run server
```

Run the frontend dev server separately:

```bash
cd frontend
npm run dev
```

## Deployment

The app is ready to deploy on [Render](https://render.com/):

- Set the **build command** to `npm run build`
- Set the **start command** to `npm start`
- Add all required environment variables in the Render dashboard
- Set `NODE_ENV=production` and `RENDER_URL` to your app's public URL to enable the keep-alive ping (prevents the free tier from sleeping)
