import Image from "next/image";
import { useRouter } from "next/router";
import {
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import YouTube from "react-youtube";
import shallow from "zustand/shallow";

// Components
import Info from "@/components/browse/billboard/Info";
// Context
import InteractionContext from "@/context/InteractionContext";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

import MediaControls from "./buttons/MediaControls";

const Billboard = forwardRef(
  ({ model, inView, shouldFreeze }, billboardInViewRef) => {
    // Context
    const { enableWatchMode } = useContext(InteractionContext);
    // Store
    const wasOpen = usePreviewModalStore((state) => state.wasOpen, shallow);
    const isDetailModal = usePreviewModalStore(
      (state) => state.isDetailModal,
      shallow
    );
    // Refs
    // const requestRef = useRef(0);
    const playerRef = useRef();
    const infoRef = useRef();
    // Next Router
    const router = useRouter();

    /**
     * Player state
     */
    const [player, setPlayer] = useState(null);
    // const [maxVolume, setMaxVolume] = useState(50);
    const [videoPlaybackError, setVideoPlaybackError] = useState(false);
    const [videoCanPlayThrough, setVideoCanPlayThrough] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
      useState(false);
    const [textIsAnimating, setTextIsAnimating] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    // Local vars
    const maxVolume = 10;

    /**
     * Redirect to watch mode screen
     */
    const handleWatchNow = ({ id, mediaType } = {}) => {
      if (id) {
        const as = `/watch/${mediaType}-${id}`;
        const options = {
          shallow: true,
          scroll: false,
        };
        router.push(
          {
            pathname: "/watch/[mediaId]",
            query: {
              ...router.query,
              id,
              mediaId: `${mediaType}-${id}`,
              type: mediaType,
            },
          },
          as,
          options
        );
        enableWatchMode();
      }
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
    const audioIsEnabled = useCallback(() => {
      return audioEnabled;
    }, [audioEnabled]);

    /**
     * Mute the player
     */
    const mute = useCallback(() => {
      if (player) {
        disableAudio();
        player.mute();
        player.setVolume(0);
      }
    }, [player]);

    /**
     * Unmute the player
     */
    const unMute = useCallback(() => {
      if (player) {
        enableAudio();
        player.unMute();
        player.setVolume(maxVolume);
      }
    }, [maxVolume, player]);

    /**
     * Set the audio to fade in
     */
    // const fadeInAudio = (audioElement = {}, duration = 28) => {
    //   if (usePreviewModalStore.getState().wasOpen) return;
    //   requestRef.current = requestAnimationFrame(() => {
    //     let i = 0;
    //     // Reset the player state
    //     audioElement?.unMute();
    //     audioElement?.setVolume(0);
    //     let intervalId = setInterval(() => {
    //       let updatedVolume = (maxVolume / duration) * i;
    //       audioElement?.setVolume(updatedVolume);
    //       // Iterate the volume up from zero (muted)
    //       if (++i >= duration) {
    //         cancelAnimationFrame(requestRef.current);
    //         clearInterval(intervalId);
    //         requestRef.current = 0;
    //         // Reset the player state
    //         audioElement?.unMute();
    //         audioElement?.setVolume(maxVolume);
    //       }
    //     }, duration);
    //   });
    // };

    /**
     * Set the audio to fade out
     */
    // const fadeOutAudio = (audioElement = {}, duration = 28) => {
    //   const currentVolume = audioElement?.getVolume();
    //   if (!audioIsEnabled() || currentVolume === 0) return;
    //   requestRef.current = requestAnimationFrame(() => {
    //     let i = 0.1;
    //     // Reset the player state
    //     audioElement?.unMute();
    //     audioElement?.setVolume(maxVolume);
    //     let intervalId = setInterval(() => {
    //       let newVolume = audioElement?.getVolume() - i;
    //       // Adjust volume down if still greater than zero (muted)
    //       if (newVolume >= 0) {
    //         audioElement?.setVolume(newVolume);
    //       } else {
    //         cancelAnimationFrame(requestRef.current);
    //         clearInterval(intervalId);
    //         requestRef.current = 0;
    //         // Reset the player state
    //         audioElement?.mute();
    //         audioElement?.setVolume(0);
    //       }
    //     }, duration);
    //   });
    // };

    /**
     * Toggle the player audio on / off
     */
    const toggleAudio = () => {
      audioIsEnabled() ? mute() : unMute();
    };

    /**
     * Handle the play event
     */
    const playVideo = useCallback(() => {
      if (player) {
        player.playVideo();
        audioIsEnabled() && unMute();
      }
    }, [player, audioIsEnabled, unMute]);

    /**
     * Handle the pause event
     */
    const pauseVideo = useCallback(() => {
      if (player) {
        player.pauseVideo();
        audioIsEnabled() && mute();
      }
    }, [player, audioIsEnabled, mute]);

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
      if (e.target) {
        setPlayer(e.target);
      }
    };

    /**
     * Listen for when the video is ready to play
     */
    useLayoutEffect(() => {
      let timerId;
      if (player) {
        player.playVideo();
        setTextIsAnimating(true);
        setVideoPlaybackError(false);
        timerId = setTimeout(() => setVideoCanPlayThrough(true), 1000);
      }
      return () => {
        player && player.destroy();
        timerId && clearTimeout(timerId);
      };
    }, [player]);

    /**
     * YouTube API state change event
     * @param {Object} e
     */
    const onPlayerStateChange = (e) => {
      if (!e?.data) {
        setVideoPlaybackError(true);
        setVideoCanPlayThrough(false);
      }
      if (e?.data === 1) audioIsEnabled() && unMute();
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
    useLayoutEffect(() => {
      videoCompleted && setVideoCanPlayThrough(false);
    }, [videoCompleted]);

    /**
     * Autoplay billbaord video on mount and play/pause when in and out of view
     */
    useLayoutEffect(() => {
      if (!videoCanPlayThrough || videoPlaybackError) return;
      if (inView && !shouldFreeze) {
        playVideo();
      } else {
        pauseVideo();
      }
    }, [
      inView,
      pauseVideo,
      playVideo,
      shouldFreeze,
      videoCanPlayThrough,
      videoPlaybackError,
    ]);

    /**
     * YouTube Player Component
     * @returns {JSX.Element}
     */
    const renderVideoPlayer = () => {
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
            className="relative h-full w-full overflow-hidden"
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
                      className="pointer-events-none relative h-full w-full overflow-hidden"
                    >
                      {renderVideoPlayer()}
                    </div>
                  </div>
                </div>
              )}
              <div className="motion-background-component bottom-layer full-screen">
                <div className="hero-image-wrapper">
                  <Image
                    priority={true}
                    layout="fill"
                    objectFit="cover"
                    className="hero static-image image-layer"
                    src={`https://image.tmdb.org/t/p/${"w1280" || "original"}${
                      model?.videoModel?.imageKey
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
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
  }
);

Billboard.displayName = "Billboard";
export default Billboard;
