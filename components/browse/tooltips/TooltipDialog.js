import { forwardRef } from "react";
import { createPortal } from "react-dom";

const TooltipDialog = forwardRef(
  (
    {
      as: ElementType = "div",
      portalElement = document.getElementById("tooltip-root"),
      children,
      ...props
    },
    ref
  ) => {
    return createPortal(
      <ElementType ref={ref} {...props}>
        {children}
      </ElementType>,
      portalElement
    );
  }
);

TooltipDialog.displayName = "TooltipDialog";
export default TooltipDialog;
