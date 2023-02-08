import clsxm from "@/lib/clsxm";
import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

type LogoProps = {
  logos: IVideoModel["logos"];
  title: IVideoModel["title"];
};

const Logo = ({ logos, title }: LogoProps) => {
  /**
   * Show the best fitted logo
   */
  const getLogoPath = (logos: IVideoModel["logos"]) => {
    if (!logos) return;
    const logo =
      logos.filter(({ iso_639_1 }) => iso_639_1 === "en")[0] || logos[0];
    return logo.file_path;
  };

  /**
   * Format the logo CSS style
   */
  const getLogoAspectRatio = (logos: IVideoModel["logos"]) => {
    if (!logos) return;
    const logo =
      logos.filter(({ iso_639_1 }) => iso_639_1 === "en")[0] || logos[0];
    return logo.aspect_ratio > 2 ? "wide" : "tall";
  };

  /**
   * If there is no logo, show the title
   */
  if (!logos || logos.length === 0) {
    return (
      <>
        <span className="sr-only">{title} logo</span>
        <MotionDivWrapper
          inherit={false}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="title-treatment-logo mt-auto mb-4 origin-bottom-left text-2xl font-bold leading-tight"
        >
          {title}
        </MotionDivWrapper>
      </>
    );
  }

  /**
   * If there is a logo, show it
   */
  return (
    <MotionDivWrapper
      inherit={false}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span className="sr-only">{title} logo</span>
      <picture>
        <img
          className={clsxm("title-treatment-logo", [
            getLogoAspectRatio(logos) === "wide" ? "wide" : "tall",
          ])}
          src={`https://image.tmdb.org/t/p/w500${getLogoPath(logos)}`}
          alt={title || ""}
        />
      </picture>
    </MotionDivWrapper>
  );
};

export default Logo;
