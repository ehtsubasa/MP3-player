// frontend/src/components/AddSongsSheet.jsx
import { useState } from 'react';
import useAllSongs from '../hooks/useAllSongs';

const AddSongsSheet = ({ playlistSongIds, onClose, onAdd }) => {
  const { songs, loading } = useAllSongs();
  const [selected, setSelected] = useState(new Set());
  const [adding,   setAdding]   = useState(false);

  // songs already in the playlist
  const alreadyIn = new Set(playlistSongIds.map(id => id.toString()));

  const toggle = (id) => {
    if (alreadyIn.has(id)) return; // can't select already-added songs
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (selected.size === 0) return;
    setAdding(true);
    await onAdd([...selected]);
    setAdding(false);
  };

  return (
    <div className='fixed inset-0 z-50 bg-black flex flex-col'>

      {/* header */}
      <div className='flex items-center justify-between px-4 pt-12 pb-3
        border-b border-gray-800 sticky top-0 bg-black z-10'>
        <button onClick={onClose} className='text-gray-400 text-sm'>
          Cancel
        </button>
        <p className='text-white text-base font-bold'>Add Songs</p>
        <button
          onClick={handleAdd}
          disabled={selected.size === 0 || adding}
          className={`text-sm font-medium ${selected.size > 0 && !adding ? 'text-orange-500' : 'text-gray-600'}`}>
          {adding ? 'Adding...' : `Add${selected.size > 0 ? ` (${selected.size})` : ''}`}
        </button>
      </div>

      {/* list */}
      {loading && (
        <div className='flex justify-center pt-20'>
          <p className='text-gray-500 text-sm'>Loading songs...</p>
        </div>
      )}

      <ul className='overflow-y-auto flex-1 pb-8'>
        {songs.map(song => {
          const inPlaylist  = alreadyIn.has(song._id.toString());
          const isSelected  = selected.has(song._id.toString());

          return (
            <li key={song._id}
              onClick={() => toggle(song._id.toString())}
              className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800
                cursor-pointer ${inPlaylist ? 'opacity-40' : 'active:bg-gray-900'}`}>

              {/* thumbnail */}
              <div className={`w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-800
                ${inPlaylist ? 'grayscale' : ''}`}>
                {song.thumbnailUrl
                  ? <img src={song.thumbnailUrl} alt={song.title} className='w-full h-full object-cover' />
                  : <div className='w-full h-full bg-gray-700' />
                }
              </div>

              {/* title */}
              <div className='flex-1 min-w-0'>
                <p className={`text-sm font-medium truncate ${inPlaylist ? 'text-gray-500' : 'text-white'}`}>
                  {song.title}
                </p>
                {inPlaylist && (
                  <p className='text-xs text-gray-600 mt-0.5'>Already in playlist</p>
                )}
              </div>

              {/* action indicator */}
              <div className='flex-shrink-0'>
                {inPlaylist ? (
                  // greyed checkmark — already added
                  <div className='w-7 h-7 rounded-full border-2 border-gray-700
                    flex items-center justify-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 text-gray-700'
                      viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                    </svg>
                  </div>
                ) : isSelected ? (
                  // orange filled checkmark — selected
                  <div className='w-7 h-7 rounded-full bg-orange-500
                    flex items-center justify-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 text-white'
                      viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                    </svg>
                  </div>
                ) : (
                  // orange plus — not yet selected
                  <div className='w-7 h-7 rounded-full border-2 border-orange-500
                    flex items-center justify-center'>
                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4 text-orange-500'
                      viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5}>
                      <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                    </svg>
                  </div>
                )}
              </div>

            </li>
          );
        })}
      </ul>

    </div>
  );
};

export default AddSongsSheet;