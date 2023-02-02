import FocusTrap from "focus-trap-react";
import { forwardRef, MutableRefObject, ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalFocusTrapWrapperProps = {
  element?: keyof JSX.IntrinsicElements;
  active: boolean;
  children: ReactNode;
  className?: string;
  focusTrapOptions?: object;
  tabIndex?: number;
};

const ModalFocusTrapWrapper = forwardRef<
  HTMLDivElement,
  ModalFocusTrapWrapperProps
>(
  (
    {
      element: ModalWrapperElement = "div",
      active,
      children,
      className,
      focusTrapOptions,
      tabIndex,
    },
    ref
  ) => {
    const portalElementRef = ref as MutableRefObject<HTMLDivElement>;
    const parentRef = portalElementRef.current.parentNode as HTMLElement;
    /**
     * Portal element
     * FocusTrap options
     * https://github.com/focus-trap/focus-trap#createoptions
     */
    return createPortal(
      <FocusTrap
        active={active}
        focusTrapOptions={focusTrapOptions}
        tabIndex={tabIndex}
      >
        <ModalWrapperElement className={className}>
          {children}
        </ModalWrapperElement>
      </FocusTrap>,
      parentRef
    );
  }
);

ModalFocusTrapWrapper.displayName = "ModalFocusTrapWrapper";
export default ModalFocusTrapWrapper;
