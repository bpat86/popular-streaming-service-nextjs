import { Form, Formik } from "formik";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const SignUpForm = (props) => {
  // Destructure the props
  const { registrationStepOne } = props;
  return (
    <>
      <Formik
        initialValues={{}}
        onSubmit={async () => {
          await sleep(250);
          registrationStepOne();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full">
            {isSubmitting ? (
              <button
                disabled={isSubmitting}
                type="submit"
                className="mt-4 flex h-14 w-full items-center justify-center rounded-sm bg-red-800 bg-opacity-80 py-3 px-4 text-base font-semibold tracking-wide text-white transition duration-700 ease-out focus:outline-none"
              >
                Processing
                <svg
                  className="ml-2 -mr-1 h-5 w-5 text-white motion-safe:animate-spin"
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
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                type="submit"
                className="mt-4 flex h-14 w-full items-center justify-center rounded-sm bg-netflix-red py-3 px-4 text-base font-semibold tracking-wide text-white transition duration-700 ease-out hover:bg-netflix-red-light focus:outline-none"
              >
                Continue
              </button>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};
