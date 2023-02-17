import {
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const useElementRect = <
  T extends {
    state: boolean;
    ref?: MutableRefObject<HTMLDivElement | null>;
  }
>({
  state,
  ref: passedInRef,
}: T) => {
  const [elementRect, setElementRect] = useState<{
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    clientWidth?: number;
  }>({});
  const elementRef = useRef<HTMLDivElement | null>(null);

  /**
   * Get the element's bounding rect
   */
  const handleRect = (ref: MutableRefObject<HTMLDivElement | null>) => {
    if (!ref.current) return {};
    return {
      x: ref.current.getBoundingClientRect().x,
      y: ref.current.getBoundingClientRect().y,
      width: ref.current.getBoundingClientRect().width,
      height: ref.current.getBoundingClientRect().height,
      top: ref.current.getBoundingClientRect().top,
      left: ref.current.getBoundingClientRect().left,
      right: ref.current.getBoundingClientRect().right,
      bottom: ref.current.getBoundingClientRect().bottom,
      clientWidth: ref.current.clientWidth,
    };
  };

  /**
   * Set the element's bounding rect as state
   */
  const handleElementRect = useCallback(() => {
    passedInRef
      ? setElementRect(handleRect(passedInRef))
      : setElementRect(handleRect(elementRef));
  }, [passedInRef, elementRef]);

  // If the state changes, update the element's bounding rect
  useLayoutEffect(() => {
    state && handleElementRect();
  }, [handleElementRect, state]);

  // Return the element's bounding rect
  return [elementRef, elementRect];
};
