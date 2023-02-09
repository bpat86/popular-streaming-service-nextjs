import axios from "axios";
import useSWR from "swr";

export type FetcherProps = [string, object];
export type UseMediaProps = {
  pageAPI: string;
};

/**
 * Fetcher function
 * https://swr.vercel.app/docs/data-fetching#fetcher-function
 */
const fetchWithProps = async (...args: FetcherProps) => {
  const res = await axios.get(...args);
  /**
   * If the status code is not 200, we
   * still try to parse and throw it.
   */
  if (res.status !== 200) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    throw { ...error, info: await res.data, status: res.status };
  }

  return res.data;
};

export default function useMedia({ pageAPI }: UseMediaProps) {
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
    refreshWhenOffline: false,
  };

  // Abort fetch if the user navigates away
  const controller = new AbortController();
  const signal = controller.signal;

  // URL to fetch data from
  const apiURL = `/api/tmdb/${pageAPI}`;

  // Fetch data from the API
  const {
    data: media,
    mutate: mutateMedia,
    error: mediaError,
    isValidating,
  } = useSWR(
    apiURL,
    (url: string) => (pageAPI ? fetchWithProps(url, { signal }) : null),
    options
  );

  // Request data is still being fetched
  const fetchingMediaData = !media && !mediaError && isValidating;

  // If the request is still validating or is aborted, return undefined
  if (fetchingMediaData || signal.aborted) {
    return {
      fetchingMedia: fetchingMediaData, // isValidating
      media: undefined,
      mutateMedia,
      mediaError,
      cancelRequest: () => controller.abort(),
    };
  }

  // Return the request data
  return {
    fetchingMedia: isValidating,
    media,
    mutateMedia,
    mediaError,
    cancelRequest: () => controller.abort(),
  };
}
