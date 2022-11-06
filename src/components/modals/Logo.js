import MotionDivWrapper from "@/lib/MotionDivWrapper";

const Logo = ({ logos, title }) => {
  /**
   * Show the best fitted logo
   * @returns {String}
   */
  const getLogoPath = (logos) => {
    const logo = logos?.find(({ iso_639_1 }) => iso_639_1 === "en") || logos[0];
    return logo?.file_path;
  };

  /**
   * Format the logo CSS style
   * @returns {String}
   */
  const getLogoAspectRatio = (logos) => {
    const logo =
      logos?.filter(({ iso_639_1 }) => iso_639_1 === "en")[0] || logos[0];
    return logo?.aspect_ratio > 2 ? "wide" : "tall";
  };

  return (
    <>
      <span className="sr-only">{title} logo</span>
      {logos?.length ? (
        <picture>
          <img
            className={`title-treatment-logo ${
              getLogoAspectRatio(logos) === "wide" ? "wide" : "tall"
            }`}
            src={`https://image.tmdb.org/t/p/w500${getLogoPath(logos)}`}
            alt={title}
          />
        </picture>
      ) : (
        <MotionDivWrapper
          inherit={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.067, delay: 0.117, ease: "easeOut" }}
          className="title-treatment-logo mt-auto mb-4 origin-bottom-left text-3xl font-black leading-8"
        >
          {title}
        </MotionDivWrapper>
      )}
    </>
  );
};

export default Logo;
