import { forwardRef } from "react";
import { ChevronUpIcon } from "@heroicons/react/outline";
import { WatchLink } from "../../WatchLink";
import Tooltip from "@/components/browse/tooltips/Tooltip";
import AddToListButton from "../../buttons/MediaListButton";
import LikeMediaButton from "../../buttons/LikeMediaButton";
import DislikeMediaButton from "../../buttons/DislikeMediaButton";

const ButtonControls = forwardRef((props, buttonsRef) => {
  const {
    identifiers,
    isMyListRow,
    inMediaList,
    isLiked,
    isDisliked,
    handleWatchNow,
    handleViewDetails,
    handleCloseModal,
    videoModel,
  } = props;

  const addToListProps = {
    isMyListRow,
    inMediaList,
    handleViewDetails,
    handleCloseModal,
    videoModel,
  };

  const likedMediaProps = {
    isLiked,
    isDisliked,
    handleViewDetails,
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
    <div ref={buttonsRef} className="button-controls-container mini-modal">
      <WatchLink
        className={
          "flex items-center justify-center rounded-full focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-2 focus:ring-white focus:outline-none mr-1"
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
          className="play flex items-center justify-center border-2 border-white rounded-full shadow-sm text-black bg-white focus:focus-outline hover:opacity-90 md:py-0 font-bold md:text-xl w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 transition ease-out duration-300"
          tabIndex={"-1"}
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
        </button>
      </WatchLink>
      <AddToListButton {...addToListProps} />
      <LikeMediaButton {...likedMediaProps} />
      <DislikeMediaButton {...likedMediaProps} />
      <Tooltip
        text={identifiers?.mediaType === "tv" ? "Episodes & info" : "More info"}
        className={"ml-auto"}
      >
        <button
          aria-label="More info"
          data-uia="expand-to-detail-button"
          type="button"
          className={`flex items-center justify-center border-2 border-white border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 rounded-full shadow-sm text-white bg-transparent hover:bg-white focus:bg-white hover:bg-opacity-50 focus:bg-opacity-50 focus:ring-inset focus:ring-2 focus:ring-white focus:outline-none w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11`}
          onClick={(e) => handleViewDetails(e)}
        >
          <span className="sr-only">Episodes and More Information</span>
          <ChevronUpIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </Tooltip>
    </div>
  );
});

ButtonControls.displayName = "ButtonControls";
export default ButtonControls;
