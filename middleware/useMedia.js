import useSWR from "swr";
import axios from "axios";

/**
 * Fetcher function
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

export default function useMedia({ pageAPI }) {
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

  // URL to fetch a single title
  const apiURL = `/api/tmdb/${pageAPI}`;

  /**
   * Only attempt to fetch data if `pageAPI` is not null
   */
  try {
    const {
      data: media,
      mutate: mutateMedia,
      error: mediaError,
      isValidating,
    } = useSWR(
      apiURL,
      (url) => (pageAPI ? fetchWithProps(url, { signal }) : null),
      options
    );

    const fetchingMediaData = !media && !mediaError && isValidating;

    if (signal.aborted) return;
    if (!fetchingMediaData) {
      return {
        fetchingMedia: isValidating,
        media,
        mutateMedia,
        mediaError,
        cancelRequest: () => controller.abort(),
      };
    }
    return {
      fetchingMedia: isValidating,
      media: null,
      mutateMedia,
      mediaError,
      cancelRequest: () => controller.abort(),
    };
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Aborted");
      return "Request Aborted ";
    }
    return err;
  }
}
