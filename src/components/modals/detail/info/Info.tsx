import { forwardRef } from "react";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import Cast from "./Cast";
import Crew from "./Crew";
import Genres from "./Genres";
import Synopsis from "./Synopsis";

type InfoProps = {
  cast: IVideoModel["cast"];
  crew: IVideoModel["crew"];
  genres: IVideoModel["genres"];
  isDefaultModal: boolean;
  isLoading: boolean;
  synopsis: IVideoModel["overview"];
};

const Info = forwardRef<HTMLDivElement, InfoProps>(
  ({ cast, crew, genres, isDefaultModal, isLoading, synopsis }, infoRef) => {
    const getAnimationProps = () => {
      return isDefaultModal
        ? {
            inherit: false,
            initial: false,
          }
        : {
            inherit: false,
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { display: "none" },
            transition: {
              opacity: {
                duration: 0,
              },
              duration: 0,
            },
          };
    };

    return (
      <>
        <MotionDivWrapper
          {...getAnimationProps()}
          ref={infoRef}
          className="preview-modal info p-6 sm:px-12"
        >
          <div className="detail-modal-container flex w-full flex-col text-lg leading-snug text-zinc-400">
            <Genres genres={genres} isLoading={isLoading} />
          </div>
          <Synopsis synopsis={synopsis} />
          <Cast cast={cast} isLoading={isLoading} />
          <Crew crew={crew} isLoading={isLoading} />
        </MotionDivWrapper>
      </>
    );
  }
);

Info.displayName = "Info";
export default Info;
