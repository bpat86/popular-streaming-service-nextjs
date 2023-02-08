import { forwardRef, LegacyRef } from "react";
import {
  default as ReactPlayer,
  default as YouTubePlayer,
} from "react-player/youtube";

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
  onStart: () => void;
  onReady: () => void;
  onEnded: () => void;
  onError: (error: any) => void;
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
      // loaded,
      // duration,
      onStart,
      onBuffer,
      onReady,
      // onError,
      onPlay,
      onPause,
      onEnded,
      onError,
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
    if (!canPlay || !videoId) return <></>;
    // Render the player
    return (
      <ReactPlayer
        ref={playerRef}
        width="100%"
        height="100%"
        id={videoId}
        url={videoUrl}
        className="relative h-full w-full overflow-hidden"
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
        onError={onError}
        onDuration={onDuration}
      />
    );
  }
);

export default VideoPlayer;
