import { useContext } from "react";
import { Formik, Form } from "formik";
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
          <Form className="mt-8 sm:flex h-20">
            <button
              disabled={isSubmitting}
              type="submit"
              className={`w-full sm:w-1/2 flex items-center justify-center px-6 py-2 sm:py-4 h-14 sm:h-16 mx-auto mt-6 sm:mt-8 text-2xl tracking-wide font-semibold text-white focus:outline-none ring-0 rounded-sm transition ease-out duration-700 ${
                isSubmitting
                  ? "bg-red-800 bg-opacity-80"
                  : "bg-netflix-red hover:bg-netflix-red-light focus:bg-red-700 focus:ring-red-900 focus:ring-2"
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="ml-auto">Finish Sign Up</span>
                  <svg
                    className="motion-safe:animate-spin w-5 h-5 sm:w-7 sm:h-7 ml-auto"
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
                    className="w-6 h-6 sm:w-7 sm:h-7 ml-auto"
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
