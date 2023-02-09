import Image from "next/image";
import { useContext } from "react";
import Stripe from "stripe";

import { SignUpForm } from "@/components/forms/SignUpForm";
import RegistrationLayout from "@/components/pages/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";

export const SignUp = (props) => {
  // Bring in the what we need from our Auth context
  const { registrationStepOne } = useContext(AuthContext);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="slide-in mx-auto flex w-full flex-col items-center px-4 md:max-w-md">
          <div className="relative mx-auto mb-10 h-16 w-full">
            <Image fill src="/images/auth/devices.png" alt="Devices" />
          </div>
          <h2 className="pb-1 text-center text-sm font-normal uppercase tracking-wide text-zinc-800">
            Step <span className="font-bold">1</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-center text-2xl font-bold tracking-wide text-zinc-800 sm:text-2xl">
            Finish setting up your account.
          </p>
          <p className="block px-10 pt-3 pb-2 text-center text-lg leading-snug text-zinc-800">
            Netflix is personalized for you. Create a password to watch Netflix
            on any device at any time.
          </p>
          <SignUpForm registrationStepOne={registrationStepOne} />
        </div>
      </RegistrationLayout>
    </>
  );
};

export default SignUp;

export const getServerSideProps = withSessionSsr(async ({ req }) => {
  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

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
