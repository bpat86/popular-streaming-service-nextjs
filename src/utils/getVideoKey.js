export const getVideoKey = ({ videos } = {}) => {
  return (
    videos?.results
      ?.filter(({ type, name }) =>
        type.includes("Trailer")
          ? (type.includes("Trailer") && name.includes("Season")) ||
            name.includes("Trailer")
          : type.includes("Trailer") ||
            type.includes("Teaser") ||
            type.includes("Opening Credits")
      )
      ?.find(
        (video) =>
          video?.iso_3166_1?.includes("US") && video?.site?.includes("YouTube")
      )?.key ||
    videos?.results.findLast((video) => video)?.key ||
    null
  );
};
