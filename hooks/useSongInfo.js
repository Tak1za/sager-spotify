import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

function useSongInfo() {
  const spotifyAPI = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      const trackInfo = await spotifyAPI
        .getTrack(currentTrackId)
        .then((res) => res.body);

      setSongInfo(trackInfo);
    };

    if (currentTrackId) {
      fetchSongInfo();
    }
  }, [currentTrackId, spotifyAPI]);

  return songInfo;
}

export default useSongInfo;
