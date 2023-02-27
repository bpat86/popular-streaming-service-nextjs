import { Variants } from "framer-motion";
import { MouseEvent, useContext, useEffect, useState } from "react";

import UnstyledButton from "@/components/ui/buttons/UnstyledButton";
import ProfileContext from "@/context/ProfileContext";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import Tooltip from "../../tooltips/Tooltip";

type LikeMediaButtonProps = {
  detailView?: boolean;
  isLiked: IVideoModel["isLiked"];
  videoModel: IVideoModel;
};

const LikeMediaButton = ({
  isLiked,
  detailView,
  videoModel,
}: LikeMediaButtonProps) => {
  const { addToLikedMedia, removeFromLikedMedia } = useContext(ProfileContext);

  const [isSet, setIsSet] = useState<boolean>(isLiked || false);
  const [clicked, setClicked] = useState(false);

  /**
   * Optimistically show the updated button state in the ui
   */
  useEffect(() => {
    setIsSet(isLiked || false);
  }, [isLiked]);

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
  const clickAddToLikedMedia = () => {
    setClicked(true);
    setIsSet(true);
    addToLikedMedia({
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    });
  };

  /**
   * Remove item from user's media list
   */
  const clickRemoveFromLikedMedia = () => {
    setIsSet(false);
    removeFromLikedMedia({
      mediaData: videoModel,
      mutateModalData: videoModel?.mutateModalData,
      mutateSliderData: videoModel?.mutateSliderData,
    });
  };

  /**
   * Handle click event
   */
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    isSet ? clickRemoveFromLikedMedia() : clickAddToLikedMedia();
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
    <Tooltip text={isSet ? "Rated" : "I like this"}>
      <UnstyledButton
        type="button"
        aria-label={isSet ? "Rated" : "I like this"}
        className="relative mx-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent font-bold text-white transition duration-150 ease-out hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-8 sm:w-8 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11"
        onClick={handleClick}
      >
        <span className="sr-only">{isSet ? "Rated" : "I like this"}</span>
        <MotionDivWrapper
          className="absolute inset-0 flex items-center justify-center"
          initial="intitial"
          animate={clicked ? "bounce" : "bounceBack"}
          variants={variants as Variants}
        >
          {isSet ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-mt-[2px] h-[1.35rem] w-[1.35rem]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-mt-[1px] h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
          )}
        </MotionDivWrapper>
      </UnstyledButton>
    </Tooltip>
  );
};

export default LikeMediaButton;
