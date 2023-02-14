import { KeyboardEvent, MouseEvent } from "react";

import { sliderActions } from "@/actions/Actions";
import { IMediaItemWithUserPreferences } from "@/pages/api/tmdb/types";

export type SliderProps = {
  rowNum: number;
  sliderNum: number;
  sliderName: string;
  enablePeek: boolean;
  totalItems: number;
  itemsInRow: number;
  enableLooping: boolean;
  isMyListRow: boolean;
  listContext: string;
  model: IMediaItemWithUserPreferences[];
  myListRowItemsLength: number;
  hasMovedOnce: boolean;
  setHasMovedOnce: (hasMovedOnce: boolean) => void;
  previewModalEnabled: boolean;
  rowHasExpandedInfoDensity: boolean;
  toggleExpandedInfoDensity: (arg0: boolean) => void;
};

export type MoveDirectionProps =
  | typeof sliderActions.MOVE_DIRECTION_NEXT
  | typeof sliderActions.MOVE_DIRECTION_PREV
  | typeof sliderActions.SLIDER_NOT_SLIDING
  | typeof sliderActions.SLIDER_SLIDING;

export type SliderControlsProps = {
  enablePeek: boolean;
  hasMovedOnce: boolean;
  isAnimating: boolean;
  moveDirection: string;
  onClick: (e: MouseEvent<HTMLSpanElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLSpanElement>) => void;
};
