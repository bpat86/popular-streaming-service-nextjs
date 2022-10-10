import { useContext } from "react";
import Link from "next/link";
import InteractionContext from "@/context/InteractionContext";
import { InformationCircleIcon } from "@heroicons/react/outline";

const CTAButtons = (props) => {
  const { videoPlayback, handleWatchNow, model } = props;
  const { modalStateActions, setPreviewModalOpen } =
    useContext(InteractionContext);

  /**
   * Open default preview modal.
   */
  const handleClick = () => {
    setPreviewModalOpen({
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
          className={
            "flex items-center justify-center rounded-md focus:focus-outline"
          }
          onClick={handleWatchNowClick}
          tabIndex="0"
          role="link"
        >
          <button
            type="button"
            className="play flex items-center justify-center rounded-md shadow-sm text-black bg-white hover:bg-opacity-80 focus:focus-outline font-bold md:py-0 text-xs sm:text-sm lg:text-lg 2xl:text-xl px-2 lg:px-3 2xl:px-5 h-8 sm:h-9 lg:h-10 2xl:h-12 transition ease-out duration-300"
            tabIndex="-1"
          >
            <span className="sr-only">Watch now</span>
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11"
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
        className="flex items-center justify-center rounded-md shadow-sm text-white bg-gray-500 bg-opacity-60 font-bold hover:bg-opacity-70 focus:focus-outline md:py-0 text-xs sm:text-sm lg:text-lg 2xl:text-xl ml-4 px-2 lg:px-3 2xl:px-5 h-8 sm:h-9 lg:h-10 2xl:h-12 transition ease-out duration-300"
        onClick={handleClick}
      >
        <span className="sr-only">More Info</span>
        <InformationCircleIcon
          className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8 ml-1 2xl:ml-2"
          aria-hidden="true"
        />
        <span className="ml-3 mr-2">More Info</span>
      </button>
    </div>
  );
};

export default CTAButtons;
