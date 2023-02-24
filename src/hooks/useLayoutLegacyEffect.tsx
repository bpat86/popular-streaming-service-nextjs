import { useLayoutEffect, useRef } from "react";
const isDevelopmentRun =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const useLayoutLegacyEffect = (cb: () => void, deps: string[]) => {
  const isMountedRef = useRef<boolean>(!isDevelopmentRun);

  useLayoutEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return undefined;
    }

    return cb();
  }, [deps, cb]);
};

export default useLayoutLegacyEffect;
