import axios from "axios";
import Image from "next/image";
import { useContext } from "react";
import Stripe from "stripe";

import { PaymentsForm } from "@/components/forms/PaymentsForm";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

import { API_URL } from "@/config/index";

const Payment = (props) => {
  // Destructure the page props
  const { user, stripeCustomerId, stripeSubscriptionId, initialClientSecret } =
    props;
  // Get the register function from the Auth context
  const { createOrder, registrationStepFive } = useContext(AuthContext);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="slide-in mx-auto flex w-full flex-col items-center md:max-w-xl">
          <div className="relative mx-auto mb-10 h-14 w-full">
            <Image
              priority
              layout="fill"
              objectFit="contain"
              src="/images/auth/lock.png"
              alt="Devices"
            />
          </div>
          <h2 className="pb-1 text-center text-sm font-normal uppercase tracking-wide text-gray-800">
            Step <span className="font-bold">3</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-center text-2xl font-bold tracking-wide text-gray-800 sm:text-2xl">
            Set up your payment
          </p>
          <p className="block w-full py-6 px-10 text-center text-lg leading-snug text-gray-800 sm:max-w-sm">
            Your membership starts as soon as you set up payment.
          </p>
          <p className="mb-5 flex flex-col py-2 px-10 text-center text-lg leading-snug text-gray-800">
            <span className="font-bold">No commitments.</span>
            <span className="font-bold">Cancel online anytime.</span>
          </p>
          <PaymentsForm
            userData={user}
            createOrder={createOrder}
            registrationStepFive={registrationStepFive}
            stripeCustomerId={stripeCustomerId}
            initialClientSecret={initialClientSecret}
            stripeSubscriptionId={stripeSubscriptionId}
          />
        </div>
      </RegistrationLayout>
    </>
  );
};

export default Payment;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Redirect authenticated and registered users to the browse page
  if (!isLoggedIn && !isRegistered) {
    return {
      notFound: true,
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
    const initialClientSecret = cookies.clientSecret || "";
    // Set the selected plan
    const selectedPlan = user?.plan?.id || "";
    // Get stripe customer info
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
    if (isLoggedIn && userData.role.type === "subscribed") {
      return {
        redirect: { destination: "/browse", permanent: false },
        props: { user: populatedUserData, isLoggedIn, isRegistered },
      };
    }

    // Update user's session
    req.session.user = populatedUserData;
    await req.session.save();

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
