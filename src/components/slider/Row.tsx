import debounce from "lodash/debounce";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { sliderActions } from "@/actions/Actions";
// Hooks
import useWindowResize from "@/hooks/useWindowResize";
import clsxm from "@/lib/clsxm";
import { IModel } from "@/store/types";

import Slider from "./Slider";
import SliderItem from "./SliderItem";

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
  // mediaType,
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
  // const [initialLowestVisibleIndex, setInitialLowestVisibleIndex] =
  //   useState<number>(0);
  // const [highestVisibleItemIndex, setHighestVisibleItemIndex] =
  //   useState<number>(0);
  const [lowestVisibleItemIndex, setLowestVisibleItemIndex] =
    useState<number>(0);
  const [activeRowItemIndex, setActiveRowItemIndex] = useState<number>(0);
  const [itemsInRow, setItemsInRow] = useState<number>(6);

  useEffect(() => {
    handleWindowResize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isXl, isLg, isMd, isSm]);

  /**
   * Set default slider items count
   */
  const handleWindowResize = debounce(() => {
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
  }, 100);

  const toggleExpandedInfoDensity = (isExpanded: boolean) => {
    setRowHasExpandedInfoDensity(isExpanded);
  };

  /**
   * Update the lowest visible index state
   * Set the slider move direction
   * @param {Number} idx
   * @param {String} direction
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
  const getSliderRowItems = () => {
    // console.log(`Slider ${sliderNum} items ${data}`);
    return hasMovedOnce
      ? model.map(({ id }, idx) => (
          <SliderItem key={`title_${id}_${rowNum}${idx}`} model={model[idx]} />
        ))
      : model
          .slice(0, itemsInRow + 2)
          .map(({ id }, idx) => (
            <SliderItem
              key={`title_${id}_${rowNum}${idx}`}
              model={model[idx]}
            />
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
          // activeRowItemIndex={activeRowItemIndex}
          enableLooping={enableLooping}
          enablePeek={enablePeek}
          hasMovedOnce={hasMovedOnce}
          // highestVisibleItemIndex={highestVisibleItemIndex}
          // setHighestVisibleItemIndex={setHighestVisibleItemIndex}
          // initialLowestVisibleIndex={initialLowestVisibleIndex}
          // setInitialLowestVisibleIndex={setInitialLowestVisibleIndex}
          isMyListRow={isMyListRow}
          itemsInRow={itemsInRow}
          listContext={listContext}
          lowestVisibleItemIndex={lowestVisibleItemIndex}
          myListRowItemsLength={myListRowItemsLength}
          setLowestVisibleItemIndex={setLowestVisibleItemIndex}
          setActiveRowItemIndex={setActiveRowItemIndex}
          // fullDataLoaded={hasMovedOnce}
          // model={model}
          onSliderMove={(totalItemCount, direction) =>
            handleSliderMove(totalItemCount, direction)
          }
          previewModalEnabled={previewModalEnabled}
          rowNum={rowNum}
          rowHasExpandedInfoDensity={rowHasExpandedInfoDensity}
          sliderMoveDirection={sliderMoveDirection}
          sliderNum={sliderNum}
          sliderName={title}
          // sliderMediaType={mediaType}
          setHasMovedOnce={setHasMovedOnce}
          toggleExpandedInfoDensity={toggleExpandedInfoDensity}
          totalItems={model?.length}
        >
          {getSliderRowItems()}
        </Slider>
      </div>
    </div>
  );
};

export default SliderRow;
