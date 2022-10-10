import { useState, useContext, useEffect } from "react";
import Stripe from "stripe";
import axios from "axios";

import { API_URL } from "@/config/index";
import { withSessionSsr } from "@/middleware/withSession";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { CreditOptionForm } from "@/components/forms/CreditOptionForm";
import { parseCookies } from "@/utils/parseCookies";

const CreditOption = (props) => {
  // Destructure the page props
  const { user, stripeCustomerId, initialClientSecret, stripeSubscriptionId } =
    props;
  // Get what we need from the Auth context
  const { loading, registrationCompleted, error, resetErrors } =
    useContext(AuthContext);
  // Set the initial form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    resetErrors();
  }, []);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="flex flex-col items-start w-full md:max-w-lg mx-auto slide-in">
          <h2 className="text-sm text-gray-800 font-normal tracking-wide uppercase text-center pb-2">
            Step <span className="font-bold">3</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-gray-800 text-2xl sm:text-2xl font-bold text-center tracking-wide">
            Set up your credit or debit card
          </p>
          <span className="flex flex-row space-x-2 my-3">
            <img
              className="w-auto h-5 sm:h-6"
              src="/images/auth/visa.svg"
              alt="Visa"
            />
            <img
              className="w-auto h-5 sm:h-6 ml-2"
              src="/images/auth/mastercard.svg"
              alt="Visa"
            />
            <img
              className="w-auto h-5 sm:h-6 ml-2"
              src="/images/auth/amex.svg"
              alt="Visa"
            />
          </span>
          <CreditOptionForm
            loading={loading}
            userData={user}
            strapiError={error}
            formData={formData}
            setFormData={setFormData}
            registrationCompleted={registrationCompleted}
            stripeCustomerId={stripeCustomerId}
            stripeSubscriptionId={stripeSubscriptionId}
            initialClientSecret={initialClientSecret}
          />
        </div>
      </RegistrationLayout>
    </>
  );
};

export default CreditOption;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Redirect authenticated and registered users to the browse page
  if (!isLoggedIn) {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  // `Bearer` token must be included in authorization headers for Strapi requests
  const config = {
    headers: { Authorization: `Bearer ${user?.strapiToken}` },
  };
  // Define the Strapi `get logged in user` api url
  const isLoggedInUrl = `${API_URL}/api/users/me?populate=%2A`;
  // Send the request to our backend
  const strapiResponse = await axios.get(isLoggedInUrl, config);
  // If an authenticated user exists, we'll receive the user object from the response
  const userData = await strapiResponse.data;

  // If Strapi response is successful, send props to the frontend
  if (strapiResponse.status === 200) {
    // Complete user data
    const populatedUserData = { ...user, ...userData };

    // Get the `email` cookie if it exists
    const cookies = parseCookies(req);
    const initialEmailValue = cookies.email || "";

    // Set the selected plan
    const selectedPlan = user?.plan?.id || "";

    // Get cookies if they exist
    const initialClientSecret = cookies.clientSecret || "";
    const stripeCustomerId = user?.stripeCustomerId || "";
    const stripeSubscriptionId = user?.stripeSubscriptionId || "";

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SK, {
      apiVersion: "2020-08-27",
    });

    // Add current user session token to Stripe
    let customer = null;
    if (!customer && user?.stripeCustomerId && isLoggedIn) {
      customer = await stripe.customers.update(user?.stripeCustomerId, {
        metadata: {
          token: user?.strapiToken,
        },
      });
    }

    // Redirect authenticated and registered users to the browse page
    if (isLoggedIn && isRegistered) {
      return {
        redirect: { destination: "/browse", permanent: false },
        props: { user, isLoggedIn, isRegistered },
      };
    }
    // Send props to the frontend
    return {
      props: {
        user: populatedUserData,
        customer,
        isLoggedIn,
        isRegistered,
        initialEmailValue,
        selectedPlan,
        initialClientSecret,
        stripeCustomerId,
        stripeSubscriptionId,
      },
    };
  }
});
