import Image from "next/image";

import clsxm from "@/lib/clsxm";

type BoxArtProps = {
  alt?: string;
  imageKey: string;
  isDisliked?: boolean;
  priority: boolean;
};

const BoxArt = ({ alt = "", imageKey, isDisliked, priority }: BoxArtProps) => {
  return (
    <div
      className={clsxm("boxart-size-16x9 boxart-rounded relative bg-zinc-800", [
        isDisliked && "grayscale",
      ])}
    >
      {/* Only visible when the title is disliked */}
      {isDisliked && (
        <div className="title-treatment-wrapper absolute inset-0 z-1 select-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0 m-2 h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
          </svg>
        </div>
      )}
      <Image
        className="boxart-image"
        src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
        alt={alt}
        sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
        priority={priority}
        fill
      />
    </div>
  );
};

export default BoxArt;
