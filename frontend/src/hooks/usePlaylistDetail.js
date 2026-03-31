// frontend/src/hooks/usePlaylistDetail.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const usePlaylistDetail = (id) => {
  const [playlist, setPlaylist] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch_ = async () => {
      try {
        const res = await fetch(`/api/playlists/${id}`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPlaylist(data);
      } catch {
        toast.error('Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [id]);

  const rename = async (name) => {
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method:      'PATCH',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPlaylist(updated);
      toast.success('Renamed');
      return true;
    } catch {
      toast.error('Failed to rename');
      return false;
    }
  };

  const deletePlaylist = async () => {
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method:      'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      toast.success('Playlist deleted');
      return true;
    } catch {
      toast.error('Failed to delete');
      return false;
    }
  };

  // adds multiple songs sequentially, updates local state once done
  const addSongs = async (songIds) => {
    try {
      await Promise.all(songIds.map(songId =>
        fetch(`/api/playlists/${id}/songs`, {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ songId }),
        })
      ));
      // re-fetch to get updated populated songs
      const res = await fetch(`/api/playlists/${id}`, { credentials: 'include' });
      const updated = await res.json();
      setPlaylist(updated);
      toast.success(`${songIds.length} song${songIds.length > 1 ? 's' : ''} added`);
      return true;
    } catch {
      toast.error('Failed to add songs');
      return false;
    }
  };

  return { playlist, loading, rename, deletePlaylist, addSongs };
};

export default usePlaylistDetail;