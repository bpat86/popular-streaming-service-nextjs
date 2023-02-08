import { IVideoModel } from "@/store/types";

type GenresProps = {
  genres: IVideoModel["genres"];
  isLoading: boolean;
};

const Genres = ({ genres, isLoading }: GenresProps) => {
  if (!isLoading && !genres?.length) return <></>;

  if (isLoading) {
    return (
      <div className="my-1 mb-6 flex animate-pulse items-center justify-start space-x-4 text-center">
        <dl className="flex flex-col items-center justify-center">
          <dd className="h-4 w-16 rounded-xl bg-zinc-700"></dd>
        </dl>
        <dl className="flex flex-col items-center justify-center">
          <dd className="h-4 w-20 rounded-xl bg-zinc-700"></dd>
        </dl>
        <dl className="flex flex-col items-center justify-center">
          <dd className="h-4 w-10 rounded-xl bg-zinc-700"></dd>
        </dl>
      </div>
    );
  }

  if (genres?.length) {
    return (
      <div className="genres mt-1 mb-4">
        {genres.slice(0, 3).map(({ name }) => {
          return (
            <>
              {name && (
                <div
                  key={name}
                  className="genre-separator text-base font-medium leading-snug tracking-wide"
                >
                  {name}
                </div>
              )}
            </>
          );
        })}
      </div>
    );
  }

  return <></>;
};

export default Genres;
