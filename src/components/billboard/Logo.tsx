import { IVideoModel } from "@/store/types";

type LogoProps = {
  logos: IVideoModel["logos"];
  title: IVideoModel["title"];
};

const Logo = ({ logos, title }: LogoProps) => {
  /**
   * Show the best fitted logo
   */
  const getLogoPath = (logos: LogoProps["logos"]) => {
    if (!logos) return;
    const logo =
      logos.filter(({ iso_639_1 }) => iso_639_1 === "en")[0] || logos[0];
    return logo.file_path;
  };

  /**
   * Format the logo CSS style
   */
  const getLogoAspectRatio = (logos: LogoProps["logos"]) => {
    if (!logos) return;
    const logo =
      logos.filter(({ iso_639_1 }) => iso_639_1 === "en")[0] || logos[0];
    return logo.aspect_ratio > 2 ? "wide" : "tall";
  };

  if (!logos || logos.length === 0) {
    return (
      <div className="title-logo mt-auto origin-bottom-left text-3xl font-black leading-6 text-white lg:text-7xl">
        {title}
      </div>
    );
  }

  return (
    <>
      <span className="sr-only">{title} logo</span>
      <picture className="flex">
        <img
          className={`title-logo ${
            getLogoAspectRatio(logos) === "wide" ? "wide" : "tall"
          }`}
          src={`https://image.tmdb.org/t/p/w500${getLogoPath(logos)}`}
          alt={title}
        />
      </picture>
    </>
  );
};

export default Logo;
