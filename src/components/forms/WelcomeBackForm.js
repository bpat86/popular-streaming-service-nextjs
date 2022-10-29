import { Form, Formik } from "formik";
import { useContext } from "react";

import AuthContext from "@/context/AuthContext";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const WelcomeBackForm = (props) => {
  // Destructure the props
  const { user } = props;
  const { redirectUser } = useContext(AuthContext);
  return (
    <>
      <Formik
        initialValues={{}}
        onSubmit={async () => {
          await sleep(500);
          redirectUser(user);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="mt-8 h-20 sm:flex">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`mx-auto mt-6 flex h-14 w-full items-center justify-center rounded-sm px-6 py-2 text-2xl font-semibold tracking-wide text-white ring-0 transition duration-700 ease-out focus:outline-none sm:mt-8 sm:h-16 sm:w-1/2 sm:py-4 ${
                isSubmitting
                  ? "bg-red-800 bg-opacity-80"
                  : "bg-netflix-red hover:bg-netflix-red-light focus:bg-red-700 focus:ring-2 focus:ring-red-900"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="ml-auto">Finish Sign Up</span>
                  <svg
                    className="ml-auto h-5 w-5 motion-safe:animate-spin sm:h-7 sm:w-7"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                <>
                  <span className="ml-auto">Finish Sign Up</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-auto h-6 w-6 sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};
