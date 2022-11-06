import { InformationCircleIcon } from "@heroicons/react/outline";
import Link from "next/link";

// Actions
import { modalStateActions } from "@/actions/Actions";

import usePreviewModalStore from "@/stores/PreviewModalStore";

const CTAButtons = ({ videoPlayback, handleWatchNow, model }) => {
  /**
   * Open default preview modal.
   */
  const handleClick = () => {
    usePreviewModalStore.getState().setPreviewModalOpen({
      model: model,
      videoId: model.videoModel.videoId,
      videoModel: model.videoModel,
      listContext: model.videoModel.listContext,
      modalState: modalStateActions.DETAIL_MODAL,
      animationContext: modalStateActions.DETAIL_MODAL,
      scrollPosition: window.scrollY,
      titleCardId: undefined,
      titleCardRect: undefined,
      videoPlayback,
    });
  };

  const handleWatchNowClick = (e) => {
    e.preventDefault();
    handleWatchNow(model?.videoModel?.identifiers);
  };

  return (
    <div className="billboard-links button-layer">
      <Link
        href={{
          pathname: `/watch/[mediaId]`,
          query: {
            mediaId: `${model?.videoModel?.identifiers?.mediaType}-${model?.videoModel?.identifiers?.id}`,
          },
        }}
      >
        <a
          className="focus:focus-outline flex items-center justify-center rounded-md"
          onClick={handleWatchNowClick}
          tabIndex="0"
          role="link"
        >
          <button
            type="button"
            className="play focus:focus-outline flex h-8 items-center justify-center rounded-md bg-white px-2 text-xs font-bold text-black shadow-sm transition duration-300 ease-out hover:bg-opacity-80 sm:h-9 sm:text-sm md:py-0 lg:h-10 lg:px-3 lg:text-lg 2xl:h-12 2xl:px-5 2xl:text-xl"
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
            <span className="ml-1 mr-1 2xl:mr-2">Play</span>
          </button>
        </a>
      </Link>
      <button
        type="button"
        data-uia="billboard-show-more-info"
        className="focus:focus-outline ml-4 flex h-8 items-center justify-center rounded-md bg-gray-500 bg-opacity-60 px-2 text-xs font-bold text-white shadow-sm transition duration-300 ease-out hover:bg-opacity-70 sm:h-9 sm:text-sm md:py-0 lg:h-10 lg:px-3 lg:text-lg 2xl:h-12 2xl:px-5 2xl:text-xl"
        onClick={handleClick}
      >
        <span className="sr-only">More Info</span>
        <InformationCircleIcon
          className="ml-1 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 2xl:ml-2 2xl:h-8 2xl:w-8"
          aria-hidden="true"
        />
        <span className="ml-3 mr-2">More Info</span>
      </button>
    </div>
  );
};

export default CTAButtons;
