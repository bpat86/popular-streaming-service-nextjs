import { ReactNode, useEffect, useRef, useState } from "react";

import clsxm from "@/lib/clsxm";
import { PreviewModalStore } from "@/store/types";

type TitleTreatmentWrapperProps = {
  children: ReactNode;
  isDefaultModal?: boolean;
  isDetailModal?: PreviewModalStore["isDetailModal"];
  shouldAnimate?: boolean;
};

const TitleTreatmentWrapper = ({
  children,
  isDetailModal,
  shouldAnimate,
}: TitleTreatmentWrapperProps) => {
  const [isDelayed, setIsDelayed] = useState<boolean>(true);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const delayTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef<boolean>(false);

  /**
   * Set isHovering state on hover
   */
  useEffect(() => {
    mountedRef.current = true;
    if (isHovering) {
      // Set timeout to reset isDelayed state after delayTiming
      delayTimerIdRef.current = setTimeout(() => {
        isDelayed && setIsDelayed(false);
      }, 6000);
      // Set timeout to reset isHovering state after animationTiming
      hoverTimerIdRef.current = setTimeout(() => {
        !isDelayed && setIsHovering(false);
      }, 3000);
      // Clear timeouts and reset state on unmount
      return () => {
        mountedRef.current = false;
        setIsHovering(false);
        clearDelays();
      };
    }
  }, [isHovering, isDelayed]);

  /**
   * Clear hoverTimerIdRef refs
   */
  function clearDelays() {
    delayTimerIdRef.current && clearTimeout(delayTimerIdRef.current),
      (delayTimerIdRef.current = null);
    hoverTimerIdRef.current && clearTimeout(hoverTimerIdRef.current),
      (hoverTimerIdRef.current = null);
  }

  /**
   * Trigger visibility animation on hover or move
   */
  function visibilityAnimation() {
    !isHovering && setIsHovering(true);
  }

  return isDetailModal ? (
    <div className="title-treatment-wrapper">{children}</div>
  ) : (
    <div
      className={clsxm(
        "title-treatment-wrapper transition-opacity duration-500 ease-out",
        [
          !shouldAnimate || isDelayed
            ? mountedRef.current
              ? "opacity-100"
              : "opacity-0"
            : isHovering
            ? "opacity-100"
            : "opacity-0",
        ]
      )}
      onMouseEnter={visibilityAnimation}
      onMouseMove={visibilityAnimation}
    >
      {children}
    </div>
  );
};

export default TitleTreatmentWrapper;
