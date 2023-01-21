import axios from "axios";
import { useDeferredValue } from "react";
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

export default function usePreviewModalData({
  initialData,
  initialData: { model },
}) {
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
  const id = model?.id;
  const type = model?.mediaType;

  // URL to fetch a single title
  const apiURL = `/api/tmdb/getTitle?id=${id}&type=${type}`;

  const {
    data: { data },
    error: modalDataError,
    mutate: mutateModalData,
    isValidating,
  } = useSWR(
    apiURL,
    (url) => (initialData ? fetchWithProps(url, { signal }) : null),
    options
  );

  // Preview modal data
  const videoKey = getVideoKey(data);
  const previewModalData = {
    ...initialData,
    ...model,
    id: model?.id,
    videoId: data?.id,
    videoKey,
    videoModel: {
      cast: data?.cast,
      crew: data?.crew,
      dislikedMediaId: data?.disliked_media_id,
      genres: data?.genres,
      id: data?.id,
      identifiers: {
        uid: model?.uid,
        id: data?.id,
        mediaType: data?.media_type,
      },
      imageKey: data?.backdrop_path,
      isBillboard: data?.is_billboard,
      inMediaList: data?.in_media_list,
      isMyListRow: initialData?.isMyListRow,
      isDisliked: data?.is_disliked,
      isLiked: data?.is_liked,
      likedMediaId: data?.liked_media_id,
      logos: data?.images?.logos,
      mediaListId: data?.media_list_id,
      mediaType: data?.media_type,
      rankNum: data?.rankNum,
      rect: initialData?.rect,
      reference: data,
      rowNum: initialData?.rowNum,
      scrollPosition: initialData?.scrollPosition,
      sliderName: data?.sliderName,
      synopsis: data?.overview,
      tagline: data?.tagline,
      title: data?.original_title || data?.original_name,
      titleCardRef: initialData?.titleCardRef,
      videoId: data?.id,
      videoKey,
      videos: data?.videos,
      videoPlayback: {
        start: initialData?.videoPlayback?.start,
        length: initialData?.videoPlayback?.videoDuration,
      },
    },
    videos: data?.videos,
    videoPlayback: {
      start: initialData?.videoPlayback?.start,
      length: initialData?.videoPlayback?.videoDuration,
    },
  };
  const deferredPreviewModalData = useDeferredValue(previewModalData);

  /**
   * Data loading/fetching status
   */
  const fetchingModalData = !data && !modalDataError && isValidating;

  if (signal.aborted) return;
  if (!fetchingModalData) {
    return {
      modalData: deferredPreviewModalData,
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
