import debounce from "lodash.debounce";
import { useEffect, useRef, useState } from "react";

export const useTitleCardHover = ({
  modalStateReset,
  modalIsAnimating,
  initialDelay,
  activeDelay,
}) => {
  const [intendedHover, setIntendedHover] = useState(false);
  const elementRef = useRef();

  /**
   * If the user hovers for the full duration of the delay
   */
  const handleMouseEnter = debounce(
    () => {
      setIntendedHover(true);
    },
    modalIsAnimating ? activeDelay : initialDelay
  );
  /**
   * Cancel the pending debounce function invokation if the delay time is not reached
   */
  const handleMouseLeave = () => {
    handleMouseEnter.cancel();
    setIntendedHover(false);
  };

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  return [elementRef, intendedHover];
};
