import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import {spotifyAPI} from "../lib/spotify";

function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }

      spotifyAPI.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyAPI;
}

export default useSpotify;
