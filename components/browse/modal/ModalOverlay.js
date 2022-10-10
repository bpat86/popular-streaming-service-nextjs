import { forwardRef } from "react";
import { createPortal } from "react-dom";

const ModalOverlay = forwardRef(
  ({ element: ElementType = "div", className, ...props }, portalElementRef) => {
    return createPortal(
      <ElementType tabIndex="-1" {...props}>
        <div className={className} tabIndex="-1" data-uia={className} />
      </ElementType>,
      portalElementRef
    );
  }
);

ModalOverlay.displayName = "ModalOverlay";
export default ModalOverlay;
