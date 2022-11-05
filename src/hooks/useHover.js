import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState } from "react";

import { useElementRect } from "./useElementRect";

export const useHover = (delay = 0) => {
  const [hovered, setIntendedHover] = useState(false);
  const elementRef = useRef();
  /**
   * The useElementRect Hook returns the hovered element's bounding rect.
   * It accepts a conditional variable and an optional element ref.
   */
  const [elementRect] = useElementRect({
    stateChange: hovered,
    ref: elementRef,
  });

  /**
   * If the user hovers for the full duration of the `delay` value
   */
  const handleMouseEnter = debounce(() => {
    setIntendedHover(true);
  }, delay || 0);

  /**
   * Cancel the pending debounce function invokation if the user
   * hovers out before `delay`.
   */
  const handleMouseLeave = useCallback(() => {
    handleMouseEnter.cancel();
    setIntendedHover(false);
  }, [handleMouseEnter]);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      element.addEventListener("mouseover", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mouseover", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [elementRef, handleMouseEnter, handleMouseLeave, delay]);

  return [elementRef, elementRect, hovered];
};
