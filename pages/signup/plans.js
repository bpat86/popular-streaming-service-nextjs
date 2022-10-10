import { useContext } from "react";
import Stripe from "stripe";

import { withSessionSsr } from "@/middleware/withSession";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import { PlansForm } from "@/components/forms/PlansForm";
import AuthContext from "@/context/AuthContext";

const Plans = (props) => {
  // Destructure our page props
  const { user, isLoggedIn, isRegistered } = props;
  // Get the register function from Auth context
  const { loading, registrationStepThree } = useContext(AuthContext);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="flex flex-col items-center w-full md:max-w-md mx-auto px-4 slide-in">
          <img
            className="mx-auto h-14 w-auto mb-5"
            src="/images/auth/checkmark.png"
            alt="Devices"
          />
          <h2 className="text-sm text-gray-800 font-normal tracking-wide uppercase text-center pb-1">
            Step <span className="font-bold">2</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-gray-800 text-2xl sm:text-2xl font-bold text-center tracking-wide">
            Choose your plan.
          </p>
          <div className="flex flex-col items-center px-0 sm:px-4">
            <dl className="w-full mt-4 mx-auto">
              <div className="relative my-3">
                <dt>
                  <svg
                    className="absolute h-7 w-7 text-netflix-red"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </dt>
                <dd className="ml-10 text-lg text-gray-700">
                  No commitments, cancel anytime.
                </dd>
              </div>
              <div className="relative mb-3">
                <dt>
                  <svg
                    className="absolute h-7 w-7 text-netflix-red"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </dt>
                <dd className="ml-10 text-lg text-gray-700">
                  Everything on Netflix for one low price.
                </dd>
              </div>
              <div className="relative my-3">
                <dt>
                  <svg
                    className="absolute h-7 w-7 text-netflix-red"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </dt>
                <dd className="ml-10 text-lg text-gray-700">
                  Unlimited viewing on all your devices.
                </dd>
              </div>
            </dl>
          </div>
          <PlansForm
            user={user}
            loading={loading}
            registrationStepThree={registrationStepThree}
          />
        </div>
      </RegistrationLayout>
    </>
  );
};

export default Plans;

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

  // Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SK, {
    apiVersion: "2020-08-27",
  });

  let customer = null;

  // Add current user session token to Stripe
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
      user,
      customer,
      isLoggedIn,
      isRegistered,
    },
  };
});
