import { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const usePlayerControls = () => {
  const {
    currentSong, currentQueue, currentIndex,
    isPlaying, setIsPlaying,
    isLooping, setIsLooping,
    queueName, playNext, playPrev,
    audioRef,
  } = usePlayer();

  const wakeLockRef = useRef(null);

  // stream URL points directly to the proxy endpoint — no fetch needed
  const streamUrl = currentSong ? `/api/songs/${currentSong._id}/stream` : null;
  const nextSong = currentQueue.length > 1
    ? currentQueue[(currentIndex + 1) % currentQueue.length]
    : null;

  // Keep a single audio element alive so background playback can advance
  // without relying on autoplay for a newly-mounted media element.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;

    audio.load();

    if (isPlaying) {
      audio.play().catch(err => console.log('Play failed:', err));
    }
  }, [streamUrl]);

  // play / pause native audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;
    if (isPlaying) {
      audio.play().catch(err => console.log('Play failed:', err));
    } else {
      audio.pause();
    }
  }, [isPlaying, streamUrl]);

  // Ask the backend to resolve stream URLs before playback needs them.
  useEffect(() => {
    const songIds = [currentSong?._id, nextSong?._id].filter(Boolean);
    if (songIds.length === 0) return;

    songIds.forEach((songId) => {
      fetch(`/api/songs/${songId}/prepare-stream`, {
        credentials: 'include',
      }).catch(() => {});
    });
  }, [currentSong?._id, nextSong?._id]);

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

  const hasPrev    = currentQueue.length > 1;
  const hasNext    = currentQueue.length > 1;
  const togglePlay = () => setIsPlaying(p => !p);
  const toggleLoop = () => setIsLooping(l => !l);

  return {
    currentSong,
    isPlaying, togglePlay,
    isLooping, toggleLoop,
    hasPrev, hasNext,
    playPrev, playNext,
    queueName,
  };
};

export default usePlayerControls;
