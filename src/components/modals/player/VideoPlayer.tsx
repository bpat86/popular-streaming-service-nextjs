import { forwardRef, LegacyRef } from "react";
import {
  default as ReactPlayer,
  default as YouTubePlayer,
} from "react-player/youtube";

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
  onReady: () => void;
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
      loaded,
      duration,
      onReady,
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
    // Don't render the player while the modal is animating
    if (!canPlay) return <></>;
    // Render the player
    return (
      <MotionDivWrapper
        inherit={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1, duration: 0.6 } }}
        exit={{ opacity: 0 }}
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
            onStart={() => console.log("onStart")}
            onPlay={onPlay}
            onPause={onPause}
            onBuffer={() => console.log("onBuffer")}
            onSeek={(e) => console.log("onSeek", e)}
            onEnded={onEnded}
            onError={(e) => console.log("onError", e)}
            onDuration={onDuration}
          />
        </div>
      </MotionDivWrapper>
    );
  }
);

export default VideoPlayer;
