import { useState, useEffect } from 'react';

const useAllSongs = () => {
  const [songs, setSongs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch('/api/songs', {
          credentials: 'include', // sends the JWT cookie
        });

        if (!res.ok) throw new Error('Failed to fetch songs');

        const data = await res.json();
        setSongs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return { songs, loading, error };
};

export default useAllSongs;