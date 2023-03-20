import axios from "axios";
import useSWR from "swr";

import { IProfile } from "@/store/types";

export type FetcherProps = [string, object];

export interface UseProfileProps {
  data: {
    profiles: IProfile[];
  };
  mutate: any;
  error: any;
  isLoading: boolean;
  isValidating: boolean;
}

/**
 * Fetcher function
 * https://swr.vercel.app/docs/data-fetching#fetcher-function
 */
export async function fetchWithProps([...args]: FetcherProps) {
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
}

export default function useProfiles() {
  /**
   * useSWR api options
   * https://swr.vercel.app/docs/options
   */
  const options = {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateIfStale: true,
    shouldRetryOnError: true,
    revalidateOnReconnect: true,
  };
  // Abort fetch if the user navigates away
  const controller = new AbortController();
  const signal = controller.signal;
  // URL to fetch data from
  const apiURL = "/api/strapi/profiles/getProfiles";
  // Fetch data from the API if user is logged in
  const { data, mutate, error, isLoading, isValidating } = useSWR(
    apiURL,
    () => fetchWithProps([apiURL, { signal }]),
    options
  );
  // Return the data
  const profiles = data && data.profiles;
  return { profiles, mutate, isLoading, isValidating, error };
}
