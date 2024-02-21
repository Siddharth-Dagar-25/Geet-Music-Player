import React, { useState, useRef, useEffect } from 'react';
import { songsData } from '../constants/data.js';

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Store the audio element in a ref to persist the same audio element across re-renders
  const audioRef = React.useRef(new Audio(songsData[0].song_url));

  useEffect(() => {
    // This effect toggles play/pause based on isPlaying state
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]); // Re-run this effect when isPlaying changes

  useEffect(() => {
    // Stop and clean up the current song before switching
    const switchSong = () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = new Audio(songsData[currentSongIndex].song_url);
      if (isPlaying) {
        audioRef.current.play();
      }
    };
    switchSong();

    return () => {
      audioRef.current.pause();
    };
  }, [currentSongIndex]); // Re-run this effect when currentSongIndex changes

  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : songsData.length - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prevSongHandler} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full">
          Prev
        </button>
        <button onClick={playPauseHandler} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-full">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextSongHandler} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full">
          Next
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-lg">Now playing: <span className="text-blue-400">{songsData[currentSongIndex].song_name}</span></p>
        <p>by <span className="text-blue-400">{Array.isArray(songsData[currentSongIndex].artist_name) ? songsData[currentSongIndex].artist_name.join(", ") : songsData[currentSongIndex].artist_name}</span></p>
      </div>
    </div>
  );
};

export default Track;