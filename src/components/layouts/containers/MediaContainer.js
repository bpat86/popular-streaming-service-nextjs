import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useRef } from "react";

import BillboardContainer from "@/components/billboard/BillboardContainer";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import PreviewModalContainer from "@/components/modals/PreviewModalContainer";
import Sliders from "@/components/slider/Sliders";
import useMedia from "@/middleware/useMedia";
import { getVideoKey } from "@/utils/getVideoKey";

import usePreviewModalStore from "@/stores/PreviewModalStore";

const MediaContainer = forwardRef(({ pageAPI }, layoutWrapperRef) => {
  const { media, fetchingMedia, mutateMedia, mediaError } = useMedia({
    pageAPI,
  });

  const timerIdRef = useRef(0);
  // Router
  const router = useRouter();

  /**
   * Determine if a preview modal is currently open
   * @returns {Boolean}
   */
  const isPreviewModalOpen = () => {
    const previewModalStateById =
      usePreviewModalStore.getState().previewModalStateById;
    return Object.values(previewModalStateById).some(({ isOpen }) => isOpen);
  };

  /**
   * Turn pointer events off while scrolling
   */
  const onScroll = debounce(
    () => {
      const style = document.body.style;
      timerIdRef.current && clearTimeout(timerIdRef.current),
        (timerIdRef.current = 0);
      isPreviewModalOpen() ||
        (style.pointerEvents !== "none" && (style.pointerEvents = "none")),
        (timerIdRef.current = setTimeout(() => {
          style.pointerEvents = "";
        }, 100));
    },
    100,
    { maxWait: 100, leading: true, trailing: true }
  );

  /**
   * Disable hover while scrolling
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }
  }, [onScroll]);

  /**
   * Render error message
   */
  if (mediaError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center font-medium text-white">
        <p>{`${mediaError}`}</p>
      </div>
    );
  }

  /**
   * Render loading spinner
   */
  if (!media || fetchingMedia) {
    return (
      <div className="flex min-h-screen w-full">
        <LoadingSpinner />
      </div>
    );
  }

  /**
   * Render media elements
   */
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
        shouldFreeze={
          router.query.jbv ?? isPreviewModalOpen() ? true : undefined
        }
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
