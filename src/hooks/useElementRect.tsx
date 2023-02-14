import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const useElementRect = <
  T extends {
    textChange?: string;
    stateChange?: boolean;
    ref?: MutableRefObject<HTMLDivElement | null>;
  }
>({
  textChange,
  stateChange,
  ref: passedInRef,
}: T) => {
  const [elementRect, setElementRect] = useState({});
  const elementRef = useRef<HTMLDivElement>(null);

  const handleElementRect = useCallback(() => {
    /**
     * Save the element's size and position relative to the viewport to state
     */
    passedInRef
      ? setElementRect(
          passedInRef && passedInRef.current
            ? passedInRef.current.getBoundingClientRect()
            : {}
        )
      : setElementRect(
          elementRef && elementRef.current
            ? (elementRef.current as HTMLDivElement).getBoundingClientRect()
            : {}
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passedInRef, textChange]);

  /**
   * Return the element's bounding rect. Condition must be present
   */
  useEffect(() => {
    if (stateChange) {
      handleElementRect();
    }
  }, [handleElementRect, stateChange]);

  /**
   * If a ref was passed, only return the element's bounding rect
   */
  if (passedInRef) {
    return [elementRect];
  }

  /**
   * By default, if the user doesn't pass in a ref,
   * the useElementRect Hook will output one.
   */
  return [elementRef, elementRect];
};
