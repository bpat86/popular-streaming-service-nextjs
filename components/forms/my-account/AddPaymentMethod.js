import { useState, useRef } from "react";
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Formik, Form } from "formik";
import Card from "@/components/fields/Card";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const AddPaymentMethod = (props) => {
  const { user, mutateUser, paymentMethodList } = props;
  const cardRef = useRef();
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("payment method user::: ", user);
  console.log("paymentMethodList: ", paymentMethodList);

  /**
   * Display Stripe status message to the user.
   * Inspect the SetupIntent `status` to indicate the status of the payment
   * to your customer.
   *
   * Some payment methods will [immediately succeed or fail][0] upon
   * confirmation, while others will first enter a `processing` state.
   *
   * [0] https://stripe.com/docs/payments/payment-methods#payment-notification
   * @param {String} clientSecret
   * @param {Function} actions
   */
  const handleStripeResponse = async (clientSecret, actions) => {
    const { setStatus } = actions;
    const { setupIntent } = await stripe.retrieveSetupIntent(clientSecret);

    switch (setupIntent.status) {
      case "succeeded": {
        setStatus({
          success: true,
          message: "Your payment method has been saved.",
        });
        mutateUser();
        break;
      }
      case "processing": {
        setStatus({
          success: true,
          message: "Processing payment details.",
        });
        break;
      }
      case "requires_payment_method": {
        // Redirect your user back to your payment page to attempt collecting
        // payment again
        setStatus({
          success: false,
          message: "Please try another payment method.",
        });
        break;
      }
    }
  };

  const updateStripePaymentMethod = async (values, actions) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    setLoading(true);

    try {
      if (!stripe || !elements || !user) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }

      await sleep(250);

      const result = await stripe.confirmCardSetup(user.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: `${user.firstName} ${user.lastName}`,
          },
        },
      });

      if (result.error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setLoading(false);
        setError(result.error.message);
      } else {
        setLoading(false);
        console.log("actions:: ", actions);
        console.log("setupIntent:: ", result?.setupIntent);
        handleStripeResponse(result?.setupIntent.client_secret, actions);
        elements.getElement(CardElement).clear();

        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    } catch (error) {
      setLoading(false);
      // Send error repsonses to the frontend for user feedback
      // setError(error.message);
    }
  };

  const handleChange = (event) => {
    // Set error message to be shown when the user inputs incorrect payment data
    if (event.error) {
      setError(event.error.message);
    } else {
      setError("");
    }
  };

  /**
   *
   * Check if stripe element is empty onBlur
   */
  const handleBlur = (event) => {
    if (!event.complete) cardRef.current.blur();
  };

  return (
    <Formik
      initialValues={{}}
      onSubmit={async (values, actions) => {
        await updateStripePaymentMethod(values, actions);
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className="flex flex-col w-full mb-3">
          <div className="relative w-full sm:max-w-md">
            <Card
              name="card"
              ref={cardRef}
              stripeError={error || (!status?.success && status?.message)}
              setStripeError={setError}
              component={CardElement}
              handleChange={handleChange}
              handleBlur={handleBlur}
            />
          </div>
          <div className="sm:flex sm:items-center sm:space-x-4 sm:space-x-reverse mt-6">
            {status?.success ? (
              <div className="order-1 flex space-x-2 items-center text-base text-gray-800 font-semibold -mt-3 mb-6 sm:my-0">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{status?.message}</span>
              </div>
            ) : (
              <></>
            )}
            {!stripe || !elements || loading || isSubmitting ? (
              <button
                disabled
                type="submit"
                className="flex items-center py-3 px-4 rounded text-base font-semibold tracking-wide text-white bg-red-800 bg-opacity-80 focus:outline-none transition ease-out duration-700"
              >
                Processing
                <svg
                  className="motion-safe:animate-spin ml-2 -mr-1 h-5 w-5 text-white"
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
              </button>
            ) : (
              <button
                disabled={!stripe}
                type="submit"
                className="flex items-center py-3 px-4 rounded text-base font-semibold tracking-wide text-white bg-netflix-red hover:bg-netflix-red-light focus:outline-none transition ease-out duration-700"
                // onClick={(event, actions) => updateStripePaymentMethod(event, actions)}
              >
                Update payment method
              </button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddPaymentMethod;
