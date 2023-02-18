import { MutableRefObject, useCallback, useEffect, useState } from "react";

export const useHover = <T extends MutableRefObject<HTMLDivElement | null>>(
  ref: T
) => {
  const [isHovering, setIsHovering] = useState<boolean>(false);

  /**
   * If the user hovers for the full duration of the `delay` value
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  /**
   * Cancel the pending debounce function invokation if the user
   * hovers out before `delay`.
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    const element = ref.current;
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
  }, [ref, handleMouseEnter, handleMouseLeave]);

  return isHovering;
};
