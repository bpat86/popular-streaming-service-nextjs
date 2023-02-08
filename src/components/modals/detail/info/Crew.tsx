import Image from "next/image";

import { IVideoModel } from "@/store/types";

type CrewProps = {
  crew: IVideoModel["crew"];
  isLoading: boolean;
};

const Crew = ({ crew, isLoading }: CrewProps) => {
  /**
   * Generate a random number between two numbers
   */
  function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  if (!isLoading && !crew?.length) {
    return (
      <div className="my-8">
        <div className="mb-6 text-base font-semibold leading-snug tracking-wide text-zinc-400">
          Crew
        </div>
        <div className="mx-auto">
          <p className="font-medium leading-tight text-zinc-300">
            No crew information available.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-8">
        <div className="mb-6 text-base font-semibold leading-snug tracking-wide text-zinc-400">
          Crew
        </div>
        <ul
          role="list"
          className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-8 xl:grid-cols-6"
        >
          {Array.from(Array(randomIntFromInterval(10, 18)))?.map((_, idx) => (
            <li key={idx} className="animate-pulse">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-zinc-700"></div>
                <div className="space-y-4">
                  <div className="text-[0.65rem] font-medium leading-tight sm:text-[0.8rem] sm:leading-4">
                    <dl className="my-2 flex flex-grow flex-col items-center justify-center">
                      <dd className="h-2 w-16 rounded-xl bg-zinc-600"></dd>
                    </dl>
                    <dl className="mt-2 flex flex-grow flex-col items-center justify-center">
                      <dd className="h-2 w-20 rounded-xl bg-zinc-800"></dd>
                    </dl>
                    <dl className="mt-2 flex flex-grow flex-col items-center justify-center">
                      <dd className="h-2 w-14 rounded-xl bg-zinc-800"></dd>
                    </dl>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!isLoading && crew?.length) {
    return (
      <div className="my-8">
        <div className="mb-6 border-t-2 border-zinc-800 pt-8 text-base font-semibold leading-snug tracking-wide text-zinc-400">
          Crew
        </div>
        <ul
          role="list"
          className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-8 xl:grid-cols-6"
        >
          {crew?.slice(0, 20)?.map((person, idx) => (
            <li key={`${person.original_name}-${idx}`}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-zinc-700">
                  <>
                    {!isLoading && person.profile_path && (
                      <Image
                        className="mx-auto h-auto max-w-full"
                        src={`https://image.tmdb.org/t/p/w154/${person.profile_path}`}
                        width={120}
                        height={120}
                        loading="lazy"
                        alt=""
                      />
                    )}
                    {person.original_name && (
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-zinc-700 text-2xl font-medium text-zinc-500">
                        {person.original_name.slice(0, 1)}
                      </div>
                    )}
                  </>
                </div>
                {person.original_name && (
                  <div className="space-y-4">
                    <div className="text-[0.65rem] font-medium leading-tight sm:text-[0.8rem] sm:leading-4">
                      <h3 className="pb-1 font-semibold">
                        {person.original_name}
                      </h3>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <></>;
};

export default Crew;
