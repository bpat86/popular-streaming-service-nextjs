import axios from "axios";
import useSWR from "swr";

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

export default function useTitle(mediaData = {}) {
  const { id, type } = mediaData;
  /**
   * useSWR api options
   * https://swr.vercel.app/docs/options
   */
  const options = {
    revalidateOnMount: true,
    revalidateIfStale: true,
    shouldRetryOnError: true,
    revalidateOnReconnect: true,
  };

  /**
   * URL to fetch a single title
   */
  const apiURL = `/api/tmdb/getTitle?id=${id}&type=${type}`;

  /**
   * Only attempt to fetch data if `data` is not null
   */
  const {
    data: titleData,
    error: titleError,
    mutate: mutateTitle,
    isValidating,
  } = useSWR([mediaData ? apiURL : null, mediaData], fetchWithProps, options);

  /**
   * Media loading status
   */
  const fetchingTitle = !titleData && !titleError && isValidating;

  return {
    titleData,
    fetchingTitle,
    mutateTitle,
    titleError,
  };
}
