import React, { useState, useRef, useEffect, useCallback } from 'react';
import { songsData } from '../constants/data.js';
import FeedbackForm from './FeedbackForm.js';
import TotalSongsScript from './TotalSongsScript.js';
import { FaVolumeDown } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { IoPlaySkipForwardSharp } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { MdLoop } from "react-icons/md";
import { FcMusic } from "react-icons/fc";

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const setAudioData = useCallback(() => {
    setDuration(audioRef.current.duration);
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const updateProgress = useCallback(() => {
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const onSongEnd = useCallback(() => {
    if (!isLooping) {
      setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
    }
  }, [isLooping]);

  useEffect(() => {
    const currentAudio = audioRef.current;
  
    // Function to attempt playback
    const tryPlay = () => {
      // Only attempt to play if isPlaying is true
      if (isPlaying) {
        currentAudio.play().catch((e) => console.error('Playback was prevented:', e));
      }
    };
  
    // Set src only if it's different to avoid reloading
    if (currentAudio.src !== songsData[currentSongIndex].song_url) {
      currentAudio.src = songsData[currentSongIndex].song_url;
      // Once the source is set, the loadeddata event will fire, indicating the media is ready to play.
      // We leverage this event to attempt playback, ensuring it respects the autoplay policy.
      currentAudio.addEventListener('loadeddata', tryPlay);
    }
  
    currentAudio.loop = isLooping;
  
    currentAudio.addEventListener('loadeddata', setAudioData);
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', onSongEnd);
  
    // Cleanup function to remove event listeners
    return () => {
      currentAudio.removeEventListener('loadeddata', setAudioData);
      currentAudio.removeEventListener('timeupdate', updateProgress);
      currentAudio.removeEventListener('ended', onSongEnd);
      currentAudio.removeEventListener('loadeddata', tryPlay); // Ensure to remove tryPlay listener as well
    };
  }, [currentSongIndex, isLooping, isPlaying, setAudioData, updateProgress, onSongEnd]);  

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const playPause = async () => {
      if (isPlaying) {
        await audioRef.current.play().catch((e) => console.error('Playback was prevented:', e));
      } else {
        audioRef.current.pause();
      }
    };

    playPause();
  }, [isPlaying]);

  // This useEffect hook ensures that changes to isLooping directly update the loop property.
  useEffect(() => {
    audioRef.current.loop = isLooping;
  }, [isLooping]);

  const playPauseHandler = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const nextSongHandler = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
  }, []);

  const prevSongHandler = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : songsData.length - 1));
  }, []);

  const toggleLoopHandler = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  const changeProgressBar = useCallback((e) => {
    const width = progressBarRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const volumeControlHandler = (e) => {
    setVolume(e.target.value);
  };

  const searchSongs = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredSongs = songsData.filter((song) =>
      song.song_name.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredSongs);
  };

  const selectSongFromSearch = (index) => {
    const songIndex = songsData.findIndex((song) => song.song_name === searchResults[index].song_name);
    setCurrentSongIndex(songIndex);
    setSearchQuery('');
    setSearchResults([]);
    setIsPlaying(true); // Auto-play selected song
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-800 text-white">
      <div className='absolute bottom-8 left-0 p-4'>
        <TotalSongsScript/>
      </div>
      <div className="absolute top-0 right-0 p-4">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => searchSongs(e.target.value)}
          className="p-2 m-2 bg-gray-700 text-white rounded-xl"
        />
        {searchQuery && (
          <div className="absolute bg-gray-700 text-white w-56">
            {searchResults.length > 0 ? (
              searchResults.map((song, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => selectSongFromSearch(index)}
                >
                  {song.song_name}
                </div>
              ))
            ) : (
              <div className="p-2">Song is not available</div>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center space-x-4">
      <button onClick={toggleLoopHandler} className={`px-4 py-2 text-lg ${isLooping ? 'bg-green-500' : 'bg-gray-700'} rounded-full`}>
          {isLooping ? <MdLoop /> : <MdLoop />}
        </button>
        <button onClick={prevSongHandler} className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-full">
        <IoPlaySkipBackSharp />
        </button>
        <button onClick={playPauseHandler} className="px-4 py-4 text-lg bg-blue-500 hover:bg-blue-400 rounded-full">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={nextSongHandler} className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-full">
          <IoPlaySkipForwardSharp />
        </button>
        <button onClick={toggleLoopHandler} className={`px-4 py-2 text-lg ${isLooping ? 'bg-green-500' : 'bg-gray-700'} rounded-full`}>
          {isLooping ? <MdLoop /> : <MdLoop />}
        </button>
      </div>
      <div className='mt-8 text-center'>
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
      <div className="volume-control mt-4 flex gap-2">
      <FaVolumeDown />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={volumeControlHandler}
          className="volume-slider"
        />
        <FaVolumeUp />
      </div>
      <FeedbackForm />
    </div>
  );
}

export default Track;