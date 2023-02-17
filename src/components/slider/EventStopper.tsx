import { ReactNode } from "react";

type EventStopperProps = {
  children: ReactNode;
};

const EventStopper = ({ children }: EventStopperProps) => {
  return (
    <div
      onPointerDownCapture={(e) => e.preventDefault()}
      onTouchStartCapture={(e) => e.preventDefault()}
      onMouseDownCapture={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
};

export default EventStopper;
