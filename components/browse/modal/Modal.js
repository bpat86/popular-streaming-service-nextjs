import { forwardRef } from "react";

const Modal = forwardRef(
  ({ element: ModalElement = "div", children, ...props }, modalRef) => {
    return (
      <ModalElement ref={modalRef} {...props}>
        {children}
      </ModalElement>
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
