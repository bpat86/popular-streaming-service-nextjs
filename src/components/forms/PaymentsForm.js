import { useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import { useState } from "react";

import { NEXT_URL } from "@/config/index";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const PaymentsForm = (props) => {
  // Destructure the props
  const { userData, stripeCustomerId, registrationStepFive } = props;

  // Set initial state
  const [error, setError] = useState(null);
  const [stripeLoading, setStripeLoading] = useState(null);

  // Initialize Stripe
  const stripe = useStripe();
  const elements = useElements();

  // console.log("Form: ", userData);

  // Store `clientSecret` in a cookie so it's accessible in the next step
  const setCookie = (clientSecret) => {
    Cookies.remove("clientSecret");
    Cookies.set("clientSecret", clientSecret);
  };

  // Begin Stripe subscription payment
  const handleStripeSubmit = async () => {
    const isStripeLoading = !stripe || !elements;
    setStripeLoading(true);

    // Make sure to disable form submission until Stripe has loaded
    if (isStripeLoading) {
      setStripeLoading(false);
      return;
    }

    try {
      // On submit, a new subscription in Stripe / Strapi order is created.
      // At this point in registration, the subscription isn't yet active,
      // and Stripe doesn't allow inactive subscriptions to be updated.
      // If the user wants to upgrade / downgrade their subscription
      // before the payment step, a new subscription will be made.
      // The inactive subscriptions will expire within 24 hrs.
      // Be mindful of the field names expected by Stripe.
      const createSubscriptionResponse = await axios.post(
        `${NEXT_URL}/api/stripe/createSubscription`,
        {
          email: userData.email,
          plan: [userData.plan?.id],
          monthlyPrice: userData.plan?.monthlyPrice,
          priceId: userData.plan?.stripePriceId,
          customerId: userData?.stripeCustomerId,
        }
      );

      // Get back the customer's subscription data
      const subscriptionData = await createSubscriptionResponse.data;

      // Receive clientSecret from the backend response
      const {
        clientSecret,
        subscriptionId,
        // currency,
        // monthlyPrice,
        // startDate,
        // currentPeriodStart,
        // currentPeriodEnd,
      } = subscriptionData;

      // Define the body parameters for the createOrder post request
      // const createOrderBodyParams = {
      //   email: userData.email,
      //   plan: [userData.plan?.id],
      //   customerId: stripeCustomerId,
      //   subscriptionId,
      //   monthlyPrice,
      //   currency,
      //   startDate,
      //   currentPeriodStart,
      //   currentPeriodEnd,
      // };

      // console.log("userData: ", userData);

      // Define the create order api url
      // const createOrderUrl = `${NEXT_URL}/api/strapi/orders/createOrder`;

      // Create an `incomplete` order in Strapi
      // const createOrderResponse = await axios.post(
      //   createOrderUrl,
      //   createOrderBodyParams
      // );

      // Get back the user's / customer's order data
      // const createOrderData = createOrderResponse.data;

      // console.log("createOrderData: ", createOrderData);

      // Store `clientSecret` in a cookie so it's accessible in the next step
      setCookie(clientSecret);

      // Define the updated user parameters to send to Strapi
      const updateUserParams = {
        plan: [userData.plan?.id],
        customerId: stripeCustomerId,
        subscriptionId,
      };

      // console.log("updateUserParams: ", updateUserParams);

      // Update the user information in Strapi and progress to the next step of registration
      registrationStepFive(updateUserParams);
    } catch (error) {
      setStripeLoading(false);
      // Set any errors that may occur for user feedback in the UI
      setError(error.message);
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <>
      <div className="my-1 ml-auto flex flex-row items-center text-sm text-gray-800">
        Secure Server{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1 h-4 w-4 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <Formik
        initialValues={{}}
        onSubmit={async () => {
          await sleep(250);
          handleStripeSubmit();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full">
            {isSubmitting || stripeLoading || !stripe || !elements ? (
              <button
                type="submit"
                className="flex h-16 w-full flex-row items-center rounded-md border-2 border-gray-400 bg-white py-3 px-4 pr-2 text-base font-semibold tracking-wide text-gray-700 transition duration-700 ease-out focus:outline-none"
              >
                <span className="ml-auto">Processing</span>
                {/* Spinner */}
                <svg
                  className="ml-2 h-5 w-5 text-gray-500 motion-safe:animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {/* Arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-auto h-7 w-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                disabled={isSubmitting || stripeLoading || !stripe || !elements}
                type="submit"
                className="flex h-16 w-full flex-row items-center rounded-md border-2 border-gray-300 bg-white py-3 px-4 pr-2 text-base font-semibold tracking-wide text-gray-700 transition duration-700 ease-out hover:border-gray-400 focus:outline-none"
              >
                <span>Credit or Debit Card</span>
                <span className="flex flex-row space-x-2">
                  <picture>
                    <img
                      className="ml-3 h-5 w-auto sm:h-6"
                      src="/images/auth/visa.svg"
                      alt="Visa"
                    />
                  </picture>
                  <picture>
                    <img
                      className="ml-2 h-5 w-auto sm:h-6"
                      src="/images/auth/mastercard.svg"
                      alt="Visa"
                    />
                  </picture>
                  <picture>
                    <img
                      className="ml-2 h-5 w-auto sm:h-6"
                      src="/images/auth/amex.svg"
                      alt="Visa"
                    />
                  </picture>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-auto h-7 w-7 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
