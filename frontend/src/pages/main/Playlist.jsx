// frontend/src/pages/main/Playlist.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import NewPlaylistModal from '../../components/NewPlaylistModal';



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
  const { playlists, loading, createPlaylist } = usePlaylists();
  const [showModal,  setShowModal]  = useState(false);
  const [creating,   setCreating]   = useState(false);

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
          <div className='flex items-center justify-between'>
            <div className='w-8' /> {/* spacer */}
            <h1 className='text-lg font-bold'>Playlists</h1>
            <button
              onClick={() => setShowModal(true)}
              className='w-8 h-8 flex items-center justify-center text-orange-500'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none'
                viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
              </svg>
            </button>
          </div>

          {/* count */}
          <p className='text-gray-500 text-xs mt-1 text-center'>
            My Playlists: {playlists.length}
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