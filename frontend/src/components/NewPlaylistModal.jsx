// frontend/src/components/NewPlaylistModal.jsx
import { useState } from 'react';

const NewPlaylistModal = ({ onClose, onCreate, creating }) => {
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await onCreate(name.trim());
  };

  return (
    <div className='fixed inset-0 z-50 flex flex-col bg-black bg-opacity-90'>
      <div className='flex items-center justify-between px-4 pt-12 pb-4 border-b border-gray-800'>
        <button onClick={onClose} className='text-orange-500 text-sm font-medium'>
          Cancel
        </button>
        <p className='text-white text-base font-bold'>New Playlist</p>
        <button
          onClick={handleCreate}
          disabled={!name.trim() || creating}
          className={`text-sm font-medium ${name.trim() && !creating ? 'text-white' : 'text-gray-600'}`}>
          {creating ? 'Creating...' : 'Create'}
        </button>
      </div>

      <div className='px-4 pt-8 border-b border-gray-800 pb-4'>
        <input
          type='text'
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder='Playlist name'
          className='w-full bg-transparent text-white text-lg outline-none
            placeholder-gray-600 border-l-2 border-orange-500 pl-3'
        />
      </div>
    </div>
  );
};

export default NewPlaylistModal;