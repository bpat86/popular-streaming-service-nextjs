export const getVideoKey = ({ videos } = {}) => {
  const relevantVideos = videos?.results?.filter((video) =>
    video?.type.includes("Trailer")
      ? (video?.type.includes("Trailer") && video?.name.includes("Season")) ||
        video?.name.includes("Trailer")
      : video?.type.includes("Trailer") ||
        video?.type.includes("Teaser") ||
        video?.type.includes("Opening Credits")
  );
  const mostRelevantVideo = relevantVideos?.find(
    (video) =>
      video?.iso_3166_1?.includes("US") && video?.site?.includes("YouTube")
  );
  return mostRelevantVideo?.key || videos?.results[0]?.key || null;
};
