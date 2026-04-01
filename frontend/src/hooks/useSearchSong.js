// frontend/src/hooks/useSearchSong.js
import { useState } from 'react';

const useSearchSong = (existingSongs) => {
  const [url,        setUrl]        = useState('');
  const [result,     setResult]     = useState(null); // song preview from oEmbed
  const [searching,  setSearching]  = useState(false);
  const [adding,     setAdding]     = useState(false);
  const [searchError, setSearchError] = useState(null);

  // extract youtube ID from URL
  const extractYoutubeId = (rawUrl) => {
    const match = rawUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // check if song already exists in all songs
  const alreadyExists = (youtubeId) =>
    existingSongs.some(s => s.youtubeId === youtubeId);

  const handleSearch = async () => {
    const youtubeId = extractYoutubeId(url);
    if (!youtubeId) {
      setSearchError('Invalid YouTube URL');
      setResult(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setResult(null);

    try {
      // use oEmbed to preview — no API key needed
      const res = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      );
      if (!res.ok) throw new Error('Video not found or unavailable');
      const data = await res.json();

      setResult({
        youtubeId,
        title:        data.title,
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        exists:       alreadyExists(youtubeId),
      });
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async () => {
    if (!result || result.exists) return;
    setAdding(true);
    try {
      const res = await fetch('/api/songs', {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ url: `https://www.youtube.com/watch?v=${result.youtubeId}` }),
      });
      if (!res.ok) throw new Error('Failed to add song');
      const song = await res.json();
      // mark as exists so button switches to checkmark
      setResult(r => ({ ...r, exists: true }));
      return song;
    } catch (err) {
      setSearchError(err.message);
      return null;
    } finally {
      setAdding(false);
    }
  };

  const handleClear = () => {
    setUrl('');
    setResult(null);
    setSearchError(null);
  };

  return {
    url, setUrl,
    result,
    searching, adding,
    searchError,
    handleSearch, handleAdd, handleClear,
  };
};

export default useSearchSong;
