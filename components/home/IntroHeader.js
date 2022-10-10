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
      <div className="w-full md:max-w-3xl mx-auto text-center">
        {isLoggedIn ? (
          <>
            <span className="block text-white text-2xl sm:text-3xl font-medium mb-4 ">
              Welcome Back!
            </span>
            <h2>
              <span className="block text-gray-50 text-5xl font-extrabold sm:text-6xl">
                Unlimited movies, TV shows, and more.
              </span>
              <span className="block text-white text-xl sm:text-2xl font-semibold mt-4">
                Watch anywhere. Cancel anytime.
              </span>
            </h2>
            <WelcomeBackForm user={user} />
          </>
        ) : (
          <>
            <h2>
              <span className="block text-gray-50 text-5xl font-extrabold sm:text-6xl">
                Unlimited movies, TV shows, and more.
              </span>
              <span className="mt-4 block text-white text-xl sm:text-2xl font-semibold">
                Watch anywhere. Cancel anytime.
              </span>
            </h2>
            <p className="text-white mt-6 text-xl lg:text-xl">
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
