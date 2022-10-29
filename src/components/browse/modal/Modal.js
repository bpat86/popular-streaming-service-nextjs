import { forwardRef } from "react";

const Modal = forwardRef(
  ({ element: ModalElement, children, ...props }, modalRef) => {
    return (
      <ModalElement ref={modalRef} {...props}>
        {children}
      </ModalElement>
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
