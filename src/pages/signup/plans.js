import Image from "next/image";
import { useContext } from "react";
import Stripe from "stripe";

import { PlansForm } from "@/components/forms/PlansForm";
import RegistrationLayout from "@/components/pages/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";

const Plans = (props) => {
  const { user } = props;
  // Get the register function from Auth context
  const { loading, registrationStepThree } = useContext(AuthContext);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="slide-in mx-auto flex w-full flex-col items-center px-4 md:max-w-md">
          <div className="relative mx-auto mb-5 h-14 w-full">
            <Image
              fill
              priority
              src="/images/auth/checkmark.png"
              alt="Devices"
            />
          </div>
          <h2 className="pb-1 text-center text-sm font-normal uppercase tracking-wide text-zinc-800">
            Step <span className="font-bold">2</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-center text-2xl font-bold tracking-wide text-zinc-800 sm:text-2xl">
            Choose your plan.
          </p>
          <div className="flex flex-col items-center px-0 sm:px-4">
            <dl className="mx-auto mt-4 w-full">
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
                <dd className="ml-10 text-lg text-zinc-700">
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
                <dd className="ml-10 text-lg text-zinc-700">
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
                <dd className="ml-10 text-lg text-zinc-700">
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
