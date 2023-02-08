import { MouseEvent } from "react";

import { sliderActions } from "@/actions/Actions";
import clsxm from "@/lib/clsxm";

type SliderControlsProps = {
  enablePeek: boolean;
  isAnimating: boolean;
  onClick: (e: MouseEvent<HTMLSpanElement>) => void;
  moveDirection: string;
  hasMovedOnce: boolean;
};

const SliderControls = ({
  enablePeek,
  isAnimating,
  onClick,
  moveDirection,
  hasMovedOnce,
}: SliderControlsProps) => {
  return (
    <span
      key={moveDirection}
      tabIndex={hasMovedOnce ? 0 : -1}
      role="button"
      className={clsxm("handle", [
        moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? "handlePrev active"
          : "handleNext active",
        isAnimating && "pointer-events-none",
      ])}
      aria-label={`${
        moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? "See previous titles"
          : "See more titles"
      }`}
      onClick={onClick}
    >
      <div
        className={clsxm(
          "pointer-events-auto flex h-full w-6 cursor-pointer items-center justify-center transition duration-100 ease-out sm:w-12",
          [
            enablePeek
              ? "bg-black bg-opacity-50 hover:bg-opacity-80"
              : "bg-transparent hover:bg-black hover:bg-opacity-80",
          ]
        )}
      >
        {moveDirection === sliderActions.MOVE_DIRECTION_PREV ? (
          <svg
            className="h-9 w-9 scale-100 transform transition duration-75 ease-out hover:scale-150 xl:h-11 xl:w-11"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"></path>
          </svg>
        ) : (
          <svg
            className="h-9 w-9 scale-100 transform transition duration-75 ease-out hover:scale-150 xl:h-11 xl:w-11"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
          </svg>
        )}
      </div>
    </span>
  );
};

export default SliderControls;
