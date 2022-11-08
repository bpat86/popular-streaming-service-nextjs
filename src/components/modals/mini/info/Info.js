import { forwardRef, memo } from "react";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";

import ButtonControls from "./ButtonControls";
import Genres from "./Genres";

const Info = memo(
  forwardRef((props, buttonsRef) => {
    const {
      genres,
      handleWatchNow,
      handleViewDetails,
      handleMetadataAreaClicked,
      handleCloseModal,
      identifiers,
      isMyListRow,
      inMediaList,
      isLiked,
      isDisliked,
      videoModel,
    } = props;

    return (
      <MotionDivWrapper
        inherit={false}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: {
            delay: 0.067,
            duration: 0.117,
            ease: "linear",
          },
        }}
        transition={{
          opacity: { delay: 0.043, duration: 0.117, ease: "linear" },
        }}
        className="preview-modal info"
        onClick={handleMetadataAreaClicked}
      >
        <div className="preview-modal info-container">
          <div className="mini-modal-container">
            <ButtonControls
              ref={buttonsRef}
              handleWatchNow={handleWatchNow}
              handleViewDetails={handleViewDetails}
              handleCloseModal={handleCloseModal}
              identifiers={identifiers}
              isMyListRow={isMyListRow}
              inMediaList={inMediaList}
              isLiked={isLiked}
              isDisliked={isDisliked}
              videoModel={videoModel}
            />
            <Genres genres={genres} />
          </div>
        </div>
      </MotionDivWrapper>
    );
  })
);

Info.displayName = "Info";
export default Info;
