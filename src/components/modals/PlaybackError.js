import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

const PlaybackError = ({
  isDetailModal,
  errorText = "Video Playback Error",
}) => {
  return (
    <MotionDivWrapper
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5 }}
      className={`${
        isDetailModal ? "detail-modal" : "mini-modal"
      } preview-modal-playback-error`}
    >
      {isDetailModal ? (
        <div className="flex items-center justify-center rounded bg-gray-900 px-[0.65rem] py-2 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-[0.10rem] mr-[0.4rem] h-[1.20rem] w-[1.20rem]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-base tracking-wide">{errorText}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center rounded bg-gray-900 px-[0.6rem] py-[0.45rem] text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-[0.10rem] mr-[0.4rem] h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm tracking-wide">{errorText}</span>
        </div>
      )}
    </MotionDivWrapper>
  );
};

export default PlaybackError;
