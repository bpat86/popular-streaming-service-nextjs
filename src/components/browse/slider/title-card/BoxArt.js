import Image from "next/image";
import { forwardRef } from "react";

const BoxArt = forwardRef(({ alt = "", className, imageKey, onFocus }, ref) => {
  return (
    <Image
      layout="fill"
      objectFit="contain"
      className={className}
      onFocus={onFocus}
      src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
      alt={alt}
    />
  );
});

BoxArt.displayName = "BoxArt";
export default BoxArt;
