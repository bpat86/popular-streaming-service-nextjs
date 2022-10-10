const Genres = (props) => {
  const { genres } = props;

  return (
    <div className="genres mt-1 mb-4">
      {genres ? (
        genres?.slice(0, 3).map((genre) => (
          <div
            key={genre.name}
            className="genre-separator text-base font-medium leading-snug tracking-wide"
          >
            {genre.name}
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center space-x-4 text-center my-1 animate-pulse">
          <dl className="flex-grow flex flex-col items-center justify-center">
            <dd className="bg-gray-700 w-16 h-4 rounded-xl"></dd>
          </dl>
          <dl className="flex-grow flex flex-col items-center justify-center">
            <dd className="bg-gray-700 w-20 h-4 rounded-xl"></dd>
          </dl>
          <dl className="flex-grow flex flex-col items-center justify-center">
            <dd className="bg-gray-700 w-10 h-4 rounded-xl"></dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default Genres;
