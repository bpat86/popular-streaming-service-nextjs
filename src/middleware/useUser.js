import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

/**
 * Fetcher function
 * @param  {...any} args
 * @returns {Object}
 */
const fetcher = async (...args) => {
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

export default function useUser({
  redirectTo = false,
  redirectIfFound = false,
} = {}) {
  const router = useRouter();
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
  };

  /**
   * URL to fetch user data
   */
  const apiURL = "/api/strapi/users/me";

  /**
   * Attempt to fetch a user
   */
  const {
    data: user,
    mutate: mutateUser,
    isValidating: fetchingUser,
  } = useSWR(apiURL, fetcher, options);

  /**
   * If no redirect needed, just return (example: already on /browse)
   * Don't do anything if user data not yet loaded (fetch in progress, logged in or not)
   */
  useEffect(() => {
    if (!redirectTo || !user) return;
    if (user.isActive) {
      if (
        (redirectTo &&
          !redirectIfFound &&
          !user.isLoggedIn &&
          !user.isActive) ||
        (redirectIfFound && user.isLoggedIn && user.isActive)
      ) {
        router.push(redirectTo);
      }
    } else {
      router.push("/my-account");
    }
  }, [user, redirectIfFound, redirectTo, router]);

  return {
    user,
    mutateUser,
    fetchingUser,
  };
}
