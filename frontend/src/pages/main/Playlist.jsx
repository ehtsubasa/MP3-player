// frontend/src/pages/main/Playlist.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import NewPlaylistModal from '../../components/NewPlaylistModal';
import usePlaylists from '../../hooks/usePlaylists';



// 2x2 cover grid — shows up to 4 thumbnails, falls back to placeholder
const PlaylistCover = ({ songs }) => {
  const thumbs = (songs || []).slice(0, 4).filter(s => s.thumbnailUrl);
  if (thumbs.length === 0) {
    return (
      <div className='w-16 h-16 flex-shrink-0 bg-gray-800 rounded-lg
        flex items-center justify-center'>
        <svg xmlns='http://www.w3.org/2000/svg' className='w-7 h-7 text-gray-600'
          fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
          <path strokeLinecap='round' strokeLinejoin='round'
            d='M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' />
        </svg>
      </div>
    );
  }
  return (
    <div className='w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden grid grid-cols-2 grid-rows-2'>
      {[0, 1, 2, 3].map(i => (
        thumbs[i]
          ? <img key={i} src={thumbs[i].thumbnailUrl} alt='' className='w-full h-full object-cover' />
          : <div key={i} className='bg-gray-800' />
      ))}
    </div>
  );
};

const Playlist = () => {
  const navigate = useNavigate();
  const [showAll,   setShowAll]   = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [creating,   setCreating]   = useState(false);

  const { playlists, loading, createPlaylist } = usePlaylists(showAll);

  const handleCreate = async (name) => {
    setCreating(true);
    const created = await createPlaylist(name);
    setCreating(false);
    if (created) {
      setShowModal(false);
      navigate(`/playlist/${created._id}`);
    }
  };

  return (
    <>
      <div className='bg-black min-h-screen text-white flex flex-col pb-20'>

        {/* header */}
        <div className='sticky top-0 bg-black z-10 px-4 pt-12 pb-3 border-b border-gray-800'>
          <div className='grid grid-cols-[1fr_auto_1fr] items-center'>
            {/* shared toggle */}
            <button
              onClick={() => setShowAll(v => !v)}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
                border transition-colors justify-self-start ${showAll
                  ? 'border-orange-500 text-orange-500'
                  : 'border-gray-700 text-gray-500'}`}>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-3.5 h-3.5' fill='none'
                viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round'
                  d='M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z' />
              </svg>
              {showAll ? 'All' : 'Mine'}
            </button>

            <h1 className='text-lg font-bold'>Playlists</h1>

            <button
              onClick={() => setShowModal(true)}
              className='w-8 h-8 flex items-center justify-center text-orange-500 justify-self-end'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none'
                viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
              </svg>
            </button>
          </div>

          {/* count */}
          <p className='text-gray-500 text-xs mt-1 text-center'>
            {showAll ? 'All Playlists' : 'My Playlists'}: {playlists.length}
          </p>
        </div>

        {loading && (
          <div className='flex justify-center pt-20'>
            <p className='text-gray-500 text-sm'>Loading...</p>
          </div>
        )}

        {!loading && playlists.length === 0 && (
          <div className='flex justify-center pt-20'>
            <p className='text-gray-500 text-sm'>No playlists yet. Tap + to create one.</p>
          </div>
        )}

        <ul>
          {playlists.map(pl => (
            <li key={pl._id}
              onClick={() => navigate(`/playlist/${pl._id}`)}
              className='flex items-center gap-3 px-4 py-3 border-b border-gray-800
                cursor-pointer active:bg-gray-900'>
              <PlaylistCover songs={pl.songs} />
              <div className='flex-1 min-w-0'>
                <p className='text-white text-sm font-medium truncate'>{pl.name}</p>
                <p className='text-gray-500 text-xs mt-0.5'>
                  {pl.songs?.length || 0} Tracks
                </p>
              </div>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 text-gray-600 flex-shrink-0'
                fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
              </svg>
            </li>
          ))}
        </ul>

        <BottomNav />
      </div>

      {showModal && (
        <NewPlaylistModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
          creating={creating}
        />
      )}
    </>
  );
};

export default Playlist;
