import {
  Children,
  cloneElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";

// Actions
import { sliderActions } from "@/actions/Actions";
// Components
import Controls from "@/components/slider/Controls";
import LoadingItem from "@/components/slider/LoadingItem";
import PaginationIndicator from "@/components/slider/PaginationIndicator";
import SliderItem from "@/components/slider/SliderItem";
import TitleCardContainer from "@/components/slider/title-card/TitleCardContainer";
// Lib
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";
import { getVideoKey } from "@/utils/getVideoKey";

const Slider = (props) => {
  const {
    children,
    rowNum,
    sliderNum,
    sliderName,
    enablePeek,
    totalItems,
    itemsInRow,
    enableLooping,
    isMyListRow,
    listContext,
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
  } = props;

  // const previewModalStateById = usePreviewModalStore(
  //   (state) => state.previewModalStateById
  // );

  const [isAnimating, setIsAnimating] = useState(false);

  const sliderRef = useRef(null);
  const sliderItemRefs = useRef({});
  const wrappedSliderItems = useRef(new Set());
  const sliderIntervalIdRef = useRef(0);
  const shift = useRef({
    event: undefined,
    xScrollDirection: undefined,
    rowSegment: undefined,
  });

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
  };

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const rowHasPreviewModalOpen = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return Object.values(previewModalStateById).some(
      ({ isOpen, sliderRow }) => isOpen && sliderRow === rowNum
    );
  };

  /**
   * Set slider shift params
   * @param {Object} shift.current
   */
  const setShift = ({ event, xScrollDirection, rowSegment }) => {
    shift.current = { event, xScrollDirection, rowSegment };
  };

  /**
   * Manually focus the slider after shifting
   * @param {Number} titleCardIdx
   */
  const handleRowItemFocus = (titleCardIdx) => {
    // console.log("focus: ", titleCardIdx);
    setActiveRowItemIndex(titleCardIdx);
  };

  /**
   * Update the current active row index number
   * @param {Number} number
   */
  const handleActiveRowIndex = (number) => {
    setActiveRowItemIndex(number);
  };

  /**
   * Compute the SliderItem width based on row items visible
   * @returns {Number}
   */
  const getSliderItemWidth = useCallback(() => {
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
   * `nextItems` is determined from the `lowestVisibleItemIndex` plus `itemsInRow`
   * accounting for the "leftEdge" and "rightEdge" items.
   * @returns {Number}
   */
  const getHighestIndex = () => {
    const nextItems = lowestVisibleItemIndex + 2 * itemsInRow + 1;
    const totalItemCount = getTotalItemCount();
    return Math.min(totalItemCount, nextItems);
  };

  /**
   * With each slider shift, we need to determine the range of the next / previous
   * items to show the from the main data array. This function determines the
   * lowest index needed to make the slider appear seamless.
   *
   * Here we compare the amount of items required to backfill two "pages"
   * against zero and return the larger of the two.
   * @returns {Number}
   */
  const getLowestIndex = () => {
    const prevItems = lowestVisibleItemIndex - itemsInRow - 1;
    return Math.max(0, prevItems);
  };

  const getTotalItemCount = useCallback(() => {
    return totalItems;
  }, [totalItems]);

  const getTotalPages = useCallback(() => {
    const totalItemCount = getTotalItemCount();
    return Math.ceil(totalItemCount / itemsInRow);
  }, [getTotalItemCount, itemsInRow]);

  const getPageNumber = useCallback(
    (idx) => {
      return Math.ceil(idx / itemsInRow);
    },
    [itemsInRow]
  );

  const getBaseSliderOffset = useCallback(() => {
    const itemWidth = getSliderItemWidth();
    let offset = 0;
    return (
      getTotalPages() > 1 &&
        (((hasMovedOnce && enableLooping && lowestVisibleItemIndex === 0) ||
          lowestVisibleItemIndex >= itemsInRow) &&
          (offset = -100),
        hasMovedOnce &&
          (enableLooping || lowestVisibleItemIndex > itemsInRow) &&
          (offset -= itemWidth),
        lowestVisibleItemIndex > 0 &&
          lowestVisibleItemIndex < itemsInRow &&
          (offset -= lowestVisibleItemIndex * itemWidth)),
      (offset *= !!(sliderMoveDirection === sliderActions.MOVE_DIRECTION_PREV
        ? -1
        : 1))
    );
  }, [
    getTotalPages,
    getSliderItemWidth,
    hasMovedOnce,
    enableLooping,
    lowestVisibleItemIndex,
    itemsInRow,
    sliderMoveDirection,
  ]);

  /**
   * Returns the amount of pixels the slider needs to move in order to show
   * the next / previous batch of items.
   * @param {Number} newOffset
   * @returns {Number}
   */
  const getNewSliderOffset = (newOffset) => {
    return (
      newOffset *
      getSliderItemWidth() *
      !!(sliderMoveDirection === sliderActions.MOVE_DIRECTION_PREV ? -1 : 1)
    );
  };

  /**
   * Handle child elements and clone, wrap them in props so we can track
   * their visibility and positions.
   * @returns {Object}
   */
  const getSliderItemContents = () => {
    let lowestIndex = lowestVisibleItemIndex - getLowestIndex(),
      totalItemCount = getTotalItemCount(),
      sliderContentIndex = [],
      viewportIndex = [],
      itemRange = 0;

    /**
     * Rather than dump the entire array of data onto the page,
     * we're only going to show the SliderItems we need to
     * be visible within a range of specified indexes.
     */
    if (children && children.length) {
      itemRange = getHighestIndex() - getLowestIndex();
      viewportIndex = children.slice(getLowestIndex(), getHighestIndex());
      for (
        let idx = 0;
        viewportIndex.length < itemRange &&
        viewportIndex.length < totalItemCount;
        idx++
      ) {
        viewportIndex.push(
          <LoadingItem
            key={"loading-title-" + idx}
            widthPercent={getSliderItemWidth()}
          />
        );
      }

      /**
       * The initial state of the slider on mount.
       * It only loads and displays a few items
       * and fills the remaining space with
       * empty "loading" divs.
       */
      getTotalPages() > 1 &&
        enableLooping &&
        getHighestIndex() - lowestVisibleItemIndex <= itemsInRow * 2 &&
        ((sliderContentIndex =
          lowestVisibleItemIndex + itemsInRow === totalItemCount // If current page is the last page
            ? children.slice(0, itemsInRow + 1) // Initial set of items in viewport sequence
            : children.slice(0, 1)), // First item of the sequence
        // Clone slider item component and append latest items with mapped props to the sequence
        (sliderContentIndex = cloneItemsWithNewKeys(
          sliderContentIndex,
          "_appended"
        )),
        // Combine arrays
        (viewportIndex = Array.from(
          new Set(viewportIndex.concat(sliderContentIndex))
        )));

      /**
       * The state of the slider after it has shifted at least once.
       * Prepend the items from the end or last "page" of the
       * main data array to front of the visible items
       * array so it appears to be infinite.
       */
      hasMovedOnce &&
        lowestVisibleItemIndex - itemsInRow <= 0 &&
        // If first page of results, get last page, otherwise
        ((sliderContentIndex =
          lowestVisibleItemIndex === 0
            ? children.slice(-itemsInRow - 1) // Last set of items in the sequence
            : children.slice(-1)), // Last child item in the sequence
        (lowestIndex += sliderContentIndex.length),
        // Clone slider item component and prepend latest items with mapped props to the sequence
        (sliderContentIndex = cloneItemsWithNewKeys(
          sliderContentIndex,
          "_prepended"
        )),
        // Combine arrays
        (viewportIndex = Array.from(
          new Set(sliderContentIndex.concat(viewportIndex))
        )));
    }

    /**
     * Map through the 60 or so Children components and then wrap the cloned items
     * with props denoting their position on the viewport.
     */
    return wrapSliderItems(viewportIndex, lowestIndex);
  };

  /**
   * Clone items and apply new keys
   * @param {Object} index
   * @param {String} string
   * @returns
   */
  const cloneItemsWithNewKeys = (index, string) => {
    return index.map((index) => {
      return cloneElement(index, {
        key: index.key + string,
      });
    });
  };

  /**
   * Create new slider items and apply props
   * @param {Object} sliderItem
   * @param {Number} lowestIndex
   * @returns
   */
  const wrapSliderItems = (sliderItemChildren, lowestIndex) => {
    let visibleItemIdx = lowestIndex + itemsInRow - 1,
      itemPositionIdx = 0;

    return (
      (wrappedSliderItems.current = new Set()),
      Children.map(sliderItemChildren, (sliderItemChild, idx) => {
        // Set item position based on its viewport positioning
        const uid = Number(`${rowNum}${idx}${sliderItemChild.props.model?.id}`);
        let itemPosition = "",
          itemVisible = false;
        idx === lowestIndex
          ? ((itemPosition = "leftEdge"), (itemVisible = true))
          : idx === lowestIndex - 1
          ? (itemPosition = "leftPeek")
          : idx === visibleItemIdx + 1
          ? (itemPosition = "rightPeek")
          : idx === visibleItemIdx
          ? ((itemPosition = "rightEdge"), (itemVisible = true))
          : idx >= lowestIndex &&
            idx <= visibleItemIdx &&
            ((itemPosition = "middle"), (itemVisible = true));

        // Set item keys and ids
        let itemViewportIndex = itemPosition ? itemPositionIdx : "",
          itemUid = sliderItemChild.key
            ? sliderItemChild.key + "slider-item"
            : "item_" + idx,
          itemInViewport = false;

        // Push wrapped item into slider wrapped item array
        itemPosition && ((itemPositionIdx += 1), (itemInViewport = true)),
          wrappedSliderItems.current.add({
            uid: itemUid,
            inViewport: itemInViewport,
          });

        // Clone the items in the viewport array and assign props (Gallery modal stuff)
        // let clonedItems = cloneElement(sliderItemChild, {
        //   itemUid: itemUid,
        //   itemTabbable: itemVisible,
        //   viewportIndex: itemViewportIndex,
        //   viewportPosition: itemPosition,
        // });

        return (
          <SliderItem
            key={itemUid}
            fullDataLoaded={sliderItemChild.props.model?.backdrop_path}
            sliderIsAnimating={isAnimating}
            viewportIndex={itemViewportIndex}
            viewportPosition={itemPosition}
          >
            <TitleCardContainer
              key={`title-card-container-${uid}`}
              ref={(element) => (sliderItemRefs.current[itemUid] = element)}
              inViewport={itemInViewport}
              isMyListRow={isMyListRow}
              itemTabbable={itemVisible}
              listContext={listContext}
              mediaType={sliderItemChild.props.model?.media_type}
              model={{
                uid,
                id: sliderItemChild.props.model?.id,
                isMyListRow,
                listContext: listContext,
                mediaType: sliderItemChild.props.model?.media_type,
                rankNum: idx,
                rect: sliderItemRefs.current[itemUid]?.getBoundingClientRect(),
                ref: sliderItemRefs.current[itemUid],
                rowNum,
                scrollPosition: scrollY,
                sliderName,
                titleCardRef: sliderItemRefs.current[itemUid],
                imageKey: sliderItemChild.props.model?.backdrop_path,
                videoId: sliderItemChild.props.model?.id,
                videoKey: getVideoKey(sliderItemChild.props.model),
                videoModel: {
                  cast: sliderItemChild.props.model?.cast,
                  crew: sliderItemChild.props.model?.crew,
                  dislikedMediaId:
                    sliderItemChild.props.model?.disliked_media_id,
                  genres: sliderItemChild.props.model?.genres,
                  listContext,
                  id: sliderItemChild.props.model?.id,
                  identifiers: {
                    uid: `${rowNum}${idx}${sliderItemChild.props.model?.id}`,
                    id: sliderItemChild.props.model?.id,
                    mediaType: sliderItemChild.props.model?.media_type,
                  },
                  imageKey: sliderItemChild.props.model?.backdrop_path,
                  inMediaList: sliderItemChild.props.model?.in_media_list,
                  isBillboard: sliderItemChild.props.model?.is_billboard,
                  isMyListRow,
                  isDisliked: sliderItemChild.props.model?.is_disliked,
                  isLiked: sliderItemChild.props.model?.is_liked,
                  likedMediaId: sliderItemChild.props.model?.liked_media_id,
                  logos: sliderItemChild.props.model?.images?.logos,
                  mediaListId: sliderItemChild.props.model?.media_list_id,
                  mediaType: sliderItemChild.props.model?.media_type,
                  rankNum: idx,
                  rect: sliderItemRefs.current[
                    itemUid
                  ]?.getBoundingClientRect(),
                  reference: sliderItemChild.props.model,
                  rowNum,
                  scrollPosition: scrollY,
                  sliderName,
                  synopsis: sliderItemChild.props.model?.overview,
                  rowHasExpandedInfoDensity: rowHasExpandedInfoDensity,
                  tagline: sliderItemChild.props.model?.tagline,
                  title:
                    sliderItemChild.props.model?.original_title ||
                    sliderItemChild.props.model?.original_name,
                  titleCardId: `title-card-${sliderNum}-${idx}`,
                  titleCardRef: sliderItemRefs.current[itemUid],
                  videoId: sliderItemChild.props.model?.id,
                  videoKey: getVideoKey(sliderItemChild.props.model),
                  videos: sliderItemChild.props.model?.videos,
                  videoPlayback: {
                    start: null,
                    length: null,
                  },
                },
                videoURL: sliderItemChild.props.model?.videos,
              }}
              myListRowItemsLength={myListRowItemsLength}
              onFocus={() => handleRowItemFocus(idx)}
              previewModalEnabled={previewModalEnabled}
              rankNum={idx}
              rowNum={rowNum}
              rowHasPreviewModalOpen={rowHasPreviewModalOpen}
              sliderName={sliderName}
              sliderItemIndex={idx}
              sliderItemId={sliderItemChild.id}
              toggleExpandedInfoDensity={toggleExpandedInfoDensity}
              videoId={sliderItemChild.props.model?.id}
              videoKey={getVideoKey(sliderItemChild.props.model)}
            />
          </SliderItem>
        );
      })
    );
  };

  /**
   * Get the slider items that currently visible in the viewport
   * @returns {Array}
   */
  const getSliderItemsInViewport = useCallback(() => {
    return getSliderItems(
      [...wrappedSliderItems.current].filter(({ inViewport }) => inViewport)
    );
  }, []);

  /**
   * Get all slider items
   * @returns {Object}
   */
  // const getAllSliderItems = () => {
  //   return getSliderItems([...wrappedSliderItems.current]);
  // };

  /**
   * Return visible slider item refs
   * @param {Number} visibleSliderItemsIndex
   * @returns
   */
  const getSliderItems = (visibleItems) => {
    const visibleItemsArray = [];
    visibleItems.forEach(({ uid }) => {
      sliderItemRefs.current[uid] &&
        visibleItemsArray.push(sliderItemRefs.current[uid]);
    });
    // console.log("visibleItemsArray: ", visibleItemsArray);
    // console.log("sliderItemRefs: ", sliderItemRefs);
    return visibleItemsArray;
  };

  /**
   * Set the .slider-content animation `style` attribute
   * @param {Number} movePercentage
   * @returns
   */
  const getAnimationStyle = (movePercentage = 0) => {
    return [
      `-webkit-transform: translate3d(${movePercentage}%, 0px, 0px)`,
      `-ms-transform: translate3d(${movePercentage}%, 0px, 0px)`,
      `transform: translate3d(${movePercentage}%, 0px, 0px)`,
    ].join(";");
  };

  /**
   * Set the initial .slider-content animation `style` attribute
   * @param {Number} movePercentage
   * @returns
   */
  const getReactAnimationStyle = (movePercentage = 0) => {
    const transform = `translate3d(${movePercentage}%, 0px, 0px)`;
    return {
      WebkitTransform: transform,
      MsTransform: transform,
      transform: transform,
    };
  };

  /**
   * Return the active row page / segment
   * @param {Number} totalItemCount
   * @param {Number} items
   * @param {Number} rowItems
   * @returns
   */
  const getActiveRowSegment = (totalItemCount, items, rowItems) => {
    let pages = items / totalItemCount,
      segments = rowItems / totalItemCount,
      rowSegments = segments / pages;
    return Math.ceil(rowSegments);
  };

  /**
   * Determine if slider has previous pages
   * @returns {Boolean}
   */
  const hasMorePrevPages = () => {
    const potentialPrevPages = lowestVisibleItemIndex - itemsInRow;
    return enableLooping || potentialPrevPages > -itemsInRow;
  };

  /**
   * Determine if slider previous button is active / visible
   * @returns {Boolean}
   */
  const isPrevBtnNavActive = () => {
    return getTotalPages() > 1 && hasMovedOnce && hasMorePrevPages();
  };

  /**
   * Move the slider backwards when the Previous button is clicked
   * @param {Object} e
   */
  const advancePrev = (e) => {
    e && e.preventDefault();
    // Proceed if the previous button is active and the slider is not currently animating
    if (isPrevBtnNavActive() && !isAnimating) {
      setIsAnimating(true);
      const totalItemCount = getTotalItemCount();
      let rowItems = lowestVisibleItemIndex - itemsInRow;
      lowestVisibleItemIndex !== 0 && rowItems < 0 && (rowItems = 0);
      let amountToOffset = lowestVisibleItemIndex - rowItems;
      lowestVisibleItemIndex === 0 && (rowItems = totalItemCount - itemsInRow);
      let getNewOffset = getNewSliderOffset(amountToOffset),
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
            getActiveRowSegment(totalItemCount, itemsInRow, rowItems)
          )
        : e && "keydown" === e.type
        ? shiftSlider(
            rowItems,
            newOffsetAmount,
            sliderActions.MOVE_DIRECTION_PREV,
            null,
            true,
            getActiveRowSegment(totalItemCount, itemsInRow, rowItems)
          )
        : shiftSlider(
            rowItems,
            newOffsetAmount,
            sliderActions.MOVE_DIRECTION_PREV,
            null,
            false,
            getActiveRowSegment(totalItemCount, itemsInRow, rowItems)
          );
    }
  };

  /**
   * Determine if slider has additional next pages
   * @returns {Boolean}
   */
  const hasMoreNextPages = () => {
    let potentialNextPages = lowestVisibleItemIndex + itemsInRow;
    return enableLooping || potentialNextPages < getTotalItemCount();
  };

  /**
   * Determine if slider next button is active / visible
   * @returns {Boolean}
   */
  const isNextBtnNavActive = () => {
    return getTotalPages() > 1 && hasMoreNextPages();
  };

  /**
   * Determine if the current page / segment is the last
   * @returns {Boolean}
   */
  // const isLastPage = useCallback(() => {
  //   return getPageNumber(lowestVisibleItemIndex) + 1 === getTotalPages();
  // }, [lowestVisibleItemIndex, getPageNumber, getTotalPages]);

  /**
   * Move the slider forward when the Next button is clicked
   * @param {Object} e
   */
  const advanceNext = (e) => {
    e && e.preventDefault();
    // Proceed if the next button is active and the slider is not currently animating
    if (isNextBtnNavActive() && !isAnimating) {
      setIsAnimating(true);
      const totalItemCount = getTotalItemCount();
      const nextItems = lowestVisibleItemIndex + 2 * itemsInRow;
      let rowItems = lowestVisibleItemIndex + itemsInRow;
      rowItems !== totalItemCount &&
        nextItems > totalItemCount &&
        (rowItems = totalItemCount - itemsInRow);
      let amountToOffset = lowestVisibleItemIndex - rowItems,
        getNewOffset = getNewSliderOffset(amountToOffset),
        newOffsetAmount = getNewOffset + getBaseSliderOffset();
      rowItems === totalItemCount && (rowItems = 0);
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
            getActiveRowSegment(totalItemCount, itemsInRow, rowItems)
          )
        : e && "keydown" === e.type
        ? shiftSlider(
            rowItems,
            newOffsetAmount,
            sliderActions.MOVE_DIRECTION_NEXT,
            null,
            true,
            getActiveRowSegment(totalItemCount, itemsInRow, rowItems)
          )
        : shiftSlider(
            rowItems,
            newOffsetAmount,
            sliderActions.MOVE_DIRECTION_NEXT,
            null,
            false,
            getActiveRowSegment(totalItemCount, itemsInRow, rowItems)
          );
    }
  };

  /**
   * Handle the slider movement and animation
   * @param {Number} totalItemCount
   * @param {Number} newOffsetAmount
   * @param {String} action
   * @param {Object} coordinates
   * @param {Object} isMouseEvent
   * @param {Number} rowSegment
   */
  const shiftSlider = (
    totalItemCount,
    newOffsetAmount,
    action,
    coordinates,
    isMouseEvent,
    activeRowSegment
  ) => {
    const slider = sliderRef.current;
    const getNewStyle = getAnimationStyle(newOffsetAmount);
    slider.classList.add("animating");
    slider.setAttribute("style", getNewStyle);
    slider.addEventListener("transitionend", function transitionEnd(e) {
      flushSync(() => {
        e.target === slider && e.target === this && resetSliderPosition();
        setLowestVisibleItemIndex(totalItemCount);
        handleActiveRowIndex(totalItemCount);
        setShift({
          event: sliderActions.SLIDER_SLIDING,
          xScrollDirection: action,
          rowSegment: activeRowSegment,
        });
        onSliderMove(totalItemCount, action);
        !hasMovedOnce && setHasMovedOnce(true);
        slider.classList.remove("animating");
        slider.removeEventListener("transitionend", transitionEnd);
        setIsAnimating(false);
      });
    });
  };

  /**
   * Refocus visible slider item after the slider shifts
   * @param {Array} viewportItems
   */
  const refocusAfterShift = useCallback(() => {
    let visibleItems = getSliderItemsInViewport(),
      itemToFocus,
      itemIdx;
    visibleItems.length &&
      visibleItems.length > 1 &&
      (itemIdx =
        shift.xScrollDirection === sliderActions.MOVE_DIRECTION_NEXT
          ? 1
          : visibleItems.length - 2);
    // console.log("itemToFocus: ", visibleItems[itemIdx]);
    (itemToFocus = visibleItems[itemIdx]) &&
      (sliderIntervalIdRef.current = setInterval(() => {
        sliderIntervalIdRef.current &&
          clearInterval(sliderIntervalIdRef.current),
          (sliderIntervalIdRef.current = 0),
          itemToFocus.querySelector(".slider-refocus").focus();
      }, 250));
  }, [getSliderItemsInViewport]);

  /**
   * Reset the slider base transform values on pageload and after it animates / shifts
   */
  const resetSliderPosition = useCallback(() => {
    const baseSliderOffset = getBaseSliderOffset();
    const getNewStyle = getAnimationStyle(baseSliderOffset);
    sliderRef.current.setAttribute("style", getNewStyle);
  }, [getBaseSliderOffset]);

  /**
   * Show the pagination indicator if more than one page of items exists
   */
  const getPaginationIndicator = () => {
    return (
      getTotalPages() > 1 && (
        <PaginationIndicator
          activePage={getPageNumber(lowestVisibleItemIndex)}
          totalPages={getTotalPages()}
        />
      )
    );
  };

  /**
   * Refocus certain visible slider items after the slider shifts
   */
  useLayoutEffect(() => {
    if (hasMovedOnce) {
      refocusAfterShift();
    }
  }, [hasMovedOnce, refocusAfterShift]);

  /**
   * Update itemsInRow amount if values change
   */
  useLayoutEffect(() => {
    if (itemsInRow) {
      resetSliderPosition();
    }
  }, [itemsInRow, resetSliderPosition]);

  return (
    <div className="row-content slider-hover-trigger-layer w-full overflow-x-visible whitespace-nowrap">
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
            sliderActions={sliderActions}
            showNextButton={totalItems > itemsInRow}
          />
        )}
        {getPaginationIndicator()}
        <div className={`slider-mask ${enablePeek ? "show-peek" : ""}`}>
          <div
            ref={sliderRef}
            className="slider-content row-with-x-columns"
            style={getReactAnimationStyle(getBaseSliderOffset())}
          >
            <AnimatePresenceWrapper>
              {getSliderItemContents()}
            </AnimatePresenceWrapper>
          </div>
        </div>
        {/* Next button */}
        <Controls
          enablePeek={enablePeek}
          hasMovedOnce={hasMovedOnce}
          isAnimating={isAnimating}
          modalOpen={isPreviewModalOpen() && rowHasExpandedInfoDensity}
          moveDirection={sliderActions.MOVE_DIRECTION_NEXT}
          onClick={advanceNext}
          sliderActions={sliderActions}
          showNextButton={totalItems > itemsInRow}
        />
      </div>
    </div>
  );
};

export default Slider;
