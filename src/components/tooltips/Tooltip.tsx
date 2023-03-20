import { ReactNode, useRef } from "react";

import { useHover } from "@/hooks/useHover";
import clsxm from "@/lib/clsxm";
import useInteractionStore from "@/store/InteractionStore";

import TooltipContainer from "./TooltipContainer";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isHovering = useHover(wrapperRef);

  // Render the tooltip
  return (
    <div
      ref={wrapperRef}
      className={clsxm("tooltip-wrapper relative", className)}
    >
      {isHovering && useInteractionStore.getState().tooltipsEnabled && (
        <TooltipContainer key={text} ref={wrapperRef} showCaret={showCaret}>
          {text}
        </TooltipContainer>
      )}
      {children}
    </div>
  );
};

export default Tooltip;
