import { useState, useEffect, useCallback, useRef } from "react";

export const useElementRect = (props) => {
  const { textChange, stateChange, ref: passedInRef } = props;
  const [elementRect, setElementRect] = useState({});
  const elementRef = useRef();

  const handleElementRect = useCallback(() => {
    /**
     * Save the element's size and position relative to the viewport to state
     */
    passedInRef
      ? setElementRect(
          passedInRef && passedInRef.current
            ? passedInRef.current.getBoundingClientRect()
            : {},
          []
        )
      : setElementRect(
          elementRef && elementRef.current
            ? elementRef.current.getBoundingClientRect()
            : {},
          []
        );
  }, [textChange]);

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
