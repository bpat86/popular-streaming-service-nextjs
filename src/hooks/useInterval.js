import { useEffect, useRef } from "react";

export const useInterval = (callback, delay) => {
  const callbackRef = useRef();

  // Remember the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    function tick() {
      callbackRef.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
