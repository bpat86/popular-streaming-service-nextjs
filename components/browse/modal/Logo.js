import MotionDivWrapper from "@/components/motion/MotionDivWrapper";

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
      {logos?.length && getLogoFilePath() ? (
        <img
          className={`title-treatment-logo ${
            getLogoAspectRatio() === "wide" ? "wide" : "tall"
          }`}
          src={`https://image.tmdb.org/t/p/w500${getLogoFilePath()}`}
          alt={title}
        />
      ) : (
        <MotionDivWrapper
          inherit={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.067, delay: 0.117, ease: "easeOut" }}
          className="title-treatment-logo origin-bottom-left text-3xl font-black leading-8 mt-auto mb-4"
        >
          {title}
        </MotionDivWrapper>
      )}
    </>
  );
};

export default Logo;
