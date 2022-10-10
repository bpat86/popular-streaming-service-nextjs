const Genres = ({ genres }) => {
  return genres ? (
    <div className="genres text-xs sm:text-sm xl:text-base text-gray-200 leading-snug">
      {genres?.slice(0, 3)?.map((genre) => (
        <div
          key={genre?.name}
          className="genre-separator text-[0.5rem] sm:text-[0.6rem] md:text-[0.8rem] 2xl:text-[0.9rem] font-medium tracking-wide leading-snug overflow-x-auto"
        >
          {genre?.name}
        </div>
      ))}
    </div>
  ) : (
    <div className="genres animate-pulse">
      <div className="genre-separator flex items-center justify-start space-x-4 text-center mt-2">
        <dl className="flex-grow flex flex-col items-center justify-center">
          <dd className="bg-gray-700 w-8 h-3 rounded-xl"></dd>
        </dl>
        <dl className="flex-grow flex flex-col items-center justify-center">
          <dd className="bg-gray-700 w-14 h-3 rounded-xl"></dd>
        </dl>
        <dl className="flex-grow flex flex-col items-center justify-center">
          <dd className="bg-gray-700 w-12 h-3 rounded-xl"></dd>
        </dl>
      </div>
    </div>
  );
};

export default Genres;
