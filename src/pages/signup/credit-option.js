import axios from "axios";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Stripe from "stripe";

import { CreditOptionForm } from "@/components/forms/CreditOptionForm";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

import { API_URL } from "@/config/index";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="slide-in mx-auto flex w-full flex-col items-start md:max-w-lg">
          <h2 className="pb-2 text-center text-sm font-normal uppercase tracking-wide text-gray-800">
            Step <span className="font-bold">3</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-center text-2xl font-bold tracking-wide text-gray-800 sm:text-2xl">
            Set up your credit or debit card
          </p>
          <span className="relative my-3 flex h-5 w-full flex-row space-x-2 sm:h-6">
            <span className="relative h-5 w-10 sm:h-6">
              <Image
                layout="fill"
                objectFit="contain"
                src="/images/auth/visa.svg"
                alt="Visa"
              />
            </span>
            <span className="relative ml-2 h-5 w-10 sm:h-6">
              <Image
                layout="fill"
                objectFit="contain"
                src="/images/auth/mastercard.svg"
                alt="Visa"
              />
            </span>
            <span className="relative ml-2 h-5 w-10 sm:h-6">
              <Image
                layout="fill"
                objectFit="contain"
                src="/images/auth/amex.svg"
                alt="Visa"
              />
            </span>
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

export const getServerSideProps = withSessionSsr(async ({ req }) => {
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
