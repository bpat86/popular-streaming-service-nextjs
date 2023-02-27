import { debounce } from "lodash";
import {
  Children,
  cloneElement,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useInView } from "react-intersection-observer";

import { sliderActions } from "@/actions/Actions";
import Controls from "@/components/slider/controls/Controls";
import LoadingItem from "@/components/slider/LoadingItem";
import PaginationIndicator from "@/components/slider/PaginationIndicator";
import SliderItem from "@/components/slider/SliderItem";
import TitleCardContainer from "@/components/slider/title-card/TitleCardContainer";
import useWindowResize from "@/hooks/useWindowResize";
import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import usePreviewModalStore from "@/store/PreviewModalStore";

import EventStopper from "./EventStopper";
import { MoveDirectionProps, SliderProps } from "./types";

const Slider = ({
  rowNum,
  sliderNum,
  sliderName,
  enablePeek,
  totalItems,
  enableLooping,
  isMyListRow,
  listContext,
  model,
  myListRowItemsLength,
  hasMovedOnce,
  setHasMovedOnce,
  previewModalEnabled,
  rowHasExpandedInfoDensity,
  toggleExpandedInfoDensity,
}: SliderProps) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [itemsInRow, setItemsInRow] = useState<number>(6);
  const [lowestVisibleItemIndex, setLowestVisibleItemIndex] =
    useState<number>(0);
  const [_activeRowItemIndex, setActiveRowItemIndex] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderItemsRef = useRef<Map<string, HTMLDivElement> | null>(null);
  const wrappedSliderItemsRef = useRef<Map<string, {}> | null>(null);
  const sliderIntervalIdRef = useRef<number | null>(null);
  const { isXl, isLg, isMd, isSm } = useWindowResize();
  const [inViewRef, inView] = useInView({
    threshold: 0.7,
  });

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

  useEffect(() => {
    handleWindowResize();
  }, [isXl, isLg, isMd, isSm, handleWindowResize]);

  /**
   * Get the slider items ref map
   */
  const getItemRefsMap = () => {
    if (!sliderItemsRef.current) {
      // Initialize the Map on first usage.
      sliderItemsRef.current = new Map();
    }
    return sliderItemsRef.current;
  };

  /**
   * Get the wrapped slider items ref map
   */
  const getWrappedItemRefsMap = () => {
    if (!wrappedSliderItemsRef.current) {
      // Initialize the Map on first usage.
      wrappedSliderItemsRef.current = new Map();
    }
    return wrappedSliderItemsRef.current;
  };

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
   * Handle the slider item focus event
   */
  const handleRowItemFocus = (idx: number) => {
    // console.log("handleRowItemFocus", idx);
    setActiveRowItemIndex(idx);
  };

  /**
   * Compute the SliderItem width based on row items visible
   */
  const getSliderItemsWidth = () => {
    return 100 / itemsInRow;
  };

  /**
   * Compute the highest index needed to make the slider appear seamless.
   */
  const getHighestIndex = () => {
    const next = lowestVisibleItemIndex + 2 * itemsInRow + 1;
    const totalItemsCount = getTotalItemsCount();
    return Math.min(totalItemsCount, next);
  };

  /**
   * Compute the lowest index needed to make the slider appear seamless.
   */
  const getLowestIndex = () => {
    const prev = lowestVisibleItemIndex - itemsInRow - 1;
    return Math.max(0, prev);
  };

  /**
   * Compute the total number of items in the slider.
   */
  const getTotalItemsCount = () => {
    return totalItems;
  };

  /**
   * Compute the total number of pages in the slider.
   */
  const getTotalPages = () => {
    const totalItemsCount = getTotalItemsCount();
    return Math.ceil(totalItemsCount / itemsInRow);
  };

  /**
   * Compute the page number for a given index.
   */
  const getPageNumber = (idx: number) => {
    return Math.ceil(idx / itemsInRow);
  };

  /**
   * Compute the offset for the slider based on the lowest visible item index.
   */
  const getBaseSliderOffset = () => {
    const itemsWidth = getSliderItemsWidth();
    let offset = 0;
    // If the slider has moved once, looping is enabled, and is in first row position
    // Or the lowest visible item is in the second row
    if (
      getTotalPages() > 1 &&
      ((hasMovedOnce && enableLooping && lowestVisibleItemIndex === 0) ||
        lowestVisibleItemIndex >= itemsInRow)
    ) {
      offset = -100;
    }
    // If the slider has moved once and is not looping
    if (
      hasMovedOnce &&
      (enableLooping || lowestVisibleItemIndex > itemsInRow)
    ) {
      offset -= itemsWidth;
    }
    // If the lowest visible item is in the first row
    if (lowestVisibleItemIndex > 0 && lowestVisibleItemIndex < itemsInRow) {
      offset -= lowestVisibleItemIndex * itemsWidth;
    }
    // Return the offset
    return offset;
  };

  /**
   * Compute the new offset amount based on the new lowest visible item index.
   */
  const getNewSliderOffset = (newOffset: number) => {
    return newOffset * getSliderItemsWidth();
  };

  /**
   * Render the slider items
   */
  const renderSliderItems = () => {
    if (!model || !model.length) return;
    const totalItemsCount = getTotalItemsCount();
    // Create a pre-filled array of default slider item elements
    const sliderItemChildren: ReactElement[] = Array.from(
      { length: model.length },
      (_, i) => {
        return (
          <SliderItem key={`title_${model[i].id}_${rowNum}`} model={model[i]} />
        );
      }
    );
    let lowestIndex = lowestVisibleItemIndex - getLowestIndex(),
      offscreenItems: ReactElement[] = [],
      visibleItems: ReactElement[] = [],
      itemsRange = 0;
    /**
     * If slider items exist, compute the visible items and the offscreen items.
     */
    if (sliderItemChildren && sliderItemChildren.length) {
      itemsRange = getHighestIndex() - getLowestIndex();
      visibleItems = sliderItemChildren.slice(
        getLowestIndex(),
        getHighestIndex()
      );
      /**
       * Since the initial number of items is artificially decreased to itemsInRow + 2,
       * fill the remaining items with loading items.
       */
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
       * If looping is disabled or the slider only has one page,
       * return the slider items without any modifications.
       */
      if (getTotalPages() <= 1 || !enableLooping) {
        return wrapSliderItems(visibleItems, lowestIndex);
      }
      /**
       * If the slider has more than one page and the last pages of the slider are active,
       * track the offscreen items and append them to the slider sequence.
       */
      if (getHighestIndex() - lowestVisibleItemIndex <= itemsInRow * 2) {
        /**
         * If last pages of the slider are active, track the offscreen items and append them to the slider
         */
        offscreenItems =
          lowestVisibleItemIndex + itemsInRow === totalItemsCount
            ? sliderItemChildren.slice(0, itemsInRow + 1)
            : sliderItemChildren.slice(0, 1);
        // Clone slider item component with new keys
        offscreenItems = cloneItemsWithNewKeys(offscreenItems, "_appended");
        // Combine arrays
        visibleItems = visibleItems.concat(offscreenItems);
      }
      /**
       * If the slider has moved once and the first pages of the slider are active,
       * track the offscreen items and prepend them to the slider sequence.
       */
      if (hasMovedOnce && lowestVisibleItemIndex - itemsInRow <= 0) {
        offscreenItems =
          lowestVisibleItemIndex === 0
            ? sliderItemChildren.slice(-itemsInRow - 1)
            : sliderItemChildren.slice(-1);
        lowestIndex += offscreenItems.length;
        // Clone slider item component and prepend latest items with mapped props to the sequence
        offscreenItems = cloneItemsWithNewKeys(offscreenItems, "_prepended");
        // Combine arrays
        visibleItems = offscreenItems.concat(visibleItems);
      }
    }
    // Wrap default slider items with props
    return wrapSliderItems(visibleItems, lowestIndex);
  };

  /**
   * Clone slider items and append new keys
   */
  const cloneItemsWithNewKeys = (items: ReactElement[], str: string) => {
    return items.map((item) => {
      return cloneElement(item, {
        key: `${item.key}${str}`,
      });
    });
  };

  /**
   * Create new slider items and apply props
   */
  const wrapSliderItems = (
    visibleItems: ReactElement[],
    lowestIndex: number
  ) => {
    const visibleItemIdx = lowestIndex + itemsInRow - 1;
    let itemPositionIdx = 0;
    // Clear the wrapped items map on each render
    getWrappedItemRefsMap().clear();
    // Not sure of a better way to do this without using the React Children API :(
    // https://reactjs.org/docs/react-api.html#reactchildren
    return Children.map(visibleItems, ({ key, props: { model } }, idx) => {
      const uid = Number(`${rowNum}${model?.id}${idx}`);
      let itemPosition = "",
        itemTabbable = false;
      /**
       * Set the item's position and tabbable state
       */
      if (idx === lowestIndex) {
        itemPosition = "leftEdge";
        itemTabbable = true;
      } else if (idx === lowestIndex - 1) {
        itemPosition = "leftPeek";
      } else if (idx === visibleItemIdx + 1) {
        itemPosition = "rightPeek";
      } else if (idx === visibleItemIdx) {
        itemPosition = "rightEdge";
        itemTabbable = true;
      } else if (idx >= lowestIndex && idx <= visibleItemIdx) {
        itemPosition = "middle";
        itemTabbable = true;
      }
      // Get the item's unique ID
      const itemUid = key ? `${key}slider-item` : `item_${idx}`;
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
          itemPositionIdx={itemPosition ? itemPositionIdx : 0}
          itemPosition={itemPosition}
        >
          <TitleCardContainer
            // key={`title-card-container-${uid}`}
            ref={(node: HTMLDivElement) => {
              const map = getItemRefsMap();
              node ? map.set(itemUid, node) : map.delete(itemUid);
            }}
            inViewport={inViewport}
            itemTabbable={inView ? itemTabbable : false}
            listContext={listContext}
            model={tcModel}
            myListRowItemsLength={myListRowItemsLength}
            onFocus={() => handleRowItemFocus(idx)}
            previewModalEnabled={previewModalEnabled}
            rankNum={idx}
            rowNum={rowNum}
            rowHasPreviewModalOpen={rowHasPreviewModalOpen}
            toggleExpandedInfoDensity={toggleExpandedInfoDensity}
          />
        </SliderItem>
      );
    });
  };

  /**
   * Get the slider items currently in wrappedItemRefsMap
   */
  const getSliderItems = (
    items: Array<{ uid: string; inViewport: boolean }>
  ) => {
    const visible = new Map();
    items.forEach(({ uid }: { uid: string }) => {
      visible.set(uid, getItemRefsMap().get(uid));
    });
    // console.log("visible: ", visible);
    return visible;
  };

  /**
   * Get the slider items that currently visible in the viewport
   */
  const getVisibleSliderItems = () => {
    return getSliderItems(
      (Array.from(getWrappedItemRefsMap().values()) as []).filter(
        ({ inViewport }) => inViewport
      )
    );
  };

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
   * Determine if slider has additional next pages
   */
  const hasMoreNextPages = () => {
    const currentVisibleIdx = lowestVisibleItemIndex + itemsInRow;
    return enableLooping || currentVisibleIdx < getTotalItemsCount();
  };

  /**
   * Determine if slider has previous pages
   */
  const hasMorePrevPages = () => {
    const currentVisibleIdx = lowestVisibleItemIndex - itemsInRow;
    return enableLooping || currentVisibleIdx > -itemsInRow;
  };

  /**
   * Determine if slider next button is active / visible
   */
  const isNextBtnNavActive = () => {
    return getTotalPages() > 1 && hasMoreNextPages();
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
  const advancePrev = (
    e: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>
  ) => {
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
    const getNewOffsetAmount = getNewSliderOffset(amountToOffset),
      newOffsetAmount = getNewOffsetAmount + getBaseSliderOffset();
    // Shift the slider from a keyboard event
    if (e && e.type === "keydown") {
      shiftSlider(rowItems, newOffsetAmount, sliderActions.MOVE_DIRECTION_PREV);
    }
    // Shift the slider from a click event
    shiftSlider(rowItems, newOffsetAmount, sliderActions.MOVE_DIRECTION_PREV);
  };

  /**
   * Move the slider forward when the Next button is clicked
   */
  const advanceNext = (
    e: MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>
  ) => {
    // e && e.preventDefault();
    if (!isNextBtnNavActive() || isAnimating) return;
    setIsAnimating(true);
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
      getNewOffsetAmount = getNewSliderOffset(amountToOffset),
      newOffsetAmount = getNewOffsetAmount + getBaseSliderOffset();
    // If rowItems is equal to the total number of items, set rowItems to 0
    rowItems === totalItemsCount && (rowItems = 0);
    // Shift the slider from a keyboard event
    if (e && e.type === "keydown") {
      shiftSlider(rowItems, newOffsetAmount, sliderActions.MOVE_DIRECTION_NEXT);
    }
    // Shift the slider from a click event
    shiftSlider(rowItems, newOffsetAmount, sliderActions.MOVE_DIRECTION_NEXT);
  };

  /**
   * Synchronously update slider state when it shifts
   */
  const onSliderMove = (
    lowestVisibleIdx: number,
    moveDirection: MoveDirectionProps
  ) => {
    resetSliderPosition();
    !hasMovedOnce && setHasMovedOnce(true);
    flushSync(() => setLowestVisibleItemIndex(lowestVisibleIdx));
    refocusAfterShift(moveDirection);
  };

  /**
   * Reset the slider base transform values on pageload and after it animates / shifts
   */
  const resetSliderPosition = () => {
    const getNewOffsetAmount = getAnimationStyle(getBaseSliderOffset());
    sliderRef.current &&
      sliderRef.current.setAttribute("style", getNewOffsetAmount);
  };

  /**
   * Clear the slider focus interval ID
   */
  const clearIntervals = () => {
    sliderIntervalIdRef.current &&
      (clearInterval(sliderIntervalIdRef.current),
      (sliderIntervalIdRef.current = null));
  };

  /**
   * Refocus visible slider item after the slider shifts
   */
  const refocusAfterShift = (moveDirection: MoveDirectionProps) => {
    const visibleItems = getVisibleSliderItems(),
      visibleItemsValues = Array.from(visibleItems.values()),
      itemIdx =
        moveDirection === sliderActions.MOVE_DIRECTION_NEXT
          ? 1
          : visibleItemsValues.length - 2,
      itemToFocus = visibleItemsValues[itemIdx];
    // If the item to focus is not null, set the interval to refocus the item
    if (itemToFocus) {
      const node = itemToFocus.querySelector(
        ".slider-refocus"
      ) as HTMLAnchorElement;
      sliderIntervalIdRef.current = window.setInterval(() => {
        setIsAnimating(false);
        clearIntervals();
        node.focus();
      }, 100);
    }
  };

  /**
   * Handle the slider movement and animation
   */
  const shiftSlider = (
    totalItemsCount: number,
    newOffsetAmount: number,
    moveDirection: MoveDirectionProps
  ) => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const getNewOffsetAmount = getAnimationStyle(newOffsetAmount);
    // Add the 'animating' class to the slider and set the new offset amount
    slider.classList.add("animating");
    slider.setAttribute("style", getNewOffsetAmount);
    // When the slider animation ends, reset the slider position and refocus the slider item
    ontransitionend = (e) => {
      if (e.target === slider) {
        onSliderMove(totalItemsCount, moveDirection);
        slider.classList.remove("animating");
      }
    };
  };

  /**
   * Shift the slider when the user swipes left or right
   */
  const onPan = (
    e: MouseEvent<HTMLDivElement> & TouchEvent,
    {
      offset,
      velocity,
    }: {
      offset: { x: number; y: number };
      velocity: { x: number; y: number };
    }
  ) => {
    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
      return Math.abs(offset) * velocity;
    };
    const swipe = swipePower(offset.x, velocity.x);
    if (isPreviewModalOpen()) return;
    if (swipe < -swipeConfidenceThreshold) {
      advanceNext(e);
    } else if (swipe > swipeConfidenceThreshold) {
      advancePrev(e);
    }
  };

  return (
    <div
      ref={inViewRef}
      className="row-content slider-hover-trigger-layer w-full overflow-x-visible whitespace-nowrap"
    >
      <div id={`slider-${sliderNum}`} className="slider px-6 sm:px-12">
        {/* Previous button */}
        {hasMovedOnce && (
          <Controls
            enablePeek={enablePeek}
            hasMovedOnce={hasMovedOnce}
            isAnimating={isAnimating}
            modalOpen={isPreviewModalOpen() && rowHasExpandedInfoDensity}
            moveDirection={sliderActions.MOVE_DIRECTION_PREV}
            onClick={advancePrev}
            onKeyDown={advancePrev}
          />
        )}
        {getTotalPages() > 1 && (
          <PaginationIndicator
            activePage={getPageNumber(lowestVisibleItemIndex)}
            totalPages={getTotalPages()}
          />
        )}
        <MotionDivWrapper
          className={clsxm("slider-mask touch-none", [
            enablePeek && "show-peek",
          ])}
          onPan={onPan}
        >
          <EventStopper>
            <div
              ref={sliderRef}
              className="slider-content row-with-x-columns"
              style={getReactAnimationStyle(getBaseSliderOffset())}
            >
              {renderSliderItems()}
            </div>
          </EventStopper>
        </MotionDivWrapper>
        {/* Next button */}
        {totalItems > itemsInRow && (
          <Controls
            enablePeek={enablePeek}
            hasMovedOnce={hasMovedOnce}
            isAnimating={isAnimating}
            modalOpen={isPreviewModalOpen() && rowHasExpandedInfoDensity}
            moveDirection={sliderActions.MOVE_DIRECTION_NEXT}
            onClick={advanceNext}
            onKeyDown={advanceNext}
          />
        )}
      </div>
    </div>
  );
};

export default Slider;
