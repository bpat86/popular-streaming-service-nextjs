import { CSSProperties, forwardRef, ReactNode, RefObject } from "react";

type EventStopperProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const EventStopper = forwardRef(
  ({ children, className, style }: EventStopperProps, ref) => {
    return (
      <div
        ref={ref as RefObject<HTMLDivElement>}
        className={className}
        onPointerDownCapture={(e) => e.preventDefault()}
        onTouchStartCapture={(e) => e.preventDefault()}
        onMouseDownCapture={(e) => e.preventDefault()}
        onClickCapture={(e) => e.preventDefault()}
        style={style}
      >
        {children}
      </div>
    );
  }
);

export default EventStopper;
