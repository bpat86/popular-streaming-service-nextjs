import Image from "next/image";
import {
  forwardRef,
  MouseEvent,
  MutableRefObject,
  useRef,
  useState,
} from "react";
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
  mediaType?: string;
};

type PlayerContainerProps = {
  [key: string]: any;
  className?: string;
  logos?: any;
  videoId?: string;
  imageKey?: string;
  title?: string;
  identifiers: IVideoModel["identifiers"];
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
  videoPlayback?: IVideoModel["videoPlayback"];
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
      identifiers: { mediaType, id } = {},
      isMyListRow,
      inMediaList,
      isAnimating,
      isLoading,
      isLiked,
      isDisliked,
      isDetailModal,
      isDefaultModal,
      handleWatchNow,
      handleUnplayableMedia,
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
    const [playerError, setPlayerError] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(true);
    const [played, setPlayed] = useState<number>(0);
    const [videoCompleted, setVideoCompleted] = useState<boolean>(false);
    const [videoCanPlayThrough, setVideoCanPlayThrough] =
      useState<boolean>(false);
    const [videoStarted, setVideoStarted] = useState<boolean>(false);
    const [videoBuffering, setVideoBuffering] = useState<boolean>(false);
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

    const handleOnPlayPause = () => {
      setPlaying(!playing);
    };

    const handleStop = () => {
      setPlaying(false);
    };

    const toggleAudio = () => {
      setMuted(!muted);
    };

    const handleOnReady = () => {
      handleSeek();
      setPlayerError(false);
      setVideoCanPlayThrough(true);
    };

    const handleOnStart = () => {
      setVideoBuffering(false);
      setVideoStarted(true);
    };

    const handleOnBuffer = () => {
      setVideoBuffering(true);
    };

    const handleOnPlay = () => {
      setPlaying(true);
    };

    const handleOnPause = () => {
      setPlaying(false);
    };

    const handleOnEnded = () => {
      setPlaying(false);
      setVideoCompleted(true);
      setVideoHasPlayedAtLeastOnce(true);
    };

    const handleOnDuration = (duration: number) => {
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

    const isMuted = () => {
      return muted;
    };

    /**
     * Open a video in watch now mode
     */
    const handleWatchNowClick = (e: MouseEvent<Element>) => {
      e.preventDefault();
      if (mediaType && id) {
        return handleWatchNow({
          id: Number(id),
          mediaType: mediaType.toString(),
        });
      }
    };

    /**
     * Render BoxArt Wrapper Component
     */
    const renderBoxArt = () => {
      return (
        <div
          className="boxart-wrapper"
          style={{
            position: isDetailModal ? "absolute" : "relative",
          }}
        >
          {imageKey ? (
            <Image
              priority={true}
              className={clsxm(
                "boxart-image transition-opacity delay-700 duration-500 ease-out",
                [isDisliked && "grayscale", willClose && "transition-none"]
              )}
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
                  !videoBuffering &&
                  videoStarted &&
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
        </div>
      );
    };

    /**
     * Render StoryArt Component

     */
    const renderStoryArt = () => {
      return (
        <>
          {isDetailModal && !isDefaultModal && (
            <div className="story-art detail-modal relative">
              {imageKey ? (
                <Image
                  priority={true}
                  className={clsxm(
                    "boxart-image transition-opacity delay-700 duration-500 ease-out",
                    [isDisliked && "grayscale", willClose && "transition-none"]
                  )}
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
                      !videoBuffering &&
                      videoStarted &&
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
            </div>
          )}
          {isDefaultModal && (
            <div className="story-art detail-modal relative">
              {imageKey ? (
                <Image
                  priority={true}
                  className={clsxm(
                    "boxart-image transition-opacity delay-700 duration-500 ease-out",
                    [isDisliked && "grayscale", willClose && "transition-none"]
                  )}
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
                      !videoBuffering &&
                      videoStarted &&
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
            </div>
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
              shouldAnimate={
                !videoCompleted &&
                videoStarted &&
                videoCanPlayThrough &&
                playing
              }
            >
              <div className="title-treatment">
                {!isLoading && <Logo logos={logos} title={title} />}
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
              </div>
              <AnimatePresenceWrapper>
                {videoStarted && showVideo && (
                  <MediaControls
                    isDetailModal={isDetailModal}
                    isMuted={isMuted()}
                    toggleAudio={toggleAudio}
                    replayVideo={replayVideo}
                    title={title}
                    videoError={!videoCanPlayThrough || playerError}
                    videoPlaying={
                      !videoBuffering &&
                      videoStarted &&
                      videoCanPlayThrough &&
                      playing
                    }
                    videoCompleted={videoCompleted && videoHasPlayedAtLeastOnce}
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
              isDetailModal={isDetailModal}
              shouldAnimate={false}
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
                {!isLoading && <Logo logos={logos} title={title} />}
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
                {videoStarted && showVideo && (
                  <MediaControls
                    isDetailModal={isDetailModal}
                    isMuted={isMuted()}
                    replayVideo={replayVideo}
                    toggleAudio={toggleAudio}
                    title={title}
                    videoError={!videoCanPlayThrough || playerError}
                    videoPlaying={
                      !videoBuffering &&
                      videoStarted &&
                      videoCanPlayThrough &&
                      playing
                    }
                    videoCompleted={videoCompleted && videoHasPlayedAtLeastOnce}
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
      <div className={className} onClick={handleWatchNowClick}>
        {videoId && (
          <VideoPlayer
            ref={playerRef}
            canPlay={
              !!(
                videoId &&
                showVideo &&
                !isLoading &&
                !isAnimating &&
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
            onReady={handleOnReady}
            onStart={handleOnStart}
            onPlay={handleOnPlay}
            onPause={handleOnPause}
            onBuffer={handleOnBuffer}
            onEnded={handleOnEnded}
            onDuration={handleOnDuration}
            videoId={videoId}
          />
        )}
        {renderBoxArt()}
        {renderStoryArt()}
        {renderTitleTreatmentWrapper()}
      </div>
    );
  }
);

export default PlayerContainer;
