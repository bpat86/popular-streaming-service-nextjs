import { Variants } from "framer-motion";
import { useContext, useEffect, useState } from "react";

import UnstyledButton from "@/components/ui/buttons/UnstyledButton";
import ProfileContext from "@/context/ProfileContext";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import Tooltip from "../../tooltips/Tooltip";

type MediaListButtonProps = {
  detailView?: boolean;
  handleCloseModal?: () => void;
  inMediaList: IVideoModel["inMediaList"];
  isMyListRow?: IVideoModel["isMyListRow"];
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
  const [isSet, setIsSet] = useState<boolean>(inMediaList || false);
  const [clicked, setClicked] = useState<boolean>(false);

  /**
   * Optimistically show the updated button state in the ui
   */
  useEffect(() => {
    setIsSet(inMediaList || false);
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
   * Add item to user's media list
   */
  function handleAddMediaToList() {
    setClicked(true);
    setIsSet(true);
    addMediaToList({
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    });
  }

  /**
   * Remove item from user's media list
   */
  function handleRemoveMediaFromList() {
    setIsSet(false);
    removeMediaFromList({
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    });
    !detailView &&
      isMyListRow &&
      handleCloseModal &&
      setTimeout(() => handleCloseModal(), 100);
  }

  function handleClick() {
    isSet ? handleRemoveMediaFromList() : handleAddMediaToList();
  }

  /**
   * Animate the button icon when clicked
   */
  const variants = {
    initial: { y: 0, scale: 1 },
    bounce: { y: -1, scale: 1.1 },
    bounceBack: { y: 0, scale: 1 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  return (
    <Tooltip text={isSet ? "Remove from My List" : "Add to My List"}>
      <UnstyledButton
        type="button"
        aria-label={isSet ? "Remove from My List" : "Add to My List"}
        className="relative mx-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent font-bold text-white transition duration-150 ease-out hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-8 sm:w-8 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
        onClick={handleClick}
      >
        <span className="sr-only">
          {isSet ? "Remove from My List" : "Add to My List"}
        </span>
        <MotionDivWrapper
          className="absolute inset-0 flex items-center justify-center"
          initial="intitial"
          animate={clicked ? "bounce" : "bounceBack"}
          variants={variants as Variants}
        >
          {isSet ? (
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
      </UnstyledButton>
    </Tooltip>
  );
};

export default MediaListButton;
