import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import usePlaylistDetail from '../../hooks/usePlaylistDetail';
import AddSongsSheet from '../../components/AddSongsSheet';


const PlaylistDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { playlist, loading, rename, deletePlaylist, addSongs } = usePlaylistDetail(id);

  const [editMode,   setEditMode]   = useState(false);
  const [editName,   setEditName]   = useState('');
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [showPicker,  setShowPicker]  = useState(false);


  const handleRenameOpen = () => {
    setEditName(playlist.name);
    setEditMode(true);
  };

  const handleRenameSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    const ok = await rename(editName.trim());
    setSaving(false);
    if (ok) setEditMode(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const ok = await deletePlaylist();
    setDeleting(false);
    if (ok) navigate('/playlist');
  };

  const handleAddSongs = async (songIds) => {
    const ok = await addSongs(songIds);
    if (ok) setShowPicker(false);
  };

  if (loading) {
    return (
      <div className='bg-black min-h-screen text-white flex items-center justify-center pb-20'>
        <p className='text-gray-500 text-sm'>Loading...</p>
        <BottomNav />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className='bg-black min-h-screen text-white flex items-center justify-center pb-20'>
        <p className='text-red-400 text-sm'>Playlist not found.</p>
        <BottomNav />
      </div>
    );
  }

  const thumbs = (playlist.songs || []).slice(0, 4).filter(s => s.thumbnailUrl);
  const playlistSongIds = (playlist.songs || []).map(s =>
    typeof s === 'object' ? s._id : s
  );

  return (
    <div className='bg-black min-h-screen text-white flex flex-col pb-20'>

      {/* header */}
      <div className='flex items-center justify-between px-4 pt-12 pb-4'>
        <button onClick={() => navigate('/playlist')} className='text-orange-500'>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none'
            viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
          </svg>
        </button>
        <div className='w-6' />
      </div>

      {/* cover */}
      <div className='flex justify-center px-6 mt-2'>
        <div className='w-52 h-52 bg-gray-900 rounded-xl overflow-hidden
          flex items-center justify-center'>
          {thumbs.length === 0 ? (
            <svg xmlns='http://www.w3.org/2000/svg' className='w-20 h-20 text-gray-700'
              fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' />
            </svg>
          ) : (
            <div className='w-full h-full grid grid-cols-2'>
              {[0, 1, 2, 3].map(i => (
                thumbs[i]
                  ? <img key={i} src={thumbs[i].thumbnailUrl} alt=''
                      className='w-full h-full object-cover' />
                  : <div key={i} className='bg-gray-800' />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* name — inline edit or display */}
      <div className='text-center mt-4 px-4'>
        {editMode ? (
          <div className='flex items-center justify-center gap-2'>
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleRenameSave()}
              className='bg-gray-900 text-white text-xl font-bold text-center
                rounded-lg px-3 py-1 outline-none border border-orange-500 w-48'
            />
            <button onClick={handleRenameSave} disabled={saving}
              className='text-orange-500 text-sm font-medium'>
              {saving ? '...' : 'Save'}
            </button>
            <button onClick={() => setEditMode(false)}
              className='text-gray-500 text-sm'>
              Cancel
            </button>
          </div>
        ) : (
          <p className='text-white text-xl font-bold'>{playlist.name}</p>
        )}
        <p className='text-gray-500 text-sm mt-1'>
          {new Date(playlist.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          })} · {playlist.songs?.length || 0} tracks
        </p>
      </div>

      {/* action buttons */}
      <div className='flex justify-center gap-8 mt-6'>

        {/* add songs */}
        <button onClick={() => setShowPicker(true)}
            className='flex flex-col items-center gap-1'>
            <div className='w-12 h-12 rounded-full bg-orange-800 bg-opacity-60
              flex items-center justify-center'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6 text-orange-400'
                fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
              </svg>
            </div>
        </button>  

        {/* rename */}
        <button onClick={handleRenameOpen}
          className='flex flex-col items-center gap-1'>
          <div className='w-12 h-12 rounded-full bg-orange-800 bg-opacity-60
            flex items-center justify-center'>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-orange-400'
              fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125' />
            </svg>
          </div>
        </button>

        {/* delete */}
        <button onClick={() => setConfirmDel(true)}
          className='flex flex-col items-center gap-1'>
          <div className='w-12 h-12 rounded-full bg-orange-800 bg-opacity-60
            flex items-center justify-center'>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-orange-400'
              fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0' />
            </svg>
          </div>
        </button>

      </div>

      {/* empty state */}
      {playlist.songs?.length === 0 && (
        <div className='flex flex-col items-center justify-center mt-16 px-8 gap-4'>
          <p className='text-gray-500 text-sm text-center'>
            Add tracks to this playlist from your library.
          </p>
          <button className='px-8 py-3 rounded-full border border-orange-500
            text-orange-500 text-sm font-medium active:opacity-70'>
            Add Tracks
          </button>
        </div>
      )}

      {/* song list */}
      {playlist.songs?.length > 0 && (
        <ul className='mt-4'>
          {playlist.songs.map(song => (
            <li key={song._id}
              className='flex items-center gap-3 px-4 py-3 border-b border-gray-800'>
              <div className='w-12 h-12 flex-shrink-0 bg-gray-800 rounded overflow-hidden'>
                <img src={song.thumbnailUrl} alt={song.title}
                  className='w-full h-full object-cover' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-white text-sm font-medium truncate'>{song.title}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* delete confirmation overlay */}
      {confirmDel && (
        <div className='fixed inset-0 z-50 bg-black bg-opacity-80
          flex items-center justify-center px-8'>
          <div className='bg-gray-900 rounded-2xl p-6 w-full max-w-sm'>
            <p className='text-white text-base font-bold text-center mb-2'>
              Delete Playlist
            </p>
            <p className='text-gray-400 text-sm text-center mb-6'>
              "{playlist.name}" will be permanently deleted.
            </p>
            <div className='flex gap-3'>
              <button onClick={() => setConfirmDel(false)}
                className='flex-1 py-3 rounded-full border border-gray-700
                  text-gray-400 text-sm font-medium'>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className='flex-1 py-3 rounded-full bg-red-600
                  text-white text-sm font-medium disabled:opacity-50'>
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />

      {/* add songs sheet — full screen overlay */}
      {showPicker && (
        <AddSongsSheet
          playlistSongIds={playlistSongIds}
          onClose={() => setShowPicker(false)}
          onAdd={handleAddSongs}
        />
      )}
    </div>
  );
};

export default PlaylistDetail;
