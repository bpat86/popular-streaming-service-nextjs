import Image from "next/image";
import { useRouter } from "next/router";
import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import YouTubePlayer from "react-player/youtube";
import { shallow } from "zustand/shallow";

import Info from "@/components/billboard/Info";
import InteractionContext from "@/context/InteractionContext";
import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import clsxm from "@/lib/clsxm";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { IModel } from "@/store/types";

import MediaControls from "./buttons/MediaControls";
import VideoPlayer from "./player/VideoPlayer";

type BillboardProps = {
  model: IModel;
  inView: boolean;
  shouldFreeze: boolean;
};

const Billboard = forwardRef<HTMLDivElement, BillboardProps>(
  ({ model, inView, shouldFreeze }, ref) => {
    const billboardInViewRef = ref as MutableRefObject<HTMLDivElement>;
    const infoRef = useRef<HTMLDivElement>(null);
    const { enableWatchMode } = useContext(InteractionContext);
    const wasOpen = usePreviewModalStore((state) => state.wasOpen, shallow);
    const isDetailModal = usePreviewModalStore(
      (state) => state.isDetailModal,
      shallow
    );

    const [textIsAnimating, setTextIsAnimating] = useState<boolean>(false);
    // const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
    const router = useRouter();
    // Player state
    const playerRef = useRef<YouTubePlayer>(null);
    const [playerError, setPlayerError] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(true);
    const [played, setPlayed] = useState<number>(0);
    const [videoStarted, setVideoStarted] = useState<boolean>(false);
    const [videoBuffering, setVideoBuffering] = useState<boolean>(false);
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

    const handleTogglePlaying = () => {
      setPlaying(!playing);
    };

    const handleOnStop = () => {
      setPlaying(false);
    };

    const toggleAudio = () => {
      setMuted(!muted);
    };

    const handleOnReady = () => {
      setPlayerError(false);
      setTextIsAnimating(true);
      setVideoCanPlayThrough(true);
    };

    const handleOnStart = () => {
      setVideoBuffering(false);
      setVideoStarted(true);
    };

    const handleOnBuffer = () => {
      setVideoBuffering(true);
    };

    const handleOnError = useCallback(() => {
      setPlayerError(true);
    }, []);

    const handleOnPlay = useCallback(() => {
      setPlaying(true);
    }, []);

    const handleOnPause = useCallback(() => {
      setPlaying(false);
    }, []);

    const handleOnEnded = () => {
      setPlaying(false);
      setVideoCompleted(true);
      setVideoHasPlayedAtLeastOnce(true);
      setTextIsAnimating(false);
    };

    const handleOnDuration = (duration: number) => {
      setDuration(duration);
    };

    const replayVideo = () => {
      setPlayed(0);
      setPlaying(true);
      setVideoCompleted(false);
      setTextIsAnimating(true);
    };

    const audioEnabled = () => {
      return muted;
    };

    /**
     * Redirect to watch mode screen
     */
    const handleWatchNow = ({
      id,
      mediaType,
    }: {
      id: number;
      mediaType: string;
    }) => {
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
     * Get video playback information
     */
    const getVideoPlayback = () => {
      if (!playerRef.current || videoCompleted) return undefined;
      return {
        start: playerRef.current.getCurrentTime(),
        length: playerRef.current.getDuration(),
      };
    };

    /**
     * Autoplay billbaord video on mount and play/pause when in and out of view
     */
    useLayoutEffect(() => {
      if (!playerRef.current || !videoCanPlayThrough || playerError) return;
      if (inView && !shouldFreeze && !videoCompleted) {
        handleOnPlay();
      } else {
        handleOnPause();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      inView,
      handleOnPause,
      handleOnPlay,
      shouldFreeze,
      videoCanPlayThrough,
      videoCompleted,
      playerError,
    ]);

    return (
      <span ref={billboardInViewRef} className="billboard-animations-container">
        <div className="billboard-row">
          <div className="billboard">
            <div
              className={clsxm("billboard-motion dismiss-mask", [
                !isDetailModal() &&
                !wasOpen &&
                !videoCompleted &&
                !videoBuffering &&
                videoStarted &&
                videoCanPlayThrough
                  ? "dismiss-static"
                  : "",
              ])}
            >
              {!videoCompleted && model?.videoModel?.videoKey && (
                <div className="youtube-video-wrapper" tabIndex={-1}>
                  <div className="video-container pointer-events-none relative h-full w-full overflow-hidden">
                    <VideoPlayer
                      ref={playerRef}
                      canPlay={!!model.videoModel.videoKey}
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
                      videoId={model.videoModel.videoKey}
                    />
                  </div>
                </div>
              )}

              <div className="motion-background-component bottom-layer full-screen">
                <div className="hero-image-wrapper">
                  <Image
                    fill
                    priority={true}
                    className="hero static-image image-layer"
                    src={`https://image.tmdb.org/t/p/${"w1280" || "original"}${
                      model?.videoModel?.imageKey
                    }`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt={model?.videoModel?.title || ""}
                  />
                  <div className="absolute -inset-px bg-zinc-900/40" />
                  <div className="absolute -inset-px bg-gradient-to-b from-transparent via-transparent  to-zinc-900" />
                  <div className="absolute -inset-px hidden bg-gradient-to-l from-transparent via-transparent to-zinc-900 lg:block" />
                  <div className="trailer-vignette vignette-layer" />
                  <div className="hero-vignette vignette-layer" />
                </div>
                <div className="embedded-components button-layer">
                  <AnimatePresenceWrapper>
                    {!(isDetailModal() && !videoCompleted) && videoStarted && (
                      <MediaControls
                        audioEnabled={audioEnabled()}
                        replayVideo={replayVideo}
                        title={model?.videoModel?.title}
                        toggleAudio={toggleAudio}
                        videoPlaying={!videoCompleted && videoCanPlayThrough}
                        videoCompleted={
                          videoCompleted && videoHasPlayedAtLeastOnce
                        }
                      />
                    )}
                  </AnimatePresenceWrapper>
                </div>
              </div>
            </div>
            <div className="fill-container">
              <Info
                ref={infoRef}
                canAnimate={
                  !videoCompleted &&
                  videoStarted &&
                  videoCanPlayThrough &&
                  textIsAnimating
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
