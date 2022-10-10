import axios from "axios";
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

export default function useSubscriptions() {
  /**
   * useSWR api options
   * https://swr.vercel.app/docs/options
   */
  const options = {
    revalidateOnMount: true,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    shouldRetryOnError: true,
    revalidateOnReconnect: true,
  };

  /**
   * URL to fetch subscription and payment method info from Stripe
   */
  const apiURL = `/api/stripe/getSubscriptions`;

  /**
   * Attempt to fetch a user's subscription
   */
  const {
    data: stripe,
    mutate: mutateSubscriptions,
    isValidating: fetchingSubscriptions,
  } = useSWR(apiURL, fetcher, options);

  return {
    subscriptions: stripe?.subscriptions?.data[0],
    paymentMethods: stripe?.paymentMethods?.data[0],
    mutateSubscriptions,
    fetchingSubscriptions,
  };
}
