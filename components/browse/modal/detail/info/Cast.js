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
      <div className="text-base font-semibold leading-snug tracking-wide text-gray-400 mb-6">
        Cast
      </div>
      <ul
        role="list"
        className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-8 xl:grid-cols-6"
      >
        {cast?.map((person, idx) => (
          <li key={`${person.original_name}-${idx}`}>
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex items-center justify-center w-14 h-14 bg-gray-700 rounded-full overflow-hidden">
                {!isLoading && person.profile_path ? (
                  <img
                    className={`mx-auto max-w-full h-auto`}
                    src={`https://image.tmdb.org/t/p/w154/${person.profile_path}`}
                    alt=""
                  />
                ) : (
                  <div className="flex items-center justify-center w-14 h-14 bg-gray-700 text-gray-500 text-2xl font-medium rounded-full overflow-hidden">
                    {person.original_name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="text-[0.65rem] leading-tight sm:text-[0.8rem] font-medium sm:leading-4">
                  <h3 className="font-semibold pb-1">{person.original_name}</h3>
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
      <div className="text-base font-semibold leading-snug tracking-wide text-gray-400 mb-6">
        Cast
      </div>
      <ul
        role="list"
        className="mx-auto grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:gap-x-6 lg:max-w-5xl lg:gap-x-8 lg:gap-y-8 xl:grid-cols-6"
      >
        {Array.from(Array(randomIntFromInterval(10, 18)))?.map((item, idx) => (
          <li key={idx} className="animate-pulse">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="flex items-center justify-center w-14 h-14 bg-gray-700 rounded-full overflow-hidden"></div>
              <div className="space-y-4">
                <div className="text-[0.65rem] leading-tight sm:text-[0.8rem] font-medium sm:leading-4">
                  <dl className="flex-grow flex flex-col items-center justify-center my-2">
                    <dd className="bg-gray-600 w-16 h-2 rounded-xl"></dd>
                  </dl>
                  <dl className="flex-grow flex flex-col items-center justify-center mt-2">
                    <dd className="bg-gray-800 w-20 h-2 rounded-xl"></dd>
                  </dl>
                  <dl className="flex-grow flex flex-col items-center justify-center mt-2">
                    <dd className="bg-gray-800 w-14 h-2 rounded-xl"></dd>
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
