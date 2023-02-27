import { forwardRef, MouseEvent } from "react";

import { MotionDivWrapper } from "@/lib/MotionDivWrapper";
import { IVideoModel } from "@/store/types";

import ButtonControls from "./ButtonControls";
import Genres from "./Genres";

type InfoProps = {
  genres: IVideoModel["genres"];
  handleWatchNow: ({
    id,
    mediaType,
  }: {
    id: number;
    mediaType: string;
  }) => void;
  handleViewDetails: () => void;
  handleMetadataAreaClicked: (e: MouseEvent<HTMLDivElement>) => void;
  handleCloseModal: () => void;
  identifiers: IVideoModel["identifiers"];
  isMyListRow: boolean;
  inMediaList: boolean;
  isLiked: boolean;
  isLoading: boolean;
  isDisliked: boolean;
  videoModel: IVideoModel;
};

const Info = forwardRef<HTMLDivElement, InfoProps>(
  (
    {
      genres,
      handleWatchNow,
      handleViewDetails,
      handleMetadataAreaClicked,
      handleCloseModal,
      identifiers,
      isMyListRow,
      inMediaList,
      isLiked,
      isLoading,
      isDisliked,
      videoModel,
    },
    ref
  ) => {
    return (
      <div className="preview-modal info" onClick={handleMetadataAreaClicked}>
        <div className="preview-modal info-container">
          <MotionDivWrapper
            inherit={false}
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.043,
                duration: 0.067,
                ease: "linear",
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.067,
                duration: 0.117,
                ease: "linear",
              },
            }}
            className="mini-modal-container"
          >
            <ButtonControls
              ref={ref}
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
            <Genres genres={genres} isLoading={isLoading} />
          </MotionDivWrapper>
        </div>
      </div>
    );
  }
);

Info.displayName = "Info";
export default Info;
