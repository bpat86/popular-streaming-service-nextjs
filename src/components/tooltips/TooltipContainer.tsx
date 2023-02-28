import { forwardRef, ReactNode, RefObject, useRef } from "react";

import TooltipPortal from "@/components/tooltips/TooltipPortal";
import { useRect } from "@/hooks/useRect";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

type TooltipContainerProps = {
  children: string | ReactNode;
  showCaret: boolean;
};

const TooltipContainer = forwardRef(
  ({ children, showCaret }: TooltipContainerProps, ref) => {
    const wrapperRef = ref as RefObject<HTMLDivElement>;
    const portalRef = useRef<HTMLDivElement>(null);
    const wrapperRect = wrapperRef.current?.getBoundingClientRect();
    // const wrapperRect = useRect(wrapperRef);
    const portalRect = useRect(portalRef);

    /**
     * Tooltip styles
     */
    const portalStyle = () => {
      if (
        !wrapperRef.current ||
        !portalRef.current ||
        !wrapperRect ||
        !portalRect
      )
        return {
          opacity: 0,
        };
      // Get wrapper and tooltip container dimensions and offsets
      const topOffset = wrapperRect.top + window.scrollY,
        rightOffset = document.body.clientWidth - portalRect.right,
        heightOffset = portalRect.height - wrapperRect.height,
        offscreenLeft = portalRect.x < 0,
        offScreenRight = portalRect.right > document.body.clientWidth,
        x = Math.round(
          wrapperRect.left +
            window.scrollX -
            portalRect.width / 2 +
            wrapperRect.width / 2
        ),
        leftX = 0,
        rightX = Math.round(x + rightOffset),
        y = Math.round(topOffset - heightOffset / 2 - wrapperRect.height * 1.5);
      // Return the styles if the tooltip is offscreen to the left
      if (offscreenLeft) {
        return {
          y: `${y}px`,
          x: `${leftX}px`,
          zIndex: 9999999,
          width: `${portalRect.width}px`,
          opacity: portalRect.x ? 1 : 0,
        };
      }
      // Return the styles if the tooltip is offscreen to the right
      if (offScreenRight) {
        return {
          y: `${y}px`,
          x: `${rightX}px`,
          zIndex: 9999999,
          width: `${portalRect.width}px`,
          opacity: portalRect.x ? 1 : 0,
        };
      }
      // Return the default tooltip styles
      return {
        y: `${y}px`,
        x: `${x}px`,
        zIndex: 9999999,
        width: `${portalRect.width}px`,
        opacity: portalRect.x ? 1 : 0,
      };
    };

    /**
     * Caret placement styles
     */
    const caretStyle = () => {
      if (
        !showCaret ||
        !wrapperRef.current ||
        !portalRef.current ||
        !wrapperRect ||
        !portalRect
      )
        return { opacity: 0 };
      // Get wrapper and tooltip container dimensions and offsets
      const rightOffset = document.body.clientWidth - portalRect.right,
        offscreenLeft = portalRect.x < 0,
        offScreenRight = portalRect.right > document.body.clientWidth,
        // right = Math.round(
        //   portalRect.width / 2 - rightOffset - wrapperRect.width / 2
        // ),
        // left = Math.round(wrapperRect.left + window.scrollX),
        leftX = Math.round(
          wrapperRect.left +
            window.scrollX -
            portalRect.width / 2 +
            wrapperRect.width / 2
        ),
        rightX = Math.round(rightOffset);
      // Return the styles if the tooltip is offscreen to the left
      if (offscreenLeft) {
        return {
          x: `${leftX}px`,
          width: `${wrapperRect.width}px`,
          opacity: portalRect.x ? 1 : 0,
        };
      }
      // Return the styles if the tooltip is offscreen to the right
      if (offScreenRight) {
        return {
          x: `${-rightX}px`,
          width: `${wrapperRect.width}px`,
          opacity: portalRect.x ? 1 : 0,
        };
      }
      // Return the default caret styles
      return {
        width: `${wrapperRect.width}px`,
        opacity: portalRect.x ? 1 : 0,
      };
    };

    return (
      <TooltipPortal
        ref={portalRef}
        className="pointer-events-none absolute flex select-none items-center justify-center shadow-xl"
        style={{ ...portalStyle() }}
      >
        {/* Tooltip */}
        <div className="tooltip whitespace-nowrap rounded bg-zinc-100 py-2 px-4 text-[0.65rem] font-semibold text-zinc-900 sm:text-[1.1rem] xl:text-xl">
          {children}
        </div>
        {/* Caret */}
        {showCaret && (
          <MotionDivWrapper
            className="absolute top-2/3 -z-1 flex items-center justify-center"
            style={{ ...caretStyle() }}
          >
            <div className="h-5 w-5 rotate-45 bg-zinc-100" />
          </MotionDivWrapper>
        )}
      </TooltipPortal>
    );
  }
);

export default TooltipContainer;
