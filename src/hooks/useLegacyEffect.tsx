import { useLayoutEffect, useRef } from "react";
const isDevelopmentRun =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const useLegacyEffect = (cb: () => void, deps: string[]) => {
  const isMountedRef = useRef<boolean>(!isDevelopmentRun);

  useLayoutEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return undefined;
    }

    return cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useLegacyEffect;
