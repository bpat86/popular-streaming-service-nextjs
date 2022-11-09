import Image from "next/image";
import { forwardRef, memo, useEffect, useState } from "react";
import YouTube from "react-youtube";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

import Logo from "@/components/modals/Logo";

import ButtonControls from "./detail/ButtonControls";
import MediaControls from "./MediaControls";
import TitleTreatmentWrapper from "./mini/TitleTreatmentWrapper";
import PlaybackError from "./PlaybackError";

const PlayerContainer = memo(
  forwardRef((props, buttonsRef) => {
    const {
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
    } = props;
    // Media player state
    const [player, setPlayer] = useState(undefined);
    const [playbackError, setPlaybackError] = useState(false);
    const [videoCanPlayThrough, setVideoCanPlayThrough] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
      useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);

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
     * @returns {Boolean}
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
      if (player) {
        player.setVolume(0);
        player.mute();
        disableAudio();
      }
    };

    /**
     * UnMute the player
     */
    const unMute = () => {
      if (player) {
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
     * Handle when the video ends
     */
    const handleVideoCompleted = () => {
      !videoHasPlayedAtLeastOnce && setVideoHasPlayedAtLeastOnce(true),
        setVideoCompleted(true),
        setPlayer(undefined);
    };

    /**
     * YouTube API event for when the player is loaded
     * @param {Object} e
     * @returns
     */
    const onPlayerReady = (e) => {
      setPlayer(e.target);
      e.target.playVideo();
    };

    /**
     * YouTube API state change event
     * @param {Object} e
     */
    const onPlayerStateChange = (e) => {
      if (e.data === 1) {
        setPlaybackError(false);
        setVideoCanPlayThrough(true);
        audioIsEnabled() && unMute();
      }
    };

    /**
     * YouTube API event for when the video ends
     */
    const onPlayerEnd = () => {
      !videoCompleted && handleVideoCompleted();
    };

    /**
     * Set error if YouTube video returns an error
     * @param {obj} e
     */
    const onPlayerError = (e = {}) => {
      if (
        e.data === 2 ||
        e.data === 150 ||
        e.data === 100 ||
        e.data === 101 ||
        e === null
      ) {
        setPlaybackError(true);
        setVideoCanPlayThrough(false);
      }
    };

    /**
     * YouTube Player config
     * https://developers.google.com/youtube/player_parameters
     */
    const defaultOpts = isDetailModal
      ? {
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
            // end: 9,
          },
        }
      : {
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
            start: 0,
            // end: 9,
          },
        };

    /**
     * Handle the YoutTube player iframe
     * @returns {JSX.Element}
     */
    const renderVideoPlayer = () => {
      if (
        !isLoading &&
        !isAnimating &&
        !showBoxArtOnMount &&
        !showBoxArtOnClose &&
        !videoCompleted &&
        showVideo &&
        videoId
      )
        // Mini / detail modal
        return (
          <div className="absolute inset-0 h-full w-full overflow-hidden">
            <YouTube
              title={null}
              id={videoId}
              className="relative h-full w-full overflow-hidden"
              iframeClassName="bg-black absolute inset-0 w-full h-full"
              loading="lazy"
              data-videoid={videoId}
              videoId={videoId}
              onStateChange={onPlayerStateChange}
              onReady={onPlayerReady}
              onEnd={onPlayerEnd}
              onError={onPlayerError}
              opts={defaultOpts}
            />
          </div>
        );
      return <></>;
    };

    return (
      <div className={className}>
        {renderVideoPlayer()}
        {/* Boxart container */}
        <div
          className="boxart-wrapper"
          style={{
            position: isDetailModal ? "absolute" : "relative",
          }}
        >
          {imageKey && (
            <Image
              priority={true}
              layout="fill"
              className={`boxart-image ${isDisliked ? "grayscale" : null}`}
              src={`https://image.tmdb.org/t/p/${
                "w780" || "original"
              }${imageKey}`}
              alt={title}
              style={{
                opacity:
                  !showBoxArtOnMount &&
                  !showBoxArtOnClose &&
                  !playbackError &&
                  !videoCompleted &&
                  showVideo &&
                  videoId
                    ? 0
                    : 1,
              }}
            />
          )}
        </div>
        {/* Expandable detail modal */}
        {isDetailModal && !isDefaultModal && (
          <div className="story-art detail-modal relative">
            {imageKey && (
              <Image
                priority={true}
                layout="fill"
                className={`boxart-image ${isDisliked ? "grayscale" : null}`}
                src={`https://image.tmdb.org/t/p/${
                  "w1280" || "original"
                }${imageKey}`}
                alt={title}
                style={{
                  opacity:
                    !showBoxArtOnMount &&
                    !showBoxArtOnClose &&
                    !playbackError &&
                    !videoCompleted &&
                    showVideo &&
                    videoId
                      ? 0
                      : 1,
                }}
              />
            )}
          </div>
        )}
        {isDefaultModal && (
          <div className="story-art detail-modal relative">
            {imageKey && (
              <Image
                priority={true}
                layout="fill"
                className={`boxart-image ${isDisliked ? "grayscale" : null}`}
                src={`https://image.tmdb.org/t/p/${
                  "w1280" || "original"
                }${imageKey}`}
                alt={title}
                style={{
                  opacity:
                    !showBoxArtOnMount &&
                    !showBoxArtOnClose &&
                    !playbackError &&
                    !videoCompleted &&
                    showVideo &&
                    videoId
                      ? 0
                      : 1,
                }}
              />
            )}
          </div>
        )}
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
      </div>
    );
  })
);

export default PlayerContainer;
