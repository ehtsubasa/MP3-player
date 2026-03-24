// frontend/src/pages/main/Search.jsx
import { useRef } from 'react';
import useSearchSong from '../../hooks/useSearchSong';
import useAllSongs from '../../hooks/useAllSongs';
import BottomNav from '../../components/BottomNav';

const Search = () => {
  const { songs } = useAllSongs();
  const {
    url, setUrl,
    result,
    searching, adding,
    searchError,
    handleSearch, handleAdd, handleClear,
  } = useSearchSong(songs);

  const inputRef = useRef(null);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className='bg-black min-h-screen text-white flex flex-col pb-20'>

      {/* header */}
      <div className='sticky top-0 bg-black z-10 px-4 pt-12 pb-3 border-b border-gray-800'>
        <h1 className='text-center text-lg font-bold'>Search</h1>
      </div>

      {/* search input */}
      <div className='px-4 pt-6'>
        <div className='flex items-center gap-2 bg-gray-900 rounded-full px-4 py-3 border border-gray-700'>
          {/* search icon */}
          <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-gray-500 flex-shrink-0' fill='none'
            viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
            <path strokeLinecap='round' strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
          </svg>

          <input
            ref={inputRef}
            type='text'
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder='Paste YouTube URL...'
            className='flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500'
          />

          {/* clear button — only shows when there's text */}
          {url.length > 0 && (
            <button onClick={handleClear} className='text-gray-500 active:text-white'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z' clipRule='evenodd' />
              </svg>
            </button>
          )}
        </div>

        {/* search button */}
        <button
          onClick={handleSearch}
          disabled={searching || url.length === 0}
          className='w-full mt-3 py-3 rounded-full bg-orange-500 text-white text-sm font-medium
            active:scale-95 transition-transform disabled:opacity-40 disabled:scale-100'>
          {searching ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* error */}
      {searchError && (
        <p className='px-4 mt-4 text-red-400 text-sm text-center'>{searchError}</p>
      )}

      {/* result */}
      {result && (
        <div className='px-4 mt-6'>

          {/* song row */}
          <div className='flex items-center gap-3 py-3 border-b border-gray-800'>

            {/* thumbnail */}
            <div className='w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-800'>
              <img
                src={result.thumbnailUrl}
                alt={result.title}
                className='w-full h-full object-cover'
              />
            </div>

            {/* title */}
            <div className='flex-1 min-w-0'>
              <p className='text-white text-sm font-medium truncate'>{result.title}</p>
            </div>

            {/* action button */}
            {result.exists ? (
              // already in library — show orange checkmark, disabled
              <div className='w-9 h-9 flex-shrink-0 flex items-center justify-center
                rounded-full border-2 border-orange-500'>
                <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-orange-500'
                  viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5}>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
                </svg>
              </div>
            ) : (
              // not in library — show orange plus button
              <button
                onClick={handleAdd}
                disabled={adding}
                className='w-9 h-9 flex-shrink-0 flex items-center justify-center
                  rounded-full border-2 border-orange-500 active:scale-95 transition-transform
                  disabled:opacity-40'>
                {adding ? (
                  <div className='w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin' />
                ) : (
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5 text-orange-500'
                    viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                  </svg>
                )}
              </button>
            )}
          </div>

          {/* back to search link */}
          {result.exists && (
            <button
              onClick={handleClear}
              className='mt-4 text-orange-500 text-sm flex items-center gap-1 active:opacity-70'>
              <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' viewBox='0 0 24 24'
                fill='none' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18' />
              </svg>
              Search another song
            </button>
          )}

          {/* success message after adding */}
          {result.exists && !adding && (
            <p className='mt-3 text-gray-500 text-xs'>
              Song is in your library
            </p>
          )}

        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Search;