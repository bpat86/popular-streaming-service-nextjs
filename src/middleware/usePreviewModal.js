import axios from "axios";
import useSWR from "swr";

import { getVideoKey } from "@/utils/getVideoKey";

/**
 * Fetcher function with props
 * @param  {...any} args
 * @returns {Object}
 */
const fetchWithProps = async (...args) => {
  const res = await axios.get(...args);
  /**
   * If the status code is not 200, we
   * still try to parse and throw it.
   */
  if (!res.status === 200) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.data;
    error.status = res.status;
    throw error;
  }

  return res.data;
};

export default function usePreviewModal({ initialData }) {
  /**
   * useSWR api options
   * https://swr.vercel.app/docs/options
   */
  const options = {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    revalidateOnReconnect: false,
    // Preload the fallback data before making a request
    fallbackData: initialData,
  };

  // Abort fetch if the user navigates away
  const controller = new AbortController();
  const signal = controller.signal;

  // ID and Type of the media to fetch
  const id = initialData?.model?.id;
  const type = initialData?.model?.mediaType;

  // URL to fetch a single title
  const apiURL = `/api/tmdb/getTitle?id=${id}&type=${type}`;

  const {
    data: modalData,
    error: modalDataError,
    mutate: mutateModalData,
    isValidating,
  } = useSWR(
    apiURL,
    (url) => (initialData ? fetchWithProps(url, { signal }) : null),
    options
  );

  // Preview modal data
  const previewModalData = Object.assign(
    Object.assign({}, initialData, initialData?.model),
    {},
    {
      id: initialData?.model?.id,
      videoId: modalData?.data?.id,
      videoKey: getVideoKey(modalData?.data),
      videoModel: {
        cast: modalData?.data?.cast,
        crew: modalData?.data?.crew,
        dislikedMediaId: modalData?.data?.disliked_media_id,
        genres: modalData?.data?.genres,
        id: modalData?.data?.id,
        identifiers: {
          uid: initialData?.model?.uid,
          id: modalData?.data?.id,
          mediaType: modalData?.data?.media_type,
        },
        imageKey: modalData?.data?.backdrop_path,
        isBillboard: modalData?.data?.is_billboard,
        inMediaList: modalData?.data?.in_media_list,
        isMyListRow: initialData?.isMyListRow,
        isDisliked: modalData?.data?.is_disliked,
        isLiked: modalData?.data?.is_liked,
        likedMediaId: modalData?.data?.liked_media_id,
        logos: modalData?.data?.images?.logos,
        mediaListId: modalData?.data?.media_list_id,
        mediaType: modalData?.data?.media_type,
        rankNum: modalData?.data?.rankNum,
        rect: initialData?.rect,
        reference: modalData?.data,
        rowNum: initialData?.rowNum,
        scrollPosition: initialData?.scrollPosition,
        sliderName: modalData?.data?.sliderName,
        synopsis: modalData?.data?.overview,
        tagline: modalData?.data?.tagline,
        title:
          modalData?.data?.original_title || modalData?.data?.original_name,
        titleCardRef: initialData?.titleCardRef,
        videoId: modalData?.data?.id,
        videoKey: getVideoKey(modalData?.data),
        videos: modalData?.data?.videos,
        videoPlayback: {
          start: initialData?.videoPlayback?.start,
          length: initialData?.videoPlayback?.videoDuration,
        },
      },
      videos: modalData?.data?.videos,
      videoPlayback: {
        start: initialData?.videoPlayback?.start,
        length: initialData?.videoPlayback?.videoDuration,
      },
    }
  );

  /**
   * Data loading/fetching status
   */
  const fetchingModalData = !modalData?.data && !modalDataError && isValidating;

  if (signal.aborted) return;
  if (!fetchingModalData) {
    return {
      modalData: previewModalData,
      fetchingModalData,
      mutateModalData,
      modalDataError,
      cancelRequest: () => controller.abort(),
    };
  } else {
    return {
      modalData: initialData,
      fetchingModalData,
      mutateModalData,
      modalDataError,
      cancelRequest: () => controller.abort(),
    };
  }
}
