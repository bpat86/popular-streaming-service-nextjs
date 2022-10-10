import { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";

import { withSessionSsr } from "@/middleware/withSession";
import HomeLayout from "@/components/layouts/HomeLayout";
import AuthContext from "@/context/AuthContext";
import { parseCookies } from "@/utils/parseCookies";
import { LoginForm } from "@/components/forms/LoginForm";

const Login = (props) => {
  // Destructure page props
  const { isLoggedIn, initialEmailValue } = props;
  // Initial form state
  const [formData, setFormData] = useState({
    email: initialEmailValue,
    password: "",
  });
  // Bring in the necessary functions from our Auth context
  const { loading, login, error, resetErrors } = useContext(AuthContext);

  useEffect(() => {
    resetErrors();
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <HomeLayout title="Sign in to Netflix">
          <div className="bg-black bg-opacity-75 w-full md:max-w-md mx-auto p-16 rounded">
            <h2 className="block text-gray-50 text-2xl font-bold sm:text-3xl xl:text-4xl mb-6">
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
                  <span className="text-gray-500">
                    New to Netflix?{" "}
                    <Link href="/">
                      <a className="font-semibold text-white hover:underline ml-1">
                        Sign up now
                      </a>
                    </Link>
                    .
                  </span>
                </div>
                <div className="relative flex justify-start text-sm mt-4">
                  <span className="text-gray-500">
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
            <div className="bg-black bg-opacity-75 w-full md:max-w-md mx-auto p-16 rounded">
              <h2 className="block text-gray-50 text-2xl font-bold sm:text-3xl xl:text-4xl mb-6">
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

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {
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
