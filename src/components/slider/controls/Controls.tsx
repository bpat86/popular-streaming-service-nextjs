import { KeyboardEvent, MouseEvent } from "react";

import { sliderActions } from "@/actions/Actions";
import clsxm from "@/lib/clsxm";

import { SliderControlsProps } from "../types";
import Icon from "./Icon";

const SliderControls = ({
  enablePeek,
  hasMovedOnce,
  isAnimating,
  modalOpen,
  moveDirection,
  onClick,
  onKeyDown,
}: SliderControlsProps) => {
  /**
   * Handle click events
   */
  const handleOnClick = (e: MouseEvent<HTMLSpanElement>) => onClick(e);

  /**
   * Handle keyboard events
   */
  const handleOnKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" && !isAnimating) {
      onKeyDown(e);
    }
  };

  return (
    <span
      key={moveDirection}
      tabIndex={hasMovedOnce ? 0 : -1}
      role="button"
      className={clsxm("handle group", [
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
      onKeyDown={handleOnKeyDown}
    >
      <div
        className={clsxm(
          "flex h-full w-full cursor-pointer items-center justify-center transition duration-100 ease-out",
          [
            enablePeek
              ? "bg-zinc-900 bg-opacity-50 group-hover:bg-opacity-75 group-focus:bg-opacity-75"
              : "group-hover:bg-bg-zinc-900 bg-transparent group-hover:bg-opacity-75 group-focus:bg-zinc-900 group-focus:bg-opacity-75",
          ]
        )}
      >
        {!modalOpen && <Icon moveDirection={moveDirection} />}
      </div>
    </span>
  );
};

export default SliderControls;
