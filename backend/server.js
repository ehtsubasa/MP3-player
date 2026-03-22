import express from 'express';
import dotenv from 'dotenv';
import connectToMongoDB from './database/connectToMongoDB.js';
import cookieParser from "cookie-parser";

import authRouters from './routes/authRoutes.js';
import songRouters from './routes/songRoutes.js';
import playlistRouters from './routes/playlistRoutes.js';

const app = express();
dotenv.config();

// middleware
app.use(express.json())

app.use(cookieParser());

app.use('/api/auth', authRouters);
app.use('/api/songs', songRouters);
app.use('/api/playlists', playlistRouters);

// database connect
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    connectToMongoDB();
    console.log(`server is running at ${PORT}`)
})