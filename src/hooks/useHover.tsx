import { useCallback, useEffect, useRef, useState } from "react";

import { useElementRect } from "./useElementRect";

export const useHover = () => {
  const [hovered, setIntendedHover] = useState<boolean>(false);
  const elementRef = useRef(null);
  /**
   * The useElementRect Hook returns the hovered element's bounding rect.
   * It accepts a conditional variable and an optional element ref.
   */
  const [elementRect] = useElementRect({
    stateChange: hovered as boolean,
    ref: elementRef,
  });

  /**
   * If the user hovers for the full duration of the `delay` value
   */
  const handleMouseEnter = useCallback(() => {
    setIntendedHover(true);
  }, []);

  /**
   * Cancel the pending debounce function invokation if the user
   * hovers out before `delay`.
   */
  const handleMouseLeave = useCallback(() => {
    setIntendedHover(false);
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      (element as HTMLDivElement).addEventListener(
        "mouseover",
        handleMouseEnter
      );
      (element as HTMLDivElement).addEventListener(
        "mouseleave",
        handleMouseLeave
      );
      return () => {
        (element as HTMLDivElement).removeEventListener(
          "mouseover",
          handleMouseEnter
        );
        (element as HTMLDivElement).removeEventListener(
          "mouseleave",
          handleMouseLeave
        );
      };
    }
  }, [elementRef, handleMouseEnter, handleMouseLeave]);

  return [elementRef, elementRect, hovered] as const;
};
