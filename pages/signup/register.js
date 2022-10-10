import { useState, useContext, useEffect } from "react";

import { withSessionSsr } from "@/middleware/withSession";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { parseCookies } from "@/utils/parseCookies";
import { RegisterForm } from "@/components/forms/RegisterForm";

const Register = (props) => {
  // Destructure the email cookie value from our page props
  const { initialEmailValue } = props;
  // Bring in the what we need from our Auth context
  const { loading, registrationStepTwo, error, resetErrors } =
    useContext(AuthContext);
  // Set the initial form state
  const [formData, setFormData] = useState({
    email: initialEmailValue,
    password: "",
  });

  useEffect(() => {
    resetErrors();
  }, []);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="flex flex-col items-start w-full md:max-w-md mx-auto slide-in">
          <h2 className="text-sm text-gray-800 font-normal tracking-wide uppercase pb-1">
            Step <span className="font-bold">1</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-gray-800 text-xl sm:text-2xl font-bold tracking-wide">
            Create a password to start your membership
          </p>
          <p className="block text-gray-800 text-lg leading-snug pt-3 pb-4">
            Just a few more steps and you're done! We hate paperwork, too.
          </p>
          <RegisterForm
            loading={loading}
            strapiError={error}
            formData={formData}
            setFormData={setFormData}
            initialEmailValue={initialEmailValue}
            registrationStepTwo={registrationStepTwo}
          />
        </div>
      </RegistrationLayout>
    </>
  );
};

export default Register;

export const getServerSideProps = withSessionSsr(async ({ req, res }) => {
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
