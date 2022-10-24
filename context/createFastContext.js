import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

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

// Default action creators.
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

export const createFastContext = (reducer, initialData = {}) => {
  function useStoreData() {
    // Default values for the preview modal.
    const store = useRef(initialData);
    const get = useCallback(() => store.current, []);
    const subscribers = useRef(new Set());
    const set = useCallback((value) => {
      store.current = {
        ...store.current,
        ...value,
      };
    }, []);
    const subscribe = useCallback((callback) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);
    return {
      get,
      set,
      subscribe,
    };
  }

  const PreviewModalContext = createContext();

  function PreviewModalProvider({ children }) {
    return (
      <PreviewModalContext.Provider value={useStoreData()}>
        {children}
      </PreviewModalContext.Provider>
    );
  }

  function useStore() {
    const store = useContext(PreviewModalContext);
    if (!store) {
      throw new Error("Store not found");
    }
    const state = useSyncExternalStore(store.subscribe, store.get());

    return [state, store.set];
  }

  /**
   * Custom hook: useReducer wrapper with actions
   * @param {Object} actions
   * @param {Object} initialState
   * @param {Object} reducer
   * @returns {Object}
   */
  function reducerWithActions() {
    // const [state, dispatch] = useStore();
    const [state, dispatch] = useReducer(reducer, initialState);
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
  }

  return {
    PreviewModalProvider,
    useStore,
  };
};

export default createFastContext;
