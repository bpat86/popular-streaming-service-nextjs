import { produce } from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

import { modalStateActions, previewModalActions } from "@/actions/Actions";

import { ImmerReducerProps, IPreviewModal, PreviewModalStore } from "./types";

// Default values for the preview modal.
const initialPreviewModalState = {
  billboardVideoMerchId: undefined,
  closeWithoutAnimation: false,
  isOpen: false,
  isMyListRow: false,
  listContext: undefined,
  modalState: undefined,
  model: undefined,
  onPreviewModalClose: undefined,
  sliderRow: undefined,
  titleCardId: undefined,
  titleCardRect: undefined,
  videoId: undefined,
  videoKey: undefined,
  videoModel: undefined,
  videoPlayback: {
    start: undefined,
    length: undefined,
  },
  videos: undefined,
};

// Default UI values in relation to the preview modal state.
const initialState = {
  galleryModalOpen: false,
  previewModalStateById: { undefined: {} as IPreviewModal },
  scrollPosition: undefined,
  wasOpen: false,
};

const immerReducer = ({ state, action }: ImmerReducerProps) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case previewModalActions.SET_PREVIEW_MODAL_OPEN: {
        const { previewModalStateById } = state;
        const {
          payload,
          payload: { modalState, videoId },
        } = action;
        if (
          !videoId ||
          !previewModalStateById ||
          !draft.previewModalStateById
        ) {
          return;
        }
        draft.previewModalStateById[videoId] = {
          ...initialPreviewModalState,
          ...payload,
        };
        draft.previewModalStateById[videoId].isOpen = true;
        draft.previewModalStateById[videoId].modalState =
          modalState !== null && modalState !== undefined
            ? modalState
            : modalStateActions.MINI_MODAL;
        draft.previewModalStateById[videoId].billboardVideoMerchId =
          previewModalStateById[videoId]?.billboardVideoMerchId;
        return;
      }
      case previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN: {
        const {
          payload: { wasOpen },
        } = action;
        draft.wasOpen = wasOpen;
        return;
      }
      case previewModalActions.SET_PREVIEW_MODAL_CLOSE: {
        const { previewModalStateById } = state;
        const {
          payload: { closeWithoutAnimation = false, videoId = undefined },
        } = action;
        if (
          !videoId ||
          !previewModalStateById ||
          !draft.previewModalStateById
        ) {
          return;
        }
        draft.previewModalStateById[videoId] = {
          ...initialPreviewModalState,
        };
        draft.previewModalStateById[videoId].closeWithoutAnimation =
          closeWithoutAnimation;
        draft.previewModalStateById[videoId].isOpen = false;
        draft.previewModalStateById[videoId].isMyListRow =
          previewModalStateById[videoId].isMyListRow;
        return;
      }
      case previewModalActions.UPDATE_PREVIEW_MODAL_STATE: {
        const { previewModalStateById } = state;
        const {
          payload: {
            individualState,
            individualState: { videoId = undefined } = {},
          },
        } = action;
        const individual = individualState === undefined ? {} : individualState;
        if (
          !videoId ||
          !previewModalStateById ||
          !draft.previewModalStateById
        ) {
          return;
        }
        draft.previewModalStateById[videoId] = {
          ...previewModalStateById[videoId],
          ...individual,
        };
        return;
      }
      default: {
        return state;
      }
    }
  });
};

export const usePreviewModalStore = create<PreviewModalStore>((set, get) => ({
  ...initialState,
  isDetailModal: () => {
    const { previewModalStateById } = get();
    if (previewModalStateById) {
      return Object.values(previewModalStateById).some(
        ({ isOpen, modalState }) => {
          return isOpen && modalState === modalStateActions.DETAIL_MODAL;
        }
      );
    }
    return false;
  },
  isPreviewModalOpen: () => {
    const { previewModalStateById } = get();
    if (previewModalStateById) {
      return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
    }
    return false;
  },
  setPreviewModalWasOpen: (payload) => {
    set((state) => {
      return immerReducer({
        state,
        action: {
          type: previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN,
          payload,
        },
      });
    });
  },
  setPreviewModalOpen: (payload) => {
    set((state) => {
      return immerReducer({
        state,
        action: {
          type: previewModalActions.SET_PREVIEW_MODAL_OPEN,
          payload,
        },
      });
    });
  },
  setPreviewModalClose: (payload) => {
    set((state) => {
      return immerReducer({
        state,
        action: {
          type: previewModalActions.SET_PREVIEW_MODAL_CLOSE,
          payload,
        },
      });
    });
  },
  updatePreviewModalState: (payload) => {
    set((state) => {
      return immerReducer({
        state,
        action: {
          type: previewModalActions.UPDATE_PREVIEW_MODAL_STATE,
          payload,
        },
      });
    });
  },
}));

export default usePreviewModalStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", usePreviewModalStore);
}
