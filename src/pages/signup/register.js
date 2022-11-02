import { useContext, useEffect, useState } from "react";

import { RegisterForm } from "@/components/forms/RegisterForm";
import RegistrationLayout from "@/components/layouts/RegistrationLayout";
import AuthContext from "@/context/AuthContext";
import { withSessionSsr } from "@/middleware/withSession";
import { parseCookies } from "@/utils/parseCookies";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RegistrationLayout title="Sign up for Netflix" {...props}>
        <div className="slide-in mx-auto flex w-full flex-col items-start md:max-w-md">
          <h2 className="pb-1 text-sm font-normal uppercase tracking-wide text-gray-800">
            Step <span className="font-bold">1</span> of{" "}
            <span className="font-bold">3</span>
          </h2>
          <p className="block text-xl font-bold tracking-wide text-gray-800 sm:text-2xl">
            Create a password to start your membership
          </p>
          <p className="block pt-3 pb-4 text-lg leading-snug text-gray-800">
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

export const getServerSideProps = withSessionSsr(async ({ req }) => {
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
