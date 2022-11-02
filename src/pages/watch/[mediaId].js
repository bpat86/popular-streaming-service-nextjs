import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import YouTube from "react-youtube";

import InteractionContext from "@/context/InteractionContext";
import useTitle from "@/middleware/useTitle";
// Helpers
import { getVideoKey } from "@/utils/getVideoKey";

// Store
import usePreviewModalStore from "@/stores/PreviewModalStore";

const WatchMediaPage = () => {
  // Context
  const { disableWatchMode } = useContext(InteractionContext);
  // State
  const [player, setPlayer] = useState(null);
  const [videoPlaybackError, setVideoPlaybackError] = useState(false);
  const [videoCanPlayThrough, setVideoCanPlayThrough] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [videoHasPlayedAtLeastOnce, setVideoHasPlayedAtLeastOnce] =
    useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const router = useRouter();
  const { query } = router;
  const { id, mediaId, mediaType } = query; // mediaId: 'movie-648579'
  // Local vars
  const queryType = mediaId?.split("-")[0];
  const queryId = mediaId?.split("-")[1];
  const queryParams = {
    id: id ?? queryId,
    type: mediaType ?? queryType,
  };
  // Fetch media title data
  const { fetchingTitle, titleData } = useTitle(queryParams);

  /**
   * Close all preview modals
   */
  const closeAllModals = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    Object.values(previewModalStateById)
      .filter(({ isOpen }) => isOpen)
      .forEach(({ videoId }) => {
        closeModal(videoId);
      });
  };

  /**
   * Close the preview modal
   */
  const closeModal = (videoId) => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    const openModal = (
      undefined === previewModalStateById ? {} : previewModalStateById
    )[videoId];
    usePreviewModalStore.getState().setPreviewModalClose({
      ...openModal,
      closeWithoutAnimation: openModal.closeWithoutAnimation,
      videoId: videoId,
    });
    openModal.onPreviewModalClose && openModal.onPreviewModalClose();
  };

  /**
   * Handle event listeners
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", handleEscKeydown);
    return () => {
      window.removeEventListener("keydown", handleEscKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Close all modals before leaving the page
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        // Will run when leaving the current page; on back/forward actions
        // Add your logic here, like toggling the modal state
        closeAllModals();
        disableWatchMode();
        return true;
      }
    });
    return () => {
      router.beforePopState(() => true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]); // Add any state variables to dependencies array if needed.

  /**
   * Close the Preview Modal when pressing the escape key
   * @param {Object} e
   */
  const handleEscKeydown = (e) => {
    if (e.key === "Escape") {
      router.back();
      closeAllModals();
      disableWatchMode();
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
  // const disableAudio = () => {
  //   setAudioEnabled(false);
  // };

  /**
   * Return if audio is enabled globally
   * @returns {Boolean}
   */
  const audioIsEnabled = () => {
    return audioEnabled;
  };

  /**
   * The video can play through if the video hasn't completed and the video has no playback errors
   */
  useEffect(() => {
    if (videoPlaybackError ?? videoCompleted) {
      setVideoCanPlayThrough(false);
    }
  }, [videoPlaybackError, videoCompleted]);

  /**
   * Mute the player
   */
  // const mute = () => {
  //   if (player) {
  //     player.setVolume(0);
  //     player.mute();
  //     disableAudio();
  //   }
  // };

  /**
   * UnMute the player
   */
  const unMute = () => {
    if (player) {
      player.setVolume(50);
      player.unMute();
      enableAudio();
    }
  };

  /**
   * Toggle audio on / off
   */
  // const toggleAudio = () => {
  //   audioIsEnabled() ? mute() : unMute();
  // };

  /**
   * Reset animations and state before replaying the video
   */
  // const replayVideo = () => {
  //   setVideoCompleted(false);
  //   setVideoCanPlayThrough(true);
  //   unMute();
  // };

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
    if (!e) return;
    e.target?.setVolume(20);
    e.target?.playVideo();
    setPlayer(e.target);
  };

  /**
   * YouTube API state change event
   * @param {Object} e
   */
  const onPlayerStateChange = (e) => {
    if (!e) return;
    if (e.data) {
      setVideoPlaybackError(false);
      setVideoCanPlayThrough(true);
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
    if (
      e.data === 2 ??
      e.data === 150 ??
      e.data === 100 ??
      e.data === 101 ??
      e === null
    ) {
      setVideoPlaybackError(true);
      setVideoCanPlayThrough(false);
    }
  };

  /**
   * YouTube Player config
   * https://developers.google.com/youtube/player_parameters
   */
  const defaultOpts = {
    height: null,
    width: null,
    playerVars: {
      color: "white",
      autoplay: 1,
      controls: 1,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      cc_load_policy: 0, // Hide closed captions
      iv_load_policy: 3, // Hide the Video Annotations
      modestbranding: 1,
      playsinline: 1,
    },
  };

  /**
   * YouTube Player Component
   * @returns {JSX.Element}
   */
  const renderVideoPlayer = () => {
    const videoKey = getVideoKey(titleData?.data);
    if (!videoKey) return <></>;

    return (
      <div className="watch-video-player-view">
        <div
          data-uia="player"
          data-videoid={videoKey}
          className="video-canvas-container"
        >
          <YouTube
            title={null}
            className="video-canvas"
            iframeClassName="bg-black absolute w-full h-full object-cover"
            videoId={videoKey}
            data-videoid={videoKey}
            id={videoKey}
            opts={defaultOpts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onEnd={onPlayerEnd}
            onError={onPlayerError}
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="watch-video"
    >
      {!fetchingTitle && titleData?.data && renderVideoPlayer()}
    </motion.div>
  );
};

export default WatchMediaPage;
