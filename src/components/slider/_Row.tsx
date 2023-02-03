import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { sliderActions } from "@/actions/Actions";
// Hooks
import useWindowResize from "@/hooks/useWindowResize";
import clsxm from "@/lib/clsxm";
import { IModel } from "@/store/types";

import Slider from "./_Slider";
import SliderItem from "./_SliderItem";

type SliderRowProps = {
  isMyListRow: boolean;
  listContext: string;
  sliderNum: number;
  mediaType: string;
  model: IModel[];
  myListRowItemsLength: number;
  rowNum: number;
  title: string;
  enablePeek: boolean;
  enableLooping: boolean;
  previewModalEnabled: boolean;
};

const SliderRow = ({
  isMyListRow,
  listContext,
  sliderNum,
  model,
  myListRowItemsLength,
  rowNum,
  title,
  enablePeek,
  enableLooping,
  previewModalEnabled,
}: SliderRowProps) => {
  const { isXl, isLg, isMd, isSm } = useWindowResize();
  const [rowHasExpandedInfoDensity, setRowHasExpandedInfoDensity] =
    useState<boolean>(false);
  const [sliderMoveDirection, setSliderMoveDirection] = useState<string>(
    sliderActions.SLIDER_NOT_SLIDING
  );
  const [hasMovedOnce, setHasMovedOnce] = useState<boolean>(false);
  const [lowestVisibleItemIndex, setLowestVisibleItemIndex] =
    useState<number>(0);
  const [_activeRowItemIndex, setActiveRowItemIndex] = useState<number>(0);
  const [itemsInRow, setItemsInRow] = useState<number>(6);

  /**
   * Set default slider items count
   */
  const handleWindowResize = debounce(
    useCallback(() => {
      if (isXl) {
        setItemsInRow(6);
      }
      if (isLg) {
        setItemsInRow(5);
      }
      if (isMd) {
        setItemsInRow(4);
      }
      if (isSm) {
        setItemsInRow(3);
      }
    }, [isXl, isLg, isMd, isSm]),
    100
  );

  /**
   * Set the default slider items count
   */
  useEffect(() => {
    handleWindowResize();
  }, [isXl, isLg, isMd, isSm, handleWindowResize]);

  /**
   * Toggle the expanded info density state
   */
  const toggleExpandedInfoDensity = (isExpanded: boolean) => {
    setRowHasExpandedInfoDensity(isExpanded);
  };

  /**
   * Update the lowest visible index state
   * Set the slider move direction
   */
  const handleSliderMove = (idx: number, direction: string) => {
    flushSync(() => {
      setLowestVisibleItemIndex(idx);
      setSliderMoveDirection(direction);
    });
  };

  /**
   * Create the SliderItem components with initial data items.
   * After the slider has moved once, map the rest of data.
   * SliderItems will be accessible as `props.children`
   * from the Slider component.
   * https://reactjs.org/docs/react-api.html#reactchildren
   */
  const renderSliderItems = () => {
    // console.log("model: ", model);
    return hasMovedOnce
      ? model.map(({ id }, idx) => (
          <SliderItem key={`title_${id}_${rowNum}`} model={model[idx]} />
        ))
      : model
          .slice(0, itemsInRow + 2)
          .map(({ id }, idx) => (
            <SliderItem key={`title_${id}_${rowNum}`} model={model[idx]} />
          ));
  };

  return (
    <div className="slider-row title-card">
      {title && (
        <h2 className="row-header my-4 px-[1.6rem] text-left text-base font-bold text-white sm:px-[3.1rem] sm:text-lg xl:text-2xl">
          {title}
        </h2>
      )}
      <div
        className={clsxm("row-container relative w-full", [
          rowHasExpandedInfoDensity && "has-expanded-info-density",
        ])}
      >
        <Slider
          enableLooping={enableLooping}
          enablePeek={enablePeek}
          hasMovedOnce={hasMovedOnce}
          isMyListRow={isMyListRow}
          itemsInRow={itemsInRow}
          listContext={listContext}
          lowestVisibleItemIndex={lowestVisibleItemIndex}
          myListRowItemsLength={myListRowItemsLength}
          setLowestVisibleItemIndex={setLowestVisibleItemIndex}
          setActiveRowItemIndex={setActiveRowItemIndex}
          onSliderMove={(totalItemCount, direction) =>
            handleSliderMove(totalItemCount, direction)
          }
          previewModalEnabled={previewModalEnabled}
          rowNum={rowNum}
          rowHasExpandedInfoDensity={rowHasExpandedInfoDensity}
          sliderMoveDirection={sliderMoveDirection}
          sliderNum={sliderNum}
          sliderName={title}
          setHasMovedOnce={setHasMovedOnce}
          toggleExpandedInfoDensity={toggleExpandedInfoDensity}
          totalItems={model?.length}
        >
          {renderSliderItems()}
        </Slider>
      </div>
    </div>
  );
};

export default SliderRow;