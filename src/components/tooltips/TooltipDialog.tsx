import { forwardRef, MutableRefObject } from "react";
import { createPortal } from "react-dom";

type TooltipDialogProps = {
  as?: any;
  children: any;
  className?: string;
  style?: any;
};

const TooltipDialog = forwardRef(
  (
    {
      as: ElementType = "div",
      children,
      style,
      ...restProps
    }: TooltipDialogProps,
    tooltipRef
  ) => {
    const ref = tooltipRef as MutableRefObject<HTMLDivElement>;
    return createPortal(
      <ElementType ref={ref} style={style} {...restProps}>
        {children}
      </ElementType>,
      document.getElementById("tooltip-root") as HTMLDivElement
    );
  }
);

TooltipDialog.displayName = "TooltipDialog";
export default TooltipDialog;
