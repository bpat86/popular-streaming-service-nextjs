import { forwardRef } from "react";

import MotionDivWrapper from "@/lib/MotionDivWrapper";

import Cast from "./Cast";
import Genres from "./Genres";
import Synopsis from "./Synopsis";

const Info = forwardRef(
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
          <div className="detail-modal-container flex w-full flex-col text-lg leading-snug text-gray-400">
            <Genres genres={genres} />
          </div>
          <Synopsis synopsis={synopsis} />
          <Cast
            cast={cast}
            isDefaultModal={isDefaultModal}
            isLoading={isLoading}
          />
        </div>
      </MotionDivWrapper>
    );
  }
);

Info.displayName = "Info";
export default Info;
