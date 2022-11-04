import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Head from "next/head";
import { useState } from "react";

import AuthNavigation from "@/components/navigation/AuthNavigation";

import Footer from "../registration/Footer";

const RegistrationLayout = (props) => {
  const { title, children } = props;

  // const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PK}`);
  const [stripePromise, setStripePromise] = useState(() =>
    loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PK}`)
  );

  return (
    <>
      <Elements stripe={stripePromise}>
        <Head>
          <title>{title}</title>
          <link rel="shortcut icon" href="/netflix.ico" />
        </Head>
        <AuthNavigation {...props} />
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
          <main className="item-center relative z-0 flex min-h-screen w-full flex-col justify-center overflow-hidden">
            <div className="header-container z-10 flex w-full flex-col">
              <div className="flex h-full flex-wrap items-center justify-center">
                <div className="text-shadow mx-auto my-32 flex w-full max-w-screen-xl flex-col items-center justify-start px-6 text-base font-normal text-gray-100 sm:text-lg md:justify-center md:text-2xl">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </Elements>
    </>
  );
};

export default RegistrationLayout;
