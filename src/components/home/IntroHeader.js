import { useState } from "react";

import HomeLayout from "@/components/layouts/HomeLayout";

import { GetStartedForm } from "../forms/GetStartedForm";
import { WelcomeBackForm } from "../forms/WelcomeBackForm";

const Intro = (props) => {
  // Destructure page props
  const { user, isLoggedIn, initialEmailValue } = props;
  // Initial form state
  const [formData, setFormData] = useState({
    email: initialEmailValue,
  });

  return (
    <HomeLayout
      {...props}
      title="Netflix - Watch TV Shows Online, Watch Movies Online"
      minHeight="min-h-screen-3/4"
    >
      <div className="mx-auto w-full text-center md:max-w-3xl">
        {isLoggedIn ? (
          <>
            <span className="mb-4 block text-2xl font-medium text-white sm:text-3xl ">
              Welcome Back!
            </span>
            <h2>
              <span className="block text-5xl font-extrabold text-gray-50 sm:text-6xl">
                Unlimited movies, TV shows, and more.
              </span>
              <span className="mt-4 block text-xl font-semibold text-white sm:text-2xl">
                Watch anywhere. Cancel anytime.
              </span>
            </h2>
            <WelcomeBackForm user={user} />
          </>
        ) : (
          <>
            <h2>
              <span className="block text-5xl font-extrabold text-gray-50 sm:text-6xl">
                Unlimited movies, TV shows, and more.
              </span>
              <span className="mt-4 block text-xl font-semibold text-white sm:text-2xl">
                Watch anywhere. Cancel anytime.
              </span>
            </h2>
            <p className="mt-6 text-xl text-white lg:text-xl">
              Ready to watch? Enter your email to create or restart your
              membership.
            </p>
            <GetStartedForm formData={formData} setFormData={setFormData} />
          </>
        )}
      </div>
    </HomeLayout>
  );
};

export default Intro;
