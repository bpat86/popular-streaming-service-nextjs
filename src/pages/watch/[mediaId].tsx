import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { default as YouTubePlayer } from "react-player/youtube";

import VideoPlayer from "@/components/watch/VideoPlayer";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import useTitle from "@/middleware/useTitle";
import useInteractionStore from "@/store/InteractionStore";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { getVideoKey } from "@/utils/getVideoKey";

const WatchMediaPage = () => {
  const router = useRouter();
  const { query } = router;
  const { id, mediaId, mediaType } = query; // mediaId: 'movie-648579'

  const queryType = mediaId?.toString()?.split("-")[0];
  const queryId = mediaId?.toString()?.split("-")[1];
  // Fetch media title data
  const { fetchingTitle, titleData } = useTitle({
    id: id?.toString() || queryId || "",
    type: mediaType?.toString() || queryType || "",
  });

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
  const [muted, setMuted] = useState<boolean>(false);
  const [light, setLight] = useState<boolean>(false);
  const [controls, setControls] = useState<boolean>(true);
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

  const handleOnError = () => {
    setPlayerError(true);
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

  /**
   * Close the preview modal
   */
  const closeModal = useCallback((videoId: string) => {
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
  }, []);

  /**
   * Close all preview modals
   */
  const closeAllModals = useCallback(() => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    previewModalStateById &&
      Object.values(previewModalStateById)
        .filter(({ isOpen }) => isOpen)
        .forEach(({ videoId }) => {
          videoId && closeModal(videoId);
        });
  }, [closeModal]);

  /**
   * Close the Preview Modal when pressing the escape key
   */
  const handleEscKeydown = useCallback(
    ({ key }: { key: string }) => {
      if (key === "Escape") {
        router.back();
        closeAllModals();
        useInteractionStore.getState().setWatchModeEnabled(false);
      }
    },
    [router, closeAllModals]
  );

  /**
   * Handle event listeners
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", handleEscKeydown);
    return () => {
      window.removeEventListener("keydown", handleEscKeydown);
    };
  }, [handleEscKeydown]);

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
        useInteractionStore.getState().setWatchModeEnabled(false);
        return true;
      }
    });
    return () => {
      router.beforePopState(() => true);
    };
  }, [router, closeAllModals]);

  /**
   * YouTube Player Component
   */
  const renderVideoPlayer = () => {
    const videoKey = getVideoKey(titleData?.data);
    if (!videoKey) return <></>;

    return (
      <div className="watch-video-player-view">
        <div className="video-canvas-container">
          <VideoPlayer
            ref={playerRef}
            canPlay={!!videoKey}
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
            onError={handleOnError}
            onDuration={handleOnDuration}
            videoId={videoKey}
          />
        </div>
      </div>
    );
  };

  return (
    <MotionDivWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="watch-video"
    >
      {!fetchingTitle && titleData?.data && renderVideoPlayer()}
    </MotionDivWrapper>
  );
};

export default WatchMediaPage;
