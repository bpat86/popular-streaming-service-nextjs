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

export default function useSliders({ pageAPI, fallbackData }) {
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
    // Override the default modal data with the data from the router query (if it exists)
    fallbackData,
  };

  /**
   * URL to fetch a single title
   */
  const apiURL = `/api/tmdb/${pageAPI}`;

  /**
   * Only attempt to fetch data if `pageAPI` is not null
   */
  const {
    data: sliderData,
    mutate: mutateSliderData,
    error: sliderDataError,
    isValidating: fetchingSliderData,
  } = useSWR(
    [fallbackData ? apiURL : null, fallbackData],
    fetchWithProps,
    options
  );

  return {
    fetchingSliderData,
    sliderData,
    mutateSliderData,
    sliderDataError,
  };
}
