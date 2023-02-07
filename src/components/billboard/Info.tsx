import { CSSProperties, forwardRef, MutableRefObject } from "react";

import Logo from "@/components/billboard/Logo";
import Synopsis from "@/components/billboard/Synopsis";
import { IModel, IVideoModel } from "@/store/types";

import CTAButtons from "./buttons/CTAButtons";

type WatchNowProps = {
  id: number;
  mediaType: string;
};

type InfoProps = {
  videoPlayback: IVideoModel["videoPlayback"];
  model: IModel;
  canAnimate: boolean;
  logos?: IVideoModel["logos"];
  handleWatchNow: (identifiers: WatchNowProps) => void;
  handleClick?: () => void;
  synopsis: IVideoModel["synopsis"];
  title: IVideoModel["title"];
};

const Info = forwardRef(
  (
    {
      videoPlayback,
      model,
      canAnimate,
      logos,
      handleWatchNow,
      handleClick,
      synopsis,
      title,
    }: InfoProps,
    forwardRef
  ) => {
    const ref = forwardRef as MutableRefObject<HTMLDivElement>;
    /**
     * Billboard logo animation
     */
    const billboardTitleStyles = () => {
      const infoHeight = ref.current?.offsetHeight * 1.6 + "px";
      const duration = 1;
      const delay = 2.6;
      // default
      const defaultStyles = {
        transformOrigin: "left bottom",
        transform: "scale(1) translate3d(0px, 0px, 0px)",
        transitionDuration: 0,
        transitionDelay: 0,
        willChange: "transform",
      };
      // Animated transitions
      const transitionStyles = {
        transformOrigin: "left bottom",
        transform: `scale(0.65) translate3d(0px, ${infoHeight}, 0px)`, // 150px
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      };

      return canAnimate ? transitionStyles : defaultStyles;
    };

    /**
     * Info wrapper animation
     */
    const infoWrapperStyles = () => {
      const infoHeight = ref.current?.offsetHeight + "px";
      const duration = 1;
      const delay = 2.6;
      // default
      const defaultStyles = {
        opacity: 1,
        transform: "translate3d(0px, 0px, 0px)",
        transitionDuration: 0,
        transitionDelay: 0,
        willChange: "transform",
      };
      // Animated transitions
      const transitionStyles = {
        opacity: 0,
        transform: `translate3d(0px, ${infoHeight}, 0px)`, // 96px
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      };

      return canAnimate ? transitionStyles : defaultStyles;
    };

    /**
     * Info synopsis animation
     */
    const infoWrapperFadeStyles = () => {
      const duration = 1;
      const delay = 2.6;
      // Default
      const defaultStyles = {
        opacity: 1,
        transitionDuration: 0,
        transitionDelay: 0,
      };
      // Animated transitions
      const transitionStyles = {
        opacity: 0,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
      };

      return canAnimate ? transitionStyles : defaultStyles;
    };

    return (
      <div className="info meta-layer">
        <div className="logo-and-text meta-layer">
          <div className="title-wrapper">
            <div
              className="billboard-title"
              style={billboardTitleStyles() as CSSProperties}
            >
              <Logo logos={logos} title={title} />
            </div>
            <div
              ref={ref}
              className="info-wrapper"
              style={infoWrapperStyles() as CSSProperties}
            >
              <div
                className="info-wrapper-fade pointer-events-none select-none"
                style={infoWrapperFadeStyles() as CSSProperties}
              >
                <div className="synopsis-fade-container">
                  <Synopsis synopsis={synopsis} />
                </div>
              </div>
            </div>
            <CTAButtons
              videoPlayback={videoPlayback}
              model={model}
              handleWatchNow={handleWatchNow}
              handleClick={handleClick}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Info;
