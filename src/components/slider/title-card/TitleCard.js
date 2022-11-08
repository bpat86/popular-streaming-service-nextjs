import { useCallback, useEffect, useRef } from "react";

import BoxArt from "./BoxArt";
import WatchLink from "./WatchLink";

const TitleCard = ({
  className,
  id,
  isDisliked,
  imageKey,
  itemTabbable,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  toggleExpandedInfoDensity,
  watchURL,
}) => {
  const titleCardRef = useRef();
  const watchLinkAnchorRef = useRef();

  /**
   * Only visible when the user selects thumbs down for a media title
   */
  const getIsDisliked = () => {
    return isDisliked ? (
      <div className="title-treatment-wrapper absolute inset-0 z-1 select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 m-2 h-6 w-6 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      </div>
    ) : (
      <></>
    );
  };

  /**
   * Handle the onKeyDown event for the title card.
   * @param {Object} e
   */
  const handleOnKeyDown = useCallback(
    (e) => {
      onKeyDown && onKeyDown(e, titleCardRef.current);
    },
    [onKeyDown]
  );

  /**
   * Handle the onMouseEnter event for the title card.
   * @param {Object} e
   */
  const handleOnMouseEnter = useCallback(
    (e) => {
      const mouseEnter = onMouseEnter;
      mouseEnter && mouseEnter(e, titleCardRef.current);
      toggleExpandedInfoDensity && toggleExpandedInfoDensity(true);
    },
    [onMouseEnter, toggleExpandedInfoDensity]
  );

  /**
   * Handle the onMouseMove event for the title card.
   * @param {Object} e
   */
  const handleOnMouseMove = useCallback(
    (e) => {
      onMouseMove && onMouseMove(e, titleCardRef.current);
    },
    [onMouseMove]
  );

  /**
   * Handle the onMouseLeave event for the title card.
   * @param {Object} e
   */
  const handleOnMouseLeave = useCallback(
    (e) => {
      onMouseLeave && onMouseLeave(e, titleCardRef.current);
      toggleExpandedInfoDensity && toggleExpandedInfoDensity(false);
    },
    [onMouseLeave, toggleExpandedInfoDensity]
  );

  /**
   * Handle the onClick event for the title card.
   * @param {Object} e
   */
  const handleAnchorClick = useCallback(
    (e) => {
      const click = onClick;
      click &&
        (e.stopPropagation(),
        e.preventDefault(),
        click(e, titleCardRef.current));
    },
    [onClick]
  );

  /**
   * Add event listeners to the title card when component mounts.
   */
  useEffect(() => {
    const titleCard = titleCardRef.current;
    const watchLinkAnchor = watchLinkAnchorRef.current;
    // Add listeners
    titleCardRef.current.addEventListener("keydown", handleOnKeyDown);
    titleCardRef.current.addEventListener("mouseenter", handleOnMouseEnter);
    titleCardRef.current.addEventListener("mouseleave", handleOnMouseLeave);
    titleCardRef.current.addEventListener("mousemove", handleOnMouseMove);
    watchLinkAnchorRef.current.addEventListener("click", handleAnchorClick);
    // Remove listeners
    return () => {
      titleCard.removeEventListener("keydown", handleOnKeyDown);
      titleCard.removeEventListener("mouseenter", handleOnMouseEnter);
      titleCard.removeEventListener("mouseleave", handleOnMouseLeave);
      titleCard.removeEventListener("mousemove", handleOnMouseMove);
      watchLinkAnchor.removeEventListener("click", handleAnchorClick);
    };
  }, [
    handleOnKeyDown,
    handleOnMouseEnter,
    handleOnMouseLeave,
    handleOnMouseMove,
    handleAnchorClick,
    titleCardRef,
    watchLinkAnchorRef,
  ]);

  return (
    <div ref={titleCardRef} id={id} className={`${className}`}>
      <WatchLink
        ref={watchLinkAnchorRef}
        className="slider-refocus"
        href={watchURL}
        itemTabbable={itemTabbable}
      >
        <div
          className={`boxart-size-16x9 boxart-rounded bg-gray-800 ${
            isDisliked ? "grayscale" : ""
          }`}
        >
          {getIsDisliked()}
          <BoxArt
            className="boxart-image"
            imageKey={imageKey}
            onFocus={onFocus}
          />
        </div>
      </WatchLink>
    </div>
  );
};

export default TitleCard;
