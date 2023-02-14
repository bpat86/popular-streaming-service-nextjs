import { sliderActions } from "@/actions/Actions";

import { MoveDirectionProps } from "../types";

type IconProps = {
  moveDirection: MoveDirectionProps;
};

const Icon = ({ moveDirection }: IconProps) => {
  return moveDirection === sliderActions.MOVE_DIRECTION_PREV ? (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"></path>
    </svg>
  ) : (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"></path>
    </svg>
  );
};

export default Icon;
