import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const usePlayerControls = () => {
  const {
    currentSong, currentQueue, currentIndex,
    isPlaying, setIsPlaying,
    isLooping, setIsLooping,
    queueName, playNext, playPrev,
  } = usePlayer();

  const playerRef    = useRef(null);
  const wakeLockRef  = useRef(null);
  const [streamUrl,     setStreamUrl]     = useState(null);
  const [loadingStream, setLoadingStream] = useState(false);
  const [streamError,   setStreamError]   = useState(null);

  // fetch direct audio URL when song changes
  useEffect(() => {
    if (!currentSong) {
      setStreamUrl(null);
      setStreamError(null);
      setLoadingStream(false);
      return;
    }

    const fetchStreamUrl = async () => {
      setStreamUrl(null);
      setStreamError(null);
      setLoadingStream(true);

      try {
        const res = await fetch(`/api/songs/${currentSong._id}/stream-url`, {
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to get stream URL');
        }

        if (!data.streamUrl) {
          throw new Error('Song stream URL was not returned by the server');
        }

        setStreamUrl(data.streamUrl);
      } catch (err) {
        console.error('Failed to get stream URL:', err);
        setStreamError(err.message);
      } finally {
        setLoadingStream(false);
      }
    };
    fetchStreamUrl();
  }, [currentSong?._id]);

  // play / pause native audio
  useEffect(() => {
    const audio = playerRef.current;
    if (!audio || !streamUrl) return;
    if (isPlaying) {
      audio.play().catch(err => console.log('Play failed:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, streamUrl]);

  // lock screen controls
  useEffect(() => {
    if (!currentSong || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title:   currentSong.title,
      artwork: [{ src: currentSong.thumbnailUrl, sizes: '480x360', type: 'image/jpeg' }],
    });
    navigator.mediaSession.setActionHandler('play',          () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause',         () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('nexttrack',     playNext);
    navigator.mediaSession.setActionHandler('previoustrack', playPrev);
  }, [currentSong]);

  // wake lock
  useEffect(() => {
    const request = async () => {
      try {
        if ('wakeLock' in navigator)
          wakeLockRef.current = await navigator.wakeLock.request('screen');
      } catch (err) { console.log('Wake lock:', err); }
    };
    const release = async () => {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    };
    if (isPlaying) request(); else release();
    return () => { release(); };
  }, [isPlaying]);

  // re-acquire wake lock on tab visible
  useEffect(() => {
    const handle = async () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        try {
          if ('wakeLock' in navigator)
            wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) { console.log('Wake lock re-acquire:', err); }
      }
    };
    document.addEventListener('visibilitychange', handle);
    return () => document.removeEventListener('visibilitychange', handle);
  }, [isPlaying]);

  const hasPrev    = currentIndex > 0;
  const hasNext    = currentIndex < currentQueue.length - 1;
  const togglePlay = () => setIsPlaying(p => !p);
  const toggleLoop = () => setIsLooping(l => !l);

  return {
    currentSong,
    isPlaying, togglePlay,
    isLooping, toggleLoop,
    hasPrev, hasNext,
    playPrev, playNext,
    queueName, playerRef,
    streamUrl, loadingStream, streamError,
  };
};

export default usePlayerControls;
