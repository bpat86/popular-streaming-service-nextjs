import {
  ComponentType,
  forwardRef,
  HTMLAttributes,
  MutableRefObject,
} from "react";
import { createPortal } from "react-dom";
// export interface ListProps
//   extends HTMLAttributes<
//     HTMLUListElement | HTMLOListElement | HTMLDListElement | HTMLLIElement
//   >

interface ModalOverlayProps extends HTMLAttributes<HTMLDivElement> {
  as?: ComponentType | "div";
  className?: string;
  inherit?: boolean;
  initial?: object;
  animate?: object;
  exit?: object;
}

const ModalOverlay = forwardRef<HTMLDivElement, ModalOverlayProps>(
  ({ as: Element = "div", className, ...props }, ref) => {
    const portalElementRef = ref as MutableRefObject<HTMLDivElement>;
    const parentRef = portalElementRef.current.parentNode as HTMLElement;
    return createPortal(
      <Element tabIndex={-1} {...props}>
        <div className={className} tabIndex={-1} data-uia={className} />
      </Element>,
      parentRef
    );
  }
);

ModalOverlay.displayName = "ModalOverlay";
export default ModalOverlay;
