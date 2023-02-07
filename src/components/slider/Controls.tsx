import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
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
  /**
   * Handle click event on the slider controls
   */
  const handleOnClick = (e: MouseEvent<HTMLSpanElement>) => {
    if (isAnimating) return;
    onClick(e);
  };

  return (
    <span
      key={moveDirection}
      tabIndex={hasMovedOnce ? 0 : -1}
      role="button"
      className={clsxm("handle", [
        moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? "handlePrev active"
          : "handleNext active",
      ])}
      aria-label={`${
        moveDirection === sliderActions.MOVE_DIRECTION_PREV
          ? "See previous titles"
          : "See more titles"
      }`}
      onClick={handleOnClick}
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
          <ChevronLeftIcon className="h-7 w-7 scale-100 transform transition duration-75 ease-out hover:scale-150 xl:h-8 xl:w-8" />
        ) : (
          <ChevronRightIcon className="h-7 w-7 scale-100 transform transition duration-75 ease-out hover:scale-150 xl:h-8 xl:w-8" />
        )}
      </div>
    </span>
  );
};

export default SliderControls;
