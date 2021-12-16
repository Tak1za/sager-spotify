import { ChevronDownIcon, PlayIcon } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { signOut } from "next-auth/react";
import { currentTrackIdState } from "../atoms/songAtom";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Center() {
  const spotifyAPI = useSpotify();
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  const pickTrackToPlayFromPlaylist = () => {
    let shuffledItem = shuffle(playlist?.tracks?.items).pop();
    let trackId = shuffledItem.track?.id;
    let trackURI = shuffledItem.track?.uri;
    setCurrentTrackId(trackId);
    return trackURI;
  };

  const handleStartPlaylist = () => {
    spotifyAPI.play({
      context_uri: playlist?.uri,
      offset: {
        uri: pickTrackToPlayFromPlaylist(),
      },
    });
  };

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyAPI
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.error(err));
  }, [spotifyAPI, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white"
          onClick={signOut}
        >
          <img className="rounded-full w-10 h-10" src={session?.user?.image} />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex items-end space-x-7 bg-gradient-to-b ${color} to-black  h-80 text-white p-8`}
      >
        <img src={playlist?.images?.[0].url} className="h-44 w-44 shadow-2xl" />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl">{playlist?.name}</h1>
          <PlayIcon className="button-big" onClick={handleStartPlaylist} />
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Center;
