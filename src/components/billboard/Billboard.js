import Image from "next/image";
import { useRouter } from "next/router";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import YouTube from "react-youtube";
import shallow from "zustand/shallow";

import Info from "@/components/billboard/Info";
import InteractionContext from "@/context/InteractionContext";

import usePreviewModalStore from "@/stores/PreviewModalStore";

import MediaControls from "./buttons/MediaControls";

const Billboard = forwardRef(
  ({ model, inView, shouldFreeze }, billboardInViewRef) => {
    const { enableWatchMode } = useContext(InteractionContext);

    const wasOpen = usePreviewModalStore((state) => state.wasOpen, shallow);
    const isDetailModal = usePreviewModalStore(
      (state) => state.isDetailModal,
      shallow
    );

    // const requestRef = useRef(0);
    const playerRef = useRef();
    const infoRef = useRef();

    const router = useRouter();

    /**
     * Player state
     */
    const [player, setPlayer] = useState(undefined);
    // const [maxVolume, setMaxVolume] = useState(50);
    const [videoPlaybackError, setVideoPlaybackError] = useState(false);
    const [videoCanPlayThrough, setVideoCanPlayThrough] = useState(false);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
      useState(false);
    const [textIsAnimating, setTextIsAnimating] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);

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
     * Toggle the player audio on / off
     */
    const toggleAudio = () => {
      audioIsEnabled() ? mute() : unMute();
    };

    /**
     * Handle the play event
     */
    const playVideo = useCallback(() => {
      if (player?.getPlayerState() === 2) {
        player?.playVideo();
        audioIsEnabled() && unMute();
      }
    }, [player, audioIsEnabled, unMute]);

    /**
     * Handle the pause event
     */
    const pauseVideo = useCallback(() => {
      if (player?.getPlayerState() === 1) {
        player?.pauseVideo();
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
      setPlayer(undefined);
    };

    /**
     * YouTube API event for when the player is loaded.
     * Video won't autoplay unless muted.
     * @param {Object} e
     * @returns
     */
    const onReady = (e) => {
      e.target.playVideo();
      setPlayer(e.target);
    };

    /**
     * YouTube API state change event
     * @param {Object} e
     */
    const onStateChange = (e) => {
      if (e.data === 1) {
        setVideoPlaybackError(false);
        setTextIsAnimating(true);
        setTimeout(() => setVideoCanPlayThrough(true), 1000);
        audioIsEnabled() && unMute();
      }
    };

    /**
     * YouTube API event for when the video ends
     */
    const onEnd = () => {
      !videoCompleted && handleVideoCompleted();
    };

    /**
     * Set error if YouTube video returns an error
     * @param {obj} e
     */
    const onError = (e) => {
      if (e.data === 150 || e.data === 100 || e.data === 101 || e === null) {
        setVideoCanPlayThrough(false);
        setVideoPlaybackError(true);
      }
    };

    /**
     * Get video playback information
     */
    const getVideoPlayback = () => {
      if (!player || videoCompleted) return undefined;
      return {
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
      if (!player || !videoCanPlayThrough || videoPlaybackError) return;
      if (inView && !shouldFreeze && !videoCompleted) {
        playVideo();
      } else {
        pauseVideo();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      inView,
      pauseVideo,
      playVideo,
      shouldFreeze,
      videoCanPlayThrough,
      videoCompleted,
      videoPlaybackError,
    ]);

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

    /**
     * YouTube Player Component
     * @returns {JSX.Element}
     */
    const renderVideoPlayer = () => {
      const videoKey = model?.videoModel?.videoKey;
      // Render the YouTube player
      if (videoKey)
        return (
          <YouTube
            className="relative h-full w-full overflow-hidden"
            id={videoKey}
            loading="lazy"
            onEnd={onEnd}
            onError={onError}
            onReady={onReady}
            onStateChange={onStateChange}
            opts={defaultOpts}
            title={null}
            videoId={videoKey}
          />
        );
      return <></>;
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
              }`}
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
