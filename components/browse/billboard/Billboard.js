import { useState, useEffect, useContext, useRef, forwardRef } from "react";
import YouTube from "react-youtube";

import InteractionContext from "@/context/InteractionContext";
import PreviewModalContext from "@/context/PreviewModalContext";
import Info from "@/components/browse/billboard/Info";
import MediaControls from "./buttons/MediaControls";

const Billboard = forwardRef((props, billboardInViewRef) => {
  const { model, inView, shouldFreeze } = props;
  const { handleWatchNow } = useContext(InteractionContext);
  const { modalStateActions, previewModalStateById, wasOpen } =
    useContext(PreviewModalContext);

  const requestRef = useRef(0);
  const playerRef = useRef();
  const infoRef = useRef();

  /**
   * Player state
   */
  const [player, setPlayer] = useState(null);
  const [maxVolume, setMaxVolume] = useState(50);
  const [videoPlaybackError, setVideoPlaybackError] = useState(false);
  const [videoCanPlayThrough, setVideoCanPlayThrough] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
    useState(false);
  const [textIsAnimating, setTextIsAnimating] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  /**
   * Returns true if the preview modal's state is `DETAIL_MODAL` or `DEFAULT_MODAL
   * @returns {Boolean}
   */
  const isDetailModal = () => {
    return Object.values(previewModalStateById).some(
      (modal) => modal.modalState === modalStateActions.DETAIL_MODAL
    );
  };

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
   * Mute the player
   */
  const mute = () => {
    if (player) {
      disableAudio();
      player.mute();
      player.setVolume(0);
    }
  };

  /**
   * Unmute the player
   */
  const unMute = () => {
    if (player) {
      enableAudio();
      player.unMute();
      player.setVolume(maxVolume);
    }
  };

  const fadeInAudio = (audioElement = {}, duration = 28) => {
    if (wasOpen) return;
    requestRef.current = requestAnimationFrame(() => {
      let i = 0;
      // Reset the player state
      audioElement?.unMute();
      audioElement?.setVolume(0);
      let intervalId = setInterval(() => {
        let updatedVolume = (maxVolume / duration) * i;
        audioElement?.setVolume(updatedVolume);
        // Iterate the volume up from zero (muted)
        if (++i >= duration) {
          cancelAnimationFrame(requestRef.current);
          clearInterval(intervalId);
          requestRef.current = 0;
          // Reset the player state
          audioElement?.unMute();
          audioElement?.setVolume(maxVolume);
        }
      }, duration);
    });
  };

  const fadeOutAudio = (audioElement = {}, duration = 28) => {
    const currentVolume = audioElement?.getVolume();
    if (!audioIsEnabled() || currentVolume === 0) return;
    requestRef.current = requestAnimationFrame(() => {
      let i = 0.1;
      // Reset the player state
      audioElement?.unMute();
      audioElement?.setVolume(maxVolume);
      let intervalId = setInterval(() => {
        let newVolume = audioElement?.getVolume() - i;
        // Adjust volume down if still greater than zero (muted)
        if (newVolume >= 0) {
          audioElement?.setVolume(newVolume);
        } else {
          cancelAnimationFrame(requestRef.current);
          clearInterval(intervalId);
          requestRef.current = 0;
          // Reset the player state
          audioElement?.mute();
          audioElement?.setVolume(0);
        }
      }, duration);
    });
  };

  /**
   * Toggle the player audio on / off
   */
  const toggleAudio = () => {
    audioIsEnabled() ? mute() : unMute();
  };

  /**
   * Handle the play event
   */
  const playVideo = () => {
    if (player) {
      player.playVideo();
      audioIsEnabled() && unMute();
    }
  };

  /**
   * Handle the pause event
   */
  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
      audioIsEnabled() && mute();
    }
  };

  /**
   * Reset animations and state before replaying the video
   */
  const replayVideo = () => {
    setTextIsAnimating(true);
    setVideoCompleted(false);
    setVideoCanPlayThrough(true);
  };

  /**
   * Handle when the video ends
   */
  const handleVideoCompleted = () => {
    !videoHasPlayedAtLeastOnce && setVideoHasPlayedAtLeastOnce(true);
    setTextIsAnimating(false);
    setVideoCompleted(true);
    setPlayer(null);
  };

  /**
   * YouTube API event for when the player is loaded.
   * Video won't autoplay unless muted.
   * @param {Object} e
   * @returns
   */
  const onPlayerReady = (e) => {
    if (!e.target) return;
    e.target.mute();
    e.target.playVideo();
    setPlayer(e.target);
    setTextIsAnimating(true);
    setVideoPlaybackError(false);
    setTimeout(() => setVideoCanPlayThrough(true), 1000);
  };

  /**
   * YouTube API state change event
   * @param {Object} e
   */
  const onPlayerStateChange = (e) => {
    if (!e) return;
    if (!e.data) {
      setVideoPlaybackError(true);
      setVideoCanPlayThrough(false);
    }
    e.data === 1 && audioIsEnabled() && unMute();
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
  const onPlayerError = (e) => {
    if (e.data === 150 || e.data === 100 || e.data === 101 || e === null) {
      setVideoPlaybackError(true);
    }
  };

  /**
   * Get video playback information
   */
  const getVideoPlayback = () => {
    if (!player || videoCompleted) return undefined;
    return {
      // start: videoCompleted ? 0 : player?.getCurrentTime(),
      start: player?.getCurrentTime(),
      length: player?.getDuration(),
    };
  };

  /**
   * Listen for when the video finishes
   */
  useEffect(() => {
    videoCompleted && setVideoCanPlayThrough(false);
  }, [videoCompleted]);

  /**
   * Autoplay billbaord video on mount and play/pause when in and out of view
   */
  useEffect(() => {
    if (!videoCanPlayThrough) return;
    if (inView && !shouldFreeze) {
      playVideo();
    } else {
      pauseVideo();
    }
  }, [inView, shouldFreeze]);

  /**
   * YouTube Player Component
   * @returns {JSX.Element}
   */
  const youTubeComponent = () => {
    const videoKey = model?.videoModel?.videoKey;
    if (videoKey) {
      return (
        <YouTube
          title={null}
          id={videoKey}
          videoId={videoKey}
          opts={defaultOpts}
          onEnd={onPlayerEnd}
          onReady={onPlayerReady}
          onError={onPlayerError}
          onStateChange={onPlayerStateChange}
          className={`relative w-full h-full overflow-hidden`}
        />
      );
    }
    return <></>;
  };

  /**
   * YouTube config
   * https://developers.google.com/youtube/player_parameters
   */
  const defaultOpts = {
    height: null,
    width: null,
    playerVars: {
      color: "red",
      mute: 1,
      autoplay: 1,
      loop: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 0,
      fs: 0,
      cc_load_policy: 0, // Hide closed captions
      iv_load_policy: 3, // Hide the Video Annotations
      modestbranding: 1,
      playsinline: 1,
      // end: 9,
    },
  };

  return (
    <span ref={billboardInViewRef} className="billboard-animations-container">
      <div className="billboard-row">
        <div className="billboard">
          <div
            className={`billboard-motion dismiss-mask ${
              !isDetailModal() &&
              !wasOpen &&
              !videoCompleted &&
              videoCanPlayThrough
                ? "dismiss-static"
                : ""
            } `}
          >
            {!videoCompleted && (
              <div
                className={`youtube-video-wrapper ${
                  videoCompleted ? "inactive" : ""
                }`}
                tabIndex="-1"
              >
                <div className="video-container">
                  <div
                    ref={playerRef}
                    className="relative w-full h-full overflow-hidden pointer-events-none"
                  >
                    {/* {youTubeComponent()} */}
                  </div>
                </div>
              </div>
            )}
            <div className="motion-background-component bottom-layer full-screen">
              <div className="hero-image-wrapper">
                <img
                  className="hero static-image image-layer"
                  src={`https://image.tmdb.org/t/p/${"w1280" || "original"}${
                    model?.videoModel?.imageKey
                  }`}
                  alt={model?.videoModel?.title}
                />
                <div className="trailer-vignette vignette-layer"></div>
                <div className="hero-vignette vignette-layer"></div>
              </div>
              <div className="embedded-components button-layer">
                <MediaControls
                  audioIsEnabled={audioIsEnabled()}
                  replayVideo={replayVideo}
                  title={model?.videoModel?.title}
                  toggleAudio={toggleAudio}
                  videoPlaying={!videoCompleted && videoCanPlayThrough}
                  videoCompleted={videoCompleted && videoHasPlayedAtLeastOnce}
                />
              </div>
            </div>
          </div>
          <div className="fill-container">
            <Info
              ref={infoRef}
              canAnimate={
                videoCanPlayThrough && !videoCompleted && textIsAnimating
              }
              videoPlayback={getVideoPlayback()}
              handleWatchNow={handleWatchNow}
              logos={model?.videoModel?.logos}
              model={model}
              synopsis={model?.videoModel?.synopsis}
              title={model?.videoModel?.title}
            />
          </div>
        </div>
      </div>
    </span>
  );
});

Billboard.displayName = "Billboard";
export default Billboard;
