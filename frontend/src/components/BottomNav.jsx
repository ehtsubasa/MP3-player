// frontend/src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const baseClass = 'flex flex-col items-center gap-1 text-xs font-medium text-gray-500';
  const activeClass = 'text-orange-500';

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center h-16 z-50'>

      <NavLink to='/' end className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : ''}`}>
        {({ isActive }) => (
          <>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill={isActive ? 'currentColor' : 'none'}
              viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' />
            </svg>
            <span>All Songs</span>
          </>
        )}
      </NavLink>

      <NavLink to='/playlist' className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : ''}`}>
        {({ isActive }) => (
          <>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none'
              viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z' />
            </svg>
            <span>Playlists</span>
          </>
        )}
      </NavLink>

      <NavLink to='/search' className={({ isActive }) =>
        `${baseClass} ${ isActive ? activeClass : ''}`}>
        {({ isActive }) => (
          <>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill='none'
              viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z' />
            </svg>
            <span>Search</span>
          </>
        )}
      </NavLink>

      <NavLink to='/playing' className={({ isActive }) =>
        `${baseClass} ${isActive ? activeClass : ''}`}>
        {({ isActive }) => (
          <>
            <svg xmlns='http://www.w3.org/2000/svg' className='w-6 h-6' fill={isActive ? 'currentColor' : 'none'}
              viewBox='0 0 24 24' stroke='currentColor' strokeWidth={1.5}>
              <path strokeLinecap='round' strokeLinejoin='round'
                d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z' />
            </svg>
            <span>Playing</span>
          </>
        )}
      </NavLink>

    </nav>
  );
};

export default BottomNav;