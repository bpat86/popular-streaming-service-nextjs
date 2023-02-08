import Image from "next/image";
import { forwardRef, MutableRefObject, useRef, useState } from "react";
// import YouTube, { YouTubeProps } from "react-youtube";
import { default as YouTubePlayer } from "react-player/youtube";

import Logo from "@/components/modals/Logo";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel, PreviewModalStore } from "@/store/types";

import ButtonControls from "./detail/ButtonControls";
import MediaControls from "./MediaControls";
import TitleTreatmentWrapper from "./mini/TitleTreatmentWrapper";
import VideoPlayer from "./player/VideoPlayer";

type WatchNowProps = {
  id: number;
  mediaType: string;
};

type PlayerContainerProps = {
  [key: string]: any;
  className?: string;
  logos?: any;
  videoId?: string;
  imageKey?: string;
  title?: string;
  identifiers?: any;
  isMyListRow?: IVideoModel["isMyListRow"];
  inMediaList?: IVideoModel["inMediaList"];
  isAnimating?: boolean;
  isLoading?: boolean;
  isLiked?: IVideoModel["isLiked"];
  isDisliked?: IVideoModel["isDisliked"];
  isDetailModal?: PreviewModalStore["isDetailModal"];
  isDefaultModal?: boolean;
  handleWatchNow: ({ id, mediaType }: WatchNowProps) => void;
  showBoxArtOnMount?: boolean;
  showBoxArtOnClose?: boolean;
  showTitleGradient?: boolean;
  showVideo?: boolean;
  requestAndRevalidate?: any;
  videoPlayback?: any;
  videoModel?: any;
  willClose?: boolean;
};

