import BottomNav from '../../components/BottomNav';
import useAllSongs from '../../hooks/useAllSongs';
import {usePlayer} from '../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

// placeholder song data — replace with API data later
//const mockSongs = [
//  { id: '1', title: '"Từ Em Mà Ra" (Whisky x Freak D Lofi...', channel: 'Freak D Music', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '2', title: "'W0LF四堅情' 邱鋒澤 FENG ZE, 陳零...", channel: 'Feng Ze邱鋒澤', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '3', title: '( 在上海住一晚) One Night In Shangh...', channel: 'TínT', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '4', title: '(BAE) TĂNG DUY TÂN - DẠ VŨ | Offic...', channel: 'Tăng Duy Tân', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '5', title: '(Vietsub+Kara) Không hoa - Mộ Hàn...', channel: 'Nguyệt Bạch', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '6', title: '1 Hour of Genshin Impact Qingce Vill...', channel: 'ASMR Mobile Gaming', thumbnail: null },
//  { id: '7', title: '10 minute music of Cookie run kingdo...', channel: "Nick anna's brother", thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '8', title: '[ BMFxP.A.M ] Họa - BigP ft APJ || Vid...', channel: 'Viet Rap Entertainment', thumbnail: null },
//  { id: '9', title: '[ Kara + Vietsub ] Hà sở văn - Winky...', channel: 'Winky Thi', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//  { id: '10', title: '[ Vietsub + Pinyin ] Vấn Tửu - Diêu Hi...', channel: 'Hạc Quán Sơn Trang - 鶴鶴山庄', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
//];


const Home = () => {
  const { songs, loading, error } = useAllSongs();
  const { playSong } = usePlayer();
  const navigate = useNavigate();

  const handleSongClick = (index) => {
    playSong(songs, index, 'All Songs');
    navigate('/playing');
  };

  return (
    <div className='bg-black min-h-screen text-white'>

      {/* header */}
      <div className='sticky top-0 bg-black z-10 px-4 pt-12 pb-3 border-b border-gray-800'>
        <h1 className='text-center text-3xl font-bold'>All Songs</h1>
      </div>

      {/* loading */}
      {loading && (
        <div className='flex justify-center items-center pt-20'>
          <p className='text-gray-500 text-sm'>Loading songs...</p>
        </div>
      )}

      {/* error */}
      {error && (
        <div className='flex justify-center items-center pt-20'>
          <p className='text-red-400 text-sm'>{error}</p>
        </div>
      )}

      {/* empty */}
      {!loading && !error && songs.length === 0 && (
        <div className='flex justify-center items-center pt-20'>
          <p className='text-gray-500 text-sm'>No songs yet. Add one!</p>
        </div>
      )}

      {/* song list — pb-20 clears bottom nav, no extra top padding needed
          because sticky header stays in flow */}
      {!loading && !error && songs.length > 0 && (
        <ul className='pb-20'>
          {songs.map((song, index) => (
            <li
              key={song._id}
              onClick={() => handleSongClick(index)}
              className='flex items-center gap-2 px-3 py-3 border-b border-gray-800 cursor-pointer'>

              {/* thumbnail */}
              <div className='w-16 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden'>
                {song.thumbnailUrl ? (
                  <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full bg-gray-700' />
                )}
              </div>

              {/* text */}
              <div className='flex-1 min-w-0'>
                <p className='text-white text-sm font-medium truncate'>{song.title}</p>
              </div>

            </li>
          ))}
        </ul>
      )}

      <BottomNav />
    </div>
  );
};

export default Home;