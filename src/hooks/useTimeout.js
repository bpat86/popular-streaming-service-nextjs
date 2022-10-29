import { useEffect, useRef } from "react";

export const useTimeout = (callback, delay, hovering) => {
  const timeoutRef = useRef(null);
  const savedCallback = useRef(callback);

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    if (!hovering) return;

    const tick = () => savedCallback.current();

    if (typeof delay === "number") {
      timeoutRef.current === window.setTimeout(tick, delay);

      return () => window.clearTimeout(timeoutRef.current);
    }
  }, [delay, hovering]);

  return timeoutRef;
};
