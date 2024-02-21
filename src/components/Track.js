import React, { useState, useRef, useEffect } from 'react';
import { songsData } from '../constants/data.js';

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Initialize or update the audioRef.current with the current song
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(songsData[currentSongIndex].song_url);
    
    // Automatically play the new song if isPlaying is true
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.error('Playback was prevented:', e));
    }

    // Add an event listener to handle automatic playback when the song ends
    const handleSongEnd = () => {
      goToNextSong();
    };

    audioRef.current.addEventListener('ended', handleSongEnd);

    return () => {
      audioRef.current.removeEventListener('ended', handleSongEnd);
    };
  }, [currentSongIndex]);

  // Effect to toggle play/pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch((e) => console.error('Playback was prevented:', e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const goToNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
  };

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    goToNextSong();
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : songsData.length - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-800 text-white">
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prevSongHandler} className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-full">
          Prev
        </button>
        <button onClick={playPauseHandler} className="px-4 py-2 text-lg bg-blue-500 hover:bg-blue-400 rounded-full">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextSongHandler} className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-full">
          Next
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-xl">Now playing: <span className="text-blue-400">{songsData[currentSongIndex].song_name}</span></p>
        <p className="text-lg">by <span className="text-blue-400">{Array.isArray(songsData[currentSongIndex].artist_name) ? songsData[currentSongIndex].artist_name.join(", ") : songsData[currentSongIndex].artist_name}</span></p>
      </div>
    </div>
  );
};

export default Track;