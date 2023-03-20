import { create } from "zustand";

interface IInteractionStore {
  activeProfile: string | undefined;
  setActiveProfile: (payload: string) => void;
  tooltipsEnabled: boolean;
  setTooltipsEnabled: (payload: boolean) => void;
  watchModeEnabled: boolean;
  setWatchModeEnabled: (payload: boolean) => void;
  navigationScrollY: number;
  setNavigationScrollY: (payload: number) => void;
  modalIsOpen: boolean;
  setModalIsOpen: (payload: boolean) => void;
  modalIsAnimating: boolean;
  setModalIsAnimating: (payload: boolean) => void;
}

export const useInteractionStore = create<IInteractionStore>((set) => ({
  activeProfile: undefined,
  setActiveProfile: (payload: string) => set({ activeProfile: payload }),
  tooltipsEnabled: true,
  setTooltipsEnabled: (payload: boolean) => set({ tooltipsEnabled: payload }),
  watchModeEnabled: false,
  setWatchModeEnabled: (payload: boolean) => set({ watchModeEnabled: payload }),
  navigationScrollY: 0,
  setNavigationScrollY: (payload: number) =>
    set({ navigationScrollY: payload }),
  modalIsOpen: false,
  setModalIsOpen: (payload: boolean) => set({ modalIsOpen: payload }),
  modalIsAnimating: false,
  setModalIsAnimating: (payload: boolean) => set({ modalIsAnimating: payload }),
}));

export default useInteractionStore;
