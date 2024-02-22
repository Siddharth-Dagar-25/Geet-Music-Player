import React, { useState, useRef, useEffect } from 'react';
import { songsData } from '../constants/data.js'

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false); // State to manage loop status
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(songsData[currentSongIndex].song_url);
    audioRef.current.loop = isLooping; // Set the loop property based on isLooping state

    const setAudioData = () => {
      setDuration(audioRef.current.duration);
      setCurrentTime(audioRef.current.currentTime);
    };

    const updateProgress = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const onSongEnd = () => {
      if (!isLooping) { // Check if looping is not enabled to move to the next song
        goToNextSong();
      }
      // If looping is enabled, the audio element's loop attribute takes care of replaying the current track.
    };

    audioRef.current.addEventListener('loadeddata', setAudioData);
    audioRef.current.addEventListener('timeupdate', updateProgress);
    audioRef.current.addEventListener('ended', onSongEnd); // Listen for when the song ends

    if (isPlaying) {
      audioRef.current.play().catch((e) => console.log('Playback was prevented:', e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadeddata', setAudioData);
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('ended', onSongEnd); // Remove event listener on cleanup
      }
    };
  }, [currentSongIndex, isPlaying, isLooping]);

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

  // Handler to toggle loop state
  const toggleLoopHandler = () => {
    setIsLooping(!isLooping);
  };

  const changeProgressBar = (e) => {
    const width = progressBarRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (clickX / width) * duration;
  };

  const formatTime = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

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
        <button onClick={toggleLoopHandler} className={`px-4 py-2 text-lg ${isLooping ? 'bg-green-500' : 'bg-gray-700'} hover:bg-gray-600 rounded-full`}>
          {isLooping ? 'Looping' : 'Loop'}
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-xl">Now playing: <span className="text-blue-400">{songsData[currentSongIndex].song_name}</span></p>
        <p className="text-lg">by <span className="text-blue-400">{songsData[currentSongIndex].artist_name}</span></p>
      </div>
      <div className="flex items-center w-4/5 max-w-6xl mt-4">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <div className="flex-1 mx-4 bg-gray-700 rounded-full" onClick={changeProgressBar} ref={progressBarRef}>
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default Track;
