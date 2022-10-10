import { useState, useRef } from "react";

export const usePositionStore = () => {
  const [renderCount, triggerReRender] = useState(0);
  const elementPosition = useRef({ x: 10, y: 150 });
  const viewportPosition = useRef({ x: 0, y: 0 });
  let throttleTimeout = null;

  const getPos = (el, axis) => Math.round(el.current[axis]);

  const setPos = (el, pos) => {
    el.current = pos;
    if (throttleTimeout !== null) return;
    // Only re-render the component every 0.1s
    throttleTimeout = setTimeout(() => triggerReRender(renderCount + 1), 100);
  };

  return {
    getElementX: () => getPos(elementPosition, "x"),
    getElementY: () => getPos(elementPosition, "y"),
    getViewportX: () => getPos(viewportPosition, "x"),
    getViewportY: () => getPos(viewportPosition, "y"),
    setElementPosition: (pos) => setPos(elementPosition, pos),
    setViewportPosition: (pos) => setPos(viewportPosition, pos),
    renderCount,
  };
};
