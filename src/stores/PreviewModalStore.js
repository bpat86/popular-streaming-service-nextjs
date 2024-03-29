import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import create from "zustand";

import { modalStateActions, previewModalActions } from "@/actions/Actions";

// Default values for the preview modal.
const initialPreviewModalState = {
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
    start: null,
    length: null,
  },
  videos: undefined,
};

// Default UI values in relation to the preview modal state.
const initialState = {
  galleryModalOpen: false,
  previewModalStateById: { undefined: {} },
  scrollPosition: undefined,
  wasOpen: false,
};

// Default actions for the preview modal.
const actions = {
  setPreviewModalWillOpen: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN,
    payload,
  }),
  setPreviewModalOpen: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_OPEN,
    payload,
  }),
  setPreviewModalWasOpen: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN,
    payload,
  }),
  setPreviewModalClose: (payload) => ({
    type: previewModalActions.SET_PREVIEW_MODAL_CLOSE,
    payload,
  }),
  updatePreviewModalState: (payload) => ({
    type: previewModalActions.UPDATE_PREVIEW_MODAL_STATE,
    payload,
  }),
  setOpenNewModal: (payload) => ({
    type: previewModalActions.SET_OPEN_NEW_MODAL,
    payload,
  }),
  setExitRouteHandler: (payload) => ({
    type: previewModalActions.SET_EXIT_ROUTE_HANDLER,
    payload,
  }),
};

/**
 * Manage the preview modal state and UI.
 * @param {Object} state
 * @param {Object} action
 * @returns
 */
// export const previewModalReducer = ({ state, action }) => {
//   switch (action.type) {
//     case previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN: {
//       const {
//         payload: { titleCardId, willOpen },
//       } = action;
//       return {
//         ...state,
//         willOpen,
//         titleCardId,
//       };
//     }
//     case previewModalActions.SET_PREVIEW_MODAL_OPEN: {
//       const { previewModalStateById } = state;
//       const {
//         payload,
//         payload: { modalState, videoId = undefined },
//       } = action;
//       const modal = previewModalStateById[videoId] || {};
//       return {
//         ...state,
//         previewModalStateById: {
//           ...previewModalStateById,
//           [videoId]: {
//             ...initialPreviewModalState,
//             ...payload,
//             isOpen: true,
//             modalState:
//               modalState !== null && modalState !== undefined
//                 ? modalState
//                 : modalStateActions.MINI_MODAL,
//             billboardVideoMerchId: modal?.billboardVideoMerchId,
//           },
//         },
//       };
//     }
//     case previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN: {
//       const { payload } = action;
//       return {
//         ...state,
//         wasOpen: payload,
//       };
//     }
//     case previewModalActions.SET_PREVIEW_MODAL_CLOSE: {
//       const { previewModalStateById } = state;
//       const {
//         payload: { closeWithoutAnimation = false, videoId = undefined },
//       } = action;
//       let modal;
//       return {
//         ...state,
//         previewModalStateById: {
//           ...previewModalStateById,
//           [videoId]: {
//             ...initialPreviewModalState,
//             closeWithoutAnimation,
//             isOpen: false,
//             isMyListRow: (modal =
//               previewModalStateById[videoId] === null || modal === undefined
//                 ? undefined
//                 : modal.isMyListRow),
//           },
//         },
//       };
//     }
//     case previewModalActions.UPDATE_PREVIEW_MODAL_STATE: {
//       const { previewModalStateById } = state;
//       const {
//         payload,
//         payload: { individualState, individualState: { videoId } = {} },
//       } = action;
//       const modal = individualState === undefined ? {} : individualState;
//       return {
//         ...state,
//         previewModalStateById: {
//           ...previewModalStateById,
//           [videoId]: {
//             ...previewModalStateById[videoId],
//             ...modal,
//           },
//         },
//         ...payload,
//       };
//     }
//     case previewModalActions.SET_OPEN_NEW_MODAL: {
//       const {
//         payload: { historyIndex },
//       } = action;
//       return {
//         ...state,
//         openedModalAtHistoryIndex: historyIndex,
//       };
//     }
//     case previewModalActions.SET_EXIT_ROUTE_HANDLER: {
//       const {
//         payload: { exitRouteHandlerUrl },
//       } = action;
//       return {
//         ...state,
//         exitRouteHandlerUrl,
//       };
//     }
//     default: {
//       throw new Error(`Unhandled action type: ${action.type}`);
//       // return state;
//     }
//   }
// };

