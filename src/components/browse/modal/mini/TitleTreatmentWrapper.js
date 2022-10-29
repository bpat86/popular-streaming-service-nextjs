import { useEffect, useRef, useState } from "react";

const TitleTreatmentWrapper = (props) => {
  const {
    animationTiming = 3000,
    children,
    delayTiming = 6000,
    isDefaultModal = false,
    isDetailModal = false,
    transitionTiming = 500,
    videoCompleted,
    videoCanPlayThrough,
    videoPlaybackError,
    videoId,
  } = props;
  // State
  const [isHovered, setIsHovered] = useState(false);
  const [isDelayed, setIsDelayed] = useState(true);
  const [mounted, setMounted] = useState(false);
  // Refs
  const delayedTimeoutId = useRef(null);
  const timeoutId = useRef(null);
  const style =
    !videoId ||
    isDelayed ||
    isDetailModal ||
    videoPlaybackError ||
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
    delayedTimeoutId.current && clearTimeout(delayedTimeoutId),
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
