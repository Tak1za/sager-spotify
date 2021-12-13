import { atom } from "recoil";

export const currentTrackIdState = atom({
  key: "currentTrackIdState",
  default: null,
});

export const isPlayingState = atom({
  key: "isPlayingState",
  default: false,
});

export const repeatState = atom({
  key: "repeatState",
  default: "off",
});

export const isShuffleState = atom({
  key: "isShuffleState",
  default: false
})
