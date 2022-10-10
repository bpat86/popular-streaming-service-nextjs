import { Formik, Form } from "formik";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const ChoosePlanForm = (props) => {
  // Destructure the props
  const { formData, registrationStepFour } = props;
  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={async () => {
          await sleep(250);
          registrationStepFour(formData);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex items-center justify-center w-full mt-12">
            {isSubmitting ? (
              <button
                type="submit"
                className="flex items-center justify-center w-full sm:w-2/5 rounded-sm py-3 h-14 text-base font-semibold tracking-wide text-white text-center bg-red-800 bg-opacity-80 focus:outline-none transition ease-out duration-700"
              >
                Processing
                <svg
                  className="motion-safe:animate-spin ml-2 -mr-1 h-5 w-5 text-white"
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
                className="flex items-center justify-center w-full sm:w-2/5 rounded-sm py-3 h-14 text-base font-semibold tracking-wide text-white text-center bg-netflix-red hover:bg-netflix-red-light focus:outline-none transition ease-out duration-700"
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
