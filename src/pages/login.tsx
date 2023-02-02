import Link from "next/link";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";

import { AuthContextType } from "@/@types/auth";
import LoginForm from "@/components/forms/LoginForm";
import HomeLayout from "@/components/layouts/HomeLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

type LoginProps = {
  initialEmailValue: string;
  isLoggedIn: boolean;
};

const Login = ({ isLoggedIn, initialEmailValue }: LoginProps) => {
  const [formData, setFormData] = useState<object>({
    email: initialEmailValue,
    password: "",
  });
  const { loading, login, error, resetErrors } = useContext(
    AuthContext
  ) as AuthContextType;

  useEffect(() => {
    resetErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <HomeLayout title="Sign in to Netflix">
          <div className="mx-auto w-full rounded bg-black bg-opacity-75 p-16 backdrop-blur-sm md:max-w-md">
            <h2 className="mb-6 block text-2xl font-bold text-zinc-50 sm:text-3xl xl:text-4xl">
              Sign In
            </h2>
            <LoginForm
              loading={loading}
              formData={formData}
              setFormData={setFormData}
              login={login}
              strapiError={error}
            />
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" />
                </div>
                <div className="relative flex justify-start text-base">
                  <span className="text-zinc-500">
                    New to Netflix?{" "}
                    <Link href="/" legacyBehavior>
                      <a className="ml-1 font-semibold text-white hover:underline">
                        Sign up now
                      </a>
                    </Link>
                    .
                  </span>
                </div>
                <div className="relative mt-4 flex justify-start text-sm">
                  <span className="text-zinc-500">
                    This page is protected by Google reCAPTCHA to ensure you're
                    not a bot.{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline focus:outline-none"
                    >
                      Learn more
                    </button>
                    .
                  </span>
                </div>
              </div>
            </div>
          </div>
        </HomeLayout>
      ) : (
        <>
          <HomeLayout title="Something went wrong">
            <div className="mx-auto w-full rounded bg-black bg-opacity-75 p-16 md:max-w-md">
              <h2 className="mb-6 block text-2xl font-bold text-zinc-50 sm:text-3xl xl:text-4xl">
                Something went wrong.
              </h2>
            </div>
          </HomeLayout>
        </>
      )}
    </>
  );
};

export default Login;

// Login.getInitialProps = ({ req }) => {
//   const cookies = parseCookies(req);

//   return { initialEmailValue: cookies.email || "" };
// };

export const getServerSideProps = withSessionSsr(async function ({ req }) {
  // Get the `user` session if it exists and set a couple helper variables
  const user = req.session.user || null;
  const isLoggedIn = user?.isLoggedIn || false;
  const isRegistered = user?.registrationComplete || false;

  // Get the `email` cookie if it exists
  const cookies = parseCookies(req);
  const initialEmailValue = cookies.email || "";

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
      isLoggedIn,
      isRegistered,
      initialEmailValue,
    },
  };
});

Login.propTypes = {
  user: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    isRegistered: PropTypes.bool,
  }),
};
