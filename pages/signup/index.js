import { useContext } from "react";
import Stripe from "stripe";

import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import { SignUpForm } from "@/components/forms/SignUpForm";

export const SignUp = (props) => {
  // Bring in the what we need from our Auth context
  const { registrationStepOne } = useContext(AuthContext);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="flex flex-col items-center w-full md:max-w-md mx-auto px-4 slide-in">
          <img
            className="mx-auto h-16 w-auto mb-10"
            src="/images/auth/devices.png"
            alt="Devices"
          />
          <h2 className="text-sm text-gray-800 font-normal tracking-wide uppercase text-center pb-1">
            Step <span className="font-bold">1</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-gray-800 text-2xl sm:text-2xl font-bold text-center tracking-wide">
            Finish setting up your account.
          </p>
          <p className="block text-gray-800 text-lg leading-snug text-center pt-3 pb-2 px-10">
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

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
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
