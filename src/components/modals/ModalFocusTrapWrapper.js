import FocusTrap from "focus-trap-react";
import { forwardRef } from "react";
import { createPortal } from "react-dom";

const ModalFocusTrapWrapper = forwardRef(
  (
    {
      element: ModalWrapperElement = "div",
      active,
      children,
      className,
      focusTrapOptions,
    },
    portalElementRef
  ) => {
    /**
     * Portal element
     * FocusTrap options
     * https://github.com/focus-trap/focus-trap#createoptions
     */
    return createPortal(
      <FocusTrap active={active} focusTrapOptions={focusTrapOptions}>
        <ModalWrapperElement className={className}>
          {children}
        </ModalWrapperElement>
      </FocusTrap>,
      portalElementRef
    );
  }
);

ModalFocusTrapWrapper.displayName = "ModalFocusTrapWrapper";
export default ModalFocusTrapWrapper;
