import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
} from "react";
// import previewModalReducer from "../reducers/previewModalReducer";

const PreviewModalContext = createContext();

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
  previewModalStateById: {}, // undefined: {}
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
const previewModalReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case previewModalActions.SET_PREVIEW_MODAL_WILL_OPEN: {
      return Object.assign(Object.assign({}, state), {
        showAwareness: false,
        showReminder: false,
      });
    }
    case previewModalActions.SET_PREVIEW_MODAL_OPEN: {
      let modalState,
        videoId = payload.videoId,
        queuedModal = state.previewModalStateById[videoId] || {};
      return Object.assign(Object.assign({}, state), {
        previewModalStateById: Object.assign(
          Object.assign({}, state.previewModalStateById),
          {
            [videoId]: Object.assign(
              Object.assign(
                Object.assign({}, initialPreviewModalState),
                {
                  isOpen: true,
                },
                payload
              ),
              {
                modalState:
                  null !== (modalState = payload.modalState) &&
                  undefined !== modalState
                    ? modalState
                    : modalStateActions.MINI_MODAL,
                billboardVideoMerchId: queuedModal.billboardVideoMerchId,
              }
            ),
          }
        ),
      });
    }
    case previewModalActions.SET_PREVIEW_MODAL_WAS_OPEN: {
      const wasOpen = payload;
      return Object.assign(Object.assign({}, state), {
        wasOpen,
      });
    }
    case previewModalActions.SET_PREVIEW_MODAL_CLOSE: {
      let queuedModal,
        previewModalPayload = payload || {},
        videoId = previewModalPayload.videoId,
        closeWithoutAnimation =
          previewModalPayload.closeWithoutAnimation || false;
      return Object.assign(Object.assign({}, state), {
        previewModalStateById: Object.assign(
          Object.assign({}, state.previewModalStateById),
          {
            [videoId]: Object.assign(
              Object.assign({}, initialPreviewModalState),
              {
                closeWithoutAnimation,
                isMyListRow:
                  (queuedModal = state.previewModalStateById[videoId]) ===
                    null || undefined === queuedModal
                    ? undefined
                    : queuedModal.isMyListRow,
              }
            ),
          }
        ),
      });
    }
    case previewModalActions.UPDATE_PREVIEW_MODAL_STATE: {
      let previewModalPayload = payload,
        individualState = previewModalPayload.individualState,
        individualModal = undefined === individualState ? {} : individualState,
        previewModalStateById = state.previewModalStateById,
        videoId = individualModal.videoId;
      return Object.assign(
        Object.assign({}, state),
        {
          previewModalStateById: Object.assign(
            Object.assign({}, previewModalStateById),
            {
              [videoId]: Object.assign(
                Object.assign({}, previewModalStateById[videoId]),
                individualModal
              ),
            }
          ),
        },
        previewModalPayload
      );
    }
    case previewModalActions.SET_OPEN_NEW_MODAL: {
      const openedModalAtHistoryIndex = payload.historyIndex;
      return Object.assign(Object.assign({}, state), {
        openedModalAtHistoryIndex,
      });
    }
    case previewModalActions.SET_EXIT_ROUTE_HANDLER: {
      const exitRouteHandlerUrl = payload.exitRouteHandlerUrl;
      return Object.assign(Object.assign({}, state), {
        exitRouteHandlerUrl,
      });
    }
    default: {
      throw new Error(`No case for this ${type}`);
    }
  }
};

export const PreviewModalProvider = ({ children }) => {
  const modalTimeoutIdRef = useRef(null);

  /**
   * Preview modal state reducer wrapper
   * @returns {Object}
   */
  const previewModalReducer = () => {
    return reducerWithActions({
      actions,
      initialState,
      previewModalReducer,
    });
  };

  /**
   * Custom hook: useReducer wrapper with actions
   * @param {Object} actions
   * @param {Object} initialState
   * @param {Object} reducer
   * @returns {Object}
   */
  const reducerWithActions = ({
    actions,
    initialState,
    previewModalReducer,
  }) => {
    const [state, dispatch] = useReducer(previewModalReducer, initialState);
    const wrappedActions = Object.keys(actions).reduce(
      (prevState, actionKey) => ({
        ...prevState,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [actionKey]: useCallback(
          (...args) => dispatch(actions[actionKey](...args)),
          [actionKey]
        ),
      }),
      {}
    );
    return {
      ...initialState,
      ...state,
      ...wrappedActions,
    };
  };

  /**
   * Preview modal reducer state
   */
  const {
    wasOpen,
    scrollPosition,
    previewModalStateById,
    getPreviewModalState,
    setPreviewModalOpen,
    previewModalWillOpen,
    updatePreviewModalState,
    setPreviewModalClose,
    setPreviewModalWasOpen,
    setExitRouteHandler,
  } = previewModalReducer();

  /**
   * Wrapper function for setting preview modal state `isOpen` to true
   * @param  {...any} args
   */
  const handleSetPreviewModalOpen = (...args) => {
    modalTimeoutIdRef.current && clearTimeout(modalTimeoutIdRef.current),
      (modalTimeoutIdRef.current = null),
      setPreviewModalOpen(...args);
  };

  /**
   * Wrapper function for setting preview modal state `isOpen` to false
   * @param  {...any} args
   */
  const handleSetPreviewModalClose = (...args) => {
    setPreviewModalClose(...args);
    modalTimeoutIdRef.current = setTimeout(() => {
      setPreviewModalWasOpen(false),
        clearTimeout(modalTimeoutIdRef.current),
        (modalTimeoutIdRef.current = null);
    }, 333);
  };

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = (videoId = null) => {
    let queuedVideoId,
      queued = previewModalStateById;
    return videoId
      ? (queuedVideoId = queued[videoId]) === null ||
        queuedVideoId === undefined
        ? undefined
        : queuedVideoId.isOpen
      : Object.values(queued)?.some((item) => item.isOpen);
  };

  /**
   * Returns the state of the currently open preview modal
   * @returns {Object}
   */
  const openPreviewModalState = () => {
    const queued = previewModalStateById;
    return Object.values(queued)?.find((item) => item?.isOpen) || {};
  };

  /**
   * Returns true if the preview modal's state is `DETAIL_MODAL` or `DEFAULT_MODAL
   * @returns {Boolean}
   */
  const isDetailModal = () => {
    const queued = previewModalStateById;
    return Object.values(queued)?.some(
      (item) => !!(item?.modalState === modalStateActions.DETAIL_MODAL)
    );
  };

  const value = {
    wasOpen,
    scrollPosition,
    previewModalStateById,
    getPreviewModalState,
    setPreviewModalOpen,
    previewModalWillOpen,
    updatePreviewModalState,
    setPreviewModalClose,
    setPreviewModalWasOpen,
    setExitRouteHandler,
    handleSetPreviewModalOpen,
    handleSetPreviewModalClose,
    isPreviewModalOpen,
    openPreviewModalState,
    isDetailModal,
    // Refs
    modalTimeoutIdRef,
  };
  return (
    <PreviewModalContext.Provider value={value}>
      {children}
    </PreviewModalContext.Provider>
  );
};

/**
 * Custom hook for accessing preview modal context
 * @returns {Object}
 */
const usePreviewModal = () => {
  const context = useContext(PreviewModalContext);

  if (context === undefined) {
    throw new Error("usePreviewModal must be used within PreviewModalContext");
  }

  return context;
};

export default usePreviewModal;
