import Image from "next/image";

type BoxArtProps = {
  alt?: string;
  className: string;
  imageKey: string;
  priority: boolean;
};

const BoxArt = ({ alt = "", className, imageKey, priority }: BoxArtProps) => {
  return (
    <Image
      className={className}
      src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
      alt={alt}
      sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
      priority={priority}
      fill
    />
  );
};

export default BoxArt;
