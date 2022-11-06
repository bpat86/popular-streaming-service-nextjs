import Image from "next/image";

const Cast = ({ cast, isLoading }) => {
  /**
   * Generate a random number between two numbers
   * @param {Number} min
   * @param {Number} max
   * @returns
   */
  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return cast && cast.length > 0 && !isLoading ? (
    <div className="my-8">
      <div className="mb-6 text-base font-semibold leading-snug tracking-wide text-gray-400">
        Cast
      </div>
      <ul
        role="list"
        className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-8 xl:grid-cols-6"
      >
        {cast?.map((person, idx) => (
          <li key={`${person.original_name}-${idx}`}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-700">
                {!isLoading && person.profile_path ? (
                  <Image
                    layout="fill"
                    objectFit="cover"
                    className="mx-auto h-auto max-w-full"
                    src={`https://image.tmdb.org/t/p/w154/${person.profile_path}`}
                    alt=""
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-700 text-2xl font-medium text-gray-500">
                    {person.original_name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="text-[0.65rem] font-medium leading-tight sm:text-[0.8rem] sm:leading-4">
                  <h3 className="pb-1 font-semibold">{person.original_name}</h3>
                  <p className="text-gray-400">{person.character}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : (
    <div className="my-8">
      <div className="mb-6 text-base font-semibold leading-snug tracking-wide text-gray-400">
        Cast
      </div>
      <ul
        role="list"
        className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-8 xl:grid-cols-6"
      >
        {Array.from(Array(randomIntFromInterval(10, 18)))?.map((item, idx) => (
          <li key={idx} className="animate-pulse">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-700"></div>
              <div className="space-y-4">
                <div className="text-[0.65rem] font-medium leading-tight sm:text-[0.8rem] sm:leading-4">
                  <dl className="my-2 flex flex-grow flex-col items-center justify-center">
                    <dd className="h-2 w-16 rounded-xl bg-gray-600"></dd>
                  </dl>
                  <dl className="mt-2 flex flex-grow flex-col items-center justify-center">
                    <dd className="h-2 w-20 rounded-xl bg-gray-800"></dd>
                  </dl>
                  <dl className="mt-2 flex flex-grow flex-col items-center justify-center">
                    <dd className="h-2 w-14 rounded-xl bg-gray-800"></dd>
                  </dl>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cast;
