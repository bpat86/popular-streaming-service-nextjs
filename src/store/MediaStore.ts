import { create } from "zustand";

interface IMediaStore {
  isPlaying: boolean;
  isPaused: boolean;
  isMuted: boolean;
  mediaData: object;
  videoPlayback: {
    start: number | undefined;
    length: number | undefined;
  };
  setMediaData: (payload: any) => void;
}

export const useMediaStore = create<IMediaStore>((set) => ({
  isPlaying: false,
  isPaused: false,
  isMuted: false,
  mediaData: {},
  videoPlayback: {
    start: undefined,
    length: undefined,
  },
  setMediaData: (payload: any) => set({ mediaData: payload }),
  setPlaying: (payload: boolean) => set({ isPlaying: payload }),
  setPaused: (payload: boolean) => set({ isPaused: payload }),
  setMuted: (payload: boolean) => set({ isMuted: payload }),
  setVideoPlayback: (payload: {
    start: number | undefined;
    length: number | undefined;
  }) => set({ videoPlayback: payload }),
  // increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  // removeAllBears: () => set({ bears: 0 }),
}));

export default useMediaStore;
