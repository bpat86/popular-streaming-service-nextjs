import { ReactNode, useContext, useRef } from "react";

import InteractionContext from "@/context/InteractionContext";
import { useHover } from "@/hooks/useHover";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import clsxm from "@/lib/clsxm";

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
  const { tooltipsAreEnabled } = useContext(InteractionContext);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isHovering = useHover(wrapperRef);

  // Render the tooltip
  return (
    <div ref={wrapperRef} className={clsxm("relative", className)}>
      <AnimatePresenceWrapper>
        {isHovering && tooltipsAreEnabled() && (
          <TooltipContainer key={text} ref={wrapperRef} showCaret={showCaret}>
            {text}
          </TooltipContainer>
        )}
      </AnimatePresenceWrapper>
      {children}
    </div>
  );
};

export default Tooltip;
