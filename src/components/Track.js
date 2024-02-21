import React, { useState, useRef, useEffect } from 'react';
import { songsData } from '../constants/data.js';

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(songsData[0].song_url));

  // Function to go to the next song
  const goToNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
  };

  useEffect(() => {
    // Event listener for when the song ends
    const songEnded = () => {
      goToNextSong();
    };

    // Add event listener for the 'ended' event
    const currentAudio = audioRef.current;
    currentAudio.addEventListener('ended', songEnded);

    // Play the song if isPlaying is true
    if (isPlaying) {
      currentAudio.play().catch((e) => console.error(e));
    }

    // Cleanup function to remove the event listener
    return () => {
      currentAudio.removeEventListener('ended', songEnded);
    };
  }, [isPlaying]); // This effect depends on isPlaying

  useEffect(() => {
    // Function to switch song
    const switchSong = () => {
      const currentAudio = audioRef.current;
      currentAudio.src = songsData[currentSongIndex].song_url;
      if (isPlaying) {
        currentAudio.play().catch((e) => console.error(e));
      }
    };

    switchSong();

    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, [currentSongIndex]); // This effect depends on currentSongIndex

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
