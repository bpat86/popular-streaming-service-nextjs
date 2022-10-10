import { useContext } from "react";
import Stripe from "stripe";
import axios from "axios";

import { API_URL } from "@/config/index";
import { withSessionSsr } from "@/middleware/withSession";
import AuthContext from "@/context/AuthContext";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import { PaymentsForm } from "@/components/forms/PaymentsForm";
import { parseCookies } from "@/utils/parseCookies";

const Payment = (props) => {
  // Destructure the page props
  const { user, stripeCustomerId, stripeSubscriptionId, initialClientSecret } =
    props;
  // Get the register function from the Auth context
  const { createOrder, registrationStepFive } = useContext(AuthContext);

  console.log("payment page user: ", user);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="flex flex-col items-center w-full md:max-w-xl mx-auto slide-in">
          <img
            className="mx-auto h-14 w-auto mb-10"
            src="/images/auth/lock.png"
            alt="Devices"
          />
          <h2 className="text-sm text-gray-800 font-normal tracking-wide uppercase text-center pb-1">
            Step <span className="font-bold">3</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-gray-800 text-2xl sm:text-2xl font-bold text-center tracking-wide">
            Set up your payment
          </p>
          <p className="block w-full sm:max-w-sm text-gray-800 text-lg leading-snug text-center py-6 px-10">
            Your membership starts as soon as you set up payment.
          </p>
          <p className="flex flex-col text-gray-800 text-lg leading-snug text-center mb-5 py-2 px-10">
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
