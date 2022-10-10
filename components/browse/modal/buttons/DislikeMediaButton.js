import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
// Context
import ProfileContext from "@/context/ProfileContext";
// Components
import Tooltip from "../../tooltips/Tooltip";

const buttonActions = {
  ADD_TO_DISLIKED_MEDIA: "ADD_TO_DISLIKED_MEDIA",
  REMOVE_FROM_DISLIKED_MEDIA: "REMOVE_FROM_DISLIKED_MEDIA",
};

const DislikeMediaButton = (props) => {
  const { isDisliked, detailView, videoModel } = props;
  // Context
  const { addToDislikedMedia, removeFromDislikedMedia } =
    useContext(ProfileContext);
  // State
  const [isDislikedState, setIsDislikedState] = useState(isDisliked);
  const [clicked, setClicked] = useState(false);

  /**
   * Optimistically show the updated button state in the ui
   */
  useEffect(() => {
    setIsDislikedState(isDisliked);
  }, [isDisliked]);

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
    bounce: { y: -3, scale: 1.3 },
    bounceBack: { y: 0, scale: 1 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  /**
   * Add item to user's media list
   */
  const clickAddToDislikedMedia = () => {
    const mediaItemData = {
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    };
    setClicked(true);
    setIsDislikedState(true);
    addToDislikedMedia(mediaItemData);
  };

  /**
   * Remove item from user's media list
   */
  const clickRemoveFromDislikedMedia = () => {
    const mediaItemData = {
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    };
    setIsDislikedState(false);
    removeFromDislikedMedia(mediaItemData);
  };

  return (
    <Tooltip
      text={isDislikedState ? "Rated" : "Not for me"}
      className={"relative"}
    >
      <button
        type="button"
        aria-label={isDislikedState ? "Rated" : "Not for me"}
        className={
          detailView
            ? "flex items-center justify-center border-2 border-white border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 rounded-full text-white bg-transparent font-bold hover:bg-white focus:bg-white hover:bg-opacity-50 focus:bg-opacity-50 focus:ring-inset focus:ring-2 focus:ring-white focus:outline-none md:text-xl w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 mx-1 transition ease-out duration-150 relative"
            : "flex items-center justify-center border-2 border-white border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 rounded-full text-white bg-transparent hover:bg-white focus:bg-white hover:bg-opacity-50 focus:bg-opacity-50 focus:ring-inset focus:ring-2 focus:ring-white focus:outline-none font-bold md:text-xl w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 mx-1 transition ease-out duration-150 relative"
        }
        onClick={() =>
          isDislikedState
            ? clickRemoveFromDislikedMedia()
            : clickAddToDislikedMedia()
        }
      >
        <span className="sr-only">
          {isDislikedState ? "Rated" : "Not for me"}
        </span>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={"intitial"}
          animate={clicked ? "bounce" : "bounceBack"}
          variants={animationProps}
        >
          {isDislikedState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[1.35rem] w-[1.35rem] mt-[2px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mt-[1px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
              />
            </svg>
          )}
        </motion.div>
      </button>
    </Tooltip>
  );
};

export default DislikeMediaButton;
