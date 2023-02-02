import { Variants } from "framer-motion";
import { useContext, useEffect, useState } from "react";

import ProfileContext from "@/context/ProfileContext";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import Tooltip from "../../tooltips/Tooltip";

type MediaListButtonProps = {
  detailView?: boolean;
  handleCloseModal?: () => void;
  inMediaList: boolean;
  isMyListRow?: boolean;
  videoModel: IVideoModel;
};

const MediaListButton = ({
  detailView,
  handleCloseModal,
  inMediaList,
  isMyListRow,
  videoModel,
}: MediaListButtonProps) => {
  const { addMediaToList, removeMediaFromList } = useContext(ProfileContext);
  const [inMediaListState, setInMediaListState] =
    useState<boolean>(inMediaList);
  const [clicked, setClicked] = useState<boolean>(false);

  /**
   * Optimistically show the updated button state in the ui
   */
  useEffect(() => {
    setInMediaListState(inMediaList);
  }, [inMediaList]);

  /**
   * Allow 200 ms for the animation to complete
   */
  useEffect(() => {
    if (clicked) {
      setTimeout(() => setClicked(false), 200);
    }
  }, [clicked]);

  /**
   * Animate the button icon when clicked
   */
  const animationProps = {
    initial: { y: 0, scale: 1 },
    bounce: { y: -1, scale: 1.1 },
    bounceBack: { y: 0, scale: 1 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  /**
   * Add item to user's media list
   */
  const clickAddMediaToList = () => {
    const mediaItemData = {
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    };
    setClicked(true);
    setInMediaListState(true);
    addMediaToList(mediaItemData);
  };

  /**
   * Remove item from user's media list
   */
  const clickRemoveMediaFromList = () => {
    const mediaItemData = {
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    };
    setInMediaListState(false);
    removeMediaFromList(mediaItemData);
    !detailView &&
      isMyListRow &&
      handleCloseModal &&
      setTimeout(() => handleCloseModal(), 100);
  };

  return (
    <Tooltip
      text={inMediaListState ? "Remove from My List" : "Add to My List"}
      className="relative"
    >
      <button
        type="button"
        aria-label={inMediaListState ? "Remove from My List" : "Add to My List"}
        className={
          detailView
            ? "relative mx-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent font-bold text-white transition duration-150 ease-out hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-8 sm:w-8 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
            : "relative mx-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent font-bold text-white transition duration-150 ease-out hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-8 sm:w-8 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
        }
        onClick={() =>
          inMediaListState ? clickRemoveMediaFromList() : clickAddMediaToList()
        }
      >
        <span className="sr-only">
          {inMediaListState ? "Remove from My List" : "Add to My List"}
        </span>
        <MotionDivWrapper
          className="absolute inset-0 flex items-center justify-center"
          initial="intitial"
          animate={clicked ? "bounce" : "bounceBack"}
          variants={animationProps as Variants}
        >
          {inMediaListState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={
                detailView
                  ? "h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 2xl:h-9 2xl:w-9"
                  : "h-8 w-8"
              }
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={
                detailView
                  ? "h-7 w-7 sm:h-8 sm:w-8 lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
                  : "h-8 w-8"
              }
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          )}
        </MotionDivWrapper>
      </button>
    </Tooltip>
  );
};

export default MediaListButton;
