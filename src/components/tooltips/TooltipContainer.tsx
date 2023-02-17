import { forwardRef, MutableRefObject } from "react";
import { createPortal } from "react-dom";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

type TooltipContainerProps = {
  children: any;
  className?: string;
  style?: object;
};

const TooltipContainer = forwardRef(
  ({ children, ...restProps }: TooltipContainerProps, tooltipRef) => {
    const ref = tooltipRef as MutableRefObject<HTMLDivElement>;
    return createPortal(
      <MotionDivWrapper ref={ref} {...restProps}>
        {children}
      </MotionDivWrapper>,
      document.getElementById("tooltip-root") as HTMLDivElement
    );
  }
);

TooltipContainer.displayName = "TooltipContainer";
export default TooltipContainer;
