import { useMemo, forwardRef } from "react";
import MotionDivWrapper from "@/components/motion/MotionDivWrapper";
// Components
import Genres from "./Genres";
import Synopsis from "./Synopsis";
import Cast from "./Cast";

const Info = forwardRef((props, infoRef) => {
  const { cast, genres, isDefaultModal, isLoading, synopsis } = props;

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
              duration: 0.06,
            },
            duration: 0.06,
          },
        };
  };

  return (
    <MotionDivWrapper {...getAnimationProps()}>
      <div ref={infoRef} className="preview-modal info p-6 sm:px-12">
        <div className="detail-modal-container flex flex-col w-full text-lg text-gray-400 leading-snug">
          <Genres genres={genres} />
        </div>
        <Synopsis synopsis={synopsis} />
        <Cast
          cast={cast}
          isDefaultModal={isDefaultModal}
          isLoading={isLoading}
        />
        <Cast
          cast={cast}
          isDefaultModal={isDefaultModal}
          isLoading={isLoading}
        />
      </div>
    </MotionDivWrapper>
  );
});

Info.displayName = "Info";
export default Info;
