import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

export const fastContext = (initialState) => {
  function useStoreData() {
    // Default values for the preview modal.
    const store = useRef(initialState);

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

  const StoreContext = createContext();

  function Provider({ children }) {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useStore() {
    const store = useContext(StoreContext);
    if (!store) {
      throw new Error("Store not found");
    }
    const state = useSyncExternalStore(store.subscribe, store.get());

    return [state, store.set];
  }

  return {
    Provider,
    useStore,
  };
};

export default fastContext;
