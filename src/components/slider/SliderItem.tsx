import { ReactNode } from "react";

import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IModel } from "@/store/types";

type SliderItemProps = {
  children: ReactNode;
  model: IModel;
  isAnimating: boolean;
  fullDataLoaded: boolean;
  inViewport: boolean;
  itemPosition: string;
  itemPositionIdx: number;
};

const SliderItem = ({
  children,
  isAnimating,
  fullDataLoaded,
  itemPosition,
  itemPositionIdx,
}: Partial<SliderItemProps>) => {
  /**
   * Shrink removal animation when item is removed from user list
   */
  const animationProps = () => {
    if (isAnimating) return {};
    return {
      exit: {
        scaleX: 0,
        scaleY: 0,
        opacity: 0,
        transition: {
          delay: 0.12,
          opacity: {
            delay: 0.3,
            duration: 0.36,
            ease: "linear",
          },
          duration: 0.36,
          ease: [0.21, 0, 0.07, 1],
        },
      },
    };
  };

  return (
    <MotionDivWrapper
      className={clsxm("slider-item", [
        fullDataLoaded && itemPositionIdx
          ? `slider-item-${itemPositionIdx}`
          : `slider-item-`,
        itemPosition && `${itemPosition}`,
      ])}
      {...animationProps()}
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
