import { ReactNode } from "react";

import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IMediaItemWithUserPreferences } from "@/pages/api/tmdb/types";

type SliderItemProps = {
  children: ReactNode;
  model: IMediaItemWithUserPreferences;
  fullDataLoaded: boolean;
  inViewport: boolean;
  itemPosition: string;
  itemPositionIdx: number;
};

const SliderItem = ({
  children,
  fullDataLoaded,
  itemPosition,
  itemPositionIdx,
}: Partial<SliderItemProps>) => {
  return (
    <MotionDivWrapper
      className={clsxm("slider-item", [
        fullDataLoaded && itemPositionIdx
          ? `slider-item-${itemPositionIdx}`
          : `slider-item-`,
        itemPosition && `${itemPosition}`,
      ])}
    >
      {fullDataLoaded ? (
        children
      ) : (
        <div className="boxart-size-16x9 animate-pulse bg-zinc-800" />
      )}
    </MotionDivWrapper>
  );
};

export default SliderItem;
