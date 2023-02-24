import { KeyboardEvent, MouseEvent, RefObject, useRef } from "react";

import BoxArt from "./BoxArt";
import WatchLink from "./WatchLink";

type TitleCardProps = {
  className?: string;
  id: string;
  isDisliked?: boolean;
  imageKey: string;
  itemTabbable: boolean;
  onFocus: () => void;
  onMouseEnter: (
    e: MouseEvent<HTMLDivElement>,
    ref: RefObject<HTMLDivElement>
  ) => void;
  onMouseLeave: (
    e: MouseEvent<HTMLDivElement> & {
      relatedTarget: EventTarget &
        Node & {
          location: Location;
        };
    },
    ref: RefObject<HTMLDivElement>
  ) => void;
  onMouseMove: (
    e: MouseEvent<HTMLDivElement>,
    ref: RefObject<HTMLDivElement>
  ) => void;
  onKeyDown: (
    e: KeyboardEvent<HTMLDivElement>,
    ref: RefObject<HTMLDivElement>
  ) => void;
  onClick: (
    e:
      | MouseEvent<HTMLDivElement | HTMLAnchorElement>
      | KeyboardEvent<HTMLDivElement | HTMLAnchorElement>,
    ref: RefObject<HTMLDivElement>
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
   * Handle the onMouseEnter event for the title card.
   */
  const handleOnMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    const mouseEnter = onMouseEnter;
    mouseEnter && mouseEnter(e, titleCardRef);
    toggleExpandedInfoDensity && toggleExpandedInfoDensity(true);
  };

  /**
   * Handle the onMouseMove event for the title card.
   */
  const handleOnMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    onMouseMove && onMouseMove(e, titleCardRef);
  };

  /**
   * Handle the onMouseLeave event for the title card.
   */
  const handleOnMouseLeave = (
    e: MouseEvent<HTMLDivElement> & {
      relatedTarget: EventTarget &
        Node & {
          location: Location;
        };
    }
  ) => {
    onMouseLeave && onMouseLeave(e, titleCardRef);
    toggleExpandedInfoDensity && toggleExpandedInfoDensity(false);
  };

  /**
   * Handle the onKeyDown event for the title card.
   */
  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown && onKeyDown(e, titleCardRef);
  };

  /**
   * Handle the onClick event for the title card.
   */
  const handleAnchorClick = (
    e:
      | MouseEvent<HTMLDivElement | HTMLAnchorElement>
      | KeyboardEvent<HTMLDivElement | HTMLAnchorElement>
  ) => {
    const click = onClick;
    click && click(e, titleCardRef);
  };

  return (
    <div
      ref={titleCardRef}
      className={className}
      id={id}
      onKeyDown={handleOnKeyDown}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onMouseMove={handleOnMouseMove}
    >
      <WatchLink
        className="slider-refocus"
        itemTabbable={itemTabbable}
        onClick={handleAnchorClick}
        onFocus={onFocus}
        watchURL={watchURL}
      >
        <BoxArt
          imageKey={imageKey}
          isDisliked={isDisliked}
          priority={rowNum < 4 || itemTabbable}
        />
      </WatchLink>
    </div>
  );
};

export default TitleCard;
