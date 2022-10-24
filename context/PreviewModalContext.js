import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
} from "react";
import debounce from "lodash.debounce";

const modalStateActions = {
  MINI_MODAL: "MINI_MODAL",
  DETAIL_MODAL: "DETAIL_MODAL",
  DEFAULT_MODAL: "DEFAULT_MODAL",
};
const previewModalActions = {
  SET_PREVIEW_MODAL_WILL_OPEN: "SET_PREVIEW_MODAL_WILL_OPEN",
  SET_PREVIEW_MODAL_OPEN: "SET_PREVIEW_MODAL_OPEN",
  SET_PREVIEW_MODAL_WAS_OPEN: "SET_PREVIEW_MODAL_WAS_OPEN",
  SET_PREVIEW_MODAL_CLOSE: "SET_PREVIEW_MODAL_CLOSE",
  GET_PREVIEW_MODAL_STATE: "GET_PREVIEW_MODAL_STATE",
  UPDATE_PREVIEW_MODAL_STATE: "UPDATE_PREVIEW_MODAL_STATE",
  SET_OPEN_NEW_MODAL: "SET_OPEN_NEW_MODAL",
  SET_EXIT_ROUTE_HANDLER: "SET_EXIT_ROUTE_HANDLER",
};
const animationStateActions = {
  SET_MINI_MODAL: "SET_MINI_MODAL",
  SET_DEFAULT_MODAL: "SET_DEFAULT_MODAL",
  RESET_MINI_MODAL: "RESET_MINI_MODAL",
  MOUNT_MINI_MODAL: "MOUNT_MINI_MODAL",
  OPEN_MINI_MODAL: "OPEN_MINI_MODAL",
  CLOSE_MINI_MODAL: "CLOSE_MINI_MODAL",
  MOUNT_DETAIL_MODAL: "MOUNT_DETAIL_MODAL",
  OPEN_DETAIL_MODAL: "OPEN_DETAIL_MODAL",
  CLOSE_DETAIL_MODAL: "CLOSE_DETAIL_MODAL",
};
const buttonActions = {
  ADD_TO_MEDIA_LIST: "ADD_TO_MEDIA_LIST",
  REMOVE_FROM_MEDIA_LIST: "REMOVE_FROM_MEDIA_LIST",
  ADD_TO_LIKED_MEDIA: "ADD_TO_LIKED_MEDIA",
  REMOVE_FROM_LIKED_MEDIA: "REMOVE_FROM_LIKED_MEDIA",
  ADD_TO_DISLIKED_MEDIA: "ADD_TO_DISLIKED_MEDIA",
  REMOVE_FROM_DISLIKED_MEDIA: "REMOVE_FROM_DISLIKED_MEDIA",
};
const sliderActions = {
  MOVE_DIRECTION_NEXT: "MOVE_DIRECTION_NEXT",
  MOVE_DIRECTION_PREV: "MOVE_DIRECTION_PREV",
  SLIDER_SLIDING: "SLIDER_SLIDING",
};

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
      return state;
    }
  }
};

const PreviewModalContext = createContext();

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
  const get = useCallback(() => store.current, []);
  // Update the store state.
  const update = useCallback((store, value) => modalReducer(store, value), []);
  // Set the store state.
  const set = useCallback((value) => {
    store.current = Object.assign(
      {},
      store.current,
      update(store.current, value)
    );
    subscribers.current.forEach((callback) => callback());
  }, []);
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
function useStore() {
  const { get, set, subscribe } = useStoreData();
  const state = useSyncExternalStore(subscribe, get);
  return [state, set];
}

/**
 * Preview modal provider.
 * @param {Object} children
 * @returns
 */
export const PreviewModalProvider = ({ children }) => {
  // Refs
  const timerIdRef = useRef(null);

  /**
   * Custom hook: useReducer wrapper with actions
   * @param {Object} actions
   * @param {Object} initialState
   * @param {Object} reducer
   * @returns {Object}
   */
  const usePreviewModalState = () => {
    // Get the store state and set the store state with useReducer.
    // const [state, dispatch] = useReducer(modalReducer, initialState);
    // Get the store state and set the store state.
    const [state, dispatch] = useStore();
    // Make action creators that dispatch actions
    const makeActionCreators = useMemo(
      () =>
        Object.keys(actions).reduce((previousValue, actionKey) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          previousValue[actionKey] = (...args) => {
            return dispatch(actions[actionKey](...args));
          };
          return previousValue;
        }, {}),
      []
    );
    // Return state and action creators
    return Object.assign(state, makeActionCreators);
  };

  /**
   * Turn pointer events off while scrolling
   */
  /**
   * Preview modal reducer state
   */
  const { previewModalStateById } = usePreviewModalState();
  const onScroll = debounce(
    () => {
      const modals = previewModalStateById;
      const style = document.body.style;
      timerIdRef.current && clearTimeout(timerIdRef.current),
        (timerIdRef.current = null);
      Object.values(modals).some((modal) => modal.isOpen) ||
        (style.pointerEvents !== "none" && (style.pointerEvents = "none")),
        (timerIdRef.current = setTimeout(() => {
          style.pointerEvents = "";
        }, 100));
    },
    100,
    { maxWait: 100, leading: true, trailing: true }
  );

  /**
   * Disable hover while scrolling
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll]);

  const value = {
    modalStateActions,
    animationStateActions,
    ...usePreviewModalState(),
  };
  return (
    <PreviewModalContext.Provider value={value}>
      {children}
    </PreviewModalContext.Provider>
  );
};

export default PreviewModalContext;
