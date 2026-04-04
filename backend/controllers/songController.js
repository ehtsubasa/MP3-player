// backend/controllers/songController.js
import Song from '../models/songModel.js';
import YTDlpWrapPkg from 'yt-dlp-wrap';
const YTDlpWrap = YTDlpWrapPkg.default;
import path from 'path';
import fs from 'fs';

const OEMBED_URL = 'https://www.youtube.com/oembed';

// yt-dlp binary path — /tmp works on both Mac/Linux/Pi
const BIN_PATH = path.join('/tmp', 'yt-dlp');

// cookies.txt sits in project root — place it there manually
const COOKIES_PATH = path.join(process.cwd(), 'cookies.txt');

let ytDlp = null;

// cache stream URLs — YouTube URLs expire ~6h, use 5h TTL
const urlCache = new Map();
const pendingUrlResolutions = new Map();
const CACHE_TTL_MS = 5 * 60 * 60 * 1000;

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

async function getStreamUrl(youtubeId) {
  const cached = urlCache.get(youtubeId);
  if (cached && Date.now() < cached.expiresAt) return cached.url;

  const pending = pendingUrlResolutions.get(youtubeId);
  if (pending) return pending;

  const resolveUrl = async () => {
  const yt = await getYtDlp();

  const args = [
    '--no-playlist',
    '--get-url',
    '-f', 'bestaudio/best',
  ];

  // use cookies.txt if it exists in project root
  if (fs.existsSync(COOKIES_PATH)) {
    args.push('--cookies', COOKIES_PATH);
    console.log('using cookies.txt');
  } else {
    console.log('no cookies.txt found — proceeding without');
  }

  args.push(`https://www.youtube.com/watch?v=${youtubeId}`);

  const url = (await yt.execPromise(args)).trim();
  if (!url) throw new Error('No stream URL returned');

  urlCache.set(youtubeId, { url, expiresAt: Date.now() + CACHE_TTL_MS });
  return url;
  };

  const promise = resolveUrl().finally(() => {
    pendingUrlResolutions.delete(youtubeId);
  });

  pendingUrlResolutions.set(youtubeId, promise);
  return promise;
}

// warm up yt-dlp on startup — downloads binary if missing
getYtDlp().catch(err => console.error('yt-dlp init failed:', err.message));

function extractYoutubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

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

export const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch song' });
  }
};

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

export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete song' });
  }
};

export const prepareSongStream = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).select('youtubeId');
    if (!song) return res.status(404).json({ message: 'Song not found' });

    await getStreamUrl(song.youtubeId);
    res.json({ ready: true });
  } catch (err) {
    console.error('Prepare stream error:', err.message);
    res.status(500).json({ message: 'Failed to prepare stream' });
  }
};

export const streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    const streamUrl = await getStreamUrl(song.youtubeId);

    const headers = {};
    if (req.headers.range) headers['Range'] = req.headers.range;

    const upstream = await fetch(streamUrl, { headers });
    if (!upstream.ok || !upstream.body) {
      return res.status(502).json({ message: 'Upstream audio stream unavailable' });
    }

    res.status(upstream.status);
    const ct = upstream.headers.get('content-type');
    const cl = upstream.headers.get('content-length');
    const cr = upstream.headers.get('content-range');
    if (ct) res.setHeader('Content-Type', ct);
    if (cl) res.setHeader('Content-Length', cl);
    if (cr) res.setHeader('Content-Range', cr);
    res.setHeader('Accept-Ranges', 'bytes');

    const { Readable, pipeline } = await import('stream');
    const nodeStream = Readable.fromWeb(upstream.body);

    nodeStream.on('error', (err) => {
      console.error('Upstream stream error:', err.message);
      if (!res.headersSent) {
        res.status(502).json({ message: 'Audio stream interrupted' });
      } else if (!res.destroyed) {
        res.destroy();
      }
    });

    req.on('close', () => {
      if (!nodeStream.destroyed) nodeStream.destroy();
    });

    pipeline(nodeStream, res, (err) => {
      if (!err || err.code === 'ERR_STREAM_PREMATURE_CLOSE') return;
      console.error('Pipeline error:', err.message);
      if (!res.headersSent) {
        res.status(502).json({ message: 'Failed to stream song' });
      }
    });
  } catch (err) {
    console.error('Stream error:', err.message);
    if (!res.headersSent) res.status(500).json({ message: 'Failed to stream song' });
  }
};
