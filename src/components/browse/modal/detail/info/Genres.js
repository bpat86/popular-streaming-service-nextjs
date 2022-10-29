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
        <div className="my-1 flex animate-pulse items-center justify-center space-x-4 text-center">
          <dl className="flex flex-grow flex-col items-center justify-center">
            <dd className="h-4 w-16 rounded-xl bg-gray-700"></dd>
          </dl>
          <dl className="flex flex-grow flex-col items-center justify-center">
            <dd className="h-4 w-20 rounded-xl bg-gray-700"></dd>
          </dl>
          <dl className="flex flex-grow flex-col items-center justify-center">
            <dd className="h-4 w-10 rounded-xl bg-gray-700"></dd>
          </dl>
        </div>
      )}
    </div>
  );
};

export default Genres;
