// frontend/src/pages/Home.jsx
import BottomNav from '../../components/BottomNav';

// placeholder song data — replace with API data later
const mockSongs = [
  { id: '1', title: '"Từ Em Mà Ra" (Whisky x Freak D Lofi...', channel: 'Freak D Music', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '2', title: "'W0LF四堅情' 邱鋒澤 FENG ZE, 陳零...", channel: 'Feng Ze邱鋒澤', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '3', title: '( 在上海住一晚) One Night In Shangh...', channel: 'TínT', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '4', title: '(BAE) TĂNG DUY TÂN - DẠ VŨ | Offic...', channel: 'Tăng Duy Tân', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '5', title: '(Vietsub+Kara) Không hoa - Mộ Hàn...', channel: 'Nguyệt Bạch', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '6', title: '1 Hour of Genshin Impact Qingce Vill...', channel: 'ASMR Mobile Gaming', thumbnail: null },
  { id: '7', title: '10 minute music of Cookie run kingdo...', channel: "Nick anna's brother", thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '8', title: '[ BMFxP.A.M ] Họa - BigP ft APJ || Vid...', channel: 'Viet Rap Entertainment', thumbnail: null },
  { id: '9', title: '[ Kara + Vietsub ] Hà sở văn - Winky...', channel: 'Winky Thi', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
  { id: '10', title: '[ Vietsub + Pinyin ] Vấn Tửu - Diêu Hi...', channel: 'Hạc Quán Sơn Trang - 鶴鶴山庄', thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg' },
];

const Home = () => {
  return (
    <div className='bg-black min-h-screen text-white'>

      {/* header */}
      <div className='sticky top-0 bg-black z-10 px-4 pt-10 pb-3 border-b border-gray-800'>
        <h1 className='text-center text-lg font-bold'>All Songs</h1>
      </div>

      {/* song list */}
      <ul className='pb-20'>
        {mockSongs.map(song => (
          <li key={song.id}
            className='flex items-center gap-3 px-4 py-3 border-b border-gray-800 active:bg-gray-900 cursor-pointer'>

            {/* thumbnail */}
            <div className='w-16 h-16 flex-shrink-0 bg-gray-800 rounded overflow-hidden'>
              {song.thumbnail ? (
                <img src={song.thumbnail} alt={song.title}
                  className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full bg-gray-700' />
              )}
            </div>

            {/* text */}
            <div className='flex-1 min-w-0'>
              <p className='text-white text-sm font-medium truncate'>{song.title}</p>
              <p className='text-gray-400 text-xs mt-0.5 truncate'>{song.channel}</p>
            </div>

          </li>
        ))}
      </ul>

      <BottomNav />
    </div>
  );
};

export default Home;