const PlayerContainer = forwardRef<HTMLDivElement, PlayerContainerProps>(
  (
    {
      className,
      logos,
      videoId,
      imageKey,
      title,
      identifiers,
      isMyListRow,
      inMediaList,
      isAnimating,
      isLoading,
      isLiked,
      isDisliked,
      isDetailModal,
      isDefaultModal,
      handleWatchNow,
      showBoxArtOnMount,
      showBoxArtOnClose,
      showTitleGradient,
      showVideo,
      requestAndRevalidate,
      videoPlayback,
      videoModel,
      willClose,
    },
    ref
  ) => {
    const buttonsRef = ref as MutableRefObject<HTMLDivElement>;
    // Player state
    const playerRef = useRef<YouTubePlayer>(null);
    const [playing, setPlaying] = useState<boolean>(true);
    const [played, setPlayed] = useState<number>(0);
    const [videoCompleted, setVideoCompleted] = useState<boolean>(false);
    const [videoCanPlayThrough, setVideoCanPlayThrough] =
      useState<boolean>(false);
    const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
      useState<boolean>(false);
    const [muted, setMuted] = useState<boolean>(true);
    const [light, setLight] = useState<boolean>(false);
    const [controls, setControls] = useState<boolean>(false);
    const [loop, setLoop] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<number>(0);
    const [volume, setVolume] = useState<number>(0.1);
    const [duration, setDuration] = useState<number>(0);

    const handleToggleLight = () => {
      setLight(!light);
    };

    const handleToggleLoop = () => {
      setLoop(!loop);
    };

    const handlePlayPause = () => {
      setPlaying(!playing);
    };

    const handleStop = () => {
      setPlaying(false);
    };

    const toggleAudio = () => {
      setMuted(!muted);
    };

    const handlePlayerReady = () => {
      handleSeek();
      setVideoCanPlayThrough(true);
    };

    const handlePlay = () => {
      setPlaying(true);
    };

    const handlePause = () => {
      setPlaying(false);
    };

    const handleEnded = () => {
      setPlaying(false);
      setVideoCompleted(true);
      setVideoHasPlayedAtLeastOnce(true);
    };

    const handleDuration = (duration: number) => {
      setDuration(duration);
    };

    const handleSeek = () => {
      playerRef.current?.seekTo(videoPlayback ? parseFloat(videoPlayback) : 0);
    };

    const replayVideo = () => {
      setPlayed(0);
      setPlaying(true);
      setVideoCompleted(false);
    };

    const audioEnabled = () => {
      return muted;
    };

    /**
     * Render BoxArt Wrapper Component
     */
    const renderBoxArt = () => {
      return (
        <MotionDivWrapper
          inherit={false}
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 1, duration: 0.6 } }}
          className="boxart-wrapper"
          style={{
            position: isDetailModal ? "absolute" : "relative",
          }}
        >
          {imageKey ? (
            <Image
              priority={true}
              className={clsxm("boxart-image", [isDisliked && "grayscale"])}
              src={`https://image.tmdb.org/t/p/${
                "w780" ?? "original"
              }${imageKey}`}
              alt={title ?? ""}
              style={{
                opacity:
                  !showBoxArtOnMount &&
                  !showBoxArtOnClose &&
                  !videoCompleted &&
                  !willClose &&
                  showVideo &&
                  videoId
                    ? 0
                    : 1,
              }}
              sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
              fill
            />
          ) : (
            <></>
          )}
        </MotionDivWrapper>
      );
    };

    /**
     * Render StoryArt Component

     */
    const renderStoryArt = () => {
      return (
        <>
          {isDetailModal && !isDefaultModal && (
            <MotionDivWrapper
              inherit={false}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 1, duration: 0.6 } }}
              className="story-art detail-modal relative"
            >
              {imageKey ? (
                <Image
                  priority={true}
                  className={clsxm("boxart-image", [isDisliked && "grayscale"])}
                  src={`https://image.tmdb.org/t/p/${
                    "w1280" ?? "original"
                  }${imageKey}`}
                  alt={title ?? ""}
                  style={{
                    opacity:
                      !showBoxArtOnMount &&
                      !showBoxArtOnClose &&
                      !videoCompleted &&
                      !willClose &&
                      showVideo &&
                      videoId
                        ? 0
                        : 1,
                  }}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                  fill
                />
              ) : (
                <></>
              )}
            </MotionDivWrapper>
          )}
          {isDefaultModal && (
            <MotionDivWrapper
              inherit={false}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 1, duration: 0.6 } }}
              className="story-art detail-modal relative"
            >
              {imageKey ? (
                <Image
                  priority={true}
                  className={clsxm("boxart-image", [isDisliked && "grayscale"])}
                  src={`https://image.tmdb.org/t/p/${
                    "w1280" ?? "original"
                  }${imageKey}`}
                  alt={title ?? ""}
                  style={{
                    opacity:
                      !showBoxArtOnMount &&
                      !showBoxArtOnClose &&
                      !videoCompleted &&
                      !willClose &&
                      showVideo &&
                      videoId
                        ? 0
                        : 1,
                  }}
                  sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                  fill
                />
              ) : (
                <></>
              )}
            </MotionDivWrapper>
          )}
        </>
      );
    };

    /**
     * Render TitleTreatment Component
     */
    const renderTitleTreatmentWrapper = () => {
      return (
        <>
          {/* Mini / Detail modal info */}
          {!isDefaultModal && !showBoxArtOnClose && (
            <TitleTreatmentWrapper
              isDetailModal={isDetailModal}
              videoId={videoId}
              videoCompleted={videoCompleted}
              videoCanPlayThrough={videoCanPlayThrough}
            >
              <MotionDivWrapper
                inherit={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { delay: 0.067, duration: 0.117, ease: "linear" },
                }}
                className="title-treatment"
              >
                <Logo logos={logos} title={title} />
                {isDetailModal && (
                  <ButtonControls
                    ref={buttonsRef}
                    isDetailModal={isDetailModal}
                    handleWatchNow={handleWatchNow}
                    identifiers={identifiers}
                    isMyListRow={isMyListRow}
                    inMediaList={inMediaList}
                    isLiked={isLiked}
                    isDisliked={isDisliked}
                    requestAndRevalidate={requestAndRevalidate}
                    videoModel={videoModel}
                  />
                )}
              </MotionDivWrapper>
              <AnimatePresenceWrapper>
                {showVideo && (
                  <MediaControls
                    audioEnabled={audioEnabled()}
                    isDetailModal={isDetailModal}
                    toggleAudio={toggleAudio}
                    replayVideo={replayVideo}
                    videoCompleted={videoCompleted}
                    videoCanPlayThrough={videoCanPlayThrough}
                    videoHasPlayedAtLeastOnce={videoHasPlayedAtLeastOnce}
                  />
                )}
              </AnimatePresenceWrapper>
            </TitleTreatmentWrapper>
          )}
          {/* Default modal media info */}
          {isDefaultModal && showTitleGradient && (
            <TitleTreatmentWrapper
              isDefaultModal={isDefaultModal}
              isDetailModal={isDetailModal}
              videoId={videoId}
              videoCompleted={videoCompleted}
              videoCanPlayThrough={videoCanPlayThrough}
            >
              <MotionDivWrapper
                inherit={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { delay: 0.067, duration: 0.117, ease: "linear" },
                }}
                className="title-treatment"
              >
                <Logo logos={logos} title={title} />
                <ButtonControls
                  ref={buttonsRef}
                  isDetailModal={isDetailModal}
                  handleWatchNow={handleWatchNow}
                  identifiers={identifiers}
                  isMyListRow={isMyListRow}
                  inMediaList={inMediaList}
                  isLiked={isLiked}
                  isDisliked={isDisliked}
                  requestAndRevalidate={requestAndRevalidate}
                  videoModel={videoModel}
                />
              </MotionDivWrapper>
              <AnimatePresenceWrapper>
                {showVideo && (
                  <MediaControls
                    audioEnabled={audioEnabled()}
                    isDetailModal={isDetailModal}
                    toggleAudio={toggleAudio}
                    replayVideo={replayVideo}
                    videoCompleted={videoCompleted}
                    videoCanPlayThrough={videoCanPlayThrough}
                    videoHasPlayedAtLeastOnce={videoHasPlayedAtLeastOnce}
                  />
                )}
              </AnimatePresenceWrapper>
            </TitleTreatmentWrapper>
          )}
        </>
      );
    };

    return (
      <div className={className}>
        <AnimatePresenceWrapper>
          {videoId && (
            <VideoPlayer
              ref={playerRef}
              canPlay={
                !!(
                  showVideo &&
                  !isAnimating &&
                  !isLoading &&
                  !showBoxArtOnMount &&
                  !showBoxArtOnClose &&
                  !videoCompleted &&
                  !willClose
                )
              }
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              volume={volume}
              muted={muted}
              onReady={handlePlayerReady}
              // onStart={() => console.log("onStart")}
              onPlay={handlePlay}
              onPause={handlePause}
              // onBuffer={() => console.log("onBuffer")}
              // onSeek={(e) => console.log("onSeek", e)}
              onEnded={handleEnded}
              // onError={(e) => console.log("onError", e)}
              onDuration={handleDuration}
              videoId={videoId}
            />
          )}
        </AnimatePresenceWrapper>
        <AnimatePresenceWrapper>{renderBoxArt()}</AnimatePresenceWrapper>
        <AnimatePresenceWrapper>{renderStoryArt()}</AnimatePresenceWrapper>
        <AnimatePresenceWrapper>
          {renderTitleTreatmentWrapper()}
        </AnimatePresenceWrapper>
      </div>
    );
  }
);

export default PlayerContainer;
