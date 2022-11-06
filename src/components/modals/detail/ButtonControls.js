import { forwardRef } from "react";

import DislikeMediaButton from "../buttons/DislikeMediaButton";
import LikeMediaButton from "../buttons/LikeMediaButton";
import AddToListButton from "../buttons/MediaListButton";
import { WatchLink } from "../WatchLink";

const ButtonControls = forwardRef((props, buttonsRef) => {
  const {
    identifiers,
    isMyListRow,
    inMediaList,
    isLiked,
    isDisliked,
    isDetailModal,
    handleWatchNow,
    videoModel,
  } = props;

  const addToListProps = {
    isMyListRow,
    inMediaList,
    isDetailModal,
    handleWatchNow,
    videoModel,
  };

  const likedMediaProps = {
    isLiked,
    isDisliked,
    videoModel,
  };

  /**
   * Open a video in watch now mode
   * @param {Object} e
   */
  const handleWatchNowClick = (e) => {
    e.preventDefault();
    handleWatchNow(identifiers); // uid, id, mediaType
  };

  return (
    <div ref={buttonsRef} className="button-controls-container">
      <WatchLink
        className="focus:focus-outline mr-1 flex items-center justify-center rounded-md"
        href={{
          pathname: "/watch/[mediaId]",
          query: {
            mediaId: `${identifiers?.mediaType}-${identifiers?.id}`,
          },
        }}
        onClick={handleWatchNowClick}
        tabIndex="0"
      >
        <button
          type="button"
          className="play focus:focus-outline flex h-7 items-center justify-center rounded-md border-2 border-white border-opacity-80 bg-white px-6 font-bold text-black shadow-sm transition duration-300 ease-out hover:opacity-80 sm:h-8 md:py-0 md:px-4 md:text-xl lg:h-9 2xl:h-11"
          tabIndex="-1"
        >
          <span className="sr-only">Watch now</span>
          <svg
            className="h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 26 26"
          >
            <polygon
              className="play-btn__svg"
              points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"
            />
          </svg>
          {isDetailModal && <span className="ml-1 mr-2">Play</span>}
        </button>
      </WatchLink>
      <AddToListButton {...addToListProps} />
      <LikeMediaButton {...likedMediaProps} />
      <DislikeMediaButton {...likedMediaProps} />
    </div>
  );
});

ButtonControls.displayName = "ButtonControls";
export default ButtonControls;
