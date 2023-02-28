import { MouseEvent } from "react";

import Tooltip from "@/components/tooltips/Tooltip";
import clsxm from "@/lib/clsxm";
import { MotionPathWrapper } from "@/lib/MotionPathWrapper";
import { MotionSpanWrapper } from "@/lib/MotionSpanWrapper";
import { IVideoModel } from "@/store/types";

type MediaControlsProps = {
  isMuted: boolean;
  inView: boolean;
  replayVideo: () => void;
  title: IVideoModel["title"];
  toggleAudio: () => void;
  videoError: boolean;
  videoPlaying: boolean;
  videoCompleted: boolean;
};

const AudioIcons = ({ isMuted }: { isMuted: boolean }) => {
  // Show the muted icon if the video is muted
  if (isMuted) {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      </>
    );
  }
  // Otherwise, show the unmuted icon
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
      </svg>
    </>
  );
};

const PausedIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    </svg>
  );
};

const ReplayIcon = () => {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <MotionPathWrapper
          initial={{ rotate: -180, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
          }}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.1747 3.07702C11.01 2.79202 8.81537 3.30372 6.99988 4.51679C5.18439 5.72987 3.8718 7.56158 3.30668 9.67065C2.74155 11.7797 2.96243 14.0223 3.92815 15.9806C4.89388 17.9389 6.53859 19.4794 8.55586 20.3149C10.5731 21.1505 12.8254 21.2242 14.893 20.5224C16.9606 19.8205 18.7025 18.391 19.7942 16.5L18.0622 15.5C17.2131 16.9708 15.8582 18.0826 14.2501 18.6285C12.642 19.1744 10.8902 19.1171 9.32123 18.4672C7.75224 17.8173 6.47302 16.6192 5.7219 15.096C4.97078 13.5729 4.79899 11.8287 5.23853 10.1883C5.67807 8.5479 6.69897 7.12324 8.11102 6.17973C9.52307 5.23623 11.23 4.83824 12.9137 5.05991C14.5974 5.28158 16.1432 6.10778 17.2629 7.3846C18.1815 8.43203 18.762 9.7241 18.9409 11.0921L17.5547 10.168L16.4453 11.8321L19.4453 13.8321C19.7812 14.056 20.2188 14.056 20.5547 13.8321L23.5547 11.8321L22.4453 10.168L20.9605 11.1578C20.784 9.27909 20.0201 7.49532 18.7666 6.06591C17.3269 4.42429 15.3395 3.36202 13.1747 3.07702Z"
          fill="currentColor"
        ></MotionPathWrapper>
      </svg>
    </>
  );
};

const MediaControls = ({
  isMuted,
  inView,
  replayVideo,
  title,
  toggleAudio,
  videoError,
  videoPlaying,
  videoCompleted,
}: MediaControlsProps) => {
  /**
   * Handle the icons that are displayed in the media controls
   */
  function handleIcons() {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {videoPlaying ? (
          inView ? (
            <AudioIcons isMuted={isMuted} />
          ) : (
            <PausedIcon />
          )
        ) : videoCompleted ? (
          <ReplayIcon />
        ) : (
          <PausedIcon />
        )}
      </div>
    );
  }

  /**
   * Handle the screen reader text that is displayed in the media controls
   */
  function handleDisplayText() {
    return videoPlaying
      ? inView
        ? isMuted
          ? "Unmute"
          : "Mute"
        : `${title} preview is paused`
      : videoCompleted
      ? `Replay ${title}`
      : `${title} preview is paused`;
  }

  /**
   * Handle the click event for the media controls
   */
  function handleClick(e: MouseEvent<Element>) {
    e.stopPropagation();
    return videoPlaying
      ? inView
        ? toggleAudio()
        : null
      : videoCompleted
      ? replayVideo()
      : null;
  }

  return (
    <MotionSpanWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="media-control-buttons"
    >
      <div
        className={clsxm(
          "button-layer transition-opacity duration-300 ease-out",
          [
            videoPlaying && "global-supplemental-audio-toggle audio-btn",
            videoCompleted && "global-supplemental-replay-toggle replay-btn",
            inView ? "opacity-100" : "opacity-50",
          ]
        )}
      >
        <Tooltip text={handleDisplayText()}>
          <button
            type="button"
            className={clsxm(
              "relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white border-opacity-50 bg-transparent font-bold text-white transition duration-150 ease-out hover:border-opacity-100 hover:bg-white hover:bg-opacity-50 focus:border-opacity-100 focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:h-9 sm:w-9 md:text-xl lg:h-10 lg:w-10 2xl:h-12 2xl:w-12",
              [videoError && "hidden"]
            )}
            onClick={handleClick}
          >
            <span className="sr-only">{handleDisplayText()}</span>
            {handleIcons()}
          </button>
        </Tooltip>
      </div>
    </MotionSpanWrapper>
  );
};

export default MediaControls;
