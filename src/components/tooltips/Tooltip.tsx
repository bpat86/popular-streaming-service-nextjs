import { MutableRefObject, ReactNode, useContext, useRef } from "react";

import TooltipContainer from "@/components/tooltips/TooltipContainer";
import InteractionContext from "@/context/InteractionContext";
import { useElementRect } from "@/hooks/useElementRect";
import { useHover } from "@/hooks/useHover";
import clsxm from "@/lib/clsxm";

type TooltipProps = {
  children: ReactNode;
  className?: string;
  showCaret?: boolean;
  text: string;
};

const Tooltip = ({
  children,
  className,
  showCaret = true,
  text,
}: TooltipProps) => {
  const { tooltipsAreEnabled } = useContext(InteractionContext);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hover] = useHover({ ref: wrapperRef });
  const [tooltipRef, tooltipRect] = useElementRect({
    state: hover && tooltipsAreEnabled(),
    ref: wrapperRef,
  });

  /**
   * Tooltip styles
   */
  const style = () => {
    // If the tooltip refs aren't ready, return early
    if (!wrapperRef.current || !tooltipRef || !tooltipRect) {
      return {
        zIndex: -1,
        opacity: 0,
      };
    }
    // Get wrapper and tooltip dimensions
    const wrapper = wrapperRef.current.getBoundingClientRect() as DOMRect,
      tooltip = tooltipRect as DOMRect & { clientWidth: number },
      topOffset = wrapper.top + window.scrollY,
      x =
        wrapper.left +
        window.scrollX -
        tooltip.clientWidth / 2 +
        wrapper.width / 2,
      y =
        Math.round(topOffset - (wrapper.height - wrapper.height) / 2) -
        wrapper.height * 1.5;
    // eslint-disable-next-line no-console
    console.log("tooltip::: ", tooltip);
    // Return the styles
    return {
      y: `${y}px`,
      x: `${x}px`,
      zIndex: 9999999,
      width: `${tooltip.clientWidth}px`,
      opacity: 1,
    };
  };

  // Render the tooltip
  return (
    <div ref={wrapperRef} className={clsxm("relative", className)}>
      {hover && tooltipsAreEnabled() && (
        <TooltipContainer
          ref={tooltipRef as MutableRefObject<HTMLDivElement>}
          className="pointer-events-none absolute flex select-none items-center justify-center whitespace-nowrap shadow-lg"
          style={style()}
        >
          {/* Tooltip */}
          <div className="rounded bg-zinc-100 py-2 px-4 text-[0.65rem] font-semibold text-zinc-900 sm:text-[1.1rem] xl:text-xl">
            {text}
          </div>
          {/* Caret */}
          {showCaret && (
            <div className="absolute top-2/3 -z-1 h-5 w-5 rotate-45 bg-zinc-100" />
          )}
        </TooltipContainer>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
