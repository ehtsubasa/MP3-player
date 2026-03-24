// frontend/src/hooks/usePlaylists.js
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const usePlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/playlists', { credentials: 'include' });
        const data = await res.json();
        setPlaylists(data);
      } catch {
        toast.error('Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  const createPlaylist = async (name) => {
    try {
      const res = await fetch('/api/playlists', {
        method:      'POST',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setPlaylists(prev => [created, ...prev]);
      toast.success('Playlist created');
      return created;
    } catch {
      toast.error('Failed to create playlist');
      return null;
    }
  };

  const renamePlaylist = async (id, name) => {
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method:      'PATCH',
        credentials: 'include',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setPlaylists(prev => prev.map(p => p._id === id ? updated : p));
      toast.success('Playlist renamed');
      return updated;
    } catch {
      toast.error('Failed to rename playlist');
      return null;
    }
  };

  const deletePlaylist = async (id) => {
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method:      'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setPlaylists(prev => prev.filter(p => p._id !== id));
      toast.success('Playlist deleted');
      return true;
    } catch {
      toast.error('Failed to delete playlist');
      return false;
    }
  };

  return { playlists, loading, createPlaylist, renamePlaylist, deletePlaylist };
};

export default usePlaylists;