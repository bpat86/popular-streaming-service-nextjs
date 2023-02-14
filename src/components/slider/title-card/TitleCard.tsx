import {
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  useCallback,
  useRef,
} from "react";

import clsxm from "@/lib/clsxm";

import BoxArt from "./BoxArt";
import WatchLink from "./WatchLink";

type TitleCardProps = {
  className?: string;
  id: string;
  isDisliked?: boolean;
  imageKey: string;
  itemTabbable: boolean;
  inViewport?: boolean;
  onFocus: () => void;
  onMouseEnter: (
    e: MouseEvent<HTMLDivElement>,
    ref: MutableRefObject<HTMLDivElement>
  ) => void;
  onMouseLeave: (
    e: MouseEvent<HTMLDivElement> & {
      relatedTarget: EventTarget &
        Node & {
          location: Location;
        };
    },
    ref: MutableRefObject<HTMLDivElement>
  ) => void;
  onMouseMove: (
    e: MouseEvent<HTMLDivElement>,
    ref: MutableRefObject<HTMLDivElement>
  ) => void;
  onKeyDown: (
    e: KeyboardEvent<HTMLDivElement>,
    ref: MutableRefObject<HTMLDivElement>
  ) => void;
  onClick: (
    e:
      | MouseEvent<HTMLDivElement | HTMLAnchorElement>
      | KeyboardEvent<HTMLDivElement | HTMLAnchorElement>,
    ref: MutableRefObject<HTMLDivElement>
  ) => void;
  rowNum: number;
  toggleExpandedInfoDensity: (arg0: boolean) => void;
  watchURL: string;
};

const TitleCard = ({
  className,
  id,
  isDisliked,
  imageKey,
  itemTabbable,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  rowNum,
  toggleExpandedInfoDensity,
  watchURL,
}: TitleCardProps) => {
  const titleCardRef = useRef<HTMLDivElement>(null);

  /**
   * Only visible when the user selects thumbs down for a media title
   */
  const getIsDisliked = () => {
    return isDisliked ? (
      <div className="title-treatment-wrapper absolute inset-0 z-1 select-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 m-2 h-6 w-6 text-white"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
        </svg>
      </div>
    ) : (
      <></>
    );
  };

  /**
   * Handle the onMouseEnter event for the title card.
   */
  const handleOnMouseEnter = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const mouseEnter = onMouseEnter;
      mouseEnter &&
        mouseEnter(e, titleCardRef as MutableRefObject<HTMLDivElement>);
      toggleExpandedInfoDensity && toggleExpandedInfoDensity(true);
    },
    [onMouseEnter, titleCardRef, toggleExpandedInfoDensity]
  );

  /**
   * Handle the onMouseMove event for the title card.
   */
  const handleOnMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onMouseMove &&
        onMouseMove(e, titleCardRef as MutableRefObject<HTMLDivElement>);
    },
    [onMouseMove, titleCardRef]
  );

  /**
   * Handle the onMouseLeave event for the title card.
   */
  const handleOnMouseLeave = useCallback(
    (
      e: MouseEvent<HTMLDivElement> & {
        relatedTarget: EventTarget &
          Node & {
            location: Location;
          };
      }
    ) => {
      onMouseLeave &&
        onMouseLeave(e, titleCardRef as MutableRefObject<HTMLDivElement>);
      toggleExpandedInfoDensity && toggleExpandedInfoDensity(false);
    },
    [onMouseLeave, titleCardRef, toggleExpandedInfoDensity]
  );

  /**
   * Handle the onKeyDown event for the title card.
   */
  const handleOnKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown &&
        onKeyDown(e, titleCardRef as MutableRefObject<HTMLDivElement>);
    },
    [onKeyDown, titleCardRef]
  );

  /**
   * Handle the onClick event for the title card.
   */
  const handleAnchorClick = useCallback(
    (
      e:
        | MouseEvent<HTMLDivElement | HTMLAnchorElement>
        | KeyboardEvent<HTMLDivElement | HTMLAnchorElement>
    ) => {
      const click = onClick;
      click &&
        (e.stopPropagation(),
        e.preventDefault(),
        click(e, titleCardRef as MutableRefObject<HTMLDivElement>));
    },
    [onClick, titleCardRef]
  );

  return (
    <div
      ref={titleCardRef}
      id={id}
      className={clsxm(className)}
      onKeyDown={handleOnKeyDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onMouseMove={handleOnMouseMove}
    >
      <WatchLink
        className="slider-refocus"
        watchURL={watchURL}
        itemTabbable={itemTabbable}
        onClick={handleAnchorClick}
        onFocus={onFocus}
      >
        <div
          className={clsxm(
            "boxart-size-16x9 boxart-rounded relative bg-zinc-800",
            [isDisliked && "grayscale"]
          )}
        >
          {getIsDisliked()}
          <BoxArt
            className="boxart-image"
            imageKey={imageKey}
            priority={rowNum < 3}
          />
        </div>
      </WatchLink>
    </div>
  );
};

export default TitleCard;
