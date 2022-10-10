import { forwardRef } from "react";
import { WatchLink } from "../WatchLink";
import AddToListButton from "../buttons/MediaListButton";
import LikeMediaButton from "../buttons/LikeMediaButton";
import DislikeMediaButton from "../buttons/DislikeMediaButton";

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
        className={
          "flex items-center justify-center rounded-md focus:focus-outline mr-1"
        }
        href={{
          pathname: "/watch/[mediaId]",
          query: {
            mediaId: `${identifiers?.mediaType}-${identifiers?.id}`,
          },
        }}
        onClick={handleWatchNowClick}
        tabIndex={"0"}
      >
        <button
          type="button"
          className="play flex items-center justify-center border-2 border-white border-opacity-80 rounded-md shadow-sm text-black bg-white hover:opacity-80 focus:focus-outline md:py-0 font-bold md:text-xl px-6 md:px-4 h-7 sm:h-8 lg:h-9 2xl:h-11 transition ease-out duration-300"
          tabIndex="-1"
        >
          <span className="sr-only">Watch now</span>
          <svg
            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11`}
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
