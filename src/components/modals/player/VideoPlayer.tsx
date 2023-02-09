import { forwardRef, LegacyRef } from "react";
import {
  default as ReactPlayer,
  default as YouTubePlayer,
} from "react-player/youtube";

import { AnimatePresenceWrapper } from "@/lib/AnimatePresenceWrapper";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

type VideoPlayerProps = {
  canPlay: boolean;
  controls: boolean;
  duration?: number;
  light: boolean;
  loaded?: number;
  loop: boolean;
  muted: boolean;
  onDuration: (duration: number) => void;
  onBuffer: () => void;
  onReady: () => void;
  onStart: () => void;
  onEnded: () => void;
  onPause: () => void;
  onPlay: () => void;
  played?: number;
  playbackRate?: number;
  playing: boolean;
  volume: number;
  videoId: string;
};

const VideoPlayer = forwardRef(
  (
    {
      playing,
      controls,
      light,
      muted,
      loop,
      onBuffer,
      onReady,
      onStart,
      onPlay,
      onPause,
      onEnded,
      onDuration,
      playbackRate,
      canPlay,
      volume,
      videoId,
    }: VideoPlayerProps,
    ref
  ) => {
    const playerRef = ref as LegacyRef<YouTubePlayer>;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    if (!videoId) return <></>;
    // Render the player
    return (
      <AnimatePresenceWrapper>
        {canPlay && (
          <MotionDivWrapper
            inherit={false}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 1,
                duration: 0.6,
              },
            }}
            exit={{ opacity: 0, transition: { duration: 0.067 } }}
            className="absolute inset-0 h-full w-full overflow-hidden"
          >
            <div className="relative h-full w-full overflow-hidden">
              <ReactPlayer
                ref={playerRef}
                width="100%"
                height="100%"
                id={videoId}
                url={videoUrl}
                className="absolute inset-0 h-full w-full bg-black"
                title=""
                playing={playing}
                controls={controls}
                light={light}
                loop={loop}
                playbackRate={playbackRate}
                volume={volume}
                muted={muted}
                onReady={onReady}
                onStart={onStart}
                onPlay={onPlay}
                onPause={onPause}
                onBuffer={onBuffer}
                onEnded={onEnded}
                onDuration={onDuration}
              />
            </div>
          </MotionDivWrapper>
        )}
      </AnimatePresenceWrapper>
    );
  }
);

export default VideoPlayer;
