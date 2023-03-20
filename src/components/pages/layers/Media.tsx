import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import {
  forwardRef,
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";

import BillboardContainer from "@/components/billboard/BillboardContainer";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
import PreviewModalContainer from "@/components/modals/PreviewModalContainer";
import Sliders from "@/components/slider/Sliders";
import useMedia from "@/middleware/useMedia";
import useMediaStore from "@/store/MediaStore";
import usePreviewModalStore from "@/store/PreviewModalStore";
import { getVideoKey } from "@/utils/getVideoKey";

type MediaContainerProps = {
  pageAPI: string;
};

const Media = forwardRef(({ pageAPI }: MediaContainerProps, ref) => {
  const layoutWrapperRef = ref as MutableRefObject<HTMLDivElement | null>;
  const {
    fetchingMedia,
    media: data,
    mutateMedia,
    mediaError,
  } = useMedia({
    pageAPI,
  });
  useMediaStore.getState().setMediaData(data);
  const media = useMediaStore.getState().mediaData;

  // console.log("media: ", media);

  const timerIdRef = useRef<number>(0);
  // Router
  const router = useRouter();

  /**
   * Turn pointer events off while scrolling
   */
  const onScroll = useCallback(() => {
    const style = document.body.style;
    timerIdRef.current && clearTimeout(timerIdRef.current),
      (timerIdRef.current = 0);
    usePreviewModalStore.getState().isPreviewModalOpen() ||
      (style.pointerEvents !== "none" && (style.pointerEvents = "none")),
      (timerIdRef.current = window.setTimeout(() => {
        style.pointerEvents = "";
      }, 200));
  }, []);

  const debouncedOnScroll = debounce(onScroll, 200, {
    maxWait: 200,
    leading: true,
    trailing: true,
  });

  /**
   * Disable hover while scrolling
   */
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", debouncedOnScroll);
      return () => {
        window.removeEventListener("scroll", debouncedOnScroll);
      };
    }
  }, [debouncedOnScroll]);

  /**
   * Render error message
   */
  if (mediaError) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center font-medium text-white">
        <p>{mediaError.toString()}</p>
      </div>
    );
  }

  /**
   * Render loading spinner
   */
  if (!media && fetchingMedia) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {media?.data?.billboard?.data?.id && (
        <BillboardContainer
          model={{
            uid: media?.data?.billboard?.data?.id,
            id: media?.data?.billboard?.data?.id,
            billboardVideoId: getVideoKey(media?.data?.billboard?.data),
            listContext: media?.data?.billboard?.listContext,
            mediaType: media?.data?.billboard?.data?.media_type,
            mutateData: mutateMedia,
            videoId: getVideoKey(media?.data?.billboard?.data),
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
            router.query.jbv ||
            usePreviewModalStore.getState().isPreviewModalOpen()
              ? true
              : undefined
          }
        />
      )}
      {/* Sliders */}
      {media?.data?.billboard?.data?.id ? (
        <Sliders model={media?.data?.sliders} />
      ) : (
        <div className="mt-[68px] grid min-h-[500px] items-center">
          <Sliders model={media?.data?.sliders} />
        </div>
      )}
      {/* Preview Modal */}
      <PreviewModalContainer
        ref={layoutWrapperRef}
        mutateSliderData={mutateMedia}
      />
    </>
  );
});

export default Media;
