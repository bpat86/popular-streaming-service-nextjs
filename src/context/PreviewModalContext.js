import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";

// Actions
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
  titleCardId: undefined,
  titleCardRect: undefined,
  videoId: undefined,
  videoModel: {},
  wasOpen: false,
};

const actions = {
  getPreviewModalState: (payload) => ({
    type: previewModalActions.GET_PREVIEW_MODAL_STATE,
    payload,
  }),
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
const modalReducer = (state, action) => {
  switch (action.type) {
    case previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN: {
      const {
        payload: { titleCardId, willOpen },
      } = action;
      return {
        ...state,
        willOpen,
        titleCardId,
      };
    }
    case previewModalActions.SET_PREVIEW_MODAL_OPEN: {
      const { previewModalStateById } = state;
      const {
        payload,
        payload: { modalState, videoId = undefined },
      } = action;
      const modal = previewModalStateById[videoId] || {};
      console.log("set preview modal open", {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...initialPreviewModalState,
            ...payload,
            isOpen: true,
            modalState:
              modalState !== null && modalState !== undefined
                ? modalState
                : modalStateActions.MINI_MODAL,
            billboardVideoMerchId: modal?.billboardVideoMerchId,
          },
        },
      });
      return {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...initialPreviewModalState,
            ...payload,
            isOpen: true,
            modalState:
              modalState !== null && modalState !== undefined
                ? modalState
                : modalStateActions.MINI_MODAL,
            billboardVideoMerchId: modal?.billboardVideoMerchId,
          },
        },
      };
    }
    case previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN: {
      const { payload } = action;
      return {
        ...state,
        wasOpen: payload,
      };
    }
    case previewModalActions.SET_PREVIEW_MODAL_CLOSE: {
      const { previewModalStateById } = state;
      const {
        payload: { closeWithoutAnimation = false, videoId = undefined },
      } = action;
      let modal;
      return {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...initialPreviewModalState,
            closeWithoutAnimation,
            isOpen: false,
            isMyListRow: (modal =
              previewModalStateById[videoId] === null || modal === undefined
                ? undefined
                : modal.isMyListRow),
          },
        },
      };
    }
    case previewModalActions.UPDATE_PREVIEW_MODAL_STATE: {
      const { previewModalStateById } = state;
      const {
        payload,
        payload: { individualState, individualState: { videoId } = {} },
      } = action;
      const modal = individualState === undefined ? {} : individualState;
      return {
        ...state,
        previewModalStateById: {
          ...previewModalStateById,
          [videoId]: {
            ...previewModalStateById[videoId],
            ...modal,
          },
        },
        ...payload,
      };
    }
    case previewModalActions.SET_OPEN_NEW_MODAL: {
      const {
        payload: { historyIndex },
      } = action;
      return {
        ...state,
        openedModalAtHistoryIndex: historyIndex,
      };
    }
    case previewModalActions.SET_EXIT_ROUTE_HANDLER: {
      const {
        payload: { exitRouteHandlerUrl },
      } = action;
      return {
        ...state,
        exitRouteHandlerUrl,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
      // return state;
    }
  }
};

const PreviewModalContext = createContext(null);

/**
 * Pub / sub for the preview modal state.
 * @returns
 */
function useStoreData() {
  // Initial values for the store.
  const store = useRef(initialState);
  // Initial subscribers reference.
  const subscribers = useRef(new Set());
  // Get the current store state.
  const get = useCallback(() => {
    return store.current;
  }, []);
  // Set the store state.
  const set = useCallback((value) => {
    store.current = {
      ...store.current,
      ...modalReducer(store.current, value),
    };
    subscribers.current.forEach((callback) => callback());
  }, []);
  console.log("subscribers.current: ", subscribers.current);
  // Subscribe to the store.
  const subscribe = useCallback((callback) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);
  // Return the store state, set, and subscribe.
  return {
    get,
    set,
    subscribe,
  };
}

/**
 * Access the store data.
 * @returns
 */
function useStore(selector) {
  const store = useContext(PreviewModalContext);
  if (!store) throw new Error("Store not found");
  const getter = selector ? () => selector(store.get()) : store.get;
  const state = useSyncExternalStore(store.subscribe, getter);
  return [state, store.set];
}

/**
 * Custom hook: useReducer wrapper with actions
 * @returns {Object} Preview modal state and dispatch functions
 */
function usePreviewModalState(...args) {
  // Get the store state and set the store state with useReducer.
  // const [state, dispatch] = useReducer(modalReducer, initialState);
  // Get the store state and set the store state.
  const [state, dispatch] = useStore(...args);
  // Make action creators that dispatch actions
  const actionCreators = Object.keys(actions).reduce(
    (previousValue, actionCreatorKey) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      previousValue[actionCreatorKey] = (...args) => {
        return dispatch(actions[actionCreatorKey](...args));
      };
      return previousValue;
    },
    {}
  );
  // Return state and action creators
  // console.log("state in usePreviewModalState: ", state);
  return { ...state, ...actionCreators };
}

/**
 * Preview modal provider.
 * @param {Object} children
 * @returns {ReactNode} Provider
 */
export const PreviewModalProvider = ({ children }) => {
  return (
    <PreviewModalContext.Provider
      value={{
        usePreviewModalState,
        ...useStoreData(),
      }}
    >
      {children}
    </PreviewModalContext.Provider>
  );
};

export default PreviewModalContext;
