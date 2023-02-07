import {
  cloneElement,
  MouseEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

import { sliderActions } from "@/actions/Actions";
import Controls from "@/components/slider/Controls";
import LoadingItem from "@/components/slider/LoadingItem";
import PaginationIndicator from "@/components/slider/PaginationIndicator";
import SliderItem from "@/components/slider/SliderItem";
import TitleCardContainer from "@/components/slider/title-card/TitleCardContainer";
import clsxm from "@/lib/clsxm";
import { IMediaItemWithUserPreferences } from "@/pages/api/tmdb/types";
import usePreviewModalStore from "@/store/PreviewModalStore";

type SliderProps = {
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
  onSliderMove: (sliderNum: number, direction: string) => void;
  lowestVisibleItemIndex: number;
  setLowestVisibleItemIndex: (index: number) => void;
  sliderMoveDirection:
    | typeof sliderActions.MOVE_DIRECTION_NEXT
    | typeof sliderActions.MOVE_DIRECTION_PREV
    | typeof sliderActions.SLIDER_NOT_SLIDING
    | typeof sliderActions.SLIDER_SLIDING;
  hasMovedOnce: boolean;
  setHasMovedOnce: (hasMoved: boolean) => void;
  previewModalEnabled: boolean;
  setActiveRowItemIndex: (idx: number) => void;
  rowHasExpandedInfoDensity: boolean;
  toggleExpandedInfoDensity: (arg0: boolean) => void;
};

const Slider = ({
  rowNum,
  sliderNum,
  sliderName,
  enablePeek,
  totalItems,
  itemsInRow,
  enableLooping,
  isMyListRow,
  listContext,
  model,
  myListRowItemsLength,
  onSliderMove,
  lowestVisibleItemIndex,
  setLowestVisibleItemIndex,
  sliderMoveDirection,
  hasMovedOnce,
  setHasMovedOnce,
  previewModalEnabled,
  setActiveRowItemIndex,
  rowHasExpandedInfoDensity,
  toggleExpandedInfoDensity,
}: SliderProps) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderItemsRef = useRef<Map<string, HTMLDivElement> | null>(null);
  const wrappedSliderItemsRef = useRef<Map<string, {}> | null>(null);
  const sliderIntervalIdRef = useRef<number | null>(null);

  /**
   * Get the slider items ref map
   */
  const getItemRefsMap = useCallback(() => {
    if (!sliderItemsRef.current) {
      // Initialize the Map on first usage.
      sliderItemsRef.current = new Map();
    }
    return sliderItemsRef.current;
  }, []);

  /**
   * Get the wrapped slider items ref map
   */
  const getWrappedItemRefsMap = useCallback(() => {
    if (!wrappedSliderItemsRef.current) {
      // Initialize the Map on first usage.
      wrappedSliderItemsRef.current = new Map();
    }
    return wrappedSliderItemsRef.current;
  }, []);

  /**
   * Determine if a preview modal is currently open
   */
  const isPreviewModalOpen = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return !!(
      previewModalStateById &&
      Object.values(previewModalStateById).some(({ isOpen }) => isOpen)
    );
  };

  /**
   * Determine if a preview modal is currently open
   */
  const rowHasPreviewModalOpen = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return !!(
      previewModalStateById &&
      Object.values(previewModalStateById).some(
        ({ isOpen, sliderRow }) => isOpen && sliderRow === rowNum
      )
    );
  };

  /**
   * Manually focus the slider after shifting
   */
  const handleRowItemFocus = (idx: number) => {
    // console.log("focus: ", idx);
    setActiveRowItemIndex(idx);
  };

  /**
   * Update the current active row index number
   */
  const handleActiveRowIndex = (idx: number) => {
    // console.log("focus: ", idx);
    setActiveRowItemIndex(idx);
  };

  /**
   * Compute the SliderItem width based on row items visible
   */
  const getSliderItemsWidth = useCallback(() => {
    return 100 / itemsInRow;
  }, [itemsInRow]);

  /**
   * With each slider shift, we need to determine the range of the next / previous
   * items to show the from the main data array. This function determines the
   * highest index needed to make the slider appear seamless.
   *
   * Here we compare the total number of items in the data array against the amount
   * of items required to fill two "pages" and return the smaller of the two.
   *
   * `nextRow` is determined from the `lowestVisibleItemIndex` plus `itemsInRow`
   * accounting for the "leftEdge" and "rightEdge" items.
   */
  const getHighestIndex = () => {
    const next = lowestVisibleItemIndex + 2 * itemsInRow + 1;
    const totalItemsCount = getTotalItemsCount();
    return Math.min(totalItemsCount, next);
  };

  /**
   * With each slider shift, we need to determine the range of the next / previous
   * items to show the from the main data array. This function determines the
   * lowest index needed to make the slider appear seamless.
   *
   * Here we compare the amount of items required to backfill two "pages"
   * against zero and return the larger of the two.
   */
  const getLowestIndex = () => {
    const prev = lowestVisibleItemIndex - itemsInRow - 1;
    return Math.max(0, prev);
  };

  const getTotalItemsCount = useCallback(() => {
    return totalItems;
  }, [totalItems]);

  const getTotalPages = useCallback(() => {
    const totalItemsCount = getTotalItemsCount();
    return Math.ceil(totalItemsCount / itemsInRow);
  }, [getTotalItemsCount, itemsInRow]);

  const getPageNumber = useCallback(
    (idx: number) => {
      return Math.ceil(idx / itemsInRow);
    },
    [itemsInRow]
  );

  const getBaseSliderOffset = useCallback(() => {
    const itemsWidth = getSliderItemsWidth();
    let offset = 0;
    const direction =
      sliderMoveDirection === sliderActions.MOVE_DIRECTION_PREV
        ? (!!-1 as any)
        : (!!1 as any);
    return (
      getTotalPages() > 1 &&
        (((hasMovedOnce && enableLooping && lowestVisibleItemIndex === 0) ||
          lowestVisibleItemIndex >= itemsInRow) &&
          (offset = -100),
        hasMovedOnce &&
          (enableLooping || lowestVisibleItemIndex > itemsInRow) &&
          (offset -= itemsWidth),
        lowestVisibleItemIndex > 0 &&
          lowestVisibleItemIndex < itemsInRow &&
          (offset -= lowestVisibleItemIndex * itemsWidth)),
      (offset *= direction)
    );
  }, [
    getTotalPages,
    getSliderItemsWidth,
    hasMovedOnce,
    enableLooping,
    lowestVisibleItemIndex,
    itemsInRow,
    sliderMoveDirection,
  ]);

  /**
   * Returns the amount of pixels the slider needs to move in order to show
   * the next / previous batch of items.
   */
  const getNewSliderOffset = (newOffset: number) => {
    const direction =
      sliderMoveDirection === sliderActions.MOVE_DIRECTION_PREV
        ? (!!-1 as any)
        : (!!1 as any);
    return newOffset * getSliderItemsWidth() * direction;
  };

  /**
   * Handle child elements and clone, wrap them in props so we can track
   * their visibility and positions.
   */
  const renderSliderItems = () => {
    const totalItemsCount = getTotalItemsCount();
    const data: IMediaItemWithUserPreferences[] = Array.from(model);
    let lowestIndex = lowestVisibleItemIndex - getLowestIndex(),
      offscreenItems: (IMediaItemWithUserPreferences | ReactElement)[] = [],
      visibleItems: (IMediaItemWithUserPreferences | ReactElement)[] = [],
      itemsRange = 0;
    /**
     * Fill in the gaps with empty loading items
     */
    if (data && data.length) {
      itemsRange = getHighestIndex() - getLowestIndex();
      visibleItems = data.slice(getLowestIndex(), getHighestIndex());
      for (
        let idx = 0;
        visibleItems.length < itemsRange &&
        visibleItems.length < totalItemsCount;
        idx++
      ) {
        // Fill in the gaps with loading items
        visibleItems.push(
          <LoadingItem
            key={`loading-title-${idx}`}
            width={getSliderItemsWidth()}
          />
        );
      }
      /**
       * The state of the slider before it has shifted at least once
       */
      enableLooping &&
        getTotalPages() > 1 &&
        (getHighestIndex() - lowestVisibleItemIndex <= itemsInRow * 2 &&
          ((offscreenItems =
            lowestVisibleItemIndex + itemsInRow === totalItemsCount // Determine if current page is the last page
              ? data.slice(0, itemsInRow + 1) // Initial set of items in the sequence
              : data.slice(0, 1)), // First child item in the sequence
          // Clone slider item component and append latest items with mapped props to the sequence
          (offscreenItems = cloneItemsWithNewKeys(
            offscreenItems as (IMediaItemWithUserPreferences & ReactElement)[],
            "_appended"
          ))),
        // Combine arrays
        (visibleItems = visibleItems.concat(offscreenItems)),
        console.log("offscreenItems", offscreenItems),
        console.log("visibleItems", visibleItems));
      /**
       * If the slider has shifted at least once, we need to check if the
       */
      hasMovedOnce &&
        lowestVisibleItemIndex - itemsInRow <= 0 &&
        // If first page of results, get last page, otherwise
        ((offscreenItems =
          lowestVisibleItemIndex === 0
            ? data.slice(-itemsInRow - 1) // Last set of items in the sequence
            : data.slice(-1)), // Last child item in the sequence
        (lowestIndex += offscreenItems.length),
        // Clone slider item component and prepend latest items with mapped props to the sequence
        (offscreenItems = cloneItemsWithNewKeys(
          offscreenItems as (IMediaItemWithUserPreferences & ReactElement)[],
          "_prepended"
        )),
        // Combine arrays
        (visibleItems = offscreenItems.concat(visibleItems)),
        console.log("offscreenItems", offscreenItems),
        console.log("visibleItems", visibleItems));
    }
    // Return the wrapped items
    return wrapSliderItems(
      visibleItems as IMediaItemWithUserPreferences[],
      lowestIndex
    );
  };

  /**
   * Clone slider items and append new keys
   */
  const cloneItemsWithNewKeys = (
    items: (IMediaItemWithUserPreferences & ReactElement)[],
    str: string
  ) => {
    return items.map((item) => {
      return cloneElement(item, {
        key: `title_${item.id}_${rowNum}${str}`,
      });
    });
  };

  /**
   * Create new slider items and apply props
   */
  const wrapSliderItems = useCallback(
    (visibleItems: IMediaItemWithUserPreferences[], lowestIndex: number) => {
      const visibleItemIdx = lowestIndex + itemsInRow - 1;
      let itemPositionIdx = 0;
      // Clear the wrapped items map before re-rendering
      getWrappedItemRefsMap().clear();
      // Return the wrapped items
      return visibleItems.map((model, idx) => {
        // console.log("model: ", model);
        const uid = Number(`${rowNum}${model?.id}${idx}`);
        let itemPosition = "",
          itemTabbable = false;
        // Assign item position based on its index
        idx === lowestIndex
          ? ((itemPosition = "leftEdge"), (itemTabbable = true))
          : idx === lowestIndex - 1
          ? (itemPosition = "leftPeek")
          : idx === visibleItemIdx + 1
          ? (itemPosition = "rightPeek")
          : idx === visibleItemIdx
          ? ((itemPosition = "rightEdge"), (itemTabbable = true))
          : idx >= lowestIndex &&
            idx <= visibleItemIdx &&
            ((itemPosition = "middle"), (itemTabbable = true));
        // Get the item's unique ID
        const itemUid = model.key ? `${model.key}slider-item` : `item_${idx}`;
        // Get the item's DOM node
        const itemNode = getItemRefsMap().get(itemUid);
        let inViewport = false;
        // If the item is in the viewport, set its position and add it to the map
        if (itemPosition && ((itemPositionIdx += 1), (inViewport = true))) {
          getWrappedItemRefsMap().set(itemUid, {
            uid: itemUid,
            inViewport,
          });
        }
        // TitleCard videoModel
        const tcVideoModel = {
          cast: model?.cast,
          crew: model?.crew,
          dislikedMediaId: model?.disliked_media_id,
          genres: model?.genres,
          listContext,
          id: model?.id,
          identifiers: {
            uid,
            id: model?.id,
            mediaType: model?.media_type,
          },
          imageKey: model?.backdrop_path,
          inMediaList: model?.in_media_list,
          isBillboard: model?.is_billboard,
          isMyListRow,
          isDisliked: model?.is_disliked,
          isLiked: model?.is_liked,
          likedMediaId: model?.liked_media_id,
          // logos: model?.images?.logos,
          mediaListId: model?.media_list_id,
          mediaType: model?.media_type,
          rankNum: idx,
          rect: itemNode?.getBoundingClientRect(),
          reference: { ...model },
          rowNum,
          scrollPosition: scrollY,
          sliderName,
          synopsis: model?.overview,
          rowHasExpandedInfoDensity,
          tagline: model?.tagline,
          title: model?.original_title || model?.original_name,
          titleCardId: `title-card-${sliderNum}-${idx}`,
          titleCardRef: itemNode,
          videoId: model?.id,
          // videoKey: getVideoKey(model?.videos),
          // videos: model?.videos,
          videoPlayback: {
            start: null,
            length: null,
          },
        };
        // TitleCard model
        const tcModel = {
          uid,
          id: model?.id,
          isMyListRow,
          listContext,
          mediaType: model?.media_type,
          rankNum: idx,
          rect: itemNode?.getBoundingClientRect(),
          ref: itemNode,
          rowNum,
          scrollPosition: scrollY,
          sliderName,
          titleCardRef: itemNode,
          imageKey: model?.backdrop_path,
          videoId: model?.id,
          // videoKey: getVideoKey(model?.videos),
          videoModel: { ...tcVideoModel },
        };
        // Render the slider items
        return (
          <SliderItem
            key={itemUid}
            fullDataLoaded={!!model?.backdrop_path}
            isAnimating={isAnimating}
            itemPositionIdx={itemPosition ? itemPositionIdx : 0}
            itemPosition={itemPosition}
          >
            <TitleCardContainer
              key={`title-card-container-${uid}`}
              ref={(node: HTMLDivElement) => {
                const map = getItemRefsMap();
                node ? map.set(itemUid, node) : map.delete(itemUid);
              }}
              inViewport={inViewport}
              itemTabbable={itemTabbable}
              listContext={listContext}
              model={tcModel}
              myListRowItemsLength={myListRowItemsLength}
              onFocus={() => {
                return handleRowItemFocus(idx);
              }}
              previewModalEnabled={previewModalEnabled}
              rankNum={idx}
              rowNum={rowNum}
              rowHasPreviewModalOpen={rowHasPreviewModalOpen}
              toggleExpandedInfoDensity={toggleExpandedInfoDensity}
            />
          </SliderItem>
        );
      });
    },
    [
      getItemRefsMap,
      getWrappedItemRefsMap,
      handleRowItemFocus,
      isAnimating,
      isMyListRow,
      itemsInRow,
      listContext,
      myListRowItemsLength,
      previewModalEnabled,
      rowHasPreviewModalOpen,
      rowNum,
      rowHasExpandedInfoDensity,
      sliderNum,
      sliderName,
      toggleExpandedInfoDensity,
    ]
  );

  /**
   * Return visible slider item refs
   */
  const getSliderItems = useCallback(
    (items: Array<{ uid: string; inViewport: boolean }>) => {
      const visible = new Map();
      items.forEach(({ uid }: { uid: string }) => {
        visible.set(uid, getItemRefsMap().get(uid));
      });
      // console.log("visible: ", visible);
      return visible;
    },
    [getItemRefsMap]
  );

  /**
   * Get the slider items that currently visible in the viewport
   */
  const getVisibleSliderItems = useCallback(() => {
    // console.log("keys: ", getWrappedItemRefsMap().keys());
    // console.log("values: ", getWrappedItemRefsMap().values());
    // console.log("entries: ", getWrappedItemRefsMap().entries());
    return getSliderItems(
      (Array.from(getWrappedItemRefsMap().values()) as []).filter(
        ({ inViewport }) => inViewport
      )
    );
  }, [getSliderItems, getWrappedItemRefsMap]);

  /**
   * Set the .slider-content animation `style` attribute
   */
  const getAnimationStyle = (translateX: number) => {
    return [
      `-webkit-transform: translate3d(${translateX}%, 0px, 0px)`,
      `-ms-transform: translate3d(${translateX}%, 0px, 0px)`,
      `transform: translate3d(${translateX}%, 0px, 0px)`,
    ].join(";");
  };

  /**
   * Set the initial .slider-content animation `style` attribute
   */
  const getReactAnimationStyle = (translateX: number) => {
    const transform = translateX ? `translate3d(${translateX}%, 0px, 0px)` : "";
    return {
      WebkitTransform: transform,
      MsTransform: transform,
      transform: transform,
    };
  };

  /**
   * Return the active row page / segment
   */
  const getActiveRowSegment = (
    totalItemsCount: number,
    items: number,
    rowItems: number
  ) => {
    const pages = items / totalItemsCount,
      segments = rowItems / totalItemsCount,
      rowSegments = segments / pages;
    return Math.ceil(rowSegments);
  };

  /**
   * Determine if slider has previous pages
   */
  const hasMorePrevPages = () => {
    const potentialPrevPages = lowestVisibleItemIndex - itemsInRow;
    return enableLooping || potentialPrevPages > -itemsInRow;
  };

  /**
   * Determine if slider previous button is active / visible
   */
  const isPrevBtnNavActive = () => {
    return getTotalPages() > 1 && hasMovedOnce && hasMorePrevPages();
  };

  /**
   * Move the slider backwards when the Previous button is clicked
   */
  const advancePrev = (e: MouseEvent<HTMLSpanElement>) => {
    // Proceed if the previous button is active and the slider is not currently animating
    if (!isPrevBtnNavActive() || isAnimating) return;

    setIsAnimating(true);
    // Get the total number of items
    const totalItemsCount = getTotalItemsCount();
    let rowItems = lowestVisibleItemIndex - itemsInRow;
    lowestVisibleItemIndex !== 0 && rowItems < 0 && (rowItems = 0);
    // Amount to offset the slider
    const amountToOffset = lowestVisibleItemIndex - rowItems;
    lowestVisibleItemIndex === 0 && (rowItems = totalItemsCount - itemsInRow);
    // Get the new slider offset
    const getNewOffset = getNewSliderOffset(amountToOffset),
      newOffsetAmount = getNewOffset + getBaseSliderOffset();
    e && "wheel" === e.type
      ? shiftSlider(
          rowItems,
          newOffsetAmount,
          sliderActions.MOVE_DIRECTION_PREV,
          {
            x: e.clientX,
            y: e.clientY,
          },
          false,
          getActiveRowSegment(totalItemsCount, itemsInRow, rowItems)
        )
      : e && "keydown" === e.type
      ? shiftSlider(
          rowItems,
          newOffsetAmount,
          sliderActions.MOVE_DIRECTION_PREV,
          null,
          true,
          getActiveRowSegment(totalItemsCount, itemsInRow, rowItems)
        )
      : shiftSlider(
          rowItems,
          newOffsetAmount,
          sliderActions.MOVE_DIRECTION_PREV,
          null,
          false,
          getActiveRowSegment(totalItemsCount, itemsInRow, rowItems)
        );
  };

  /**
   * Determine if slider has additional next pages
   */
  const hasMoreNextPages = () => {
    const potentialNext = lowestVisibleItemIndex + itemsInRow;
    return enableLooping || potentialNext < getTotalItemsCount();
  };

  /**
   * Determine if slider next button is active / visible
   */
  const isNextBtnNavActive = () => {
    return getTotalPages() > 1 && hasMoreNextPages();
  };

  /**
   * Move the slider forward when the Next button is clicked
   */
  const advanceNext = (e: MouseEvent<HTMLSpanElement>) => {
    // e && e.preventDefault();
    if (!isNextBtnNavActive() && isAnimating) return;
    const totalItemsCount = getTotalItemsCount();
    const nextRow = lowestVisibleItemIndex + 2 * itemsInRow;
    // Set initial rowItems to the lowest visible item index plus the number of items in a row
    let rowItems = lowestVisibleItemIndex + itemsInRow;
    // If rowItems is greater than the total number of items, set rowItems to the total number of items minus the number of items in a row
    rowItems !== totalItemsCount &&
      nextRow > totalItemsCount &&
      (rowItems = totalItemsCount - itemsInRow);
    // Offset amount to move the slider
    const amountToOffset = lowestVisibleItemIndex - rowItems,
      getNewOffset = getNewSliderOffset(amountToOffset),
      newOffsetAmount = getNewOffset + getBaseSliderOffset();
    // If rowItems is equal to the total number of items, set rowItems to 0
    rowItems === totalItemsCount && (rowItems = 0);
    setIsAnimating(true);
    e && "wheel" === e.type
      ? shiftSlider(
          rowItems,
          newOffsetAmount,
          sliderActions.MOVE_DIRECTION_NEXT,
          {
            x: e.clientX,
            y: e.clientY,
          },
          false,
          getActiveRowSegment(totalItemsCount, itemsInRow, rowItems)
        )
      : e && "keydown" === e.type
      ? shiftSlider(
          rowItems,
          newOffsetAmount,
          sliderActions.MOVE_DIRECTION_NEXT,
          null,
          true,
          getActiveRowSegment(totalItemsCount, itemsInRow, rowItems)
        )
      : shiftSlider(
          rowItems,
          newOffsetAmount,
          sliderActions.MOVE_DIRECTION_NEXT,
          null,
          false,
          getActiveRowSegment(totalItemsCount, itemsInRow, rowItems)
        );
  };

  /**
   * Handle the slider movement and animation
   */
  const shiftSlider = (
    totalItemsCount: number,
    newOffsetAmount: number,
    action:
      | typeof sliderActions.MOVE_DIRECTION_NEXT
      | typeof sliderActions.MOVE_DIRECTION_PREV
      | typeof sliderActions.SLIDER_NOT_SLIDING
      | typeof sliderActions.SLIDER_SLIDING,
    coordinates: { x: number; y: number } | null,
    isMouseEvent: boolean,
    activeRowSegment: number
  ) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const getNewStyle = getAnimationStyle(newOffsetAmount);
    // typeof onSliderMove === "function" && onSliderMove(totalItemsCount, action);
    slider.addEventListener("transitionend", function transitionEnd(e) {
      flushSync(() => {
        e.target === slider &&
          slider.removeEventListener("transitionend", transitionEnd),
          slider.classList.remove("animating");
        setLowestVisibleItemIndex(totalItemsCount);
        !hasMovedOnce && setHasMovedOnce(true);
        resetSliderPosition();
        setIsAnimating(false);
        onSliderMove(totalItemsCount, action);
        refocusAfterShift(action);
      });
    });
    slider.classList.add("animating");
    slider.setAttribute("style", getNewStyle);
  };

  /**
   * Refocus visible slider item after the slider shifts
   */
  const refocusAfterShift = useCallback(
    (
      action:
        | typeof sliderActions.MOVE_DIRECTION_NEXT
        | typeof sliderActions.MOVE_DIRECTION_PREV
    ) => {
      const visibleItems = getVisibleSliderItems();
      const visibleItemsValues = Array.from(visibleItems.values());
      // console.log("itemToFocus 1: ", visibleItems);
      // console.log("itemToFocus 2: ", Array.from(visibleItems.values()));
      let itemToFocus: HTMLDivElement, itemIdx;
      visibleItemsValues.length > 1 &&
        (itemIdx =
          action === sliderActions.MOVE_DIRECTION_NEXT
            ? 1
            : visibleItemsValues.length - 2);
      // console.log("itemToFocus 1: ", visibleItemsValues),
      // console.log("itemToFocus 2: ", visibleItemsValues[itemIdx]),
      itemIdx &&
        (itemToFocus = visibleItemsValues[itemIdx]) &&
        itemToFocus &&
        (sliderIntervalIdRef.current = window.setInterval(() => {
          sliderIntervalIdRef.current &&
            clearInterval(sliderIntervalIdRef.current),
            (
              itemToFocus.querySelector(".slider-refocus") as HTMLAnchorElement
            ).focus();
        }, 300));
    },
    [getVisibleSliderItems]
  );

  /**
   * Reset the slider base transform values on pageload and after it animates / shifts
   */
  const resetSliderPosition = useCallback(() => {
    const baseSliderOffset = getBaseSliderOffset();
    const getNewStyle = getAnimationStyle(baseSliderOffset);
    sliderRef.current && sliderRef.current.setAttribute("style", getNewStyle);
  }, [getBaseSliderOffset]);

  /**
   * Update itemsInRow amount if values change
   */
  useEffect(() => {
    if (itemsInRow) {
      getVisibleSliderItems();
      resetSliderPosition();
    }
  }, [getVisibleSliderItems, itemsInRow, resetSliderPosition]);

  return (
    <div className="row-content slider-hover-trigger-layer w-full overflow-x-visible whitespace-nowrap">
      <div id={`slider-${sliderNum}`} className="slider px-6 sm:px-12">
        {/* Previous button */}
        {hasMovedOnce &&
          !(isPreviewModalOpen() && rowHasExpandedInfoDensity) && (
            <Controls
              enablePeek={enablePeek}
              hasMovedOnce={hasMovedOnce}
              isAnimating={isAnimating}
              moveDirection={sliderActions.MOVE_DIRECTION_PREV}
              onClick={advancePrev}
            />
          )}
        {getTotalPages() > 1 && (
          <PaginationIndicator
            activePage={getPageNumber(lowestVisibleItemIndex)}
            totalPages={getTotalPages()}
          />
        )}
        <div className={clsxm("slider-mask", [enablePeek && "show-peek"])}>
          <div
            ref={sliderRef}
            className="slider-content row-with-x-columns"
            style={getReactAnimationStyle(getBaseSliderOffset())}
          >
            {renderSliderItems()}
          </div>
        </div>
        {/* Next button */}
        {totalItems > itemsInRow &&
          !(isPreviewModalOpen() && rowHasExpandedInfoDensity) && (
            <Controls
              enablePeek={enablePeek}
              hasMovedOnce={hasMovedOnce}
              isAnimating={isAnimating}
              moveDirection={sliderActions.MOVE_DIRECTION_NEXT}
              onClick={advanceNext}
            />
          )}
      </div>
    </div>
  );
};

export default Slider;
