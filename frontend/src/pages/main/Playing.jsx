import usePlayerControls from '../../hooks/usePlayerControls';
import BottomNav from '../../components/BottomNav';

const Playing = () => {
  const {
    currentSong,
    isPlaying, togglePlay,

    hasPrev, hasNext,
    playPrev, playNext,
    queueName,
  } = usePlayerControls();

  if (!currentSong) {
    return (
      <div className='bg-black min-h-screen text-white flex flex-col items-center justify-center pb-20'>
        <p className='text-gray-500 text-sm'>Nothing playing yet.</p>
        <p className='text-gray-600 text-xs mt-1'>Pick a song from All Songs.</p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className='bg-black min-h-screen text-white flex flex-col pb-20'>

      {/* header */}
      <div className='pt-10 pb-4 text-center px-4'>
        <p className='text-gray-400 text-xs uppercase tracking-widest'>Playing From</p>
        <p className='text-white font-bold text-base mt-0.5'>{queueName}</p>
      </div>

      {/* thumbnail */}
      <div className='w-full px-6'>
        <img
          src={currentSong.thumbnailUrl}
          alt={currentSong.title}
          className='w-full aspect-video object-cover rounded-lg bg-gray-900'
        />
      </div>

      {/* song info */}
      <div className='px-6 mt-6'>
        <p className='text-white font-bold text-xl leading-snug'>{currentSong.title}</p>
      </div>

      {/* controls */}
      <div className='flex items-center justify-center gap-10 mt-10'>

        {/* prev */}
        <button onClick={playPrev} disabled={!hasPrev}
          className={`transition-opacity ${hasPrev ? 'text-orange-500' : 'text-gray-700 opacity-40'}`}>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-9 h-9' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V8.69c0-1.44-1.555-2.343-2.805-1.628L12 11.029v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z' />
          </svg>
        </button>

        {/* play / pause */}
        <button onClick={togglePlay}
          className='w-20 h-20 rounded-full bg-orange-700 flex items-center justify-center text-white active:scale-95 transition-transform'>
          {isPlaying ? (
            <svg xmlns='http://www.w3.org/2000/svg' className='w-9 h-9' viewBox='0 0 24 24' fill='currentColor'>
              <path fillRule='evenodd' d='M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V5.25z' clipRule='evenodd' />
            </svg>
          ) : (
            <svg xmlns='http://www.w3.org/2000/svg' className='w-9 h-9 ml-1' viewBox='0 0 24 24' fill='currentColor'>
              <path fillRule='evenodd' d='M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z' clipRule='evenodd' />
            </svg>
          )}
        </button>

        {/* next */}
        <button onClick={playNext} disabled={!hasNext}
          className={`transition-opacity ${hasNext ? 'text-orange-500' : 'text-gray-700 opacity-40'}`}>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-9 h-9' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256L14.805 7.06C13.555 6.346 12 7.25 12 8.688v2.34L5.055 7.06z' />
          </svg>
        </button>

        {/* loop 
        <button onClick={toggleLoop}
          className={`flex flex-col items-center transition-colors ${isLooping ? 'text-orange-500' : 'text-gray-500'}`}>
          <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12c0 3.728-3.022 6.75-6.75 6.75S6 15.728 6 12s3.022-6.75 6.75-6.75c1.908 0 3.627.79 4.853 2.054M19.5 12V8.25m0 0h-3.75M19.5 8.25' />
          </svg>
          <span className='text-xs mt-0.5'>1</span>
        </button> */}

      </div>
      <BottomNav /> 

    </div>
  );
};

export default Playing;
