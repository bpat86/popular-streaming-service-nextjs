import { MutableRefObject, useCallback, useEffect, useState } from "react";

export const useHover = <
  T extends {
    ref?: MutableRefObject<HTMLDivElement | null>;
  }
>({
  ref,
}: T) => {
  const [hover, setHover] = useState<boolean>(false);

  /**
   * If the user hovers for the full duration of the `delay` value
   */
  const handleMouseEnter = useCallback(() => {
    setHover(true);
  }, []);

  /**
   * Cancel the pending debounce function invokation if the user
   * hovers out before `delay`.
   */
  const handleMouseLeave = useCallback(() => {
    setHover(false);
  }, []);

  useEffect(() => {
    const element = ref?.current;
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

  return [hover] as const;
};
