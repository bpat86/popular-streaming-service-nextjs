import { forwardRef, MutableRefObject } from "react";
import { createPortal } from "react-dom";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

type TooltipPortalProps = {
  children: any;
  className?: string;
  style?: object;
};

const TooltipPortal = forwardRef(
  ({ children, ...restProps }: TooltipPortalProps, tooltipRef) => {
    const ref = tooltipRef as MutableRefObject<HTMLDivElement>;
    return createPortal(
      <MotionDivWrapper ref={ref} {...restProps}>
        {children}
      </MotionDivWrapper>,
      document.getElementById("tooltip-root") as HTMLDivElement
    );
  }
);

TooltipPortal.displayName = "TooltipPortal";
export default TooltipPortal;
