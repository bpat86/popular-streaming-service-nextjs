import { useState } from "react";
import Head from "next/head";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AuthNavigation from "@/components/navigation/AuthNavigation";
import Footer from "../registration/Footer";

const RegistrationLayout = (props) => {
  // Destructure the props
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <main className="flex flex-col item-center justify-center w-full min-h-screen overflow-hidden relative z-0">
            <div className="header-container flex flex-col w-full z-10">
              <div className="flex flex-wrap items-center justify-center h-full">
                <div className="flex flex-col items-center justify-start md:justify-center w-full max-w-screen-xl mx-auto my-32 px-6 text-base sm:text-lg md:text-2xl text-shadow font-normal text-gray-100">
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
