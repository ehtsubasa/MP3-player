import { createContext, useContext, useState, useRef } from 'react';

export const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error('usePlayer must be used within a PlayerContextProvider');
  }
  return context;
};

export const PlayerContextProvider = ({ children }) => {
  const [currentQueue, setCurrentQueue]   = useState([]);
  const [currentIndex, setCurrentIndex]   = useState(0);
  const [isPlaying,    setIsPlaying]      = useState(false);
  const [isLooping,    setIsLooping]      = useState(false);
  const [queueName,    setQueueName]      = useState('');
  const audioRef = useRef(null);

  const playSong = (songs, index, name = 'All Songs') => {
    setCurrentQueue(songs);
    setCurrentIndex(index);
    setIsPlaying(true);
    setQueueName(name);
  };

  const currentSong = currentQueue[currentIndex] || null;

  const playNext = () => {
    if (currentIndex < currentQueue.length - 1)
      setCurrentIndex(i => i + 1);
    else setCurrentIndex(0);
  };

  const playPrev = () => {
    if (currentIndex > 0)
      setCurrentIndex(i => i - 1);
    else setCurrentIndex(currentQueue.length - 1);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, currentQueue, currentIndex,
      isPlaying, setIsPlaying,
      isLooping, setIsLooping,
      queueName, playSong, playNext, playPrev,
      audioRef,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
