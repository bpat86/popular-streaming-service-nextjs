import Image from "next/image";
import { FocusEvent } from "react";

import clsxm from "@/lib/clsxm";

type BoxArtProps = {
  alt?: string;
  className: string;
  imageKey: string;
  onFocus: (e: FocusEvent<HTMLDivElement>) => void;
  priority: boolean;
};

const BoxArt = ({
  alt = "",
  className,
  imageKey,
  onFocus,
  priority,
}: BoxArtProps) => {
  return (
    <Image
      className={clsxm(className)}
      onFocus={onFocus}
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
