import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './database/connectToMongoDB.js';
import cookieParser from "cookie-parser";
import path from 'path';
import authRouters from './routes/authRoutes.js';
import songRouters from './routes/songRoutes.js';
import playlistRouters from './routes/playlistRoutes.js';

const app = express();
dotenv.config();

// middleware
app.use(express.json())

app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRouters);
app.use('/api/songs', songRouters);
app.use('/api/playlists', playlistRouters);

// serve React in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'frontend/dist/index.html'));
  });
}

// database connect
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    connectToMongoDB();
    console.log(`server is running at ${PORT}`)

    // keep-alive ping for Render free tier
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_URL) {
    setInterval(async () => {
      try {
        await fetch(`${process.env.RENDER_URL}/api/health`);
      } catch (err) {
        console.log('Keep-alive failed:', err.message);
      }
    }, 14 * 60 * 1000);
  }
})