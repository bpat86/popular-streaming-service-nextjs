import axios from "axios";
import useSWR from "swr";

export type FetcherProps = [string, object];
export type UseTitleProps = {
  id: string;
  type: string;
};

/**
 * Fetcher function with props
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

export default function useTitle({ id, type }: UseTitleProps) {
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

  // Abort fetch if the user navigates away
  const controller = new AbortController();
  const signal = controller.signal;

  /**
   * URL to fetch a single title
   */
  const apiURL = `/api/tmdb/modal?id=${id}&type=${type}`;

  /**
   * Only attempt to fetch data if `data` is not null
   */
  const {
    data: titleData,
    error: titleError,
    mutate: mutateTitle,
    isValidating,
  } = useSWR(
    apiURL,
    (url: string) => (id && type ? fetchWithProps(url, { signal }) : null),
    options
  );

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
