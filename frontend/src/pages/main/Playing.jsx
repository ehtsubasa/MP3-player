import usePlayerControls from '../../hooks/usePlayerControls';
import BottomNav from '../../components/BottomNav';

const Playing = () => {
  const {
    currentSong,
    isPlaying, togglePlay,
    isLooping, toggleLoop,

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
      <div className='relative mt-10 px-6'>
        <div className='flex items-center justify-center gap-8'>

          {/* heart */}
          <button
            type='button'
            className='absolute left-7 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 transition-all duration-200 hover:text-red-400 hover:scale-110 active:scale-100'
            aria-label='Like'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 28 28'
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.74 0-3.249.99-4 2.438-.751-1.447-2.26-2.438-4-2.438-2.485 0-4.5 2.015-4.5 4.5 0 7.22 8.5 12 8.5 12s8.5-4.78 8.5-12Z'
              />
            </svg>
          </button>

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
        </div>

        {/* loop */}
        <button
          onClick={toggleLoop}
          className={`absolute right-7 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 ${
            isLooping
            ? 'text-orange-500 scale-105'
            : 'text-gray-500 hover:text-gray-300 hover:scale-105'
          }`}
          aria-label="Toggle loop"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 28 28"
            className="w-6 h-6"
            fill="currentColor"
          >
          <path d="M24.6,11.5c-0.3-0.5-0.9-0.6-1.4-0.3c-0.5,0.3-0.6,0.9-0.3,1.4c0.7,1,1,2.2,1,3.4c0,3.3-2.7,6-6,6h-4c-3.3,0-6-2.7-6-6
            s2.7-6,6-6h3v1.4c0,0.4,0.2,0.7,0.6,0.9c0.1,0.1,0.3,0.1,0.4,0.1c0.2,0,0.4-0.1,0.6-0.2l3-2.4C21.9,9.6,22,9.3,22,9
            s-0.1-0.6-0.4-0.8l-3-2.4c-0.3-0.2-0.7-0.3-1.1-0.1C17.2,5.9,17,6.2,17,6.6V8h-3c-4.4,0-8,3.6-8,8s3.6,8,8,8h4c4.4,0,8-3.6,8-8
            C26,14.4,25.5,12.8,24.6,11.5z"
          />
        </svg>
      </button>

      </div>
      <BottomNav /> 

    </div>
  );
};

export default Playing;
