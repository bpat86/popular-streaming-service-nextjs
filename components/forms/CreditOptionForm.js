import { useState, useRef } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as yup from "yup";

import { NEXT_URL } from "@/config/index";
import InputLight from "@/components/fields/InputLight";
import Card from "@/components/fields/Card";
import axios from "axios";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const validationSchema = yup.object({
  firstName: yup.string().min(1).max(100).required("First name is required"),
  lastName: yup.string().min(2).max(50).required("Last name is required"),
});

export const CreditOptionForm = (props) => {
  // Destructure the props
  const {
    loading,
    userData,
    formData,
    setFormData,
    strapiError,
    initialClientSecret,
    registrationCompleted,
  } = props;

  // Set initial state
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(null);
  const [cardInputAppearsValid, setCardInputAppearsValid] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  // Initialize Stripe
  const stripe = useStripe();
  const elements = useElements();
  const cardRef = useRef();

  console.log("userData: ", userData);

  const getBillingDetails = (values) => {
    return {
      name: values.firstName + " " + values.lastName,
      email: userData.email,
    };
  };

  const handleCardElementsChange = (event) => {
    // Set error message to be shown when the user inputs incorrect payment data
    if (event.error) {
      setError(event.error.message);
    } else {
      setError("");
    }
    // Set cardComplete
    if (event.complete) {
      setCardInputAppearsValid(true);
    } else {
      setCardInputAppearsValid(false);
    }
  };

  /**
   *
   * Check if stripe element is empty onBlur
   */
  const handleCardElementsBlur = (event) => {
    if (!event.complete) cardRef.current.blur();
  };

  /**
   * User's payment was successful. Handle any redirects here. There's a risk of the customer closing the window before this is executed. Set up a webhook or plugin to listen for the payment_intent.succeeded event that handles any business critical post-payment actions.
   * @param {any} paymentIntent
   */
  const afterPaymentSuccess = async (values, paymentIntent) => {
    setCardComplete(true);

    // Complete the order in Strapi
    const completeOrderParams = {
      orderId: userData?.order?.id,
      // monthlyPrice: userData?.plan?.monthlyPrice,
      status: "Complete",
    };

    // Update the user's registration progress to completed
    const updateUserParams = {
      firstName: values.firstName,
      lastName: values.lastName,
    };

    // Define the create order api url
    const updateOrderUrl = `${NEXT_URL}/api/strapi/orders/updateOrder`;

    // Create an `incomplete` order in Strapi
    const updateOrderResponse = await axios.put(
      updateOrderUrl,
      completeOrderParams
    );

    // Get back the user's / customer's order data
    // const updateOrderData = updateOrderResponse.data;

    // const { amount, id } = paymentIntent;
    // Redirect to success page
    registrationCompleted(updateUserParams);

    // router.push(`/success?amount=${amount}&id=${id}`);
  };

  const handleStripeSubmit = async (values) => {
    // cardRef.current.trigger("change");
    const isStripeLoading = !stripe || !elements;
    setSubmitting(true);

    if (isStripeLoading) {
      // Make sure to disable form submission until Stripe has loaded
      setSubmitting(false);
      return;
    }

    try {
      const cardPayment = await stripe.confirmCardPayment(initialClientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: getBillingDetails(values),
        },
      });

      if (cardPayment.error) {
        setError(cardPayment.error.message);
      } else {
        afterPaymentSuccess(values, cardPayment.paymentIntent);
      }
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {strapiError && (
        <>
          <div className="rounded-sm w-full bg-netflix-orange-light mt-2 mb-3 p-3">
            <h3 className="text-base font-medium text-white leading-tight">
              {strapiError}
            </h3>
          </div>
        </>
      )}
      <Formik
        initialValues={formData}
        onSubmit={async (values) => {
          await sleep(250);
          setFormData(values);
          handleStripeSubmit(values);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          isSubmitting,
        }) => (
          <Form className="w-full space-y-8 mt-2">
            <div className="space-y-5">
              {/* First name */}
              <InputLight
                autoComplete="cc-given-name"
                type="text"
                id="firstName"
                name="firstName"
                maxLength="100"
                minLength="1"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.firstName}
                errors={errors.firstName}
                touched={touched.firstName}
                label="First name"
              />
              {/* Last name */}
              <InputLight
                autoComplete="cc-family-name"
                type="text"
                id="lastName"
                name="lastName"
                maxLength="50"
                minLength="2"
                handleChange={handleChange}
                handleBlur={handleBlur}
                value={values.lastName}
                errors={errors.lastName}
                touched={touched.lastName}
                label="Last name"
              />
              {/* CC Stripe Element */}
              <Card
                name="card"
                ref={cardRef}
                stripeError={error}
                setStripeError={setError}
                component={CardElement}
                handleChange={handleCardElementsChange}
                handleBlur={handleCardElementsBlur}
              />
            </div>
            {/* Selected plan */}
            <div className="rounded-md bg-gray-100 p-4">
              <div className="flex">
                <div className="flex-1 md:flex md:justify-between">
                  <div className="flex flex-col text-sm text-gray-900 tracking-wide">
                    <span className="font-bold">
                      {`${userData.plan.monthlyPrice}/month`}
                    </span>
                    <span className="text-gray-600">
                      {`${userData.plan.planName} Plan`}
                    </span>
                  </div>
                  <p className="my-auto text-sm md:ml-6">
                    <Link href="/signup/choose-plan">
                      <a className="whitespace-nowrap font-bold text-blue-700 hover:text-blue-600">
                        Change <span aria-hidden="true">&rarr;</span>
                      </a>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="text-xs text-gray-700">
                By clicking the "Start Membership" button below, you agree to
                our Terms of Use, Privacy Statement, that you are over 18, and
                that{" "}
                <span className="font-semibold">
                  Netflix will automatically continue your membership and charge
                  the monthly membership fee (currently $17.99) to your payment
                  method until you cancel
                </span>
                . You may cancel at any time to avoid future charges. To cancel,
                go to Account and click "Cancel Membership."
              </div>
              {/* Submit button */}
              <div>
                {isSubmitting ||
                loading ||
                !stripe ||
                !elements ||
                submitting ? (
                  <button
                    disabled
                    type="submit"
                    className="w-full flex items-center justify-center mt-6 py-3 px-4 h-14 rounded-sm text-base font-semibold tracking-wide text-white bg-red-800 focus:outline-none transition ease-out duration-700"
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
                    disabled={
                      !stripe ||
                      !elements ||
                      !isValid ||
                      (Object.keys(touched).length === 0 &&
                        touched.constructor === Object) ||
                      !cardInputAppearsValid ||
                      isSubmitting ||
                      loading ||
                      submitting
                    }
                    type="submit"
                    className="w-full flex items-center justify-center mt-6 py-3 px-4 h-14 rounded-sm text-base font-semibold tracking-wide text-white bg-netflix-red hover:bg-netflix-red-light focus:outline-none transition ease-out duration-700 disabled:bg-red-800 disabled:cursor-not-allowed"
                  >
                    Start Membership
                  </button>
                )}
                {cardComplete && (
                  <>
                    <div className="rounded-md bg-green-50 p-4 mt-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-green-500"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-700">
                            Your payment was successful!
                          </h3>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

CreditOptionForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};
