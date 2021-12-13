import { VolumeUpIcon as VolumeDownIcon } from "@heroicons/react/outline";
import {
  PlayIcon,
  RewindIcon,
  FastForwardIcon,
  PauseIcon,
  ReplyIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  currentTrackIdState,
  isPlayingState,
  isShuffleState,
  repeatState,
} from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
  const spotifyAPI = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);
  const [repeatMode, setRepeatMode] = useRecoilState(repeatState);
  const [isShuffle, setIsShuffle] = useRecoilState(isShuffleState);
  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyAPI.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrackId(data.body?.item?.id);

        spotifyAPI.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing);
          setIsShuffle(data.body?.shuffle_state);
          setRepeatMode(data.body?.repeat_state);
        });
      });
    }
  };

  const handlePlayPause = () => {
    spotifyAPI.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyAPI.pause();
        setIsPlaying(false);
      } else {
        spotifyAPI.play();
        setIsPlaying(true);
      }
    });
  };

  const handleShuffle = () => {
    const currentIsShuffle = isShuffle;
    spotifyAPI
      .setShuffle(!isShuffle)
      .then(() => setIsShuffle(!currentIsShuffle))
      .catch((err) => console.error(err));
  };

  const handleRepeat = () => {
    if (repeatMode == "off") {
      spotifyAPI
        .setRepeat("track")
        .then(() => setRepeatMode("track"))
        .catch((err) => console.error(err));
    } else if (repeatMode == "track") {
      spotifyAPI
        .setRepeat("off")
        .then(() => setRepeatMode("off"))
        .catch((err) => console.error(err));
    }
  };

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyAPI.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  useEffect(() => {
    if (spotifyAPI.getAccessToken()) {
      fetchCurrentSong();
    }
  }, [currentTrackId, spotifyAPI]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  return (
    <div className="p-5 h-30 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8 text-center">
      <div className="flex items-center space-x-4 justify-start">
        <img
          src={songInfo?.album?.images?.[0]?.url}
          className="hidden md:inline h-10 w-10"
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 justify-center">
        <SwitchHorizontalIcon
          className={`button ${isShuffle ? "text-green-500" : ""}`}
          onClick={handleShuffle}
        />
        <RewindIcon className="button" />
        {isPlaying ? (
          <PauseIcon className="button w-10 h-10" onClick={handlePlayPause} />
        ) : (
          <PlayIcon className="button w-10 h-10" onClick={handlePlayPause} />
        )}
        <FastForwardIcon className="button" />
        <ReplyIcon
          className={`button ${repeatMode === "track" ? "text-green-500" : ""}`}
          onClick={handleRepeat}
        />
      </div>

      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
          className="button"
          onClick={() => volume > 0 && setVolume(volume - 10)}
        />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          className="w-14 md:w-28"
        />
        <VolumeUpIcon
          className="button"
          onClick={() => volume < 100 && setVolume(volume + 10)}
        />
      </div>
    </div>
  );
}

export default Player;
