import { ReactNode, useEffect, useRef, useState } from "react";

import { PreviewModalStore } from "@/store/types";

type TitleTreatmentWrapperProps = {
  animationTiming?: number;
  children: ReactNode;
  delayTiming?: number;
  isDefaultModal?: boolean;
  isDetailModal?: PreviewModalStore["isDetailModal"];
  transitionTiming?: number;
  videoCompleted?: boolean;
  videoCanPlayThrough?: boolean;
  videoId?: string;
};

const TitleTreatmentWrapper = ({
  animationTiming = 3000,
  children,
  delayTiming = 6000,
  isDefaultModal = false,
  isDetailModal,
  transitionTiming = 500,
  videoCompleted,
  videoCanPlayThrough,
  videoId,
}: TitleTreatmentWrapperProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDelayed, setIsDelayed] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  const delayedTimeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const style =
    !videoId ||
    isDelayed ||
    isDetailModal ||
    (videoCompleted && !videoCanPlayThrough)
      ? {
          opacity: mounted ? 1 : 0,
          transition: `opacity ${transitionTiming}ms ease-out`,
          transitionDelay: `${transitionTiming}ms`,
        }
      : {
          opacity: isHovered ? 1 : 0,
          transition: `opacity ${transitionTiming}ms ease-out`,
          transitionDelay: `${transitionTiming}ms`,
        };

  useEffect(() => {
    setMounted(true);
    if (!isHovered) return;
    delayedTimeoutId.current = setTimeout(() => {
      setIsDelayed(false);
    }, delayTiming);

    timeoutId.current = setTimeout(() => {
      !isDelayed && setIsHovered(false);
    }, animationTiming);

    return () => {
      setMounted(false);
      setIsHovered(false);
      clearDelays();
    };
  }, [isHovered, isDelayed, delayTiming, animationTiming]);

  /**
   * Handle logo animation visibility
   */
  const triggerAnimation = () => {
    !isHovered && setIsHovered(true);
  };

  /**
   * Clear timeoutId refs
   */
  const clearDelays = () => {
    delayedTimeoutId.current && clearTimeout(delayedTimeoutId.current),
      (delayedTimeoutId.current = null);
    timeoutId.current && clearTimeout(timeoutId.current),
      (timeoutId.current = null);
  };

  return isDefaultModal || isDetailModal ? (
    <div className="title-treatment-wrapper">{children}</div>
  ) : (
    <div
      className="title-treatment-wrapper"
      onMouseEnter={triggerAnimation}
      onMouseMove={triggerAnimation}
      style={style}
    >
      {children}
    </div>
  );
};

export default TitleTreatmentWrapper;
