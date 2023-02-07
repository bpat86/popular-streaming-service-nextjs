import debounce from "lodash/debounce";
import { useCallback, useEffect, useState } from "react";

// Hooks
import useWindowResize from "@/hooks/useWindowResize";
import clsxm from "@/lib/clsxm";
import { IMediaItemWithUserPreferences } from "@/pages/api/tmdb/types";

import Slider from "./Slider";

type SliderRowProps = {
  isMyListRow: boolean;
  listContext: string;
  sliderNum: number;
  mediaType: string;
  model: IMediaItemWithUserPreferences[];
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
  const [hasMovedOnce, setHasMovedOnce] = useState<boolean>(false);
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
  const toggleExpandedInfoDensity = useCallback((isExpanded: boolean) => {
    setRowHasExpandedInfoDensity(isExpanded);
  }, []);

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
          model={hasMovedOnce ? model : model.slice(0, itemsInRow + 2)}
          myListRowItemsLength={myListRowItemsLength}
          previewModalEnabled={previewModalEnabled}
          rowNum={rowNum}
          rowHasExpandedInfoDensity={rowHasExpandedInfoDensity}
          sliderNum={sliderNum}
          sliderName={title}
          setHasMovedOnce={setHasMovedOnce}
          toggleExpandedInfoDensity={toggleExpandedInfoDensity}
          totalItems={model?.length}
        />
      </div>
    </div>
  );
};

export default SliderRow;
