import React, { useState } from 'react';
import { songsData } from '../constants/data.js';

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playSong = () => {
    setIsPlaying(true);
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const playNextSong = () => {
    const newIndex = (currentSongIndex + 1) % songsData.length;
    setCurrentSongIndex(newIndex);
    playSong();
  };

  const playPreviousSong = () => {
    const newIndex = (currentSongIndex - 1 + songsData.length) % songsData.length;
    setCurrentSongIndex(newIndex);
    playSong();
  };

  return (
    <div className='bg-gray-500 h-screen'>
      <h1 className='flex justify-center text-4xl pt-10'>Hello! 👋</h1>
      
      <div className='flex pt-16 items-center justify-evenly px-36'>
        <div className='bg-red-100 h-60 w-60'>
            prev
        </div>
        <div className='bg-red-500 h-80 w-80 gap-5'>
            curr
        </div>
        <div className='bg-red-800 h-60 w-60'>
            next
        </div>
      </div>

      <h2>{songsData[currentSongIndex].song_name}</h2>
      <p>{songsData[currentSongIndex].artist_name}</p>

      <h2>{songsData[Math.abs(currentSongIndex - 1) % songsData.length].song_name}</h2>
      <p>{songsData[Math.abs(currentSongIndex - 1 - songsData.length) % songsData.length].artist_name}</p>

      <h2>{songsData[(currentSongIndex + 1) % songsData.length].song_name}</h2>
      <p>{songsData[(currentSongIndex + 1) % songsData.length].artist_name}</p>
      
      <audio
        src={songsData[currentSongIndex].song_url}
        autoPlay={isPlaying}
        onPause={pauseSong}
        onEnded={playNextSong}
      />
      <button onClick={playPreviousSong}>Previous</button>
      <button onClick={isPlaying ? pauseSong : playSong}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={playNextSong}>Next</button>
    </div>
  );
};

export default Track;