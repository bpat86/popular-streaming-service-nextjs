import { useEffect } from "react";
import Router from "next/router";
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

export default function useProfiles({ user, redirectTo = false } = {}) {
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

  /**
   * URL to fetch use profiles
   */
  const apiURL = `/api/strapi/profiles/getProfiles`;

  /**
   * Only attempt to fetch data if `user` is not null
   */
  const {
    data: profiles,
    mutate: mutateProfiles,
    isValidating: loadingProfiles,
  } = useSWR(user ? apiURL : null, fetchWithProps, options);

  /**
   * Output profiles names, loading/fetching status, and bearer token
   */
  const profileNames =
    profiles &&
    profiles.profiles.data.map((profile) => profile.attributes.name);

  /**
   * Don't do anything if `profiles` data is not available (fetch in progress, logged in or not)
   */
  useEffect(() => {
    if (!redirectTo || !profiles) return;
    // Redirect the user if data is available
    Router.push(redirectTo);
  }, [profiles, redirectTo]);

  return {
    profiles: profiles && profiles.profiles.data,
    profileNames,
    loadingProfiles,
    mutateProfiles,
  };
}
