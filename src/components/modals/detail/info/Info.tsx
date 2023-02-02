import { forwardRef } from "react";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import Cast from "./Cast";
import Genres from "./Genres";
import Synopsis from "./Synopsis";

type InfoProps = {
  cast: IVideoModel["cast"];
  genres: IVideoModel["genres"];
  isDefaultModal: boolean;
  isLoading: boolean;
  synopsis: IVideoModel["overview"];
};

const Info = forwardRef<HTMLDivElement, InfoProps>(
  ({ cast, genres, isDefaultModal, isLoading, synopsis }, infoRef) => {
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
            exit: { opacity: 0 },
            transition: {
              opacity: {
                duration: 0.067,
              },
              duration: 0.067,
            },
          };
    };

    return (
      <MotionDivWrapper {...getAnimationProps()}>
        <div ref={infoRef} className="preview-modal info p-6 sm:px-12">
          <div className="detail-modal-container flex w-full flex-col text-lg leading-snug text-zinc-400">
            <Genres genres={genres} />
          </div>
          <Synopsis synopsis={synopsis} />
          <Cast cast={cast} isLoading={isLoading} />
        </div>
      </MotionDivWrapper>
    );
  }
);

Info.displayName = "Info";
export default Info;
