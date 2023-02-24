import { KeyboardEvent, MouseEvent } from "react";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

type CloseButtonProps = {
  onClick: (e: MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (e: KeyboardEvent) => void;
};

const CloseButton = ({ onClick, onKeyDown }: CloseButtonProps) => {
  return (
    <MotionDivWrapper
      inherit={false}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        opacity: {
          duration: 0.3,
          ease: "linear",
        },
      }}
      className="preview-modal preview-modal-close rounded-full focus:outline-none focus:ring-2 focus:ring-white"
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <svg
        data-uia="preview-modal-close-btn"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </MotionDivWrapper>
  );
};

export default CloseButton;
