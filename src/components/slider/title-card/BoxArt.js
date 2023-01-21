import Image from "next/image";

const BoxArt = ({ alt = "", className, imageKey, onFocus }) => {
  return (
    <Image
      className={className}
      onFocus={onFocus}
      src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
      alt={alt}
      fill
    />
  );
};

export default BoxArt;
