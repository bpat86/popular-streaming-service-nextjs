import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { forwardRef, MouseEvent, MutableRefObject } from "react";

import Tooltip from "@/components/tooltips/Tooltip";
import UnstyledButton from "@/components/ui/buttons/UnstyledButton";
import { IVideoModel } from "@/store/types";

import DislikeMediaButton from "../../buttons/DislikeMediaButton";
import LikeMediaButton from "../../buttons/LikeMediaButton";
import MediaListButton from "../../buttons/MediaListButton";
import { WatchLink } from "../../WatchLink";

type WatchNowProps = {
  id: number;
  mediaType: string;
};

type ButtonControlsProps = {
  identifiers: IVideoModel["identifiers"];
  isMyListRow: IVideoModel["isMyListRow"];
  inMediaList: IVideoModel["inMediaList"];
  isLiked: IVideoModel["isLiked"];
  isDisliked: IVideoModel["isDisliked"];
  handleWatchNow: ({ id, mediaType }: WatchNowProps) => void;
  handleViewDetails: () => void;
  handleCloseModal: () => void;
  videoModel: IVideoModel;
};

const ButtonControls = forwardRef<HTMLDivElement, ButtonControlsProps>(
  (
    {
      identifiers: { mediaType, id } = {},
      isMyListRow,
      inMediaList,
      isLiked,
      isDisliked,
      handleWatchNow,
      handleViewDetails,
      handleCloseModal,
      videoModel,
    },
    ref
  ) => {
    const buttonsRef = ref as MutableRefObject<HTMLDivElement>;
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
     */
    const handleWatchNowClick = (e: MouseEvent<Element>) => {
      e.preventDefault();
      if (mediaType && id) {
        handleWatchNow({
          id: Number(id),
          mediaType: mediaType.toString(),
        });
      }
    };

    return (
      <div ref={buttonsRef} className="button-controls-container mini-modal">
        <WatchLink
          className="mr-1 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
          href={{
            pathname: `/watch/${encodeURIComponent(Number(id))}`,
            query: {
              mediaId: `${mediaType?.toString()}-${id?.toString()}`,
            },
          }}
          onClick={handleWatchNowClick}
          tabIndex={0}
        >
          <UnstyledButton
            type="button"
            className="play focus:focus-outline flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white font-bold text-black shadow-sm transition duration-300 ease-out hover:opacity-90 sm:h-8 sm:w-8 md:py-0 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
            tabIndex={-1}
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
          </UnstyledButton>
        </WatchLink>
        <MediaListButton {...addToListProps} />
        <LikeMediaButton {...likedMediaProps} />
        <DislikeMediaButton {...likedMediaProps} />
        <Tooltip
          text={mediaType === "tv" ? "Episodes & info" : "More info"}
          className="ml-auto"
        >
          <UnstyledButton
            aria-label="More info"
            data-uia="expand-to-detail-button"
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent text-white shadow-sm hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-8 sm:w-8 lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
            onClick={handleViewDetails}
          >
            <span className="sr-only">Episodes and More Information</span>
            <ChevronUpIcon className="h-6 w-6" aria-hidden="true" />
          </UnstyledButton>
        </Tooltip>
      </div>
    );
  }
);

ButtonControls.displayName = "ButtonControls";
export default ButtonControls;
