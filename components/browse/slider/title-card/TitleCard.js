import {
  useContext,
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
// Context
import InteractionContext from "@/context/InteractionContext";
// Components
import WatchLink from "./WatchLink";
import BoxArt from "./BoxArt";

const TitleCard = ({
  className,
  id,
  isDisliked,
  imageKey,
  itemTabbable,
  model,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  rankNum,
  rowHasPreviewModalOpen,
  toggleExpandedInfoDensity,
  watchURL,
}) => {
  // Context
  const { isPreviewModalOpen, previewModalStateById } =
    useContext(InteractionContext);
  // State
  const [isHovered, setIsHovered] = useState(false);
  // Refs
  const boxArtRef = useRef();
  const titleCardRef = useRef();
  const watchLinkAnchorRef = useRef();

  /**
   * Only visible when the user selects thumbs down for a media title
   */
  const getIsDisliked = () => {
    return isDisliked ? (
      <div
        className={`title-treatment-wrapper absolute inset-0 z-1 select-none`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 h-6 w-6 text-white m-2"
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
    [onKeyDown, titleCardRef]
  );

  /**
   * Handle the onMouseEnter event for the title card.
   * @param {Object} e
   */
  const handleMouseEnter = useCallback(
    (e) => {
      const mouseEnter = onMouseEnter;
      mouseEnter && mouseEnter(e, titleCardRef.current);
      toggleExpandedInfoDensity && toggleExpandedInfoDensity(true);
    },
    [onMouseEnter, titleCardRef]
  );

  /**
   * Handle the onMouseMove event for the title card.
   * @param {Object} e
   */
  const handleMouseMove = useCallback(
    (e) => {
      onMouseMove && onMouseMove(e, titleCardRef.current);
    },
    [onMouseMove, titleCardRef]
  );

  /**
   * Handle the onMouseLeave event for the title card.
   * @param {Object} e
   */
  const handleMouseLeave = useCallback(
    (e) => {
      onMouseLeave && onMouseLeave(e, titleCardRef.current);
      toggleExpandedInfoDensity && toggleExpandedInfoDensity(false);
    },
    [onMouseLeave, titleCardRef]
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
    [onClick, titleCardRef]
  );

  /**
   * Handle the onFocus event for the title card.
   */
  const handleFocus = useCallback(() => {
    onFocus && onFocus(boxArtRef.current);
  }, [onFocus, titleCardRef]);

  /**
   * Add event listeners to the title card when component mounts.
   */
  useLayoutEffect(() => {
    const titleCard = titleCardRef.current;
    const watchLinkAnchor = watchLinkAnchorRef.current;
    const boxArt = boxArtRef.current;
    // Add listeners
    titleCardRef.current.addEventListener("keydown", handleOnKeyDown);
    titleCardRef.current.addEventListener("mouseenter", handleMouseEnter);
    titleCardRef.current.addEventListener("mouseleave", handleMouseLeave);
    titleCardRef.current.addEventListener("mousemove", handleMouseMove);
    watchLinkAnchorRef.current.addEventListener("click", handleAnchorClick);
    boxArtRef.current.addEventListener("focus", handleFocus);
    // Remove listeners
    return () => {
      titleCard.removeEventListener("keydown", handleOnKeyDown);
      titleCard.removeEventListener("mouseenter", handleMouseEnter);
      titleCard.removeEventListener("mouseleave", handleMouseLeave);
      titleCard.removeEventListener("mousemove", handleMouseMove);
      watchLinkAnchor.removeEventListener("click", handleAnchorClick);
      boxArt.removeEventListener("focus", handleFocus);
    };
  }, [
    handleOnKeyDown,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    handleAnchorClick,
    handleFocus,
  ]);

  // ${ rowHasPreviewModalOpen() && isPreviewModalOpen() ? "opacity-50" : "" }
  return (
    <div ref={titleCardRef} className={`${className}`} id={id}>
      <WatchLink
        ref={watchLinkAnchorRef}
        className={`slider-refocus`}
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
            ref={boxArtRef}
            className={`boxart-image`}
            imageKey={imageKey}
          />
        </div>
      </WatchLink>
    </div>
  );
};

export default TitleCard;
