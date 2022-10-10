import { forwardRef } from "react";

const TooltipWrapper = forwardRef(
  ({ as: ElementType = "div", children, ...props }, ref) => {
    return (
      <ElementType ref={ref} {...props}>
        {children}
      </ElementType>
    );
  }
);

TooltipWrapper.displayName = "TooltipWrapper";
export default TooltipWrapper;
