import Image from "next/image";

const BoxArt = ({ alt = "", className, imageKey, onFocus }) => {
  return (
    <Image
      priority={true}
      layout="fill"
      objectFit="contain"
      className={className}
      onFocus={onFocus}
      src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
      alt={alt}
    />
  );
};

export default BoxArt;
