import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
// Context
import ProfileContext from "@/context/ProfileContext";
// Components
import Tooltip from "../../tooltips/Tooltip";

const buttonActions = {
  ADD_TO_MEDIA_LIST: "ADD_TO_MEDIA_LIST",
  REMOVE_FROM_MEDIA_LIST: "REMOVE_FROM_MEDIA_LIST",
};

const AddToListButton = (props) => {
  const { detailView, handleCloseModal, inMediaList, isMyListRow, videoModel } =
    props;
  // Context
  const { addMediaToList, removeMediaFromList } = useContext(ProfileContext);
  // State
  const [inMediaListState, setInMediaListState] = useState(inMediaList);
  const [clicked, setClicked] = useState(false);

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
    !detailView && isMyListRow && setTimeout(() => handleCloseModal(), 100);
  };

  return (
    <Tooltip
      text={inMediaListState ? "Remove from My List" : "Add to My List"}
      className={"relative"}
    >
      <button
        type="button"
        aria-label={inMediaListState ? "Remove from My List" : "Add to My List"}
        className={
          detailView
            ? "flex items-center justify-center border-2 border-white border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 rounded-full text-white bg-transparent font-bold hover:bg-white focus:bg-white hover:bg-opacity-50 focus:bg-opacity-50 focus:ring-inset focus:ring-2 focus:ring-white focus:outline-none md:text-xl w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 mx-1 transition ease-out duration-150 relative"
            : "flex items-center justify-center border-2 border-white border-opacity-50 hover:border-opacity-100 focus:border-opacity-100 rounded-full text-white bg-transparent hover:bg-white focus:bg-white hover:bg-opacity-50 focus:bg-opacity-50 focus:ring-inset focus:ring-2 focus:ring-white focus:outline-none font-bold md:text-xl w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 mx-1 transition ease-out duration-150 relative"
        }
        onClick={() =>
          inMediaListState ? clickRemoveMediaFromList() : clickAddMediaToList()
        }
      >
        <span className="sr-only">
          {inMediaListState ? "Remove from My List" : "Add to My List"}
        </span>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={"intitial"}
          animate={clicked ? "bounce" : "bounceBack"}
          variants={animationProps}
        >
          {inMediaListState ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={
                detailView
                  ? "w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 2xl:w-9 2xl:h-9"
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
                  ? "w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11"
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
        </motion.div>
      </button>
    </Tooltip>
  );
};

export default AddToListButton;
