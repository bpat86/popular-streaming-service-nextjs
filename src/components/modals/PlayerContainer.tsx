import Image from "next/image";
import { forwardRef, MutableRefObject, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import YouTube, { YouTubeProps } from "react-youtube";

import Logo from "@/components/modals/Logo";
import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

import ButtonControls from "./detail/ButtonControls";
import MediaControls from "./MediaControls";
import TitleTreatmentWrapper from "./mini/TitleTreatmentWrapper";
import PlaybackError from "./PlaybackError";

type PlayerContainerProps = {
  [key: string]: any;
  className?: string;
  logos?: any;
  videoId?: string;
  imageKey?: string;
  title?: string;
  identifiers?: any;
  isMyListRow?: boolean;
  inMediaList?: boolean;
  isAnimating?: boolean;
  isLoading?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  isDetailModal?: boolean;
  isDefaultModal?: boolean;
  handleWatchNow?: any;
  showBoxArtOnMount?: boolean;
  showBoxArtOnClose?: boolean;
  showTitleGradient?: boolean;
  showVideo?: boolean;
  requestAndRevalidate?: any;
  videoPlayback?: any;
  videoModel?: any;
  willClose?: boolean;
};

type VideoPlayerProps = {
  canPlay: boolean;
  onEnd: YouTubeProps["onEnd"];
  onError: YouTubeProps["onError"];
  onReady: YouTubeProps["onReady"];
  opts: YouTubeProps["opts"];
  videoId: string;
};

/**
 * Handle the YoutTube player iframe
 */
const VideoPlayer = ({
  canPlay,
  onEnd,
  onError,
  onReady,
  opts,
  videoId,
}: VideoPlayerProps) => {
  if (!canPlay) return <></>;
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden">
      <YouTube
        className="relative h-full w-full overflow-hidden"
        data-videoid={videoId}
        id={videoId}
        iframeClassName="bg-black absolute inset-0 w-full h-full"
        onEnd={onEnd}
        onError={onError}
        onReady={onReady}
        opts={opts}
        title=""
        videoId={videoId}
      />
    </div>
  );
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
    const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
    const [player, setPlayer] = useState<any>(null);
    const [playbackError, setPlaybackError] = useState<boolean>(false);
    const [videoCanPlayThrough, setVideoCanPlayThrough] =
      useState<boolean>(false);
    const [videoCompleted, setVideoCompleted] = useState<boolean>(false);
    const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
      useState<boolean>(false);

    /**
     * Enable audio globally
     */
    const enableAudio = () => {
      setAudioEnabled(true);
    };

    /**
     * Disable audio globally
     */
    const disableAudio = () => {
      setAudioEnabled(false);
    };

    /**
     * Return if audio is enabled globally
     */
    const audioIsEnabled = () => {
      return audioEnabled;
    };

    /**
     * Watch for when the video is finished playing
     */
    useEffect(() => {
      if (videoCompleted) {
        setVideoCanPlayThrough(false);
      }
    }, [videoCompleted]);

    /**
     * Mute the player
     */
    const mute = () => {
      if (player?.getPlayerState() === 1 || player?.getPlayerState() === 2) {
        player.setVolume(0);
        player.mute();
        disableAudio();
      }
    };

    /**
     * UnMute the player
     */
    const unMute = () => {
      if (player?.getPlayerState() === 1 || player?.getPlayerState() === 2) {
        player.setVolume(10);
        player.unMute();
        enableAudio();
      }
    };

    /**
     * Toggle audio on / off
     */
    const toggleAudio = () => {
      audioIsEnabled() ? mute() : unMute();
    };

    /**
     * Reset animations and state before replaying the video
     */
    const replayVideo = () => {
      setVideoCompleted(false);
      setVideoCanPlayThrough(true);
      unMute();
    };

    /**
     * YouTube API event for when the player is loaded
     */
    const onReady: YouTubeProps["onReady"] = (e) => {
      // e.target.playVideo();
      setPlayer(e.target);
      setVideoCanPlayThrough(true);
      audioIsEnabled() && unMute();
    };

    /**
     * YouTube API event for when the video ends
     */
    const onEnd: YouTubeProps["onEnd"] = () => {
      !videoCompleted && handleVideoCompleted();
    };

    /**
     * Handle when the video ends
     */
    const handleVideoCompleted = () => {
      if (!videoHasPlayedAtLeastOnce) {
        flushSync(() => setPlayer(undefined));
        setVideoCompleted(true);
        setVideoHasPlayedAtLeastOnce(true);
      }
    };

    /**
     * Set error if YouTube video returns an error
     */
    const onError: YouTubeProps["onError"] = ({ data }) => {
      if (data === 2 || data === 5 || data === 100 || data === 101) {
        setPlaybackError(true);
        setVideoCanPlayThrough(false);
      }
    };

    /**
     * YouTube Player config
     * https://developers.google.com/youtube/player_parameters
     */
    const defaultOpts: YouTubeProps["opts"] = {
      height: null,
      width: null,
      playerVars: {
        color: "white",
        mute: 1,
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        cc_load_policy: 0, // Hide closed captions
        iv_load_policy: 3, // Hide the Video Annotations
        modestbranding: 1,
        playsinline: 1,
        start: videoPlayback ? Math.round(videoPlayback) : 0,
        // end: 5,
      },
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
              className={clsxm("boxart-image", [isDisliked && "grayscale"])}
              src={`https://image.tmdb.org/t/p/${
                "w780" || "original"
              }${imageKey}`}
              alt={title ?? ""}
              style={{
                opacity:
                  !showBoxArtOnMount &&
                  !showBoxArtOnClose &&
                  !playbackError &&
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
                  className={clsxm("boxart-image", [isDisliked && "grayscale"])}
                  src={`https://image.tmdb.org/t/p/${
                    "w1280" || "original"
                  }${imageKey}`}
                  alt={title ?? ""}
                  style={{
                    opacity:
                      !showBoxArtOnMount &&
                      !showBoxArtOnClose &&
                      !playbackError &&
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
            </div>
          )}
          {isDefaultModal && (
            <div className="story-art detail-modal relative">
              {imageKey ? (
                <Image
                  priority={true}
                  className={clsxm("boxart-image", [isDisliked && "grayscale"])}
                  src={`https://image.tmdb.org/t/p/${
                    "w1280" || "original"
                  }${imageKey}`}
                  alt={title ?? ""}
                  style={{
                    opacity:
                      !showBoxArtOnMount &&
                      !showBoxArtOnClose &&
                      !playbackError &&
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
              videoId={videoId}
              videoCompleted={videoCompleted}
              videoCanPlayThrough={videoCanPlayThrough}
              playbackError={playbackError}
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
              {showVideo && !playbackError && (
                <MediaControls
                  audioIsEnabled={audioIsEnabled()}
                  isDetailModal={isDetailModal}
                  toggleAudio={toggleAudio}
                  replayVideo={replayVideo}
                  videoCompleted={videoCompleted}
                  videoCanPlayThrough={videoCanPlayThrough}
                  videoHasPlayedAtLeastOnce={videoHasPlayedAtLeastOnce}
                />
              )}
              {showVideo && playbackError && (
                <PlaybackError
                  isDetailModal={isDetailModal}
                  errorText="Preview Unavailable"
                />
              )}
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
              playbackError={playbackError}
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
              {showVideo && !playbackError && (
                <MediaControls
                  audioIsEnabled={audioIsEnabled()}
                  isDetailModal={isDetailModal}
                  toggleAudio={toggleAudio}
                  replayVideo={replayVideo}
                  videoCompleted={videoCompleted}
                  videoCanPlayThrough={videoCanPlayThrough}
                  videoHasPlayedAtLeastOnce={videoHasPlayedAtLeastOnce}
                />
              )}
              {showVideo && playbackError && (
                <PlaybackError
                  isDetailModal={isDetailModal}
                  errorText="Preview Unavailable"
                />
              )}
            </TitleTreatmentWrapper>
          )}
        </>
      );
    };

    return (
      <div className={className}>
        {videoId && (
          <VideoPlayer
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
            onEnd={onEnd}
            onError={onError}
            onReady={onReady}
            opts={defaultOpts}
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
