import Tooltip from "@/components/tooltips/Tooltip";
import clsxm from "@/lib/clsxm";

type AudioToggleProps = {
  isDetailModal: boolean;
  mute: boolean;
  toggleSound: () => void;
  videoCanPlayThrough: boolean;
  videoCompleted: boolean;
  videoPlaybackError: boolean;
};

const AudioIcons = ({ mute }: { mute: boolean }) => {
  return (
    <>
      {mute ? (
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
      ) : (
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
      )}
    </>
  );
};

const AudioToggle = ({
  isDetailModal,
  mute,
  toggleSound,
  videoCanPlayThrough,
  videoCompleted,
  videoPlaybackError,
}: AudioToggleProps) => {
  /**
   * Handle display text for audio toggle button
   */
  function handleDisplayText() {
    return mute ? "Mute" : "Unmute";
  }

  return (
    <div
      className={clsxm("preview-modal-audio-toggle z-50", [
        isDetailModal ? "detail-modal" : "mini-modal",
      ])}
    >
      {/* Detail modal audio toggle */}
      {videoCanPlayThrough && !videoCompleted && (
        <Tooltip className="ml-auto" text={handleDisplayText()}>
          <button
            type="button"
            className={clsxm(
              "relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-zinc-400 bg-transparent font-bold text-zinc-400 transition delay-300 duration-300 ease-out hover:border-white hover:text-white focus:bg-white focus:bg-opacity-50 focus:outline-none focus:ring focus:ring-white sm:h-8 sm:w-8 md:text-xl lg:h-9 lg:w-9 2xl:h-11 2xl:w-11",
              [videoPlaybackError ? "opacity-0" : "opacity-100"]
            )}
            onClick={toggleSound}
          >
            <span className="sr-only">{handleDisplayText()}</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <AudioIcons mute={mute} />
            </div>
          </button>
        </Tooltip>
      )}
    </div>
  );
};

export default AudioToggle;
