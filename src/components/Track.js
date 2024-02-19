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
    <div>
      <h2>{songsData[currentSongIndex].song_name}</h2>
      <p>{songsData[currentSongIndex].artist_name}</p>
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