import "~/styles/musicPlayer.css";
import { React, useState, useEffect, useRef, useCallback } from "react";
import {
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsPlayFill,
  BsPauseFill,
} from "react-icons/bs";

export function PreviewMusicPlayer({ currentSong }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [volume, setVolume] = useState(15);
  const [isMute, setIsMute] = useState(false);

  const audioPlayer = useRef(); //Ref audio tag
  const progressBar = useRef(); //Ref musicBar input tag to keep up with audioPlayer's currentTime
  const volumeRange = useRef(); //Ref volumeBar input tag

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //Formats & sets duration time if audio metadata available, on initial loading
  useEffect(() => {
    setDuration(audioPlayer.current.duration);
    progressBar.current.max = audioPlayer.current.duration;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  // Follows volume level changes
  useEffect(() => {
    if (audioPlayer) {
      audioPlayer.current.volume = volume / 100;
    }
  }, [volume]);

  // Button - play/pauses song w/image when clicked
  const onPlaying = () => {
    const dur = audioPlayer.current.duration;
    const ct = audioPlayer.current.currentTime;
    if (ct === dur) {
      togglePlayPause();
      console.log("They are even");
    } else {
      progressBar.current.value = audioPlayer.current.currentTime;
      setCurrentTime(progressBar.current.value);
      console.log("Dont know if i want this");
    }
  };

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      audioPlayer.current.play();
      console.log("Animation play button");
    } else {
      audioPlayer.current.pause();
      console.log("Animation pause button");
    }
  }, [isPlaying]);

  // Formats currentTime and duration seconds
  const calculateTime = (secs) => {
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `0:${returnedSeconds}`;
  };

  // Tracks song duration when manually changing song position
  const durationChange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    setCurrentTime(audioPlayer.current.currentTime);
    console.log("duration change");
  };

  return (
    <div id="audioPlayer">
      <p>{currentSong.songName}</p>
      <div id="musicArea">
        <audio
          ref={audioPlayer}
          src={currentSong.songUrl}
          preload="metadata"
          muted={isMute}
          onTimeUpdate={onPlaying}
        ></audio>
        <button id="playPause" onClick={togglePlayPause}>
          {isPlaying ? (
            <BsPauseFill id="playPauseIcon" />
          ) : (
            <BsPlayFill id="playPauseIcon" />
          )}
        </button>

        <span id="currentTime">
          {!isNaN(currentTime) && calculateTime(currentTime)}
        </span>
        <input
          type="range"
          id="musicBar"
          ref={progressBar}
          defaultValue={0}
          onChange={durationChange}
          style={{
            "--progress-width": `${
              (Math.floor(currentTime) / Math.floor(duration)) * 100 + "%"
            }`,
          }}
        ></input>
        <span id="totalDuration">
          {!isNaN(duration) && calculateTime(duration)}
        </span>
      </div>

      <div id="volumeArea">
        <button id="volumeMute">
          {isMute ? (
            <BsFillVolumeMuteFill
              id="volumeMuteIcon"
              onClick={() => setIsMute(!isMute)}
            />
          ) : volume <= 5 ? (
            <BsFillVolumeMuteFill
              id="volumeMuteIcon"
              onClick={() => setIsMute(!isMute)}
            />
          ) : (
            <BsFillVolumeUpFill
              id="volumeMuteIcon"
              onClick={() => setIsMute(!isMute)}
            />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
          }}
          style={{ "--progress-width": `${volume + "%"}` }}
          ref={volumeRange}
          id="volumeBar"
        ></input>
        {/* <button id="previeww"> { currentMusic ? <previewMusicPlayer music={currentMusic}/> : <BlankStateOtherwise/>} </button> */}
      </div>
    </div>
  );
}
