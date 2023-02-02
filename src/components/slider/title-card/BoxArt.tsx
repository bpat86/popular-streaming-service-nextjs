import Image from "next/image";
import { FocusEvent } from "react";

type BoxArtProps = {
  alt?: string;
  className?: string;
  imageKey: string;
  onFocus: (e: FocusEvent<HTMLDivElement>) => void;
};

const BoxArt = ({ alt = "", className, imageKey, onFocus }: BoxArtProps) => {
  return (
    <>
      <Image
        className={className}
        onFocus={onFocus}
        src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
        alt={alt}
        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        fill
      />
    </>
  );
};

export default BoxArt;
