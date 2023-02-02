import { memo } from "react";

import { IVideoModel } from "@/store/types";

type GenresProps = {
  genres: IVideoModel["genres"];
};

const Genres = memo(({ genres }: GenresProps) => {
  return genres ? (
    <div className="genres text-xs leading-snug text-zinc-200 sm:text-sm xl:text-base">
      {genres?.slice(0, 3)?.map((genre) => (
        <div
          key={genre?.name}
          className="genre-separator overflow-x-auto text-[0.5rem] font-medium leading-snug tracking-wide sm:text-[0.6rem] md:text-[0.8rem] 2xl:text-[0.9rem]"
        >
          {genre?.name}
        </div>
      ))}
    </div>
  ) : (
    <div className="genres animate-pulse">
      <div className="genre-separator mt-2 flex items-center justify-start space-x-4 text-center">
        <dl className="flex flex-grow flex-col items-center justify-center">
          <dd className="h-3 w-8 rounded-xl bg-zinc-700"></dd>
        </dl>
        <dl className="flex flex-grow flex-col items-center justify-center">
          <dd className="h-3 w-14 rounded-xl bg-zinc-700"></dd>
        </dl>
        <dl className="flex flex-grow flex-col items-center justify-center">
          <dd className="h-3 w-12 rounded-xl bg-zinc-700"></dd>
        </dl>
      </div>
    </div>
  );
});

export default Genres;