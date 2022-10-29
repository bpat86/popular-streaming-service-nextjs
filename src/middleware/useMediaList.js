import axios from "axios";
import useSWR from "swr";

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

export default function useMediaList({ fallbackData } = {}) {
  /**
   * useSWR api options
   * https://swr.vercel.app/docs/options
   */
  const options = {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    shouldRetryOnError: true,
    revalidateOnReconnect: true,
    fallbackData,
  };

  /**
   * URL to fetch a single title
   */
  const apiURL = "/api/strapi/media/getMediaList";

  /**
   * Only attempt to fetch data if `pageAPI` is not null
   */
  const {
    data: mediaList,
    mutate: mutateMediaList,
    error: mediaListError,
    isValidating: fetchingMediaList,
  } = useSWR([apiURL, fallbackData], fetchWithProps, options);

  return {
    mediaList,
    mutateMediaList,
    mediaListError,
    fetchingMediaList,
  };
}
