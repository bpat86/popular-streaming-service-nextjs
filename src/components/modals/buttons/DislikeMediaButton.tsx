import { Variants } from "framer-motion";
import { useContext, useEffect, useState } from "react";

import UnstyledButton from "@/components/ui/buttons/UnstyledButton";
import ProfileContext from "@/context/ProfileContext";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import Tooltip from "../../tooltips/Tooltip";

type DislikeMediaButtonProps = {
  detailView?: boolean;
  isDisliked: IVideoModel["isDisliked"];
  videoModel: IVideoModel;
};

const DislikeMediaButton = ({
  isDisliked,
  detailView,
  videoModel,
}: DislikeMediaButtonProps) => {
  const { addToDislikedMedia, removeFromDislikedMedia } =
    useContext(ProfileContext);
  const [isSet, setIsSet] = useState<boolean>(isDisliked || false);
  const [clicked, setClicked] = useState(false);

  /**
   * Optimistically show the updated button state in the ui
   */
  useEffect(() => {
    setIsSet(isDisliked || false);
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
   * Add item to user's media list
   */
  const clickAddToDislikedMedia = () => {
    setClicked(true);
    setIsSet(true);
    addToDislikedMedia({
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    });
  };

  /**
   * Remove item from user's media list
   */
  const clickRemoveFromDislikedMedia = () => {
    setIsSet(false);
    removeFromDislikedMedia({
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    });
  };

  /**
   * Animate the button icon when clicked
   */
  const variants = {
    initial: { y: 0, scale: 1 },
    bounce: { y: -3, scale: 1.3 },
    bounceBack: { y: 0, scale: 1 },
    transition: { duration: 0.2, ease: "easeOut" },
  };

  return (
    <Tooltip text={isSet ? "Rated" : "Not for me"}>
      <UnstyledButton
        type="button"
        aria-label={isSet ? "Rated" : "Not for me"}
        className="relative mx-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent font-bold text-white transition duration-150 ease-out hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-8 sm:w-8 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
        onClick={() =>
          isSet ? clickRemoveFromDislikedMedia() : clickAddToDislikedMedia()
        }
      >
        <span className="sr-only">{isSet ? "Rated" : "Not for me"}</span>
        <MotionDivWrapper
          className="absolute inset-0 flex items-center justify-center"
          initial="intitial"
          animate={clicked ? "bounce" : "bounceBack"}
          variants={variants as Variants}
        >
          {isSet ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-[2px] h-[1.35rem] w-[1.35rem]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mt-[1px] h-6 w-6"
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
        </MotionDivWrapper>
      </UnstyledButton>
    </Tooltip>
  );
};

export default DislikeMediaButton;
