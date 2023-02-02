import { MouseEvent } from "react";

import { sliderActions } from "@/actions/Actions";
import clsxm from "@/lib/clsxm";

type SliderControlsProps = {
  enablePeek: boolean;
  isAnimating: boolean;
  onClick: (e: MouseEvent<HTMLSpanElement>) => void;
  modalOpen: boolean;
  moveDirection: string;
  showNextButton: boolean;
  hasMovedOnce: boolean;
};

const SliderControls = ({
  enablePeek,
  isAnimating,
  onClick,
  modalOpen,
  moveDirection,
  showNextButton,
  hasMovedOnce,
}: SliderControlsProps): JSX.Element => {
  /**
   * Handle click event on the slider controls
   */
  const handleOnClick = (e: MouseEvent<HTMLSpanElement>) => {
    if (isAnimating) return;
    onClick(e);
  };

  if (showNextButton) {
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
          {moveDirection === sliderActions.MOVE_DIRECTION_PREV
            ? !modalOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 scale-100 transform transition duration-75 ease-out hover:scale-150 xl:h-10 xl:w-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )
            : !modalOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 scale-100 transform transition duration-75 ease-out hover:scale-150 xl:h-10 xl:w-10"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
        </div>
      </span>
    );
  }
  return <></>;
};

export default SliderControls;