const immerReducer = ({ state, action }) =>
  produce(state, (draft) => {
    switch (action.type) {
      case previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN: {
        const {
          payload: { titleCardId, willOpen },
        } = action;
        draft.willOpen = willOpen;
        draft.titleCardId = titleCardId;
        break;
      }
      case previewModalActions.SET_PREVIEW_MODAL_OPEN: {
        const { previewModalStateById } = state;
        const {
          payload,
          payload: { modalState, videoId = undefined },
        } = action;
        const modal = previewModalStateById[videoId] || {};
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
          modal?.billboardVideoMerchId;
        break;
      }
      case previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN: {
        const { payload } = action;
        draft.wasOpen = payload;
        break;
      }
      case previewModalActions.SET_PREVIEW_MODAL_CLOSE: {
        const { previewModalStateById } = state;
        const {
          payload: { closeWithoutAnimation = false, videoId = undefined },
        } = action;
        let modal;
        draft.previewModalStateById[videoId] = {
          ...initialPreviewModalState,
        };
        draft.previewModalStateById[videoId].closeWithoutAnimation =
          closeWithoutAnimation;
        draft.previewModalStateById[videoId].isOpen = false;
        draft.previewModalStateById[videoId].isMyListRow = modal =
          previewModalStateById[videoId] === null || modal === undefined
            ? undefined
            : modal.isMyListRow;
        break;
      }
      case previewModalActions.UPDATE_PREVIEW_MODAL_STATE: {
        const { previewModalStateById } = state;
        const {
          payload,
          payload: { individualState, individualState: { videoId } = {} },
        } = action;
        const modal = individualState === undefined ? {} : individualState;
        draft.previewModalStateById[videoId] = {
          ...previewModalStateById[videoId],
          ...modal,
        };
        draft = { ...draft, ...payload };
        break;
      }
      case previewModalActions.SET_OPEN_NEW_MODAL: {
        const {
          payload: { historyIndex },
        } = action;
        draft.openedModalAtHistoryIndex = historyIndex;
        break;
      }
      case previewModalActions.SET_EXIT_ROUTE_HANDLER: {
        const {
          payload: { exitRouteHandlerUrl },
        } = action;
        draft.exitRouteHandlerUrl = exitRouteHandlerUrl;
        break;
      }
      default: {
        break;
      }
    }
  });

const actionsCreators = (set) => {
  return Object.keys(actions).reduce((previousValue, actionKey) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    previousValue[actionKey] = (...args) => {
      // console.log("actionKey", actionKey);
      return set((state) => {
        return immerReducer({
          state,
          action: actions[actionKey](...args),
        });
      });
    };
    return previousValue;
  }, {});
};

const usePreviewModalStore = create((set, get) => ({
  ...initialState,
  ...actionsCreators(set),
  isOpen: () =>
    Object.values(get().previewModalStateById).some(({ isOpen }) => isOpen),
  isDetailModal: () =>
    Object.values(get().previewModalStateById).some(
      ({ isOpen, modalState }) => {
        return isOpen && modalState === modalStateActions.DETAIL_MODAL;
      }
    ),
  // setPreviewModalWasOpen: (payload) => {
  //   set((state) => {
  //     return immerReducer({
  //       state,
  //       action: {
  //         type: previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN,
  //         payload,
  //       },
  //     });
  //   });
  // },
  // setPreviewModalOpen: (payload) => {
  //   set((state) => {
  //     return immerReducer({
  //       state,
  //       action: {
  //         type: previewModalActions.SET_PREVIEW_MODAL_OPEN,
  //         payload,
  //       },
  //     });
  //   });
  // },
  // setPreviewModalClose: (payload) => {
  //   set((state) => {
  //     return immerReducer({
  //       state,
  //       action: {
  //         type: previewModalActions.SET_PREVIEW_MODAL_CLOSE,
  //         payload,
  //       },
  //     });
  //   });
  // },
}));

export default usePreviewModalStore;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", usePreviewModalStore);
}
