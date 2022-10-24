import { forwardRef, useContext } from "react";
import InteractionContext from "@/context/InteractionContext";
import PreviewModalContext from "@/context/PreviewModalContext";
import BillboardContainer from "@/components/browse/billboard/BillboardContainer";
import Sliders from "@/components/browse/slider/Sliders";
import useMedia from "@/middleware/useMedia";
import PreviewModalContainer from "@/components/browse/modal/PreviewModalContainer";
import { getVideoKey } from "@/utils/getVideoKey";
import LoadingSpinner from "@/components/loading/LoadingSpinner";

const MediaContainer = forwardRef((props, layoutWrapperRef) => {
  const { children, pageAPI, shouldFreeze } = props;
  // const { PreviewModalProvider } = createFastContext();
  // const { isPreviewModalOpen } = useContext(InteractionContext);
  const { previewModalStateById } = useContext(PreviewModalContext);

  const { media, fetchingMedia, mutateMedia, mediaError, cancelRequest } =
    useMedia({
      pageAPI,
    });

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = () => {
    const modals = previewModalStateById;
    return Object.values(modals)?.some((item) => item?.isOpen);
  };

  if (mediaError) {
    return (
      <div className="flex items-center justify-center flex-col w-full min-h-screen text-white font-medium">
        <p>{`${mediaError}`}</p>
      </div>
    );
  }

  if (!media || fetchingMedia) {
    return (
      <div className="flex w-full min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <BillboardContainer
        model={{
          uid: media?.data?.billboard?.data?.id,
          id: media?.data?.billboard?.data?.id,
          billboardVideoId: getVideoKey(media?.data?.billboard?.data),
          listContext: media?.data?.billboard?.listContext,
          mediaType: media?.data?.billboard?.data?.media_type,
          mutateData: { mutateSliderData: mutateMedia },
          videoId: getVideoKey(media?.data?.billboard?.data),
          videoRoot: undefined,
          videoModel: {
            cast: media?.data?.billboard?.data?.cast,
            crew: media?.data?.billboard?.data?.crew,
            dislikedMediaId: media?.data?.billboard?.data?.disliked_media_id,
            genres: media?.data?.billboard?.data?.genres,
            listContext: media?.data?.billboard?.listContext,
            id: media?.data?.billboard?.data?.id,
            identifiers: {
              uid: media?.data?.billboard?.data?.id,
              id: media?.data?.billboard?.data?.id,
              mediaType: media?.data?.billboard?.data?.media_type,
            },
            imageKey: media?.data?.billboard?.data?.backdrop_path,
            isBillboard: media?.data?.billboard?.data?.is_billboard,
            inMediaList: media?.data?.billboard?.data?.in_media_list,
            isDisliked: media?.data?.billboard?.data?.is_disliked,
            isLiked: media?.data?.billboard?.data?.is_liked,
            likedMediaId: media?.data?.billboard?.data?.liked_media_id,
            logos: media?.data?.billboard?.data?.images?.logos,
            mediaListId: media?.data?.billboard?.data?.media_list_id,
            mediaType: media?.data?.billboard?.data?.media_type,
            mutateSliderData: mutateMedia,
            rankNum: undefined,
            rect: undefined,
            reference: media?.data?.billboard?.data,
            rowNum: undefined,
            scrollPosition: undefined,
            sliderName: undefined,
            synopsis: media?.data?.billboard?.data?.overview,
            tagline: media?.data?.billboard?.data?.tagline,
            title:
              media?.data?.billboard?.data?.original_title ||
              media?.data?.billboard?.data?.original_name,
            titleCardId: undefined,
            titleCardRef: undefined,
            videoId: media?.data?.billboard?.data?.id,
            videoKey: getVideoKey(media?.data?.billboard?.data),
            videoPlayback: undefined,
            videos: media?.data?.billboard?.data?.videos,
          },
        }}
        shouldFreeze={shouldFreeze || isPreviewModalOpen()}
      />
      {/* Sliders */}
      <Sliders model={media?.data?.sliders} />
      {/* Preview Modal */}
      <PreviewModalContainer
        ref={layoutWrapperRef}
        mutateSliderData={mutateMedia}
      />
    </>
  );
});

export default MediaContainer;
