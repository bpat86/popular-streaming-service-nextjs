const Logo = ({ logos, title }) => {
  /**
   * Show the best fitted logo
   * @returns {String}
   */
  const getLogoFilePath = () => {
    if (!logos) return;
    const logo = logos?.find((logo) => logo?.iso_639_1 === "en") || logos[0];
    return logo?.file_path;
  };

  /**
   * Format the logo CSS style
   * @returns {String}
   */
  const getLogoAspectRatio = () => {
    if (!logos) return;
    const logo =
      logos?.filter((logo) => logo?.iso_639_1 === "en")[0] || logos[0];
    return logo?.aspect_ratio > 2 ? "wide" : "tall";
  };

  return (
    <>
      <span className="sr-only">{title} logo</span>
      {logos?.length ? (
        <img
          className={`title-logo ${
            getLogoAspectRatio() === "wide" ? "wide" : "tall"
          }`}
          src={`https://image.tmdb.org/t/p/w500${getLogoFilePath()}`}
          alt={title}
        />
      ) : (
        <div className="title-logo origin-bottom-left text-3xl lg:text-7xl text-white font-black leading-6 mt-auto">
          {title}
        </div>
      )}
    </>
  );
};

export default Logo;
