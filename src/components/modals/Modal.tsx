import { forwardRef, MutableRefObject } from "react";

type ModalProps = {
  [key: string]: any;
  element: any;
  children: any;
  className?: string;
  role?: string;
};
const Modal = forwardRef(
  ({ element: ModalElement, children, ...props }: ModalProps, ref) => {
    const modalRef = ref as MutableRefObject<HTMLDivElement>;
    return (
      <ModalElement ref={modalRef} {...props}>
        {children}
      </ModalElement>
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
