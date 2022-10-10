const AudioToggle = (props) => {
  const {
    isDetailModal,
    mute,
    toggleSound,
    videoCanPlayThrough,
    videoCompleted,
    videoPlaybackError,
  } = props;

  return (
    <div
      className={`${
        isDetailModal ? "detail-modal" : "mini-modal"
      } preview-modal-audio-toggle`}
    >
      {/* Detail modal audio toggle */}
      {videoCanPlayThrough && !videoCompleted && (
        <button
          type="button"
          className={`flex items-center justify-center border-2 border-gray-400 hover:border-white rounded-full text-gray-400 hover:text-white bg-transparent focus:bg-white focus:bg-opacity-50 focus:ring focus:ring-white font-bold focus:outline-none md:text-xl w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 ml-auto relative ${
            videoPlaybackError ? "opacity-0" : "opacity-100"
          } transition ease-out duration-300 delay-300`}
          onClick={toggleSound}
        >
          <span className="sr-only">{mute ? "Mute" : "Unmute"}</span>
          <div className="absolute inset-0 flex items-center justify-center">
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
          </div>
        </button>
      )}
    </div>
  );
};

export default AudioToggle;
