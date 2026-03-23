// backend/controllers/song.controller.js
import Song from '../models/songModel.js';
import YTDlpWrapPkg from 'yt-dlp-wrap';
const YTDlpWrap = YTDlpWrapPkg.default;
import path from 'path';
import fs from 'fs';

const OEMBED_URL = 'https://www.youtube.com/oembed';

// Use /tmp so it's always writable (works on Render too)
const BIN_PATH = path.join('/tmp', process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp');

let ytDlp = null;

// Cache stream URLs — YouTube URLs expire in ~6h, so we use 5h TTL
const urlCache = new Map(); // youtubeId → { url, expiresAt }
const CACHE_TTL_MS = 5 * 60 * 60 * 1000;

async function getStreamUrl(youtubeId) {
  const cached = urlCache.get(youtubeId);
  if (cached && Date.now() < cached.expiresAt) return cached.url;

  const yt = await getYtDlp();

  const args = [
    '-f', 'bestaudio/best',  // simplest — let yt-dlp pick whatever works
    '--no-playlist',
    '--get-url',
  ];

  if (fs.existsSync(COOKIES_PATH)) args.push('--cookies', COOKIES_PATH);
  args.push(`https://www.youtube.com/watch?v=${youtubeId}`);

  const url = (await yt.execPromise(args)).trim();
  if (!url) throw new Error('No stream URL returned');

  urlCache.set(youtubeId, { url, expiresAt: Date.now() + CACHE_TTL_MS });
  return url;
}

async function getYtDlp() {
  if (ytDlp) return ytDlp;
  if (!fs.existsSync(BIN_PATH)) {
    console.log('Downloading yt-dlp binary...');
    await YTDlpWrap.downloadFromGithub(BIN_PATH);
    console.log('yt-dlp ready.');
  }
  ytDlp = new YTDlpWrap(BIN_PATH);
  return ytDlp;
}

// Write YouTube cookies from env var to a temp file (needed on Render)
const COOKIES_PATH = '/tmp/yt-cookies.txt';
if (process.env.YOUTUBE_COOKIES) {
  // Render escapes newlines as \n in env vars — unescape them
  const content = process.env.YOUTUBE_COOKIES.replace(/\\n/g, '\n');
  fs.writeFileSync(COOKIES_PATH, content);
  console.log(`yt-cookies.txt written (${content.split('\n').length} lines)`);
}

// warm up on startup
getYtDlp().catch(err => console.error('yt-dlp init failed:', err.message));

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
    const songs = await Song.find()
      .select('title thumbnailUrl youtubeId')
      .sort({ createdAt: -1 });
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
    if (!song) return res.status(404).json({ message: 'Song not found' });
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

    const oembedRes = await fetch(
      `${OEMBED_URL}?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
    );
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
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete song' });
  }
};


export const streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const streamUrl = await getStreamUrl(song.youtubeId);

    // Forward Range header so seeking works
    const headers = {};
    if (req.headers.range) headers['Range'] = req.headers.range;

    const upstream = await fetch(streamUrl, { headers });

    res.status(upstream.status);
    const ct = upstream.headers.get('content-type');
    const cl = upstream.headers.get('content-length');
    const cr = upstream.headers.get('content-range');
    if (ct) res.setHeader('Content-Type', ct);
    if (cl) res.setHeader('Content-Length', cl);
    if (cr) res.setHeader('Content-Range', cr);
    res.setHeader('Accept-Ranges', 'bytes');

    const { Readable } = await import('stream');
    Readable.fromWeb(upstream.body).pipe(res);
  } catch (err) {
    console.error('Stream error:', err.message);
    if (!res.headersSent) res.status(500).json({ message: 'Failed to stream song' });
  }
};