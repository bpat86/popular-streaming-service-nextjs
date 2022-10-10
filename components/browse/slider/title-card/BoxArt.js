import { forwardRef } from "react";

const BoxArt = forwardRef(({ alt = "", className, imageKey }, ref) => {
  return (
    <img
      ref={ref}
      className={className}
      src={`https://image.tmdb.org/t/p/${"w780" || "original"}${imageKey}`}
      alt={alt}
    />
  );
});

BoxArt.displayName = "BoxArt";
export default BoxArt;
