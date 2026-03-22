// backend/controllers/song.controller.js
import Song from '../models/songModel.js';

const OEMBED_URL = 'https://www.youtube.com/oembed';

function extractYoutubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * GET /api/songs
 * Required:
 * - Authenticated request through protectRoute
 *
 * Success result:
 * - 200 with an array of songs
 * - Each song includes: _id, title, thumbnailUrl, youtubeId
 *
 * Possible errors:
 * - 500 if songs cannot be fetched
 */
export const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().select('title thumbnailUrl youtubeId').sort({ createdAt: -1 });

    res.json(songs);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch songs' });
  }
};

/**
 * GET /api/songs/:id
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB song id)
 *
 * Success result:
 * - 200 with the full song document
 *
 * Possible errors:
 * - 404 if the song does not exist
 * - 500 if the fetch fails
 */
export const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) 
        return res.status(404).json({ message: 'Song not found' });

    res.json(song);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch song' });
  }
};

/**
 * POST /api/songs
 * Required:
 * - Authenticated request through protectRoute
 * - JSON body: { "url": "<YouTube video URL>" }
 *
 * Success result:
 * - 201 with the created song document
 * - Stored fields include: youtubeId, title, thumbnailUrl
 *
 * Possible errors:
 * - 400 if the YouTube URL is invalid
 * - 400 if YouTube metadata cannot be fetched
 * - 409 if the song already exists
 * - 500 if the song cannot be created
 */
export const addSong = async (req, res) => {
  try {
    const { url } = req.body;

    const youtubeId = extractYoutubeId(url);

    if (!youtubeId) 
        return res.status(400).json({ message: 'Invalid YouTube URL' });

    const existing = await Song.findOne({ youtubeId });

    if (existing) 
        return res.status(409).json({ message: 'Song already exists', song: existing });

    const oembedRes = await fetch(`${OEMBED_URL}?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`);

    if (!oembedRes.ok) 
        return res.status(400).json({ message: 'Could not fetch video info' });

    const meta = await oembedRes.json();

    const song = await Song.create({
      youtubeId,
      title: meta.title,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    });

    res.status(201).json(song);

  } catch (err) {
    res.status(500).json({ message: 'Failed to add song' });
  }
};

/**
 * DELETE /api/songs/:id
 * Required:
 * - Authenticated request through protectRoute
 * - Route param: id (MongoDB song id)
 *
 * Success result:
 * - 200 with: { message: "Song deleted" }
 *
 * Possible errors:
 * - 404 if the song does not exist
 * - 500 if deletion fails
 */
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);

    if (!song) 
        return res.status(404).json({ message: 'Song not found' });

    res.json({ message: 'Song deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to delete song' });
  }
};
